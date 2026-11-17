import { AlertCircle, CheckCircle2, Info } from "lucide-react";

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
      className="mb-6 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
    >
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
      <div>
        <p>{deleted ? "The demo item was removed from this session." : "The demo form accepted this change."}</p>
        <p className="mt-1 flex items-start gap-1.5 text-[0.72rem] leading-5 text-amber-800">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Demo only — nothing was written to a database. The change disappears on reload or restart.
        </p>
      </div>
    </div>
  );
}
