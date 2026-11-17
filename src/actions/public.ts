"use server";

import { db } from "@/lib/db";
import { audit, getClientIp, getRequestContext } from "@/lib/auth";
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
  const context = await getRequestContext();

  const limit = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 });
  if (!limit.success) {
    return {
      status: "error",
      message: `Too many enquiries from this connection. Please try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minute(s).`,
    };
  }

  // Honeypot: bots that fill hidden fields get a generic success without a record.
  if (String(formData.get("website") ?? "").length > 0) {
    return { status: "success", message: "Thank you. Our team will review your enquiry." };
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

  const data = parsed.data;
  let serviceId: string | null = null;
  let serviceName: string | null = null;
  if (data.serviceId) {
    const service = await db.service.findFirst({
      where: { id: data.serviceId, status: "PUBLISHED" },
      select: { id: true, title: true },
    });
    if (service) {
      serviceId = service.id;
      serviceName = service.title;
    }
  }

  try {
    const enquiry = await db.contactEnquiry.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        serviceId,
        serviceName,
        message: data.message,
        status: "NEW",
        source: "CONTACT_FORM",
        ipAddress: context.ip,
        userAgent: context.userAgent,
      },
    });
    await audit({
      action: "enquiry.received",
      entity: "ContactEnquiry",
      entityId: enquiry.id,
      details: { source: "CONTACT_FORM", service: serviceName },
      ipAddress: ip,
    });
  } catch (error) {
    console.error("Contact enquiry failed", error);
    return {
      status: "error",
      message: "We could not save your enquiry. Please try again or contact the office directly.",
    };
  }

  return {
    status: "success",
    message:
      "Thank you — your enquiry has been received. Our team will review it and respond using the contact details you provided.",
  };
}
