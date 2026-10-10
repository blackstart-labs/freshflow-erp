import * as React from "react";
import { cn } from "@/lib/utils";

interface ExpiryBadgeProps {
  hoursRemaining: number;
  className?: string;
}

export function ExpiryBadge({ hoursRemaining, className }: ExpiryBadgeProps) {
  if (hoursRemaining <= 0) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-sm border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-500 line-through dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 tabular-nums select-none",
          className
        )}
      >
        EXPIRED
      </span>
    );
  }

  if (hoursRemaining <= 48) {
    const hours = Math.floor(hoursRemaining);
    const mins = Math.floor((hoursRemaining % 1) * 60);

    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-sm border border-red-500/40 bg-red-500/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-red-600 dark:text-red-400 tabular-nums select-none",
          className
        )}
      >
        <span className="size-1.5 rounded-full bg-red-500 animate-pulse-subtle shrink-0" />
        <span>{hours}h {mins}m</span>
        <span className="text-[9px] uppercase tracking-wider font-bold opacity-90">FLASH</span>
      </span>
    );
  }

  if (hoursRemaining <= 120) {
    const days = Math.floor(hoursRemaining / 24);
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-sm border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[11px] font-medium text-amber-700 dark:text-amber-400 tabular-nums select-none",
          className
        )}
      >
        <span>{days}d left</span>
      </span>
    );
  }

  const days = Math.floor(hoursRemaining / 24);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] font-medium text-emerald-700 dark:text-emerald-400 tabular-nums select-none",
        className
      )}
    >
      <span>{days}d safe</span>
    </span>
  );
}
