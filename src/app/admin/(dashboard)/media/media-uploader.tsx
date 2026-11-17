"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CloudUpload, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function MediaUploader({ configured }: { configured: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  async function upload(file: File) {
    if (!configured) {
      toast.error("Cloudinary is not configured on the server.");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) throw new Error(data.error || "Upload failed.");
      toast.success("Image uploaded to the library.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="rounded-xl border border-navy-100 bg-white p-6 shadow-sm">
      <h2 className="font-display text-xl font-semibold text-navy-950">Upload an image</h2>
      <p className="mt-1 text-[0.76rem] leading-6 text-navy-500">
        Uploaded assets are stored in Cloudinary and recorded in the media library. JPG, PNG, WebP or
        AVIF, up to 5 MB.
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
        }}
      />
      <button
        type="button"
        disabled={uploading || !configured}
        onClick={() => inputRef.current?.click()}
        className="mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-navy-900 px-4 text-[0.78rem] font-semibold text-white hover:bg-navy-800 disabled:opacity-50"
      >
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CloudUpload className="h-4 w-4" />}
        {uploading ? "Uploading…" : "Select image"}
      </button>
      {!configured && (
        <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-[0.7rem] leading-5 text-amber-900">
          Uploads are disabled until CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and
          CLOUDINARY_API_SECRET are configured on the server. You can still paste external image URLs
          directly into content forms.
        </p>
      )}
    </div>
  );
}
