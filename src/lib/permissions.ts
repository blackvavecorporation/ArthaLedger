import type { RoleName } from "@prisma/client";

export type Permission =
  | "dashboard.view"
  | "content.read"
  | "content.write"
  | "services.write"
  | "testimonials.write"
  | "faqs.write"
  | "legal.write"
  | "seo.write"
  | "settings.write"
  | "media.write"
  | "enquiries.read"
  | "enquiries.write"
  | "appointments.read"
  | "appointments.write"
  | "conversations.read"
  | "conversations.write"
  | "users.manage"
  | "audit.read";

const EDITOR_PERMISSIONS: Permission[] = [
  "dashboard.view",
  "content.read",
  "content.write",
  "services.write",
  "testimonials.write",
  "faqs.write",
  "legal.write",
  "seo.write",
  "media.write",
];

const ADMIN_PERMISSIONS: Permission[] = [
  ...EDITOR_PERMISSIONS,
  "settings.write",
  "enquiries.read",
  "enquiries.write",
  "appointments.read",
  "appointments.write",
  "conversations.read",
  "conversations.write",
  "audit.read",
];

const SUPER_ADMIN_PERMISSIONS: Permission[] = [...ADMIN_PERMISSIONS, "users.manage"];

export const ROLE_PERMISSIONS: Record<RoleName, Permission[]> = {
  EDITOR: EDITOR_PERMISSIONS,
  ADMIN: ADMIN_PERMISSIONS,
  SUPER_ADMIN: SUPER_ADMIN_PERMISSIONS,
};

export function can(role: RoleName | undefined | null, permission: Permission) {
  if (!role) return false;
  return ROLE_PERMISSIONS[role].includes(permission);
}

export const ROLE_LABELS: Record<RoleName, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Administrator",
  EDITOR: "Content Editor",
};
