import { AppHeader } from "@/components/layout/AppHeader";
import { RepositoryList } from "@/components/repository/RepositoryList";
import { DashboardContainer } from "@/components/ui/DashboardContainer";
import { loadRepositoryList } from "@/lib/api/server";

export const dynamic = "force-dynamic";

export default async function RepositoriesPage() {
  const repositories = await loadRepositoryList();

  return (
    <>
      <AppHeader active="repositories" />
      <DashboardContainer>
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
              Analysis history
            </h1>
            <p className="max-w-2xl text-[13px] leading-6 text-text-secondary">
              All repositories you have submitted to RepoPulse, with the latest job
              status and quick links to summaries and reports.
            </p>
          </div>

          <RepositoryList repositories={repositories} />
        </div>
      </DashboardContainer>
    </>
  );
}
