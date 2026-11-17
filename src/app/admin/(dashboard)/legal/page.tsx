import Link from "next/link";
import { ExternalLink, Pencil, ShieldAlert } from "lucide-react";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { FeedbackBanner, type AdminSearchParams } from "@/components/admin/feedback";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function LegalPagesPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>;
}) {
  await requirePermission("legal.write");
  const params = await searchParams;
  const pages = await db.legalPage.findMany({ orderBy: { type: "asc" } });

  return (
    <>
      <PageHeader
        eyebrow="Website content"
        title="Legal pages"
        description="Manage Terms & Conditions, Privacy Policy, Disclaimer and Cookie Policy. Content is stored in the database and rendered on the public website."
      />
      <FeedbackBanner params={params} />

      <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
        <p className="text-[0.74rem] leading-6 text-amber-900">
          The seeded legal content is a draft prepared for review. Replace every bracketed placeholder
          (firm legal name, address, jurisdiction, grievance officer and dates) and obtain qualified
          legal review before publishing or relying on these pages. The public page displays a review
          note until you edit it.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {pages.map((page) => (
          <div key={page.id} className="flex flex-col rounded-xl border border-navy-100 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-navy-400">
                  {page.type.replaceAll("_", " ")}
                </p>
                <h2 className="mt-1 font-display text-2xl font-semibold text-navy-950">{page.title}</h2>
                <p className="mt-0.5 font-mono text-[0.66rem] text-navy-400">/legal/{page.slug}</p>
              </div>
              <StatusBadge status={page.status} />
            </div>
            <p className="mt-3 text-[0.7rem] text-navy-400">Last updated {formatDate(page.updatedAt, true)}</p>
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-navy-100 pt-4">
              <Button asChild size="sm">
                <Link href={`/admin/legal/${page.id}`}>
                  <Pencil className="h-3.5 w-3.5" />
                  Edit content
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/legal/${page.slug}?preview=1`} target="_blank">
                  {page.status === "PUBLISHED" ? "View live" : "Preview draft"}
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
