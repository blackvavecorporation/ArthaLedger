import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-navy-200 bg-white px-6 py-14 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-navy-50 text-navy-300">
        <Inbox className="h-5 w-5" />
      </span>
      <h3 className="mt-4 font-display text-xl font-semibold text-navy-900">{title}</h3>
      <p className="mx-auto mt-1.5 max-w-md text-[0.8rem] leading-6 text-navy-400">{description}</p>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
