import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Eye, Target, Users } from "lucide-react";
import { ContentIcon } from "@/components/icon";
import { CtaBand } from "@/components/site/cta-band";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { SmartImage } from "@/components/site/smart-image";
import {
  getAboutContent,
  getExpertiseItems,
  getSettings,
  getStats,
  getTeamMembers,
  getValues,
  getWhyChooseItems,
} from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutContent().catch(() => null);
  return pageMetadata({
    title: about?.title ?? "About ArthaLedger",
    description:
      about?.introduction ??
      "Learn about ArthaLedger's approach, values, expertise and the people behind the practice.",
    path: "/about",
  });
}

export default async function AboutPage() {
  const [about, values, expertise, team, whyItems, stats, settings] = await Promise.all([
    getAboutContent(),
    getValues(),
    getExpertiseItems(),
    getTeamMembers(),
    getWhyChooseItems(),
    getStats(),
    getSettings(),
  ]);

  return (
    <>
      <PageHero
        eyebrow={about.eyebrow}
        title={about.title}
        description={about.introduction}
        breadcrumb={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      <section className="section bg-ivory">
        <div className="container grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <SectionHeading eyebrow="Our story" title="Built around the realities of running a business" />
            <div className="mt-6 space-y-5 text-[0.92rem] leading-8 text-navy-600">
              {about.story.split(/\n{2,}/).map((paragraph: string) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/services" className="link-underline text-[0.82rem]">
                Explore our services
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/contact" className="link-underline text-[0.82rem]">
                Speak with the team
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-xl border border-navy-100 bg-navy-950 p-7 text-white">
              <div
                className="pointer-events-none absolute inset-0 bg-grid-navy bg-[size:40px_40px] opacity-40"
                aria-hidden="true"
              />
              <div className="relative">
                <span className="flex h-9 w-9 items-center justify-center border border-gold-400/40 bg-gold-500/10 text-gold-300">
                  <Eye className="h-4 w-4" />
                </span>
                <p className="mt-4 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-gold-400">
                  Our vision
                </p>
                <p className="mt-2 font-display text-xl leading-7 text-white/90">{about.vision}</p>
              </div>
            </div>
            <div className="rounded-xl border border-gold-200 bg-gold-50/60 p-7">
              <span className="flex h-9 w-9 items-center justify-center border border-gold-300 bg-white text-gold-700">
                <Target className="h-4 w-4" />
              </span>
              <p className="mt-4 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-gold-700">
                Our mission
              </p>
              <p className="mt-2 font-display text-xl leading-7 text-navy-900">{about.mission}</p>
            </div>
            {about.imageUrl && (
              <div className="overflow-hidden rounded-xl border border-navy-100">
                <SmartImage
                  src={about.imageUrl}
                  alt={`${settings.brandName} office`}
                  width={1200}
                  height={700}
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="h-56 w-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {values.length > 0 && (
        <section className="section bg-white">
          <div className="container">
            <SectionHeading
              eyebrow="Our values"
              title={about.valuesTitle}
              align="center"
              description="The standards we hold ourselves to in every engagement."
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <div key={value.id} className="rounded-lg border border-navy-100 bg-ivory/60 p-6">
                  <span className="flex h-10 w-10 items-center justify-center border border-gold-200 bg-white text-gold-700">
                    <ContentIcon name={value.icon} className="h-4.5 w-4.5" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold text-navy-950">{value.title}</h3>
                  <p className="mt-2 text-[0.8rem] leading-6 text-navy-500">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="relative overflow-hidden bg-navy-950 py-20 text-white md:py-28">
        <div
          className="pointer-events-none absolute inset-0 bg-grid-navy bg-[size:56px_56px] opacity-35"
          aria-hidden="true"
        />
        <div className="container relative">
          <SectionHeading
            eyebrow="Our expertise"
            title="Capability across the finance function"
            description="A practical breadth of knowledge, with specialist input arranged where an engagement calls for it."
            light
          />
          <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {expertise.map((item) => (
              <div key={item.id} className="flex gap-4 border-t border-white/10 pt-6">
                <ContentIcon name={item.icon} className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />
                <div>
                  <h3 className="font-display text-xl font-medium text-white">{item.title}</h3>
                  <p className="mt-1.5 text-[0.78rem] leading-6 text-white/45">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-ivory">
        <div className="container">
          <SectionHeading
            eyebrow="Our team"
            title={about.teamTitle}
            description={about.teamDescription}
          />
          {team.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((member) => (
                <article key={member.id} className="overflow-hidden rounded-xl border border-navy-100 bg-white">
                  <div className="flex h-44 items-center justify-center bg-navy-950">
                    {member.imageUrl ? (
                      <SmartImage
                        src={member.imageUrl}
                        alt={member.name}
                        width={600}
                        height={400}
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="font-display text-4xl text-gold-300/80">
                        {member.name
                          .split(" ")
                          .slice(0, 2)
                          .map((part: string) => part[0])
                          .join("")}
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-semibold text-navy-950">{member.name}</h3>
                    <p className="mt-0.5 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-gold-700">
                      {member.designation}
                    </p>
                    {member.qualifications && (
                      <p className="mt-1 text-[0.7rem] text-navy-400">{member.qualifications}</p>
                    )}
                    {member.bio && <p className="mt-3 text-[0.8rem] leading-6 text-navy-500">{member.bio}</p>}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-10 flex flex-col items-start gap-5 rounded-xl border border-navy-100 bg-white p-7 shadow-soft sm:flex-row sm:items-center sm:p-9">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-gold-200 bg-gold-50 text-gold-700">
                <Users className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="font-display text-xl font-semibold text-navy-950">
                  A named professional owns every engagement.
                </p>
                <p className="mt-1.5 max-w-2xl text-[0.82rem] leading-6 text-navy-500">
                  Team profiles are published only with each professional&apos;s consent and with
                  substantiated qualifications. Contact us to be connected with the right person for
                  your requirement.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-navy-200 px-4 py-2.5 text-[0.75rem] font-semibold text-navy-800 hover:bg-navy-50"
              >
                Contact the team
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="section bg-white">
        <div className="container grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <SectionHeading eyebrow="Why us" title={about.whyTitle} description={about.whyDescription} />
            {stats.length > 0 && (
              <div className="mt-8 grid grid-cols-2 gap-5 border-t border-navy-100 pt-8">
                {stats.map((stat) => (
                  <div key={stat.id}>
                    <p className="font-display text-3xl text-navy-950">{stat.value}</p>
                    <p className="mt-1 text-[0.65rem] uppercase tracking-[0.12em] text-navy-400">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {whyItems.map((item) => (
              <div key={item.id} className="border-t border-navy-100 pt-5">
                <div className="flex items-center gap-2.5">
                  <ContentIcon name={item.icon} className="h-4 w-4 text-gold-700" />
                  <h3 className="font-display text-lg font-semibold text-navy-950">{item.title}</h3>
                </div>
                <p className="mt-1.5 text-[0.78rem] leading-6 text-navy-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Work with us"
        title="A considered financial partner, from the first conversation."
        description="Tell us about your business and what you need. We will explain how we can help and what an engagement would look like."
        buttonLabel="Book a consultation"
        buttonHref="/contact"
        phone={settings.primaryPhone}
      />
    </>
  );
}
