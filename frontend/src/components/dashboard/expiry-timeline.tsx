"use client";

import { ExpiryDay } from "@/types/dashboard";

interface ExpiryTimelineProps {
  data: ExpiryDay[];
}

export function ExpiryTimeline({ data }: ExpiryTimelineProps) {
  const maxVal = 40;

  const getBarColor = (item: ExpiryDay) => {
    switch (item.urgency) {
      case "safe":
        return "#10b981"; // emerald
      case "moderate":
        return "#fbbf24"; // amber
      case "warning":
        return "#f97316"; // orange
      case "critical":
        return "#ef4444"; // red
    }
  };

  return (
    <div className="rounded-lg border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-[#1b2b24] dark:bg-[#0e1512] flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#1b2b24]/60">
        <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          Expiry Timeline (Next 7 Days)
        </h3>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
          Dec 17 – Dec 23
        </span>
      </div>

      {/* SVG Bar Chart with Y-axis and X-axis */}
      <div className="relative mt-2 h-36 flex flex-col justify-end">
        {/* Y Axis Grid lines */}
        <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-between pointer-events-none text-[9px] font-mono text-slate-400 dark:text-slate-600">
          {[40, 30, 20, 10, 0].map((tick) => (
            <div key={tick} className="flex items-center w-full">
              <span className="w-4 text-right pr-1 shrink-0">{tick}</span>
              <div className="flex-1 h-px bg-slate-100 dark:bg-[#1b2b24]/60" />
            </div>
          ))}
        </div>

        {/* Bars Container */}
        <div className="relative z-10 pl-5 pr-1 h-28 flex items-end justify-between gap-2">
          {data.map((item) => {
            const barHeightPct = (item.count / maxVal) * 100;
            const barColor = getBarColor(item);

            return (
              <div key={item.date} className="flex-1 flex flex-col items-center group h-full justify-end">
                {/* Count tooltip on hover */}
                <span className="text-[9.5px] font-mono font-semibold text-slate-700 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity mb-0.5 tabular-nums">
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
        <div className="pl-5 pr-1 flex items-center justify-between mt-1 pt-1 border-t border-slate-200 dark:border-[#1b2b24]">
          {data.map((item) => (
            <span
              key={item.date}
              className="text-[9.5px] font-mono text-slate-500 dark:text-slate-400 text-center flex-1"
            >
              {item.date}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
