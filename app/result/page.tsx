"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import { usePatientContext } from "@/lib/patient-context";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  Heart,
  HelpCircle,
  ShieldCheck,
  Thermometer,
  User,
  Wind,
} from "lucide-react";

export default function TriageResultPage() {
  const router = useRouter();
  const { activePatient, activeAssessment, activeDraft } = usePatientContext();

  const assessment = activeAssessment || {
    priority: "CRITICAL" as const,
    recommendation: "Immediate Medical Attention Recommended",
    confidence: 94,
    whyThisPriority: [
      "Low oxygen saturation",
      "Severe chest pain",
      "Difficulty breathing",
      "Elevated heart rate",
      "Acute symptom onset",
    ],
    vitalSnapshot: {
      heartRate: 125,
      bloodPressureSystolic: 160,
      bloodPressureDiastolic: 100,
      temperature: 38.9,
      oxygenSaturation: 88,
      respiratoryRate: 24,
    },
    verificationChecks: [
      { id: "v1", name: "Safety criteria checked", verified: true },
      { id: "v2", name: "High-risk indicators confirmed", verified: true },
      { id: "v3", name: "Escalation recommendation verified", verified: true },
    ],
  };

  const patientName = activeDraft?.fullName || activePatient?.fullName || "Ahmed Khan";
  const patientAge = activeDraft?.age || activePatient?.age || 56;
  const patientGender = activeDraft?.gender || activePatient?.gender || "Male";
  const patientId = activeDraft?.patientId || activePatient?.id || "PT-2026-0841";

  return (
    <AppShell
      title="AI Triage Result"
      subtitle="AI-Powered Emergency Decision Support System"
    >
      <div className="w-full max-w-[1400px] mx-auto space-y-8">
        {/* Patient Identity Top Bar */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D1FAE5] text-[#047857] font-bold text-base font-heading shadow-sm">
              {patientName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-base sm:text-lg font-bold font-heading text-[#1C2624]">
                  {patientName}
                </h3>
                <span className="text-xs font-mono text-[#64748B] bg-[#F7F7F2] px-2.5 py-0.5 rounded-md border border-[#E5E7EB]">
                  {patientId}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#64748B] font-medium mt-0.5">
                {patientAge} Years • {patientGender} • Emergency Department Intake
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs sm:text-sm font-mono">
            <span className="text-[#64748B]">AI Triage Engine v2.4</span>
            <span className="text-[#047857] font-bold bg-[#D1FAE5] px-3 py-1 rounded-full">
              5 Agents Verified
            </span>
          </div>
        </div>

        {/* MAIN RESULT CARD: CRITICAL, Soft Red Tinted Background */}
        <div className="rounded-2xl border-2 border-[#FECACA] bg-[#FEF2F2] p-8 lg:p-10 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-red-200/80">
            <div className="space-y-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 text-[#EF4444] border border-[#FECACA]">
                Triage Classification
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading text-[#EF4444] tracking-tight">
                CRITICAL
              </h2>
              <p className="text-base sm:text-lg font-bold text-slate-800">
                Immediate Medical Attention Recommended
              </p>
            </div>

            {/* Confidence Score Pill */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-200 text-center min-w-[170px]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block">
                Confidence Score:
              </span>
              <div className="mt-1 text-4xl lg:text-5xl font-black font-mono text-slate-900">
                94%
              </div>
              <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-[#047857] font-bold">
                <ShieldCheck className="h-4 w-4" />
                <span>High Certainty</span>
              </div>
            </div>
          </div>

          {/* WHY THIS PRIORITY: */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-slate-600" />
              <span>WHY THIS PRIORITY:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {[
                "Low oxygen saturation",
                "Severe chest pain",
                "Difficulty breathing",
                "Elevated heart rate",
                "Acute symptom onset",
              ].map((reason, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl bg-white/95 border border-red-200 p-4 text-sm font-bold text-slate-800 shadow-sm"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] shrink-0" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CLINICAL SNAPSHOT & VERIFICATION AGENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: CLINICAL SNAPSHOT */}
          <div className="lg:col-span-6 rounded-2xl border border-[#E5E7EB] bg-white p-7 lg:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2.5">
                <Activity className="h-5 w-5 text-[#047857]" />
                <h4 className="text-sm font-bold font-heading text-[#1C2624] uppercase tracking-wider">
                  CLINICAL SNAPSHOT:
                </h4>
              </div>
              <span className="text-xs font-mono text-[#64748B]">Vital Signs Profile</span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F7F7F2] border border-[#E5E7EB]">
                <div className="flex items-center gap-3 text-slate-700 font-semibold">
                  <Heart className="h-4 w-4 text-[#EF4444]" />
                  <span>Heart Rate:</span>
                </div>
                <span className="font-bold font-mono text-base text-[#EF4444]">
                  125 BPM
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F7F7F2] border border-[#E5E7EB]">
                <div className="flex items-center gap-3 text-slate-700 font-semibold">
                  <Activity className="h-4 w-4 text-[#047857]" />
                  <span>Blood Pressure:</span>
                </div>
                <span className="font-bold font-mono text-base text-slate-900">
                  160/100 mmHg
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F7F7F2] border border-[#E5E7EB]">
                <div className="flex items-center gap-3 text-slate-700 font-semibold">
                  <Thermometer className="h-4 w-4 text-[#F59E0B]" />
                  <span>Temperature:</span>
                </div>
                <span className="font-bold font-mono text-base text-slate-900">
                  38.9°C
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA]">
                <div className="flex items-center gap-3 text-slate-700 font-semibold">
                  <Wind className="h-4 w-4 text-blue-500" />
                  <span className="text-[#EF4444] font-bold">Oxygen Saturation:</span>
                </div>
                <span className="font-bold font-mono text-base text-[#EF4444] font-black">
                  88%
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F7F7F2] border border-[#E5E7EB]">
                <div className="flex items-center gap-3 text-slate-700 font-semibold">
                  <Activity className="h-4 w-4 text-purple-500" />
                  <span>Respiratory Rate:</span>
                </div>
                <span className="font-bold font-mono text-base text-[#EF4444]">
                  24/min
                </span>
              </div>
            </div>
          </div>

          {/* Right: VERIFICATION AGENT */}
          <div className="lg:col-span-6 rounded-2xl border border-[#E5E7EB] bg-white p-7 lg:p-8 shadow-sm space-y-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-5 w-5 text-[#047857]" />
                  <h4 className="text-sm font-bold font-heading text-[#1C2624] uppercase tracking-wider">
                    VERIFICATION AGENT:
                  </h4>
                </div>
                <span className="text-xs font-bold text-[#065F46] bg-[#D1FAE5] px-3 py-1 rounded-full">
                  Status: Verified
                </span>
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex items-center gap-3.5 rounded-xl border border-[#D1FAE5] bg-[#ECFDF5] p-4 text-sm text-[#065F46] font-bold">
                  <CheckCircle2 className="h-5 w-5 text-[#047857] shrink-0" />
                  <span>Safety criteria checked</span>
                </div>

                <div className="flex items-center gap-3.5 rounded-xl border border-[#D1FAE5] bg-[#ECFDF5] p-4 text-sm text-[#065F46] font-bold">
                  <CheckCircle2 className="h-5 w-5 text-[#047857] shrink-0" />
                  <span>High-risk indicators confirmed</span>
                </div>

                <div className="flex items-center gap-3.5 rounded-xl border border-[#D1FAE5] bg-[#ECFDF5] p-4 text-sm text-[#065F46] font-bold">
                  <CheckCircle2 className="h-5 w-5 text-[#047857] shrink-0" />
                  <span>Escalation recommendation verified</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5E7EB] text-xs sm:text-sm text-[#64748B] italic">
              Verification Agent independently verifies that severe physiological indicators trigger mandatory escalation prior to human clinical sign-off.
            </div>
          </div>
        </div>

        {/* BUTTONS: View Full Report | Continue to Clinical Review */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E5E7EB]">
          <Link
            href="/reports"
            className="w-full sm:w-auto h-13 px-8 inline-flex items-center justify-center gap-2.5 rounded-xl border border-[#E5E7EB] bg-white text-sm font-bold text-[#1C2624] shadow-sm hover:bg-[#F7F7F2] transition-all"
          >
            <FileCheck2 className="h-5 w-5 text-[#64748B]" />
            <span>View Full Report</span>
          </Link>

          <Link
            href="/review"
            className="w-full sm:w-auto h-13 px-10 inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#047857] text-base font-bold text-white shadow-lg shadow-[#047857]/20 hover:bg-[#065F46] transition-all active:scale-[0.98]"
          >
            <span>Continue to Clinical Review</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
