"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  Bell,
  CheckCircle2,
  Save,
  Sliders,
  Sun,
  User,
} from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  // Profile Settings
  const [fullName, setFullName] = useState("Dr. Sarah Jenkins, MD");
  const [email, setEmail] = useState("dr.sarah@hospital.org");
  const [department, setDepartment] = useState("Emergency Medicine & Trauma");

  // Notification Preferences
  const [criticalAudioAlerts, setCriticalAudioAlerts] = useState(true);
  const [visualFlashAlerts, setVisualFlashAlerts] = useState(true);
  const [emailSummaries, setEmailSummaries] = useState(false);

  // System Preferences
  const [autoVerification, setAutoVerification] = useState(true);
  const [triageProtocol, setTriageProtocol] = useState("Emergency Severity Index (ESI v4)");
  const [confidenceFloor, setConfidenceFloor] = useState(80);

  // Appearance
  const [compactMode, setCompactMode] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <AppShell
      title="Settings"
      subtitle="System configurations and personal preferences"
    >
      <div className="w-full max-w-[1400px] mx-auto space-y-8">
        {saved && (
          <div className="rounded-2xl border border-[#A7F3D0] bg-[#ECFDF5] p-5 shadow-sm flex items-center gap-3.5 text-sm text-[#065F46] font-bold animate-fadeIn">
            <CheckCircle2 className="h-6 w-6 text-[#047857]" />
            <span>Settings saved successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* SECTION 1: Profile Settings */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-7 lg:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2.5">
                <User className="h-5 w-5 text-[#047857]" />
                <h3 className="text-sm font-bold font-heading text-[#1C2624] uppercase tracking-wider">
                  Profile Settings
                </h3>
              </div>
              <span className="text-xs font-mono text-[#64748B]">Physician Credentials</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C2624] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-12 rounded-xl border border-[#E5E7EB] px-4 text-sm font-medium text-[#1C2624] focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C2624] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 rounded-xl border border-[#E5E7EB] px-4 text-sm font-medium text-[#1C2624] focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/20 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C2624] mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full h-12 rounded-xl border border-[#E5E7EB] px-4 text-sm font-medium text-[#1C2624] focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/20 outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Notification Preferences */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-7 lg:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2.5">
                <Bell className="h-5 w-5 text-[#047857]" />
                <h3 className="text-sm font-bold font-heading text-[#1C2624] uppercase tracking-wider">
                  Notification Preferences
                </h3>
              </div>
              <span className="text-xs font-mono text-[#64748B]">Audio & Visual Alarms</span>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between p-4 rounded-xl border border-[#E5E7EB] bg-[#F7F7F2]/60">
                <div>
                  <span className="font-bold text-[#1C2624] block">
                    Critical Audio Chime
                  </span>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Sound an audible chime when an incoming patient is stratified as Critical.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={criticalAudioAlerts}
                  onChange={(e) => setCriticalAudioAlerts(e.target.checked)}
                  className="h-5 w-5 rounded border-[#E5E7EB] text-[#047857] focus:ring-[#047857] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-[#E5E7EB] bg-[#F7F7F2]/60">
                <div>
                  <span className="font-bold text-[#1C2624] block">
                    Visual Flash Alerts
                  </span>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Briefly pulse header indicators upon Critical patient admission.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={visualFlashAlerts}
                  onChange={(e) => setVisualFlashAlerts(e.target.checked)}
                  className="h-5 w-5 rounded border-[#E5E7EB] text-[#047857] focus:ring-[#047857] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-[#E5E7EB] bg-[#F7F7F2]/60">
                <div>
                  <span className="font-bold text-[#1C2624] block">
                    Shift Change Summary Email
                  </span>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Receive an automated digest of triage volume and physician modifications.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={emailSummaries}
                  onChange={(e) => setEmailSummaries(e.target.checked)}
                  className="h-5 w-5 rounded border-[#E5E7EB] text-[#047857] focus:ring-[#047857] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: System Preferences */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-7 lg:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2.5">
                <Sliders className="h-5 w-5 text-[#047857]" />
                <h3 className="text-sm font-bold font-heading text-[#1C2624] uppercase tracking-wider">
                  System Preferences
                </h3>
              </div>
              <span className="text-xs font-mono text-[#64748B]">Agent Configuration</span>
            </div>

            <div className="space-y-5 text-sm">
              <div className="flex items-center justify-between p-4 rounded-xl border border-[#E5E7EB] bg-[#F7F7F2]/60">
                <div>
                  <span className="font-bold text-[#1C2624] block">
                    Verification Agent Strict Enforcement
                  </span>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Require automated safety constraint checks before displaying AI acuity output.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={autoVerification}
                  onChange={(e) => setAutoVerification(e.target.checked)}
                  className="h-5 w-5 rounded border-[#E5E7EB] text-[#047857] focus:ring-[#047857] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C2624] mb-2">
                  Triage Standard Protocol
                </label>
                <select
                  value={triageProtocol}
                  onChange={(e) => setTriageProtocol(e.target.value)}
                  className="w-full h-12 rounded-xl border border-[#E5E7EB] px-4 text-sm font-medium text-[#1C2624] bg-white focus:border-[#047857] outline-none"
                >
                  <option value="Emergency Severity Index (ESI v4)">
                    Emergency Severity Index (ESI v4)
                  </option>
                  <option value="Manchester Triage System (MTS)">
                    Manchester Triage System (MTS)
                  </option>
                  <option value="Canadian Triage and Acuity Scale (CTAS)">
                    Canadian Triage and Acuity Scale (CTAS)
                  </option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1C2624]">
                    AI Confidence Threshold:
                  </span>
                  <span className="font-mono font-bold text-base text-[#047857]">
                    {confidenceFloor}%
                  </span>
                </div>
                <input
                  type="range"
                  min={60}
                  max={95}
                  value={confidenceFloor}
                  onChange={(e) => setConfidenceFloor(Number(e.target.value))}
                  className="w-full accent-[#047857] cursor-pointer"
                />
                <p className="text-xs text-[#64748B]">
                  Evaluations with confidence scores below this floor trigger an explicit low-certainty alert.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 4: Appearance */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-7 lg:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2.5">
                <Sun className="h-5 w-5 text-[#047857]" />
                <h3 className="text-sm font-bold font-heading text-[#1C2624] uppercase tracking-wider">
                  Appearance
                </h3>
              </div>
              <span className="text-xs font-mono text-[#64748B]">Visual Styling</span>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between p-4 rounded-xl border border-[#E5E7EB] bg-[#F7F7F2]/60">
                <div>
                  <span className="font-bold text-[#1C2624] block">
                    Soft Ivory Theme (#F7F7F2)
                  </span>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Official healthcare palette with primary emerald & subtle gold accents.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#065F46] bg-[#D1FAE5] px-3 py-1 rounded-full">
                  Active Theme
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-[#E5E7EB] bg-[#F7F7F2]/60">
                <div>
                  <span className="font-bold text-[#1C2624] block">
                    Compact Table Rows
                  </span>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Optimize display density for high-volume emergency department monitors.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={compactMode}
                  onChange={(e) => setCompactMode(e.target.checked)}
                  className="h-5 w-5 rounded border-[#E5E7EB] text-[#047857] focus:ring-[#047857] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="h-13 px-8 inline-flex items-center gap-2 rounded-xl bg-[#047857] text-base font-bold text-white shadow-md shadow-[#047857]/20 hover:bg-[#065F46] transition-all active:scale-[0.98]"
            >
              <Save className="h-5 w-5" />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
