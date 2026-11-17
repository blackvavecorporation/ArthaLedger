import Link from "next/link";
import type { AppointmentRequestWhereInput, AppointmentStatus } from "@/lib/demo-types";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { FeedbackBanner, type AdminSearchParams } from "@/components/admin/feedback";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUSES: AppointmentStatus[] = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>;
}) {
  await requirePermission("appointments.read");
  const params = await searchParams;
  const status = first(params.status);
  const activeStatus = STATUSES.includes(status as AppointmentStatus) ? (status as AppointmentStatus) : undefined;
  const where: AppointmentRequestWhereInput = activeStatus ? { status: activeStatus } : {};

  const [appointments, grouped] = await Promise.all([
    db.appointmentRequest.findMany({
      where,
      orderBy: [{ preferredDate: "asc" }, { createdAt: "desc" }],
      include: { service: { select: { title: true } } },
      take: 100,
    }),
    db.appointmentRequest.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);
  const counts = Object.fromEntries(grouped.map((row) => [row.status, row._count._all])) as Record<string, number>;

  return (
    <>
      <PageHeader
        eyebrow="Client desk"
        title="Appointment requests"
        description="Consultation requests submitted through the chatbot. Confirm availability with the client using the contact details they provided."
      />
      <FeedbackBanner params={params} />

      <div className="mb-5 flex flex-wrap gap-2">
        <Link
          href="/admin/appointments"
          className={`rounded-full border px-3.5 py-1.5 text-[0.7rem] font-medium ${
            !activeStatus ? "border-navy-900 bg-navy-900 text-white" : "border-navy-200 bg-white text-navy-500"
          }`}
        >
          All
        </Link>
        {STATUSES.map((option) => (
          <Link
            key={option}
            href={`/admin/appointments?status=${option}`}
            className={`rounded-full border px-3.5 py-1.5 text-[0.7rem] font-medium ${
              activeStatus === option ? "border-navy-900 bg-navy-900 text-white" : "border-navy-200 bg-white text-navy-500"
            }`}
          >
            {option.toLowerCase()} <span className="ml-1 opacity-60">{counts[option] ?? 0}</span>
          </Link>
        ))}
      </div>

      {appointments.length === 0 ? (
        <EmptyState
          title="No appointment requests"
          description="When a visitor requests a consultation through the chat assistant, it will appear here for confirmation."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-navy-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="admin-table w-full">
              <thead>
                <tr className="bg-navy-50/50">
                  <th>Client</th>
                  <th>Service</th>
                  <th>Preferred time</th>
                  <th>Mode</th>
                  <th>Requested</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>
                      <Link href={`/admin/appointments/${appointment.id}`} className="font-medium text-navy-900 hover:text-gold-700">
                        {appointment.name}
                      </Link>
                      <p className="text-[0.66rem] text-navy-400">{appointment.phone}</p>
                    </td>
                    <td className="text-[0.72rem] text-navy-500">{appointment.service?.title || appointment.serviceName || "General"}</td>
                    <td className="whitespace-nowrap text-[0.72rem] text-navy-600">
                      {formatDate(appointment.preferredDate)}
                      <span className="ml-1 text-navy-400">· {appointment.preferredTime}</span>
                    </td>
                    <td className="text-[0.68rem] text-navy-400">{appointment.mode.replaceAll("_", " ").toLowerCase()}</td>
                    <td className="whitespace-nowrap text-[0.68rem] text-navy-400">{formatDate(appointment.createdAt)}</td>
                    <td><StatusBadge status={appointment.status} /></td>
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
