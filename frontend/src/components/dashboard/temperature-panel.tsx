"use client";

import { Leaf, RefreshCw, Snowflake, Thermometer } from "lucide-react";
import { useState } from "react";
import type { TemperatureZone } from "@/types/dashboard";

interface TemperaturePanelProps {
  zones: TemperatureZone[];
  onRefresh?: () => void;
}

export function TemperaturePanel({
  zones: initialZones,
}: TemperaturePanelProps) {
  const [zones, setZones] = useState<TemperatureZone[]>(initialZones);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastAuditText, setLastAuditText] = useState("Live audit: Just now");

  const handleAuditRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Simulate real-time sensor audit jitter within safe tolerance
      setZones((prev) =>
        prev.map((zone) => {
          const jitter = (Math.random() - 0.5) * 0.4;
          const newTemp = parseFloat((zone.currentTemp + jitter).toFixed(1));
          return {
            ...zone,
            currentTemp: newTemp,
          };
        }),
      );
      const now = new Date();
      setLastAuditText(
        `Audited: ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`,
      );
      setIsRefreshing(false);
    }, 400);
  };

  const getZoneIcon = (type: TemperatureZone["type"]) => {
    switch (type) {
      case "freeze":
        return (
          <Snowflake size={14} className="text-sky-600 dark:text-sky-400" />
        );
      case "chilled":
        return (
          <Thermometer size={14} className="text-teal-600 dark:text-teal-400" />
        );
      case "ambient":
        return (
          <Leaf size={14} className="text-emerald-600 dark:text-emerald-400" />
        );
    }
  };

  const getZoneIconBg = (type: TemperatureZone["type"]) => {
    switch (type) {
      case "freeze":
        return "bg-sky-50 dark:bg-sky-950/40 text-sky-600 border-sky-200/60 dark:border-sky-800/40";
      case "chilled":
        return "bg-teal-50 dark:bg-teal-950/40 text-teal-600 border-teal-200/60 dark:border-teal-800/40";
      case "ambient":
        return "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border-emerald-200/60 dark:border-emerald-800/40";
    }
  };

  return (
    <div className="rounded-lg border border-slate-200/80 bg-white p-4 shadow-xs dark:border-[#1b2b24] dark:bg-[#0e1512] flex flex-col justify-between transition-colors duration-200">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1b2b24]">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Cold storage temperature
          </h3>
          <button
            type="button"
            onClick={handleAuditRefresh}
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200/70 hover:bg-emerald-100/60 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/50 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
            title="Click to perform an on-demand temperature telemetry audit"
          >
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span>Live</span>
            <RefreshCw
              size={10}
              className={`text-emerald-600 dark:text-emerald-400 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          {lastAuditText}
        </span>
      </div>

      {/* 3 Temperature Zones */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className="rounded-md border border-slate-200/70 bg-slate-50/70 p-3 dark:border-[#1b2b24] dark:bg-[#121c17] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5">
                <div
                  className={`size-5 rounded-full border flex items-center justify-center shrink-0 ${getZoneIconBg(
                    zone.type,
                  )}`}
                >
                  {getZoneIcon(zone.type)}
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {zone.name}
                </span>
              </div>

              <div className="mt-2.5 flex items-baseline justify-between">
                <div>
                  <div className="font-mono text-xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">
                    {zone.currentTemp > 0
                      ? `+${zone.currentTemp.toFixed(1)}`
                      : zone.currentTemp.toFixed(1)}
                    °C
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    {zone.targetTemp}
                  </div>
                </div>

                <span className="rounded bg-emerald-100/80 text-emerald-700 border border-emerald-300/60 px-1.5 py-0.5 text-[11px] font-semibold dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60">
                  Compliant
                </span>
              </div>
            </div>

            {/* Sparkline Wave */}
            <div className="mt-2 pt-1">
              <svg
                className="w-full h-7 overflow-visible"
                viewBox="0 0 120 28"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 14 Q 15 8, 30 16 T 60 12 T 90 18 T 120 13"
                  fill="none"
                  stroke={
                    zone.type === "freeze"
                      ? "#38bdf8"
                      : zone.type === "chilled"
                        ? "#14b8a6"
                        : "#22c55e"
                  }
                  strokeWidth="1.75"
                  className="opacity-80"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
