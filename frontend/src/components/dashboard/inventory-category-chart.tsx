"use client";

import { ChevronDown } from "lucide-react";
import { CategoryDistribution } from "@/types/dashboard";

interface InventoryCategoryChartProps {
  categories: CategoryDistribution[];
}

export function InventoryCategoryChart({ categories }: InventoryCategoryChartProps) {
  const totalBatches = categories.reduce((sum, c) => sum + c.count, 0);

  // SVG Donut calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius; // ~263.89
  let accumulatedOffset = 0;

  return (
    <div className="rounded-lg border border-slate-200/80 bg-white p-4 shadow-xs dark:border-[#1b2b24] dark:bg-[#0e1512] flex flex-col justify-between transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1b2b24]">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Inventory by Category
        </h3>
        <button className="flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-[#1b2b24] dark:bg-[#121c17] dark:text-slate-300 dark:hover:bg-[#192721] transition-colors">
          <span>Batches</span>
          <ChevronDown size={12} />
        </button>
      </div>

      {/* Donut and Legend Grid */}
      <div className="flex items-center justify-between gap-4 mt-3">
        {/* Crisp SVG Donut */}
        <div className="relative size-28 shrink-0 flex items-center justify-center">
          <svg className="size-28 -rotate-90 transform" viewBox="0 0 100 100">
            {categories.map((cat) => {
              const strokeLength = (cat.percentage / 100) * circumference;
              const strokeDasharray = `${strokeLength} ${circumference - strokeLength}`;
              const strokeDashoffset = -accumulatedOffset;
              accumulatedOffset += strokeLength;

              return (
                <circle
                  key={cat.category}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke={cat.color}
                  strokeWidth="14"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all hover:opacity-90"
                />
              );
            })}
          </svg>

          {/* Center Hole Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-mono text-xl font-bold text-slate-900 dark:text-white leading-none tabular-nums">
              {totalBatches}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight mt-1">
              Total Batches
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex-1 space-y-2 pr-1">
          {categories.map((cat) => (
            <div key={cat.category} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="size-2 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  {cat.category}
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono tabular-nums text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  {cat.percentage}%
                </span>
                <span className="font-bold text-slate-900 dark:text-white w-6 text-right">
                  {cat.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
