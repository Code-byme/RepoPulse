import type { ReactNode } from "react";

type DashboardContainerProps = {
  children: ReactNode;
};

export function DashboardContainer({ children }: DashboardContainerProps) {
  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
      {children}
    </div>
  );
}
