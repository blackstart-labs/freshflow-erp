"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Flame,
  LayoutDashboard,
  Package,
  Snowflake,
  Trash2,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavGroup {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  items: { label: string; href: string }[];
}

const navGroups: NavGroup[] = [
  {
    title: "Inventory",
    icon: Package,
    items: [
      { label: "Stock Batches", href: "/inventory" },
      { label: "Receive Stock", href: "/inventory/receive" },
      { label: "Temperature Logs", href: "/inventory/temperature" },
    ],
  },
  {
    title: "Orders",
    icon: ClipboardList,
    items: [
      { label: "Create Order", href: "/orders/create" },
      { label: "Challans", href: "/orders/challans" },
      { label: "Order History", href: "/orders/history" },
    ],
  },
  {
    title: "Customers",
    icon: Users,
    items: [
      { label: "Restaurants", href: "/customers" },
      { label: "Client Tiers", href: "/customers/tiers" },
      { label: "Credit & Ledger", href: "/customers/ledger" },
    ],
  },
  {
    title: "Wastage",
    icon: Trash2,
    items: [
      { label: "Spoilage Logs", href: "/wastage" },
      { label: "Write-offs", href: "/wastage/write-offs" },
      { label: "Flash Sale", href: "/wastage/flash-sale" },
    ],
  },
  {
    title: "Analytics",
    icon: BarChart3,
    items: [
      { label: "Demand Forecast", href: "/analytics" },
      { label: "Supplier Performance", href: "/analytics/suppliers" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Inventory: true,
    Orders: false,
    Customers: false,
    Wastage: false,
    Analytics: false,
  });

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <aside className="w-[196px] shrink-0 bg-[#063c35] text-emerald-50 flex flex-col justify-between min-h-screen border-r border-[#084b42] select-none">
      <div>
        {/* Brand Header */}
        <div className="h-14 px-3.5 flex items-center gap-2.5 border-b border-[#0b4e45]">
          <div className="size-6 relative shrink-0">
            <Image
              src="/logo.png"
              alt="FreshFlow"
              width={24}
              height={24}
              className="object-contain"
              priority
            />
          </div>
          <div className="leading-tight overflow-hidden">
            <div className="font-bold text-[13px] tracking-tight text-white flex items-center">
              Fresh<span className="text-[#34d399]">Flow</span>
            </div>
            <div className="text-[9.5px] text-emerald-200/60 font-medium tracking-tight truncate">
              Cold Chain Supply CRM
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-2 space-y-1">
          {/* Overview Link */}
          <Link
            href="/overview"
            className={cn(
              "flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] font-medium transition-colors",
              pathname === "/overview" || pathname === "/"
                ? "bg-[#0b5349] text-white shadow-xs"
                : "text-emerald-100/70 hover:bg-[#09473e] hover:text-white"
            )}
          >
            <LayoutDashboard size={15} className="shrink-0 text-[#34d399]" />
            <span>Overview</span>
          </Link>

          {/* Collapsible Groups */}
          {navGroups.map((group) => {
            const Icon = group.icon;
            const isOpen = openGroups[group.title];

            return (
              <div key={group.title} className="space-y-0.5 pt-0.5">
                <button
                  onClick={() => toggleGroup(group.title)}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[12px] font-medium text-emerald-100/80 hover:bg-[#09473e] hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Icon size={15} className="shrink-0 opacity-80" />
                    <span>{group.title}</span>
                  </div>
                  {isOpen ? (
                    <ChevronDown size={13} className="opacity-60" />
                  ) : (
                    <ChevronRight size={13} className="opacity-60" />
                  )}
                </button>

                {isOpen && (
                  <div className="pl-6 pr-1 space-y-0.5 py-0.5">
                    {group.items.map((sub) => {
                      const isSubActive = pathname === sub.href;
                      return (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className={cn(
                            "block px-2 py-1 rounded text-[11px] transition-colors",
                            isSubActive
                              ? "bg-[#0d6155] text-white font-medium"
                              : "text-emerald-200/60 hover:text-white hover:bg-[#09473e]/50"
                          )}
                        >
                          {sub.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Cold Storage Telemetry Widget */}
      <div className="p-2.5 m-2 rounded-md bg-[#042d28] border border-[#094f45]">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded bg-[#0b5a50] flex items-center justify-center text-[#2dd4bf] shrink-0">
            <Snowflake size={15} />
          </div>
          <div className="overflow-hidden">
            <div className="text-[10px] text-emerald-200/70 font-medium leading-none">
              Cold Storage Status
            </div>
            <div className="font-mono text-sm font-bold text-white tracking-tight mt-0.5 tabular-nums">
              -18.2°C
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-2 pt-1.5 border-t border-[#094f45]/60 text-[9.5px] text-emerald-300/80 font-medium">
          <span className="size-1.5 rounded-full bg-[#10b981] animate-pulse" />
          <span>All zones stable</span>
        </div>
      </div>
    </aside>
  );
}
