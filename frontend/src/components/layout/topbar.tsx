"use client";

import { Bell, ChevronDown, Search } from "lucide-react";

export function Topbar() {
  return (
    <header className="h-14 border-b border-slate-200/80 bg-white px-4 flex items-center justify-between dark:border-[#1e2230] dark:bg-[#0f1117] shrink-0">
      {/* Search Input with ⌘K Badge */}
      <div className="flex-1 max-w-md">
        <div className="relative flex items-center">
          <Search size={15} className="absolute left-2.5 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search batches, items, restaurants..."
            className="h-8 w-full rounded-md border border-slate-200 bg-slate-50/70 pl-8 pr-12 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-[#1e2230] dark:bg-[#141822] dark:text-slate-200 dark:placeholder:text-slate-500"
          />
          <kbd className="absolute right-2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 border border-slate-200 rounded bg-white shadow-2xs dark:border-[#1e2230] dark:bg-[#0f1117] dark:text-slate-500">
            ⌘ K
          </kbd>
        </div>
      </div>

      {/* Right User & Notification Controls */}
      <div className="flex items-center gap-3">
        {/* Notification Bell with indicator */}
        <button
          className="relative size-8 flex items-center justify-center rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-[#161a24] transition-colors"
          aria-label="Notifications"
        >
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#0f1117]" />
        </button>

        {/* Vertical divider */}
        <span className="h-5 w-px bg-slate-200 dark:bg-[#1e2230]" />

        {/* User profile */}
        <div className="flex items-center gap-2.5 pl-1 cursor-pointer group">
          <div className="size-8 rounded-full bg-[#063c35] text-white flex items-center justify-center text-xs font-semibold tracking-tight">
            MA
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
              Mohammad Ahsan
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none mt-0.5">
              Warehouse Manager
            </div>
          </div>
          <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300 transition-colors ml-0.5" />
        </div>
      </div>
    </header>
  );
}
