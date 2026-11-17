import { AlertCircle, CheckCircle2 } from "lucide-react";

export type AdminSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function FeedbackBanner({ params }: { params: AdminSearchParams }) {
  const error = first(params.error);
  const saved = first(params.saved);
  const deleted = first(params.deleted);

  if (!error && !saved && !deleted) return null;

  if (error) {
    return (
      <div
        role="alert"
        className="mb-6 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div
      role="status"
      className="mb-6 flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
    >
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{deleted ? "The item has been deleted." : "Your changes have been saved."}</span>
    </div>
  );
}
