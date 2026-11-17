import Link from "next/link";
import type { Testimonial } from "@/lib/demo-types";
import { Save, ShieldCheck } from "lucide-react";
import { saveTestimonial } from "@/actions/inquiries";
import { CheckboxField, Field, FormActions, FormGrid, FormSection } from "@/components/admin/form";
import { ImageField } from "@/components/admin/image-field";
import { SubmitButton } from "@/components/admin/submit-button";
import { Button } from "@/components/ui/button";

export function TestimonialForm({ testimonial }: { testimonial?: Testimonial | null }) {
  return (
    <form action={saveTestimonial} className="space-y-6">
      {testimonial && <input type="hidden" name="id" value={testimonial.id} />}

      <div className="flex items-start gap-3 rounded-xl border border-gold-200 bg-gold-50/60 p-4">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-700" />
        <p className="text-[0.74rem] leading-6 text-navy-700">
          <span className="font-semibold">Only publish genuine feedback.</span> Enter a testimonial
          only where the client actually provided it and has agreed to publication. Do not write,
          embellish or generate reviews. Approval is required before publishing.
        </p>
      </div>

      <FormSection title="Client feedback">
        <FormGrid>
          <Field label="Client name" htmlFor="clientName" required>
            <input
              id="clientName"
              name="clientName"
              required
              maxLength={120}
              defaultValue={testimonial?.clientName ?? ""}
              className="admin-input"
            />
          </Field>
          <Field label="Rating" htmlFor="rating" required>
            <select id="rating" name="rating" defaultValue={String(testimonial?.rating ?? 5)} className="admin-input">
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} out of 5
                </option>
              ))}
            </select>
          </Field>
        </FormGrid>
        <FormGrid>
          <Field label="Designation (optional)" htmlFor="designation">
            <input
              id="designation"
              name="designation"
              maxLength={120}
              defaultValue={testimonial?.designation ?? ""}
              className="admin-input"
            />
          </Field>
          <Field label="Company (optional)" htmlFor="company">
            <input
              id="company"
              name="company"
              maxLength={120}
              defaultValue={testimonial?.company ?? ""}
              className="admin-input"
            />
          </Field>
        </FormGrid>
        <div className="mt-5">
          <Field label="Client review" htmlFor="review" required hint="Use the client's actual wording. 20–3,000 characters.">
            <textarea
              id="review"
              name="review"
              required
              minLength={20}
              maxLength={3000}
              defaultValue={testimonial?.review ?? ""}
              className="admin-textarea min-h-[160px]"
            />
          </Field>
        </div>
        <div className="mt-5">
          <ImageField name="imageUrl" label="Client photo (optional)" defaultValue={testimonial?.imageUrl} />
        </div>
      </FormSection>

      <FormSection title="Approval & visibility" description="Approval records that the client consented to publication. Publishing makes the testimonial visible on the public website.">
        <div className="grid gap-5 md:grid-cols-3">
          <CheckboxField
            label="Approved by client"
            name="isApproved"
            defaultChecked={testimonial?.isApproved ?? false}
            hint="Required before publishing."
          />
          <CheckboxField
            label="Published on website"
            name="isPublished"
            defaultChecked={testimonial?.isPublished ?? false}
            hint="Only if approved."
          />
          <Field label="Display order" htmlFor="order">
            <input
              id="order"
              name="order"
              type="number"
              min={0}
              max={999}
              defaultValue={testimonial?.order ?? 0}
              className="admin-input"
            />
          </Field>
        </div>
      </FormSection>

      <FormActions>
        <Button asChild variant="outline" type="button">
          <Link href="/admin/testimonials">Cancel</Link>
        </Button>
        <SubmitButton pendingLabel="Saving testimonial…">
          <Save className="h-4 w-4" />
          Save testimonial
        </SubmitButton>
      </FormActions>
    </form>
  );
}
