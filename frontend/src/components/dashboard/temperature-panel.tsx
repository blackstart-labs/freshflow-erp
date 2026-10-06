"use client";

import { Leaf, Snowflake, Thermometer } from "lucide-react";
import { TemperatureZone } from "@/types/dashboard";

interface TemperaturePanelProps {
  zones: TemperatureZone[];
}

export function TemperaturePanel({ zones }: TemperaturePanelProps) {
  const getZoneIcon = (type: TemperatureZone["type"]) => {
    switch (type) {
      case "freeze":
        return <Snowflake size={14} className="text-sky-600 dark:text-sky-400" />;
      case "chilled":
        return <Thermometer size={14} className="text-teal-600 dark:text-teal-400" />;
      case "ambient":
        return <Leaf size={14} className="text-emerald-600 dark:text-emerald-400" />;
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
    <div className="rounded-lg border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-[#1b2b24] dark:bg-[#0e1512] flex flex-col justify-between">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-[#1b2b24]/60">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Cold Storage Temperature
          </h3>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9.5px] font-semibold text-emerald-600 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </div>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
          Last updated: 2 min ago
        </span>
      </div>

      {/* 3 Temperature Zones */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className="rounded-md border border-slate-200/70 bg-slate-50/50 p-2.5 dark:border-[#1b2b24] dark:bg-[#121c17]/60 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5">
                <div
                  className={`size-5 rounded-full border flex items-center justify-center shrink-0 ${getZoneIconBg(
                    zone.type
                  )}`}
                >
                  {getZoneIcon(zone.type)}
                </div>
                <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate">
                  {zone.name}
                </span>
              </div>

              <div className="mt-2 flex items-baseline justify-between">
                <div>
                  <div className="font-mono text-lg font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">
                    {zone.currentTemp.toFixed(1)}°C
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                    {zone.targetTemp}
                  </div>
                </div>

                <span className="rounded-xs bg-emerald-100/70 text-emerald-700 border border-emerald-300/50 px-1.5 py-0.5 text-[9px] font-semibold dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/60">
                  Compliant
                </span>
              </div>
            </div>

            {/* Sparkline Wave */}
            <div className="mt-2 pt-1">
              <svg className="w-full h-7 overflow-visible" viewBox="0 0 120 28" preserveAspectRatio="none">
                <defs>
                  <linearGradient id={`grad-${zone.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d={`M 0,${28 - zone.sparkline[0]} ` +
                    zone.sparkline
                      .map((pt, i) => `L ${(i * 120) / (zone.sparkline.length - 1)},${28 - pt}`)
                      .join(" ")}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={`M 0,${28 - zone.sparkline[0]} ` +
                    zone.sparkline
                      .map((pt, i) => `L ${(i * 120) / (zone.sparkline.length - 1)},${28 - pt}`)
                      .join(" ") +
                    " L 120,28 L 0,28 Z"}
                  fill={`url(#grad-${zone.id})`}
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
