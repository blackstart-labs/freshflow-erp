"use client";

import { Calendar, ChevronDown } from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { TemperaturePanel } from "@/components/dashboard/temperature-panel";
import { InventoryCategoryChart } from "@/components/dashboard/inventory-category-chart";
import { ExpiryTimeline } from "@/components/dashboard/expiry-timeline";
import { StockBatchesTable } from "@/components/dashboard/stock-batches-table";
import { RestaurantClients } from "@/components/dashboard/restaurant-clients";
import {
  dashboardMetrics,
  expiryTimeline,
  inventoryCategories,
  restaurantClients,
  stockBatches,
  temperatureZones,
} from "@/data/dashboard";

export default function OverviewPage() {
  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Overview
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Live view of inventory, orders, and cold-chain performance
          </p>
        </div>

        {/* Right Date and Range Controls */}
        <div className="flex items-center gap-2">
          {/* Date Picker Button */}
          <button className="h-8 flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-[#1b2b24] dark:bg-[#0e1512] dark:text-slate-200 dark:hover:bg-[#141f1a]">
            <Calendar size={13} className="text-slate-400" />
            <span className="font-mono text-[11.5px]">Tue, 17 Dec 2024</span>
          </button>

          {/* Period Dropdown Button */}
          <button className="h-8 flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-[#1b2b24] dark:bg-[#0e1512] dark:text-slate-200 dark:hover:bg-[#141f1a]">
            <span>Last 7 days</span>
            <ChevronDown size={13} className="text-slate-400" />
          </button>
        </div>
      </div>

      {/* Row 1: 4 KPI Telemetry Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {dashboardMetrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </section>

      {/* Row 2: Cold Storage Temp (40%) | Category Donut (30%) | Expiry Timeline (30%) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-5">
          <TemperaturePanel zones={temperatureZones} />
        </div>
        <div className="lg:col-span-4">
          <InventoryCategoryChart categories={inventoryCategories} />
        </div>
        <div className="lg:col-span-3">
          <ExpiryTimeline data={expiryTimeline} />
        </div>
      </section>

      {/* Row 3: Recent Stock Batches (70%) | Top Restaurant Clients (30%) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
        <div className="lg:col-span-8">
          <StockBatchesTable batches={stockBatches} />
        </div>
        <div className="lg:col-span-4">
          <RestaurantClients clients={restaurantClients} />
        </div>
      </section>
    </div>
  );
}
