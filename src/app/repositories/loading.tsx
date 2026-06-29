import { DashboardContainer } from "@/components/ui/DashboardContainer";
import { TerminalLoader } from "@/components/ui/TerminalLoader";

export default function RepositoriesLoadingPage() {
  return (
    <DashboardContainer>
      <div className="flex flex-col items-center gap-4 py-16">
        <TerminalLoader
          command="repopulse history --list"
          steps={["Fetching analysis history…", "Reading job statuses…", "Building summary…"]}
        />
      </div>
    </DashboardContainer>
  );
}