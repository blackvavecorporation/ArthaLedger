import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, User, MessageCircle } from "lucide-react";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { deleteConversation } from "@/actions/inquiries";
import { FeedbackBanner, type AdminSearchParams } from "@/components/admin/feedback";
import { PageHeader } from "@/components/admin/page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ConversationDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<AdminSearchParams>;
}) {
  await requirePermission("conversations.read");
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const conversation = await db.chatConversation.findUnique({
    where: { id },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
      enquiries: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!conversation) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Chat transcript"
        title={conversation.visitorName || "Anonymous visitor"}
        description={`Started ${formatDate(conversation.createdAt, true)} · ${conversation.messages.length} messages · language ${conversation.language.toUpperCase()}`}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/conversations">
              <ArrowLeft className="h-3.5 w-3.5" />
              All conversations
            </Link>
          </Button>
        }
      />
      <FeedbackBanner params={query} />

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="overflow-hidden rounded-xl border border-navy-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-navy-100 bg-navy-50/40 px-5 py-3">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-navy-400">Transcript</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{conversation.mode}</Badge>
              {conversation.isLead && <Badge variant="gold">Lead</Badge>}
            </div>
          </div>
          <div className="max-h-[42rem] space-y-3 overflow-y-auto bg-ivory px-4 py-5">
            {conversation.messages.length === 0 ? (
              <p className="py-10 text-center text-[0.78rem] text-navy-400">No messages recorded.</p>
            ) : (
              conversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.sender === "VISITOR" ? "justify-end" : "justify-start",
                  )}
                >
                  {message.sender === "SYSTEM" ? (
                    <p className="mx-auto max-w-lg rounded-full bg-navy-100 px-3.5 py-1.5 text-center text-[0.62rem] leading-4 text-navy-500">
                      {message.content} · {formatDate(message.createdAt, true)}
                    </p>
                  ) : (
                    <div
                      className={cn(
                        "max-w-[82%] rounded-xl px-4 py-3 text-[0.8rem] leading-6 shadow-sm",
                        message.sender === "VISITOR"
                          ? "rounded-br-sm bg-navy-900 text-white"
                          : "rounded-bl-sm border border-navy-100 bg-white text-navy-700",
                      )}
                    >
                      <p className="whitespace-pre-line">{message.content}</p>
                      <p
                        className={cn(
                          "mt-1.5 text-[0.56rem]",
                          message.sender === "VISITOR" ? "text-white/35" : "text-navy-300",
                        )}
                      >
                        {message.sender === "VISITOR" ? "Visitor" : "Assistant"} · {formatDate(message.createdAt, true)}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-navy-100 bg-white p-5 shadow-sm">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-navy-400">Visitor details</p>
            <ul className="mt-4 space-y-3 text-[0.76rem] text-navy-600">
              <li className="flex items-start gap-2.5">
                <User className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600" />
                {conversation.visitorName || "Not provided"}
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600" />
                {conversation.visitorEmail || "Not provided"}
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600" />
                {conversation.visitorPhone || "Not provided"}
              </li>
              {conversation.serviceInterest && (
                <li className="rounded-md bg-navy-50 px-3 py-2 text-[0.72rem]">
                  Service interest: <span className="font-medium text-navy-800">{conversation.serviceInterest}</span>
                </li>
              )}
            </ul>
            {conversation.visitorPhone && (
              <a
                href={`https://wa.me/${conversation.visitorPhone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-[#128C4A] px-3 py-2 text-[0.7rem] font-semibold text-white hover:bg-[#0f7a40]"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp visitor
              </a>
            )}
          </div>

          {conversation.enquiries.length > 0 && (
            <div className="rounded-xl border border-navy-100 bg-white p-5 shadow-sm">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-navy-400">Linked enquiries</p>
              <ul className="mt-3 space-y-2">
                {conversation.enquiries.map((enquiry) => (
                  <li key={enquiry.id}>
                    <Link
                      href={`/admin/enquiries/${enquiry.id}`}
                      className="flex items-center justify-between rounded-md border border-navy-100 px-3 py-2.5 text-[0.72rem] hover:bg-navy-50"
                    >
                      <span className="text-navy-600">{formatDate(enquiry.createdAt, true)}</span>
                      <span className="font-medium text-gold-700">View enquiry →</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-xl border border-navy-100 bg-white p-5 shadow-sm">
            <p className="text-[0.7rem] font-semibold text-navy-800">Delete conversation</p>
            <p className="mt-1 text-[0.68rem] leading-5 text-navy-400">
              Removes the transcript and messages. Linked enquiries are retained but lose the
              conversation link.
            </p>
            <div className="mt-3">
              <DeleteButton
                action={deleteConversation}
                id={conversation.id}
                name={conversation.visitorName || "this conversation"}
                label="Delete conversation"
                title="Delete this conversation?"
                description="The full transcript and all messages will be permanently removed. This action is logged."
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
