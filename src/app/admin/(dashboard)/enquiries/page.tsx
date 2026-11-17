import Link from "next/link";
import type { ContactEnquiryWhereInput, EnquiryStatus } from "@/lib/demo-types";
import { Search } from "lucide-react";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { FeedbackBanner, type AdminSearchParams } from "@/components/admin/feedback";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUSES: EnquiryStatus[] = ["NEW", "IN_PROGRESS", "RESOLVED", "SPAM"];
const PAGE_SIZE = 20;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminEnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>;
}) {
  await requirePermission("enquiries.read");
  const params = await searchParams;
  const status = first(params.status);
  const q = first(params.q)?.trim() ?? "";
  const page = Math.max(1, Number(first(params.page) ?? "1") || 1);
  const activeStatus = STATUSES.includes(status as EnquiryStatus) ? (status as EnquiryStatus) : undefined;

  const where: ContactEnquiryWhereInput = {
    ...(activeStatus ? { status: activeStatus } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
            { message: { contains: q, mode: "insensitive" } },
            { serviceName: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [total, enquiries, grouped] = await Promise.all([
    db.contactEnquiry.count({ where }),
    db.contactEnquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        serviceName: true,
        source: true,
        status: true,
        createdAt: true,
        message: true,
      },
    }),
    db.contactEnquiry.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  const counts = Object.fromEntries(grouped.map((row) => [row.status, row._count._all])) as Record<string, number>;
  const grandTotal = grouped.reduce((sum, row) => sum + row._count._all, 0);
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function hrefWith(next: { status?: string; page?: number }) {
    const search = new URLSearchParams();
    const nextStatus = next.status ?? activeStatus;
    if (nextStatus) search.set("status", nextStatus);
    if (q) search.set("q", q);
    if (next.page && next.page > 1) search.set("page", String(next.page));
    const value = search.toString();
    return `/admin/enquiries${value ? `?${value}` : ""}`;
  }

  return (
    <>
      <PageHeader
        eyebrow="Client desk"
        title="Enquiries"
        description="A sample dataset for the admin demonstration. Status and internal notes can be changed in this session, but nothing is saved to a database."
      />
      <FeedbackBanner params={params} />

      <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex flex-wrap gap-2">
          <Link
            href={hrefWith({ status: "", page: 1 })}
            className={`rounded-full border px-3.5 py-1.5 text-[0.7rem] font-medium ${
              !activeStatus ? "border-navy-900 bg-navy-900 text-white" : "border-navy-200 bg-white text-navy-500 hover:border-navy-300"
            }`}
          >
            All <span className="ml-1 opacity-60">{grandTotal}</span>
          </Link>
          {STATUSES.map((option) => (
            <Link
              key={option}
              href={hrefWith({ status: option, page: 1 })}
              className={`rounded-full border px-3.5 py-1.5 text-[0.7rem] font-medium ${
                activeStatus === option
                  ? "border-navy-900 bg-navy-900 text-white"
                  : "border-navy-200 bg-white text-navy-500 hover:border-navy-300"
              }`}
            >
              {option.replaceAll("_", " ")} <span className="ml-1 opacity-60">{counts[option] ?? 0}</span>
            </Link>
          ))}
        </div>
        <form action="/admin/enquiries" method="get" className="flex items-center gap-2">
          {activeStatus && <input type="hidden" name="status" value={activeStatus} />}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-navy-300" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Search name, email, message…"
              className="h-9 w-full rounded-md border border-navy-200 bg-white pl-8 pr-3 text-[0.75rem] text-navy-800 focus:border-gold-500 focus:outline-none sm:w-64"
            />
          </div>
          <Button type="submit" variant="outline" size="sm">
            Search
          </Button>
        </form>
      </div>

      {enquiries.length === 0 ? (
        <EmptyState
          title={q || activeStatus ? "No matching enquiries" : "No enquiries yet"}
          description={
            q || activeStatus
              ? "Try clearing the filters or searching for different details."
              : "When a visitor sends a message through the contact form or chatbot, it will appear here."
          }
          action={
            q || activeStatus ? (
              <Button asChild variant="outline">
                <Link href="/admin/enquiries">Clear filters</Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-navy-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="admin-table w-full">
                <thead>
                  <tr className="bg-navy-50/50">
                    <th>Contact</th>
                    <th>Service</th>
                    <th>Message</th>
                    <th>Source</th>
                    <th>Received</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map((enquiry) => (
                    <tr key={enquiry.id}>
                      <td>
                        <Link href={`/admin/enquiries/${enquiry.id}`} className="font-medium text-navy-900 hover:text-gold-700">
                          {enquiry.name}
                        </Link>
                        <p className="text-[0.66rem] text-navy-400">{enquiry.email}</p>
                        <p className="text-[0.66rem] text-navy-400">{enquiry.phone}</p>
                      </td>
                      <td className="text-[0.72rem] text-navy-500">{enquiry.serviceName || "General enquiry"}</td>
                      <td className="max-w-[16rem]">
                        <p className="line-clamp-2 text-[0.72rem] leading-5 text-navy-500">{enquiry.message}</p>
                      </td>
                      <td className="whitespace-nowrap text-[0.66rem] text-navy-400">
                        {enquiry.source === "CHATBOT" ? "Chatbot" : enquiry.source === "CONTACT_FORM" ? "Contact form" : enquiry.source}
                      </td>
                      <td className="whitespace-nowrap text-[0.7rem] text-navy-400">{formatDate(enquiry.createdAt, true)}</td>
                      <td><StatusBadge status={enquiry.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-[0.7rem] text-navy-400">
            <p>
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
            </p>
            <div className="flex gap-2">
              {page > 1 ? (
                <Button asChild variant="outline" size="sm">
                  <Link href={hrefWith({ page: page - 1 })}>Previous</Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>Previous</Button>
              )}
              {page < pageCount ? (
                <Button asChild variant="outline" size="sm">
                  <Link href={hrefWith({ page: page + 1 })}>Next</Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>Next</Button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
