import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { PageHeader } from "@/components/admin/page-header";
import { ServiceForm } from "../service-form";

export const dynamic = "force-dynamic";

export default async function NewServicePage() {
  await requirePermission("services.write");
  const [categories, last] = await Promise.all([
    db.serviceCategory.findMany({ orderBy: { order: "asc" } }),
    db.service.findFirst({ orderBy: { order: "desc" }, select: { order: true } }),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Add a service"
        description="Create a new public service page. It starts as a draft until you are ready to publish."
      />
      <ServiceForm categories={categories} nextOrder={(last?.order ?? 0) + 1} />
    </>
  );
}
