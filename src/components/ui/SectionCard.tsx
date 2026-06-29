import type { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <section className="rp-panel">
      <div>
        <h2 className="rp-section-title">{title}</h2>
        {description ? <p className="rp-section-desc">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
