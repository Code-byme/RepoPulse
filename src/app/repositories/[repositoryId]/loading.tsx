import { DashboardContainer } from "@/components/ui/DashboardContainer";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function RepositoryLoadingPage() {
  return (
    <DashboardContainer>
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <LoadingSpinner className="h-8 w-8" />
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Loading repository…
        </p>
      </div>
    </DashboardContainer>
  );
}
