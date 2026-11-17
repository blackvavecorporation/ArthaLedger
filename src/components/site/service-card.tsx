import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ContentIcon } from "@/components/icon";
import { cn } from "@/lib/utils";

export function ServiceCard({
  service,
  className,
}: {
  service: {
    title: string;
    slug: string;
    shortDescription: string;
    icon: string;
    category: { name: string } | null;
  };
  className?: string;
}) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className={cn(
        "group flex h-full flex-col rounded-xl border border-navy-100 bg-white p-6 shadow-[0_1px_2px_rgba(11,27,51,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-navy-200 hover:shadow-lift",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 items-center justify-center border border-navy-100 bg-ivory text-gold-700 transition-colors group-hover:border-gold-300 group-hover:bg-gold-50">
          <ContentIcon name={service.icon} />
        </span>
        {service.category && (
          <span className="pt-1 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-navy-300">
            {service.category.name}
          </span>
        )}
      </div>
      <h2 className="mt-6 font-display text-[1.5rem] font-medium leading-tight text-navy-950">
        {service.title}
      </h2>
      <p className="mt-2.5 flex-1 text-[0.82rem] leading-6 text-navy-500">
        {service.shortDescription}
      </p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-gold-700">
        Learn more
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  );
}
