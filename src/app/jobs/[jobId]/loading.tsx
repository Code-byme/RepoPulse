import { PageContainer } from "@/components/ui/PageContainer";
import { TerminalLoader } from "@/components/ui/TerminalLoader";

export default function JobLoadingPage() {
  return (
    <PageContainer>
      <div className="flex flex-col items-center gap-4 py-16">
        <TerminalLoader
          command="repopulse jobs --inspect"
          steps={["Loading job details…", "Checking job status…", "Fetching logs…"]}
        />
      </div>
    </PageContainer>
  );
}