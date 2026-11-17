import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Clock3, Phone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentIcon } from "@/components/icon";
import { CtaBand } from "@/components/site/cta-band";
import { JsonLd } from "@/components/site/json-ld";
import { PageHero } from "@/components/site/page-hero";
import { ServiceCard } from "@/components/site/service-card";
import { SimpleMarkdown } from "@/components/simple-markdown";
import { SmartImage } from "@/components/site/smart-image";
import { Badge } from "@/components/ui/badge";
import {
  getServiceBySlug,
  getServices,
  getSettings,
} from "@/lib/content";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";
import { whatsAppLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug).catch(() => null);
  if (!service) {
    const preview = (await searchParams).preview === "1";
    const user = preview ? await getCurrentUser().catch(() => null) : null;
    if (preview && user && can(user.role, "content.read")) {
      return { title: "Service preview", robots: { index: false, follow: false } };
    }
    return { title: "Service not found" };
  }
  return pageMetadata({
    title: service.seoTitle || service.title,
    description: service.seoDescription || service.shortDescription,
    path: `/services/${service.slug}`,
    image: service.imageUrl,
    type: "article",
  });
}

export default async function ServiceDetailPage({ params, searchParams }: Props) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  let service = await getServiceBySlug(slug);
  const previewRequested = query.preview === "1";
  if (!service && previewRequested) {
    const user = await getCurrentUser();
    if (user && can(user.role, "content.read")) {
      service = await db.service.findFirst({ where: { slug }, include: { category: true } });
    }
  }
  if (!service) notFound();
  const isPreview = service.status !== "PUBLISHED";

  const [services, settings] = await Promise.all([getServices(), getSettings()]);

  const related = services
    .filter((item) => item.id !== service.id && item.categoryId === service.categoryId)
    .slice(0, 3);
  const waLink = whatsAppLink(
    settings.whatsappNumber,
    `Hello ${settings.brandName}, I would like to enquire about ${service.title}.`,
  );

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.title,
          description: service.shortDescription,
          url: absoluteUrl(`/services/${service.slug}`),
          areaServed: { "@type": "Country", name: "India" },
          provider: {
            "@type": "AccountingService",
            name: settings.brandName,
            url: absoluteUrl("/"),
            telephone: settings.primaryPhone,
            email: settings.businessEmail,
          },
        }}
      />

      <PageHero
        eyebrow={service.category?.name ?? "Professional service"}
        title={service.title}
        description={service.shortDescription}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.title },
        ]}
      />

      {isPreview && (
        <div className="border-b border-amber-200 bg-amber-50">
          <div className="container flex flex-wrap items-center gap-3 py-3">
            <Badge variant="warning">Admin preview</Badge>
            <p className="text-[0.72rem] text-amber-900">
              This service is currently a draft and is not visible to the public.
            </p>
            <Link href={`/admin/services/${service.id}`} className="ml-auto text-[0.7rem] font-semibold text-amber-900 underline">
              Edit service
            </Link>
          </div>
        </div>
      )}

      <section className="section bg-ivory">
        <div className="container grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:gap-14">
          <div className="min-w-0">
            {service.imageUrl && (
              <div className="mb-8 overflow-hidden rounded-xl border border-navy-100 bg-white">
                <SmartImage
                  src={service.imageUrl}
                  alt={service.title}
                  width={1200}
                  height={675}
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  className="max-h-[26rem] w-full object-cover"
                  priority
                />
              </div>
            )}
            <div className="rounded-xl border border-navy-100 bg-white p-6 md:p-9">
              <div className="mb-6 flex items-center gap-3 border-b border-navy-100 pb-6">
                <span className="flex h-11 w-11 items-center justify-center border border-gold-200 bg-gold-50 text-gold-700">
                  <ContentIcon name={service.icon} />
                </span>
                <div>
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-navy-400">
                    {service.category?.name ?? "ArthaLedger service"}
                  </p>
                  <p className="font-display text-xl font-semibold text-navy-950">{service.title}</p>
                </div>
              </div>
              <SimpleMarkdown content={service.description} />

              {service.benefits.length > 0 && (
                <div className="mt-9 rounded-lg border border-navy-100 bg-ivory/70 p-6">
                  <h2 className="font-display text-2xl font-semibold text-navy-950">
                    What the engagement includes
                  </h2>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {service.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2.5 text-[0.82rem] leading-6 text-navy-600">
                        <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-gold-600" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-[0.65rem] leading-5 text-navy-400">
                    Final deliverables and responsibilities are confirmed in the engagement letter.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-lg border border-navy-100 bg-white p-5">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
              <p className="text-[0.7rem] leading-6 text-navy-500">
                This page provides general information about the service, not professional advice on
                your facts. Statutory requirements and timelines can change and are controlled by the
                relevant authorities. Regulated or restricted services are undertaken only where the
                firm holds the necessary professional eligibility.
              </p>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-xl border border-navy-100 bg-white shadow-soft">
              <div className="relative overflow-hidden bg-navy-950 p-6 text-white">
                <div
                  className="pointer-events-none absolute inset-0 bg-grid-navy bg-[size:36px_36px] opacity-40"
                  aria-hidden="true"
                />
                <div className="relative">
                  <p className="eyebrow eyebrow-light">Next step</p>
                  <h2 className="mt-3 font-display text-2xl font-medium leading-snug">
                    Discuss {service.title.toLowerCase()} with our team.
                  </h2>
                  <p className="mt-2 text-[0.75rem] leading-6 text-white/50">
                    Tell us what you need. We will confirm scope, approach and fees before any work
                    begins.
                  </p>
                </div>
              </div>
              <div className="space-y-3 p-5">
                <Button asChild className="w-full" variant="gold">
                  <Link href={`/contact?service=${encodeURIComponent(service.slug)}`}>
                    {service.ctaLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild className="w-full" variant="outline">
                  <a href={waLink} target="_blank" rel="noreferrer">
                    Enquire on WhatsApp
                  </a>
                </Button>
                <div className="space-y-2 border-t border-navy-100 pt-4 text-[0.72rem] text-navy-500">
                  <a
                    href={`tel:${settings.primaryPhone.replace(/\s/g, "")}`}
                    className="flex items-center gap-2.5 hover:text-navy-900"
                  >
                    <Phone className="h-3.5 w-3.5 text-gold-600" />
                    {settings.primaryPhone}
                  </a>
                  <p className="flex items-start gap-2.5">
                    <Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600" />
                    {settings.workingHours}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-navy-100 bg-white p-5">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-navy-400">
                All services
              </p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                {services.slice(0, 8).map((item) => (
                  <Link
                    key={item.id}
                    href={`/services/${item.slug}`}
                    className="text-[0.72rem] text-navy-500 hover:text-gold-700"
                  >
                    {item.title}
                  </Link>
                ))}
                <Link href="/services" className="text-[0.72rem] font-semibold text-gold-700">
                  View all →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section bg-white pt-0">
          <div className="container pt-16">
            <div className="flex items-end justify-between gap-6 border-b border-navy-100 pb-5">
              <div>
                <p className="eyebrow">Related services</p>
                <h2 className="mt-3 font-display text-3xl font-medium text-navy-950">
                  Often considered together
                </h2>
              </div>
              <Link href="/services" className="hidden shrink-0 text-[0.75rem] font-semibold text-gold-700 sm:block">
                All services →
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ServiceCard key={item.id} service={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand
        eyebrow="Start a conversation"
        title="Clarity on scope, before you commit."
        description="A short initial conversation helps us understand the requirement and set out a clear, written next step."
        buttonLabel="Book a consultation"
        buttonHref="/contact"
        phone={settings.primaryPhone}
      />
    </>
  );
}
