import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { deleteMedia, updateMediaAlt } from "@/actions/media";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import { MediaUploader } from "./media-uploader";
import { FeedbackBanner, type AdminSearchParams } from "@/components/admin/feedback";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { DeleteButton } from "@/components/admin/delete-button";
import { SubmitButton } from "@/components/admin/submit-button";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>;
}) {
  await requirePermission("media.write");
  const params = await searchParams;
  const media = await db.media.findMany({ orderBy: { createdAt: "desc" }, take: 60 });
  const configured = isCloudinaryConfigured();

  return (
    <>
      <PageHeader
        eyebrow="Site setup"
        title="Media library"
        description="A record of images uploaded through the CMS. Content forms can also accept external image URLs directly."
      />
      <FeedbackBanner params={params} />

      <div className="grid gap-6 xl:grid-cols-[1fr_2fr]">
        <div className="space-y-4">
          <MediaUploader configured={configured} />
          <div className="rounded-xl border border-navy-100 bg-white p-5 text-[0.7rem] leading-6 text-navy-500">
            <p className="font-semibold text-navy-800">Storage configuration</p>
            <p className="mt-1.5">
              Cloudinary:{" "}
              <span className={configured ? "font-medium text-emerald-700" : "font-medium text-amber-700"}>
                {configured ? "Configured" : "Not configured"}
              </span>
            </p>
            <p className="mt-2">
              File types are validated server-side and uploads require an authenticated admin session
              with media permission.
            </p>
          </div>
        </div>

        <div>
          {media.length === 0 ? (
            <EmptyState
              title="No uploaded media"
              description="Uploaded images will appear here with their alt text and usage details."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {media.map((item) => (
                <article key={item.id} className="overflow-hidden rounded-xl border border-navy-100 bg-white shadow-sm">
                  <div className="aspect-[4/3] overflow-hidden bg-navy-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.url} alt={item.altText || item.filename} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-4">
                    <p className="truncate text-[0.75rem] font-medium text-navy-800" title={item.filename}>
                      {item.filename}
                    </p>
                    <p className="mt-0.5 text-[0.62rem] text-navy-400">
                      {(item.size / 1024).toFixed(0)} KB
                      {item.width && item.height ? ` · ${item.width}×${item.height}` : ""}
                    </p>
                    <p className="text-[0.62rem] text-navy-400">{formatDate(item.createdAt)}</p>
                    <form action={updateMediaAlt} className="mt-3 flex gap-1.5">
                      <input type="hidden" name="id" value={item.id} />
                      <input
                        name="altText"
                        defaultValue={item.altText ?? ""}
                        placeholder="Alt text"
                        maxLength={300}
                        aria-label={`Alt text for ${item.filename}`}
                        className="h-8 min-w-0 flex-1 rounded border border-navy-200 px-2 text-[0.68rem] focus:border-gold-500 focus:outline-none"
                      />
                      <SubmitButton variant="outline" size="sm" className="h-8 px-2" pendingLabel="…">
                        Save
                      </SubmitButton>
                    </form>
                    <div className="mt-2 flex items-center justify-between">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[0.66rem] font-medium text-gold-700 hover:underline"
                      >
                        Open asset ↗
                      </a>
                      <DeleteButton
                        action={deleteMedia}
                        id={item.id}
                        name={item.filename}
                        title="Delete this media file?"
                        description="The record is removed from the library and, where Cloudinary is configured, the asset is deleted. Content already using this URL will show a broken image."
                        compact
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
