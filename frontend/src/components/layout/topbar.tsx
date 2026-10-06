"use client";

import { useEffect, useState } from "react";
import { Bell, ChevronDown, Menu, Moon, Search, Sun } from "lucide-react";

interface TopbarProps {
  onMenuClick?: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

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
          <Search size={15} className="absolute left-2.5 text-slate-400 dark:text-slate-500" />
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
          aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
          title={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
        >
          {theme === "light" ? (
            <Moon size={16} className="text-slate-600 hover:text-slate-900 transition-transform duration-200 hover:-rotate-12" />
          ) : (
            <Sun size={16} className="text-amber-400 hover:text-amber-300 transition-transform duration-200 hover:rotate-45" />
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

        {/* User profile */}
        <div className="flex items-center gap-2.5 pl-1 cursor-pointer group">
          <div className="size-8 rounded-full bg-[#063c35] text-white flex items-center justify-center text-xs font-semibold tracking-tight">
            MA
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight">
              Mohammad Ahsan
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-none mt-0.5">
              Warehouse Manager
            </div>
          </div>
          <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300 transition-colors ml-0.5" />
        </div>
      </div>
    </header>
  );
}
