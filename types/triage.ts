export type PriorityLevel = "CRITICAL" | "URGENT" | "NON-URGENT";

export type Gender = "Male" | "Female" | "Other";

export type SymptomDuration =
  | "Less than 1 hour"
  | "Few hours"
  | "1 day"
  | "More than 1 day";

export interface Vitals {
  heartRate: number; // BPM
  bloodPressureSystolic: number; // mmHg
  bloodPressureDiastolic: number; // mmHg
  temperature: number; // Celsius
  oxygenSaturation: number; // %
  respiratoryRate: number; // breaths/min
}

export type AgentName =
  | "Intake Agent"
  | "NLP Agent"
  | "Triage Agent"
  | "Verification Agent"
  | "Report Agent";

export type AgentState = "waiting" | "processing" | "completed" | "error";

export interface AgentInfo {
  name: AgentName;
  status: "Operational" | "Standby" | "Degraded";
  latencyMs: number;
  role: string;
  tasksCompleted: number;
  accuracyRate: number;
}

export interface DetectedSymptom {
  name: string;
  severity: "High" | "Moderate" | "Mild";
  category: string;
  highlightWords: string[];
}

export interface VerificationCheck {
  id: string;
  name: string;
  verified: boolean;
  description: string;
}

export interface TriageAssessment {
  priority: PriorityLevel;
  recommendation: string;
  confidence: number;
  whyThisPriority: string[];
  symptomsDetected: DetectedSymptom[];
  severity: "High" | "Moderate" | "Low";
  durationText: string;
  vitalSnapshot: Vitals;
  verificationChecks: VerificationCheck[];
  analyzedAt: string;
  pipelineLatencyMs: number;
}

export type ClinicalDecisionType = "ACCEPT" | "MODIFY" | "REJECT";

export interface ClinicalReview {
  decision: ClinicalDecisionType;
  finalPriority: PriorityLevel;
  clinicianName: string;
  clinicianRole: string;
  reasonForModification?: string;
  reviewedAt: string;
}

export interface Patient {
  id: string;
  fullName: string;
  age: number;
  gender: Gender;
  medicalHistory: string;
  symptomsDescription: string;
  duration: SymptomDuration;
  vitals: Vitals;
  assessment: TriageAssessment;
  review?: ClinicalReview;
  waitingTimeMin: number;
  admittedAt: string;
  status: "In Queue" | "Under Review" | "Attending Physician Assigned" | "Discharged";
}
