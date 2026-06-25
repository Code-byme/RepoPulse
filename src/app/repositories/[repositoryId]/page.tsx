import Link from "next/link";
import { notFound } from "next/navigation";

import {
  RepositoryHeader,
  RepositoryMetaFooter,
  RepositoryQuickSummary,
} from "@/components/repository/RepositorySummary";
import { DashboardContainer } from "@/components/ui/DashboardContainer";
import { loadRepositoryDetail, loadRepositoryReport } from "@/lib/api/server";
import { parseUuidParam } from "@/lib/validators/params";

type RepositoryPageProps = {
  params: Promise<{ repositoryId: string }>;
};

export default async function RepositoryPage({ params }: RepositoryPageProps) {
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

  const hasReport = reportData.status === "complete" && reportData.report !== null;

  return (
    <DashboardContainer>
      <div className="space-y-8">
        <RepositoryHeader
          repository={detail.repository}
          latestStatus={detail.latestStatus}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Latest analysis snapshot
            </h2>
            {hasReport ? (
              <Link
                href={`/repositories/${repositoryId}/report`}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                View full report
              </Link>
            ) : null}
          </div>
          <RepositoryQuickSummary reportData={reportData} />
        </div>

        <RepositoryMetaFooter repository={detail.repository} />
      </div>
    </DashboardContainer>
  );
}
