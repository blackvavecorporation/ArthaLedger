import { NextResponse } from "next/server";
import { audit, requireApiUser } from "@/lib/auth";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_UPLOAD_BYTES,
  isCloudinaryConfigured,
  uploadImage,
} from "@/lib/cloudinary";
import { db } from "@/lib/db";
import { isSameOrigin, jsonError, requestIp } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return jsonError("Invalid request origin.", 403);

  const auth = await requireApiUser("media.write");
  if (!auth.user) return jsonError(auth.error ?? "Unauthorized", auth.status);

  const ip = requestIp(request);
  const limit = rateLimit(`upload:${auth.user.id}:${ip}`, { limit: 20, windowMs: 10 * 60 * 1000 });
  if (!limit.success) return jsonError("Upload limit reached. Please try again later.", 429);

  if (!isCloudinaryConfigured()) {
    return jsonError(
      "Image storage is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to the server environment, or paste an image URL instead.",
      503,
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError("Invalid upload payload.");
  }

  const file = formData.get("file");
  if (!(file instanceof File)) return jsonError("No image file was provided.");
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return jsonError("Only JPG, PNG, WebP or AVIF images are allowed.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return jsonError("Images must be 5 MB or smaller.");
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploaded = await uploadImage(buffer, file.type, "arthaledger");
    const media = await db.media.create({
      data: {
        url: uploaded.url,
        publicId: uploaded.publicId,
        filename: file.name.slice(0, 200),
        mimeType: file.type,
        size: file.size,
        width: uploaded.width,
        height: uploaded.height,
        altText: null,
      },
    });
    await audit({
      userId: auth.user.id,
      action: "media.uploaded",
      entity: "Media",
      entityId: media.id,
      details: { filename: media.filename, size: media.size },
      ipAddress: ip,
    });
    return NextResponse.json({ ok: true, url: uploaded.url, id: media.id });
  } catch (error) {
    console.error("Upload failed", error);
    return jsonError("The image could not be uploaded. Please try again.", 500);
  }
}
