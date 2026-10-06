"use client";

import { Boxes, CircleDollarSign, Trash2, TriangleAlert } from "lucide-react";
import { DashboardMetric } from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  metric: DashboardMetric;
}

export function MetricCard({ metric }: MetricCardProps) {
  const getIcon = () => {
    switch (metric.icon) {
      case "Boxes":
        return <Boxes size={18} className="text-emerald-600 dark:text-emerald-400" />;
      case "TriangleAlert":
        return <TriangleAlert size={18} className="text-rose-600 dark:text-rose-400" />;
      case "CircleDollarSign":
        return <CircleDollarSign size={18} className="text-teal-600 dark:text-teal-400" />;
      case "Trash2":
        return <Trash2 size={18} className="text-slate-600 dark:text-slate-400" />;
      default:
        return <Boxes size={18} />;
    }
  };

  const getTopBarColor = () => {
    switch (metric.accent) {
      case "green":
        return "bg-emerald-500";
      case "red":
        return "bg-rose-500";
      case "teal":
        return "bg-teal-500";
      case "slate":
        return "bg-slate-400 dark:bg-slate-500";
    }
  };

  const getIconBg = () => {
    switch (metric.accent) {
      case "green":
        return "bg-emerald-50 border-emerald-200/60 dark:bg-emerald-950/40 dark:border-emerald-800/40";
      case "red":
        return "bg-rose-50 border-rose-200/60 dark:bg-rose-950/40 dark:border-rose-800/40";
      case "teal":
        return "bg-teal-50 border-teal-200/60 dark:bg-teal-950/40 dark:border-teal-800/40";
      case "slate":
        return "bg-slate-100 border-slate-200 dark:bg-slate-900/50 dark:border-slate-800";
    }
  };

  const getSparklineBarColor = (index: number) => {
    const isLast = index >= metric.sparkline.length - 2;
    switch (metric.accent) {
      case "green":
        return isLast ? "bg-emerald-500" : "bg-emerald-200 dark:bg-emerald-800/60";
      case "red":
        return isLast ? "bg-rose-500" : "bg-rose-200 dark:bg-rose-800/60";
      case "teal":
        return isLast ? "bg-teal-500" : "bg-teal-200 dark:bg-teal-800/60";
      case "slate":
        return isLast ? "bg-slate-400" : "bg-slate-200 dark:bg-slate-800";
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-[#1b2b24] dark:bg-[#0e1512] flex flex-col justify-between">
      {/* 2px top semantic indicator */}
      <div className={cn("absolute inset-x-0 top-0 h-[2.5px]", getTopBarColor())} />

      <div>
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "size-8 rounded-md border flex items-center justify-center shrink-0",
              getIconBg()
            )}
          >
            {getIcon()}
          </div>
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
            {metric.label}
          </span>
        </div>

        <div className="mt-3">
          <div className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
            {metric.value}
          </div>
        </div>
      </div>

      <div className="mt-2.5 pt-2 flex items-end justify-between border-t border-slate-100 dark:border-[#1b2b24]/70">
        <div
          className={cn(
            "text-[11px] font-medium font-mono tabular-nums",
            metric.accent === "red"
              ? "text-rose-600 dark:text-rose-400"
              : "text-emerald-600 dark:text-emerald-400"
          )}
        >
          {metric.change}
        </div>

        {/* Mini Sparkline Bar Chart */}
        <div className="flex items-end gap-0.5 h-6">
          {metric.sparkline.map((val, idx) => (
            <div
              key={idx}
              className={cn("w-1 rounded-t-xs transition-all", getSparklineBarColor(idx))}
              style={{ height: `${Math.max(val * 0.24, 4)}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
