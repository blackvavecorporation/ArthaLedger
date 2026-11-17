import Link from "next/link";
import type { FAQ } from "@/lib/demo-types";
import { Save } from "lucide-react";
import { saveFaq } from "@/actions/inquiries";
import { CheckboxField, Field, FormActions, FormGrid, FormSection } from "@/components/admin/form";
import { SubmitButton } from "@/components/admin/submit-button";
import { Button } from "@/components/ui/button";

export function FaqForm({ faq }: { faq?: FAQ | null }) {
  return (
    <form action={saveFaq} className="space-y-6">
      {faq && <input type="hidden" name="id" value={faq.id} />}
      <FormSection
        title="Question & answer"
        description="Published FAQs appear on the homepage and are used as approved chatbot and FAQ-page content. For advice on specific facts, the answer should direct visitors to the firm."
      >
        <div className="space-y-5">
          <Field label="Question" htmlFor="question" required>
            <input id="question" name="question" required maxLength={300} defaultValue={faq?.question ?? ""} className="admin-input" />
          </Field>
          <Field label="Answer" htmlFor="answer" required>
            <textarea
              id="answer"
              name="answer"
              required
              minLength={10}
              maxLength={5000}
              defaultValue={faq?.answer ?? ""}
              className="admin-textarea min-h-[140px]"
            />
          </Field>
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Field label="Category (optional)" htmlFor="category">
            <input id="category" name="category" maxLength={100} defaultValue={faq?.category ?? ""} className="admin-input" />
          </Field>
          <Field label="Display order" htmlFor="order">
            <input id="order" name="order" type="number" min={0} max={999} defaultValue={faq?.order ?? 0} className="admin-input" />
          </Field>
        </div>
      </FormSection>

      <FormSection title="Telugu translation (optional)" description="Used by the chatbot when a visitor selects Telugu. If blank, the English answer is used.">
        <FormGrid>
          <Field label="Question in Telugu" htmlFor="questionTe">
            <input id="questionTe" name="questionTe" maxLength={300} defaultValue={faq?.questionTe ?? ""} className="admin-input" />
          </Field>
          <Field label="Answer in Telugu" htmlFor="answerTe">
            <textarea
              id="answerTe"
              name="answerTe"
              maxLength={5000}
              defaultValue={faq?.answerTe ?? ""}
              className="admin-textarea min-h-[120px]"
            />
          </Field>
        </FormGrid>
      </FormSection>

      <FormSection title="Visibility">
        <CheckboxField
          label="Published"
          name="isPublished"
          defaultChecked={faq?.isPublished ?? true}
          hint="Unpublished FAQs are hidden from the website and chatbot."
        />
      </FormSection>

      <FormActions>
        <Button asChild variant="outline" type="button">
          <Link href="/admin/faqs">Cancel</Link>
        </Button>
        <SubmitButton pendingLabel="Saving FAQ…">
          <Save className="h-4 w-4" />
          Save FAQ
        </SubmitButton>
      </FormActions>
    </form>
  );
}
