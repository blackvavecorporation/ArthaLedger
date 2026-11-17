import Link from "next/link";
import { ExternalLink, FolderTree, Pencil, Plus } from "lucide-react";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { deleteService } from "@/actions/services";
import { EmptyState } from "@/components/admin/empty-state";
import { FeedbackBanner, type AdminSearchParams } from "@/components/admin/feedback";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>;
}) {
  await requirePermission("services.write");
  const params = await searchParams;
  const [services, categories] = await Promise.all([
    db.service.findMany({ include: { category: true }, orderBy: [{ order: "asc" }, { title: "asc" }] }),
    db.serviceCategory.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Website content"
        title="Services"
        description={`${services.length} service${services.length === 1 ? "" : "s"} across ${categories.length} categories. Add unlimited services, control publishing and manage categories.`}
        actions={
          <>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/services/categories">
                <FolderTree className="h-3.5 w-3.5" />
                Categories
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/admin/services/new">
                <Plus className="h-3.5 w-3.5" />
                Add service
              </Link>
            </Button>
          </>
        }
      />
      <FeedbackBanner params={params} />

      {services.length === 0 ? (
        <EmptyState
          title="No services yet"
          description="Create the first service to populate the public services page, homepage and chatbot knowledge base."
          action={
            <Button asChild>
              <Link href="/admin/services/new">
                <Plus className="h-4 w-4" />
                Add service
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-navy-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="admin-table w-full">
              <thead>
                <tr className="bg-navy-50/50">
                  <th>Service</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Order</th>
                  <th>Updated</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <Link
                          href={`/admin/services/${service.id}`}
                          className="font-medium text-navy-900 hover:text-gold-700"
                        >
                          {service.title}
                        </Link>
                        {service.isFeatured && <Badge variant="gold">Featured</Badge>}
                      </div>
                      <p className="mt-0.5 font-mono text-[0.65rem] text-navy-400">/{service.slug}</p>
                    </td>
                    <td className="text-[0.75rem] text-navy-500">{service.category?.name ?? "Uncategorised"}</td>
                    <td>
                      <StatusBadge status={service.status} />
                    </td>
                    <td className="text-[0.72rem] text-navy-400">{service.order}</td>
                    <td className="whitespace-nowrap text-[0.72rem] text-navy-400">
                      {formatDate(service.updatedAt)}
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        {service.status === "PUBLISHED" && (
                          <Button asChild variant="ghost" size="icon" title="View live page">
                            <a href={`/services/${service.slug}`} target="_blank" rel="noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <Button asChild variant="ghost" size="icon" title="Edit service">
                          <Link href={`/admin/services/${service.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DeleteButton
                          action={deleteService}
                          id={service.id}
                          name={service.title}
                          title="Delete this service?"
                          description="This removes the sample service from the current demo session. It is restored on reload or restart."
                          compact
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-6 rounded-lg border border-navy-100 bg-white p-5">
        <p className="text-[0.72rem] leading-6 text-navy-500">
          <span className="font-semibold text-navy-800">Publishing note:</span> the public services
          page only shows services with status <em>Published</em> and categories marked visible.
          Descriptions should avoid guarantees, unsubstantiated statistics and any implication of
          qualifications the firm does not hold. Service pages carry a professional scope disclaimer.
        </p>
      </div>
    </>
  );
}
