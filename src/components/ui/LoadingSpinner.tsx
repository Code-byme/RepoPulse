type LoadingSpinnerProps = {
  className?: string;
};

export function LoadingSpinner({ className = "h-5 w-5" }: LoadingSpinnerProps) {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100 ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
