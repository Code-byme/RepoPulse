import Link from "next/link";
import { notFound } from "next/navigation";

import { AppHeader } from "@/components/layout/AppHeader";
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
    <>
      <AppHeader active="repositories" />
      <DashboardContainer>
        <div className="space-y-8">
          <div className="space-y-4">
            <RepositoryHeader
              repository={detail.repository}
              latestStatus={detail.latestStatus}
              backHref={`/repositories/${repositoryId}`}
            />
            <nav className="rp-breadcrumb" aria-label="Breadcrumb">
              <Link
                href={`/repositories/${repositoryId}`}
                className="font-mono text-text-secondary transition-colors hover:text-text-primary"
              >
                Repository summary
              </Link>
              <span className="rp-breadcrumb-sep">/</span>
              <span className="rp-breadcrumb-current">Full report</span>
            </nav>
          </div>

          <ReportDashboard data={reportData} />
        </div>
      </DashboardContainer>
    </>
  );
}
