import React from "react";
import { AgentInfo } from "@/types/triage";
import { cn } from "@/lib/utils";
import { Bot, CheckCircle2, Cpu, FileText, GitPullRequest, Search, ShieldCheck } from "lucide-react";

interface AgentStatusCardProps {
  agent: AgentInfo;
  compact?: boolean;
}

export function AgentStatusCard({ agent, compact = false }: AgentStatusCardProps) {
  const getIcon = (name: string) => {
    switch (name) {
      case "Intake Agent":
        return GitPullRequest;
      case "NLP Agent":
        return Search;
      case "Triage Agent":
        return Cpu;
      case "Verification Agent":
        return ShieldCheck;
      case "Report Agent":
        return FileText;
      default:
        return Bot;
    }
  };

  const Icon = getIcon(agent.name);

  if (compact) {
    return (
      <div className="flex items-center justify-between py-2.5 px-3 rounded-lg border border-clinical-border bg-white hover:border-emerald-200 transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-light/60 text-emerald-dark">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-clinical-text">{agent.name}</p>
            <p className="text-[10px] text-clinical-secondary">{agent.latencyMs}ms avg latency</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-primary bg-emerald-light/40 px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-primary animate-subtle-pulse" />
          <span>Operational</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-clinical-border bg-white p-4 shadow-clinical hover:shadow-card hover:border-emerald-200 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-light text-emerald-dark">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-clinical-text font-heading">{agent.name}</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-primary animate-subtle-pulse" />
              <span className="text-xs font-semibold text-emerald-primary">{agent.status}</span>
            </div>
          </div>
        </div>
        <span className="text-[11px] font-mono text-clinical-secondary bg-ivory-100 border border-clinical-border px-2 py-0.5 rounded">
          {agent.latencyMs}ms
        </span>
      </div>

      <p className="mt-3 text-xs text-clinical-secondary leading-relaxed line-clamp-2">
        {agent.role}
      </p>

      <div className="mt-3 pt-3 border-t border-clinical-border/60 flex items-center justify-between text-[11px] text-clinical-secondary">
        <span>Verified Accuracy: <strong className="text-clinical-text">{agent.accuracyRate}%</strong></span>
        <span>Processed: <strong className="text-clinical-text">{agent.tasksCompleted}</strong> cases</span>
      </div>
    </div>
  );
}
