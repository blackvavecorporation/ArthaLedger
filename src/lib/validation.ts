import { z } from "zod";

const name = z.string().trim().min(2, "Please enter your full name.").max(100);
const email = z.string().trim().toLowerCase().email("Please enter a valid email address.").max(200);
const phone = z
  .string()
  .trim()
  .min(7, "Please enter a valid phone number.")
  .max(20)
  .regex(/^[+()\-\s0-9]+$/, "Phone number may contain digits, spaces, +, - and parentheses only.");
const message = z
  .string()
  .trim()
  .min(10, "Please add a little more detail (at least 10 characters).")
  .max(3000, "Please keep the message under 3,000 characters.");

export const loginSchema = z.object({
  email,
  password: z.string().min(8, "Invalid credentials."),
});

export const setupSchema = z
  .object({
    name,
    email,
    password: z
      .string()
      .min(12, "Use at least 12 characters.")
      .max(128)
      .regex(/[A-Za-z]/, "Include at least one letter.")
      .regex(/[0-9]/, "Include at least one number.")
      .regex(/[^A-Za-z0-9]/, "Include at least one symbol."),
    confirmPassword: z.string(),
    setupToken: z.string().min(1, "Setup token is required."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const contactSchema = z.object({
  name,
  email,
  phone,
  serviceId: z.string().trim().max(60).optional(),
  message,
  consent: z.literal(true, { error: "Please accept the privacy policy." }),
  website: z.string().max(0).optional(), // honeypot
});

export const appointmentSchema = z.object({
  name,
  email,
  phone,
  serviceId: z.string().trim().max(60).optional(),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date."),
  preferredTime: z.string().trim().min(2).max(40),
  mode: z.enum(["PHONE", "VIDEO", "IN_PERSON"]),
  notes: z.string().trim().max(2000).optional(),
  consent: z.literal(true, { error: "Please accept the privacy policy." }),
  website: z.string().max(0).optional(),
});

export const chatRequestSchema = z.object({
  sessionId: z.string().trim().min(8).max(80),
  message: z.string().trim().min(1).max(2000),
  language: z.enum(["en", "te"]).default("en"),
});

export const chatLeadSchema = z.object({
  sessionId: z.string().trim().min(8).max(80),
  name,
  email,
  phone,
  serviceId: z.string().trim().max(60).optional(),
  message: z.string().trim().max(2000).optional(),
  consent: z.literal(true),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: z
      .string()
      .min(12, "Use at least 12 characters.")
      .max(128)
      .regex(/[A-Za-z]/, "Include at least one letter.")
      .regex(/[0-9]/, "Include at least one number.")
      .regex(/[^A-Za-z0-9]/, "Include at least one symbol."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export function fieldErrors(error: z.ZodError) {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in errors)) {
      errors[key] = issue.message;
    }
  }
  return errors;
}
