"use client";

import React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/common/StatCard";
import { AgentStatusCard } from "@/components/common/AgentStatusCard";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { RecentActivityTable } from "@/components/dashboard/RecentActivityTable";
import { usePatientContext } from "@/lib/patient-context";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock,
  HeartPulse,
  Plus,
  ShieldCheck,
} from "lucide-react";

export default function DashboardPage() {
  const { patients, stats, agents } = usePatientContext();

  const formattedCritical = String(stats.criticalCount).padStart(2, "0");
  const formattedUrgent = String(stats.urgentCount).padStart(2, "0");
  const formattedNonUrgent = String(stats.nonUrgentCount).padStart(2, "0");

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Top Emergency Department Overview Banner */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 lg:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D1FAE5] text-[#047857] shadow-sm shrink-0">
              <HeartPulse className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg lg:text-xl font-black font-heading text-[#1C2624]">
                  Emergency Department Overview
                </h2>
                <span className="text-xs font-bold uppercase tracking-wider text-[#065F46] bg-[#D1FAE5] px-2.5 py-1 rounded-full">
                  All 5 Agents Online
                </span>
              </div>
              <p className="text-sm text-[#64748B] mt-1">
                Real-time patient triage operational. Door-to-provider time reduced by 42 seconds with automated multi-agent risk synthesis.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#047857] h-12 px-6 text-sm font-bold text-white shadow-md shadow-[#047857]/20 hover:bg-[#065F46] transition-all active:scale-[0.98] w-full md:w-auto"
            >
              <Plus className="h-4 w-4" />
              <span>+ New Assessment</span>
            </Link>
          </div>
        </div>

        {/* STATISTICS SECTION: 4 Substantial Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Critical Patients (04, subtle red indicator) */}
          <StatCard
            title="Critical Patients"
            value={formattedCritical}
            subtitle="Immediate resuscitation bay priority"
            icon={AlertCircle}
            variant="critical"
            trend="+1 this hour"
          />

          {/* Card 2: Urgent Patients (12, subtle amber indicator) */}
          <StatCard
            title="Urgent Patients"
            value={formattedUrgent}
            subtitle="Target assessment < 30 minutes"
            icon={AlertTriangle}
            variant="urgent"
            trend="Stable queue"
          />

          {/* Card 3: Non-Urgent Patients (18, subtle green indicator) */}
          <StatCard
            title="Non-Urgent Patients"
            value={formattedNonUrgent}
            subtitle="Routine ambulatory care stream"
            icon={CheckCircle2}
            variant="nonUrgent"
            trend="-3 discharged"
          />

          {/* Card 4: Average Triage Time (03:42 min) */}
          <StatCard
            title="Average Triage Time"
            value="03:42 min"
            subtitle="Door-to-classification speed"
            icon={Clock}
            variant="emerald"
            trend="-42s vs benchmark"
          />
        </div>

        {/* LOWER SECTION: Patient Activity chart, AI Agents Status panel, Recent Patient Activity table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Patient Activity Chart & Recent Patient Activity Table */}
          <div className="lg:col-span-8 space-y-8">
            <ActivityChart />
            <RecentActivityTable patients={patients} />
          </div>

          {/* Right: AI Agents Status Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D1FAE5] text-[#065F46]">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[#1C2624] font-heading">
                      AI Agents Status
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      Multi-agent pipeline health
                    </p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-bold text-[#047857] bg-[#D1FAE5]/70 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  <span>5 Operational</span>
                </span>
              </div>

              {/* The 5 Agents List */}
              <div className="mt-5 space-y-3.5">
                {agents.map((agent) => (
                  <AgentStatusCard key={agent.name} agent={agent} compact />
                ))}
              </div>

              {/* Departmental Metrics Snapshot */}
              <div className="mt-6 pt-5 border-t border-[#E5E7EB] space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-[#64748B]">
                  <span>Daily Triage Volume:</span>
                  <strong className="text-[#1C2624] font-mono font-bold">34 patients</strong>
                </div>
                <div className="flex items-center justify-between text-[#64748B]">
                  <span>Physician Concordance:</span>
                  <strong className="text-[#047857] font-mono font-bold">96.4%</strong>
                </div>
                <div className="flex items-center justify-between text-[#64748B]">
                  <span>Safety Verification:</span>
                  <strong className="text-[#1C2624] font-mono font-bold">100% Passed</strong>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#E5E7EB]/70">
                <Link
                  href="/insights"
                  className="w-full inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-[#047857] hover:text-[#065F46] py-2 rounded-xl hover:bg-[#D1FAE5]/40 transition-colors"
                >
                  <span>Explore Detailed AI Insights</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Clinical Decision Support Reminder Card */}
            <div className="rounded-2xl border border-[#FDE68A] bg-[#FFFBEB] p-5 text-xs sm:text-sm text-[#1C2624] space-y-2 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-[#B45309]">
                <ShieldCheck className="h-5 w-5 text-[#D4A017]" />
                <span className="text-[#1C2624]">Clinical Decision Support Only</span>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Smart Triage Agent provides preliminary severity stratification to assist clinical triage workflow. Final patient care decisions remain with qualified doctors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
