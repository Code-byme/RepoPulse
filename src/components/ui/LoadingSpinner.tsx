type LoadingSpinnerProps = {
  className?: string;
};

export function LoadingSpinner({ className = "h-5 w-5" }: LoadingSpinnerProps) {
  return (
    <div
      className={`rp-spinner ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}