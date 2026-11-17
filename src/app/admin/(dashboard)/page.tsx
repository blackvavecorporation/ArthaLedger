import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  CalendarClock,
  ExternalLink,
  Inbox,
  MessageSquareQuote,
  Plus,
  Scale,
  Sparkles,
} from "lucide-react";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { getHomeContent, getSeoSettings } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { EnquiryChart } from "@/components/admin/enquiry-chart";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

function last14Days() {
  const days: { label: string; full: string; key: string; count: number }[] = [];
  const now = new Date();
  for (let index = 13; index >= 0; index -= 1) {
    const date = new Date(now);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - index);
    const key = date.toISOString().slice(0, 10);
    days.push({
      key,
      label: new Intl.DateTimeFormat("en-IN", { day: "numeric" }).format(date),
      full: new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(date),
      count: 0,
    });
  }
  return days;
}

export default async function AdminDashboardPage() {
  const user = await requirePermission("dashboard.view");
  const canViewEnquiries = can(user.role, "enquiries.read");
  const canViewAppointments = can(user.role, "appointments.read");
  const canViewConversations = can(user.role, "conversations.read");
  const canWriteServices = can(user.role, "services.write");

  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - 13);

  const [
    totalEnquiries,
    newEnquiries,
    publishedServices,
    totalServices,
    publishedTestimonials,
    totalTestimonials,
    publishedFaqs,
    pendingAppointments,
    legalPublished,
    legalTotal,
    recentEnquiries,
    chartRows,
    recentAppointments,
    conversationCount,
    leadCount,
    home,
    seo,
  ] = await Promise.all([
    canViewEnquiries ? db.contactEnquiry.count() : Promise.resolve(0),
    canViewEnquiries ? db.contactEnquiry.count({ where: { status: "NEW" } }) : Promise.resolve(0),
    db.service.count({ where: { status: "PUBLISHED" } }),
    db.service.count(),
    db.testimonial.count({ where: { isPublished: true, isApproved: true } }),
    db.testimonial.count(),
    db.fAQ.count({ where: { isPublished: true } }),
    canViewAppointments
      ? db.appointmentRequest.count({ where: { status: "PENDING" } })
      : Promise.resolve(0),
    db.legalPage.count({ where: { status: "PUBLISHED" } }),
    db.legalPage.count(),
    canViewEnquiries
      ? db.contactEnquiry.findMany({
          orderBy: { createdAt: "desc" },
          take: 6,
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            serviceName: true,
            status: true,
            createdAt: true,
            source: true,
          },
        })
      : Promise.resolve([]),
    canViewEnquiries
      ? db.contactEnquiry.findMany({
          where: { createdAt: { gte: since } },
          select: { createdAt: true },
        })
      : Promise.resolve([]),
    canViewAppointments
      ? db.appointmentRequest.findMany({
          orderBy: { createdAt: "desc" },
          take: 4,
          select: { id: true, name: true, preferredDate: true, preferredTime: true, status: true },
        })
      : Promise.resolve([]),
    canViewConversations ? db.chatConversation.count() : Promise.resolve(0),
    canViewConversations ? db.chatConversation.count({ where: { isLead: true } }) : Promise.resolve(0),
    getHomeContent(),
    getSeoSettings(),
  ]);

  const chart = last14Days();
  for (const row of chartRows) {
    const key = row.createdAt.toISOString().slice(0, 10);
    const bucket = chart.find((day) => day.key === key);
    if (bucket) bucket.count += 1;
  }

  const hour = Number(
    new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hour12: false, timeZone: "Asia/Kolkata" }).format(
      new Date(),
    ),
  );
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title={`${greeting}, ${user.name.split(" ")[0]}.`}
        description="A live view of website content, enquiries and client conversations. Everything published here is reflected on the public website."
        actions={
          <>
            <Button asChild variant="outline" size="sm">
              <a href="/" target="_blank" rel="noreferrer">
                View website
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
            {canWriteServices && (
              <Button asChild size="sm">
                <Link href="/admin/services/new">
                  <Plus className="h-3.5 w-3.5" />
                  Add service
                </Link>
              </Button>
            )}
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {canViewEnquiries ? (
          <>
            <StatCard
              label="New enquiries"
              value={newEnquiries}
              hint={`${totalEnquiries} total received`}
              icon={Inbox}
              href="/admin/enquiries?status=NEW"
              accent
            />
            <StatCard
              label="Published services"
              value={publishedServices}
              hint={`${totalServices} total service records`}
              icon={Briefcase}
              href="/admin/services"
            />
            <StatCard
              label="Pending appointments"
              value={pendingAppointments}
              hint="Requests awaiting confirmation"
              icon={CalendarClock}
              href="/admin/appointments?status=PENDING"
            />
            <StatCard
              label="Published testimonials"
              value={publishedTestimonials}
              hint={`${totalTestimonials} total, approved & published only`}
              icon={MessageSquareQuote}
              href="/admin/testimonials"
            />
          </>
        ) : (
          <>
            <StatCard
              label="Published services"
              value={publishedServices}
              hint={`${totalServices} total service records`}
              icon={Briefcase}
              href="/admin/services"
            />
            <StatCard
              label="Published FAQs"
              value={publishedFaqs}
              hint="Shown on the website"
              icon={Sparkles}
              href="/admin/faqs"
            />
            <StatCard
              label="Legal pages"
              value={`${legalPublished}/${legalTotal}`}
              hint="Published drafts"
              icon={Scale}
              href="/admin/legal"
            />
            <StatCard
              label="Published testimonials"
              value={publishedTestimonials}
              hint={`${totalTestimonials} total records`}
              icon={MessageSquareQuote}
              href="/admin/testimonials"
            />
          </>
        )}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
        <section className="rounded-xl border border-navy-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-navy-950">
                {canViewEnquiries ? "Enquiry activity" : "Content readiness"}
              </h2>
              <p className="mt-1 text-[0.75rem] text-navy-400">
                {canViewEnquiries ? "Website enquiries over the last 14 days" : "What is currently live on the site"}
              </p>
            </div>
            {canViewEnquiries && totalEnquiries > 0 && (
              <Badge variant="outline">{totalEnquiries} lifetime</Badge>
            )}
          </div>
          {canViewEnquiries ? (
            <EnquiryChart data={chart} />
          ) : (
            <div className="space-y-3">
              {[
                { label: "Services published", value: `${publishedServices} of ${totalServices}`, href: "/admin/services" },
                { label: "FAQs published", value: publishedFaqs, href: "/admin/faqs" },
                { label: "Legal pages published", value: `${legalPublished} of ${legalTotal}`, href: "/admin/legal" },
                { label: "Testimonials published", value: publishedTestimonials, href: "/admin/testimonials" },
              ].map((row) => (
                <Link
                  key={row.label}
                  href={row.href}
                  className="flex items-center justify-between rounded-lg border border-navy-100 px-4 py-3 text-[0.78rem] hover:bg-navy-50/60"
                >
                  <span className="text-navy-600">{row.label}</span>
                  <span className="flex items-center gap-2 font-semibold text-navy-900">
                    {row.value}
                    <ArrowRight className="h-3 w-3 text-navy-300" />
                  </span>
                </Link>
              ))}
            </div>
          )}
          <div className="mt-6 border-t border-navy-100 pt-4">
            <p className="text-[0.68rem] text-navy-400">
              Home page content last updated {formatDate(home.updatedAt, true)}. Changes are managed in{" "}
              <Link href="/admin/content/home" className="font-medium text-gold-700 hover:underline">
                Home page
              </Link>
              .
            </p>
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-xl border border-navy-100 bg-white p-6 shadow-sm">
            <h2 className="font-display text-xl font-semibold text-navy-950">Visitor analytics</h2>
            {seo?.gaMeasurementId ? (
              <>
                <p className="mt-2 text-[0.75rem] leading-6 text-navy-500">
                  Google Analytics is configured for this website. Visitor reporting is available in
                  your GA4 property.
                </p>
                <p className="mt-3 rounded-md bg-navy-50 px-3 py-2 font-mono text-[0.7rem] text-navy-700">
                  {seo.gaMeasurementId}
                </p>
                <a
                  href="https://analytics.google.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-[0.72rem] font-semibold text-gold-700 hover:underline"
                >
                  Open Google Analytics
                  <ExternalLink className="h-3 w-3" />
                </a>
              </>
            ) : (
              <>
                <p className="mt-2 text-[0.75rem] leading-6 text-navy-500">
                  No analytics integration is configured, so no visitor metrics are shown here. Add a
                  GA4 measurement ID in SEO settings to enable reporting.
                </p>
                <Link
                  href="/admin/seo"
                  className="mt-4 inline-flex items-center gap-1 text-[0.72rem] font-semibold text-gold-700 hover:underline"
                >
                  Configure analytics
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </>
            )}
          </section>

          {canViewConversations && (
            <section className="rounded-xl border border-navy-100 bg-white p-6 shadow-sm">
              <h2 className="font-display text-xl font-semibold text-navy-950">Chat assistant</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-navy-50 p-3">
                  <p className="font-display text-2xl text-navy-950">{conversationCount}</p>
                  <p className="mt-0.5 text-[0.62rem] uppercase tracking-wide text-navy-400">
                    Conversations
                  </p>
                </div>
                <div className="rounded-lg bg-gold-50 p-3">
                  <p className="font-display text-2xl text-gold-800">{leadCount}</p>
                  <p className="mt-0.5 text-[0.62rem] uppercase tracking-wide text-gold-700/70">
                    Captured leads
                  </p>
                </div>
              </div>
              <Link
                href="/admin/conversations"
                className="mt-4 inline-flex items-center gap-1 text-[0.72rem] font-semibold text-gold-700 hover:underline"
              >
                Review conversations
                <ArrowRight className="h-3 w-3" />
              </Link>
            </section>
          )}

          <section className="rounded-xl border border-navy-100 bg-white p-6 shadow-sm">
            <h2 className="font-display text-xl font-semibold text-navy-950">Content health</h2>
            <ul className="mt-4 space-y-2.5">
              {[
                {
                  label: "Home & About content",
                  state: "Managed",
                  href: "/admin/content/home",
                },
                {
                  label: "Legal policies",
                  state: `${legalPublished}/${legalTotal} live`,
                  href: "/admin/legal",
                },
                {
                  label: "Services",
                  state: `${publishedServices} live`,
                  href: "/admin/services",
                },
                {
                  label: "Testimonials",
                  state: `${publishedTestimonials} live`,
                  href: "/admin/testimonials",
                },
              ].map((row) => (
                <li key={row.label} className="flex items-center justify-between gap-3 text-[0.74rem]">
                  <Link href={row.href} className="text-navy-600 hover:text-navy-900">
                    {row.label}
                  </Link>
                  <span className="shrink-0 rounded-full bg-navy-50 px-2 py-0.5 text-[0.62rem] font-medium text-navy-500">
                    {row.state}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-navy-100 pt-3 text-[0.62rem] leading-5 text-navy-400">
              Legal drafts include placeholders and require legal review before reliance.
            </p>
          </section>
        </div>
      </div>

      {canViewEnquiries && (
        <section className="mt-6 rounded-xl border border-navy-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-navy-950">Recent enquiries</h2>
              <p className="mt-0.5 text-[0.7rem] text-navy-400">Latest contact form and chatbot enquiries</p>
            </div>
            <Link
              href="/admin/enquiries"
              className="inline-flex items-center gap-1 text-[0.72rem] font-semibold text-gold-700 hover:underline"
            >
              View all
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {recentEnquiries.length === 0 ? (
            <p className="px-6 py-10 text-center text-[0.8rem] text-navy-400">
              No enquiries yet. Once a visitor submits the contact form or chatbot enquiry, it will
              appear here.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="admin-table w-full">
                <thead>
                  <tr className="bg-navy-50/50">
                    <th>Name</th>
                    <th>Service</th>
                    <th>Source</th>
                    <th>Received</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEnquiries.map((enquiry) => (
                    <tr key={enquiry.id}>
                      <td>
                        <Link href={`/admin/enquiries/${enquiry.id}`} className="font-medium text-navy-900 hover:text-gold-700">
                          {enquiry.name}
                        </Link>
                        <p className="text-[0.68rem] text-navy-400">{enquiry.email || enquiry.phone}</p>
                      </td>
                      <td className="text-[0.75rem] text-navy-500">{enquiry.serviceName || "General"}</td>
                      <td className="text-[0.7rem] text-navy-400">{enquiry.source.replaceAll("_", " ")}</td>
                      <td className="whitespace-nowrap text-[0.72rem] text-navy-400">
                        {formatDate(enquiry.createdAt, true)}
                      </td>
                      <td>
                        <StatusBadge status={enquiry.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {canViewAppointments && recentAppointments.length > 0 && (
        <section className="mt-6 rounded-xl border border-navy-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4">
            <h2 className="font-display text-xl font-semibold text-navy-950">Recent appointment requests</h2>
            <Link href="/admin/appointments" className="text-[0.72rem] font-semibold text-gold-700 hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-navy-100">
            {recentAppointments.map((appointment) => (
              <Link
                key={appointment.id}
                href={`/admin/appointments/${appointment.id}`}
                className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 hover:bg-navy-50/40"
              >
                <div>
                  <p className="text-[0.8rem] font-medium text-navy-900">{appointment.name}</p>
                  <p className="text-[0.68rem] text-navy-400">
                    {formatDate(appointment.preferredDate)} · {appointment.preferredTime}
                  </p>
                </div>
                <StatusBadge status={appointment.status} />
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
