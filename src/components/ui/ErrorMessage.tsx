type ErrorMessageProps = {
  message: string;
};

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div role="alert" className="rp-alert-error">
      {message}
    </div>
  );
}
