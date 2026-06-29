import { DashboardContainer } from "@/components/ui/DashboardContainer";
import { TerminalLoader } from "@/components/ui/TerminalLoader";

export default function RepositoryReportLoadingPage() {
  return (
    <DashboardContainer>
      <div className="flex flex-col items-center gap-4 py-16">
        <TerminalLoader
          command="repopulse fetch --report"
          steps={["Loading analysis report…", "Parsing structural metrics…", "Rendering signals…"]}
        />
      </div>
    </DashboardContainer>
  );
}