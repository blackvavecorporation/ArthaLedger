import type { Metadata } from "next";
import { ArrowRight, Compass } from "lucide-react";
import Link from "next/link";
import { CtaBand } from "@/components/site/cta-band";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { ServiceCard } from "@/components/site/service-card";
import { getServiceCategories, getServices, getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Services",
    description:
      "Explore ArthaLedger's professional services: income tax, GST, accounting, company registration, ROC compliance, audit support, payroll, TDS and business advisory.",
    path: "/services",
  });
}

export default async function ServicesPage() {
  const [services, categories, settings] = await Promise.all([
    getServices(),
    getServiceCategories(),
    getSettings(),
  ]);

  const groups = [
    ...categories
      .map((category) => ({
        id: category.id,
        name: category.name,
        description: category.description,
        services: services.filter((service) => service.categoryId === category.id),
      }))
      .filter((group) => group.services.length > 0),
    {
      id: "uncategorised",
      name: "Additional services",
      description: null,
      services: services.filter((service) => !service.categoryId),
    },
  ].filter((group) => group.services.length > 0);

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Professional support across tax, compliance and finance."
        description="Every engagement begins with a clear conversation about scope. Explore the practice areas below, or contact us and we will help identify what your business needs."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Services" }]}
      >
        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`#${category.slug}`}
              className="rounded-full border border-white/15 px-3.5 py-1.5 text-[0.7rem] font-medium text-white/60 transition-colors hover:border-gold-400/50 hover:text-gold-300"
            >
              {category.name}
            </a>
          ))}
        </div>
      </PageHero>

      <section className="section bg-ivory">
        <div className="container space-y-20">
          {groups.map((group, index) => {
            const categorySlug = categories.find((category) => category.id === group.id)?.slug;
            return (
              <div key={group.id} id={categorySlug ?? group.id}>
                <div className="flex flex-col justify-between gap-5 border-b border-navy-100 pb-6 sm:flex-row sm:items-end">
                  <SectionHeading
                    eyebrow={String(index + 1).padStart(2, "0")}
                    title={group.name}
                    description={group.description}
                  />
                  <span className="shrink-0 text-[0.68rem] font-medium uppercase tracking-[0.12em] text-navy-300">
                    {group.services.length} service{group.services.length === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {group.services.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container">
          <div className="flex flex-col items-start justify-between gap-6 rounded-xl border border-gold-200 bg-gold-50/50 p-7 md:flex-row md:items-center">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-gold-300 bg-white text-gold-700">
                <Compass className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-2xl font-semibold text-navy-950">
                  Not sure which service you need?
                </h2>
                <p className="mt-1.5 max-w-xl text-[0.82rem] leading-6 text-navy-500">
                  Describe your situation and we will point you to the relevant service — or tell you
                  honestly if it is outside our professional scope.
                </p>
              </div>
            </div>
            <Link
              href="/contact"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-navy-900 px-5 py-4 text-[0.78rem] font-semibold text-white transition-colors hover:bg-navy-800"
            >
              Talk to our team
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <p className="mt-5 max-w-3xl text-[0.65rem] leading-5 text-navy-400">
            Fees, timelines and deliverables are confirmed in a written engagement letter. Statutory
            approvals are controlled by the relevant authorities. Regulated services are provided only
            where the firm holds the applicable qualifications and authorisations.
          </p>
        </div>
      </section>

      <CtaBand
        eyebrow="Start with clarity"
        title="Let us scope the right support for your business."
        description="Share a few details and our team will respond with a considered next step."
        buttonLabel="Book a consultation"
        buttonHref="/contact"
        phone={settings.primaryPhone}
      />
    </>
  );
}
