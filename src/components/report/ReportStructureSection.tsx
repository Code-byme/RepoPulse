import type { StructureDetection } from "@/types/github-analysis";
import { formatArchitectureStyle } from "@/lib/utils/format";
import { SectionCard } from "@/components/ui/SectionCard";

type ReportStructureSectionProps = {
  structure: StructureDetection;
};

function DetectionList({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; detected: boolean }>;
}) {
  return (
    <div>
      <h3 className="rp-subheading">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.label} className="rp-detection-row">
            <span className="rp-detection-label">{item.label}</span>
            <span
              className={
                item.detected ? "rp-detection-value--yes" : "rp-detection-value--no"
              }
            >
              {item.detected ? "Detected" : "Not found"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ReportStructureSection({ structure }: ReportStructureSectionProps) {
  const folderItems = [
    { label: "src/", detected: structure.folders.src },
    { label: "app/", detected: structure.folders.app },
    { label: "pages/", detected: structure.folders.pages },
    { label: "api/", detected: structure.folders.api },
    { label: "components/", detected: structure.folders.components },
    { label: "services/", detected: structure.folders.services },
    { label: "lib/", detected: structure.folders.lib },
    { label: "db/", detected: structure.folders.db },
    { label: "tests/", detected: structure.folders.tests },
    { label: ".github/workflows/", detected: structure.folders.githubWorkflows },
  ];

  const configItems = [
    { label: "Dockerfile", detected: structure.configs.dockerfile },
    { label: "docker-compose", detected: structure.configs.dockerCompose },
    { label: "package.json", detected: structure.configs.packageJson },
    { label: "tsconfig.json", detected: structure.configs.tsconfig },
    { label: "ESLint config", detected: structure.configs.eslint },
    { label: "Prettier config", detected: structure.configs.prettier },
  ];

  return (
    <SectionCard
      title="Structure detection"
      description={`Inferred architecture: ${formatArchitectureStyle(structure.architectureStyle)}`}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <DetectionList title="Detected folders" items={folderItems} />
        <DetectionList title="Detected config files" items={configItems} />
      </div>
    </SectionCard>
  );
}
