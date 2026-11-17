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
  const limit = rateLimit(`demo-chat-appointment:${ip}`, {
    limit: 4,
    windowMs: 10 * 60 * 1000,
  });
  if (!limit.success) {
    return jsonError("Too many demo requests. Please try again later.", 429);
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
  const [year, month, day] = data.preferredDate.split("-").map(Number);
  const preferredDate = new Date(Date.UTC(year, month - 1, day));
  if (
    Number.isNaN(preferredDate.getTime()) ||
    preferredDate.getUTCFullYear() !== year ||
    preferredDate.getUTCMonth() !== month - 1 ||
    preferredDate.getUTCDate() !== day
  ) {
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

  return NextResponse.json(
    {
      ok: true,
      demo: true,
      message: `Demo only, ${data.name}. Your ${service ? `“${service.title}” ` : ""}consultation preference for ${new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(preferredDate)} passed validation, but nothing was stored or scheduled.`,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
