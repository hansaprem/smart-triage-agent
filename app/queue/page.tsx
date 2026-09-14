"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { PatientCard } from "@/components/patients/PatientCard";
import { usePatientContext } from "@/lib/patient-context";
import { PriorityLevel } from "@/types/triage";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Plus,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PatientQueuePage() {
  const { patients } = usePatientContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"ALL" | PriorityLevel>("ALL");

  const filteredPatients = patients.filter((p) => {
    const priority = p.review?.finalPriority || p.assessment.priority;
    const matchesSearch =
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.symptomsDescription.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedFilter !== "ALL") {
      return matchesSearch && priority === selectedFilter;
    }
    return matchesSearch;
  });

  const criticalPatients = filteredPatients.filter(
    (p) => (p.review?.finalPriority || p.assessment.priority) === "CRITICAL"
  );
  const urgentPatients = filteredPatients.filter(
    (p) => (p.review?.finalPriority || p.assessment.priority) === "URGENT"
  );
  const nonUrgentPatients = filteredPatients.filter(
    (p) => (p.review?.finalPriority || p.assessment.priority) === "NON-URGENT"
  );

  return (
    <AppShell
      title="Patient Queue"
      subtitle="Real-time emergency department monitoring"
    >
      <div className="space-y-8">
        {/* Top Control Bar: Search & Priority Filter */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748B]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search patients by name, ID (e.g. PT-2026), or symptoms..."
              className="w-full h-12 rounded-xl border border-[#E5E7EB] pl-12 pr-4 text-sm font-medium text-[#1C2624] placeholder:text-[#64748B] focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/20 outline-none transition-all"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] hidden sm:inline mr-1">
              Filter:
            </span>
            {(["ALL", "CRITICAL", "URGENT", "NON-URGENT"] as const).map((filter) => {
              const isActive = selectedFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={cn(
                    "h-10 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap",
                    isActive
                      ? "bg-[#047857] text-white shadow-sm"
                      : "bg-[#F7F7F2] text-[#64748B] hover:bg-[#E5E7EB]"
                  )}
                >
                  {filter === "ALL" ? `All (${patients.length})` : filter}
                </button>
              );
            })}
          </div>

          {/* Action button */}
          <Link
            href="/assessment"
            className="h-11 px-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#047857] text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-[#065F46] transition-all shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>+ New Patient</span>
          </Link>
        </div>

        {/* Three Clean Columns: Critical | Urgent | Non-Urgent */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Column 1: CRITICAL */}
          <div className="space-y-4">
            <div className="rounded-2xl border-2 border-[#FECACA] bg-[#FEF2F2] p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#EF4444] animate-pulse" />
                <h3 className="text-sm font-black font-heading tracking-wider uppercase text-[#EF4444]">
                  Critical
                </h3>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white border border-[#FECACA] text-[#EF4444]">
                {criticalPatients.length} Active
              </span>
            </div>

            <div className="space-y-4">
              {criticalPatients.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#E5E7EB] bg-white p-10 text-center text-sm text-[#64748B]">
                  No critical patients currently in queue.
                </div>
              ) : (
                criticalPatients.map((patient) => (
                  <PatientCard key={patient.id} patient={patient} />
                ))
              )}
            </div>
          </div>

          {/* Column 2: URGENT */}
          <div className="space-y-4">
            <div className="rounded-2xl border-2 border-[#FDE68A] bg-[#FFFBEB] p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <h3 className="text-sm font-black font-heading tracking-wider uppercase text-[#F59E0B]">
                  Urgent
                </h3>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white border border-[#FDE68A] text-[#F59E0B]">
                {urgentPatients.length} Active
              </span>
            </div>

            <div className="space-y-4">
              {urgentPatients.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#E5E7EB] bg-white p-10 text-center text-sm text-[#64748B]">
                  No urgent patients currently in queue.
                </div>
              ) : (
                urgentPatients.map((patient) => (
                  <PatientCard key={patient.id} patient={patient} />
                ))
              )}
            </div>
          </div>

          {/* Column 3: NON-URGENT */}
          <div className="space-y-4">
            <div className="rounded-2xl border-2 border-[#A7F3D0] bg-[#ECFDF5] p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#10B981]" />
                <h3 className="text-sm font-black font-heading tracking-wider uppercase text-[#10B981]">
                  Non-Urgent
                </h3>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white border border-[#A7F3D0] text-[#10B981]">
                {nonUrgentPatients.length} Active
              </span>
            </div>

            <div className="space-y-4">
              {nonUrgentPatients.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#E5E7EB] bg-white p-10 text-center text-sm text-[#64748B]">
                  No non-urgent patients currently in queue.
                </div>
              ) : (
                nonUrgentPatients.map((patient) => (
                  <PatientCard key={patient.id} patient={patient} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
