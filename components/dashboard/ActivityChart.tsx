"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

const hourlyData = [
  { time: "06:00", critical: 0, urgent: 2, nonUrgent: 4, total: 6 },
  { time: "08:00", critical: 1, urgent: 4, nonUrgent: 7, total: 12 },
  { time: "10:00", critical: 3, urgent: 6, nonUrgent: 9, total: 18 },
  { time: "12:00", critical: 2, urgent: 8, nonUrgent: 11, total: 21 },
  { time: "14:00", critical: 4, urgent: 10, nonUrgent: 12, total: 26 },
  { time: "16:00", critical: 3, urgent: 9, nonUrgent: 14, total: 26 },
  { time: "18:00", critical: 2, urgent: 7, nonUrgent: 12, total: 21 },
  { time: "20:00", critical: 1, urgent: 5, nonUrgent: 8, total: 14 },
];

export function ActivityChart() {
  const [activeIdx, setActiveIdx] = useState<number | null>(4); // default 14:00 peak
  const maxTotal = 30;

  return (
    <div className="rounded-xl border border-clinical-border bg-white p-5 shadow-clinical">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-clinical-border/60">
        <div>
          <h3 className="text-sm font-bold text-clinical-text font-heading">
            Patient Activity & Triage Flow
          </h3>
          <p className="text-xs text-clinical-secondary">
            Today's hourly admission trend across triage acuity tiers
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-triage-critical" />
            <span className="text-clinical-secondary text-[11px] font-semibold">Critical</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-triage-urgent" />
            <span className="text-clinical-secondary text-[11px] font-semibold">Urgent</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-triage-nonUrgent" />
            <span className="text-clinical-secondary text-[11px] font-semibold">Non-Urgent</span>
          </div>
        </div>
      </div>

      {/* Interactive Bar/Trend Visualizer */}
      <div className="mt-6">
        <div className="h-44 w-full flex items-end justify-between gap-2 sm:gap-4 px-2">
          {hourlyData.map((item, index) => {
            const isHovered = activeIdx === index;
            const criticalHeight = (item.critical / maxTotal) * 100;
            const urgentHeight = (item.urgent / maxTotal) * 100;
            const nonUrgentHeight = (item.nonUrgent / maxTotal) * 100;

            return (
              <div
                key={item.time}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                onMouseEnter={() => setActiveIdx(index)}
              >
                {/* Tooltip trigger indicator */}
                <div
                  className={cn(
                    "text-[10px] font-bold font-mono px-1.5 py-0.5 rounded mb-1 transition-all",
                    isHovered
                      ? "bg-slate-900 text-white opacity-100 transform -translate-y-1 shadow-sm"
                      : "opacity-0"
                  )}
                >
                  {item.total} pts
                </div>

                {/* Stacked Bar Container */}
                <div
                  className={cn(
                    "w-full max-w-[36px] rounded-t-lg overflow-hidden flex flex-col-reverse transition-all duration-200",
                    isHovered ? "ring-2 ring-emerald-primary ring-offset-1" : "hover:opacity-90"
                  )}
                  style={{ height: `${(item.total / maxTotal) * 100}%` }}
                >
                  {/* Non-Urgent portion */}
                  <div
                    style={{ height: `${(item.nonUrgent / item.total) * 100}%` }}
                    className="bg-triage-nonUrgent transition-all"
                  />
                  {/* Urgent portion */}
                  <div
                    style={{ height: `${(item.urgent / item.total) * 100}%` }}
                    className="bg-triage-urgent transition-all"
                  />
                  {/* Critical portion */}
                  <div
                    style={{ height: `${(item.critical / item.total) * 100}%` }}
                    className="bg-triage-critical transition-all"
                  />
                </div>

                {/* Time Axis */}
                <span
                  className={cn(
                    "mt-2 text-[10px] font-mono transition-colors",
                    isHovered ? "text-emerald-primary font-bold" : "text-clinical-secondary"
                  )}
                >
                  {item.time}
                </span>
              </div>
            );
          })}
        </div>

        {/* Selected Hour Summary Pill */}
        {activeIdx !== null && (
          <div className="mt-4 pt-3 border-t border-clinical-border/50 flex flex-wrap items-center justify-between text-xs bg-ivory-50/60 rounded-lg p-2 px-3">
            <span className="font-semibold text-clinical-text">
              Selected Window: <strong className="font-mono text-emerald-primary">{hourlyData[activeIdx].time}</strong>
            </span>
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span className="text-triage-critical font-bold">
                Critical: {hourlyData[activeIdx].critical}
              </span>
              <span className="text-triage-urgent font-bold">
                Urgent: {hourlyData[activeIdx].urgent}
              </span>
              <span className="text-triage-nonUrgent font-bold">
                Non-Urgent: {hourlyData[activeIdx].nonUrgent}
              </span>
              <span className="text-slate-800 font-bold border-l pl-3 border-slate-300">
                Total: {hourlyData[activeIdx].total}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
