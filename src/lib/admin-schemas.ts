import { z } from "zod";

export const linkField = z
  .string()
  .trim()
  .min(1, "A link is required.")
  .max(300)
  .refine(
    (value) =>
      (value.startsWith("/") && !value.startsWith("//")) || /^https?:\/\//i.test(value),
    "Use a site path beginning with / or a full https:// URL.",
  );

export const orderField = z.coerce.number().int("Order must be a whole number.").min(0).max(999);

const optionalUrl = z
  .string()
  .trim()
  .max(1000)
  .refine((value) => value === "" || /^https?:\/\//i.test(value), "Enter a full https:// URL or leave blank.")
  .transform((value) => (value === "" ? null : value));

export function optionalText(max = 2000) {
  return z
    .string()
    .trim()
    .max(max, `Keep this under ${max} characters.`)
    .transform((value) => (value === "" ? null : value));
}

export const requiredText = (max: number, message = "This field is required.") =>
  z.string().trim().min(1, message).max(max, `Keep this under ${max} characters.`);

export function isChecked(formData: FormData, name: string) {
  const value = formData.get(name);
  return value === "on" || value === "true" || value === "1";
}

export function formValue(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export function formLines(formData: FormData, name: string) {
  return formValue(formData, name)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export const homeSchema = z.object({
  heroEyebrow: requiredText(120),
  heroTitle: requiredText(140),
  heroTitleAccent: requiredText(140),
  heroDescription: z.string().trim().min(20, "Add a slightly longer hero description.").max(1200),
  primaryCtaLabel: requiredText(60),
  primaryCtaHref: linkField,
  secondaryCtaLabel: requiredText(60),
  secondaryCtaHref: linkField,
  heroTrustLine: z.string().trim().min(10).max(400),
  heroCardTitle: requiredText(120),
  heroCardSubtitle: requiredText(200),
  servicesEyebrow: requiredText(80),
  servicesTitle: requiredText(180),
  servicesDescription: z.string().trim().min(10).max(800),
  whyEyebrow: requiredText(80),
  whyTitle: requiredText(180),
  whyDescription: z.string().trim().min(10).max(800),
  expertiseEyebrow: requiredText(80),
  expertiseTitle: requiredText(180),
  expertiseDescription: z.string().trim().min(10).max(800),
  testimonialsEyebrow: requiredText(80),
  testimonialsTitle: requiredText(180),
  testimonialsDescription: z.string().trim().min(10).max(800),
  faqEyebrow: requiredText(80),
  faqTitle: requiredText(180),
  faqDescription: z.string().trim().min(10).max(800),
  ctaEyebrow: requiredText(80),
  ctaTitle: requiredText(180),
  ctaDescription: z.string().trim().min(10).max(800),
  ctaButtonLabel: requiredText(60),
  ctaButtonHref: linkField,
});

export const aboutSchema = z.object({
  eyebrow: requiredText(100),
  title: requiredText(180),
  introduction: z.string().trim().min(20, "Add a longer introduction.").max(1500),
  story: z.string().trim().min(20, "Add the firm's story.").max(6000),
  vision: z.string().trim().min(10).max(1000),
  mission: z.string().trim().min(10).max(1000),
  valuesTitle: requiredText(160),
  teamTitle: requiredText(160),
  teamDescription: z.string().trim().min(10).max(1000),
  whyTitle: requiredText(160),
  whyDescription: z.string().trim().min(10).max(1000),
  imageUrl: optionalUrl,
});

export const brandingSchema = z.object({
  brandName: requiredText(80),
  legalName: requiredText(160),
  tagline: requiredText(160),
  logoUrl: optionalUrl,
  faviconUrl: optionalUrl,
});

export const contactSettingsSchema = z.object({
  primaryPhone: requiredText(40),
  secondaryPhone: z.string().trim().max(40),
  businessEmail: z.string().trim().toLowerCase().email("Enter a valid email address.").max(200),
  officeAddress: z.string().trim().min(10, "Enter the office address.").max(500),
  googleMapsEmbedUrl: optionalUrl,
  workingHours: requiredText(200),
});

export const footerSettingsSchema = z.object({
  footerAbout: z.string().trim().min(10).max(600),
  footerCopyright: requiredText(250),
});

export const messagingSettingsSchema = z.object({
  whatsappNumber: z
    .string()
    .trim()
    .regex(/^\d{8,15}$/, "Use digits only, including country code (e.g. 919876543210)."),
  whatsappMessage: z.string().trim().min(5).max(500),
  whatsappWelcomeMessage: z.string().trim().min(5).max(500),
  chatbotMode: z.enum(["AI", "FAQ", "HUMAN"]),
  chatbotWelcomeEn: z.string().trim().min(10).max(600),
  chatbotWelcomeTe: z.string().trim().min(10).max(600),
  chatbotSystemPrompt: optionalText(5000),
  chatbotModel: requiredText(100),
});

export const seoSchema = z.object({
  siteTitle: requiredText(200),
  titleTemplate: z.string().trim().min(5).max(200).refine((value) => value.includes("%s"), "Include %s where the page title should appear."),
  description: z.string().trim().min(20).max(400),
  keywords: z.array(z.string().trim().min(1).max(80)).max(30),
  ogImageUrl: optionalUrl,
  canonicalBase: optionalUrl,
  twitterHandle: z.string().trim().max(50),
  gaMeasurementId: z
    .string()
    .trim()
    .max(30)
    .refine((value) => value === "" || /^G-[A-Z0-9]{4,20}$/i.test(value), "Use a GA4 measurement ID such as G-XXXXXXXXXX, or leave blank."),
});

export const navItemSchema = z.object({
  label: requiredText(60),
  href: linkField,
  location: z.enum(["HEADER", "FOOTER"]),
  order: orderField,
});

export const socialLinkSchema = z.object({
  platform: requiredText(40),
  url: z.string().trim().url("Enter a full https:// URL.").max(500),
  order: orderField,
});

export const statSchema = z.object({
  label: requiredText(120),
  value: requiredText(40),
  description: optionalText(300),
  order: orderField,
});

export const contentItemSchema = z.object({
  title: requiredText(160),
  description: z.string().trim().min(5).max(1000),
  icon: requiredText(60),
  order: orderField,
});

export const teamMemberSchema = z.object({
  name: requiredText(120),
  designation: requiredText(120),
  qualifications: optionalText(250),
  bio: optionalText(1000),
  imageUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  order: orderField,
});

export const serviceSchema = z.object({
  title: requiredText(160),
  slug: z
    .string()
    .trim()
    .max(140)
    .refine((value) => value === "" || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value), "Use lowercase letters, numbers and hyphens."),
  categoryId: z.string().trim().max(60),
  shortDescription: z.string().trim().min(20, "Add a short description of at least 20 characters.").max(400),
  description: z.string().trim().min(30, "Add detailed service information.").max(20000),
  icon: requiredText(60),
  imageUrl: optionalUrl,
  benefits: z.array(z.string().trim().min(1).max(250)).max(20),
  ctaLabel: requiredText(80),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  order: orderField,
  seoTitle: optionalText(200),
  seoDescription: optionalText(400),
});

export const categorySchema = z.object({
  name: requiredText(100),
  slug: z
    .string()
    .trim()
    .max(100)
    .refine((value) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value), "Use lowercase letters, numbers and hyphens."),
  description: optionalText(300),
  order: orderField,
});

export const testimonialSchema = z
  .object({
    clientName: requiredText(120),
    designation: optionalText(120),
    company: optionalText(120),
    review: z.string().trim().min(20, "Add the client's actual review text.").max(3000),
    rating: z.coerce.number().int().min(1).max(5),
    imageUrl: optionalUrl,
    isApproved: z.boolean(),
    isPublished: z.boolean(),
    order: orderField,
  })
  .refine((data) => !data.isPublished || data.isApproved, {
    message: "A testimonial must be approved before it can be published.",
    path: ["isPublished"],
  });

export const faqSchema = z.object({
  question: requiredText(300),
  answer: z.string().trim().min(10, "Add an answer.").max(5000),
  questionTe: optionalText(300),
  answerTe: optionalText(5000),
  category: optionalText(100),
  order: orderField,
});

export const legalSchema = z.object({
  title: requiredText(160),
  content: z.string().trim().min(100, "Legal content must be at least 100 characters.").max(50000),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  seoTitle: optionalText(200),
  seoDescription: optionalText(400),
});

export const enquiryUpdateSchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED", "SPAM"]),
  adminNote: optionalText(3000),
});

export const appointmentUpdateSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]),
  adminNote: optionalText(3000),
});

export const createUserSchema = z.object({
  name: requiredText(100),
  email: z.string().trim().toLowerCase().email().max(200),
  password: z
    .string()
    .min(12, "Use at least 12 characters.")
    .max(128)
    .regex(/[A-Za-z]/, "Include at least one letter.")
    .regex(/[0-9]/, "Include at least one number."),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR"]),
});
