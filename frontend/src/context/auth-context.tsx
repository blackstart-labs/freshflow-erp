"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "@/lib/api";
import type { RestaurantTier, User, UserRole } from "@/types";

export interface AuthUser extends User {
  restaurant_id?: number;
  tier?: RestaurantTier;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  phone_number?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    username: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    payload: RegisterPayload,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACCESS_TOKEN_KEY = "freshflow_access_token";
const REFRESH_TOKEN_KEY = "freshflow_refresh_token";
const USER_KEY = "freshflow_user";
const COOKIE_NAME = "freshflow_session";

function setSessionCookie(token: string) {
  if (typeof document !== "undefined") {
    // 30 min expiration matching access token
    document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=1800; SameSite=Lax`;
  }
}

function clearSessionCookie() {
  if (typeof document !== "undefined") {
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user & token on initial mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_KEY);
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
        setSessionCookie(token);
      } else {
        setUser(null);
        clearSessionCookie();
      }
    } catch {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      clearSessionCookie();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    async (
      username: string,
      password: string,
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const response = await api.post("/auth/token/", {
          username: username.trim(),
          password,
        });

        const { access, refresh, user: userData } = response.data;

        localStorage.setItem(ACCESS_TOKEN_KEY, access);
        localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        setSessionCookie(access);

        setUser(userData);
        return { success: true };
      } catch (err: unknown) {
        let message =
          "Invalid username or password. Please verify your credentials.";
        if (typeof err === "object" && err !== null && "response" in err) {
          const resp = (
            err as { response?: { data?: Record<string, unknown> } }
          ).response;
          if (resp?.data) {
            if (typeof resp.data.detail === "string") {
              message = resp.data.detail;
            } else if (resp.data.non_field_errors) {
              message = Array.isArray(resp.data.non_field_errors)
                ? (resp.data.non_field_errors[0] as string)
                : String(resp.data.non_field_errors);
            }
          }
        }
        return { success: false, error: message };
      }
    },
    [],
  );

  const register = useCallback(
    async (
      payload: RegisterPayload,
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        await api.post("/auth/register/", {
          username: payload.username.trim(),
          email: payload.email.trim(),
          password: payload.password,
          phone_number: payload.phone_number?.trim() || "",
        });

        // Automatically log in following successful account creation
        return await login(payload.username, payload.password);
      } catch (err: unknown) {
        let message = "Registration failed. Please check your information.";
        if (typeof err === "object" && err !== null && "response" in err) {
          const resp = (
            err as { response?: { data?: Record<string, unknown> } }
          ).response;
          if (resp?.data) {
            const firstKey = Object.keys(resp.data)[0];
            const val = resp.data[firstKey];
            if (Array.isArray(val)) {
              message = `${firstKey}: ${val[0]}`;
            } else if (typeof val === "string") {
              message = `${firstKey}: ${val}`;
            }
          }
        }
        return { success: false, error: message };
      }
    },
    [login],
  );

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (refreshToken) {
      try {
        await api.post("/auth/token/blacklist/", { refresh: refreshToken });
      } catch {
        // Continue clearing even if server is unreachable
      }
    }

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    clearSessionCookie();
    setUser(null);
    router.push("/login");
  }, [router]);

  const refreshProfile = useCallback(async () => {
    try {
      const response = await api.get<AuthUser>("/auth/profile/");
      setUser(response.data);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data));
    } catch {
      // Ignore if unauthenticated
    }
  }, []);

  const hasRole = useCallback(
    (roles: UserRole | UserRole[]): boolean => {
      if (!user) return false;
      if (Array.isArray(roles)) {
        return roles.includes(user.role);
      }
      return user.role === roles;
    },
    [user],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
