"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { VitalSignInput } from "@/components/assessment/VitalSignInput";
import { usePatientContext } from "@/lib/patient-context";
import { Gender, SymptomDuration, Vitals } from "@/types/triage";
import {
  Activity,
  ArrowRight,
  ClipboardList,
  Heart,
  HeartPulse,
  Sparkles,
  Stethoscope,
  Thermometer,
  User,
  Wind,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AssessmentPage() {
  const router = useRouter();
  const { setAssessmentDraft, loadPresetCase } = usePatientContext();

  const [fullName, setFullName] = useState("Ahmed Khan");
  const [age, setAge] = useState<number>(56);
  const [gender, setGender] = useState<Gender>("Male");
  const [patientId, setPatientId] = useState(`PT-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [medicalHistory, setMedicalHistory] = useState("Type II Diabetes (8 yrs), Hypertension, Ex-smoker");

  const [symptomsDescription, setSymptomsDescription] = useState(
    "Severe crushing retrosternal chest pain radiating to left shoulder and jaw for 45 minutes with acute shortness of breath and cold diaphoresis."
  );
  const [duration, setDuration] = useState<SymptomDuration>("Less than 1 hour");

  const [vitals, setVitals] = useState<Vitals>({
    heartRate: 125,
    bloodPressureSystolic: 160,
    bloodPressureDiastolic: 100,
    temperature: 38.9,
    oxygenSaturation: 88,
    respiratoryRate: 24,
  });

  const handleApplyPreset = (type: "critical" | "urgent" | "non-urgent") => {
    const preset = loadPresetCase(type);
    setFullName(preset.fullName);
    setAge(preset.age);
    setGender(preset.gender);
    setPatientId(preset.patientId);
    setMedicalHistory(preset.medicalHistory);
    setSymptomsDescription(preset.symptomsDescription);
    setDuration(preset.duration);
    setVitals(preset.vitals);
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    setAssessmentDraft({
      fullName,
      age: Number(age),
      gender,
      patientId,
      medicalHistory,
      symptomsDescription,
      duration,
      vitals,
    });
    router.push("/analysis");
  };

  return (
    <AppShell
      title="New Patient Assessment"
      subtitle="Enter patient information and clinical data."
    >
      <div className="w-full max-w-[1400px] mx-auto space-y-8">
        {/* Progress Step Indicator (Sized appropriately for 1440px viewport) */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {/* Step 1: Patient Information */}
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#047857] text-white text-sm font-bold font-mono shadow-sm">
                1
              </div>
              <div>
                <span className="text-sm font-bold text-[#1C2624] block">
                  1 Patient Information
                </span>
                <span className="text-xs text-[#64748B]">
                  Demographics & History
                </span>
              </div>
            </div>

            <div className="h-0.5 w-16 sm:w-28 bg-[#A7F3D0]" />

            {/* Step 2: Clinical Data */}
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#047857] text-white text-sm font-bold font-mono shadow-sm">
                2
              </div>
              <div>
                <span className="text-sm font-bold text-[#1C2624] block">
                  2 Clinical Data
                </span>
                <span className="text-xs text-[#64748B]">
                  Vitals & Symptoms
                </span>
              </div>
            </div>

            <div className="h-0.5 w-16 sm:w-28 bg-[#E5E7EB]" />

            {/* Step 3: AI Analysis */}
            <div className="flex items-center gap-3.5 opacity-60">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E5E7EB] text-[#64748B] text-sm font-bold font-mono">
                3
              </div>
              <div>
                <span className="text-sm font-bold text-[#1C2624] block">
                  3 AI Analysis
                </span>
                <span className="text-xs text-[#64748B]">
                  Multi-Agent Engine
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Demo Case Presets Bar */}
        <div className="rounded-2xl border-2 border-[#D1FAE5] bg-[#ECFDF5]/80 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-2.5 text-sm font-bold text-[#065F46]">
            <Sparkles className="h-5 w-5 text-[#D4A017]" />
            <span>Examiner One-Click Presets:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleApplyPreset("critical")}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#FEF2F2] border border-[#FECACA] text-[#EF4444] hover:bg-red-100 transition-all"
            >
              Critical Case (Ahmed Khan)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset("urgent")}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#FFFBEB] border border-[#FDE68A] text-[#F59E0B] hover:bg-amber-100 transition-all"
            >
              Urgent Case (Sara Ali)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset("non-urgent")}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white border border-[#A7F3D0] text-[#10B981] hover:bg-emerald-50 transition-all"
            >
              Non-Urgent Case (Bilal Ahmed)
            </button>
          </div>
        </div>

        {/* Main Form Form Factor */}
        <form onSubmit={handleAnalyze} className="space-y-8">
          {/* SECTION 1: Patient Information */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-7 lg:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
              <div className="flex items-center gap-2.5">
                <User className="h-5 w-5 text-[#047857]" />
                <h3 className="text-base font-bold font-heading text-[#1C2624] uppercase tracking-wider">
                  Patient Information
                </h3>
              </div>
              <span className="text-xs font-mono text-[#047857] font-bold">
                Demographics
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C2624] mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-12 rounded-xl border border-[#E5E7EB] px-4 text-sm font-medium text-[#1C2624] focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/20 outline-none transition-all"
                  placeholder="e.g. Ahmed Khan"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C2624] mb-2">
                  Age (Years) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full h-12 rounded-xl border border-[#E5E7EB] px-4 text-sm font-medium text-[#1C2624] focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/20 outline-none transition-all"
                  placeholder="56"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C2624] mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full h-12 rounded-xl border border-[#E5E7EB] px-4 text-sm font-medium text-[#1C2624] bg-white focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/20 outline-none transition-all"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Patient ID */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C2624] mb-2">
                  Patient ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full h-12 rounded-xl border border-[#E5E7EB] px-4 text-sm font-mono font-medium text-[#1C2624] focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/20 outline-none transition-all"
                />
              </div>

              {/* Medical History */}
              <div className="sm:col-span-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C2624] mb-2">
                  Medical History
                </label>
                <input
                  type="text"
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  placeholder="e.g. Type II Diabetes (8 yrs), Hypertension, Ex-smoker, None"
                  className="w-full h-12 rounded-xl border border-[#E5E7EB] px-4 text-sm font-medium text-[#1C2624] focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/20 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Symptoms & Duration */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-7 lg:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
              <div className="flex items-center gap-2.5">
                <ClipboardList className="h-5 w-5 text-[#047857]" />
                <h3 className="text-base font-bold font-heading text-[#1C2624] uppercase tracking-wider">
                  Symptoms & Duration
                </h3>
              </div>
              <span className="text-xs text-[#047857] font-bold">
                NLP Extraction
              </span>
            </div>

            {/* Large natural language input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1C2624] mb-2">
                Symptoms Description (Natural Language) <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={symptomsDescription}
                onChange={(e) => setSymptomsDescription(e.target.value)}
                placeholder="Describe the patient's symptoms in natural language..."
                className="w-full rounded-xl border border-[#E5E7EB] p-4 text-sm sm:text-base font-medium text-[#1C2624] placeholder:text-[#64748B] focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/20 outline-none transition-all leading-relaxed"
              />
              <p className="mt-2 text-xs text-[#64748B]">
                The NLP Agent parses clinical keywords (e.g. chest pain, breathing difficulty, dizziness, fever, persistent vomiting) from this field.
              </p>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1C2624] mb-2.5">
                Duration <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(
                  [
                    "Less than 1 hour",
                    "Few hours",
                    "1 day",
                    "More than 1 day",
                  ] as SymptomDuration[]
                ).map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setDuration(dur)}
                    className={cn(
                      "h-12 px-4 rounded-xl border text-xs sm:text-sm font-bold transition-all text-center flex items-center justify-center",
                      duration === dur
                        ? "border-[#047857] bg-[#D1FAE5]/80 text-[#065F46] ring-2 ring-[#047857]/20 shadow-sm"
                        : "border-[#E5E7EB] bg-white text-[#64748B] hover:border-slate-300"
                    )}
                  >
                    {dur}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 3: Vital Signs */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-7 lg:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
              <div className="flex items-center gap-2.5">
                <Activity className="h-5 w-5 text-[#047857]" />
                <h3 className="text-base font-bold font-heading text-[#1C2624] uppercase tracking-wider">
                  Vital Signs
                </h3>
              </div>
              <span className="text-xs font-mono text-[#64748B]">
                Objective Physiological Indicators
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Heart Rate */}
              <VitalSignInput
                label="Heart Rate"
                unit="BPM"
                value={vitals.heartRate}
                onChange={(val) => setVitals({ ...vitals, heartRate: val })}
                normalRange="60 - 100"
                min={30}
                max={240}
                isAbnormal={vitals.heartRate > 100 || vitals.heartRate < 50}
                isCritical={vitals.heartRate > 130 || vitals.heartRate < 45}
                icon={<Heart className="h-4 w-4 text-[#EF4444]" />}
              />

              {/* Oxygen Saturation */}
              <VitalSignInput
                label="Oxygen Saturation"
                unit="SpO2 %"
                value={vitals.oxygenSaturation}
                onChange={(val) => setVitals({ ...vitals, oxygenSaturation: val })}
                normalRange="95 - 100%"
                min={50}
                max={100}
                isAbnormal={vitals.oxygenSaturation < 95}
                isCritical={vitals.oxygenSaturation < 90}
                icon={<Wind className="h-4 w-4 text-blue-500" />}
              />

              {/* Temperature */}
              <VitalSignInput
                label="Temperature"
                unit="°C"
                value={vitals.temperature}
                onChange={(val) => setVitals({ ...vitals, temperature: val })}
                normalRange="36.5 - 37.5°C"
                min={32}
                max={43}
                step={0.1}
                isAbnormal={vitals.temperature >= 38.0 || vitals.temperature <= 35.5}
                isCritical={vitals.temperature >= 39.5 || vitals.temperature <= 35.0}
                icon={<Thermometer className="h-4 w-4 text-[#F59E0B]" />}
              />

              {/* Blood Pressure Systolic */}
              <VitalSignInput
                label="BP Systolic"
                unit="mmHg"
                value={vitals.bloodPressureSystolic}
                onChange={(val) => setVitals({ ...vitals, bloodPressureSystolic: val })}
                normalRange="90 - 120"
                min={60}
                max={260}
                isAbnormal={vitals.bloodPressureSystolic > 140 || vitals.bloodPressureSystolic < 90}
                isCritical={vitals.bloodPressureSystolic >= 180 || vitals.bloodPressureSystolic < 80}
                icon={<Activity className="h-4 w-4 text-[#047857]" />}
              />

              {/* Blood Pressure Diastolic */}
              <VitalSignInput
                label="BP Diastolic"
                unit="mmHg"
                value={vitals.bloodPressureDiastolic}
                onChange={(val) => setVitals({ ...vitals, bloodPressureDiastolic: val })}
                normalRange="60 - 80"
                min={40}
                max={150}
                isAbnormal={vitals.bloodPressureDiastolic > 90}
                isCritical={vitals.bloodPressureDiastolic > 110}
                icon={<Activity className="h-4 w-4 text-[#047857]" />}
              />

              {/* Respiratory Rate */}
              <VitalSignInput
                label="Respiratory Rate"
                unit="/min"
                value={vitals.respiratoryRate}
                onChange={(val) => setVitals({ ...vitals, respiratoryRate: val })}
                normalRange="12 - 20"
                min={6}
                max={60}
                isAbnormal={vitals.respiratoryRate > 20 || vitals.respiratoryRate < 12}
                isCritical={vitals.respiratoryRate >= 28 || vitals.respiratoryRate < 10}
                icon={<Wind className="h-4 w-4 text-purple-500" />}
              />
            </div>
          </div>

          {/* PRIMARY BUTTON: Analyze Patient */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-[#64748B]">
              Clicking <strong>Analyze Patient</strong> activates the autonomous 5-agent reasoning engine.
            </p>

            <button
              type="submit"
              className="w-full sm:w-auto h-13 px-10 inline-flex items-center justify-center gap-2 rounded-xl bg-[#047857] text-base font-bold text-white shadow-lg shadow-[#047857]/20 hover:bg-[#065F46] hover:shadow-xl transition-all active:scale-[0.98]"
            >
              <span>Analyze Patient</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
