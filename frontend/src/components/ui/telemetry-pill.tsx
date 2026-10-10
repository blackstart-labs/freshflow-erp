import * as React from "react";
import { cn } from "@/lib/utils";

interface TelemetryPillProps {
  targetTemp: number;
  currentTemp: number;
  tolerance?: number;
  className?: string;
}

export function TelemetryPill({
  targetTemp,
  currentTemp,
  tolerance = 1.5,
  className,
}: TelemetryPillProps) {
  const diff = Math.abs(currentTemp - targetTemp);
  const isBreached = diff > tolerance;
  const isWarn = !isBreached && diff > tolerance * 0.6;

  const statusColor = isBreached
    ? "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400"
    : isWarn
    ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
    : "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-400";

  const dotColor = isBreached
    ? "bg-red-500 animate-pulse"
    : isWarn
    ? "bg-amber-500"
    : "bg-sky-500";

  const statusText = isBreached ? "BREACH" : isWarn ? "WARN" : "OK";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 font-mono text-[11px] font-medium tabular-nums select-none",
        statusColor,
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full shrink-0", dotColor)} />
      <span className="opacity-70">[{targetTemp.toFixed(1)}°C]</span>
      <span className="font-semibold">{currentTemp.toFixed(1)}°C</span>
      <span className="text-[9px] font-bold tracking-wider uppercase opacity-80">
        {statusText}
      </span>
    </div>
  );
}
