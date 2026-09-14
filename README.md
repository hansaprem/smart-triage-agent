# SMART TRIAGE AGENT
### AI-Powered Emergency Decision Support System

> **ACADEMIC HEALTHCARE AI FINAL YEAR PROJECT (FYP) PROTOTYPE**  
> **IMPORTANT MEDICAL DISCLAIMER**: This application is a decision-support prototype, **NOT** a medical diagnostic or treatment system. The application clearly communicates that final clinical decisions remain exclusively with qualified healthcare professionals.

---

## 🏥 Project Overview

**Smart Triage Agent** is an interactive web prototype designed to assist emergency department staff in prioritizing incoming patients based on presenting symptoms, physiological vital signs, medical history, and preliminary multi-agent AI analysis.

The system features a **Human-in-the-Loop** architecture: AI agents parse natural language narratives, stratify acute risk tiers, and verify safety bounds, while presenting attending physicians with complete clinical justification and an interactive review gateway before patient admission to the live queue.

---

## 🎨 Design System: Soft Ivory + Emerald

Engineered with a calm, trustworthy, human-centered healthcare SaaS interface:
- **Main Background**: `#F7F7F2` (Soft Ivory)
- **Card Background**: `#FFFFFF`
- **Primary Emerald**: `#047857`
- **Dark Emerald**: `#065F46`
- **Light Mint**: `#D1FAE5`
- **Gold Accent**: `#D4A017`
- **Light Gold**: `#FEF3C7`
- **Primary Text**: `#1C2624`
- **Secondary Text**: `#64748B`
- **Border**: `#E5E7EB`
- **Critical Priority**: `#EF4444` (Bg: `#FEF2F2`)
- **Urgent Priority**: `#F59E0B` (Bg: `#FFFBEB`)
- **Non-Urgent Priority**: `#10B981` (Bg: `#ECFDF5`)
- **Typography**: Manrope (Headings) + Inter (Body)

---

## 🤖 Multi-Agent Architecture

The prototype models an autonomous pipeline of five specialized agents:

1. **Intake Agent**: Ingests patient demographics, previous medical records, and executes range validation checks.
2. **NLP Agent**: Extracts clinical entities, cardinal symptoms, symptom duration, and pain descriptions from natural language.
3. **Triage Agent**: Synthesizes vital signs with extracted symptoms using stratified Emergency Severity Index (ESI) rules to assign priority (`CRITICAL`, `URGENT`, `NON-URGENT`) and confidence scores.
4. **Verification Agent**: Audits recommendations against physiological safety bounds and escalation criteria to prevent under-triage.
5. **Report Agent**: Generates structured EHR summary reports ready for physician sign-off and clinical handoff.

---

## 🧭 Page Structure & Navigation

- **Landing Page (`/`)**: High-fidelity landing page with animated abstract medical graphic, feature highlights, and multi-agent pipeline overview.
- **Login Page (`/login`)**: Split-screen clinical login with 1-click **Instant Demo Login as Dr. Sarah**.
- **Dashboard (`/dashboard`)**: Overview displaying 4 KPI statistics (Critical: 04, Urgent: 12, Non-Urgent: 18, Avg Triage Time: 03:42), 24-hour activity chart, 5-agent operational panel, and recent patient activity feed.
- **New Patient Assessment (`/assessment`)**: 3-step intake form with natural language text input, physiological vitals, and 3 one-click clinical presets for examiners.
- **AI Triage Engine (`/analysis`)**: Live animated multi-agent execution pipeline with real-time reasoning terminal and symptom extraction.
- **AI Triage Result (`/result`)**: Acuity result card with "Why this priority?" justification factors, clinical snapshot, and safety verification audit.
- **Human Clinical Review (`/review`)**: Dedicated human-in-the-loop review interface allowing attending doctors to accept, modify, or reject AI recommendations with audit notes.
- **Patient Queue (`/queue`)**: Real-time 3-column triage board (Critical, Urgent, Non-Urgent) with live search and filtering.
- **AI Insights (`/insights`)**: Analytics dashboard with priority distribution, common presenting complaints, and multi-agent latency benchmarks.
- **Emergency Reports (`/reports`)**: Printable clinical triage report with `@media print` layout and formal medical disclaimer.
- **Settings (`/settings`)**: Department protocols, vital sign thresholds, and alert preferences.

---

## ⚙️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion & CSS keyframe pulses
- **State Management**: React Context with LocalStorage persistence (zero external backend required)

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js 18.17+ or 20.x+
- npm 9+ or 10+

### Setup & Launch
```bash
# 1. Clone or navigate to the repository folder
cd smart-triage-agent

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🧪 Testing the Prototype (Examiner Guide)

1. **Test Landing & Login**:
   - Navigate to `/`. Explore the abstract medical graphic and click **Access Platform**.
   - On `/login`, click **Instant Demo Login as Dr. Sarah** to bypass password entry.

2. **Test Critical Flow**:
   - Go to **New Assessment** (`/assessment`).
   - Click **Preset: Critical (Ahmed Khan)**.
   - Note SpO2: 88% (hypoxemic), HR: 125 BPM, severe chest pain.
   - Click **Analyze Patient** -> watch the 5 agents progress sequentially on `/analysis`.
   - On `/result`, inspect the **CRITICAL** rating (94% confidence) and clinical factors.
   - Click **Continue to Clinical Review** -> choose **Accept Recommendation** and confirm.
   - Verify Ahmed Khan is placed at the top of the **Critical** column in `/queue`.

3. **Test Urgent Flow**:
   - Load **Preset: Urgent (Sara Ali)** on `/assessment`.
   - Note high fever (39.2°C) and persistent vomiting.
   - Run analysis -> observe **URGENT** classification.

4. **Test Non-Urgent Flow & Modification**:
   - Load **Preset: Non-Urgent (Bilal Ahmed)**.
   - In **Human Clinical Review**, test selecting **Modify Priority** to override the classification and enter physician notes.

5. **Test Report & Printing**:
   - Visit **Reports** (`/reports`), select any patient from the dropdown, and click **Print Report** to inspect the printable medical summary.

---

## ☁️ Deployment to Vercel

The project is fully pre-configured for one-click deployment on [Vercel](https://vercel.com):

1. Push this project folder to a GitHub, GitLab, or Bitbucket repository.
2. Sign in to Vercel and click **Add New Project**.
3. Import the repository.
4. Framework preset will automatically detect **Next.js**.
5. Click **Deploy**. No environment variables are required!

---

## ⚖️ Academic License & Disclaimer

Developed as an undergraduate/graduate academic computer science Final Year Project. This system is designed solely for educational and simulation demonstration. It is not licensed as a medical device (SaMD) and must not be used for diagnostic purposes.
