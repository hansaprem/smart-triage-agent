"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Activity,
  BarChart3,
  FileCheck2,
  HeartPulse,
  LayoutDashboard,
  PlusCircle,
  Settings,
  Users2,
  ShieldAlert,
  ChevronRight,
} from "lucide-react";

interface AppSidebarProps {
  onCloseMobile?: () => void;
}

export function AppSidebar({ onCloseMobile }: AppSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "New Assessment",
      href: "/assessment",
      icon: PlusCircle,
      highlight: true,
    },
    {
      name: "Patient Queue",
      href: "/queue",
      icon: Users2,
    },
    {
      name: "AI Insights",
      href: "/insights",
      icon: BarChart3,
    },
    {
      name: "Reports",
      href: "/reports",
      icon: FileCheck2,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="w-72 shrink-0 bg-white border-r border-[#E5E7EB] flex flex-col justify-between min-h-screen">
      {/* Brand & System Status */}
      <div>
        <div className="p-6 border-b border-[#E5E7EB]">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 group"
            onClick={onCloseMobile}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#047857] text-white shadow-sm transition-transform group-hover:scale-105">
              <HeartPulse className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black text-base tracking-tight text-[#1C2624]">
                  SMART TRIAGE
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#047857] bg-[#D1FAE5] px-1.5 py-0.5 rounded">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] uppercase tracking-wider font-semibold">
                Decision Support System
              </p>
            </div>
          </Link>

          {/* Operational Pill */}
          <div className="mt-5 flex items-center justify-between rounded-xl bg-[#F7F7F2] px-3.5 py-2.5 border border-[#E5E7EB] text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#047857]"></span>
              </span>
              <span className="font-bold text-[#1C2624] text-xs">AI System Active</span>
            </div>
            <span className="text-[11px] font-mono text-[#047857] font-bold">5/5 AGENTS</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1.5">
          <p className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#64748B]">
            Clinical Navigation
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all group",
                  isActive
                    ? "bg-[#D1FAE5]/70 text-[#065F46] font-bold shadow-sm"
                    : "text-[#64748B] hover:bg-[#F7F7F2] hover:text-[#1C2624]",
                  item.highlight && !isActive && "text-[#047857] font-bold"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isActive
                        ? "text-[#047857]"
                        : item.highlight
                        ? "text-[#047857]"
                        : "text-[#64748B] group-hover:text-[#1C2624]"
                    )}
                  />
                  <span>{item.name}</span>
                </div>
                {item.highlight && !isActive && (
                  <span className="rounded-full bg-[#D1FAE5] px-2 py-0.5 text-[10px] font-bold text-[#065F46]">
                    NEW
                  </span>
                )}
                {isActive && <ChevronRight className="h-4 w-4 text-[#047857]" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Clinician Card & Safety Notice */}
      <div className="p-5 border-t border-[#E5E7EB] space-y-3">
        {/* Clinician Identity */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F7F7F2] border border-[#E5E7EB]">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#065F46] text-white font-bold text-sm font-heading">
            DS
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-[#1C2624] truncate">Dr. Sarah Jenkins</p>
            <p className="text-xs text-[#64748B] truncate">Lead Emergency Physician</p>
          </div>
        </div>

        {/* Clinical Authority Disclaimer Reminder */}
        <div className="rounded-lg bg-[#FFFBEB] border border-[#FDE68A] p-2.5 text-[11px] text-amber-900 leading-snug flex items-start gap-2">
          <ShieldAlert className="h-4 w-4 text-[#F59E0B] shrink-0 mt-0.5" />
          <span>Decision support only. Final clinical authority remains with MD.</span>
        </div>
      </div>
    </aside>
  );
}
