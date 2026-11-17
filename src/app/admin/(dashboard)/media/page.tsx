import { ImageOff, ShieldCheck } from "lucide-react";
import { requirePermission } from "@/lib/auth";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  await requirePermission("media.write");

  return (
    <>
      <PageHeader
        eyebrow="Site setup"
        title="Media library"
        description="The media library is shown for layout demonstration only. This deployment has no file storage, upload endpoint or media database."
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_2fr]">
        <div className="space-y-4">
          <div className="rounded-xl border border-gold-200 bg-gold-50 p-6">
            <div className="flex items-center gap-2">
              <ImageOff className="h-4 w-4 text-gold-800" />
              <h2 className="font-display text-xl font-semibold text-navy-950">
                Uploads are disabled
              </h2>
            </div>
            <p className="mt-2 text-[0.76rem] leading-6 text-navy-600">
              No Cloudinary account, API key or local upload directory is connected. The demo does
              not read or store files.
            </p>
          </div>
          <div className="rounded-xl border border-navy-100 bg-white p-5 text-[0.7rem] leading-6 text-navy-500">
            <p className="flex items-center gap-1.5 font-semibold text-navy-800">
              <ShieldCheck className="h-3.5 w-3.5 text-gold-700" />
              demo data handling
            </p>
            <p className="mt-2">
              Image fields in the content editor accept external HTTPS URLs only. No image is
              uploaded by this application.
            </p>
          </div>
        </div>

        <EmptyState
          title="No media in this demo"
          description="A live deployment would show uploaded images here. This demo intentionally starts with an empty media library."
        />
      </div>
    </>
  );
}
