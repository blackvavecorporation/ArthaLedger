import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarClock, Mail, MessageCircle, Phone, Video } from "lucide-react";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { deleteAppointment, updateAppointment } from "@/actions/inquiries";
import { FeedbackBanner, type AdminSearchParams } from "@/components/admin/feedback";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { SubmitButton } from "@/components/admin/submit-button";
import { DeleteButton } from "@/components/admin/delete-button";
import { Field, FormSection } from "@/components/admin/form";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AppointmentDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<AdminSearchParams>;
}) {
  await requirePermission("appointments.read");
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const appointment = await db.appointmentRequest.findUnique({
    where: { id },
    include: { service: true },
  });
  if (!appointment) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Appointment request"
        title={appointment.name}
        description={`Requested ${formatDate(appointment.createdAt, true)}`}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/appointments">
              <ArrowLeft className="h-3.5 w-3.5" />
              All appointments
            </Link>
          </Button>
        }
      />
      <FeedbackBanner params={query} />

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <div className="rounded-xl border border-navy-100 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-navy-400">Requested consultation</p>
                <p className="mt-2 flex items-center gap-2 font-display text-2xl font-medium text-navy-950">
                  <CalendarClock className="h-5 w-5 text-gold-600" />
                  {formatDate(appointment.preferredDate)}
                </p>
                <p className="mt-1 text-[0.78rem] text-navy-500">Preferred time: {appointment.preferredTime}</p>
              </div>
              <StatusBadge status={appointment.status} />
            </div>
            <div className="mt-5 grid gap-4 border-t border-navy-100 pt-5 text-[0.78rem] sm:grid-cols-2">
              <div>
                <p className="text-[0.65rem] uppercase tracking-wide text-navy-400">Mode</p>
                <p className="mt-1 flex items-center gap-2 text-navy-700">
                  {appointment.mode === "VIDEO" ? <Video className="h-3.5 w-3.5" /> : appointment.mode === "PHONE" ? <Phone className="h-3.5 w-3.5" /> : null}
                  {appointment.mode.replaceAll("_", " ").toLowerCase()}
                </p>
              </div>
              <div>
                <p className="text-[0.65rem] uppercase tracking-wide text-navy-400">Service</p>
                <p className="mt-1 text-navy-700">{appointment.service?.title || appointment.serviceName || "General consultation"}</p>
              </div>
            </div>
            {appointment.notes && (
              <div className="mt-5 rounded-lg border border-navy-100 bg-ivory/60 p-4">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-navy-400">Client context</p>
                <p className="mt-2 whitespace-pre-line text-[0.82rem] leading-6 text-navy-600">{appointment.notes}</p>
              </div>
            )}
          </div>

          <FormSection title="Confirm & track" description="Update the appointment state once you have spoken with the client.">
            <form action={updateAppointment} className="space-y-5">
              <input type="hidden" name="id" value={appointment.id} />
              <Field label="Status" htmlFor="status">
                <select id="status" name="status" defaultValue={appointment.status} className="admin-input">
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </Field>
              <Field label="Internal note" htmlFor="adminNote">
                <textarea id="adminNote" name="adminNote" defaultValue={appointment.adminNote ?? ""} className="admin-textarea min-h-[120px]" />
              </Field>
              <div className="flex justify-end">
                <SubmitButton pendingLabel="Updating…">Save appointment</SubmitButton>
              </div>
            </form>
          </FormSection>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-navy-100 bg-white p-5 shadow-sm">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-navy-400">Contact</p>
            <div className="mt-4 space-y-3 text-[0.78rem]">
              <a href={`mailto:${appointment.email}`} className="flex items-center gap-2.5 text-navy-600 hover:text-navy-900">
                <Mail className="h-4 w-4 text-gold-600" />
                {appointment.email}
              </a>
              <a href={`tel:${appointment.phone.replace(/\s/g, "")}`} className="flex items-center gap-2.5 text-navy-600 hover:text-navy-900">
                <Phone className="h-4 w-4 text-gold-600" />
                {appointment.phone}
              </a>
              <a
                href={`https://wa.me/${appointment.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 text-navy-600 hover:text-navy-900"
              >
                <MessageCircle className="h-4 w-4 text-gold-600" />
                WhatsApp ↗
              </a>
            </div>
          </div>
          <div className="rounded-xl border border-navy-100 bg-white p-5 shadow-sm">
            <p className="text-[0.7rem] font-semibold text-navy-800">Delete request</p>
            <p className="mt-1 text-[0.68rem] leading-5 text-navy-400">Removes this appointment and its notes permanently.</p>
            <div className="mt-3">
              <DeleteButton
                action={deleteAppointment}
                id={appointment.id}
                name={appointment.name}
                label="Delete request"
                title="Delete this appointment request?"
                description="This permanently removes the request and internal notes, and records the action in the audit log."
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
