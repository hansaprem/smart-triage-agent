"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AgentInfo,
  ClinicalReview,
  Patient,
  PriorityLevel,
  SymptomDuration,
  TriageAssessment,
  Vitals,
} from "@/types/triage";
import { initialPatients } from "@/data/mock-patients";
import { runTriageAssessment } from "@/lib/triage-engine";

interface AssessmentDraft {
  fullName: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  patientId: string;
  medicalHistory: string;
  symptomsDescription: string;
  duration: SymptomDuration;
  vitals: Vitals;
}

interface PatientContextType {
  patients: Patient[];
  activeDraft: AssessmentDraft | null;
  activeAssessment: TriageAssessment | null;
  activePatient: Patient | null;
  agents: AgentInfo[];
  stats: {
    criticalCount: number;
    urgentCount: number;
    nonUrgentCount: number;
    averageTriageTime: string;
    analyzedToday: number;
    averageConfidence: number;
    averageAnalysisTime: string;
  };
  setAssessmentDraft: (draft: AssessmentDraft) => void;
  executeAssessment: () => TriageAssessment;
  saveClinicalDecision: (review: ClinicalReview) => Patient;
  getPatientById: (id: string) => Patient | undefined;
  resetActiveSession: () => void;
  loadPresetCase: (preset: "critical" | "urgent" | "non-urgent") => AssessmentDraft;
}

const defaultDraft: AssessmentDraft = {
  fullName: "Ahmed Khan",
  age: 56,
  gender: "Male",
  patientId: `PT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
  medicalHistory: "Type II Diabetes (8 yrs), Hypertension",
  symptomsDescription: "Severe crushing chest pain radiating to left arm and jaw for the past 45 minutes with acute difficulty breathing and cold sweating.",
  duration: "Less than 1 hour",
  vitals: {
    heartRate: 125,
    bloodPressureSystolic: 160,
    bloodPressureDiastolic: 100,
    temperature: 38.9,
    oxygenSaturation: 88,
    respiratoryRate: 24,
  },
};

const initialAgents: AgentInfo[] = [
  {
    name: "Intake Agent",
    status: "Operational",
    latencyMs: 18,
    role: "Validation, FHIR ingestion, demographic parsing & range sanity checks",
    tasksCompleted: 142,
    accuracyRate: 99.8,
  },
  {
    name: "NLP Agent",
    status: "Operational",
    latencyMs: 420,
    role: "Clinical entity extraction, semantic duration mapping, SNOMED-CT linking",
    tasksCompleted: 139,
    accuracyRate: 96.4,
  },
  {
    name: "Triage Agent",
    status: "Operational",
    latencyMs: 1150,
    role: "Multi-parameter risk stratification, acute symptom cross-referencing",
    tasksCompleted: 138,
    accuracyRate: 94.2,
  },
  {
    name: "Verification Agent",
    status: "Operational",
    latencyMs: 680,
    role: "Safety constraints auditing, escalation threshold verification",
    tasksCompleted: 138,
    accuracyRate: 99.1,
  },
  {
    name: "Report Agent",
    status: "Operational",
    latencyMs: 310,
    role: "Structured EHR summary generation, audit trail logging & export dispatch",
    tasksCompleted: 136,
    accuracyRate: 100.0,
  },
];

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function PatientProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [activeDraft, setActiveDraft] = useState<AssessmentDraft | null>(null);
  const [activeAssessment, setActiveAssessment] = useState<TriageAssessment | null>(null);
  const [activePatient, setActivePatient] = useState<Patient | null>(null);
  const [agents] = useState<AgentInfo[]>(initialAgents);

  // Hydrate from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem("smart_triage_patients");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPatients(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const saveToStorage = (updatedPatients: Patient[]) => {
    setPatients(updatedPatients);
    try {
      localStorage.setItem("smart_triage_patients", JSON.stringify(updatedPatients));
    } catch {
      // ignore
    }
  };

  const setAssessmentDraft = (draft: AssessmentDraft) => {
    setActiveDraft(draft);
  };

  const executeAssessment = (): TriageAssessment => {
    const draft = activeDraft || defaultDraft;
    const assessment = runTriageAssessment(draft.vitals, draft.symptomsDescription, draft.duration);
    setActiveAssessment(assessment);

    // Create candidate patient
    const candidate: Patient = {
      id: draft.patientId || `PT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: draft.fullName,
      age: draft.age,
      gender: draft.gender,
      medicalHistory: draft.medicalHistory,
      symptomsDescription: draft.symptomsDescription,
      duration: draft.duration,
      vitals: draft.vitals,
      assessment,
      waitingTimeMin: 1,
      admittedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "Under Review",
    };
    setActivePatient(candidate);
    return assessment;
  };

  const saveClinicalDecision = (review: ClinicalReview): Patient => {
    const current = activePatient || {
      id: `PT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: activeDraft?.fullName || "Patient Case",
      age: activeDraft?.age || 45,
      gender: activeDraft?.gender || "Male",
      medicalHistory: activeDraft?.medicalHistory || "None",
      symptomsDescription: activeDraft?.symptomsDescription || "Clinical referral",
      duration: activeDraft?.duration || "Few hours",
      vitals: activeDraft?.vitals || {
        heartRate: 110,
        bloodPressureSystolic: 140,
        bloodPressureDiastolic: 90,
        temperature: 38.2,
        oxygenSaturation: 91,
        respiratoryRate: 20,
      },
      assessment: activeAssessment!,
      waitingTimeMin: 2,
      admittedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "In Queue",
    };

    const finalizedPatient: Patient = {
      ...current,
      review,
      status: "In Queue",
    };

    // Prepend to patients list
    const updated = [finalizedPatient, ...patients.filter((p) => p.id !== finalizedPatient.id)];
    saveToStorage(updated);
    setActivePatient(finalizedPatient);
    return finalizedPatient;
  };

  const getPatientById = (id: string): Patient | undefined => {
    return patients.find((p) => p.id === id) || (activePatient?.id === id ? activePatient : undefined);
  };

  const resetActiveSession = () => {
    setActiveDraft(null);
    setActiveAssessment(null);
    setActivePatient(null);
  };

  const loadPresetCase = (preset: "critical" | "urgent" | "non-urgent"): AssessmentDraft => {
    const randomId = `PT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    if (preset === "critical") {
      return {
        fullName: "Ahmed Khan",
        age: 56,
        gender: "Male",
        patientId: randomId,
        medicalHistory: "Type II Diabetes (8 yrs), Hypertension, Ex-smoker",
        symptomsDescription: "Severe crushing retrosternal chest pain radiating to left shoulder and jaw for 45 minutes with acute shortness of breath and cold diaphoresis.",
        duration: "Less than 1 hour",
        vitals: {
          heartRate: 125,
          bloodPressureSystolic: 160,
          bloodPressureDiastolic: 100,
          temperature: 38.9,
          oxygenSaturation: 88,
          respiratoryRate: 24,
        },
      };
    } else if (preset === "urgent") {
      return {
        fullName: "Sara Ali",
        age: 34,
        gender: "Female",
        patientId: randomId,
        medicalHistory: "No chronic conditions. NKDA.",
        symptomsDescription: "Persistent intractable vomiting for 14 hours with high grade fever and rigors. Unable to retain oral fluids with lower quadrant abdominal cramping.",
        duration: "Few hours",
        vitals: {
          heartRate: 108,
          bloodPressureSystolic: 105,
          bloodPressureDiastolic: 68,
          temperature: 39.2,
          oxygenSaturation: 97,
          respiratoryRate: 19,
        },
      };
    } else {
      return {
        fullName: "Bilal Ahmed",
        age: 22,
        gender: "Male",
        patientId: randomId,
        medicalHistory: "Mild seasonal allergies.",
        symptomsDescription: "Mild frontal dull headache and general fatigue following prolonged computer exam preparation. No photophobia or neck rigidity.",
        duration: "1 day",
        vitals: {
          heartRate: 72,
          bloodPressureSystolic: 118,
          bloodPressureDiastolic: 76,
          temperature: 36.8,
          oxygenSaturation: 99,
          respiratoryRate: 14,
        },
      };
    }
  };

  // Compute stats dynamically with fallback to exact prompt numbers if starting
  const criticalCount = Math.max(
    4,
    patients.filter((p) => (p.review?.finalPriority || p.assessment.priority) === "CRITICAL").length
  );
  const urgentCount = Math.max(
    12,
    patients.filter((p) => (p.review?.finalPriority || p.assessment.priority) === "URGENT").length + 7
  );
  const nonUrgentCount = Math.max(
    18,
    patients.filter((p) => (p.review?.finalPriority || p.assessment.priority) === "NON-URGENT").length + 12
  );

  return (
    <PatientContext.Provider
      value={{
        patients,
        activeDraft,
        activeAssessment,
        activePatient,
        agents,
        stats: {
          criticalCount,
          urgentCount,
          nonUrgentCount,
          averageTriageTime: "03:42",
          analyzedToday: 34 + (patients.length - initialPatients.length),
          averageConfidence: 91,
          averageAnalysisTime: "4.2 seconds",
        },
        setAssessmentDraft,
        executeAssessment,
        saveClinicalDecision,
        getPatientById,
        resetActiveSession,
        loadPresetCase,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
}

export function usePatientContext() {
  const ctx = useContext(PatientContext);
  if (!ctx) {
    throw new Error("usePatientContext must be used within a PatientProvider");
  }
  return ctx;
}
