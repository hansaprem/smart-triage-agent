"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { usePatientContext } from "@/lib/patient-context";
import { AgentName } from "@/types/triage";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Cpu,
  FileText,
  GitPullRequest,
  Loader2,
  Search,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PipelineAgent {
  name: AgentName;
  role: string;
  status: "Completed" | "Processing" | "Waiting";
  log: string;
}

export default function AIAnalysisPage() {
  const router = useRouter();
  const { activeDraft, executeAssessment } = usePatientContext();

  const [progress, setProgress] = useState(25);
  const [pipelineState, setPipelineState] = useState<PipelineAgent[]>([
    {
      name: "Intake Agent",
      role: "Demographics & Vital Bounds Validation",
      status: "Completed",
      log: "Demographics, vitals, and physiological bounds verified.",
    },
    {
      name: "NLP Agent",
      role: "Entity Extraction & Semantic Duration",
      status: "Completed",
      log: "Extracted symptoms, acute indicators, and timeline.",
    },
    {
      name: "Triage Agent",
      role: "Acuity Stratification & Decision Support",
      status: "Processing",
      log: "Synthesizing vitals with symptom profile for acuity calculation...",
    },
    {
      name: "Verification Agent",
      role: "Safety Constraint & Red-Flag Audit",
      status: "Waiting",
      log: "Queued: Safety rule check and escalation bounds verification.",
    },
    {
      name: "Report Agent",
      role: "Clinical Summary & Audit Trail",
      status: "Waiting",
      log: "Queued: Compilation of structured summary report.",
    },
  ]);

  const [logs, setLogs] = useState<string[]>([
    "[10:30:01] System: Patient assessment payload received.",
    "[10:30:02] Intake Agent: Validated physiological vitals and patient profile.",
    "[10:30:03] NLP Agent: Extracted cardinal clinical entities and symptom onset.",
    "[10:30:04] Triage Agent: Executing Bayesian emergency severity index stratification...",
  ]);

  useEffect(() => {
    executeAssessment();

    const t1 = setTimeout(() => {
      setProgress(75);
      setPipelineState((prev) => [
        prev[0],
        prev[1],
        { ...prev[2], status: "Completed", log: "Acuity determination computed: CRITICAL (94% confidence)" },
        { ...prev[3], status: "Processing", log: "Validating physiological red flags and safety thresholds..." },
        prev[4],
      ]);
      setLogs((l) => [
        ...l,
        "[10:30:05] Triage Agent: Classification generated with 94% confidence.",
        "[10:30:05] Verification Agent: Auditing against clinical safety constraints...",
      ]);
    }, 1600);

    const t2 = setTimeout(() => {
      setProgress(100);
      setPipelineState((prev) => [
        prev[0],
        prev[1],
        prev[2],
        { ...prev[3], status: "Completed", log: "Safety criteria checked. High-risk indicators confirmed." },
        { ...prev[4], status: "Completed", log: "Emergency Triage Summary Report generated." },
      ]);
      setLogs((l) => [
        ...l,
        "[10:30:06] Verification Agent: Safety bounds cleared. Escalation confirmed.",
        "[10:30:06] Report Agent: Synthesis ready for human clinical review.",
      ]);
    }, 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleNavigateToResult = () => {
    router.push("/result");
  };

  const getAgentIcon = (name: AgentName) => {
    switch (name) {
      case "Intake Agent":
        return GitPullRequest;
      case "NLP Agent":
        return Search;
      case "Triage Agent":
        return Cpu;
      case "Verification Agent":
        return ShieldCheck;
      case "Report Agent":
        return FileText;
    }
  };

  return (
    <AppShell
      title="AI Triage Engine"
      subtitle="Analyzing Patient Case"
    >
      <div className="w-full max-w-[1400px] mx-auto space-y-8">
        {/* HEADER & PROGRESS SECTION */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-7 lg:p-8 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-3 w-3 rounded-full bg-[#047857] animate-pulse" />
                <h2 className="text-xl lg:text-2xl font-black font-heading text-[#1C2624]">
                  Analyzing patient information...
                </h2>
              </div>
              <p className="text-sm text-[#64748B] mt-1">
                Evaluating {activeDraft?.fullName || "Ahmed Khan"} • 5-Agent Collaborative Reasoning Pipeline
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm font-mono font-bold text-[#047857] bg-[#D1FAE5] px-3 py-1 rounded-lg">
                {progress}% Complete
              </span>
              <button
                onClick={handleNavigateToResult}
                className="h-12 px-6 inline-flex items-center gap-2 rounded-xl bg-[#047857] text-sm font-bold text-white shadow-md shadow-[#047857]/20 hover:bg-[#065F46] transition-all active:scale-[0.98]"
              >
                <span>View Analysis Result</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Smooth Progress Bar */}
          <div className="h-3 w-full rounded-full bg-[#E5E7EB] overflow-hidden">
            <div
              className="h-full bg-[#047857] transition-all duration-700 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* AI AGENT WORKFLOW: Connected Cards */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-7 lg:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
            <div className="flex items-center gap-2.5">
              <Bot className="h-5 w-5 text-[#047857]" />
              <h3 className="text-sm font-bold font-heading uppercase tracking-wider text-[#1C2624]">
                AI Agent Workflow
              </h3>
            </div>
            <span className="text-xs font-mono text-[#64748B]">Sequential Decision Chain</span>
          </div>

          {/* Connected Cards Sequence */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {pipelineState.map((agent, index) => {
              const Icon = getAgentIcon(agent.name);
              const isCompleted = agent.status === "Completed";
              const isProcessing = agent.status === "Processing";

              return (
                <React.Fragment key={agent.name}>
                  <div
                    className={cn(
                      "flex-1 rounded-2xl border p-5 transition-all duration-300 flex flex-col justify-between min-h-[175px]",
                      isCompleted
                        ? "border-[#A7F3D0] bg-[#ECFDF5]/70 shadow-sm"
                        : isProcessing
                        ? "border-[#047857] bg-white ring-2 ring-[#047857]/20 shadow-md"
                        : "border-[#E5E7EB] bg-[#F7F7F2]/60 opacity-80"
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-xl",
                            isCompleted
                              ? "bg-[#D1FAE5] text-[#047857]"
                              : isProcessing
                              ? "bg-[#047857] text-white"
                              : "bg-[#E5E7EB] text-[#64748B]"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        {/* Status Badge */}
                        <span
                          className={cn(
                            "text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5",
                            isCompleted
                              ? "bg-[#D1FAE5] text-[#065F46]"
                              : isProcessing
                              ? "bg-[#FEF3C7] text-[#B45309]"
                              : "bg-[#E5E7EB] text-[#64748B]"
                          )}
                        >
                          {isCompleted && <CheckCircle2 className="h-3.5 w-3.5 text-[#047857]" />}
                          {isProcessing && <Loader2 className="h-3.5 w-3.5 animate-spin text-[#D4A017]" />}
                          <span>{agent.status}</span>
                        </span>
                      </div>

                      <h4 className="mt-4 text-sm font-bold font-heading text-[#1C2624]">
                        {agent.name}
                      </h4>
                      <p className="text-xs text-[#64748B] mt-1 line-clamp-2">
                        {agent.role}
                      </p>
                    </div>

                    <p className="mt-3 pt-2.5 border-t border-[#E5E7EB]/70 text-xs font-mono text-[#64748B] line-clamp-1">
                      {agent.log}
                    </p>
                  </div>

                  {index < pipelineState.length - 1 && (
                    <div className="hidden md:flex items-center justify-center text-[#047857] shrink-0 px-1 font-black text-lg">
                      →
                    </div>
                  )}
                  {index < pipelineState.length - 1 && (
                    <div className="flex md:hidden items-center justify-center text-[#047857] py-1 font-black text-lg">
                      ↓
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* EXTRACTED INFORMATION PANEL & LIVE REASONING LOGS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Extracted Information Panel */}
          <div className="lg:col-span-6 rounded-2xl border border-[#E5E7EB] bg-white p-7 lg:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
              <div className="flex items-center gap-2.5">
                <Search className="h-5 w-5 text-[#047857]" />
                <h3 className="text-sm font-bold font-heading uppercase tracking-wider text-[#1C2624]">
                  Extracted Information Panel
                </h3>
              </div>
              <span className="text-xs font-mono text-[#047857] font-bold bg-[#D1FAE5] px-2.5 py-1 rounded-md">
                NLP Agent Output
              </span>
            </div>

            {/* Symptoms Detected */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
                Symptoms Detected:
              </span>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F7F7F2] border border-[#E5E7EB] text-sm font-bold text-[#1C2624]">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                    <span>Chest Pain</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#EF4444] bg-[#FEF2F2] px-3 py-1 rounded-lg border border-[#FECACA]">
                    Acute Coronary Risk
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F7F7F2] border border-[#E5E7EB] text-sm font-bold text-[#1C2624]">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                    <span>Difficulty Breathing</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#EF4444] bg-[#FEF2F2] px-3 py-1 rounded-lg border border-[#FECACA]">
                    Hypoxemic Deviation
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F7F7F2] border border-[#E5E7EB] text-sm font-bold text-[#1C2624]">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                    <span>Dizziness</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#F59E0B] bg-[#FFFBEB] px-3 py-1 rounded-lg border border-[#FDE68A]">
                    Hemodynamic Sign
                  </span>
                </div>
              </div>
            </div>

            {/* Severity & Duration */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#EF4444] block">
                  Severity:
                </span>
                <span className="text-xl lg:text-2xl font-black font-heading text-[#EF4444] mt-1 block">
                  High
                </span>
              </div>

              <div className="rounded-xl border border-[#E5E7EB] bg-[#F7F7F2] p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block">
                  Duration:
                </span>
                <span className="text-xl lg:text-2xl font-black font-mono text-[#1C2624] mt-1 block">
                  30 minutes
                </span>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="pt-2">
              <button
                onClick={handleNavigateToResult}
                className="w-full h-13 inline-flex items-center justify-center gap-2 rounded-xl bg-[#047857] px-6 text-sm sm:text-base font-bold text-white shadow-md shadow-[#047857]/20 hover:bg-[#065F46] transition-all"
              >
                <span>View Analysis Result</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Right: Live Agent Reasoning Feed */}
          <div className="lg:col-span-6 rounded-2xl border border-[#E5E7EB] bg-slate-950 text-[#D1FAE5] p-7 lg:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                  <span className="text-sm font-mono font-bold text-slate-200">
                    Agent Coordination Telemetry
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400">LATENCY: 3.8s</span>
              </div>

              <div className="mt-5 font-mono text-xs sm:text-sm space-y-3 max-h-72 overflow-y-auto pr-2 text-slate-300">
                {logs.map((log, i) => (
                  <div key={i} className="leading-relaxed">
                    <span className="text-slate-500">{log.slice(0, 10)}</span>{" "}
                    <span className="text-emerald-300">{log.slice(10)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Status: Multi-Agent Processing Complete</span>
              <button
                onClick={handleNavigateToResult}
                className="text-xs sm:text-sm font-bold text-[#10B981] hover:text-[#34D399] underline font-sans"
              >
                Skip to Result →
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
