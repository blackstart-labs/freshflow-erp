"use client";

import { useState } from "react";
import { ArrowUpRight, Copy, Check, Filter, MoreHorizontal, Search } from "lucide-react";
import { StockBatch } from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface StockBatchesTableProps {
  batches: StockBatch[];
}

export function StockBatchesTable({ batches }: StockBatchesTableProps) {
  const [activeTab, setActiveTab] = useState<string>("All Batches");
  const [search, setSearch] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const tabs = [
    "All Batches",
    "Expiring ≤ 48h",
    "Flash Sale",
    "Depleted",
    "Spoiled",
  ];

  const handleCopy = (id: string, batchNum: string) => {
    navigator.clipboard?.writeText(batchNum);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const filteredBatches = batches.filter((b) => {
    if (search && !b.itemName.toLowerCase().includes(search.toLowerCase()) && !b.batchNumber.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (activeTab === "Expiring ≤ 48h") return b.daysLeftUrgent;
    if (activeTab === "Flash Sale") return b.status === "FLASH_SALE";
    if (activeTab === "Depleted") return b.status === "DEPLETED";
    if (activeTab === "Spoiled") return b.status === "SPOILED";
    return true;
  });

  const getItemEmojiBg = (category: StockBatch["category"]) => {
    switch (category) {
      case "Poultry":
        return "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-900";
      case "Dairy":
        return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900";
      case "Seafood":
        return "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950/50 dark:text-sky-400 dark:border-sky-900";
      case "Beef":
        return "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900";
      case "Vegetables":
        return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900";
    }
  };

  return (
    <div className="rounded-lg border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-[#1b2b24] dark:bg-[#0e1512] flex flex-col justify-between">
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100 dark:border-[#1b2b24]/60">
        <div className="flex items-center gap-3">
          <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
            Recent Stock Batches
          </h3>

          {/* Segmented Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100/80 p-0.5 rounded-md dark:bg-[#141f1a]">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-2 py-1 text-[11px] font-medium rounded transition-colors whitespace-nowrap",
                  activeTab === tab
                    ? "bg-[#063c35] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Search, Filter & View All */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search batch or item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-7 w-44 rounded border border-slate-200 bg-slate-50/60 pl-7 pr-2 text-[11px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-[#1b2b24] dark:bg-[#121c17] dark:text-slate-200"
            />
          </div>

          <button className="h-7 flex items-center gap-1 px-2 text-[11px] font-medium text-slate-600 border border-slate-200 rounded hover:bg-slate-50 dark:border-[#1b2b24] dark:text-slate-300 dark:hover:bg-[#141f1a]">
            <Filter size={12} />
            <span>Filter</span>
          </button>

          <button className="flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 ml-1">
            <span>View All</span>
            <ArrowUpRight size={13} />
          </button>
        </div>
      </div>

      {/* Dense Operational Table */}
      <div className="mt-2.5 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[10.5px] font-semibold uppercase tracking-wider text-slate-400 dark:border-[#1b2b24]/80 dark:text-slate-500">
              <th className="py-2 px-2.5">BATCH #</th>
              <th className="py-2 px-2.5">ITEM</th>
              <th className="py-2 px-2.5">CATEGORY</th>
              <th className="py-2 px-2.5">TEMP</th>
              <th className="py-2 px-2.5 text-right">CURRENT QTY</th>
              <th className="py-2 px-2.5">EXPIRY DATE</th>
              <th className="py-2 px-2.5">DAYS LEFT</th>
              <th className="py-2 px-2.5">STATUS</th>
              <th className="py-2 px-2.5">LOCATION</th>
              <th className="py-2 px-2 text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-[12px] dark:divide-[#1b2b24]/50">
            {filteredBatches.map((batch) => (
              <tr
                key={batch.id}
                className="hover:bg-slate-50/70 dark:hover:bg-[#121c17]/50 transition-colors group"
              >
                {/* Batch Cell */}
                <td className="py-2 px-2.5">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "size-6 rounded border flex items-center justify-center font-bold text-[10px] shrink-0",
                        getItemEmojiBg(batch.category)
                      )}
                    >
                      {batch.category.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1 font-mono font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer">
                        <span>{batch.batchNumber}</span>
                        <button
                          onClick={() => handleCopy(batch.id, batch.batchNumber)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 transition-opacity"
                          title="Copy Batch ID"
                        >
                          {copiedId === batch.id ? (
                            <Check size={11} className="text-emerald-500" />
                          ) : (
                            <Copy size={11} />
                          )}
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500">
                        {batch.dateType}: {batch.processDate}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Item */}
                <td className="py-2 px-2.5 font-medium text-slate-800 dark:text-slate-200">
                  {batch.itemName}
                </td>

                {/* Category */}
                <td className="py-2 px-2.5 text-slate-500 dark:text-slate-400">
                  {batch.category}
                </td>

                {/* Temp */}
                <td className="py-2 px-2.5 font-mono">
                  <div className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                    <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>{batch.temperature.toFixed(1)}°C</span>
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                    {batch.targetTemp}
                  </div>
                </td>

                {/* Quantity */}
                <td className="py-2 px-2.5 text-right font-mono font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                  {batch.currentQuantity} <span className="font-normal text-slate-400">{batch.unit}</span>
                </td>

                {/* Expiry Date */}
                <td className="py-2 px-2.5 font-mono text-slate-600 dark:text-slate-400 tabular-nums text-[11.5px]">
                  {batch.expiryDate}
                </td>

                {/* Days Left */}
                <td className="py-2 px-2.5 font-mono font-semibold tabular-nums text-[11.5px]">
                  <span
                    className={
                      batch.daysLeftUrgent
                        ? "text-rose-600 dark:text-rose-400"
                        : "text-emerald-600 dark:text-emerald-400"
                    }
                  >
                    {batch.daysLeft}
                  </span>
                </td>

                {/* Status */}
                <td className="py-2 px-2.5">
                  <span
                    className={cn(
                      "inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-bold tracking-wide font-mono",
                      batch.status === "FLASH_SALE"
                        ? "bg-rose-50 text-rose-600 border border-rose-200/80 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900/60"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900/60"
                    )}
                  >
                    {batch.status}
                  </span>
                </td>

                {/* Location */}
                <td className="py-2 px-2.5 text-slate-600 dark:text-slate-400 text-[11.5px]">
                  {batch.location}
                </td>

                {/* Actions */}
                <td className="py-2 px-2 text-center">
                  <button className="size-6 inline-flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded dark:hover:bg-[#141f1a] dark:hover:text-slate-200 transition-colors">
                    <MoreHorizontal size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
