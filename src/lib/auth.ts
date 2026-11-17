import "server-only";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import type { RoleName } from "@/lib/demo-types";
import { db } from "@/lib/db";
import { can, type Permission } from "@/lib/permissions";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession, verifySession } from "@/lib/session";
import { DEMO_PASSWORD } from "@/data/site";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: RoleName;
  roleLabel: string;
  isActive: boolean;
};

const DEMO_USER: CurrentUser = {
  id: "demo-admin",
  name: "Demo Administrator",
  email: "demo@arthaledger.example",
  role: "SUPER_ADMIN",
  roleLabel: "SUPER ADMIN",
  isActive: true,
};

// Demo-only helpers. No password is hashed or stored anywhere.
export async function hashPassword(_password: string) {
  return "demo-only-no-password-hash";
}

export async function verifyPassword(password: string, _hash?: string) {
  return password === DEMO_PASSWORD;
}

export async function createSession(user: {
  id: string;
  email: string;
  name: string;
  role: RoleName;
}) {
  const token = await signSession({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const store = await cookies();
  const session = await verifySession(store.get(SESSION_COOKIE)?.value);
  if (!session) return null;
  return { ...DEMO_USER, name: session.name, email: session.email, role: session.role as RoleName };
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function requirePermission(permission: Permission) {
  const user = await requireUser();
  if (!can(user.role, permission)) {
    redirect("/admin?denied=1");
  }
  return user;
}

export async function requireApiUser(permission: Permission) {
  const user = await getCurrentUser();
  if (!user) return { user: null, error: "Unauthorized" as const, status: 401 };
  if (!can(user.role, permission)) {
    return { user: null, error: "Forbidden" as const, status: 403 };
  }
  return { user, error: null, status: 200 };
}

export async function getClientIp() {
  const headerStore = await headers();
  const forwarded = headerStore.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return headerStore.get("x-real-ip") || "unknown";
}

export async function getRequestContext() {
  const headerStore = await headers();
  return {
    ip: (headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || headerStore.get("x-real-ip") || "unknown"),
    userAgent: headerStore.get("user-agent")?.slice(0, 300) || null,
  };
}

export async function audit(params: {
  userId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: Record<string, unknown>;
  ipAddress?: string | null;
}) {
  try {
    await db.auditLog.create({
      data: {
        userId: params.userId ?? null,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId ?? null,
        details: params.details ?? { demo: true },
        ipAddress: params.ipAddress ?? null,
      },
    });
  } catch (error) {
    console.error("Failed to write demo audit log", error);
  }
}
