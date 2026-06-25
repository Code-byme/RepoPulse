import Link from "next/link";
import { notFound } from "next/navigation";

import { ReportDashboard } from "@/components/report/ReportDashboard";
import { RepositoryHeader } from "@/components/repository/RepositorySummary";
import { DashboardContainer } from "@/components/ui/DashboardContainer";
import { loadRepositoryDetail, loadRepositoryReport } from "@/lib/api/server";
import { parseUuidParam } from "@/lib/validators/params";

type RepositoryReportPageProps = {
  params: Promise<{ repositoryId: string }>;
};

export default async function RepositoryReportPage({
  params,
}: RepositoryReportPageProps) {
  const { repositoryId } = await params;

  try {
    parseUuidParam(repositoryId);
  } catch {
    notFound();
  }

  const [detail, reportData] = await Promise.all([
    loadRepositoryDetail(repositoryId),
    loadRepositoryReport(repositoryId),
  ]);

  if (!detail || !reportData) {
    notFound();
  }

  return (
    <DashboardContainer>
      <div className="space-y-8">
        <div className="space-y-4">
          <RepositoryHeader
            repository={detail.repository}
            latestStatus={detail.latestStatus}
            backHref={`/repositories/${repositoryId}`}
          />
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Link
              href={`/repositories/${repositoryId}`}
              className="font-medium text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-300"
            >
              Repository summary
            </Link>
            <span className="text-zinc-400">/</span>
            <span className="text-zinc-500 dark:text-zinc-400">Full report</span>
          </div>
        </div>

        <ReportDashboard data={reportData} />
      </div>
    </DashboardContainer>
  );
}
