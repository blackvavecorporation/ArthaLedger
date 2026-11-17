"use server";

import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/auth";

// User provisioning is intentionally disabled. A demo must not create accounts
// or imply that credentials are being stored.
function disabled(): never {
  redirect(
    `/admin/users?error=${encodeURIComponent(
      "Demo mode: account creation, role changes and password resets are disabled. Use the documented demo login.",
    )}`,
  );
}

export async function createAdminUser(_formData: FormData) {
  await requirePermission("users.manage");
  disabled();
}

export async function updateAdminUser(_formData: FormData) {
  await requirePermission("users.manage");
  disabled();
}

export async function resetAdminUserPassword(_formData: FormData) {
  await requirePermission("users.manage");
  disabled();
}
