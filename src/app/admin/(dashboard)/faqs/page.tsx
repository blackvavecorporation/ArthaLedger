import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { deleteFaq } from "@/actions/inquiries";
import { EmptyState } from "@/components/admin/empty-state";
import { FeedbackBanner, type AdminSearchParams } from "@/components/admin/feedback";
import { PageHeader } from "@/components/admin/page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { truncate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminFaqsPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>;
}) {
  await requirePermission("faqs.write");
  const params = await searchParams;
  const faqs = await db.fAQ.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });

  return (
    <>
      <PageHeader
        eyebrow="Website content"
        title="FAQs"
        description="Manage the FAQs shown on the homepage and used by the chatbot. Telugu translations are optional but improve bilingual support."
        actions={
          <Button asChild size="sm">
            <Link href="/admin/faqs/new">
              <Plus className="h-3.5 w-3.5" />
              Add FAQ
            </Link>
          </Button>
        }
      />
      <FeedbackBanner params={params} />

      {faqs.length === 0 ? (
        <EmptyState
          title="No FAQs yet"
          description="Add answers to common questions about the firm, services and process. Avoid tax rates or deadlines that may change."
          action={
            <Button asChild>
              <Link href="/admin/faqs/new">
                <Plus className="h-4 w-4" />
                Add FAQ
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-navy-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="admin-table w-full">
              <thead>
                <tr className="bg-navy-50/50">
                  <th>Question</th>
                  <th>Category</th>
                  <th>Telugu</th>
                  <th>Status</th>
                  <th>Order</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {faqs.map((faq) => (
                  <tr key={faq.id}>
                    <td>
                      <Link href={`/admin/faqs/${faq.id}`} className="font-medium text-navy-900 hover:text-gold-700">
                        {truncate(faq.question, 90)}
                      </Link>
                    </td>
                    <td className="text-[0.72rem] text-navy-500">{faq.category || "—"}</td>
                    <td>
                      {faq.answerTe ? <Badge variant="outline">Available</Badge> : <span className="text-[0.68rem] text-navy-300">—</span>}
                    </td>
                    <td>
                      {faq.isPublished ? <Badge variant="success">Published</Badge> : <Badge variant="muted">Draft</Badge>}
                    </td>
                    <td className="text-[0.72rem] text-navy-400">{faq.order}</td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <Button asChild variant="ghost" size="icon" title="Edit FAQ">
                          <Link href={`/admin/faqs/${faq.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DeleteButton
                          action={deleteFaq}
                          id={faq.id}
                          name={truncate(faq.question, 60)}
                          title="Delete this FAQ?"
                          compact
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
