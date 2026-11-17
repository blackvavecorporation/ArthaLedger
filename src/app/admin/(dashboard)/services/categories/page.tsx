import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { saveCategory, deleteCategory } from "@/actions/services";
import { CheckboxField, Field, FormGrid } from "@/components/admin/form";
import { FeedbackBanner, type AdminSearchParams } from "@/components/admin/feedback";
import { PageHeader } from "@/components/admin/page-header";
import { SubmitButton } from "@/components/admin/submit-button";
import { DeleteButton } from "@/components/admin/delete-button";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function ServiceCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>;
}) {
  await requirePermission("services.write");
  const params = await searchParams;
  const categories = await db.serviceCategory.findMany({
    include: { _count: { select: { services: true } } },
    orderBy: { order: "asc" },
  });

  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Service categories"
        description="Categories group services on the public services page. Deleting a category is blocked while services are assigned to it."
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/services">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to services
            </Link>
          </Button>
        }
      />
      <FeedbackBanner params={params} />

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="space-y-4">
          {categories.map((category) => {
            const formId = `category-${category.id}`;
            return (
              <div key={category.id} className="rounded-xl border border-navy-100 bg-white p-5 shadow-sm">
                <form id={formId} action={saveCategory} className="space-y-4">
                  <input type="hidden" name="id" value={category.id} />
                  <FormGrid>
                    <Field label="Name" htmlFor={`name-${category.id}`}>
                      <input id={`name-${category.id}`} name="name" required defaultValue={category.name} className="admin-input" />
                    </Field>
                    <Field label="Slug" htmlFor={`slug-${category.id}`}>
                      <input id={`slug-${category.id}`} name="slug" required defaultValue={category.slug} className="admin-input" />
                    </Field>
                  </FormGrid>
                  <div className="grid gap-4 md:grid-cols-[1fr_7rem]">
                    <Field label="Description" htmlFor={`description-${category.id}`}>
                      <input
                        id={`description-${category.id}`}
                        name="description"
                        defaultValue={category.description ?? ""}
                        className="admin-input"
                      />
                    </Field>
                    <Field label="Order" htmlFor={`order-${category.id}`}>
                      <input
                        id={`order-${category.id}`}
                        name="order"
                        type="number"
                        min={0}
                        max={999}
                        defaultValue={category.order}
                        className="admin-input"
                      />
                    </Field>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <CheckboxField label="Visible on website" name="isVisible" defaultChecked={category.isVisible} />
                    <span className="text-[0.68rem] text-navy-400">
                      {category._count.services} service{category._count.services === 1 ? "" : "s"}
                    </span>
                  </div>
                </form>
                <div className="mt-4 flex items-center justify-end gap-2 border-t border-navy-100 pt-3">
                  <SubmitButton form={formId} size="sm" pendingLabel="Saving…">
                    Save category
                  </SubmitButton>
                  <DeleteButton
                    action={deleteCategory}
                    id={category.id}
                    name={category.name}
                    title="Delete this category?"
                    description="Services must be moved to another category first."
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div>
          <div className="sticky top-24 rounded-xl border border-navy-100 bg-white p-5 shadow-sm">
            <h2 className="font-display text-xl font-semibold text-navy-950">Add category</h2>
            <form action={saveCategory} className="mt-4 space-y-4">
              <Field label="Name" htmlFor="new-name">
                <input id="new-name" name="name" required maxLength={100} className="admin-input" placeholder="Advisory" />
              </Field>
              <Field label="Slug" htmlFor="new-slug" hint="Lowercase letters, numbers and hyphens.">
                <input id="new-slug" name="slug" required maxLength={100} className="admin-input" placeholder="advisory" />
              </Field>
              <Field label="Description" htmlFor="new-description">
                <input id="new-description" name="description" maxLength={300} className="admin-input" />
              </Field>
              <Field label="Order" htmlFor="new-order">
                <input id="new-order" name="order" type="number" min={0} max={999} defaultValue={categories.length + 1} className="admin-input" />
              </Field>
              <CheckboxField label="Visible on website" name="isVisible" defaultChecked />
              <SubmitButton className="w-full" pendingLabel="Adding…">
                <Plus className="h-4 w-4" />
                Add category
              </SubmitButton>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
