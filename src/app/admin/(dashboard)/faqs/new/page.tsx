import { requirePermission } from "@/lib/auth";
import { PageHeader } from "@/components/admin/page-header";
import { FaqForm } from "../faq-form";

export const dynamic = "force-dynamic";

export default async function NewFaqPage() {
  await requirePermission("faqs.write");
  return (
    <>
      <PageHeader eyebrow="FAQs" title="Add an FAQ" description="Write a clear, accurate answer based on approved firm information." />
      <FaqForm />
    </>
  );
}
