"use client";

import React from "react";
import Link from "next/link";
import { Patient } from "@/types/triage";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import { Clock, ArrowRight } from "lucide-react";

interface RecentActivityTableProps {
  patients: Patient[];
}

export function RecentActivityTable({ patients }: RecentActivityTableProps) {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm overflow-hidden">
      <div className="p-6 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-[#1C2624] font-heading">
            Recent Patient Activity
          </h3>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Real-time emergency department admissions and autonomous multi-agent triage results
          </p>
        </div>
        <Link
          href="/queue"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#047857] hover:text-[#065F46] transition-colors"
        >
          <span>View Patient Queue</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F7F7F2]/80 text-xs font-bold uppercase tracking-wider text-[#64748B]">
              <th className="py-4 px-6">Patient</th>
              <th className="py-4 px-6">Priority</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] text-sm font-medium text-[#1C2624]">
            {patients.slice(0, 5).map((patient) => {
              const priority = patient.review?.finalPriority || patient.assessment.priority;
              return (
                <tr
                  key={patient.id}
                  className="hover:bg-[#F7F7F2]/60 transition-colors group"
                >
                  {/* Column 1: Patient */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D1FAE5] text-[#047857] font-bold text-sm font-heading shrink-0">
                        {patient.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-[#1C2624] group-hover:text-[#047857] transition-colors text-sm sm:text-base">
                          {patient.fullName}
                        </div>
                        <div className="text-xs text-[#64748B]">
                          {patient.age} yrs • {patient.gender} • <span className="font-mono">{patient.id}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Priority */}
                  <td className="py-4 px-6">
                    <PriorityBadge priority={priority} size="md" />
                  </td>

                  {/* Column 3: Status */}
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] px-3 py-1 text-xs font-bold text-[#065F46]">
                      <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                      <span>{patient.status || "In Queue"}</span>
                    </span>
                  </td>

                  {/* Column 4: Time */}
                  <td className="py-4 px-6 font-mono text-sm text-[#64748B]">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#64748B]/70" />
                      <span>{patient.admittedAt || "10:14 AM"}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
