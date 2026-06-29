import type { AnalysisReport } from "@/types/github-analysis";
import {
  hasBackendSignals,
  hasFrontendSignals,
} from "@/server/analysis/signals";
import { formatArchitectureStyle } from "@/lib/utils/format";
import { SectionCard } from "@/components/ui/SectionCard";
import { StatCard } from "@/components/ui/StatCard";

type ReportSummarySectionProps = {
  report: AnalysisReport;
};

function hasDocker(report: AnalysisReport): boolean {
  const { configs } = report.structure_json;
  return configs.dockerfile || configs.dockerCompose;
}

export function ReportSummarySection({ report }: ReportSummarySectionProps) {
  const { summary_json, structure_json, todos_json } = report;

  return (
    <SectionCard
      title="Summary"
      description={summary_json.description}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Repository"
          value={summary_json.repository.fullName}
        />
        <StatCard
          label="Primary language"
          value={summary_json.repository.primaryLanguage ?? "Unknown"}
        />
        <StatCard
          label="Architecture style"
          value={formatArchitectureStyle(summary_json.architectureStyle)}
        />
        <StatCard label="TODO count" value={todos_json.total} />
        <StatCard
          label="Has frontend"
          value={hasFrontendSignals(report.structure_json.folders) ? "Yes" : "No"}
        />
        <StatCard
          label="Has backend"
          value={hasBackendSignals(report.structure_json.folders) ? "Yes" : "No"}
        />
        <StatCard label="Has Docker" value={hasDocker(report) ? "Yes" : "No"} />
        <StatCard
          label="Has CI"
          value={structure_json.folders.githubWorkflows ? "Yes" : "No"}
        />
        <StatCard
          label="Has tests"
          value={structure_json.folders.tests ? "Yes" : "No"}
        />
      </div>
      {summary_json.highlights.length > 0 ? (
        <ul className="mt-5 list-disc space-y-1 pl-5 text-sm text-text-secondary">
          {summary_json.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      ) : null}
    </SectionCard>
  );
}
