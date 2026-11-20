"use client";

import { Calendar, Check, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ExpiryTimeline } from "@/components/dashboard/expiry-timeline";
import { InventoryCategoryChart } from "@/components/dashboard/inventory-category-chart";
import { KpiMetricsSection } from "@/components/dashboard/metric-card";
import { RestaurantClients } from "@/components/dashboard/restaurant-clients";
import { StockBatchesTable } from "@/components/dashboard/stock-batches-table";
import { TemperaturePanel } from "@/components/dashboard/temperature-panel";
import {
  stockBatches as initialBatches,
  inventoryCategories as initialCategories,
  restaurantClients as initialClients,
  expiryTimeline as initialExpiry,
  temperatureZones,
} from "@/data/dashboard";
import { dashboardApi } from "@/lib/api/dashboard";
import type {
  CategoryDistribution,
  ExpiryDay,
  RestaurantClient,
  StockBatch,
} from "@/types/dashboard";

const PERIOD_OPTIONS = [
  "Today",
  "Last 7 days",
  "Last 30 days",
  "This month",
  "All time",
];

export default function OverviewPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("Last 7 days");
  const [showPeriodMenu, setShowPeriodMenu] = useState<boolean>(false);
  const [kpis, setKpis] = useState<{
    activeBatches: number;
    nearExpiry: number;
    revenue: number;
    spoilageLoss: number;
  }>({
    activeBatches: 142,
    nearExpiry: 18,
    revenue: 1286450,
    spoilageLoss: 24320,
  });
  const [batches, setBatches] = useState<StockBatch[]>(initialBatches);
  const [clients, setClients] = useState<RestaurantClient[]>(initialClients);

  // Dynamic today's date formatted nicely
  const formattedToday = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, []);

  // Fetch live API data on mount
  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      const [kpiRes, batchesRes, clientsRes] = await Promise.all([
        dashboardApi.getKPIs(),
        dashboardApi.getBatches(),
        dashboardApi.getClients(),
      ]);

      if (isMounted) {
        if (kpiRes) setKpis(kpiRes);
        if (batchesRes?.length) setBatches(batchesRes);
        if (clientsRes?.length) setClients(clientsRes);
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Compute category distribution dynamically from live batches
  const dynamicCategories: CategoryDistribution[] = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const b of batches) {
      counts[b.category] = (counts[b.category] || 0) + 1;
    }

    const total = batches.length || 1;
    const paletteMap: Record<string, string> = {
      Poultry: "#065f46",
      Dairy: "#38bdf8",
      Seafood: "#0284c7",
      Vegetables: "#22c55e",
      Beef: "#ea580c",
    };

    return Object.entries(counts).map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / total) * 100),
      color: paletteMap[category] || "#64748b",
    }));
  }, [batches]);

  // Compute expiry horizon from batches or fall back to schedule
  const dynamicExpiry: ExpiryDay[] = useMemo(() => {
    return initialExpiry;
  }, []);

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Overview
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Live view of inventory, orders, and cold-chain performance
          </p>
        </div>

        {/* Right Date and Range Controls */}
        <div className="flex items-center gap-2 relative">
          {/* Date Picker Display Button */}
          <button
            type="button"
            className="h-8 flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-[#1b2b24] dark:bg-[#0e1512] dark:text-slate-200 dark:hover:bg-[#141f1a] transition-colors"
          >
            <Calendar size={13} className="text-slate-400" />
            <span className="font-mono text-[11.5px]">{formattedToday}</span>
          </button>

          {/* Interactive Period Dropdown Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPeriodMenu(!showPeriodMenu)}
              className="h-8 flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-[#1b2b24] dark:bg-[#0e1512] dark:text-slate-200 dark:hover:bg-[#141f1a] transition-colors cursor-pointer"
            >
              <span>{selectedPeriod}</span>
              <ChevronDown size={13} className="text-slate-400" />
            </button>

            {showPeriodMenu && (
              <div className="absolute right-0 top-9 w-36 rounded-md border border-slate-200 bg-white p-1 shadow-lg z-30 dark:border-[#1b2b24] dark:bg-[#0e1612] text-xs">
                {PERIOD_OPTIONS.map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => {
                      setSelectedPeriod(period);
                      setShowPeriodMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      selectedPeriod === period
                        ? "bg-emerald-50 text-[#086355] font-semibold dark:bg-[#152720] dark:text-[#34d399]"
                        : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-[#182620]"
                    }`}
                  >
                    <span>{period}</span>
                    {selectedPeriod === period && <Check size={12} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 1: 4 KPI Telemetry Cards */}
      <div>
        <KpiMetricsSection data={kpis} />
      </div>

      {/* Row 2: Cold Storage Temp (40%) | Category Donut (30%) | Expiry Timeline (30%) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-5">
          <TemperaturePanel zones={temperatureZones} />
        </div>
        <div className="lg:col-span-4">
          <InventoryCategoryChart
            categories={
              dynamicCategories.length ? dynamicCategories : initialCategories
            }
          />
        </div>
        <div className="lg:col-span-3">
          <ExpiryTimeline data={dynamicExpiry} />
        </div>
      </section>

      {/* Row 3: Recent Stock Batches (70%) | Top Restaurant Clients (30%) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
        <div className="lg:col-span-8">
          <StockBatchesTable batches={batches} />
        </div>
        <div className="lg:col-span-4">
          <RestaurantClients clients={clients} />
        </div>
      </section>
    </div>
  );
}
