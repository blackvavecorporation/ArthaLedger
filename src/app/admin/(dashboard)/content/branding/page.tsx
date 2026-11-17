import { Save } from "lucide-react";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { saveBranding } from "@/actions/cms";
import { FeedbackBanner, type AdminSearchParams } from "@/components/admin/feedback";
import { PageHeader } from "@/components/admin/page-header";
import { SubmitButton } from "@/components/admin/submit-button";
import { Field, FormGrid, FormSection } from "@/components/admin/form";
import { ImageField } from "@/components/admin/image-field";

export const dynamic = "force-dynamic";

export default async function BrandingPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>;
}) {
  await requirePermission("settings.write");
  const params = await searchParams;
  const settings = await db.websiteSettings.findUnique({ where: { id: "main" } });

  return (
    <>
      <PageHeader
        eyebrow="Site setup"
        title="Logo & branding"
        description="Control the firm name, tagline, logo and favicon used across the public website, admin login and metadata."
      />
      <FeedbackBanner params={params} />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <form action={saveBranding} className="space-y-6">
          <FormSection title="Brand identity">
            <FormGrid>
              <Field label="Brand name" htmlFor="brandName" required hint="Shown in the navbar, footer and admin.">
                <input id="brandName" name="brandName" required defaultValue={settings?.brandName ?? "ArthaLedger"} className="admin-input" />
              </Field>
              <Field label="Legal entity name" htmlFor="legalName" required hint="Use the registered name. Replace placeholders before launch.">
                <input id="legalName" name="legalName" required defaultValue={settings?.legalName ?? ""} className="admin-input" />
              </Field>
            </FormGrid>
            <div className="mt-5">
              <Field label="Tagline" htmlFor="tagline" required>
                <input id="tagline" name="tagline" required defaultValue={settings?.tagline ?? ""} className="admin-input" />
              </Field>
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <ImageField
                name="logoUrl"
                label="Logo"
                defaultValue={settings?.logoUrl}
                hint="A square or horizontal logo works best. Leave blank to use the AL monogram."
              />
              <ImageField
                name="faviconUrl"
                label="Favicon"
                defaultValue={settings?.faviconUrl}
                hint="Square PNG or SVG recommended. Ensure cache invalidation after replacing."
              />
            </div>
          </FormSection>

          <div className="sticky bottom-4 z-10 flex justify-end rounded-xl border border-navy-100 bg-white/95 p-3 shadow-lg backdrop-blur">
            <SubmitButton pendingLabel="Saving branding…">
              <Save className="h-4 w-4" />
              Save branding
            </SubmitButton>
          </div>
        </form>

        <div className="space-y-4">
          <div className="rounded-xl border border-navy-100 bg-white p-6 shadow-sm">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-navy-400">
              Current brand lockup
            </p>
            <div className="mt-5 flex items-center gap-3 rounded-lg border border-navy-100 bg-ivory p-4">
              {settings?.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={settings.logoUrl} alt="Current logo" className="h-12 w-12 object-contain" />
              ) : (
                <span className="relative flex h-12 w-12 items-center justify-center border border-gold-500/70 bg-navy-950 font-display text-xl text-gold-300">
                  AL
                  <span className="absolute -bottom-px -right-px h-1.5 w-1.5 bg-gold-500" />
                </span>
              )}
              <div>
                <p className="font-display text-2xl font-semibold text-navy-950">{settings?.brandName}</p>
                <p className="mt-0.5 text-[0.6rem] uppercase tracking-[0.16em] text-navy-400">Financial expertise</p>
              </div>
            </div>
            <p className="mt-4 text-[0.72rem] leading-6 text-navy-500">{settings?.tagline}</p>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-[0.7rem] leading-6 text-amber-900">
            Brand names and professional designations must be accurate. Do not use qualification marks
            or firm names the practice is not authorised to display.
          </div>
        </div>
      </div>
    </>
  );
}
