import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface VitalSignInputProps {
  label: string;
  unit: string;
  value: number | string;
  onChange: (val: number) => void;
  normalRange: string;
  min?: number;
  max?: number;
  step?: number;
  isAbnormal?: boolean;
  isCritical?: boolean;
  icon?: React.ReactNode;
}

export function VitalSignInput({
  label,
  unit,
  value,
  onChange,
  normalRange,
  min,
  max,
  step = 1,
  isAbnormal = false,
  isCritical = false,
  icon,
}: VitalSignInputProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-5 transition-all duration-200 bg-white shadow-sm",
        isCritical
          ? "border-[#EF4444] bg-[#FEF2F2]/40 ring-1 ring-[#EF4444]/20"
          : isAbnormal
          ? "border-[#F59E0B] bg-[#FFFBEB]/40 ring-1 ring-[#F59E0B]/20"
          : "border-[#E5E7EB] hover:border-slate-300"
      )}
    >
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[#1C2624] uppercase tracking-wider flex items-center gap-2">
          {icon}
          <span>{label}</span>
        </label>
        <span className="text-[11px] text-[#64748B] bg-[#F7F7F2] px-2.5 py-1 rounded-md font-mono border border-[#E5E7EB]">
          Ref: {normalRange}
        </span>
      </div>

      <div className="mt-4 relative flex items-baseline">
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className={cn(
            "w-full text-2xl sm:text-3xl font-extrabold font-mono bg-transparent outline-none border-b-2 transition-colors py-1.5",
            isCritical
              ? "border-[#EF4444] text-[#EF4444]"
              : isAbnormal
              ? "border-[#F59E0B] text-[#F59E0B]"
              : "border-[#E5E7EB] text-[#1C2624] focus:border-[#047857]"
          )}
        />
        <span className="absolute right-1 bottom-3 text-xs sm:text-sm font-bold text-[#64748B]">
          {unit}
        </span>
      </div>

      {isCritical && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs font-bold text-[#EF4444]">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>Critical physiological deviation</span>
        </div>
      )}
      {!isCritical && isAbnormal && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs font-bold text-[#F59E0B]">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>Outside baseline reference</span>
        </div>
      )}
    </div>
  );
}
