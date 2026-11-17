import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isSameOrigin, jsonError, requestIp } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";
import { chatLeadSchema, fieldErrors } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return jsonError("Invalid request origin.", 403);

  const ip = requestIp(request);
  const limit = rateLimit(`chat-lead:${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 });
  if (!limit.success) {
    return jsonError("Too many enquiries. Please try again a little later.", 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid request body.");
  }

  const parsed = chatLeadSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Please check your details.", 422, {
      fields: fieldErrors(parsed.error),
    });
  }

  const data = parsed.data;
  const service = data.serviceId
    ? await db.service.findFirst({
        where: { id: data.serviceId, status: "PUBLISHED" },
        select: { id: true, title: true },
      })
    : null;

  try {
    const conversation = await db.chatConversation.upsert({
      where: { sessionId: data.sessionId },
      create: {
        sessionId: data.sessionId,
        summary: data.message?.slice(0, 180) || `Chat enquiry from ${data.name}`,
        visitorName: data.name,
        visitorEmail: data.email,
        visitorPhone: data.phone,
        serviceInterest: service?.title ?? null,
        isLead: true,
      },
      update: {
        visitorName: data.name,
        visitorEmail: data.email,
        visitorPhone: data.phone,
        serviceInterest: service?.title ?? null,
        isLead: true,
      },
    });

    const recent = await db.contactEnquiry.findFirst({
      where: {
        conversationId: conversation.id,
        createdAt: { gte: new Date(Date.now() - 5 * 60 * 1000) },
      },
      select: { id: true },
    });

    if (!recent) {
      await db.contactEnquiry.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          serviceId: service?.id ?? null,
          serviceName: service?.title ?? null,
          message: data.message || `Chatbot enquiry from ${data.name}.`,
          source: "CHATBOT",
          status: "NEW",
          ipAddress: ip,
          conversationId: conversation.id,
        },
      });
      await db.chatMessage.create({
        data: {
          conversationId: conversation.id,
          sender: "SYSTEM",
          content: `Enquiry submitted from chat — ${data.name}, ${data.phone}, ${data.email}${service ? `, service: ${service.title}` : ""}.`,
        },
      });
    }

    return NextResponse.json(
      {
        ok: true,
        message: `Thank you, ${data.name}. Your enquiry has been received. Our team will review it and respond using the contact details provided.`,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Chat lead failed", error);
    return jsonError("We could not save your enquiry. Please use the contact form or call the office.", 500);
  }
}
