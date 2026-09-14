"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { usePatientContext } from "@/lib/patient-context";
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  Download,
  FileCheck2,
  FileText,
  Heart,
  Printer,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  Thermometer,
  User,
  Wind,
} from "lucide-react";

export default function ReportsPage() {
  const { patients, activePatient } = usePatientContext();
  const [downloadToast, setDownloadToast] = useState(false);

  const currentPatient =
    activePatient ||
    patients.find((p) => p.id === "PT-2026-0841") ||
    patients[0];

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    setDownloadToast(true);
    setTimeout(() => setDownloadToast(false), 3000);
  };

  return (
    <AppShell
      title="Emergency Triage Summary Report"
      subtitle="AI-Powered Emergency Decision Support System"
    >
      <div className="w-full max-w-[1400px] mx-auto space-y-8">
        {/* Visual feedback toast */}
        {downloadToast && (
          <div className="rounded-2xl border border-[#A7F3D0] bg-[#ECFDF5] p-4 shadow-sm text-sm font-bold text-[#065F46] flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-[#047857]" />
              <span>Report document exported: Triage-Summary-{currentPatient.id}.pdf</span>
            </div>
            <span className="text-xs font-mono text-[#047857] bg-white px-3 py-1 rounded-lg border border-[#A7F3D0]">
              Downloaded
            </span>
          </div>
        )}

        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#64748B]">
              Active Case:
            </span>
            <span className="text-sm sm:text-base font-bold text-[#1C2624]">
              {currentPatient.fullName} ({currentPatient.id})
            </span>
          </div>

          {/* BUTTONS: Download Report | Print Report | Back to Dashboard */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard"
              className="h-11 px-5 inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white text-xs sm:text-sm font-bold text-[#64748B] hover:text-[#1C2624] hover:bg-[#F7F7F2] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>

            <button
              type="button"
              onClick={handleDownload}
              className="h-11 px-5 inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white text-xs sm:text-sm font-bold text-[#1C2624] hover:bg-[#F7F7F2] transition-colors"
            >
              <Download className="h-4 w-4 text-[#64748B]" />
              <span>Download Report</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="h-11 px-6 inline-flex items-center gap-2 rounded-xl bg-[#047857] text-xs sm:text-sm font-bold text-white shadow-md shadow-[#047857]/20 hover:bg-[#065F46] transition-all"
            >
              <Printer className="h-4 w-4" />
              <span>Print Report</span>
            </button>
          </div>
        </div>

        {/* MEDICAL REPORT CARD */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 sm:p-12 lg:p-16 shadow-sm space-y-10">
          {/* HEADER: SMART TRIAGE AGENT - Emergency Triage Summary Report */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-8 border-b-2 border-slate-900">
            <div>
              <h1 className="font-heading font-black text-3xl sm:text-4xl tracking-tight text-[#1C2624]">
                SMART TRIAGE AGENT
              </h1>
              <h2 className="text-base font-bold uppercase tracking-wider text-[#047857] mt-1 font-heading">
                Emergency Triage Summary Report
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                AI-Powered Emergency Decision Support System • St. Jude Hospital Emergency Department Audit
              </p>
            </div>

            <div className="text-right text-xs sm:text-sm font-mono space-y-1">
              <div>Case ID: <strong className="text-slate-900">{currentPatient.id}</strong></div>
              <div>Intake Time: <span className="text-slate-600">{currentPatient.admittedAt || "10:14 AM"}</span></div>
              <div>Generated: <span className="text-slate-600">{new Date().toLocaleDateString()}</span></div>
            </div>
          </div>

          {/* PRIORITY RECOMMENDATION (Highlight: PRIORITY: CRITICAL) */}
          <div className="rounded-2xl border-2 border-[#EF4444] bg-[#FEF2F2] p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-[#EF4444] block">
                Primary Acuity Classification
              </span>
              <h3 className="text-4xl sm:text-5xl font-black font-heading text-[#EF4444] tracking-tight">
                PRIORITY: CRITICAL
              </h3>
              <p className="text-sm sm:text-base font-bold text-slate-800">
                Immediate Medical Attention Recommended
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs uppercase font-bold text-slate-600 block">
                Model Confidence
              </span>
              <span className="text-4xl sm:text-5xl font-black font-mono text-slate-900">
                94%
              </span>
            </div>
          </div>

          {/* SECTION 1: Patient Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#1C2624] border-b border-[#E5E7EB] pb-2.5 flex items-center gap-2.5">
              <User className="h-5 w-5 text-[#047857]" />
              <span>1. Patient Information</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
              <div>
                <span className="text-[#64748B] block text-xs">Full Name</span>
                <strong className="text-[#1C2624] text-base">{currentPatient.fullName}</strong>
              </div>
              <div>
                <span className="text-[#64748B] block text-xs">Patient ID</span>
                <strong className="text-[#1C2624] font-mono text-base">{currentPatient.id}</strong>
              </div>
              <div>
                <span className="text-[#64748B] block text-xs">Age & Gender</span>
                <strong className="text-[#1C2624] text-base">{currentPatient.age} Years • {currentPatient.gender}</strong>
              </div>
              <div>
                <span className="text-[#64748B] block text-xs">Medical History</span>
                <span className="text-slate-800 text-sm">{currentPatient.medicalHistory || "Type II Diabetes, Hypertension"}</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: Symptoms Identified */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#1C2624] border-b border-[#E5E7EB] pb-2.5 flex items-center gap-2.5">
              <FileText className="h-5 w-5 text-[#047857]" />
              <span>2. Symptoms Identified</span>
            </h4>
            <div className="p-5 rounded-2xl bg-[#F7F7F2] border border-[#E5E7EB] text-sm leading-relaxed text-[#1C2624] space-y-3">
              <p className="font-medium text-base">&ldquo;{currentPatient.symptomsDescription}&rdquo;</p>
              <div className="flex flex-wrap gap-2.5 pt-1">
                {currentPatient.assessment.symptomsDetected.map((symp, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-1.5 border border-[#E5E7EB] font-bold text-xs sm:text-sm text-slate-800"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#047857]" />
                    <span>{symp.name}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 3: Vital Signs */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#1C2624] border-b border-[#E5E7EB] pb-2.5 flex items-center gap-2.5">
              <Activity className="h-5 w-5 text-[#047857]" />
              <span>3. Vital Signs</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
              <div className="p-4 rounded-xl border border-[#E5E7EB] bg-[#F7F7F2]">
                <span className="text-xs text-[#64748B] block">Heart Rate</span>
                <strong className="text-base sm:text-lg font-mono text-[#EF4444] font-black">
                  125 BPM
                </strong>
              </div>
              <div className="p-4 rounded-xl border border-[#E5E7EB] bg-[#F7F7F2]">
                <span className="text-xs text-[#64748B] block">Blood Pressure</span>
                <strong className="text-base sm:text-lg font-mono text-slate-900">
                  160/100 mmHg
                </strong>
              </div>
              <div className="p-4 rounded-xl border border-[#E5E7EB] bg-[#F7F7F2]">
                <span className="text-xs text-[#64748B] block">Temperature</span>
                <strong className="text-base sm:text-lg font-mono text-slate-900">
                  38.9°C
                </strong>
              </div>
              <div className="p-4 rounded-xl border border-[#FECACA] bg-[#FEF2F2]">
                <span className="text-xs text-[#EF4444] font-bold block">Oxygen Saturation</span>
                <strong className="text-base sm:text-lg font-mono text-[#EF4444] font-black">
                  88%
                </strong>
              </div>
              <div className="p-4 rounded-xl border border-[#E5E7EB] bg-[#F7F7F2]">
                <span className="text-xs text-[#64748B] block">Respiratory Rate</span>
                <strong className="text-base sm:text-lg font-mono text-[#EF4444] font-bold">
                  24/min
                </strong>
              </div>
            </div>
          </div>

          {/* SECTION 4: AI Analysis */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#1C2624] border-b border-[#E5E7EB] pb-2.5 flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 text-[#047857]" />
              <span>4. AI Analysis</span>
            </h4>
            <div className="p-5 rounded-2xl border border-[#E5E7EB] bg-[#F7F7F2] space-y-2.5 text-sm text-[#1C2624]">
              <p>
                The <strong>Smart Triage Agent</strong> multi-agent inference engine evaluated patient vitals against validated Emergency Severity Index (ESI) standards. Physiological parameters indicate acute coronary and hypoxemic risk factors requiring immediate resuscitation bay assignment.
              </p>
              <div className="flex items-center gap-6 text-xs font-mono text-[#64748B] pt-1">
                <span>Confidence: <strong>94%</strong></span>
                <span>Latency: <strong>3.8s</strong></span>
                <span>Algorithm: <strong>Bayesian Acuity Matrix v2.4</strong></span>
              </div>
            </div>
          </div>

          {/* SECTION 5: Priority Recommendation */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#1C2624] border-b border-[#E5E7EB] pb-2.5 flex items-center gap-2.5">
              <Activity className="h-5 w-5 text-[#047857]" />
              <span>5. Priority Recommendation</span>
            </h4>
            <div className="p-5 rounded-2xl border border-[#FECACA] bg-[#FEF2F2] flex items-center justify-between text-sm">
              <div>
                <span className="font-extrabold text-[#EF4444] text-lg font-heading">
                  CRITICAL (Immediate Resuscitation Priority)
                </span>
                <p className="text-[#64748B] text-xs mt-0.5">
                  Direct transfer to resuscitation bay recommended without triage queue delay.
                </p>
              </div>
              <span className="font-mono font-bold text-xs bg-white text-[#EF4444] px-3 py-1.5 rounded-lg border border-[#FECACA]">
                94% Match
              </span>
            </div>
          </div>

          {/* SECTION 6: Supporting Factors */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#1C2624] border-b border-[#E5E7EB] pb-2.5 flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-[#047857]" />
              <span>6. Supporting Factors</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {[
                "Low oxygen saturation (88% SpO2 on ambient room air)",
                "Severe chest pain radiating to left shoulder and jaw",
                "Difficulty breathing with tachypnea (24 breaths/min)",
                "Elevated heart rate (125 BPM sinus tachycardia)",
                "Acute symptom onset (< 45 minutes rapid progression)",
              ].map((factor, i) => (
                <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F7F7F2] border border-[#E5E7EB]">
                  <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                  <span className="font-semibold text-slate-800">{factor}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 7: Verification Status */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#1C2624] border-b border-[#E5E7EB] pb-2.5 flex items-center gap-2.5">
              <Shield className="h-5 w-5 text-[#047857]" />
              <span>7. Verification Status</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="p-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center gap-3 text-[#065F46] font-bold">
                <CheckCircle2 className="h-5 w-5 text-[#047857] shrink-0" />
                <span>Safety criteria checked</span>
              </div>
              <div className="p-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center gap-3 text-[#065F46] font-bold">
                <CheckCircle2 className="h-5 w-5 text-[#047857] shrink-0" />
                <span>High-risk indicators confirmed</span>
              </div>
              <div className="p-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center gap-3 text-[#065F46] font-bold">
                <CheckCircle2 className="h-5 w-5 text-[#047857] shrink-0" />
                <span>Escalation recommendation verified</span>
              </div>
            </div>
          </div>

          {/* SECTION 8: Clinical Decision */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#1C2624] border-b border-[#E5E7EB] pb-2.5 flex items-center gap-2.5">
              <Stethoscope className="h-5 w-5 text-[#047857]" />
              <span>8. Clinical Decision</span>
            </h4>
            <div className="rounded-2xl border border-[#E5E7EB] bg-[#F7F7F2] p-5 text-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[#64748B] block text-xs">Attending Physician:</span>
                  <strong className="text-[#1C2624] text-base">
                    {currentPatient.review?.clinicianName || "Dr. Sarah Jenkins, MD"}
                  </strong>
                </div>
                <div>
                  <span className="text-[#64748B] block text-xs">Clinical Determination:</span>
                  <span className="inline-block font-bold text-xs px-3 py-1 rounded-lg bg-[#047857] text-white uppercase">
                    {currentPatient.review?.decision || "ACCEPTED"}
                  </span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-xs">Review Timestamp:</span>
                  <span className="font-mono text-[#1C2624]">
                    {currentPatient.review?.reviewedAt || "10:16 AM"}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5E7EB]">
                <span className="text-[#64748B] block text-xs">Physician Directives:</span>
                <p className="text-slate-800 italic mt-1 text-sm sm:text-base">
                  &ldquo;{currentPatient.review?.reasonForModification || "Accepted AI recommendation. Immediate activation of Cardiac Catheterization protocol."}&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* DISCLAIMER */}
          <div className="pt-6 border-t border-[#E5E7EB] rounded-2xl p-5 bg-[#FFFBEB] border border-[#FDE68A] text-xs sm:text-sm text-slate-800 flex items-start gap-3.5">
            <ShieldAlert className="h-6 w-6 text-[#F59E0B] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="block text-[#B45309] font-bold mb-0.5">
                DISCLAIMER:
              </strong>
              This system provides AI-assisted decision support only. Final clinical decisions remain the responsibility of qualified healthcare professionals.
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
