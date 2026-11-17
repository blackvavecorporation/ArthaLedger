import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { FeedbackBanner, type AdminSearchParams } from "@/components/admin/feedback";
import { PageHeader } from "@/components/admin/page-header";
import { FaqForm } from "../faq-form";

export const dynamic = "force-dynamic";

export default async function EditFaqPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<AdminSearchParams>;
}) {
  await requirePermission("faqs.write");
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const faq = await db.fAQ.findUnique({ where: { id } });
  if (!faq) notFound();

  return (
    <>
      <PageHeader eyebrow="FAQs" title="Edit FAQ" description="Update the question, answer and publishing state." />
      <FeedbackBanner params={query} />
      <FaqForm faq={faq} />
    </>
  );
}
