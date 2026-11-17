import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { FeedbackBanner, type AdminSearchParams } from "@/components/admin/feedback";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { ServiceForm } from "../service-form";

export const dynamic = "force-dynamic";

export default async function EditServicePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<AdminSearchParams>;
}) {
  await requirePermission("services.write");
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const [service, categories] = await Promise.all([
    db.service.findUnique({ where: { id } }),
    db.serviceCategory.findMany({ orderBy: { order: "asc" } }),
  ]);
  if (!service) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Services"
        title={service.title}
        description="Update the service content, publishing state and SEO details."
        actions={
          service.status === "PUBLISHED" ? (
            <Button asChild variant="outline" size="sm">
              <Link href={`/services/${service.slug}`} target="_blank">
                View live page
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </Button>
          ) : undefined
        }
      />
      <FeedbackBanner params={query} />
      <ServiceForm service={service} categories={categories} />
    </>
  );
}
