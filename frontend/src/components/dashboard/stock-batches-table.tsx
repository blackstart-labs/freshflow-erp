"use client";

import Image from "next/image";
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
    if (
      search &&
      !b.itemName.toLowerCase().includes(search.toLowerCase()) &&
      !b.batchNumber.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    if (activeTab === "Expiring ≤ 48h") return b.daysLeftUrgent;
    if (activeTab === "Flash Sale") return b.status === "FLASH_SALE";
    if (activeTab === "Depleted") return b.status === "DEPLETED";
    if (activeTab === "Spoiled") return b.status === "SPOILED";
    return true;
  });

  return (
    <div className="rounded-lg border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-[#1b2b24] dark:bg-[#0e1512] flex flex-col justify-between transition-all duration-200">
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100 dark:border-[#1b2b24]">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">
            Recent Stock Batches
          </h3>

          {/* Segmented Filter Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap duration-150",
                  activeTab === tab
                    ? "bg-[#063c35] text-white shadow-xs dark:bg-emerald-600 dark:text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 dark:bg-[#121c17] dark:text-slate-300 dark:hover:bg-[#182620]"
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
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search batch or item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-36 sm:w-48 rounded border border-slate-200 bg-slate-50/70 pl-8 pr-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-[#1b2b24] dark:bg-[#121c17] dark:text-slate-200 dark:placeholder:text-slate-500 transition-colors"
            />
          </div>

          <button className="h-8 flex items-center gap-1 px-2.5 text-xs font-medium text-slate-700 border border-slate-200 rounded hover:bg-slate-50 dark:border-[#1b2b24] dark:bg-[#121c17] dark:text-slate-300 dark:hover:bg-[#182620] transition-colors">
            <Filter size={13} />
            <span>Filter</span>
          </button>

          <button className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 ml-1 transition-colors">
            <span>View All</span>
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      {/* Dense Operational Table */}
      <div className="mt-2.5 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[760px]">
          <thead>
            <tr className="border-b border-slate-100 dark:border-[#1b2b24] text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="py-2.5 px-3">BATCH #</th>
              <th className="py-2.5 px-3">ITEM</th>
              <th className="py-2.5 px-3">CATEGORY</th>
              <th className="py-2.5 px-3">TEMP</th>
              <th className="py-2.5 px-3 text-right">CURRENT QTY</th>
              <th className="py-2.5 px-3">EXPIRY DATE</th>
              <th className="py-2.5 px-3">DAYS LEFT</th>
              <th className="py-2.5 px-3">STATUS</th>
              <th className="py-2.5 px-3">LOCATION</th>
              <th className="py-2.5 px-2 text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#1b2b24] text-xs">
            {filteredBatches.map((batch) => (
              <tr
                key={batch.id}
                className="hover:bg-slate-50/80 dark:hover:bg-[#121c17]/70 transition-colors group"
              >
                {/* Batch Cell with Authentic Thumbnail */}
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-md border border-slate-200/80 bg-slate-50 dark:border-[#1b2b24] dark:bg-[#121c17] overflow-hidden shrink-0 relative shadow-2xs">
                      <Image
                        src={batch.image}
                        alt={batch.itemName}
                        width={32}
                        height={32}
                        className="object-cover size-full"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1 font-mono font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer text-xs">
                        <span>{batch.batchNumber}</span>
                        <button
                          onClick={() => handleCopy(batch.id, batch.batchNumber)}
                          className="text-slate-400 hover:text-sky-600 dark:text-slate-500 dark:hover:text-sky-400 transition-colors"
                          title="Copy Batch ID"
                        >
                          {copiedId === batch.id ? (
                            <Check size={12} className="text-emerald-500" />
                          ) : (
                            <Copy size={12} />
                          )}
                        </button>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        {batch.dateType}: {batch.processDate}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Item */}
                <td className="py-2.5 px-3 text-sm font-semibold text-slate-900 dark:text-white">
                  {batch.itemName}
                </td>

                {/* Category */}
                <td className="py-2.5 px-3 text-xs font-medium text-slate-600 dark:text-slate-300">
                  {batch.category}
                </td>

                {/* Temp */}
                <td className="py-2.5 px-3 font-mono">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white tabular-nums text-xs">
                    <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>{batch.temperature.toFixed(1)}°C</span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                    {batch.targetTemp}
                  </div>
                </td>

                {/* Quantity */}
                <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums text-sm">
                  {batch.currentQuantity} <span className="font-normal text-slate-400 dark:text-slate-500 text-xs">{batch.unit}</span>
                </td>

                {/* Expiry Date */}
                <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300 tabular-nums text-xs">
                  {batch.expiryDate}
                </td>

                {/* Days Left */}
                <td className="py-2.5 px-3 font-mono font-bold tabular-nums text-xs">
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
                <td className="py-2.5 px-3">
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wide font-mono",
                      batch.status === "FLASH_SALE"
                        ? "bg-rose-50 text-rose-600 border border-rose-200/80 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-900/60"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900/60"
                    )}
                  >
                    {batch.status}
                  </span>
                </td>

                {/* Location */}
                <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 text-xs">
                  {batch.location}
                </td>

                {/* Actions */}
                <td className="py-2.5 px-2 text-center">
                  <button className="size-7 inline-flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-[#182620] rounded transition-colors">
                    <MoreHorizontal size={15} />
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
