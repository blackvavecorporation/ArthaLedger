import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarCheck,
  Check,
  FileCheck2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/site/cta-band";
import { ContentIcon } from "@/components/icon";
import { JsonLd } from "@/components/site/json-ld";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { Stars } from "@/components/site/stars";
import {
  getExpertiseItems,
  getHomeContent,
  getPublishedFAQs,
  getPublishedTestimonials,
  getServices,
  getSettings,
  getStats,
  getWhyChooseItems,
} from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [home, services, whyItems, expertise, stats, faqs, testimonials, settings] =
    await Promise.all([
      getHomeContent(),
      getServices(),
      getWhyChooseItems(),
      getExpertiseItems(),
      getStats(),
      getPublishedFAQs(),
      getPublishedTestimonials(),
      getSettings(),
    ]);

  const featured = services.filter((service) => service.isFeatured);
  const displayedServices = (featured.length >= 3 ? featured : services).slice(0, 6);
  const previewFaqs = faqs.slice(0, 6);

  return (
    <>
      {previewFaqs.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: previewFaqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          }}
        />
      )}

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div
          className="pointer-events-none absolute inset-0 bg-grid-navy bg-[size:54px_54px] opacity-60"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-40 top-10 h-[30rem] w-[30rem] rounded-full bg-gold-500/[0.07] blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-24 top-1/3 h-[26rem] w-[26rem] rounded-full bg-navy-400/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="container relative grid items-center gap-16 pb-24 pt-16 md:pb-28 md:pt-20 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12 lg:pb-32 lg:pt-24">
          <Reveal>
            <p className="eyebrow eyebrow-light">{home.heroEyebrow}</p>
            <h1 className="mt-6 max-w-[16ch] font-display text-[2.9rem] font-medium leading-[1.03] tracking-[-0.01em] sm:text-[3.4rem] lg:text-[4.15rem]">
              {home.heroTitle}{" "}
              <em className="font-normal italic text-gold-300">{home.heroTitleAccent}</em>
            </h1>
            <p className="mt-7 max-w-xl text-[0.98rem] leading-8 text-white/60">
              {home.heroDescription}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button asChild variant="gold" size="lg">
                <Link href={home.primaryCtaHref}>
                  {home.primaryCtaLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/20 bg-white/[0.03] text-white hover:border-white/40 hover:bg-white/10"
              >
                <Link href={home.secondaryCtaHref}>{home.secondaryCtaLabel}</Link>
              </Button>
            </div>
            <p className="mt-8 flex max-w-lg items-start gap-2.5 text-[0.72rem] leading-5 text-white/40">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-500/80" />
              {home.heroTrustLine}
            </p>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2.5 border-t border-white/10 pt-6">
              {["Tax & compliance", "Accounting", "Business setup", "Advisory"].map((label) => (
                <span key={label} className="inline-flex items-center gap-1.5 text-[0.68rem] text-white/45">
                  <Check className="h-3 w-3 text-gold-500" />
                  {label}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15} className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative mx-auto max-w-md">
              <div
                className="absolute -inset-2.5 rounded-2xl border border-white/10"
                aria-hidden="true"
              />
              <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-sm">
                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
                  <div>
                    <p className="font-display text-xl font-medium text-white">{home.heroCardTitle}</p>
                    <p className="mt-1.5 text-[0.7rem] text-white/40">{home.heroCardSubtitle}</p>
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-gold-400/40 bg-gold-500/10 text-gold-300">
                    <Sparkles className="h-4 w-4" />
                  </span>
                </div>

                <div className="flex items-center gap-5 py-6">
                  <div
                    className="relative flex h-[5.5rem] w-[5.5rem] shrink-0 items-center justify-center rounded-full"
                    style={{
                      background:
                        "conic-gradient(#c9a227 0deg 252deg, rgba(255,255,255,0.09) 252deg 360deg)",
                    }}
                    aria-hidden="true"
                  >
                    <div className="flex h-[4.5rem] w-[4.5rem] flex-col items-center justify-center rounded-full bg-navy-950">
                      <span className="font-display text-2xl text-white">Q4</span>
                      <span className="text-[0.55rem] uppercase tracking-wider text-white/40">
                        cycle view
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-wider text-gold-400">
                      One clear calendar
                    </p>
                    <p className="mt-1.5 text-[0.78rem] leading-5 text-white/55">
                      Statutory dates, books close and reviews kept visible — with a named point of
                      contact.
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {[
                    { icon: CalendarCheck, label: "GST return cycle", status: "Planned" },
                    { icon: BookOpen, label: "Monthly books close", status: "Scheduled" },
                    { icon: FileCheck2, label: "TDS review", status: "Queued" },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-white/[0.025] px-3.5 py-2.5"
                    >
                      <span className="flex items-center gap-2.5 text-[0.76rem] text-white/70">
                        <row.icon className="h-3.5 w-3.5 text-gold-500/80" />
                        {row.label}
                      </span>
                      <span className="rounded-full border border-white/10 px-2 py-0.5 text-[0.58rem] uppercase tracking-wider text-white/35">
                        {row.status}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-[0.58rem] uppercase tracking-[0.16em] text-white/25">
                  Illustrative workflow view
                </p>
              </div>

              <div className="absolute -bottom-7 -left-5 hidden w-[15.5rem] rounded-lg border border-gold-400/30 bg-navy-900 p-4 shadow-2xl sm:block">
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-gold-400">
                  How we work
                </p>
                <p className="mt-1.5 text-[0.76rem] leading-5 text-white/65">
                  Scope agreed in writing. One professional accountable for your engagement.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {stats.length > 0 && (
          <div className="relative border-t border-white/10 bg-navy-950/70">
            <div className="container grid grid-cols-2 md:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className="border-r border-white/10 px-2 py-7 last:border-r-0 md:px-8 [&:nth-child(2)]:border-r-0 md:[&:nth-child(2)]:border-r"
                >
                  <p className="font-display text-2xl font-medium text-gold-300 md:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[0.66rem] uppercase tracking-[0.12em] text-white/40">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Services */}
      <section className="section bg-ivory">
        <div className="container">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading
              eyebrow={home.servicesEyebrow}
              title={home.servicesTitle}
              description={home.servicesDescription}
            />
            <Link href="/services" className="link-underline shrink-0 pb-1 text-[0.82rem]">
              View all services
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-navy-100 bg-navy-100 sm:grid-cols-2 lg:grid-cols-3">
            {displayedServices.map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="group relative flex flex-col bg-white p-7 transition-colors hover:bg-navy-50/60"
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
                <h3 className="mt-6 font-display text-[1.6rem] font-medium leading-tight text-navy-950">
                  {service.title}
                </h3>
                <p className="mt-2.5 flex-1 text-[0.82rem] leading-6 text-navy-500">
                  {service.shortDescription}
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-[0.71rem] font-semibold uppercase tracking-[0.12em] text-gold-700">
                  Explore service
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="section bg-white">
        <div className="container grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow={home.whyEyebrow}
              title={home.whyTitle}
              description={home.whyDescription}
            />
            <figure className="mt-9 border-l-2 border-gold-500 pl-5">
              <blockquote className="font-display text-[1.3rem] italic leading-7 text-navy-700">
                “Good numbers are not a year-end exercise. They are how a business sees itself
                clearly.”
              </blockquote>
              <figcaption className="mt-3 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-navy-400">
                The ArthaLedger approach
              </figcaption>
            </figure>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-gold-700 hover:text-gold-800"
            >
              Meet the practice
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {whyItems.map((item, index) => (
              <div key={item.id}>
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center border border-navy-100 bg-ivory text-gold-700">
                    <ContentIcon name={item.icon} className="h-4 w-4" />
                  </span>
                  <span className="text-[0.6rem] font-semibold tracking-[0.14em] text-navy-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-[1.3rem] font-semibold text-navy-950">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-[0.8rem] leading-6 text-navy-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="relative overflow-hidden bg-navy-950 py-20 text-white md:py-28">
        <div
          className="pointer-events-none absolute inset-0 bg-grid-navy bg-[size:56px_56px] opacity-40"
          aria-hidden="true"
        />
        <div className="container relative">
          <SectionHeading
            eyebrow={home.expertiseEyebrow}
            title={home.expertiseTitle}
            description={home.expertiseDescription}
            light
          />
          <div className="mt-14 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {expertise.map((item, index) => (
              <div key={item.id} className="group bg-navy-950 p-7 transition-colors hover:bg-navy-900">
                <div className="flex items-center justify-between">
                  <ContentIcon name={item.icon} className="h-5 w-5 text-gold-400" />
                  <span className="font-display text-sm text-white/20">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-[1.35rem] font-medium text-white">{item.title}</h3>
                <p className="mt-2 text-[0.78rem] leading-6 text-white/45">{item.description}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-2xl text-[0.65rem] leading-5 text-white/25">
            Engagements are subject to written scope. Regulated audit, attest and other restricted
            services are undertaken only where the firm and the responsible professional hold the
            applicable qualifications and authorisations.
          </p>
        </div>
      </section>

      {/* Testimonials — published only, approved client feedback */}
      <section className="section bg-ivory">
        <div className="container">
          <SectionHeading
            eyebrow={home.testimonialsEyebrow}
            title={home.testimonialsTitle}
            description={home.testimonialsDescription}
          />
          {testimonials.length > 0 ? (
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.slice(0, 3).map((testimonial) => (
                <figure
                  key={testimonial.id}
                  className="flex flex-col rounded-xl border border-navy-100 bg-white p-7 shadow-soft"
                >
                  <Stars rating={testimonial.rating} />
                  <blockquote className="mt-5 flex-1 text-[0.9rem] leading-7 text-navy-600">
                    “{testimonial.review}”
                  </blockquote>
                  <figcaption className="mt-6 border-t border-navy-100 pt-5">
                    <p className="font-display text-lg font-semibold text-navy-950">
                      {testimonial.clientName}
                    </p>
                    <p className="mt-0.5 text-[0.7rem] text-navy-400">
                      {[testimonial.designation, testimonial.company].filter(Boolean).join(", ")}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <div className="mt-10 flex flex-col items-start gap-5 rounded-xl border border-navy-100 bg-white p-7 shadow-soft sm:flex-row sm:items-center sm:p-9">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-gold-200 bg-gold-50 text-gold-700">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="font-display text-xl font-semibold text-navy-950">
                  Verified feedback only.
                </p>
                <p className="mt-1.5 max-w-2xl text-[0.82rem] leading-6 text-navy-500">
                  We do not publish invented reviews. Client testimonials appear here only after the
                  client has provided the feedback and approved its use. In the meantime, you are
                  welcome to speak with our team directly.
                </p>
              </div>
              <Link
                href="/testimonials"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-navy-200 px-4 py-2.5 text-[0.75rem] font-semibold text-navy-800 hover:bg-navy-50"
              >
                Our feedback policy
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      {previewFaqs.length > 0 && (
        <section className="section bg-white">
          <div className="container grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <SectionHeading
                eyebrow={home.faqEyebrow}
                title={home.faqTitle}
                description={home.faqDescription}
              />
              <div className="mt-8 rounded-lg border border-gold-200 bg-gold-50/60 p-5">
                <p className="text-[0.78rem] font-medium text-navy-800">
                  Still have a question?
                </p>
                <p className="mt-1 text-[0.75rem] leading-6 text-navy-500">
                  Speak with the team about your specific facts — general website information is not
                  a substitute for professional advice.
                </p>
                <Button asChild variant="default" size="sm" className="mt-4">
                  <Link href="/contact">
                    Ask our team
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
            <Accordion type="single" collapsible className="border-t border-navy-100">
              {previewFaqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      <CtaBand
        eyebrow={home.ctaEyebrow}
        title={home.ctaTitle}
        description={home.ctaDescription}
        buttonLabel={home.ctaButtonLabel}
        buttonHref={home.ctaButtonHref}
        phone={settings.primaryPhone}
      />
    </>
  );
}
