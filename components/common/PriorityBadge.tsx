import React from "react";
import { PriorityLevel } from "@/types/triage";
import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";

interface PriorityBadgeProps {
  priority: PriorityLevel;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

export function PriorityBadge({
  priority,
  size = "md",
  showIcon = true,
  className,
}: PriorityBadgeProps) {
  const configs = {
    CRITICAL: {
      bg: "bg-triage-criticalBg text-triage-critical border-triage-criticalBorder",
      dot: "bg-triage-critical shadow-[0_0_8px_rgba(239,68,68,0.5)]",
      icon: AlertCircle,
      label: "CRITICAL",
    },
    URGENT: {
      bg: "bg-triage-urgentBg text-triage-urgent border-triage-urgentBorder",
      dot: "bg-triage-urgent shadow-[0_0_8px_rgba(245,158,11,0.5)]",
      icon: AlertTriangle,
      label: "URGENT",
    },
    "NON-URGENT": {
      bg: "bg-triage-nonUrgentBg text-triage-nonUrgent border-triage-nonUrgentBorder",
      dot: "bg-triage-nonUrgent shadow-[0_0_8px_rgba(16,185,129,0.5)]",
      icon: CheckCircle2,
      label: "NON-URGENT",
    },
  };

  const config = configs[priority] || configs["NON-URGENT"];
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs font-semibold gap-1.5",
    md: "px-2.5 py-1 text-xs font-bold gap-1.5 tracking-wide",
    lg: "px-4 py-2 text-sm font-bold gap-2 tracking-wide",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border transition-colors",
        config.bg,
        sizeClasses[size],
        className
      )}
    >
      <span className={cn("rounded-full", config.dot, size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2")} />
      {showIcon && <Icon className={size === "sm" ? "w-3 h-3" : size === "md" ? "w-3.5 h-3.5" : "w-4 h-4"} />}
      <span>{config.label}</span>
    </span>
  );
}
