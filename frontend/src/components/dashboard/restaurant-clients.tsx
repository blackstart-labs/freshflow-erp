"use client";

import { ArrowUpRight, Crown } from "lucide-react";
import { RestaurantClient } from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface RestaurantClientsProps {
  clients: RestaurantClient[];
}

export function RestaurantClients({ clients }: RestaurantClientsProps) {
  const getTierBadge = (tier: RestaurantClient["tier"]) => {
    switch (tier) {
      case "GOLD":
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-amber-100 text-amber-800 border border-amber-300/60 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60">
            Gold Tier
          </span>
        );
      case "SILVER":
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-slate-100 text-slate-700 border border-slate-300/60 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800">
            Silver Tier
          </span>
        );
      case "PLATINUM":
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-teal-100 text-teal-800 border border-teal-300/60 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/60">
            Platinum Tier
          </span>
        );
      case "BRONZE":
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-orange-100 text-orange-800 border border-orange-300/60 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800/60">
            Bronze Tier
          </span>
        );
    }
  };

  return (
    <div className="rounded-lg border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-[#1b2b24] dark:bg-[#0e1512] flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1b2b24]/60">
        <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          Top Restaurant Clients
        </h3>
        <button className="flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300">
          <span>View All</span>
          <ArrowUpRight size={13} />
        </button>
      </div>

      {/* Ranked Clients List */}
      <div className="divide-y divide-slate-100 dark:divide-[#1b2b24]/50 mt-1">
        {clients.map((client) => (
          <div
            key={client.rank}
            className="py-2.5 flex items-center justify-between gap-2.5 hover:bg-slate-50/60 dark:hover:bg-[#121c17]/40 px-1 rounded transition-colors"
          >
            {/* Rank + Logo + Name */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-4 flex justify-center text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
                {client.rank === 1 ? (
                  <Crown size={14} className="text-amber-500 fill-amber-500" />
                ) : (
                  <span>{client.rank}</span>
                )}
              </div>

              {/* Logo / Brand Initial */}
              <div
                className="size-7 rounded-sm flex items-center justify-center text-[10px] font-black tracking-tight shrink-0 shadow-2xs border border-black/10"
                style={{
                  backgroundColor: client.logoBg,
                  color: client.logoTextColor,
                }}
              >
                {client.logoInitials}
              </div>

              {/* Name & Tier */}
              <div className="min-w-0">
                <div className="text-[12px] font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {client.name}
                </div>
                <div className="mt-0.5">{getTierBadge(client.tier)}</div>
              </div>
            </div>

            {/* Revenue + Delta */}
            <div className="text-right shrink-0 font-mono">
              <div className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                ৳ {client.revenue.toLocaleString()}
              </div>
              <div
                className={cn(
                  "text-[10px] font-semibold tabular-nums mt-0.5",
                  client.isPositive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                )}
              >
                {client.change}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
