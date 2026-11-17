import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, MessageCircle, Phone, ShieldAlert } from "lucide-react";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { deleteEnquiry, updateEnquiry } from "@/actions/inquiries";
import { FeedbackBanner, type AdminSearchParams } from "@/components/admin/feedback";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { SubmitButton } from "@/components/admin/submit-button";
import { DeleteButton } from "@/components/admin/delete-button";
import { Field, FormSection } from "@/components/admin/form";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function EnquiryDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<AdminSearchParams>;
}) {
  await requirePermission("enquiries.read");
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const enquiry = await db.contactEnquiry.findUnique({
    where: { id },
    include: { service: true, conversation: { select: { id: true } } },
  });
  if (!enquiry) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Enquiry"
        title={enquiry.name}
        description={`Received ${formatDate(enquiry.createdAt, true)} via ${enquiry.source === "CHATBOT" ? "the website chatbot" : "the contact form"}.`}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/enquiries">
              <ArrowLeft className="h-3.5 w-3.5" />
              All enquiries
            </Link>
          </Button>
        }
      />
      <FeedbackBanner params={query} />

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          <div className="rounded-xl border border-navy-100 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-navy-400">Enquiry message</p>
                <p className="mt-2 text-[0.72rem] text-navy-400">
                  Service: <span className="font-medium text-navy-700">{enquiry.serviceName || "General enquiry"}</span>
                </p>
              </div>
              <StatusBadge status={enquiry.status} />
            </div>
            <div className="mt-5 whitespace-pre-line rounded-lg border border-navy-100 bg-ivory/60 p-5 text-[0.86rem] leading-7 text-navy-700">
              {enquiry.message}
            </div>
            <dl className="mt-5 grid gap-3 text-[0.72rem] sm:grid-cols-2">
              <div>
                <dt className="text-navy-400">Source</dt>
                <dd className="mt-0.5 text-navy-700">{enquiry.source}</dd>
              </div>
              <div>
                <dt className="text-navy-400">IP address</dt>
                <dd className="mt-0.5 font-mono text-[0.68rem] text-navy-700">{enquiry.ipAddress || "Not recorded"}</dd>
              </div>
              <div>
                <dt className="text-navy-400">Last updated</dt>
                <dd className="mt-0.5 text-navy-700">{formatDate(enquiry.updatedAt, true)}</dd>
              </div>
              <div>
                <dt className="text-navy-400">Linked chat</dt>
                <dd className="mt-0.5">
                  {enquiry.conversation ? (
                    <Link href={`/admin/conversations/${enquiry.conversation.id}`} className="font-medium text-gold-700 hover:underline">
                      View conversation
                    </Link>
                  ) : (
                    <span className="text-navy-500">None</span>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          <FormSection title="Internal follow-up" description="Internal notes are visible only to authorised admin users.">
            <form action={updateEnquiry} className="space-y-5">
              <input type="hidden" name="id" value={enquiry.id} />
              <Field label="Status" htmlFor="status">
                <select id="status" name="status" defaultValue={enquiry.status} className="admin-input">
                  <option value="NEW">New</option>
                  <option value="IN_PROGRESS">In progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="SPAM">Spam</option>
                </select>
              </Field>
              <Field label="Internal note" htmlFor="adminNote" hint="Record follow-up steps, call outcomes or context for the team.">
                <textarea id="adminNote" name="adminNote" defaultValue={enquiry.adminNote ?? ""} className="admin-textarea min-h-[130px]" />
              </Field>
              <div className="flex justify-end">
                <SubmitButton pendingLabel="Updating…">Save follow-up</SubmitButton>
              </div>
            </form>
          </FormSection>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-navy-100 bg-white p-5 shadow-sm">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-navy-400">Contact details</p>
            <div className="mt-4 space-y-3 text-[0.78rem]">
              <a href={`mailto:${enquiry.email}`} className="flex items-center gap-2.5 text-navy-600 hover:text-navy-900">
                <Mail className="h-4 w-4 text-gold-600" />
                {enquiry.email || "No email provided"}
              </a>
              <a href={`tel:${enquiry.phone.replace(/\s/g, "")}`} className="flex items-center gap-2.5 text-navy-600 hover:text-navy-900">
                <Phone className="h-4 w-4 text-gold-600" />
                {enquiry.phone}
              </a>
              <a
                href={`https://wa.me/${enquiry.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 text-navy-600 hover:text-navy-900"
              >
                <MessageCircle className="h-4 w-4 text-gold-600" />
                Message on WhatsApp ↗
              </a>
            </div>
          </div>

          <div className="rounded-xl border border-navy-100 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <p className="text-[0.7rem] leading-6 text-navy-500">
                Enquiry data may contain personal information. Use it only to respond to this request,
                do not copy it into public tools, and retain it in line with the firm's privacy policy.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-navy-100 bg-white p-5 shadow-sm">
            <p className="text-[0.7rem] font-semibold text-navy-800">Delete enquiry</p>
            <p className="mt-1 text-[0.68rem] leading-5 text-navy-400">
              Removes this sample record from the current demo session.
            </p>
            <div className="mt-3">
              <DeleteButton
                action={deleteEnquiry}
                id={enquiry.id}
                name={enquiry.name}
                label="Delete enquiry"
                title="Delete this enquiry?"
                description="The sample message, contact details and notes will be removed from this demo session. Nothing is deleted from a database."
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
