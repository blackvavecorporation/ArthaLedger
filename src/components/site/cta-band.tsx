import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaBand({
  eyebrow,
  title,
  description,
  buttonLabel,
  buttonHref,
  phone,
}: {
  eyebrow?: string | null;
  title: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
  phone?: string;
}) {
  return (
    <section className="container pb-20 md:pb-28">
      <div className="relative overflow-hidden rounded-2xl bg-navy-950 px-6 py-14 text-white md:px-14 md:py-16">
        <div
          className="pointer-events-none absolute inset-0 bg-grid-navy bg-[size:48px_48px] opacity-60"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-500/15 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            {eyebrow && <p className="eyebrow eyebrow-light">{eyebrow}</p>}
            <h2 className="mt-4 text-[2rem] font-medium leading-[1.15] tracking-tight md:text-[2.7rem]">
              {title}
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/60">{description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {phone && (
              <Button asChild variant="outline" className="border-white/20 bg-transparent text-white hover:border-white/40 hover:bg-white/10">
                <a href={`tel:${phone.replace(/\s/g, "")}`}>
                  <Phone className="h-4 w-4" />
                  Call the office
                </a>
              </Button>
            )}
            <Button asChild variant="gold" size="lg">
              <Link href={buttonHref}>
                {buttonLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
