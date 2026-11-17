import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, Save } from "lucide-react";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { saveLegalPage } from "@/actions/cms";
import { FeedbackBanner, type AdminSearchParams } from "@/components/admin/feedback";
import { PageHeader } from "@/components/admin/page-header";
import { SubmitButton } from "@/components/admin/submit-button";
import { Field, FormGrid, FormSection } from "@/components/admin/form";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function EditLegalPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<AdminSearchParams>;
}) {
  await requirePermission("legal.write");
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const page = await db.legalPage.findUnique({ where: { id } });
  if (!page) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Legal pages"
        title={page.title}
        description="Edit the policy content. Markdown headings, lists, bold text, links and blockquotes are supported."
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href={`/legal/${page.slug}?preview=1`} target="_blank">
              {page.status === "PUBLISHED" ? "View live page" : "Preview draft"}
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </Button>
        }
      />
      <FeedbackBanner params={query} />

      <form action={saveLegalPage} className="space-y-6">
        <input type="hidden" name="id" value={page.id} />
        <FormSection title="Policy content">
          <FormGrid>
            <Field label="Page title" htmlFor="title" required>
              <input id="title" name="title" required defaultValue={page.title} className="admin-input" />
            </Field>
            <Field label="Publishing status" htmlFor="status">
              <select id="status" name="status" defaultValue={page.status} className="admin-input">
                <option value="DRAFT">Draft (hidden from public site)</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </Field>
          </FormGrid>
          <div className="mt-5">
            <Field
              label="Content (Markdown)"
              htmlFor="content"
              required
              hint="Use # for the main title, ## for sections, - for bullets, > for a callout, **bold** for emphasis."
            >
              <textarea
                id="content"
                name="content"
                required
                minLength={100}
                defaultValue={page.content}
                className="admin-textarea min-h-[520px] font-mono text-[0.75rem] leading-6"
              />
            </Field>
          </div>
          <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-[0.7rem] leading-6 text-amber-900">
            Legal content must reflect the firm's actual practices. Placeholders and draft language
            must be reviewed by qualified counsel. Do not remove mandatory disclosures or make claims
            that cannot be substantiated.
          </div>
        </FormSection>

        <FormSection title="SEO overrides" description="Optional. If blank, the page title and default site metadata are used.">
          <div className="space-y-5">
            <Field label="SEO title" htmlFor="seoTitle">
              <input id="seoTitle" name="seoTitle" defaultValue={page.seoTitle ?? ""} className="admin-input" />
            </Field>
            <Field label="SEO description" htmlFor="seoDescription">
              <textarea id="seoDescription" name="seoDescription" maxLength={400} defaultValue={page.seoDescription ?? ""} className="admin-textarea min-h-[80px]" />
            </Field>
          </div>
        </FormSection>

        <div className="sticky bottom-4 z-10 flex justify-end rounded-xl border border-navy-100 bg-white/95 p-3 shadow-lg backdrop-blur">
          <SubmitButton pendingLabel="Saving legal page…">
            <Save className="h-4 w-4" />
            Save legal page
          </SubmitButton>
        </div>
      </form>
    </>
  );
}
