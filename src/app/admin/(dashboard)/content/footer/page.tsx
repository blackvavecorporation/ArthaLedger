import { Save } from "lucide-react";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { saveFooterSettings } from "@/actions/cms";
import { NavEditor, SocialEditor } from "@/components/admin/items-editor";
import { FeedbackBanner, type AdminSearchParams } from "@/components/admin/feedback";
import { PageHeader } from "@/components/admin/page-header";
import { SubmitButton } from "@/components/admin/submit-button";
import { Field, FormSection } from "@/components/admin/form";

export const dynamic = "force-dynamic";

export default async function FooterSettingsPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>;
}) {
  await requirePermission("settings.write");
  const params = await searchParams;
  const [settings, footerLinks, socials] = await Promise.all([
    db.websiteSettings.findUnique({ where: { id: "main" } }),
    db.navItem.findMany({ where: { location: "FOOTER" }, orderBy: [{ order: "asc" }, { label: "asc" }] }),
    db.socialLink.findMany({ orderBy: [{ order: "asc" }] }),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Site setup"
        title="Footer"
        description="Manage the footer description, copyright line, navigation links and social profiles. Legal links are grouped in the footer's bottom bar automatically."
      />
      <FeedbackBanner params={params} />

      <form action={saveFooterSettings} className="mb-6">
        <FormSection title="Footer content">
          <Field label="Footer description" htmlFor="footerAbout" hint="A concise description shown under the brand lockup.">
            <textarea
              id="footerAbout"
              name="footerAbout"
              required
              defaultValue={settings?.footerAbout ?? ""}
              className="admin-textarea min-h-[100px]"
            />
          </Field>
          <div className="mt-5">
            <Field label="Copyright line" htmlFor="footerCopyright">
              <input
                id="footerCopyright"
                name="footerCopyright"
                required
                defaultValue={settings?.footerCopyright ?? ""}
                className="admin-input"
              />
            </Field>
          </div>
          <div className="mt-6 flex justify-end">
            <SubmitButton pendingLabel="Saving footer…">
              <Save className="h-4 w-4" />
              Save footer content
            </SubmitButton>
          </div>
        </FormSection>
      </form>

      <div className="space-y-6">
        <NavEditor items={footerLinks} location="FOOTER" />
        <SocialEditor items={socials} />
      </div>

      <div className="mt-6 rounded-lg border border-navy-100 bg-white p-5 text-[0.72rem] leading-6 text-navy-500">
        Links whose path begins with <code className="rounded bg-navy-50 px-1">/legal/</code> are
        displayed in the footer's legal row rather than the main footer column. Published legal pages
        appear automatically in the sitemap.
      </div>
    </>
  );
}
