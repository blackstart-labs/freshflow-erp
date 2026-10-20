"use client";

import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Eye,
  EyeOff,
  Leaf,
  Lock,
  Package,
  Shield,
  Snowflake,
  User as UserIcon,
  Users,
  Utensils,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";

// Quick demo test accounts matching exact prompt table & reference image
const DEMO_ACCOUNTS = [
  {
    role: "Admin",
    username: "admin_demo",
    password: "Password123!",
    description: "Full system control",
    icon: Shield,
    iconBg:
      "bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
    pillBg:
      "bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950/60 dark:border-purple-800/60 dark:text-purple-300",
  },
  {
    role: "Warehouse Manager",
    username: "warehouse_demo",
    password: "Password123!",
    description: "FEFO & stock intake",
    icon: Package,
    iconBg:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
    pillBg:
      "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/60 dark:border-emerald-800/60 dark:text-emerald-300",
  },
  {
    role: "Sales Agent",
    username: "sales_demo",
    password: "Password123!",
    description: "CRM & orders",
    icon: Users,
    iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
    pillBg:
      "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/60 dark:border-blue-800/60 dark:text-blue-300",
  },
  {
    role: "Restaurant Client",
    username: "bistro_chef",
    password: "StrongPassword123!",
    description: "Ordering portal",
    icon: Utensils,
    iconBg: "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
    pillBg:
      "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/60 dark:border-amber-800/60 dark:text-amber-300",
  },
];

export default function LoginPage() {
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/overview");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMessage("Please enter both your username and password.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const result = await login(username, password);
    setIsSubmitting(false);

    if (result.success) {
      let destination = "/overview";
      if (typeof window !== "undefined") {
        const nextParam = new URLSearchParams(window.location.search).get(
          "next",
        );
        if (nextParam?.startsWith("/") && !nextParam.startsWith("//")) {
          destination = nextParam;
        }
      }
      router.push(destination);
    } else {
      setErrorMessage(
        result.error ||
          "Invalid credentials. Please verify your username and password.",
      );
    }
  };

  const handleQuickFill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white dark:bg-[#070c0a]">
      {/* ─────────────────────────────────────────────────────────────
          LEFT PANEL: Marketing & Brand Identity
      ───────────────────────────────────────────────────────────── */}
      <div className="relative w-full lg:w-[48%] xl:w-[46%] min-h-[520px] lg:min-h-screen p-8 sm:p-12 lg:p-14 flex flex-col justify-between overflow-hidden bg-[#042823] text-white">
        {/* Background Image with Dark Botanical Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/login-bg.jpg"
            alt="FreshFlow Cold Storage Operations"
            fill
            className="object-cover object-center scale-105 filter brightness-75 contrast-105"
            priority
          />
          {/* Multi-stop gradient overlay matching reference exact tones */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#03241f]/92 via-[#053830]/88 to-[#021a16]/96" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Top Brand Header */}
          <div>
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-emerald-500/20 backdrop-blur-xs flex items-center justify-center p-1.5 border border-emerald-400/30">
                <Image
                  src="/logo-transparent.png"
                  alt="FreshFlow"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <div>
                <div className="font-bold text-lg tracking-tight text-white leading-none">
                  FreshFlow
                </div>
                <div className="text-[11px] text-emerald-200/80 font-medium tracking-tight mt-1">
                  Cold Chain Supply CRM
                </div>
              </div>
            </div>

            {/* Subtle Divider Rule */}
            <div className="w-12 h-0.5 bg-emerald-400/80 rounded-full my-7" />

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.12]">
              Fresh supply.
              <br />
              Less waste.
              <br />
              <span className="text-[#34d399]">Stronger businesses.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-emerald-100/80 text-xs sm:text-sm leading-relaxed max-w-md mt-4">
              End-to-end cold chain inventory and restaurant supply management
              for a more efficient, sustainable food ecosystem.
            </p>

            {/* 4 Feature Items */}
            <div className="mt-8 sm:mt-10 space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="size-9 rounded-full bg-[#0a4d43] border border-emerald-500/30 flex items-center justify-center text-[#34d399] shrink-0 shadow-xs">
                  <Snowflake size={17} />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white leading-tight">
                    Cold Chain Compliance
                  </div>
                  <div className="text-[11px] sm:text-xs text-emerald-200/70 font-medium">
                    Real-time temperature monitoring
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="size-9 rounded-full bg-[#0a4d43] border border-emerald-500/30 flex items-center justify-center text-[#34d399] shrink-0 shadow-xs">
                  <Package size={17} />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white leading-tight">
                    FEFO Inventory
                  </div>
                  <div className="text-[11px] sm:text-xs text-emerald-200/70 font-medium">
                    First-Expired, First-Out allocation
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="size-9 rounded-full bg-[#0a4d43] border border-emerald-500/30 flex items-center justify-center text-[#34d399] shrink-0 shadow-xs">
                  <BarChart3 size={17} />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white leading-tight">
                    B2B Restaurant Supply
                  </div>
                  <div className="text-[11px] sm:text-xs text-emerald-200/70 font-medium">
                    Dynamic pricing & CRM
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="size-9 rounded-full bg-[#0a4d43] border border-emerald-500/30 flex items-center justify-center text-[#34d399] shrink-0 shadow-xs">
                  <Leaf size={17} />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white leading-tight">
                    Less Food Waste
                  </div>
                  <div className="text-[11px] sm:text-xs text-emerald-200/70 font-medium">
                    Smarter markdowns & analytics
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Testimonial Pill */}
          <div className="mt-8 pt-4">
            <div className="inline-flex items-center gap-3 px-3.5 py-2 rounded-xl bg-[#05332c]/75 backdrop-blur-md border border-emerald-500/20 max-w-sm">
              <div className="size-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-[#34d399] shrink-0">
                <Leaf size={14} />
              </div>
              <p className="text-xs text-emerald-100/90 font-medium leading-snug">
                “Fresh ingredients today, a more sustainable tomorrow.”
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT PANEL: Login Form & Demo Quick-Login
      ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-y-auto">
        {/* Top Link: New to FreshFlow? */}
        <div className="flex justify-end text-xs text-slate-500 dark:text-slate-400 mb-6 sm:mb-8">
          <span>New to FreshFlow?</span>
          <Link
            href="/register"
            className="ml-1.5 font-semibold text-[#086355] hover:text-emerald-700 dark:text-[#34d399] dark:hover:text-emerald-300"
          >
            Create an account
          </Link>
        </div>

        {/* Center Container */}
        <div className="w-full max-w-md mx-auto my-auto py-2">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome back
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Sign in to your FreshFlow account
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 flex items-start gap-2.5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs dark:bg-rose-950/30 dark:border-rose-900/50 dark:text-rose-400 animate-fade-in-up">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <div className="font-medium leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="login-username"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Username
              </label>
              <div className="relative">
                <UserIcon
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                />
                <input
                  id="login-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  autoComplete="username"
                  required
                  className="w-full h-10 pl-9 pr-3 text-xs sm:text-sm rounded-md border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#086355] focus:border-[#086355] dark:border-[#1b2b24] dark:bg-[#0e1612] dark:text-white dark:placeholder:text-slate-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(
                      "For demo evaluation, use the 1-click Quick Login demo accounts below.",
                    );
                  }}
                  className="text-xs text-[#086355] hover:text-emerald-700 dark:text-[#34d399] font-medium cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full h-10 pl-9 pr-9 text-xs sm:text-sm rounded-md border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#086355] focus:border-[#086355] dark:border-[#1b2b24] dark:bg-[#0e1612] dark:text-white dark:placeholder:text-slate-500 font-mono transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-0.5"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="size-4 rounded border-slate-300 text-[#086355] focus:ring-[#086355] accent-[#086355] cursor-pointer"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-xs text-slate-600 dark:text-slate-400 cursor-pointer"
              >
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 rounded-md bg-[#086355] hover:bg-[#064e43] text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* OR Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-[#1b2b24]" />
            </div>
            <span className="relative bg-white dark:bg-[#070c0a] px-3 text-[11px] font-mono text-slate-400 uppercase">
              OR
            </span>
          </div>

          {/* Quick Login (Demo Accounts) Section */}
          <div className="rounded-xl border border-emerald-100 bg-[#f2fbf7] dark:border-[#152e24] dark:bg-[#081712] p-3.5">
            <div className="flex items-start gap-2 mb-3">
              <div className="size-5 rounded-full bg-emerald-500/20 text-[#086355] dark:text-[#34d399] flex items-center justify-center shrink-0 mt-0.5">
                <Zap size={12} className="fill-current" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  Quick Login (Demo Accounts)
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Click any role to fill the credentials instantly
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((acc) => {
                const Icon = acc.icon;
                return (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => handleQuickFill(acc.username, acc.password)}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-white/90 hover:bg-white dark:bg-[#0d1c16] dark:hover:bg-[#12241d] border border-slate-200/70 dark:border-[#1d352b] transition-all hover:shadow-xs active:scale-[0.99] cursor-pointer text-left group"
                    title={`Click to fill ${acc.role} credentials`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`size-7 rounded-full flex items-center justify-center shrink-0 ${acc.iconBg}`}
                      >
                        <Icon size={14} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-[#086355] dark:group-hover:text-[#34d399] transition-colors">
                          {acc.role}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {acc.description}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`text-right px-2 py-1 rounded text-[10px] font-mono shrink-0 ml-2 border ${acc.pillBg}`}
                    >
                      <div className="font-semibold">{acc.username}</div>
                      <div className="opacity-75">{acc.password}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-400 mt-6">
          FreshFlow Cold Chain Logistics & CRM • Capstone Prototype
        </div>
      </div>
    </div>
  );
}
