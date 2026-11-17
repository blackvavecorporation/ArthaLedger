import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isSameOrigin, jsonError, requestIp } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";
import { appointmentSchema, fieldErrors } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return jsonError("Invalid request origin.", 403);

  const ip = requestIp(request);
  const limit = rateLimit(`chat-appointment:${ip}`, { limit: 4, windowMs: 10 * 60 * 1000 });
  if (!limit.success) {
    return jsonError("Too many appointment requests. Please try again later.", 429);
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonError("Invalid request body.");
  }

  const parsed = appointmentSchema.safeParse({
    name: body.name,
    email: body.email,
    phone: body.phone,
    serviceId: body.serviceId || undefined,
    preferredDate: body.preferredDate,
    preferredTime: body.preferredTime,
    mode: body.mode,
    notes: body.notes || undefined,
    consent: body.consent === true,
    website: "",
  });

  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Please check your details.", 422, {
      fields: fieldErrors(parsed.error),
    });
  }

  const data = parsed.data;
  const preferredDate = new Date(`${data.preferredDate}T00:00:00+05:30`);
  if (Number.isNaN(preferredDate.getTime())) {
    return jsonError("Please choose a valid preferred date.");
  }
  const todayIst = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  if (data.preferredDate < todayIst) {
    return jsonError("Please choose a date that is today or later.");
  }

  const service = data.serviceId
    ? await db.service.findFirst({
        where: { id: data.serviceId, status: "PUBLISHED" },
        select: { id: true, title: true },
      })
    : null;

  const sessionId = String(body.sessionId ?? "");
  if (sessionId.length < 8) return jsonError("Invalid chat session.");

  try {
    const conversation = await db.chatConversation.upsert({
      where: { sessionId },
      create: {
        sessionId,
        visitorName: data.name,
        visitorEmail: data.email,
        visitorPhone: data.phone,
        serviceInterest: service?.title ?? null,
        isLead: true,
        summary: `Consultation request for ${data.preferredDate}`,
      },
      update: {
        visitorName: data.name,
        visitorEmail: data.email,
        visitorPhone: data.phone,
        serviceInterest: service?.title ?? null,
        isLead: true,
      },
    });

    await db.appointmentRequest.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        serviceId: service?.id ?? null,
        serviceName: service?.title ?? null,
        preferredDate,
        preferredTime: data.preferredTime,
        mode: data.mode,
        notes: data.notes ?? null,
        status: "PENDING",
      },
    });

    await db.chatMessage.create({
      data: {
        conversationId: conversation.id,
        sender: "SYSTEM",
        content: `Consultation requested — ${new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(preferredDate)} at ${data.preferredTime} (${data.mode}).`,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        message: `Thank you, ${data.name}. Your consultation request for ${new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" }).format(preferredDate)} has been received. Our team will confirm availability using the contact details provided.`,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Chat appointment failed", error);
    return jsonError("We could not save your request. Please use the contact form or call the office.", 500);
  }
}
