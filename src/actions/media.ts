"use server";

import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/auth";

// Media writes are intentionally disabled. The demo has no storage provider
// and must not imply that a file was uploaded or persisted.
export async function updateMediaAlt(_formData: FormData) {
  await requirePermission("media.write");
  redirect("/admin/media?error=Demo%20mode%3A%20media%20editing%20is%20disabled.");
}

export async function deleteMedia(_formData: FormData) {
  await requirePermission("media.write");
  redirect("/admin/media?error=Demo%20mode%3A%20media%20deletion%20is%20disabled.");
}
