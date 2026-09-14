"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/common/StatCard";
import { AgentStatusCard } from "@/components/common/AgentStatusCard";
import { usePatientContext } from "@/lib/patient-context";
import {
  Activity,
  BarChart3,
  Clock,
  Cpu,
  PieChart,
  ShieldCheck,
} from "lucide-react";

export default function AIInsightsPage() {
  const { agents } = usePatientContext();

  const symptomFrequency = [
    { name: "Chest Pain / Retrosternal Pressure", count: 14, percentage: 41, category: "Cardiovascular" },
    { name: "Difficulty Breathing / Dyspnea", count: 11, percentage: 32, category: "Respiratory" },
    { name: "High Fever & Chills", count: 9, percentage: 26, category: "Infectious" },
    { name: "Persistent Vomiting & Nausea", count: 8, percentage: 23, category: "Gastrointestinal" },
    { name: "Severe Headache / Migraine", count: 6, percentage: 17, category: "Neurological" },
  ];

  const agentLatencyBreakdown = [
    { name: "Intake Agent", latency: "18ms", desc: "Demographic parsing & FHIR validation" },
    { name: "NLP Agent", latency: "420ms", desc: "Clinical entity recognition & duration mapping" },
    { name: "Triage Agent", latency: "1,150ms", desc: "Bayesian acuity risk inference" },
    { name: "Verification Agent", latency: "680ms", desc: "Safety bound & red-flag audits" },
    { name: "Report Agent", latency: "310ms", desc: "EHR structured document compilation" },
  ];

  return (
    <AppShell
      title="AI Insights"
      subtitle="System performance and patient analysis overview."
    >
      <div className="w-full max-w-[1400px] mx-auto space-y-8">
        {/* TOP 3 KPI STATISTICS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1: Patients Analyzed Today: 34 */}
          <StatCard
            title="Patients Analyzed Today"
            value="34"
            subtitle="Autonomous triage evaluations"
            icon={Activity}
            variant="emerald"
            trend="+8 in last 2h"
          />

          {/* Card 2: Average Confidence: 91% */}
          <StatCard
            title="Average Confidence"
            value="91%"
            subtitle="Cross-validation consensus rate"
            icon={ShieldCheck}
            variant="default"
            trend="High reliability"
          />

          {/* Card 3: Average Analysis Time: 4.2 seconds */}
          <StatCard
            title="Average Analysis Time"
            value="4.2 seconds"
            subtitle="End-to-end 5-agent pipeline"
            icon={Clock}
            variant="emerald"
            trend="Target < 5.0s"
          />
        </div>

        {/* CHARTS GRID: Priority Distribution & Common Symptoms */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Priority Distribution Chart */}
          <div className="lg:col-span-5 rounded-2xl border border-[#E5E7EB] bg-white p-7 lg:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2.5">
                <PieChart className="h-5 w-5 text-[#047857]" />
                <h3 className="text-base font-bold font-heading text-[#1C2624]">
                  Priority Distribution
                </h3>
              </div>
              <span className="text-xs font-mono text-[#64748B]">
                Last 24 Hours
              </span>
            </div>

            <div className="space-y-5">
              {/* Stacked Percentage Bar */}
              <div className="h-5 w-full rounded-full overflow-hidden flex bg-[#E5E7EB]">
                <div style={{ width: "24%" }} className="bg-[#EF4444]" title="Critical: 24%" />
                <div style={{ width: "42%" }} className="bg-[#F59E0B]" title="Urgent: 42%" />
                <div style={{ width: "34%" }} className="bg-[#10B981]" title="Non-Urgent: 34%" />
              </div>

              {/* Acuity Tiers Breakdown */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#EF4444]" />
                    <div>
                      <span className="font-bold text-[#EF4444] block">CRITICAL</span>
                      <span className="text-xs text-slate-500">Immediate resuscitation attention</span>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-extrabold text-[#EF4444] text-base">24%</span>
                    <span className="text-xs text-slate-500 block">8 cases</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#F59E0B]" />
                    <div>
                      <span className="font-bold text-[#F59E0B] block">URGENT</span>
                      <span className="text-xs text-slate-500">Evaluation target &lt; 30 min</span>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-extrabold text-[#F59E0B] text-base">42%</span>
                    <span className="text-xs text-slate-500 block">14 cases</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#10B981]" />
                    <div>
                      <span className="font-bold text-[#10B981] block">NON-URGENT</span>
                      <span className="text-xs text-slate-500">Stable, routine ambulatory flow</span>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-extrabold text-[#10B981] text-base">34%</span>
                    <span className="text-xs text-slate-500 block">12 cases</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F7F2] border border-[#E5E7EB] text-xs sm:text-sm text-[#64748B]">
              Physician agreement with AI priority tier: <strong className="text-[#047857] font-bold">96.4%</strong> (32 of 34 cases confirmed without modification).
            </div>
          </div>

          {/* Common Symptoms Chart */}
          <div className="lg:col-span-7 rounded-2xl border border-[#E5E7EB] bg-white p-7 lg:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2.5">
                <BarChart3 className="h-5 w-5 text-[#047857]" />
                <h3 className="text-base font-bold font-heading text-[#1C2624]">
                  Common Symptoms
                </h3>
              </div>
              <span className="text-xs font-mono text-[#64748B]">
                NLP Entity Frequency
              </span>
            </div>

            <div className="space-y-5">
              {symptomFrequency.map((s) => (
                <div key={s.name} className="space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-[#1C2624]">{s.name}</span>
                      <span className="text-xs font-mono text-[#64748B] bg-[#F7F7F2] px-2 py-0.5 rounded border border-[#E5E7EB]">
                        {s.category}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-[#64748B]">
                      {s.count} pts ({s.percentage}%)
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-[#E5E7EB] overflow-hidden">
                    <div
                      className="h-full bg-[#047857] rounded-full transition-all duration-500"
                      style={{ width: `${s.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs sm:text-sm text-[#64748B]">
              <span>Cardiovascular & respiratory complaints represent highest acuity drivers</span>
              <span className="font-bold text-[#1C2624] font-mono">34 patients</span>
            </div>
          </div>
        </div>

        {/* AI AGENT PERFORMANCE */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-7 lg:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2.5">
              <Cpu className="h-5 w-5 text-[#047857]" />
              <h3 className="text-base font-bold font-heading text-[#1C2624]">
                AI Agent Performance
              </h3>
            </div>
            <span className="text-xs font-bold text-[#065F46] bg-[#D1FAE5] px-3 py-1 rounded-full">
              Optimal Pipeline Throughput
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {agentLatencyBreakdown.map((item) => (
              <div
                key={item.name}
                className="rounded-2xl border border-[#E5E7EB] bg-[#F7F7F2]/60 p-5 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#1C2624] font-heading">
                    {item.name}
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                </div>
                <div className="text-3xl font-black font-mono text-[#047857]">
                  {item.latency}
                </div>
                <p className="text-xs text-[#64748B] leading-snug">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SYSTEM STATUS: All 5 Agents */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              System Status
            </h3>
            <span className="text-xs sm:text-sm font-bold text-[#047857] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
              <span>All 5 Agents Operational</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <AgentStatusCard key={agent.name} agent={agent} />
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
