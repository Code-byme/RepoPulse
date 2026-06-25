import type { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
  className?: string;
};

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div
      className={`flex flex-1 flex-col items-center justify-center px-4 py-16 sm:px-6 ${className}`}
    >
      <div className="w-full max-w-lg">{children}</div>
    </div>
  );
}
