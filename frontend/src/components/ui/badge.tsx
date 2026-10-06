import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "destructive";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variantStyles = {
    default:
      "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border-transparent",
    secondary:
      "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-transparent",
    outline:
      "bg-transparent text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700",
    success:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-transparent",
    warning:
      "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-transparent",
    destructive:
      "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-transparent",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors select-none",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
