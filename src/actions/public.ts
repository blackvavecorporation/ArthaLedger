"use server";

import { db } from "@/lib/db";
import { getClientIp } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { contactSchema, fieldErrors } from "@/lib/validation";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
};

export async function submitContact(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const ip = await getClientIp();
  const limit = rateLimit(`demo-contact:${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 });
  if (!limit.success) {
    return {
      status: "error",
      message: `Too many demo submissions from this connection. Please try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minute(s).`,
    };
  }

  if (String(formData.get("website") ?? "").length > 0) {
    return { status: "success", message: "Demo submission received. Nothing was stored or sent." };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    serviceId: formData.get("serviceId") || undefined,
    message: formData.get("message"),
    consent: formData.get("consent") === "on" || formData.get("consent") === "true",
    website: "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please check the highlighted fields and try again.",
      errors: fieldErrors(parsed.error),
    };
  }

  let serviceName: string | null = null;
  if (parsed.data.serviceId) {
    const service = await db.service.findFirst({
      where: { id: parsed.data.serviceId, status: "PUBLISHED" },
      select: { title: true },
    });
    serviceName = service?.title ?? null;
  }

  return {
    status: "success",
    message: `Demo only: your ${serviceName ? `“${serviceName}” ` : ""}enquiry passed validation, but it was not stored, emailed or added to a database.`,
  };
}
