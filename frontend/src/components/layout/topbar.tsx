"use client";

import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  Search,
  ShieldCheck,
  Sun,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/auth-context";

interface TopbarProps {
  onMenuClick?: () => void;
}

const ROLE_DISPLAY_NAMES: Record<string, string> = {
  ADMIN: "Administrator",
  WAREHOUSE_MANAGER: "Warehouse Manager",
  SALES_AGENT: "Sales Agent",
  RESTAURANT_CLIENT: "Restaurant Client",
};

const ROLE_BADGE_COLORS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  ADMIN: {
    bg: "bg-purple-50 dark:bg-purple-950/40",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-900/60",
  },
  WAREHOUSE_MANAGER: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-900/60",
  },
  SALES_AGENT: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-900/60",
  },
  RESTAURANT_CLIENT: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-900/60",
  },
};

export function Topbar({ onMenuClick }: TopbarProps) {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    if (saved) {
      setTheme(saved);
      if (saved === "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.style.colorScheme = "dark";
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.style.colorScheme = "light";
      }
    }
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    }

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isProfileOpen]);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setIsProfileOpen(false);
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Derive dynamic name and initials
  const firstName = user?.first_name?.trim();
  const lastName = user?.last_name?.trim();
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const displayName = fullName || user?.username || "Authenticated User";

  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (displayName) {
      const parts = displayName.trim().split(/\s+/);
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return displayName.slice(0, 2).toUpperCase();
    }
    return "FF";
  };

  const initials = getInitials();
  const roleName = user?.role
    ? ROLE_DISPLAY_NAMES[user.role] || user.role
    : "Staff";
  const roleColors = user?.role
    ? ROLE_BADGE_COLORS[user.role] || ROLE_BADGE_COLORS.WAREHOUSE_MANAGER
    : ROLE_BADGE_COLORS.WAREHOUSE_MANAGER;

  return (
    <header className="h-14 border-b border-slate-200/80 bg-white px-3 sm:px-4 flex items-center justify-between dark:border-[#1b2b24] dark:bg-[#0e1512] shrink-0 sticky top-0 z-30 transition-colors duration-200">
      {/* Left: Mobile Menu Toggle + Search */}
      <div className="flex items-center gap-2 flex-1 max-w-md">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 -ml-1 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-[#161a24] transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu size={18} />
        </button>

        {/* Search Input with ⌘K Badge */}
        <div className="relative flex items-center flex-1">
          <Search
            size={15}
            className="absolute left-2.5 text-slate-400 dark:text-slate-500"
          />
          <input
            type="text"
            placeholder="Search batches, items, restaurants..."
            className="h-8 w-full rounded-md border border-slate-200 bg-slate-50/70 pl-8 pr-12 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-[#1b2b24] dark:bg-[#121c17] dark:text-slate-200 dark:placeholder:text-slate-500"
          />
          <kbd className="hidden sm:inline-flex absolute right-2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 border border-slate-200 rounded bg-white shadow-2xs dark:border-[#1b2b24] dark:bg-[#16231d] dark:text-slate-400">
            ⌘ K
          </kbd>
        </div>
      </div>

      {/* Right User & Notification Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Switch Button */}
        <button
          onClick={toggleTheme}
          className="size-8 flex items-center justify-center rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-[#141f1a] transition-colors"
          aria-label={
            theme === "light" ? "Switch to dark theme" : "Switch to light theme"
          }
          title={
            theme === "light" ? "Switch to dark theme" : "Switch to light theme"
          }
        >
          {theme === "light" ? (
            <Moon
              size={16}
              className="text-slate-600 hover:text-slate-900 transition-transform duration-200 hover:-rotate-12"
            />
          ) : (
            <Sun
              size={16}
              className="text-amber-400 hover:text-amber-300 transition-transform duration-200 hover:rotate-45"
            />
          )}
        </button>

        {/* Notification Bell with indicator */}
        <button
          className="relative size-8 flex items-center justify-center rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-[#141f1a] transition-colors"
          aria-label="Notifications"
        >
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#0e1512]" />
        </button>

        {/* Vertical divider */}
        <span className="h-5 w-px bg-slate-200 dark:bg-[#1b2b24]" />

        {/* User profile dropdown container */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            aria-expanded={isProfileOpen}
            aria-haspopup="true"
            className="flex items-center gap-2.5 pl-1 py-1 pr-1.5 rounded-lg hover:bg-slate-100/80 dark:hover:bg-[#141f1a] transition-colors text-left group focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <div className="size-8 rounded-full bg-[#063c35] text-white flex items-center justify-center text-xs font-semibold tracking-tight shadow-xs ring-1 ring-emerald-700/20">
              {initials}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                {displayName}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-none mt-0.5">
                {roleName}
              </div>
            </div>
            <ChevronDown
              size={14}
              className={`text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300 transition-transform duration-150 ml-0.5 ${
                isProfileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Interactive User Dropdown Menu */}
          {isProfileOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-slate-200/90 bg-white p-2 shadow-xl dark:border-[#1b2b24] dark:bg-[#121c17] z-50 animate-in fade-in-50 zoom-in-95 duration-150"
              role="menu"
              aria-orientation="vertical"
            >
              {/* User Identity Header */}
              <div className="px-3 py-2.5 rounded-lg bg-slate-50/80 dark:bg-[#16231d]/60 border border-slate-100 dark:border-[#1b2b24]/80">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 rounded-full bg-[#063c35] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {initials}
                  </div>
                  <div className="overflow-hidden min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {displayName}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {user?.email || `@${user?.username}`}
                    </p>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-[#1b2b24]">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${roleColors.bg} ${roleColors.text} ${roleColors.border}`}
                  >
                    {roleName}
                  </span>
                  {user?.tier && (
                    <span className="text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      Tier: {user.tier}
                    </span>
                  )}
                </div>
              </div>

              {/* Menu items */}
              <div className="py-1">
                <div className="px-3 py-1.5 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <ShieldCheck
                    size={14}
                    className="text-emerald-600 dark:text-emerald-400 shrink-0"
                  />
                  <span>Session Active • SimpleJWT</span>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-[#1b2b24] my-1" />

              {/* Sign Out Action */}
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50/80 dark:text-rose-400 dark:hover:text-rose-300 dark:hover:bg-rose-950/40 transition-colors disabled:opacity-50 text-left"
                role="menuitem"
              >
                <LogOut size={15} className="shrink-0" />
                <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
