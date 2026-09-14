"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Heart,
  HeartPulse,
  Lock,
  Mail,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
  Zap,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("dr.sarah@hospital.org");
  const [password, setPassword] = useState("••••••••••••");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 400);
  };

  const handleDemoSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 200);
  };

  return (
    <div className="min-h-screen lg:h-screen w-full bg-[#F7F7F2] flex flex-col lg:flex-row text-[#1C2624] selection:bg-[#D1FAE5] selection:text-[#065F46] overflow-x-hidden lg:overflow-hidden">
      {/* ========================================================================= */}
      {/* LEFT PANEL: 50% Screen, Soft Ivory, Large Typography, Rich AI Illustration */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-1/2 bg-[#F7F7F2] border-b lg:border-b-0 lg:border-r border-[#E5E7EB] p-8 lg:p-12 xl:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle Decorative Abstract Shapes */}
        <div className="absolute -top-32 -left-32 w-[450px] h-[450px] rounded-full bg-[#D1FAE5]/60 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-36 -right-36 w-[500px] h-[500px] rounded-full bg-[#D1FAE5]/50 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-[#FEF3C7]/40 blur-2xl pointer-events-none" />

        {/* Top Header Branding */}
        <div className="relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-[#047857] text-white shadow-md shadow-[#047857]/20">
              <HeartPulse className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-black text-xl lg:text-2xl tracking-tight text-[#1C2624]">
                  SMART TRIAGE AGENT
                </h1>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#065F46] bg-[#D1FAE5] px-2 py-0.5 rounded">
                  FYP
                </span>
              </div>
              <p className="text-xs lg:text-sm font-semibold text-[#047857] tracking-wider uppercase mt-0.5">
                AI-Powered Emergency Decision Support System
              </p>
            </div>
          </div>
        </div>

        {/* Middle Core Statement & High-Impact Healthcare Dashboard Visual */}
        <div className="my-8 lg:my-6 space-y-6 lg:space-y-8 relative z-10 max-w-2xl">
          {/* Typography: 48–56px Heading, 18–20px Body */}
          <div className="space-y-3 lg:space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white border border-[#E5E7EB] px-4 py-1.5 text-xs font-bold text-[#065F46] shadow-sm">
              <ShieldCheck className="h-4 w-4 text-[#047857]" />
              <span>Final Year Project • Academic Clinical Decision Prototype</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-[52px] font-black font-heading text-[#1C2624] tracking-tight leading-[1.12]">
              Intelligent triage. <br />
              <span className="text-[#047857]">Human authority.</span>
            </h2>

            <p className="text-base sm:text-lg lg:text-[19px] font-medium text-slate-700 leading-relaxed max-w-xl">
              Empowering emergency clinical teams with autonomous multi-agent acuity prediction, real-time vital sign safety validation, and human-in-the-loop decision control.
            </p>
          </div>

          {/* LARGE PREMIUM HEALTHCARE / AI DASHBOARD ILLUSTRATION (Occupies meaningful space) */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white/95 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-md space-y-5">
            {/* Top HUD Bar */}
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3.5">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#047857]"></span>
                </span>
                <span className="text-xs font-mono font-bold text-[#065F46] tracking-wide">
                  5-AGENT COLLABORATIVE PIPELINE ONLINE
                </span>
              </div>
              <span className="text-xs font-mono font-semibold text-[#64748B] bg-[#F7F7F2] px-2.5 py-1 rounded-md border border-[#E5E7EB]">
                LATENCY 3.8s • 94.2% ACCURACY
              </span>
            </div>

            {/* Live Cardiac Waveform + Vitals Telemetry HUD */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Cardiac Waveform Monitor */}
              <div className="sm:col-span-8 rounded-xl bg-[#F7F7F2] p-4 border border-[#E5E7EB] relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                    <Heart className="h-3.5 w-3.5 text-[#EF4444]" />
                    Lead II Telemetry (Live)
                  </span>
                  <span className="text-xs font-mono font-extrabold text-[#EF4444] bg-[#FEF2F2] px-2 py-0.5 rounded border border-[#FECACA]">
                    125 BPM • TACHYCARDIA
                  </span>
                </div>
                {/* Clean SVG Cardiac Wave */}
                <div className="h-16 w-full flex items-center justify-center">
                  <svg
                    viewBox="0 0 500 70"
                    className="w-full h-full stroke-[#047857] fill-none stroke-[2.5]"
                  >
                    <path d="M0,35 L70,35 L85,15 L95,58 L108,8 L120,40 L135,35 L220,35 L235,10 L245,62 L258,5 L270,42 L285,35 L370,35 L385,12 L395,60 L408,6 L420,40 L435,35 L500,35" />
                  </svg>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-[#64748B]">
                  <span>SpO2: <strong className="text-[#EF4444]">88% (Critical)</strong></span>
                  <span>BP: <strong className="text-slate-900">160/100 mmHg</strong></span>
                  <span>RR: <strong className="text-[#F59E0B]">24/min</strong></span>
                </div>
              </div>

              {/* Acuity Tiers Snapshot */}
              <div className="sm:col-span-4 space-y-2">
                <div className="rounded-lg bg-[#FEF2F2] border border-[#FECACA] p-2.5 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#EF4444]">Critical</span>
                  <span className="text-sm font-black font-mono text-[#EF4444]">04 pts</span>
                </div>
                <div className="rounded-lg bg-[#FFFBEB] border border-[#FDE68A] p-2.5 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F59E0B]">Urgent</span>
                  <span className="text-sm font-black font-mono text-[#F59E0B]">12 pts</span>
                </div>
                <div className="rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] p-2.5 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#10B981]">Non-Urgent</span>
                  <span className="text-sm font-black font-mono text-[#10B981]">18 pts</span>
                </div>
              </div>
            </div>

            {/* 5-Agent Flow Visual */}
            <div className="pt-2 border-t border-[#E5E7EB]">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-1.5 text-[#047857]">
                  <span className="w-2 h-2 rounded-full bg-[#047857]" />
                  <span>Intake Agent</span>
                </div>
                <span className="text-[#047857]">→</span>
                <div className="flex items-center gap-1.5 text-[#047857]">
                  <span className="w-2 h-2 rounded-full bg-[#047857]" />
                  <span>NLP Agent</span>
                </div>
                <span className="text-[#047857]">→</span>
                <div className="flex items-center gap-1.5 text-[#047857]">
                  <span className="w-2 h-2 rounded-full bg-[#047857]" />
                  <span>Triage Agent</span>
                </div>
                <span className="text-[#047857]">→</span>
                <div className="flex items-center gap-1.5 text-[#047857]">
                  <span className="w-2 h-2 rounded-full bg-[#047857]" />
                  <span>Verification</span>
                </div>
                <span className="text-[#047857]">→</span>
                <div className="flex items-center gap-1.5 text-[#047857]">
                  <span className="w-2 h-2 rounded-full bg-[#047857]" />
                  <span>Report</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="relative z-10 rounded-xl bg-white/80 border border-[#E5E7EB] p-4 text-xs lg:text-sm text-[#64748B] flex items-center gap-3 shadow-sm">
          <ShieldAlert className="h-5 w-5 text-[#F59E0B] shrink-0" />
          <span>
            <strong>Clinical Safety Notice:</strong> AI provides decision support only. Final clinical decisions remain with qualified healthcare professionals.
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT PANEL: 50% Screen, Vertically & Horizontally Centered, 450px Card */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 sm:p-12 lg:p-16 xl:p-20">
        <div className="w-full max-w-[460px] space-y-7">
          {/* Header */}
          <div className="space-y-2">
            <h3 className="text-3xl lg:text-4xl font-black font-heading text-[#1C2624] tracking-tight">
              Welcome Back
            </h3>
            <p className="text-sm lg:text-base text-[#64748B] font-medium leading-normal">
              Sign in to access the Smart Triage Agent system.
            </p>
          </div>

          {/* Quick Demo Access Box for Supervisor Evaluation */}
          <div className="rounded-2xl border-2 border-[#D1FAE5] bg-[#ECFDF5]/80 p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold text-[#065F46]">
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#D4A017]" />
                <span className="text-sm">Supervisor / Examiner Demo Access</span>
              </span>
              <span className="text-xs bg-[#D1FAE5] text-[#065F46] px-2.5 py-0.5 rounded-full font-mono font-bold">
                Dr. Sarah
              </span>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Instantly open the live dashboard with pre-loaded mock patient data, active multi-agent pipeline, and clinical workflows.
            </p>
            <button
              type="button"
              onClick={handleDemoSignIn}
              disabled={loading}
              className="w-full h-12 inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#047857] px-5 text-sm font-bold text-white shadow-md shadow-[#047857]/20 hover:bg-[#065F46] transition-all active:scale-[0.99]"
            >
              <UserCheck className="h-4 w-4" />
              <span>{loading ? "Authenticating Session..." : "Instant Demo Sign In as Dr. Sarah"}</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#E5E7EB] w-full" />
            <span className="bg-white px-4 text-xs font-bold text-[#64748B] uppercase tracking-wider">
              Or Manual Sign In
            </span>
          </div>

          {/* Login Form: Proper 48–52px Input Height */}
          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1C2624] mb-2">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 h-5 w-5 text-[#64748B]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 rounded-xl border border-[#E5E7EB] pl-12 pr-4 text-sm font-medium text-[#1C2624] placeholder:text-[#64748B] focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/20 outline-none transition-all"
                  placeholder="name@hospital.org"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1C2624]">
                  Password
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Demo Mode: Click 'Instant Demo Sign In as Dr. Sarah' to proceed.");
                  }}
                  className="text-xs font-semibold text-[#047857] hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 h-5 w-5 text-[#64748B]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 rounded-xl border border-[#E5E7EB] pl-12 pr-4 text-sm font-medium text-[#1C2624] focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/20 outline-none transition-all"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-[#E5E7EB] text-[#047857] focus:ring-[#047857]"
                />
                <span className="text-xs sm:text-sm text-[#64748B] font-medium">Remember Me</span>
              </label>
            </div>

            {/* Prominent Full-Width Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-13 inline-flex items-center justify-center gap-2 rounded-xl bg-[#047857] px-6 text-base font-bold text-white shadow-lg shadow-[#047857]/25 hover:bg-[#065F46] transition-all active:scale-[0.99]"
            >
              <span>{loading ? "Authenticating..." : "Sign In"}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          {/* Prototype Scope Note */}
          <div className="pt-2 text-center text-xs text-[#64748B]">
            Final Year Project Prototype • Emergency Department Clinical Decision Support
          </div>
        </div>
      </div>
    </div>
  );
}
