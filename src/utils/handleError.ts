import { showNotification } from "./showNotification";

type HandleErrorProps = {
  error: any;
  fallback?: string;
  title?: string;
  maxDetailsChars?: number;
  description?: string;
};

export function getFieldErrorsDescription(e: any) {
  const errors = e?.response?.data?.fieldErrors;
  return errors ? Object.values(errors).flat().join("\n") : "";
}

export function handleError({
  error,
  fallback = "",
  title,
  maxDetailsChars = 200,
  description = "",
}: HandleErrorProps) {
  const details = error?.response?.data?.details || error.message || fallback;
  const message = details.length >= maxDetailsChars ? fallback : details;

  showNotification({
    type: "warn",
    message: title || message,
    description,
  });
}
