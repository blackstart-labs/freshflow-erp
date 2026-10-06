import * as React from "react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  delta?: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: "cyan" | "crimson" | "amber" | "emerald" | "slate";
  className?: string;
}

export function MetricCard({
  label,
  value,
  delta,
  icon: Icon,
  accent = "cyan",
  className,
}: MetricCardProps) {
  const topBarColor = {
    cyan: "bg-sky-500",
    crimson: "bg-red-500",
    amber: "bg-amber-500",
    emerald: "bg-emerald-500",
    slate: "bg-slate-500",
  }[accent];

  return (
    <div
      className={cn(
        "relative flex flex-col justify-between overflow-hidden rounded-md border border-slate-200 bg-white p-4 shadow-xs dark:border-[#1e2230] dark:bg-[#0f1117]",
        className
      )}
    >
      <div className={cn("absolute inset-x-0 top-0 h-[2px]", topBarColor)} />

      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium tracking-wider uppercase text-slate-500 dark:text-slate-400">
          {label}
        </span>
        <Icon className="size-4 shrink-0 text-slate-400 dark:text-slate-500" />
      </div>

      <div className="mt-3">
        <div className="font-mono text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
          {value}
        </div>
        {delta && (
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono tabular-nums">
            {delta}
          </p>
        )}
      </div>
    </div>
  );
}
