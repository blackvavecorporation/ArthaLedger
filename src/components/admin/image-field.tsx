"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export function ImageField({
  name,
  label = "Image",
  defaultValue = "",
  hint = "Paste an image URL or upload a JPG, PNG, WebP or AVIF file (max 5 MB).",
}: {
  name: string;
  label?: string;
  defaultValue?: string | null;
  hint?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      const data = (await response.json()) as { ok?: boolean; url?: string; error?: string };
      if (!response.ok || !data.ok || !data.url) throw new Error(data.error || "Upload failed.");
      setValue(data.url);
      toast.success("Image uploaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label htmlFor={`image-url-${name}`} className="admin-label">
        {label}
      </label>
      <div className="flex items-start gap-3">
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md border border-dashed border-navy-200 bg-navy-50">
          {value ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="Selected image preview" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => setValue("")}
                aria-label="Remove image"
                className="absolute right-1 top-1 rounded-full bg-navy-950/80 p-0.5 text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </>
          ) : (
            <ImagePlus className="h-5 w-5 text-navy-300" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <Input
            id={`image-url-${name}`}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="https://images.example.com/…"
            className="h-9 text-xs"
          />
          <input type="hidden" name={name} value={value} />
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
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded border border-navy-200 bg-white px-2.5 py-1.5 text-[0.68rem] font-medium text-navy-600 hover:bg-navy-50 disabled:opacity-50"
          >
            {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <ImagePlus className="h-3 w-3" />}
            {uploading ? "Uploading…" : "Upload image"}
          </button>
        </div>
      </div>
      <p className="mt-1 text-[0.65rem] leading-4 text-navy-400">{hint}</p>
    </div>
  );
}
