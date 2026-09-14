import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "default" | "critical" | "urgent" | "nonUrgent" | "emerald";
  trend?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default",
  trend,
  className,
}: StatCardProps) {
  const variantStyles = {
    default: {
      card: "border-[#E5E7EB] hover:border-slate-300",
      iconBg: "bg-[#F7F7F2] text-[#64748B]",
      valueColor: "text-[#1C2624]",
      badge: "bg-slate-100 text-slate-700",
    },
    critical: {
      card: "border-[#FECACA] hover:border-red-300 bg-gradient-to-br from-white to-[#FEF2F2]/60 shadow-sm",
      iconBg: "bg-[#FEF2F2] text-[#EF4444]",
      valueColor: "text-[#EF4444]",
      badge: "bg-red-100 text-red-800",
    },
    urgent: {
      card: "border-[#FDE68A] hover:border-amber-300 bg-gradient-to-br from-white to-[#FFFBEB]/60 shadow-sm",
      iconBg: "bg-[#FFFBEB] text-[#F59E0B]",
      valueColor: "text-[#F59E0B]",
      badge: "bg-amber-100 text-amber-800",
    },
    nonUrgent: {
      card: "border-[#A7F3D0] hover:border-emerald-300 bg-gradient-to-br from-white to-[#ECFDF5]/60 shadow-sm",
      iconBg: "bg-[#ECFDF5] text-[#10B981]",
      valueColor: "text-[#10B981]",
      badge: "bg-emerald-100 text-emerald-800",
    },
    emerald: {
      card: "border-[#D1FAE5] hover:border-emerald-300 bg-gradient-to-br from-white to-[#ECFDF5]/60 shadow-sm",
      iconBg: "bg-[#D1FAE5] text-[#047857]",
      valueColor: "text-[#065F46]",
      badge: "bg-emerald-100 text-[#065F46]",
    },
  };

  const style = variantStyles[variant] || variantStyles.default;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-white p-6 lg:p-7 shadow-sm transition-all duration-200 hover:shadow-md",
        style.card,
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs lg:text-sm font-bold uppercase tracking-wider text-[#64748B]">
          {title}
        </span>
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", style.iconBg)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-5 flex items-baseline justify-between">
        <div className={cn("text-4xl lg:text-5xl font-black tracking-tight font-heading", style.valueColor)}>
          {value}
        </div>
        {trend && (
          <span className={cn("text-xs font-bold px-2.5 py-1 rounded-full", style.badge)}>
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2.5 text-xs lg:text-sm text-[#64748B] font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
}
