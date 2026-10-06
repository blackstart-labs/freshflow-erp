import * as React from "react";
import { cn } from "@/lib/utils";

export type ClientTier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";

interface TierBadgeProps {
  tier: ClientTier;
  className?: string;
}

export function TierBadge({ tier, className }: TierBadgeProps) {
  const styles = {
    BRONZE:
      "border-amber-700/30 bg-amber-100/70 text-amber-900 dark:border-amber-800/40 dark:bg-amber-950/40 dark:text-amber-300",
    SILVER:
      "border-slate-400/30 bg-slate-200/60 text-slate-800 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300",
    GOLD:
      "border-yellow-600/40 bg-yellow-100/70 text-yellow-900 dark:border-yellow-600/30 dark:bg-yellow-950/40 dark:text-yellow-300",
    PLATINUM:
      "border-sky-500/40 bg-sky-100/70 text-sky-900 dark:border-sky-400/30 dark:bg-sky-950/40 dark:text-sky-200 ring-1 ring-sky-500/20",
  };

  const discounts = {
    BRONZE: "0%",
    SILVER: "-3%",
    GOLD: "-7%",
    PLATINUM: "-10%",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase select-none font-mono tabular-nums",
        styles[tier],
        className
      )}
    >
      <span>{tier}</span>
      <span className="opacity-70 font-normal">({discounts[tier]})</span>
    </span>
  );
}
