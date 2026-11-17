import Link from "next/link";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { FeedbackBanner, type AdminSearchParams } from "@/components/admin/feedback";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminConversationsPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>;
}) {
  await requirePermission("conversations.read");
  const params = await searchParams;
  const [conversations, total, leads] = await Promise.all([
    db.chatConversation.findMany({
      orderBy: { updatedAt: "desc" },
      take: 100,
      include: { _count: { select: { messages: true, enquiries: true } } },
    }),
    db.chatConversation.count(),
    db.chatConversation.count({ where: { isLead: true } }),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Client desk"
        title="Chat conversations"
        description={`${total} conversation${total === 1 ? "" : "s"} recorded by the website assistant, including ${leads} captured lead${leads === 1 ? "" : "s"}. Transcripts are stored to support follow-up.`}
      />
      <FeedbackBanner params={params} />

      {conversations.length === 0 ? (
        <EmptyState
          title="No chat conversations yet"
          description="Once a visitor uses the website assistant, the transcript and any captured enquiry details will appear here."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-navy-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="admin-table w-full">
              <thead>
                <tr className="bg-navy-50/50">
                  <th>Visitor</th>
                  <th>Language</th>
                  <th>Mode</th>
                  <th>Messages</th>
                  <th>Lead</th>
                  <th>Last activity</th>
                </tr>
              </thead>
              <tbody>
                {conversations.map((conversation) => (
                  <tr key={conversation.id}>
                    <td>
                      <Link
                        href={`/admin/conversations/${conversation.id}`}
                        className="font-medium text-navy-900 hover:text-gold-700"
                      >
                        {conversation.visitorName || "Anonymous visitor"}
                      </Link>
                      <p className="text-[0.66rem] text-navy-400">
                        {conversation.visitorPhone || conversation.visitorEmail || conversation.sessionId.slice(0, 18) + "…"}
                      </p>
                    </td>
                    <td className="text-[0.7rem] uppercase text-navy-400">{conversation.language}</td>
                    <td className="text-[0.7rem] text-navy-500">{conversation.mode}</td>
                    <td className="text-[0.72rem] text-navy-500">{conversation._count.messages}</td>
                    <td>
                      {conversation.isLead ? (
                        <Badge variant="gold">Lead · {conversation._count.enquiries} enq.</Badge>
                      ) : (
                        <Badge variant="muted">No</Badge>
                      )}
                    </td>
                    <td className="whitespace-nowrap text-[0.68rem] text-navy-400">
                      {formatDate(conversation.updatedAt, true)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="mt-4 text-[0.65rem] leading-5 text-navy-400">
        Conversations may contain personal information. Access is restricted to authorised admin
        users and deletions are recorded in the audit log.
      </p>
    </>
  );
}
