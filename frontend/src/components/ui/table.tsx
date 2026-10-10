import * as React from "react";
import { cn } from "@/lib/utils";

export function Table({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="relative w-full overflow-auto rounded-md border border-slate-200 dark:border-[#1e2230]">
      <table
        className={cn("w-full caption-bottom text-left border-collapse", className)}
        {...props}
      />
    </div>
  );
}

export function TableHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn("border-b border-slate-200 bg-slate-100/70 dark:border-[#1e2230] dark:bg-[#161922]", className)}
      {...props}
    />
  );
}

export function TableBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cn("divide-y divide-slate-200/60 dark:divide-[#1e2230]/60 bg-white dark:bg-[#0f1117]", className)}
      {...props}
    />
  );
}

export function TableRow({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "h-10 transition-colors hover:bg-slate-50 dark:hover:bg-[#161922]/70",
        className
      )}
      {...props}
    />
  );
}

export function TableHead({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "h-8 px-3 py-1.5 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400 select-none",
        className
      )}
      {...props}
    />
  );
}

export function TableCell({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        "px-3 py-2 text-[13px] text-slate-900 dark:text-slate-100 align-middle",
        className
      )}
      {...props}
    />
  );
}
