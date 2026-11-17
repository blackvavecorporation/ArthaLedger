import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { FeedbackBanner, type AdminSearchParams } from "@/components/admin/feedback";
import { PageHeader } from "@/components/admin/page-header";
import { TestimonialForm } from "../testimonial-form";

export const dynamic = "force-dynamic";

export default async function EditTestimonialPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<AdminSearchParams>;
}) {
  await requirePermission("testimonials.write");
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const testimonial = await db.testimonial.findUnique({ where: { id } });
  if (!testimonial) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Testimonials"
        title={testimonial.clientName}
        description="Update the client's feedback and its approval or publishing state."
      />
      <FeedbackBanner params={query} />
      <TestimonialForm testimonial={testimonial} />
    </>
  );
}
