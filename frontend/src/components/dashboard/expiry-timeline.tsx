"use client";

import { ExpiryDay } from "@/types/dashboard";

interface ExpiryTimelineProps {
  data: ExpiryDay[];
}

export function ExpiryTimeline({ data }: ExpiryTimelineProps) {
  const maxVal = 40;

  const getBarColor = (item: ExpiryDay) => {
    switch (item.date) {
      case "17 Dec":
        return "#10b981"; // emerald
      case "18 Dec":
        return "#34d399"; // light mint green
      case "19 Dec":
        return "#fbbf24"; // golden amber
      case "20 Dec":
        return "#f87171"; // coral red
      case "21 Dec":
        return "#fb7185"; // rose
      case "22 Dec":
        return "#ef4444"; // red
      case "23 Dec":
        return "#dc2626"; // deep red
      default:
        return "#10b981";
    }
  };

  return (
    <div className="rounded-lg border border-slate-200/80 bg-white p-4 shadow-xs dark:border-[#1b2b24] dark:bg-[#0e1512] flex flex-col justify-between transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1b2b24]">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Expiry Timeline (Next 7 Days)
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          Dec 17 – Dec 23
        </span>
      </div>

      {/* SVG Bar Chart with Y-axis and X-axis */}
      <div className="relative mt-3 h-36 flex flex-col justify-end">
        {/* Y Axis Grid lines */}
        <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-between pointer-events-none text-[11px] font-mono text-slate-500 dark:text-slate-400">
          {[40, 30, 20, 10, 0].map((tick) => (
            <div key={tick} className="flex items-center w-full">
              <span className="w-5 text-right pr-1 shrink-0">{tick}</span>
              <div className="flex-1 h-px bg-slate-100 dark:bg-[#1b2b24]" />
            </div>
          ))}
        </div>

        {/* Bars Container */}
        <div className="relative z-10 pl-6 pr-1 h-28 flex items-end justify-between gap-2">
          {data.map((item) => {
            const barHeightPct = (item.count / maxVal) * 100;
            const barColor = getBarColor(item);

            return (
              <div key={item.date} className="flex-1 flex flex-col items-center group h-full justify-end">
                {/* Count tooltip on hover */}
                <span className="text-xs font-mono font-bold text-slate-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity mb-0.5 tabular-nums">
                  {item.count}
                </span>

                {/* Vertical Bar */}
                <div
                  className="w-full max-w-[20px] rounded-t-xs transition-all duration-200 group-hover:brightness-110"
                  style={{
                    height: `${barHeightPct}%`,
                    backgroundColor: barColor,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* X Axis Labels */}
        <div className="pl-6 pr-1 flex items-center justify-between mt-1 pt-1.5 border-t border-slate-200 dark:border-[#1b2b24]">
          {data.map((item) => (
            <span
              key={item.date}
              className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 text-center flex-1"
            >
              {item.date}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
