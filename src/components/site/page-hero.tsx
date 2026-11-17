import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumb,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string | null;
  breadcrumb?: { label: string; href?: string }[];
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-navy-950 text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-grid-navy bg-[size:52px_52px] opacity-50"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 -top-40 h-[26rem] w-[26rem] rounded-full bg-gold-500/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="container relative py-16 md:py-24">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-7">
            <ol className="flex flex-wrap items-center gap-1.5 text-[0.72rem] text-white/40">
              {breadcrumb.map((item, index) => (
                <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
                  {item.href ? (
                    <Link href={item.href} className="transition-colors hover:text-gold-300">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-white/70">{item.label}</span>
                  )}
                  {index < breadcrumb.length - 1 && <ChevronRight className="h-3 w-3" />}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="max-w-3xl">
          <p className="eyebrow eyebrow-light">{eyebrow}</p>
          <h1 className="mt-5 text-[2.4rem] font-medium leading-[1.08] tracking-tight md:text-[3.4rem]">
            {title}
          </h1>
          {description && (
            <p className="mt-6 max-w-2xl text-[0.98rem] leading-8 text-white/60">{description}</p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
