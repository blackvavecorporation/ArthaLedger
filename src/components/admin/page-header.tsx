import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
      <div>
        {eyebrow && (
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold-700">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-1.5 font-display text-[2.1rem] font-medium leading-tight tracking-tight text-navy-950">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-[0.83rem] leading-6 text-navy-500">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
