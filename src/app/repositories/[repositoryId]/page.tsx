import Link from "next/link";
import { notFound } from "next/navigation";

import { AppHeader } from "@/components/layout/AppHeader";
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

  const hasReport =
    reportData.status === "complete" && reportData.report !== null;

  return (
    <>
      <AppHeader active="repositories" />
      <DashboardContainer>
        <div className="space-y-8">
          <RepositoryHeader
            repository={detail.repository}
            latestStatus={detail.latestStatus}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-text-primary">
                Latest analysis snapshot
              </h2>
              {hasReport ? (
                <Link
                  href={`/repositories/${repositoryId}/report`}
                  className="rp-btn-primary h-11 w-auto px-4"
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
    </>
  );
}
