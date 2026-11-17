import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  href,
  accent = false,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  href?: string;
  accent?: boolean;
}) {
  const content = (
    <>
      <div className="flex items-start justify-between">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-navy-400">{label}</p>
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-md ${
            accent ? "bg-gold-100 text-gold-800" : "bg-navy-50 text-navy-600"
          }`}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-4 font-display text-[2rem] font-medium leading-none text-navy-950">{value}</p>
      <div className="mt-2 flex items-center justify-between gap-2">
        {hint ? <p className="text-[0.68rem] text-navy-400">{hint}</p> : <span />}
        {href && <ArrowUpRight className="h-3.5 w-3.5 text-navy-300" />}
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="rounded-xl border border-navy-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-navy-200 hover:shadow-md"
      >
        {content}
      </Link>
    );
  }
  return <div className="rounded-xl border border-navy-100 bg-white p-5 shadow-sm">{content}</div>;
}
