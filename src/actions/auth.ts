"use server";

import { timingSafeEqual } from "node:crypto";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  audit,
  createSession,
  destroySession,
  getClientIp,
  getCurrentUser,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { changePasswordSchema, fieldErrors, loginSchema, setupSchema } from "@/lib/validation";

export type AuthState = {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string>;
};

function safeTokenEqual(a: string, b: string) {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
}

export async function loginAction(_previous: AuthState, formData: FormData): Promise<AuthState> {
  const ip = await getClientIp();
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Enter a valid email address and password." };
  }

  const email = parsed.data.email.toLowerCase();
  const ipLimit = rateLimit(`login-ip:${ip}`, { limit: 20, windowMs: 15 * 60 * 1000 });
  if (!ipLimit.success) {
    return { error: "Too many login attempts. Please try again in a few minutes." };
  }
  const accountLimit = rateLimit(`login:${ip}:${email}`, { limit: 5, windowMs: 15 * 60 * 1000 });
  if (!accountLimit.success) {
    return { error: "Too many login attempts for this account. Please wait 15 minutes." };
  }

  const user = await db.adminUser.findUnique({
    where: { email },
    include: { role: true },
  });

  const genericError = { error: "Incorrect email address or password." };

  if (!user) {
    // Perform a hash comparison even when the account does not exist to reduce timing leakage.
    await verifyPassword(
      parsed.data.password,
      "$2b$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW",
    );
    await audit({
      action: "auth.login_failed",
      entity: "AdminUser",
      details: { email },
      ipAddress: ip,
    });
    return genericError;
  }

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid || !user.isActive) {
    await audit({
      userId: user.id,
      action: valid ? "auth.login_inactive" : "auth.login_failed",
      entity: "AdminUser",
      entityId: user.id,
      ipAddress: ip,
    });
    return genericError;
  }

  await db.adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await createSession({ id: user.id, email: user.email, name: user.name, role: user.role.name });
  await audit({
    userId: user.id,
    action: "auth.login",
    entity: "AdminUser",
    entityId: user.id,
    ipAddress: ip,
  });

  redirect("/admin");
}

export async function logoutAction() {
  const user = await getCurrentUser();
  await destroySession();
  if (user) {
    await audit({ userId: user.id, action: "auth.logout", entity: "AdminUser", entityId: user.id });
  }
  redirect("/admin/login");
}

export async function setupAction(_previous: AuthState, formData: FormData): Promise<AuthState> {
  const adminCount = await db.adminUser.count();
  if (adminCount > 0) {
    return { error: "Setup has already been completed. Please sign in instead." };
  }

  const expectedToken = process.env.ADMIN_SETUP_TOKEN;
  if (!expectedToken) {
    return { error: "First-run setup is not available. ADMIN_SETUP_TOKEN is not configured." };
  }

  const parsed = setupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    setupToken: formData.get("setupToken"),
  });
  if (!parsed.success) {
    return {
      error: "Please check the highlighted fields.",
      fieldErrors: fieldErrors(parsed.error),
    };
  }

  const ip = await getClientIp();
  const limit = rateLimit(`setup:${ip}`, { limit: 5, windowMs: 60 * 60 * 1000 });
  if (!limit.success) {
    return { error: "Too many setup attempts. Please try again later." };
  }

  if (!safeTokenEqual(parsed.data.setupToken, expectedToken)) {
    return { error: "Invalid setup token." };
  }

  const superAdmin = await db.role.findUnique({ where: { name: "SUPER_ADMIN" } });
  if (!superAdmin) {
    return { error: "Roles are not initialised. Run the database seed first." };
  }

  // Re-check immediately before writing to avoid a race with another setup request.
  if ((await db.adminUser.count()) > 0) {
    return { error: "Setup has already been completed. Please sign in instead." };
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const user = await db.adminUser.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      passwordHash,
      roleId: superAdmin.id,
      isActive: true,
    },
  });

  await audit({
    userId: user.id,
    action: "auth.setup",
    entity: "AdminUser",
    entityId: user.id,
    details: { note: "Initial SUPER_ADMIN created via first-run setup" },
    ipAddress: ip,
  });
  await createSession({ id: user.id, email: user.email, name: user.name, role: superAdmin.name });
  redirect("/admin");
}

export async function changePasswordAction(
  _previous: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Your session has expired. Please sign in again." };

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { error: "Please check the highlighted fields.", fieldErrors: fieldErrors(parsed.error) };
  }

  const record = await db.adminUser.findUnique({ where: { id: user.id } });
  if (!record) return { error: "Account not found." };

  const valid = await verifyPassword(parsed.data.currentPassword, record.passwordHash);
  if (!valid) return { error: "Your current password is incorrect." };

  await db.adminUser.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(parsed.data.newPassword) },
  });
  await audit({
    userId: user.id,
    action: "auth.password_changed",
    entity: "AdminUser",
    entityId: user.id,
  });

  return { success: "Your password has been updated." };
}
