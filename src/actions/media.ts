"use server";

import { redirect } from "next/navigation";
import { v2 as cloudinary } from "cloudinary";
import { db } from "@/lib/db";
import { audit, requirePermission } from "@/lib/auth";
import { formValue } from "@/lib/admin-schemas";
import { isCloudinaryConfigured } from "@/lib/cloudinary";

export async function updateMediaAlt(formData: FormData) {
  const user = await requirePermission("media.write");
  const id = formValue(formData, "id");
  const altText = formValue(formData, "altText").slice(0, 300) || null;
  if (!id) redirect("/admin/media?error=Missing%20media%20reference.");
  await db.media.update({ where: { id }, data: { altText } });
  await audit({ userId: user.id, action: "media.alt_updated", entity: "Media", entityId: id });
  redirect("/admin/media?saved=1");
}

export async function deleteMedia(formData: FormData) {
  const user = await requirePermission("media.write");
  const id = formValue(formData, "id");
  if (!id) redirect("/admin/media?error=Missing%20media%20reference.");
  const media = await db.media.findUnique({ where: { id } });
  if (!media) redirect("/admin/media?error=Media%20not%20found.");

  if (media.publicId && isCloudinaryConfigured()) {
    try {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      await cloudinary.uploader.destroy(media.publicId);
    } catch (error) {
      console.error("Cloudinary delete failed", error);
    }
  }

  await db.media.delete({ where: { id } });
  await audit({
    userId: user.id,
    action: "media.deleted",
    entity: "Media",
    entityId: id,
    details: { filename: media.filename },
  });
  redirect("/admin/media?deleted=1");
}
