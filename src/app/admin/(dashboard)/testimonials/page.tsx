import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { deleteTestimonial, setTestimonialStatus } from "@/actions/inquiries";
import { EmptyState } from "@/components/admin/empty-state";
import { FeedbackBanner, type AdminSearchParams } from "@/components/admin/feedback";
import { PageHeader } from "@/components/admin/page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { SubmitButton } from "@/components/admin/submit-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>;
}) {
  await requirePermission("testimonials.write");
  const params = await searchParams;
  const testimonials = await db.testimonial.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <>
      <PageHeader
        eyebrow="Website content"
        title="Testimonials"
        description="Manage real, approved client feedback. Nothing is visible on the website until both approval and publishing are set."
        actions={
          <Button asChild size="sm">
            <Link href="/admin/testimonials/new">
              <Plus className="h-3.5 w-3.5" />
              Add testimonial
            </Link>
          </Button>
        }
      />
      <FeedbackBanner params={params} />

      {testimonials.length === 0 ? (
        <EmptyState
          title="No testimonials recorded"
          description="Only add feedback a client has genuinely provided and agreed to publish. The public testimonials page currently shows an honest empty state."
          action={
            <Button asChild>
              <Link href="/admin/testimonials/new">
                <Plus className="h-4 w-4" />
                Add testimonial
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
                  <th>Client</th>
                  <th>Rating</th>
                  <th>Approval</th>
                  <th>Website</th>
                  <th>Added</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.map((testimonial) => (
                  <tr key={testimonial.id}>
                    <td>
                      <Link href={`/admin/testimonials/${testimonial.id}`} className="font-medium text-navy-900 hover:text-gold-700">
                        {testimonial.clientName}
                      </Link>
                      <p className="mt-0.5 max-w-xs truncate text-[0.68rem] text-navy-400">
                        {[testimonial.designation, testimonial.company].filter(Boolean).join(", ") || "—"}
                      </p>
                    </td>
                    <td className="text-[0.75rem] text-navy-500">{testimonial.rating}/5</td>
                    <td>
                      <form action={setTestimonialStatus} className="inline-flex">
                        <input type="hidden" name="id" value={testimonial.id} />
                        <input type="hidden" name="field" value="approve" />
                        <input type="hidden" name="value" value={testimonial.isApproved ? "false" : "true"} />
                        <SubmitButton variant="ghost" size="sm" className="h-7 px-2" pendingLabel="…">
                          {testimonial.isApproved ? (
                            <Badge variant="success">Approved</Badge>
                          ) : (
                            <Badge variant="muted">Approve</Badge>
                          )}
                        </SubmitButton>
                      </form>
                    </td>
                    <td>
                      {testimonial.isApproved ? (
                        <form action={setTestimonialStatus} className="inline-flex">
                          <input type="hidden" name="id" value={testimonial.id} />
                          <input type="hidden" name="field" value="publish" />
                          <input type="hidden" name="value" value={testimonial.isPublished ? "false" : "true"} />
                          <SubmitButton variant="ghost" size="sm" className="h-7 px-2" pendingLabel="…">
                            {testimonial.isPublished ? (
                              <Badge variant="success">Published</Badge>
                            ) : (
                              <Badge variant="outline">Publish</Badge>
                            )}
                          </SubmitButton>
                        </form>
                      ) : (
                        <span className="text-[0.66rem] text-navy-300">Approve first</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap text-[0.7rem] text-navy-400">{formatDate(testimonial.createdAt)}</td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <Button asChild variant="ghost" size="icon" title="Edit testimonial">
                          <Link href={`/admin/testimonials/${testimonial.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DeleteButton
                          action={deleteTestimonial}
                          id={testimonial.id}
                          name={testimonial.clientName}
                          title="Delete this testimonial?"
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
