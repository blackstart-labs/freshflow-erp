"use client";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  ClipboardList,
  Eye,
  EyeOff,
  Headphones,
  Lock,
  Mail,
  Phone,
  Shield,
  Store,
  Tag,
  Truck,
  User as UserIcon,
  Utensils,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";

export default function RegisterPage() {
  const { register, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/overview");
    }
  }, [isAuthenticated, authLoading, router]);

  // Real-time password validation metrics
  const hasMinLength = password.length >= 8;
  const hasLetters = /[a-zA-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasLettersAndNumbers = hasLetters && hasNumbers;
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !email.trim() || !password) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (!hasMinLength) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (!hasLettersAndNumbers) {
      setErrorMessage("Password must contain both letters and numbers.");
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const result = await register({
      username: username.trim(),
      email: email.trim(),
      password,
      phone_number: phoneNumber.trim(),
    });

    setIsSubmitting(false);

    if (result.success) {
      router.push("/overview");
    } else {
      setErrorMessage(
        result.error || "Registration failed. Please check your information.",
      );
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white dark:bg-[#070c0a]">
      {/* ─────────────────────────────────────────────────────────────
          LEFT PANEL: Marketing & Brand Identity (Restaurant Focus)
      ───────────────────────────────────────────────────────────── */}
      <div className="relative w-full lg:w-[48%] xl:w-[46%] min-h-[520px] lg:min-h-screen p-8 sm:p-12 lg:p-14 flex flex-col justify-between overflow-hidden bg-[#042823] text-white">
        {/* Background Image with Dark Botanical Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/register-bg.jpg"
            alt="FreshFlow Culinary Restaurant Supply"
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
              Join the
              <br />
              <span className="text-[#34d399]">FreshFlow network</span>
            </h1>

            {/* Subtitle */}
            <p className="text-emerald-100/80 text-xs sm:text-sm leading-relaxed max-w-md mt-4">
              Create your restaurant account and get access to fresh
              ingredients, better pricing, and reliable supply from trusted
              providers.
            </p>

            {/* 4 Feature Items */}
            <div className="mt-8 sm:mt-10 space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="size-9 rounded-full bg-[#0a4d43] border border-emerald-500/30 flex items-center justify-center text-[#34d399] shrink-0 shadow-xs">
                  <Truck size={17} />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white leading-tight">
                    Reliable Supply
                  </div>
                  <div className="text-[11px] sm:text-xs text-emerald-200/70 font-medium">
                    Consistent quality & temperature controlled delivery
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="size-9 rounded-full bg-[#0a4d43] border border-emerald-500/30 flex items-center justify-center text-[#34d399] shrink-0 shadow-xs">
                  <Tag size={17} />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white leading-tight">
                    Tiered Pricing
                  </div>
                  <div className="text-[11px] sm:text-xs text-emerald-200/70 font-medium">
                    Better rates for growing businesses
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="size-9 rounded-full bg-[#0a4d43] border border-emerald-500/30 flex items-center justify-center text-[#34d399] shrink-0 shadow-xs">
                  <ClipboardList size={17} />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white leading-tight">
                    Easy Ordering
                  </div>
                  <div className="text-[11px] sm:text-xs text-emerald-200/70 font-medium">
                    Quick order, track, and reorder
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="size-9 rounded-full bg-[#0a4d43] border border-emerald-500/30 flex items-center justify-center text-[#34d399] shrink-0 shadow-xs">
                  <Headphones size={17} />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white leading-tight">
                    Dedicated Support
                  </div>
                  <div className="text-[11px] sm:text-xs text-emerald-200/70 font-medium">
                    A team that understands restaurant needs
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Testimonial Pill */}
          <div className="mt-8 pt-4">
            <div className="inline-flex items-center gap-3 px-3.5 py-2 rounded-xl bg-[#05332c]/75 backdrop-blur-md border border-emerald-500/20 max-w-sm">
              <div className="size-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-[#34d399] shrink-0">
                <Utensils size={14} />
              </div>
              <p className="text-xs text-emerald-100/90 font-medium leading-snug">
                “Great ingredients build great food businesses.”
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT PANEL: Registration Form
      ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-y-auto">
        {/* Top Link: Back to login */}
        <div className="mb-4 sm:mb-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to login</span>
          </Link>
        </div>

        {/* Center Container */}
        <div className="w-full max-w-md mx-auto my-auto py-2">
          {/* Header */}
          <div className="mb-5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Create your account
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Join FreshFlow as a Restaurant Client
            </p>
          </div>

          {/* Restaurant Client Notice Box (Amber themed matching reference) */}
          <div className="mb-5 flex items-start gap-3 p-3.5 rounded-xl bg-[#fef7ee] border border-[#fde4c8] text-slate-800 dark:bg-[#1f160e] dark:border-[#382618] dark:text-slate-200">
            <div className="size-7 rounded-lg bg-[#fde9d2] text-[#c26214] dark:bg-[#342012] dark:text-[#f59e0b] flex items-center justify-center shrink-0 mt-0.5">
              <Store size={15} />
            </div>
            <div>
              <div className="text-xs font-bold text-[#8c3b06] dark:text-[#f59e0b] leading-tight">
                You are registering as a Restaurant Client
              </div>
              <div className="text-[11px] text-[#9a4b16]/90 dark:text-slate-300 mt-0.5 leading-relaxed">
                Get access to our product catalog, place orders, track
                deliveries, and manage your account.
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 flex items-start gap-2.5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs dark:bg-rose-950/30 dark:border-rose-900/50 dark:text-rose-400 animate-fade-in-up">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <div className="font-medium leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label
                htmlFor="reg-username"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Username
              </label>
              <div className="relative">
                <UserIcon
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                />
                <input
                  id="reg-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  autoComplete="username"
                  required
                  className="w-full h-10 pl-9 pr-3 text-xs sm:text-sm rounded-md border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#086355] focus:border-[#086355] dark:border-[#1b2b24] dark:bg-[#0e1612] dark:text-white dark:placeholder:text-slate-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="reg-email"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                />
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  autoComplete="email"
                  required
                  className="w-full h-10 pl-9 pr-3 text-xs sm:text-sm rounded-md border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#086355] focus:border-[#086355] dark:border-[#1b2b24] dark:bg-[#0e1612] dark:text-white dark:placeholder:text-slate-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="reg-phone"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Phone number
              </label>
              <div className="relative">
                <Phone
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                />
                <input
                  id="reg-phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number"
                  autoComplete="tel"
                  className="w-full h-10 pl-9 pr-3 text-xs sm:text-sm rounded-md border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#086355] focus:border-[#086355] dark:border-[#1b2b24] dark:bg-[#0e1612] dark:text-white dark:placeholder:text-slate-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="reg-password"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                />
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  autoComplete="new-password"
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

            <div>
              <label
                htmlFor="reg-confirm-password"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Confirm password
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                />
                <input
                  id="reg-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  required
                  className="w-full h-10 pl-9 pr-9 text-xs sm:text-sm rounded-md border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#086355] focus:border-[#086355] dark:border-[#1b2b24] dark:bg-[#0e1612] dark:text-white dark:placeholder:text-slate-500 font-mono transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-0.5"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={15} />
                  ) : (
                    <Eye size={15} />
                  )}
                </button>
              </div>
            </div>

            {/* Password Requirements Box matching reference image */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 dark:bg-[#0b1611] dark:border-[#172d22] space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-xs">
                <Shield size={13} className="text-slate-500" />
                <span>Password requirements</span>
              </div>
              <div className="space-y-1.5 pl-0.5">
                <div
                  className={`flex items-center gap-2 text-[11px] ${
                    hasMinLength
                      ? "text-emerald-700 dark:text-emerald-400 font-semibold"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {hasMinLength ? (
                    <CheckCircle2
                      size={13}
                      className="text-emerald-600 dark:text-emerald-400 shrink-0"
                    />
                  ) : (
                    <Circle size={13} className="text-slate-400 shrink-0" />
                  )}
                  <span>At least 8 characters</span>
                </div>

                <div
                  className={`flex items-center gap-2 text-[11px] ${
                    hasLettersAndNumbers
                      ? "text-emerald-700 dark:text-emerald-400 font-semibold"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {hasLettersAndNumbers ? (
                    <CheckCircle2
                      size={13}
                      className="text-emerald-600 dark:text-emerald-400 shrink-0"
                    />
                  ) : (
                    <Circle size={13} className="text-slate-400 shrink-0" />
                  )}
                  <span>Contains both letters and numbers</span>
                </div>

                <div
                  className={`flex items-center gap-2 text-[11px] ${
                    passwordsMatch
                      ? "text-emerald-700 dark:text-emerald-400 font-semibold"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {passwordsMatch ? (
                    <CheckCircle2
                      size={13}
                      className="text-emerald-600 dark:text-emerald-400 shrink-0"
                    />
                  ) : (
                    <Circle size={13} className="text-slate-400 shrink-0" />
                  )}
                  <span>Passwords match</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 mt-2 rounded-md bg-[#086355] hover:bg-[#064e43] text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create account</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#086355] hover:text-emerald-700 dark:text-[#34d399]"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-400 mt-4">
          FreshFlow Cold Chain Logistics & CRM • Capstone Prototype
        </div>
      </div>
    </div>
  );
}
