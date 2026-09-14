"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { usePatientContext } from "@/lib/patient-context";
import { ClinicalDecisionType, PriorityLevel } from "@/types/triage";
import {
  ArrowRight,
  CheckCircle2,
  Info,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  User,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function HumanClinicalReviewPage() {
  const router = useRouter();
  const { activePatient, activeDraft, saveClinicalDecision } =
    usePatientContext();

  const [decision, setDecision] = useState<ClinicalDecisionType>("ACCEPT");
  const [modifiedPriority, setModifiedPriority] = useState<PriorityLevel>("CRITICAL");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const patientName = activeDraft?.fullName || activePatient?.fullName || "Ahmed Khan";
  const patientAge = activeDraft?.age || activePatient?.age || 56;
  const patientGender = activeDraft?.gender || activePatient?.gender || "Male";
  const patientId = activeDraft?.patientId || activePatient?.id || "PT-2026-0841";

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const finalPriority = decision === "MODIFY" ? modifiedPriority : "CRITICAL";

    saveClinicalDecision({
      decision,
      finalPriority,
      clinicianName: "Dr. Sarah Jenkins, MD",
      clinicianRole: "Lead Emergency Physician",
      reasonForModification:
        reason ||
        (decision === "ACCEPT"
          ? "Accepted AI recommendation based on clinical correlation."
          : "Modified priority following bedside assessment."),
      reviewedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });

    setShowToast(true);
    setTimeout(() => {
      router.push("/queue");
    }, 900);
  };

  return (
    <AppShell
      title="Human Clinical Review"
      subtitle="AI-Powered Emergency Decision Support System"
    >
      <div className="w-full max-w-[1400px] mx-auto space-y-8">
        {/* Toast confirmation */}
        {showToast && (
          <div className="rounded-2xl border border-[#A7F3D0] bg-[#ECFDF5] p-5 shadow-sm flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#047857] text-white">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#065F46] font-heading">
                  Clinical Decision Confirmed
                </h4>
                <p className="text-xs text-[#065F46]">
                  Decision recorded. Navigating to Patient Queue...
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-[#047857] animate-pulse">
              Transferring...
            </span>
          </div>
        )}

        {/* Patient Top Summary Banner */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D1FAE5] text-[#047857] font-bold font-heading shadow-sm">
              <User className="h-6 w-6" />
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
              <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
                {patientAge} Years • {patientGender} • Presenting: Severe chest pain, shortness of breath
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 text-xs sm:text-sm">
            <div className="text-right">
              <span className="text-[11px] uppercase font-bold text-[#64748B] block">
                Reviewing Clinician
              </span>
              <span className="font-bold text-[#1C2624]">Dr. Sarah Jenkins, MD</span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#065F46] text-white text-sm font-bold font-heading shadow-sm">
              DS
            </div>
          </div>
        </div>

        {/* TWO MAIN CARDS: LEFT CARD (AI Recommendation) | RIGHT CARD (Clinical Decision) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT CARD: AI Recommendation */}
          <div className="lg:col-span-6 rounded-2xl border border-[#E5E7EB] bg-white p-7 lg:p-9 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-5 w-5 text-[#047857]" />
                  <h3 className="text-sm font-bold font-heading uppercase tracking-wider text-[#1C2624]">
                    AI Recommendation
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-[#047857] bg-[#D1FAE5] px-3 py-1 rounded-full">
                  Autonomous Triage Output
                </span>
              </div>

              {/* Priority Box */}
              <div className="rounded-2xl border-2 border-[#FECACA] bg-[#FEF2F2] p-6 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#EF4444] block">
                  Recommended Acuity Tier
                </span>
                <h4 className="text-4xl font-black font-heading text-[#EF4444] tracking-tight">
                  CRITICAL
                </h4>
                <p className="text-sm sm:text-base font-bold text-slate-800">
                  Immediate Medical Attention Recommended
                </p>
              </div>

              {/* Confidence */}
              <div className="p-5 rounded-xl border border-[#E5E7EB] bg-[#F7F7F2] flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-[#1C2624] block">
                    Confidence:
                  </span>
                  <span className="text-xs text-[#64748B]">
                    Multi-agent consensus level
                  </span>
                </div>
                <span className="text-3xl font-black font-mono text-slate-900">
                  94%
                </span>
              </div>

              {/* Key Indicators */}
              <div className="space-y-2.5 text-xs sm:text-sm">
                <span className="font-bold text-[#64748B] uppercase tracking-wider text-xs block">
                  Contributing Clinical Factors:
                </span>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F7F7F2] border border-[#E5E7EB]">
                    <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                    <span>Low oxygen saturation (88% SpO2 on ambient air)</span>
                  </li>
                  <li className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F7F7F2] border border-[#E5E7EB]">
                    <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                    <span>Severe retrosternal chest pain with radiation</span>
                  </li>
                  <li className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F7F7F2] border border-[#E5E7EB]">
                    <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                    <span>Elevated heart rate (125 BPM sinus tachycardia)</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5E7EB] text-xs sm:text-sm text-[#64748B] flex items-center gap-2">
              <Info className="h-4 w-4 text-[#64748B] shrink-0" />
              <span>AI provides preliminary decision support only. Physician review is mandatory.</span>
            </div>
          </div>

          {/* RIGHT CARD: Clinical Decision */}
          <div className="lg:col-span-6 rounded-2xl border border-[#E5E7EB] bg-white p-7 lg:p-9 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2.5">
                <Stethoscope className="h-5 w-5 text-[#047857]" />
                <h3 className="text-sm font-bold font-heading uppercase tracking-wider text-[#1C2624]">
                  Clinical Decision
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                Attending Physician Review
              </span>
            </div>

            <form onSubmit={handleConfirm} className="space-y-6">
              {/* Options */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C2624]">
                  Determination:
                </label>

                {/* Option 1: Accept Recommendation */}
                <button
                  type="button"
                  onClick={() => setDecision("ACCEPT")}
                  className={cn(
                    "w-full rounded-2xl border p-5 text-left transition-all flex items-center justify-between",
                    decision === "ACCEPT"
                      ? "border-[#047857] bg-[#ECFDF5] ring-2 ring-[#047857]/20 shadow-sm"
                      : "border-[#E5E7EB] bg-white hover:border-slate-300"
                  )}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border flex items-center justify-center",
                        decision === "ACCEPT"
                          ? "border-[#047857] bg-[#047857]"
                          : "border-slate-300 bg-white"
                      )}
                    >
                      {decision === "ACCEPT" && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-[#1C2624]">
                        Accept Recommendation
                      </h4>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        Confirm CRITICAL acuity as suggested by AI agent.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-[#047857]">Recommended</span>
                </button>

                {/* Option 2: Modify Priority */}
                <button
                  type="button"
                  onClick={() => setDecision("MODIFY")}
                  className={cn(
                    "w-full rounded-2xl border p-5 text-left transition-all flex items-center justify-between",
                    decision === "MODIFY"
                      ? "border-[#F59E0B] bg-[#FFFBEB] ring-2 ring-[#F59E0B]/20 shadow-sm"
                      : "border-[#E5E7EB] bg-white hover:border-slate-300"
                  )}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border flex items-center justify-center",
                        decision === "MODIFY"
                          ? "border-[#F59E0B] bg-[#F59E0B]"
                          : "border-slate-300 bg-white"
                      )}
                    >
                      {decision === "MODIFY" && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-[#1C2624]">
                        Modify Priority
                      </h4>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        Override acuity tier based on senior clinical discretion.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-[#F59E0B]">Override</span>
                </button>

                {/* Option 3: Reject Recommendation */}
                <button
                  type="button"
                  onClick={() => setDecision("REJECT")}
                  className={cn(
                    "w-full rounded-2xl border p-5 text-left transition-all flex items-center justify-between",
                    decision === "REJECT"
                      ? "border-[#EF4444] bg-[#FEF2F2] ring-2 ring-[#EF4444]/20 shadow-sm"
                      : "border-[#E5E7EB] bg-white hover:border-slate-300"
                  )}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border flex items-center justify-center",
                        decision === "REJECT"
                          ? "border-[#EF4444] bg-[#EF4444]"
                          : "border-slate-300 bg-white"
                      )}
                    >
                      {decision === "REJECT" && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-[#1C2624]">
                        Reject Recommendation
                      </h4>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        Reject AI determination and order manual bedside reassessment.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-[#EF4444]">Manual Path</span>
                </button>
              </div>

              {/* If Modify selected, choose new priority */}
              {decision === "MODIFY" && (
                <div className="p-4 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] space-y-2.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Select Revised Priority Tier:
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {(["CRITICAL", "URGENT", "NON-URGENT"] as PriorityLevel[]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setModifiedPriority(p)}
                        className={cn(
                          "h-11 px-2 text-xs sm:text-sm font-bold rounded-xl border transition-all text-center",
                          modifiedPriority === p
                            ? "bg-[#047857] text-white border-[#047857]"
                            : "bg-white text-slate-700 border-[#E5E7EB]"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Field: Reason for modification */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C2624] mb-2">
                  Reason for modification
                </label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter clinical rationale or notes regarding priority determination..."
                  className="w-full rounded-xl border border-[#E5E7EB] p-4 text-sm font-medium text-[#1C2624] placeholder:text-[#64748B] focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/20 outline-none transition-all leading-relaxed"
                />
              </div>

              {/* PRIMARY BUTTON: Confirm Clinical Decision */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-13 inline-flex items-center justify-center gap-2 rounded-xl bg-[#047857] px-6 text-sm sm:text-base font-bold text-white shadow-lg shadow-[#047857]/20 hover:bg-[#065F46] transition-all active:scale-[0.98]"
              >
                <UserCheck className="h-5 w-5" />
                <span>{isSubmitting ? "Submitting Determination..." : "Confirm Clinical Decision"}</span>
              </button>
            </form>
          </div>
        </div>

        {/* BOTTOM DISCLAIMER */}
        <div className="rounded-2xl border border-[#D1FAE5] bg-[#ECFDF5] p-5 text-sm text-[#065F46] flex items-center gap-3.5 shadow-sm">
          <ShieldAlert className="h-6 w-6 text-[#047857] shrink-0" />
          <p className="font-semibold leading-relaxed">
            Human review ensures that final clinical decisions remain with qualified healthcare professionals.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
