"use server";

import { redirect } from "next/navigation";
import {
  audit,
  createSession,
  destroySession,
  getClientIp,
  getCurrentUser,
} from "@/lib/auth";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/data/site";
import { rateLimit } from "@/lib/rate-limit";
import { fieldErrors, loginSchema } from "@/lib/validation";

export type AuthState = {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string>;
};

export async function loginAction(_previous: AuthState, formData: FormData): Promise<AuthState> {
  const ip = await getClientIp();
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Enter a valid email address and password." };
  }

  const limit = rateLimit(`demo-login:${ip}`, { limit: 20, windowMs: 15 * 60 * 1000 });
  if (!limit.success) {
    return { error: "Too many demo sign-in attempts. Please wait a few minutes." };
  }

  const email = parsed.data.email.toLowerCase();
  if (email !== DEMO_EMAIL || parsed.data.password !== DEMO_PASSWORD) {
    return {
      error: "Incorrect demo credentials. Use the email and password shown on this page.",
    };
  }

  await createSession({
    id: "demo-admin",
    email: DEMO_EMAIL,
    name: "Demo Administrator",
    role: "SUPER_ADMIN",
  });
  await audit({
    userId: "demo-admin",
    action: "auth.demo_login",
    entity: "AdminUser",
    entityId: "demo-admin",
    details: { mode: "demo" },
    ipAddress: ip,
  });

  redirect("/admin");
}

export async function logoutAction() {
  const user = await getCurrentUser();
  await destroySession();
  if (user) {
    await audit({ userId: user.id, action: "auth.demo_logout", entity: "AdminUser", entityId: user.id });
  }
  redirect("/admin/login");
}

export async function setupAction(_previous: AuthState, _formData: FormData): Promise<AuthState> {
  return {
    error:
      "First-run setup is disabled in this demo. Use the documented demo credentials on the sign-in page.",
  };
}

export async function changePasswordAction(
  _previous: AuthState,
  _formData: FormData,
): Promise<AuthState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Your demo session has expired. Please sign in again." };
  return {
    success:
      "Demo mode: passwords are fixed and nothing was saved. Use the documented demo credentials to sign in.",
  };
}
