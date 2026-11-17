import Link from "next/link";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { FeedbackBanner, type AdminSearchParams } from "@/components/admin/feedback";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 50;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>;
}) {
  await requirePermission("audit.read");
  const params = await searchParams;
  const page = Math.max(1, Number(first(params.page) ?? "1") || 1);
  const [logs, total] = await Promise.all([
    db.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { user: { select: { name: true, email: true } } },
    }),
    db.auditLog.count(),
  ]);
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <PageHeader
        eyebrow="Security"
        title="Audit logs"
        description="A chronological record of important admin actions, including sign-ins, content changes, publishing, enquiries and deletions."
      />
      <FeedbackBanner params={params} />

      {logs.length === 0 ? (
        <EmptyState title="No audit events" description="Admin activity will be recorded here as it occurs." />
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-navy-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="admin-table w-full">
                <thead>
                  <tr className="bg-navy-50/50">
                    <th>When</th>
                    <th>Action</th>
                    <th>Entity</th>
                    <th>User</th>
                    <th>IP</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td className="whitespace-nowrap text-[0.68rem] text-navy-400">
                        {formatDate(log.createdAt, true)}
                      </td>
                      <td>
                        <span className="rounded bg-navy-50 px-2 py-1 font-mono text-[0.65rem] text-navy-700">
                          {log.action}
                        </span>
                      </td>
                      <td className="text-[0.7rem] text-navy-500">
                        {log.entity}
                        {log.entityId && <span className="block truncate font-mono text-[0.58rem] text-navy-300">{log.entityId}</span>}
                      </td>
                      <td className="text-[0.7rem] text-navy-600">
                        {log.user?.name || "System / public"}
                        {log.user?.email && <span className="block text-[0.6rem] text-navy-400">{log.user.email}</span>}
                      </td>
                      <td className="font-mono text-[0.62rem] text-navy-400">{log.ipAddress || "—"}</td>
                      <td>
                        {log.details ? (
                          <details className="text-[0.65rem] text-navy-400">
                            <summary className="cursor-pointer hover:text-navy-700">View</summary>
                            <pre className="mt-1 max-w-[18rem] overflow-x-auto rounded bg-navy-50 p-2 text-[0.6rem] leading-4 text-navy-600">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </details>
                        ) : (
                          <span className="text-[0.65rem] text-navy-300">—</span>
                        )}
                      </td>
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
                  <Link href={`/admin/audit-logs?page=${page - 1}`}>Previous</Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>Previous</Button>
              )}
              {page < pageCount ? (
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/audit-logs?page=${page + 1}`}>Next</Link>
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
