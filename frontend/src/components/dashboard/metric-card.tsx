"use client";

import { CircleDollarSign, Package, Trash2, TriangleAlert } from "lucide-react";

interface KpiMetricsSectionProps {
  data?: {
    activeBatches: number;
    nearExpiry: number;
    revenue: number;
    spoilageLoss: number;
  };
}

export function KpiMetricsSection({ data }: KpiMetricsSectionProps = {}) {
  const activeBatchesValue = data ? String(data.activeBatches) : "142";
  const nearExpiryValue = data ? String(data.nearExpiry) : "18";
  const revenueValue = data
    ? `৳ ${data.revenue.toLocaleString()}`
    : "৳ 1,286,450";
  const spoilageLossValue = data
    ? `৳ ${data.spoilageLoss.toLocaleString()}`
    : "৳ 24,320";

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Card 1: Active cold batches */}
      <div className="relative overflow-hidden rounded-lg border border-slate-200/80 bg-white p-4 shadow-xs dark:border-[#1b2b24] dark:bg-[#0e1512] flex flex-col justify-between transition-colors">
        <div className="absolute inset-x-0 top-0 h-[2.5px] bg-[#059669]" />

        <div className="flex items-center gap-3.5 pt-0.5">
          <div className="size-11 rounded-full flex items-center justify-center shrink-0 bg-[#e6f7f0] text-[#0d8253] dark:bg-[#12261e] dark:text-[#34d399]">
            <Package size={22} className="stroke-[1.75]" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
              Active cold batches
            </div>
            <div className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums leading-tight mt-0.5">
              {activeBatchesValue}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div className="text-xs font-semibold font-mono tabular-nums text-[#0d8253] dark:text-emerald-400 flex items-center gap-1">
            <span>↑</span>
            <span>12% vs last week</span>
          </div>
          <div className="flex items-end gap-1 h-6">
            <div
              className="w-1.5 rounded-t-xs bg-emerald-200/80 dark:bg-emerald-800/60"
              style={{ height: "8px" }}
            />
            <div
              className="w-1.5 rounded-t-xs bg-emerald-300/80 dark:bg-emerald-700/60"
              style={{ height: "18px" }}
            />
            <div
              className="w-1.5 rounded-t-xs bg-emerald-200/80 dark:bg-emerald-800/60"
              style={{ height: "14px" }}
            />
            <div
              className="w-1.5 rounded-t-xs bg-emerald-200/80 dark:bg-emerald-800/60"
              style={{ height: "12px" }}
            />
            <div
              className="w-1.5 rounded-t-xs bg-emerald-300/80 dark:bg-emerald-700/60"
              style={{ height: "22px" }}
            />
            <div
              className="w-1.5 rounded-t-xs bg-emerald-300/80 dark:bg-emerald-700/60"
              style={{ height: "16px" }}
            />
            <div
              className="w-1.5 rounded-t-xs bg-emerald-200/80 dark:bg-emerald-800/60"
              style={{ height: "10px" }}
            />
            <div
              className="w-1.5 rounded-t-xs bg-emerald-200/80 dark:bg-emerald-800/60"
              style={{ height: "7px" }}
            />
          </div>
        </div>
      </div>

      {/* Card 2: Near expiry */}
      <div className="relative overflow-hidden rounded-lg border border-slate-200/80 bg-white p-4 shadow-xs dark:border-[#1b2b24] dark:bg-[#0e1512] flex flex-col justify-between transition-colors">
        <div className="absolute inset-x-0 top-0 h-[2.5px] bg-[#e11d48]" />

        <div className="flex items-center gap-3.5 pt-0.5">
          <div className="size-11 rounded-full flex items-center justify-center shrink-0 bg-[#feebe9] text-[#e03131] dark:bg-[#2c1517] dark:text-[#f87171]">
            <TriangleAlert size={22} className="stroke-[1.75]" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
              Near expiry (≤ 2 days)
            </div>
            <div className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums leading-tight mt-0.5">
              {nearExpiryValue}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div className="text-xs font-semibold font-mono tabular-nums text-[#e03131] dark:text-rose-400 flex items-center gap-1">
            <span>↑</span>
            <span>4 vs yesterday</span>
          </div>
          <div className="flex items-end gap-1 h-6">
            <div
              className="w-1.5 rounded-t-xs bg-rose-200/80 dark:bg-rose-800/60"
              style={{ height: "7px" }}
            />
            <div
              className="w-1.5 rounded-t-xs bg-rose-200/80 dark:bg-rose-800/60"
              style={{ height: "11px" }}
            />
            <div
              className="w-1.5 rounded-t-xs bg-rose-300/80 dark:bg-rose-700/60"
              style={{ height: "16px" }}
            />
            <div
              className="w-1.5 rounded-t-xs bg-rose-400/80 dark:bg-rose-600/70"
              style={{ height: "23px" }}
            />
            <div
              className="w-1.5 rounded-t-xs bg-rose-300/80 dark:bg-rose-700/60"
              style={{ height: "18px" }}
            />
            <div
              className="w-1.5 rounded-t-xs bg-rose-200/80 dark:bg-rose-800/60"
              style={{ height: "10px" }}
            />
            <div
              className="w-1.5 rounded-t-xs bg-rose-200/80 dark:bg-rose-800/60"
              style={{ height: "13px" }}
            />
            <div
              className="w-1.5 rounded-t-xs bg-rose-200/80 dark:bg-rose-800/60"
              style={{ height: "8px" }}
            />
          </div>
        </div>
      </div>

      {/* Card 3: Total revenue */}
      <div className="relative overflow-hidden rounded-lg border border-slate-200/80 bg-white p-4 shadow-xs dark:border-[#1b2b24] dark:bg-[#0e1512] flex flex-col justify-between transition-colors">
        <div className="absolute inset-x-0 top-0 h-[2.5px] bg-[#0284c7]" />

        <div className="flex items-center gap-3.5 pt-0.5">
          <div className="size-11 rounded-full flex items-center justify-center shrink-0 bg-[#e0f2fe] text-[#0284c7] dark:bg-[#0c2838] dark:text-[#38bdf8]">
            <CircleDollarSign size={22} className="stroke-[1.75]" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
              Total revenue
            </div>
            <div className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums leading-tight mt-0.5">
              {revenueValue}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div className="text-xs font-semibold font-mono tabular-nums text-[#0d8253] dark:text-emerald-400 flex items-center gap-1">
            <span>↑</span>
            <span>8.4% vs last week</span>
          </div>
          <div className="flex items-end gap-1 h-6">
            <div
              className="w-1.5 rounded-t-xs bg-emerald-200/80 dark:bg-emerald-800/60"
              style={{ height: "9px" }}
            />
            <div
              className="w-1.5 rounded-t-xs bg-emerald-200/80 dark:bg-emerald-800/60"
              style={{ height: "13px" }}
            />
            <div
              className="w-1.5 rounded-t-xs bg-emerald-300/80 dark:bg-emerald-700/60"
              style={{ height: "15px" }}
            />
            <div
              className="w-1.5 rounded-t-xs bg-emerald-300/80 dark:bg-emerald-700/60"
              style={{ height: "19px" }}
            />
            <div
              className="w-1.5 rounded-t-xs bg-emerald-400/80 dark:bg-emerald-600/70"
              style={{ height: "23px" }}
            />
            <div
              className="w-1.5 rounded-t-xs bg-emerald-300/80 dark:bg-emerald-700/60"
              style={{ height: "17px" }}
            />
            <div
              className="w-1.5 rounded-t-xs bg-emerald-200/80 dark:bg-emerald-800/60"
              style={{ height: "14px" }}
            />
            <div
              className="w-1.5 rounded-t-xs bg-emerald-200/80 dark:bg-emerald-800/60"
              style={{ height: "12px" }}
            />
          </div>
        </div>
      </div>

      {/* Card 4: Spoilage loss */}
      <div className="relative overflow-hidden rounded-lg border border-slate-200/80 bg-white p-4 shadow-xs dark:border-[#1b2b24] dark:bg-[#0e1512] flex flex-col justify-between transition-colors">
        <div className="absolute inset-x-0 top-0 h-[2.5px] bg-[#64748b]" />

        <div className="flex items-center gap-3.5 pt-0.5">
          <div className="size-11 rounded-full flex items-center justify-center shrink-0 bg-[#f0f4f8] text-[#556987] dark:bg-[#18201c] dark:text-[#94a3b8]">
            <Trash2 size={22} className="stroke-[1.75]" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
              Spoilage loss
            </div>
            <div className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums leading-tight mt-0.5">
              {spoilageLossValue}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div className="text-xs font-semibold font-mono tabular-nums text-[#0d8253] dark:text-emerald-400 flex items-center gap-1">
            <span>↓</span>
            <span>32% vs last week</span>
          </div>
          <div className="flex items-end gap-1 h-6">
            <div
              className="w-1.5 rounded-t-xs bg-slate-300/80 dark:bg-slate-700/60"
              style={{ height: "19px" }}
            />
            <div
              className="w-1.5 rounded-t-xs bg-slate-400/80 dark:bg-slate-600/70"
              style={{ height: "23px" }}
            />
            <div
              className="w-1.5 rounded-t-xs bg-slate-300/80 dark:bg-slate-700/60"
              style={{ height: "16px" }}
            />
            <div
              className="w-1.5 rounded-t-xs bg-slate-200/80 dark:bg-slate-800/60"
              style={{ height: "13px" }}
            />
            <div
              className="w-1.5 rounded-t-xs bg-slate-300/80 dark:bg-slate-700/60"
              style={{ height: "18px" }}
            />
            <div
              className="w-1.5 rounded-t-xs bg-slate-200/80 dark:bg-slate-800/60"
              style={{ height: "11px" }}
            />
            <div
              className="w-1.5 rounded-t-xs bg-slate-200/80 dark:bg-slate-800/60"
              style={{ height: "8px" }}
            />
            <div
              className="w-1.5 rounded-t-xs bg-slate-200/80 dark:bg-slate-800/60"
              style={{ height: "7px" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
