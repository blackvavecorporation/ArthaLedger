import { Save, Search, Share2 } from "lucide-react";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { saveSeoSettings } from "@/actions/cms";
import { FeedbackBanner, type AdminSearchParams } from "@/components/admin/feedback";
import { PageHeader } from "@/components/admin/page-header";
import { SubmitButton } from "@/components/admin/submit-button";
import { Field, FormGrid, FormSection } from "@/components/admin/form";
import { ImageField } from "@/components/admin/image-field";

export const dynamic = "force-dynamic";

export default async function SeoSettingsPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>;
}) {
  await requirePermission("seo.write");
  const params = await searchParams;
  const seo = await db.sEOSettings.findUnique({ where: { id: "main" } });

  return (
    <>
      <PageHeader
        eyebrow="Website content"
        title="SEO & analytics"
        description="Dynamic metadata, Open Graph, canonical URLs, sitemap and analytics configuration. Page-level SEO overrides are available on each service and legal page."
      />
      <FeedbackBanner params={params} />

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <form action={saveSeoSettings}>
          <FormSection title="Site metadata">
            <div className="space-y-5">
              <Field label="Default site title" htmlFor="siteTitle" required hint="Used on the homepage and as a fallback.">
                <input id="siteTitle" name="siteTitle" required defaultValue={seo?.siteTitle ?? ""} className="admin-input" />
              </Field>
              <FormGrid>
                <Field label="Title template" htmlFor="titleTemplate" required hint="Use %s for the page title. Example: %s | ArthaLedger">
                  <input id="titleTemplate" name="titleTemplate" required defaultValue={seo?.titleTemplate ?? "%s | ArthaLedger"} className="admin-input" />
                </Field>
                <Field label="Canonical base URL" htmlFor="canonicalBase" hint="Production site URL, e.g. https://www.example.com">
                  <input id="canonicalBase" name="canonicalBase" defaultValue={seo?.canonicalBase ?? ""} className="admin-input" />
                </Field>
              </FormGrid>
              <Field label="Meta description" htmlFor="description" required>
                <textarea id="description" name="description" required defaultValue={seo?.description ?? ""} className="admin-textarea min-h-[100px]" />
              </Field>
              <Field label="Keywords" htmlFor="keywords" hint="One keyword or phrase per line. Keywords are a minor signal; write for people first.">
                <textarea
                  id="keywords"
                  name="keywords"
                  defaultValue={(seo?.keywords ?? []).join("\n")}
                  className="admin-textarea min-h-[110px]"
                />
              </Field>
              <FormGrid>
                <Field label="Twitter / X handle" htmlFor="twitterHandle">
                  <input id="twitterHandle" name="twitterHandle" defaultValue={seo?.twitterHandle ?? ""} className="admin-input" placeholder="@firmhandle" />
                </Field>
                <Field label="GA4 measurement ID" htmlFor="gaMeasurementId" hint="Optional. Enables the analytics status on the dashboard; add the GA script via your deployment if required.">
                  <input id="gaMeasurementId" name="gaMeasurementId" defaultValue={seo?.gaMeasurementId ?? ""} className="admin-input" placeholder="G-XXXXXXXXXX" />
                </Field>
              </FormGrid>
              <ImageField
                name="ogImageUrl"
                label="Open Graph image"
                defaultValue={seo?.ogImageUrl}
                hint="Recommended 1200×630. Used when pages are shared on social platforms."
              />
            </div>
            <div className="mt-6 flex justify-end">
              <SubmitButton pendingLabel="Saving SEO settings…">
                <Save className="h-4 w-4" />
                Save SEO settings
              </SubmitButton>
            </div>
          </FormSection>
        </form>

        <div className="space-y-4">
          <div className="rounded-xl border border-navy-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-wider text-navy-400">
              <Search className="h-3.5 w-3.5 text-gold-600" />
              Search preview
            </div>
            <div className="mt-4 rounded-md border border-navy-100 p-4">
              <p className="text-[0.65rem] text-navy-400">https://your-domain.com</p>
              <p className="mt-1 line-clamp-2 text-[0.95rem] text-[#1a0dab]">{seo?.siteTitle}</p>
              <p className="mt-1 line-clamp-3 text-[0.72rem] leading-5 text-navy-500">{seo?.description}</p>
            </div>
            <p className="mt-3 text-[0.65rem] leading-5 text-navy-400">
              Titles and descriptions are generated from CMS content at request time.
            </p>
          </div>

          <div className="rounded-xl border border-navy-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-wider text-navy-400">
              <Share2 className="h-3.5 w-3.5 text-gold-600" />
              Social card
            </div>
            <div className="mt-4 overflow-hidden rounded-md border border-navy-100">
              {seo?.ogImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={seo.ogImageUrl} alt="Open Graph preview" className="h-32 w-full object-cover" />
              ) : (
                <div className="flex h-32 items-center justify-center bg-navy-950 text-[0.65rem] uppercase tracking-[0.2em] text-white/30">
                  No OG image set
                </div>
              )}
              <div className="bg-white p-3">
                <p className="text-[0.6rem] uppercase tracking-wide text-navy-400">ArthaLedger</p>
                <p className="mt-1 line-clamp-2 text-[0.8rem] font-medium text-navy-900">{seo?.siteTitle}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-navy-100 bg-white p-5 text-[0.7rem] leading-6 text-navy-500 shadow-sm">
            <p className="font-semibold text-navy-800">Automatic SEO features</p>
            <ul className="mt-2 list-disc space-y-1.5 pl-4">
              <li>Dynamic canonical URLs and Open Graph tags</li>
              <li>Organization, Service and FAQ structured data</li>
              <li>Auto-generated sitemap.xml and robots.txt</li>
              <li>Admin and API routes excluded from indexing</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
