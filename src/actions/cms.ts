"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { audit, requirePermission } from "@/lib/auth";
import {
  aboutSchema,
  brandingSchema,
  contactSettingsSchema,
  footerSettingsSchema,
  formValue,
  homeSchema,
  isChecked,
  legalSchema,
  messagingSettingsSchema,
  seoSchema,
  formLines,
} from "@/lib/admin-schemas";

function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function success(path: string): never {
  redirect(`${path}?saved=1`);
}

function refreshSite() {
  revalidatePath("/", "layout");
}

export async function saveHomeContent(formData: FormData) {
  const user = await requirePermission("content.write");
  const parsed = homeSchema.safeParse({
    heroEyebrow: formValue(formData, "heroEyebrow"),
    heroTitle: formValue(formData, "heroTitle"),
    heroTitleAccent: formValue(formData, "heroTitleAccent"),
    heroDescription: formValue(formData, "heroDescription"),
    primaryCtaLabel: formValue(formData, "primaryCtaLabel"),
    primaryCtaHref: formValue(formData, "primaryCtaHref"),
    secondaryCtaLabel: formValue(formData, "secondaryCtaLabel"),
    secondaryCtaHref: formValue(formData, "secondaryCtaHref"),
    heroTrustLine: formValue(formData, "heroTrustLine"),
    heroCardTitle: formValue(formData, "heroCardTitle"),
    heroCardSubtitle: formValue(formData, "heroCardSubtitle"),
    servicesEyebrow: formValue(formData, "servicesEyebrow"),
    servicesTitle: formValue(formData, "servicesTitle"),
    servicesDescription: formValue(formData, "servicesDescription"),
    whyEyebrow: formValue(formData, "whyEyebrow"),
    whyTitle: formValue(formData, "whyTitle"),
    whyDescription: formValue(formData, "whyDescription"),
    expertiseEyebrow: formValue(formData, "expertiseEyebrow"),
    expertiseTitle: formValue(formData, "expertiseTitle"),
    expertiseDescription: formValue(formData, "expertiseDescription"),
    testimonialsEyebrow: formValue(formData, "testimonialsEyebrow"),
    testimonialsTitle: formValue(formData, "testimonialsTitle"),
    testimonialsDescription: formValue(formData, "testimonialsDescription"),
    faqEyebrow: formValue(formData, "faqEyebrow"),
    faqTitle: formValue(formData, "faqTitle"),
    faqDescription: formValue(formData, "faqDescription"),
    ctaEyebrow: formValue(formData, "ctaEyebrow"),
    ctaTitle: formValue(formData, "ctaTitle"),
    ctaDescription: formValue(formData, "ctaDescription"),
    ctaButtonLabel: formValue(formData, "ctaButtonLabel"),
    ctaButtonHref: formValue(formData, "ctaButtonHref"),
  });
  if (!parsed.success) return fail("/admin/content/home", parsed.error.issues[0]?.message ?? "Invalid content.");

  await db.homePageContent.upsert({
    where: { id: "main" },
    update: parsed.data,
    create: { id: "main", ...parsed.data },
  });
  await audit({ userId: user.id, action: "content.home.updated", entity: "HomePageContent", entityId: "main" });
  refreshSite();
  success("/admin/content/home");
}

export async function saveAboutContent(formData: FormData) {
  const user = await requirePermission("content.write");
  const parsed = aboutSchema.safeParse({
    eyebrow: formValue(formData, "eyebrow"),
    title: formValue(formData, "title"),
    introduction: formValue(formData, "introduction"),
    story: formValue(formData, "story"),
    vision: formValue(formData, "vision"),
    mission: formValue(formData, "mission"),
    valuesTitle: formValue(formData, "valuesTitle"),
    teamTitle: formValue(formData, "teamTitle"),
    teamDescription: formValue(formData, "teamDescription"),
    whyTitle: formValue(formData, "whyTitle"),
    whyDescription: formValue(formData, "whyDescription"),
    imageUrl: formValue(formData, "imageUrl"),
  });
  if (!parsed.success) return fail("/admin/content/about", parsed.error.issues[0]?.message ?? "Invalid content.");

  await db.aboutPageContent.upsert({
    where: { id: "main" },
    update: parsed.data,
    create: { id: "main", ...parsed.data },
  });
  await audit({ userId: user.id, action: "content.about.updated", entity: "AboutPageContent", entityId: "main" });
  refreshSite();
  success("/admin/content/about");
}

export async function saveBranding(formData: FormData) {
  const user = await requirePermission("settings.write");
  const parsed = brandingSchema.safeParse({
    brandName: formValue(formData, "brandName"),
    legalName: formValue(formData, "legalName"),
    tagline: formValue(formData, "tagline"),
    logoUrl: formValue(formData, "logoUrl"),
    faviconUrl: formValue(formData, "faviconUrl"),
  });
  if (!parsed.success) return fail("/admin/content/branding", parsed.error.issues[0]?.message ?? "Invalid branding.");

  await db.websiteSettings.upsert({
    where: { id: "main" },
    update: parsed.data,
    create: { id: "main", ...parsed.data },
  });
  await audit({ userId: user.id, action: "settings.branding.updated", entity: "WebsiteSettings", entityId: "main" });
  refreshSite();
  success("/admin/content/branding");
}

export async function saveContactSettings(formData: FormData) {
  const user = await requirePermission("settings.write");
  const parsed = contactSettingsSchema.safeParse({
    primaryPhone: formValue(formData, "primaryPhone"),
    secondaryPhone: formValue(formData, "secondaryPhone"),
    businessEmail: formValue(formData, "businessEmail"),
    officeAddress: formValue(formData, "officeAddress"),
    googleMapsEmbedUrl: formValue(formData, "googleMapsEmbedUrl"),
    workingHours: formValue(formData, "workingHours"),
  });
  if (!parsed.success) return fail("/admin/content/contact", parsed.error.issues[0]?.message ?? "Invalid contact details.");

  const data = { ...parsed.data, secondaryPhone: parsed.data.secondaryPhone || null };
  await db.websiteSettings.upsert({
    where: { id: "main" },
    update: data,
    create: { id: "main", ...data },
  });
  await audit({ userId: user.id, action: "settings.contact.updated", entity: "WebsiteSettings", entityId: "main" });
  refreshSite();
  success("/admin/content/contact");
}

export async function saveFooterSettings(formData: FormData) {
  const user = await requirePermission("settings.write");
  const parsed = footerSettingsSchema.safeParse({
    footerAbout: formValue(formData, "footerAbout"),
    footerCopyright: formValue(formData, "footerCopyright"),
  });
  if (!parsed.success) return fail("/admin/content/footer", parsed.error.issues[0]?.message ?? "Invalid footer content.");

  await db.websiteSettings.upsert({
    where: { id: "main" },
    update: parsed.data,
    create: { id: "main", ...parsed.data },
  });
  await audit({ userId: user.id, action: "settings.footer.updated", entity: "WebsiteSettings", entityId: "main" });
  refreshSite();
  success("/admin/content/footer");
}

export async function saveMessagingSettings(formData: FormData) {
  const user = await requirePermission("settings.write");
  const parsed = messagingSettingsSchema.safeParse({
    whatsappNumber: formValue(formData, "whatsappNumber"),
    whatsappMessage: formValue(formData, "whatsappMessage"),
    whatsappWelcomeMessage: formValue(formData, "whatsappWelcomeMessage"),
    chatbotMode: formValue(formData, "chatbotMode"),
    chatbotWelcomeEn: formValue(formData, "chatbotWelcomeEn"),
    chatbotWelcomeTe: formValue(formData, "chatbotWelcomeTe"),
    chatbotSystemPrompt: formValue(formData, "chatbotSystemPrompt"),
    chatbotModel: formValue(formData, "chatbotModel"),
  });
  if (!parsed.success) return fail("/admin/content/contact", parsed.error.issues[0]?.message ?? "Invalid messaging settings.");

  const data = {
    ...parsed.data,
    whatsappEnabled: isChecked(formData, "whatsappEnabled"),
    chatbotEnabled: isChecked(formData, "chatbotEnabled"),
  };
  await db.websiteSettings.upsert({
    where: { id: "main" },
    update: data,
    create: { id: "main", ...data },
  });
  await audit({ userId: user.id, action: "settings.messaging.updated", entity: "WebsiteSettings", entityId: "main" });
  refreshSite();
  success("/admin/content/contact");
}

export async function saveSeoSettings(formData: FormData) {
  const user = await requirePermission("seo.write");
  const parsed = seoSchema.safeParse({
    siteTitle: formValue(formData, "siteTitle"),
    titleTemplate: formValue(formData, "titleTemplate"),
    description: formValue(formData, "description"),
    keywords: formLines(formData, "keywords"),
    ogImageUrl: formValue(formData, "ogImageUrl"),
    canonicalBase: formValue(formData, "canonicalBase"),
    twitterHandle: formValue(formData, "twitterHandle"),
    gaMeasurementId: formValue(formData, "gaMeasurementId"),
  });
  if (!parsed.success) return fail("/admin/seo", parsed.error.issues[0]?.message ?? "Invalid SEO settings.");

  await db.sEOSettings.upsert({
    where: { id: "main" },
    update: parsed.data,
    create: { id: "main", ...parsed.data },
  });
  await audit({ userId: user.id, action: "settings.seo.updated", entity: "SEOSettings", entityId: "main" });
  refreshSite();
  success("/admin/seo");
}

export async function saveLegalPage(formData: FormData) {
  const user = await requirePermission("legal.write");
  const id = formValue(formData, "id");
  if (!id) return fail("/admin/legal", "Missing legal page reference.");

  const parsed = legalSchema.safeParse({
    title: formValue(formData, "title"),
    content: formValue(formData, "content"),
    status: formValue(formData, "status"),
    seoTitle: formValue(formData, "seoTitle"),
    seoDescription: formValue(formData, "seoDescription"),
  });
  if (!parsed.success) return fail(`/admin/legal/${id}`, parsed.error.issues[0]?.message ?? "Invalid legal page.");

  const existing = await db.legalPage.findUnique({ where: { id } });
  if (!existing) return fail("/admin/legal", "Legal page not found.");

  await db.legalPage.update({ where: { id }, data: parsed.data });
  await audit({
    userId: user.id,
    action: "content.legal.updated",
    entity: "LegalPage",
    entityId: id,
    details: { slug: existing.slug, status: parsed.data.status },
  });
  refreshSite();
  success(`/admin/legal/${id}`);
}
