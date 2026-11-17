"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { audit, requirePermission } from "@/lib/auth";
import {
  appointmentUpdateSchema,
  enquiryUpdateSchema,
  faqSchema,
  formValue,
  isChecked,
  testimonialSchema,
} from "@/lib/admin-schemas";

function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function refreshSite() {
  revalidatePath("/", "layout");
}

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

export async function saveTestimonial(formData: FormData) {
  const user = await requirePermission("testimonials.write");
  const id = formValue(formData, "id");
  const path = id ? `/admin/testimonials/${id}` : "/admin/testimonials/new";
  const parsed = testimonialSchema.safeParse({
    clientName: formValue(formData, "clientName"),
    designation: formValue(formData, "designation"),
    company: formValue(formData, "company"),
    review: formValue(formData, "review"),
    rating: formValue(formData, "rating"),
    imageUrl: formValue(formData, "imageUrl"),
    isApproved: isChecked(formData, "isApproved"),
    isPublished: isChecked(formData, "isPublished"),
    order: formValue(formData, "order"),
  });
  if (!parsed.success) return fail(path, parsed.error.issues[0]?.message ?? "Invalid testimonial.");

  if (id) await db.testimonial.update({ where: { id }, data: parsed.data });
  else await db.testimonial.create({ data: parsed.data });

  await audit({
    userId: user.id,
    action: id ? "testimonial.updated" : "testimonial.created",
    entity: "Testimonial",
    entityId: id || null,
    details: { approved: parsed.data.isApproved, published: parsed.data.isPublished },
  });
  refreshSite();
  redirect("/admin/testimonials?saved=1");
}

export async function deleteTestimonial(formData: FormData) {
  const user = await requirePermission("testimonials.write");
  const id = formValue(formData, "id");
  if (!id) fail("/admin/testimonials", "Missing testimonial reference.");
  await db.testimonial.delete({ where: { id } });
  await audit({ userId: user.id, action: "testimonial.deleted", entity: "Testimonial", entityId: id });
  refreshSite();
  redirect("/admin/testimonials?deleted=1");
}

export async function setTestimonialStatus(formData: FormData) {
  const user = await requirePermission("testimonials.write");
  const id = formValue(formData, "id");
  const field = formValue(formData, "field");
  const value = formValue(formData, "value") === "true";
  if (!id || !["approve", "publish"].includes(field)) {
    fail("/admin/testimonials", "Invalid status update.");
  }

  if (field === "approve") {
    const testimonial = await db.testimonial.findUnique({ where: { id } });
    if (!testimonial) fail("/admin/testimonials", "Testimonial not found.");
    await db.testimonial.update({
      where: { id },
      data: value ? { isApproved: true } : { isApproved: false, isPublished: false },
    });
  } else {
    if (value) {
      const testimonial = await db.testimonial.findUnique({ where: { id } });
      if (!testimonial?.isApproved) {
        fail("/admin/testimonials", "Approve the testimonial before publishing it.");
      }
    }
    await db.testimonial.update({ where: { id }, data: { isPublished: value } });
  }

  await audit({
    userId: user.id,
    action: `testimonial.${field}${value ? "ed" : "_unset"}`,
    entity: "Testimonial",
    entityId: id,
    details: { value },
  });
  refreshSite();
  return redirect("/admin/testimonials?saved=1");
}

// ---------------------------------------------------------------------------
// FAQs
// ---------------------------------------------------------------------------

export async function saveFaq(formData: FormData) {
  const user = await requirePermission("faqs.write");
  const id = formValue(formData, "id");
  const path = id ? `/admin/faqs/${id}` : "/admin/faqs/new";
  const parsed = faqSchema.safeParse({
    question: formValue(formData, "question"),
    answer: formValue(formData, "answer"),
    questionTe: formValue(formData, "questionTe"),
    answerTe: formValue(formData, "answerTe"),
    category: formValue(formData, "category"),
    order: formValue(formData, "order"),
  });
  if (!parsed.success) return fail(path, parsed.error.issues[0]?.message ?? "Invalid FAQ.");

  const data = { ...parsed.data, isPublished: isChecked(formData, "isPublished") };
  if (id) await db.fAQ.update({ where: { id }, data });
  else await db.fAQ.create({ data });

  await audit({
    userId: user.id,
    action: id ? "faq.updated" : "faq.created",
    entity: "FAQ",
    entityId: id || null,
    details: { published: data.isPublished },
  });
  refreshSite();
  redirect("/admin/faqs?saved=1");
}

export async function deleteFaq(formData: FormData) {
  const user = await requirePermission("faqs.write");
  const id = formValue(formData, "id");
  if (!id) fail("/admin/faqs", "Missing FAQ reference.");
  await db.fAQ.delete({ where: { id } });
  await audit({ userId: user.id, action: "faq.deleted", entity: "FAQ", entityId: id });
  refreshSite();
  redirect("/admin/faqs?deleted=1");
}

// ---------------------------------------------------------------------------
// Enquiries
// ---------------------------------------------------------------------------

export async function updateEnquiry(formData: FormData) {
  const user = await requirePermission("enquiries.write");
  const id = formValue(formData, "id");
  if (!id) fail("/admin/enquiries", "Missing enquiry reference.");
  const parsed = enquiryUpdateSchema.safeParse({
    status: formValue(formData, "status"),
    adminNote: formValue(formData, "adminNote"),
  });
  if (!parsed.success) return fail(`/admin/enquiries/${id}`, parsed.error.issues[0]?.message ?? "Invalid update.");

  await db.contactEnquiry.update({ where: { id }, data: parsed.data });
  await audit({
    userId: user.id,
    action: "enquiry.updated",
    entity: "ContactEnquiry",
    entityId: id,
    details: { status: parsed.data.status },
  });
  redirect(`/admin/enquiries/${id}?saved=1`);
}

export async function deleteEnquiry(formData: FormData) {
  const user = await requirePermission("enquiries.write");
  const id = formValue(formData, "id");
  if (!id) fail("/admin/enquiries", "Missing enquiry reference.");
  const enquiry = await db.contactEnquiry.findUnique({ where: { id }, select: { name: true } });
  await db.contactEnquiry.delete({ where: { id } });
  await audit({
    userId: user.id,
    action: "enquiry.deleted",
    entity: "ContactEnquiry",
    entityId: id,
    details: { name: enquiry?.name },
  });
  redirect("/admin/enquiries?deleted=1");
}

// ---------------------------------------------------------------------------
// Appointments
// ---------------------------------------------------------------------------

export async function updateAppointment(formData: FormData) {
  const user = await requirePermission("appointments.write");
  const id = formValue(formData, "id");
  if (!id) fail("/admin/appointments", "Missing appointment reference.");
  const parsed = appointmentUpdateSchema.safeParse({
    status: formValue(formData, "status"),
    adminNote: formValue(formData, "adminNote"),
  });
  if (!parsed.success) return fail(`/admin/appointments/${id}`, parsed.error.issues[0]?.message ?? "Invalid update.");

  await db.appointmentRequest.update({ where: { id }, data: parsed.data });
  await audit({
    userId: user.id,
    action: "appointment.updated",
    entity: "AppointmentRequest",
    entityId: id,
    details: { status: parsed.data.status },
  });
  redirect(`/admin/appointments/${id}?saved=1`);
}

export async function deleteAppointment(formData: FormData) {
  const user = await requirePermission("appointments.write");
  const id = formValue(formData, "id");
  if (!id) fail("/admin/appointments", "Missing appointment reference.");
  await db.appointmentRequest.delete({ where: { id } });
  await audit({ userId: user.id, action: "appointment.deleted", entity: "AppointmentRequest", entityId: id });
  redirect("/admin/appointments?deleted=1");
}

// ---------------------------------------------------------------------------
// Chat conversations
// ---------------------------------------------------------------------------

export async function deleteConversation(formData: FormData) {
  const user = await requirePermission("conversations.write");
  const id = formValue(formData, "id");
  if (!id) fail("/admin/conversations", "Missing conversation reference.");
  await db.chatConversation.delete({ where: { id } });
  await audit({ userId: user.id, action: "conversation.deleted", entity: "ChatConversation", entityId: id });
  redirect("/admin/conversations?deleted=1");
}
