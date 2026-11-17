import { requirePermission } from "@/lib/auth";
import { PageHeader } from "@/components/admin/page-header";
import { TestimonialForm } from "../testimonial-form";

export const dynamic = "force-dynamic";

export default async function NewTestimonialPage() {
  await requirePermission("testimonials.write");
  return (
    <>
      <PageHeader
        eyebrow="Testimonials"
        title="Add a testimonial"
        description="Record feedback that was genuinely provided by a client, with their approval to publish."
      />
      <TestimonialForm />
    </>
  );
}
