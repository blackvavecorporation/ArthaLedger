import Link from "next/link";
import type { Service, ServiceCategory } from "@/lib/demo-types";
import { ExternalLink, Save } from "lucide-react";
import { saveService } from "@/actions/services";
import { CheckboxField, Field, FormActions, FormGrid, FormSection } from "@/components/admin/form";
import { ImageField } from "@/components/admin/image-field";
import { SubmitButton } from "@/components/admin/submit-button";
import { ICON_NAMES } from "@/components/icon";
import { Button } from "@/components/ui/button";

export function ServiceForm({
  service,
  categories,
  nextOrder = 0,
}: {
  service?: Service | null;
  categories: ServiceCategory[];
  nextOrder?: number;
}) {
  return (
    <form action={saveService} className="space-y-6">
      {service && <input type="hidden" name="id" value={service.id} />}

      <FormSection
        title="Service details"
        description="This content appears on the service card, the service detail page and in the chatbot knowledge base."
      >
        <FormGrid>
          <Field label="Service title" htmlFor="title" required>
            <input
              id="title"
              name="title"
              required
              maxLength={160}
              defaultValue={service?.title ?? ""}
              className="admin-input"
              placeholder="Income Tax Returns"
            />
          </Field>
          <Field label="Slug" htmlFor="slug" hint="Leave blank to generate from the title. Changing this changes the public URL.">
            <input
              id="slug"
              name="slug"
              maxLength={140}
              defaultValue={service?.slug ?? ""}
              className="admin-input"
              placeholder="income-tax-returns"
            />
          </Field>
        </FormGrid>
        <div className="mt-5 grid gap-5 md:grid-cols-[1fr_1fr]">
          <Field label="Category" htmlFor="categoryId">
            <select id="categoryId" name="categoryId" defaultValue={service?.categoryId ?? ""} className="admin-input">
              <option value="">Uncategorised</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Icon" htmlFor="icon" hint="Used on service cards and listings.">
            <select id="icon" name="icon" defaultValue={service?.icon ?? "Calculator"} className="admin-input">
              {ICON_NAMES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="mt-5">
          <Field label="Short description" htmlFor="shortDescription" required hint="Shown on cards and in search results. 20–400 characters.">
            <textarea
              id="shortDescription"
              name="shortDescription"
              required
              minLength={20}
              maxLength={400}
              defaultValue={service?.shortDescription ?? ""}
              className="admin-textarea min-h-[80px]"
            />
          </Field>
        </div>
        <div className="mt-5">
          <Field
            label="Detailed information"
            htmlFor="description"
            required
            hint="Markdown supported: # headings, ## sections, - bullets, **bold**, [links](/contact)."
          >
            <textarea
              id="description"
              name="description"
              required
              minLength={30}
              defaultValue={service?.description ?? ""}
              className="admin-textarea min-h-[300px] font-mono text-[0.78rem] leading-6"
            />
          </Field>
        </div>
        <div className="mt-5">
          <Field label="Benefits / inclusions" htmlFor="benefits" hint="One per line. These appear as a checklist on the service page.">
            <textarea
              id="benefits"
              name="benefits"
              defaultValue={(service?.benefits ?? []).join("\n")}
              className="admin-textarea min-h-[120px]"
              placeholder={"Application review\nReturn preparation\nFiling support"}
            />
          </Field>
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Field label="Call-to-action label" htmlFor="ctaLabel" required>
            <input
              id="ctaLabel"
              name="ctaLabel"
              required
              maxLength={80}
              defaultValue={service?.ctaLabel ?? "Enquire about this service"}
              className="admin-input"
            />
          </Field>
          <Field label="Display order" htmlFor="order" hint="Lower numbers appear first.">
            <input
              id="order"
              name="order"
              type="number"
              min={0}
              max={999}
              defaultValue={service?.order ?? nextOrder}
              className="admin-input"
            />
          </Field>
        </div>
        <div className="mt-5">
          <ImageField name="imageUrl" label="Featured image (optional)" defaultValue={service?.imageUrl} />
        </div>
      </FormSection>

      <FormSection title="Publishing" description="Drafts are visible in the admin only. Published services appear on the public website and in the chatbot context.">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Status" htmlFor="status">
            <select id="status" name="status" defaultValue={service?.status ?? "DRAFT"} className="admin-input">
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </Field>
          <div className="flex items-end">
            <CheckboxField
              label="Feature on homepage"
              name="isFeatured"
              defaultChecked={service?.isFeatured ?? false}
              hint="Featured services are prioritised in the homepage services grid."
            />
          </div>
        </div>
        <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-[0.7rem] leading-5 text-amber-900">
          Do not describe regulated services, qualifications or guaranteed outcomes the firm cannot
          substantiate. Audit and attest work must be limited to engagements the firm is professionally
          eligible to accept.
        </p>
      </FormSection>

      <FormSection title="Search engine optimisation" description="Optional overrides. If blank, the title and short description are used.">
        <div className="space-y-5">
          <Field label="SEO title" htmlFor="seoTitle">
            <input id="seoTitle" name="seoTitle" maxLength={200} defaultValue={service?.seoTitle ?? ""} className="admin-input" />
          </Field>
          <Field label="SEO description" htmlFor="seoDescription">
            <textarea
              id="seoDescription"
              name="seoDescription"
              maxLength={400}
              defaultValue={service?.seoDescription ?? ""}
              className="admin-textarea min-h-[80px]"
            />
          </Field>
        </div>
      </FormSection>

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-navy-100 bg-white/95 p-3 shadow-lg backdrop-blur">
        <div>
          {service && (
            <Link
              href={`/services/${service.slug}?preview=1`}
              target="_blank"
              className="inline-flex items-center gap-1.5 text-[0.72rem] font-medium text-navy-500 hover:text-navy-900"
            >
              {service.status === "PUBLISHED" ? "Preview live page" : "Preview draft"}
              <ExternalLink className="h-3 w-3" />
            </Link>
          )}
        </div>
        <FormActions>
          <Button asChild variant="outline" type="button">
            <Link href="/admin/services">Cancel</Link>
          </Button>
          <SubmitButton pendingLabel="Saving service…">
            <Save className="h-4 w-4" />
            Save service
          </SubmitButton>
        </FormActions>
      </div>
    </form>
  );
}
