import type { RepositoryReportResponse } from "@/types/api";
import { ReportHistorySection } from "@/components/report/ReportHistorySection";
import { ReportLanguagesSection } from "@/components/report/ReportLanguagesSection";
import { ReportMetricsSection } from "@/components/report/ReportMetricsSection";
import { ReportStructureSection } from "@/components/report/ReportStructureSection";
import { ReportSummarySection } from "@/components/report/ReportSummarySection";
import { ReportTodosSection } from "@/components/report/ReportTodosSection";
import { EmptyState } from "@/components/ui/EmptyState";

type ReportDashboardProps = {
  data: RepositoryReportResponse;
};

export function ReportDashboard({ data }: ReportDashboardProps) {
  if (data.status !== "complete" || !data.report) {
    return (
      <EmptyState
        title="Report not available"
        description={data.message ?? "No completed analysis report exists for this repository yet."}
      />
    );
  }

  const { report } = data.report;

  return (
    <div className="space-y-6">
      <ReportSummarySection report={report} />
      <ReportMetricsSection metrics={report.metrics_json} />
      <ReportLanguagesSection languages={report.languages_json} />
      <ReportStructureSection structure={report.structure_json} />
      <ReportTodosSection todos={report.todos_json} />
      <ReportHistorySection jobHistory={data.jobHistory} />
    </div>
  );
}
