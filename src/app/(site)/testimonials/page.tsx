import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageSquareQuote, ShieldCheck } from "lucide-react";
import { CtaBand } from "@/components/site/cta-band";
import { PageHero } from "@/components/site/page-hero";
import { SmartImage } from "@/components/site/smart-image";
import { Stars } from "@/components/site/stars";
import { getSettings, getPublishedTestimonials } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { initials } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Sample Testimonials",
    description:
      "Illustrative testimonial layouts for the ArthaLedger demonstration website. These are sample cards, not real client reviews.",
    path: "/testimonials",
  });
}

export default async function TestimonialsPage() {
  const [testimonials, settings] = await Promise.all([
    getPublishedTestimonials(),
    getSettings(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Demo testimonials"
        title="Testimonial layout, clearly labelled."
        description="These cards demonstrate the testimonial design with explicitly fictional sample copy. They are not real client reviews and no person or company is represented."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Testimonials" }]}
      />

      <section className="section bg-ivory">
        <div className="container">
          {testimonials.length === 0 ? (
            <div className="mx-auto max-w-2xl rounded-xl border border-navy-100 bg-white p-10 text-center shadow-soft">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold-200 bg-gold-50 text-gold-700">
                <MessageSquareQuote className="h-6 w-6" />
              </span>
              <h2 className="mt-5 font-display text-3xl font-medium text-navy-950">
                Verified feedback, published with care.
              </h2>
              <p className="mt-3 text-sm leading-7 text-navy-500">
                No sample testimonials are available. In a live deployment, only genuine feedback
                provided and approved by a real client should be published.
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1.5 rounded-md bg-navy-900 px-5 py-3 text-[0.78rem] font-semibold text-white hover:bg-navy-800"
                >
                  Explore our services
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 rounded-md border border-navy-200 bg-white px-5 py-3 text-[0.78rem] font-semibold text-navy-800 hover:bg-navy-50"
                >
                  Speak with the team
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <figure
                  key={testimonial.id}
                  className="flex flex-col rounded-xl border border-navy-100 bg-white p-7 shadow-soft"
                >
                  <Stars rating={testimonial.rating} />
                  <blockquote className="mt-5 flex-1 text-[0.92rem] leading-7 text-navy-600">
                    “{testimonial.review}”
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-navy-100 pt-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-navy-950 text-sm font-semibold text-gold-300">
                      {testimonial.imageUrl ? (
                        <SmartImage
                          src={testimonial.imageUrl}
                          alt={testimonial.clientName}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        initials(testimonial.clientName)
                      )}
                    </span>
                    <div>
                      <p className="font-display text-lg font-semibold leading-tight text-navy-950">
                        {testimonial.clientName}
                      </p>
                      <p className="mt-0.5 text-[0.7rem] text-navy-400">
                        {[testimonial.designation, testimonial.company].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}

          <div className="mt-10 flex items-start justify-center gap-2.5 text-center">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
            <p className="max-w-2xl text-[0.68rem] leading-5 text-navy-400">
              Demo notice: every testimonial above is fictional sample copy created to demonstrate
              the layout. These are not real client experiences, endorsements or outcome claims.
            </p>
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="A considered partnership"
        title="Let's build a financial relationship that lasts."
        description="Start with a conversation about your business. We will be clear about what we can do, how it works and what it costs."
        buttonLabel="Book a consultation"
        buttonHref="/contact"
        phone={settings.primaryPhone}
      />
    </>
  );
}
