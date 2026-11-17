import Link from "next/link";
import { ExternalLink, Save } from "lucide-react";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { saveHomeContent } from "@/actions/cms";
import { ContentItemsEditor, StatsEditor } from "@/components/admin/items-editor";
import { FeedbackBanner, type AdminSearchParams } from "@/components/admin/feedback";
import { PageHeader } from "@/components/admin/page-header";
import { SubmitButton } from "@/components/admin/submit-button";
import { Field, FormGrid, FormSection } from "@/components/admin/form";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function HomeContentPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>;
}) {
  await requirePermission("content.read");
  const params = await searchParams;
  const [home, stats, why, expertise] = await Promise.all([
    db.homePageContent.findUnique({ where: { id: "main" } }),
    db.stat.findMany({ orderBy: { order: "asc" } }),
    db.whyChooseItem.findMany({ orderBy: { order: "asc" } }),
    db.expertiseItem.findMany({ orderBy: { order: "asc" } }),
  ]);
  if (!home) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        Home page content is not initialised. Run the database seed or migration.
      </div>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Website content"
        title="Home page"
        description="Control the hero, every section heading, the closing call to action, statistics and supporting cards. All fields are reflected on the public homepage."
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/" target="_blank">
              Preview homepage
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </Button>
        }
      />
      <FeedbackBanner params={params} />

      <div className="mb-6 flex flex-wrap gap-2 text-[0.7rem]">
        {[
          ["#hero", "Hero"],
          ["#sections", "Section headings"],
          ["#cta", "Closing CTA"],
          ["#statistics", "Statistics"],
        ].map(([href, label]) => (
          <a key={href} href={href} className="rounded-full border border-navy-200 bg-white px-3 py-1.5 font-medium text-navy-500 hover:border-gold-400 hover:text-navy-800">
            {label}
          </a>
        ))}
      </div>

      <form action={saveHomeContent} className="space-y-6">
        <div id="hero">
          <FormSection title="Hero" description="The first screen on the homepage. Keep the headline concise and the description grounded.">
            <FormGrid>
              <Field label="Eyebrow" htmlFor="heroEyebrow" required>
                <input id="heroEyebrow" name="heroEyebrow" required defaultValue={home.heroEyebrow} className="admin-input" />
              </Field>
              <Field label="Trust line" htmlFor="heroTrustLine" required hint="A short confidentiality / scope statement beneath the buttons.">
                <input id="heroTrustLine" name="heroTrustLine" required defaultValue={home.heroTrustLine} className="admin-input" />
              </Field>
            </FormGrid>
            <FormGrid>
              <Field label="Headline (first part)" htmlFor="heroTitle" required>
                <input id="heroTitle" name="heroTitle" required defaultValue={home.heroTitle} className="admin-input" />
              </Field>
              <Field label="Headline accent (italic gold)" htmlFor="heroTitleAccent" required>
                <input id="heroTitleAccent" name="heroTitleAccent" required defaultValue={home.heroTitleAccent} className="admin-input" />
              </Field>
            </FormGrid>
            <div className="mt-5">
              <Field label="Hero description" htmlFor="heroDescription" required>
                <textarea id="heroDescription" name="heroDescription" required defaultValue={home.heroDescription} className="admin-textarea" />
              </Field>
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-4">
              <Field label="Primary button label" htmlFor="primaryCtaLabel">
                <input id="primaryCtaLabel" name="primaryCtaLabel" required defaultValue={home.primaryCtaLabel} className="admin-input" />
              </Field>
              <Field label="Primary button link" htmlFor="primaryCtaHref">
                <input id="primaryCtaHref" name="primaryCtaHref" required defaultValue={home.primaryCtaHref} className="admin-input" />
              </Field>
              <Field label="Secondary label" htmlFor="secondaryCtaLabel">
                <input id="secondaryCtaLabel" name="secondaryCtaLabel" required defaultValue={home.secondaryCtaLabel} className="admin-input" />
              </Field>
              <Field label="Secondary link" htmlFor="secondaryCtaHref">
                <input id="secondaryCtaHref" name="secondaryCtaHref" required defaultValue={home.secondaryCtaHref} className="admin-input" />
              </Field>
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <Field label="Illustration card title" htmlFor="heroCardTitle">
                <input id="heroCardTitle" name="heroCardTitle" required defaultValue={home.heroCardTitle} className="admin-input" />
              </Field>
              <Field label="Illustration card subtitle" htmlFor="heroCardSubtitle">
                <input id="heroCardSubtitle" name="heroCardSubtitle" required defaultValue={home.heroCardSubtitle} className="admin-input" />
              </Field>
            </div>
          </FormSection>
        </div>

        <div id="sections" className="space-y-6">
          <FormSection title="Services section" description="Heading above the featured services grid.">
            <FormGrid cols={3}>
              <Field label="Eyebrow" htmlFor="servicesEyebrow">
                <input id="servicesEyebrow" name="servicesEyebrow" required defaultValue={home.servicesEyebrow} className="admin-input" />
              </Field>
              <Field label="Title" htmlFor="servicesTitle" className="md:col-span-2">
                <input id="servicesTitle" name="servicesTitle" required defaultValue={home.servicesTitle} className="admin-input" />
              </Field>
            </FormGrid>
            <div className="mt-5">
              <Field label="Description" htmlFor="servicesDescription">
                <textarea id="servicesDescription" name="servicesDescription" required defaultValue={home.servicesDescription} className="admin-textarea min-h-[80px]" />
              </Field>
            </div>
          </FormSection>

          <FormSection title="Why choose us section">
            <FormGrid cols={3}>
              <Field label="Eyebrow" htmlFor="whyEyebrow">
                <input id="whyEyebrow" name="whyEyebrow" required defaultValue={home.whyEyebrow} className="admin-input" />
              </Field>
              <Field label="Title" htmlFor="whyTitle" className="md:col-span-2">
                <input id="whyTitle" name="whyTitle" required defaultValue={home.whyTitle} className="admin-input" />
              </Field>
            </FormGrid>
            <div className="mt-5">
              <Field label="Description" htmlFor="whyDescription">
                <textarea id="whyDescription" name="whyDescription" required defaultValue={home.whyDescription} className="admin-textarea min-h-[80px]" />
              </Field>
            </div>
          </FormSection>

          <FormSection title="Expertise section">
            <FormGrid cols={3}>
              <Field label="Eyebrow" htmlFor="expertiseEyebrow">
                <input id="expertiseEyebrow" name="expertiseEyebrow" required defaultValue={home.expertiseEyebrow} className="admin-input" />
              </Field>
              <Field label="Title" htmlFor="expertiseTitle" className="md:col-span-2">
                <input id="expertiseTitle" name="expertiseTitle" required defaultValue={home.expertiseTitle} className="admin-input" />
              </Field>
            </FormGrid>
            <div className="mt-5">
              <Field label="Description" htmlFor="expertiseDescription">
                <textarea id="expertiseDescription" name="expertiseDescription" required defaultValue={home.expertiseDescription} className="admin-textarea min-h-[80px]" />
              </Field>
            </div>
          </FormSection>

          <FormSection title="Testimonials section" description="This section is only rendered when approved testimonials are published.">
            <FormGrid cols={3}>
              <Field label="Eyebrow" htmlFor="testimonialsEyebrow">
                <input id="testimonialsEyebrow" name="testimonialsEyebrow" required defaultValue={home.testimonialsEyebrow} className="admin-input" />
              </Field>
              <Field label="Title" htmlFor="testimonialsTitle" className="md:col-span-2">
                <input id="testimonialsTitle" name="testimonialsTitle" required defaultValue={home.testimonialsTitle} className="admin-input" />
              </Field>
            </FormGrid>
            <div className="mt-5">
              <Field label="Description" htmlFor="testimonialsDescription">
                <textarea id="testimonialsDescription" name="testimonialsDescription" required defaultValue={home.testimonialsDescription} className="admin-textarea min-h-[80px]" />
              </Field>
            </div>
          </FormSection>

          <FormSection title="FAQ section">
            <FormGrid cols={3}>
              <Field label="Eyebrow" htmlFor="faqEyebrow">
                <input id="faqEyebrow" name="faqEyebrow" required defaultValue={home.faqEyebrow} className="admin-input" />
              </Field>
              <Field label="Title" htmlFor="faqTitle" className="md:col-span-2">
                <input id="faqTitle" name="faqTitle" required defaultValue={home.faqTitle} className="admin-input" />
              </Field>
            </FormGrid>
            <div className="mt-5">
              <Field label="Description" htmlFor="faqDescription">
                <textarea id="faqDescription" name="faqDescription" required defaultValue={home.faqDescription} className="admin-textarea min-h-[80px]" />
              </Field>
            </div>
          </FormSection>
        </div>

        <div id="cta">
          <FormSection title="Closing call to action" description="The navy conversion band above the footer.">
            <FormGrid cols={3}>
              <Field label="Eyebrow" htmlFor="ctaEyebrow">
                <input id="ctaEyebrow" name="ctaEyebrow" required defaultValue={home.ctaEyebrow} className="admin-input" />
              </Field>
              <Field label="Title" htmlFor="ctaTitle" className="md:col-span-2">
                <input id="ctaTitle" name="ctaTitle" required defaultValue={home.ctaTitle} className="admin-input" />
              </Field>
            </FormGrid>
            <div className="mt-5">
              <Field label="Description" htmlFor="ctaDescription">
                <textarea id="ctaDescription" name="ctaDescription" required defaultValue={home.ctaDescription} className="admin-textarea min-h-[80px]" />
              </Field>
            </div>
            <FormGrid>
              <Field label="Button label" htmlFor="ctaButtonLabel">
                <input id="ctaButtonLabel" name="ctaButtonLabel" required defaultValue={home.ctaButtonLabel} className="admin-input" />
              </Field>
              <Field label="Button link" htmlFor="ctaButtonHref">
                <input id="ctaButtonHref" name="ctaButtonHref" required defaultValue={home.ctaButtonHref} className="admin-input" />
              </Field>
            </FormGrid>
          </FormSection>
        </div>

        <div className="sticky bottom-4 z-10 flex justify-end rounded-xl border border-navy-100 bg-white/95 p-3 shadow-lg backdrop-blur">
          <SubmitButton pendingLabel="Saving homepage…">
            <Save className="h-4 w-4" />
            Save homepage content
          </SubmitButton>
        </div>
      </form>

      <div className="mt-8 space-y-6">
        <StatsEditor items={stats} />
        <ContentItemsEditor
          kind="why"
          items={why}
          title="Why choose us cards"
          description="Supporting reasons displayed beside the 'Why ArthaLedger' heading."
        />
        <ContentItemsEditor
          kind="expertise"
          items={expertise}
          title="Expertise cards"
          description="Practice capabilities shown in the navy expertise section."
        />
      </div>
    </>
  );
}
