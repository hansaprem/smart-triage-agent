"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Patient } from "@/types/triage";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import {
  Activity,
  ArrowRight,
  Clock,
  Heart,
  ShieldCheck,
  User,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PatientCardProps {
  patient: Patient;
  showActions?: boolean;
}

export function PatientCard({ patient, showActions = true }: PatientCardProps) {
  const [expanded, setExpanded] = useState(false);
  const priority = patient.review?.finalPriority || patient.assessment.priority;

  const getBorderColor = () => {
    switch (priority) {
      case "CRITICAL":
        return "border border-[#FECACA] hover:border-red-400 shadow-sm";
      case "URGENT":
        return "border border-[#FDE68A] hover:border-amber-400 shadow-sm";
      case "NON-URGENT":
        return "border border-[#A7F3D0] hover:border-emerald-400 shadow-sm";
    }
  };

  return (
    <div
      className={cn(
        "rounded-xl bg-white p-4 transition-all duration-200",
        getBorderColor()
      )}
    >
      {/* Top Header: Priority Badge & Wait Time */}
      <div className="flex items-center justify-between gap-2">
        <PriorityBadge priority={priority} size="sm" />
        <div className="flex items-center gap-1 text-[11px] font-semibold text-[#64748B]">
          <Clock className="h-3 w-3 text-[#64748B]" />
          <span>Waiting: {patient.waitingTimeMin} min</span>
        </div>
      </div>

      {/* Patient Name & Demographics */}
      <div className="mt-3">
        <div className="flex items-baseline justify-between">
          <h4 className="text-sm font-bold text-[#1C2624] font-heading">
            {patient.fullName}
          </h4>
          <span className="text-[10px] font-mono text-[#64748B]">{patient.id}</span>
        </div>
        <p className="text-xs text-[#64748B] font-medium mt-0.5">
          {patient.age} Years • {patient.gender}
        </p>
      </div>

      {/* Symptoms Summary */}
      <div className="mt-3 bg-[#F7F7F2] rounded-lg p-2.5 border border-[#E5E7EB] text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
          Symptoms:
        </span>
        <p className="text-[#1C2624] font-medium leading-relaxed">
          {patient.symptomsDescription}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {patient.assessment.symptomsDetected.map((symp, i) => (
            <span
              key={i}
              className="text-[10px] font-semibold bg-white border border-[#E5E7EB] px-2 py-0.5 rounded text-slate-700"
            >
              {symp.name}
            </span>
          ))}
        </div>
      </div>

      {/* Vital signs summary row */}
      <div className="mt-3 grid grid-cols-3 gap-1.5 text-center text-[10px]">
        <div className="rounded bg-[#F7F7F2] p-1.5 border border-[#E5E7EB]">
          <span className="text-[#64748B] block">HR</span>
          <span className={cn("font-bold font-mono", patient.vitals.heartRate > 100 ? "text-[#EF4444]" : "text-[#1C2624]")}>
            {patient.vitals.heartRate} bpm
          </span>
        </div>
        <div className="rounded bg-[#F7F7F2] p-1.5 border border-[#E5E7EB]">
          <span className="text-[#64748B] block">SpO2</span>
          <span className={cn("font-bold font-mono", patient.vitals.oxygenSaturation < 90 ? "text-[#EF4444] font-black" : "text-[#1C2624]")}>
            {patient.vitals.oxygenSaturation}%
          </span>
        </div>
        <div className="rounded bg-[#F7F7F2] p-1.5 border border-[#E5E7EB]">
          <span className="text-[#64748B] block">BP</span>
          <span className="font-bold font-mono text-[#1C2624]">
            {patient.vitals.bloodPressureSystolic}/{patient.vitals.bloodPressureDiastolic}
          </span>
        </div>
      </div>

      {/* AI Confidence & Details toggle */}
      <div className="mt-3 pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-[#047857]" />
          <span className="text-[11px] font-semibold text-[#64748B]">
            AI Confidence: <strong className="text-[#1C2624] font-mono">{patient.assessment.confidence}%</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/reports?id=${patient.id}`}
            className="text-[11px] font-bold text-[#047857] hover:text-[#065F46]"
          >
            Report
          </Link>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-[#64748B] hover:text-[#1C2624] flex items-center gap-0.5"
          >
            <span>{expanded ? "Less" : "More"}</span>
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </div>
      </div>

      {/* Expanded Clinical Breakdown */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-dashed border-[#E5E7EB] space-y-2 text-xs">
          <div>
            <span className="font-semibold text-[#64748B] text-[11px]">Contributing Factors:</span>
            <ul className="mt-1 list-disc list-inside text-slate-700 space-y-0.5 text-[11px]">
              {patient.assessment.whyThisPriority.map((factor, idx) => (
                <li key={idx}>{factor}</li>
              ))}
            </ul>
          </div>

          {patient.review && (
            <div className="rounded-md bg-[#ECFDF5] border border-[#A7F3D0] p-2 text-[11px] text-[#065F46]">
              <p className="font-bold">Clinical Review Confirmed:</p>
              <p className="mt-0.5 text-slate-700">
                Decision: <strong className="uppercase">{patient.review.decision}</strong> by {patient.review.clinicianName}
              </p>
              {patient.review.reasonForModification && (
                <p className="mt-0.5 italic text-slate-500">"{patient.review.reasonForModification}"</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
