"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Clock,
  Menu,
  Plus,
  Sparkles,
} from "lucide-react";

interface AppHeaderProps {
  onOpenMobileMenu?: () => void;
  title?: string;
  subtitle?: string;
}

export function AppHeader({ onOpenMobileMenu, title, subtitle }: AppHeaderProps) {
  const pathname = usePathname();
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getHeaderInfo = () => {
    if (title) return { title, subtitle: subtitle || "" };
    if (pathname === "/dashboard") {
      return {
        title: "Good Morning, Dr. Sarah",
        subtitle: "Emergency Department Overview",
      };
    }
    if (pathname === "/assessment") {
      return {
        title: "New Patient Assessment",
        subtitle: "Enter patient information and clinical data.",
      };
    }
    if (pathname === "/analysis") {
      return {
        title: "AI Triage Engine",
        subtitle: "Analyzing Patient Case",
      };
    }
    if (pathname === "/result") {
      return {
        title: "AI Triage Result",
        subtitle: "AI-Powered Emergency Decision Support System",
      };
    }
    if (pathname === "/review") {
      return {
        title: "Human Clinical Review",
        subtitle: "AI-Powered Emergency Decision Support System",
      };
    }
    if (pathname === "/queue") {
      return {
        title: "Patient Queue",
        subtitle: "Real-time emergency department monitoring",
      };
    }
    if (pathname === "/insights") {
      return {
        title: "AI Insights",
        subtitle: "System performance and patient analysis overview.",
      };
    }
    if (pathname?.startsWith("/reports")) {
      return {
        title: "Emergency Triage Summary Report",
        subtitle: "AI-Powered Emergency Decision Support System",
      };
    }
    if (pathname === "/settings") {
      return {
        title: "Settings",
        subtitle: "System configurations and personal preferences",
      };
    }
    return {
      title: "Smart Triage Agent",
      subtitle: "AI-Powered Emergency Decision Support System",
    };
  };

  const header = getHeaderInfo();

  return (
    <header className="sticky top-0 z-30 flex h-20 lg:h-22 w-full items-center justify-between border-b border-[#E5E7EB] bg-white/95 px-6 lg:px-10 backdrop-blur-md">
      {/* Left: Mobile Toggle & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobileMenu}
          className="rounded-xl p-2.5 text-[#64748B] hover:bg-[#F7F7F2] lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div>
          <h1 className="text-xl lg:text-2xl font-black font-heading text-[#1C2624] tracking-tight">
            {header.title}
          </h1>
          {header.subtitle && (
            <p className="text-xs lg:text-sm text-[#64748B] font-medium mt-0.5 hidden sm:block">
              {header.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Operational Status, ED Clock, & Primary Action */}
      <div className="flex items-center gap-3 lg:gap-5">
        {/* Live ED Clock */}
        <div className="hidden xl:flex items-center gap-2 rounded-xl bg-[#F7F7F2] border border-[#E5E7EB] px-3.5 py-2 text-xs font-mono text-[#64748B]">
          <Clock className="h-4 w-4 text-[#047857]" />
          <span className="font-bold text-slate-800">{time || "10:30:00 AM"}</span>
          <span className="text-[10px] text-[#64748B] font-sans font-semibold border-l pl-2 border-[#E5E7EB]">
            ED-1 RESUSCITATION
          </span>
        </div>

        {/* AI System Operational Badge */}
        <div className="flex items-center gap-2 rounded-full bg-[#D1FAE5]/80 border border-[#A7F3D0] px-4 py-1.5 text-xs font-bold text-[#065F46]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#047857]"></span>
          </span>
          <span className="hidden sm:inline">AI System Operational</span>
          <span className="sm:hidden">Operational</span>
        </div>

        {/* New Assessment Action Button */}
        {pathname !== "/assessment" && (
          <Link
            href="/assessment"
            className="flex items-center gap-2 rounded-xl bg-[#047857] px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-[#047857]/20 hover:bg-[#065F46] active:scale-[0.98] transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>+ New Assessment</span>
          </Link>
        )}
      </div>
    </header>
  );
}
