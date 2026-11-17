import Link from "next/link";
import { ExternalLink, Save } from "lucide-react";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { saveAboutContent } from "@/actions/cms";
import { ContentItemsEditor, TeamEditor } from "@/components/admin/items-editor";
import { FeedbackBanner, type AdminSearchParams } from "@/components/admin/feedback";
import { PageHeader } from "@/components/admin/page-header";
import { SubmitButton } from "@/components/admin/submit-button";
import { Field, FormGrid, FormSection } from "@/components/admin/form";
import { ImageField } from "@/components/admin/image-field";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AboutContentPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>;
}) {
  await requirePermission("content.read");
  const params = await searchParams;
  const [about, values, team] = await Promise.all([
    db.aboutPageContent.findUnique({ where: { id: "main" } }),
    db.valueItem.findMany({ orderBy: { order: "asc" } }),
    db.teamMember.findMany({ orderBy: { order: "asc" } }),
  ]);
  if (!about) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        About page content is not initialised. Run the database seed or migration.
      </div>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Website content"
        title="About page"
        description="Manage the firm introduction, vision, mission, values, team and supporting sections."
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/about" target="_blank">
              Preview About page
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </Button>
        }
      />
      <FeedbackBanner params={params} />

      <form action={saveAboutContent} className="space-y-6">
        <FormSection title="Introduction">
          <FormGrid>
            <Field label="Eyebrow" htmlFor="eyebrow">
              <input id="eyebrow" name="eyebrow" required defaultValue={about.eyebrow} className="admin-input" />
            </Field>
            <Field label="Page title" htmlFor="title">
              <input id="title" name="title" required defaultValue={about.title} className="admin-input" />
            </Field>
          </FormGrid>
          <div className="mt-5">
            <Field label="Introduction" htmlFor="introduction" required hint="Used as the page hero description and meta description.">
              <textarea id="introduction" name="introduction" required defaultValue={about.introduction} className="admin-textarea" />
            </Field>
          </div>
          <div className="mt-5">
            <Field label="Our story" htmlFor="story" required hint="Separate paragraphs with a blank line.">
              <textarea id="story" name="story" required defaultValue={about.story} className="admin-textarea min-h-[180px]" />
            </Field>
          </div>
          <div className="mt-5">
            <ImageField name="imageUrl" label="About image (optional)" defaultValue={about.imageUrl} />
          </div>
        </FormSection>

        <FormSection title="Vision & mission">
          <FormGrid>
            <Field label="Vision" htmlFor="vision">
              <textarea id="vision" name="vision" required defaultValue={about.vision} className="admin-textarea min-h-[120px]" />
            </Field>
            <Field label="Mission" htmlFor="mission">
              <textarea id="mission" name="mission" required defaultValue={about.mission} className="admin-textarea min-h-[120px]" />
            </Field>
          </FormGrid>
        </FormSection>

        <FormSection title="Section headings">
          <div className="space-y-5">
            <FormGrid>
              <Field label="Values heading" htmlFor="valuesTitle">
                <input id="valuesTitle" name="valuesTitle" required defaultValue={about.valuesTitle} className="admin-input" />
              </Field>
              <Field label="Why choose us heading" htmlFor="whyTitle">
                <input id="whyTitle" name="whyTitle" required defaultValue={about.whyTitle} className="admin-input" />
              </Field>
            </FormGrid>
            <Field label="Why choose us description" htmlFor="whyDescription">
              <textarea id="whyDescription" name="whyDescription" required defaultValue={about.whyDescription} className="admin-textarea min-h-[80px]" />
            </Field>
            <FormGrid>
              <Field label="Team heading" htmlFor="teamTitle">
                <input id="teamTitle" name="teamTitle" required defaultValue={about.teamTitle} className="admin-input" />
              </Field>
              <Field label="Team description" htmlFor="teamDescription">
                <input id="teamDescription" name="teamDescription" required defaultValue={about.teamDescription} className="admin-input" />
              </Field>
            </FormGrid>
          </div>
        </FormSection>

        <div className="sticky bottom-4 z-10 flex justify-end rounded-xl border border-navy-100 bg-white/95 p-3 shadow-lg backdrop-blur">
          <SubmitButton pendingLabel="Saving About page…">
            <Save className="h-4 w-4" />
            Save About content
          </SubmitButton>
        </div>
      </form>

      <div className="mt-8 space-y-6">
        <ContentItemsEditor
          kind="value"
          items={values}
          title="Values"
          description="The four principles shown on the About page. Keep descriptions specific and honest."
        />
        <TeamEditor members={team} />
      </div>
    </>
  );
}
