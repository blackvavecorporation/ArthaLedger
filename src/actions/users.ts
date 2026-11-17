"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { audit, hashPassword, requirePermission } from "@/lib/auth";
import { createUserSchema, formValue } from "@/lib/admin-schemas";
import { z } from "zod";
import type { RoleName } from "@prisma/client";

function fail(message: string): never {
  redirect(`/admin/users?error=${encodeURIComponent(message)}`);
}

export async function createAdminUser(formData: FormData) {
  const actor = await requirePermission("users.manage");
  const parsed = createUserSchema.safeParse({
    name: formValue(formData, "name"),
    email: formValue(formData, "email"),
    password: formValue(formData, "password"),
    role: formValue(formData, "role"),
  });
  if (!parsed.success) fail(parsed.error.issues[0]?.message ?? "Invalid user details.");

  const existing = await db.adminUser.findUnique({ where: { email: parsed.data.email } });
  if (existing) fail("An admin account with that email already exists.");

  const role = await db.role.findUnique({ where: { name: parsed.data.role } });
  if (!role) fail("The selected role does not exist. Run the database seed.");

  const user = await db.adminUser.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash: await hashPassword(parsed.data.password),
      roleId: role.id,
      isActive: true,
    },
  });
  await audit({
    userId: actor.id,
    action: "user.created",
    entity: "AdminUser",
    entityId: user.id,
    details: { email: user.email, role: parsed.data.role },
  });
  redirect("/admin/users?saved=1");
}

export async function updateAdminUser(formData: FormData) {
  const actor = await requirePermission("users.manage");
  const id = formValue(formData, "id");
  const roleName = formValue(formData, "role");
  const isActive = formValue(formData, "isActive") === "on";
  if (!id) fail("Missing user reference.");
  if (!["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(roleName)) fail("Invalid role.");

  const target = await db.adminUser.findUnique({ where: { id }, include: { role: true } });
  if (!target) fail("User not found.");

  if (target.id === actor.id && (!isActive || roleName !== "SUPER_ADMIN")) {
    fail("You cannot deactivate your own account or remove your own super admin access.");
  }

  if ((target.role.name === "SUPER_ADMIN" && roleName !== "SUPER_ADMIN") || !isActive) {
    const activeSupers = await db.adminUser.count({
      where: { role: { name: "SUPER_ADMIN" }, isActive: true },
    });
    if (target.role.name === "SUPER_ADMIN" && activeSupers <= 1) {
      fail("At least one active SUPER_ADMIN must remain.");
    }
  }

  const role = await db.role.findUnique({ where: { name: roleName as RoleName } });
  if (!role) fail("Role not found.");

  await db.adminUser.update({
    where: { id },
    data: { roleId: role.id, isActive },
  });
  await audit({
    userId: actor.id,
    action: "user.updated",
    entity: "AdminUser",
    entityId: id,
    details: { role: roleName, isActive },
  });
  redirect("/admin/users?saved=1");
}

const passwordSchema = z
  .string()
  .min(12, "Use at least 12 characters.")
  .max(128)
  .regex(/[A-Za-z]/, "Include at least one letter.")
  .regex(/[0-9]/, "Include at least one number.");

export async function resetAdminUserPassword(formData: FormData) {
  const actor = await requirePermission("users.manage");
  const id = formValue(formData, "id");
  const parsed = passwordSchema.safeParse(formValue(formData, "newPassword"));
  if (!id) fail("Missing user reference.");
  if (!parsed.success) fail(parsed.error.issues[0]?.message ?? "Invalid password.");

  const target = await db.adminUser.findUnique({ where: { id } });
  if (!target) fail("User not found.");

  await db.adminUser.update({
    where: { id },
    data: { passwordHash: await hashPassword(parsed.data) },
  });
  await audit({
    userId: actor.id,
    action: "user.password_reset",
    entity: "AdminUser",
    entityId: id,
    details: { email: target.email },
  });
  redirect("/admin/users?saved=1");
}
