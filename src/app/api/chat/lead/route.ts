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
  const limit = rateLimit(`demo-chat-lead:${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 });
  if (!limit.success) {
    return jsonError("Too many demo submissions. Please try again a little later.", 429);
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

  return NextResponse.json(
    {
      ok: true,
      demo: true,
      message: `Demo only, ${data.name}. Your ${service ? `“${service.title}” ` : ""}enquiry passed validation, but nothing was stored, emailed or delivered.`,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
