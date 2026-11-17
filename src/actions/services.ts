"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { audit, requirePermission } from "@/lib/auth";
import { categorySchema, formValue, isChecked, serviceSchema } from "@/lib/admin-schemas";
import { slugify } from "@/lib/utils";

function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function saveService(formData: FormData) {
  const user = await requirePermission("services.write");
  const id = formValue(formData, "id");
  const path = id ? `/admin/services/${id}` : "/admin/services/new";
  const parsed = serviceSchema.safeParse({
    title: formValue(formData, "title"),
    slug: formValue(formData, "slug"),
    categoryId: formValue(formData, "categoryId"),
    shortDescription: formValue(formData, "shortDescription"),
    description: formValue(formData, "description"),
    icon: formValue(formData, "icon"),
    imageUrl: formValue(formData, "imageUrl"),
    benefits: formValue(formData, "benefits")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
    ctaLabel: formValue(formData, "ctaLabel"),
    status: formValue(formData, "status"),
    order: formValue(formData, "order"),
    seoTitle: formValue(formData, "seoTitle"),
    seoDescription: formValue(formData, "seoDescription"),
  });
  if (!parsed.success) return fail(path, parsed.error.issues[0]?.message ?? "Invalid service details.");

  const slug = parsed.data.slug || slugify(parsed.data.title);
  if (!slug) return fail(path, "Could not generate a slug. Enter one manually.");

  const duplicate = await db.service.findFirst({
    where: { slug, ...(id ? { NOT: { id } } : {}) },
    select: { id: true },
  });
  if (duplicate) return fail(path, "That slug is already used by another service.");

  let categoryId: string | null = null;
  if (parsed.data.categoryId) {
    const category = await db.serviceCategory.findUnique({ where: { id: parsed.data.categoryId } });
    categoryId = category?.id ?? null;
  }

  const data = {
    title: parsed.data.title,
    slug,
    categoryId,
    shortDescription: parsed.data.shortDescription,
    description: parsed.data.description,
    icon: parsed.data.icon,
    imageUrl: parsed.data.imageUrl,
    benefits: parsed.data.benefits,
    ctaLabel: parsed.data.ctaLabel,
    status: parsed.data.status,
    order: parsed.data.order,
    seoTitle: parsed.data.seoTitle,
    seoDescription: parsed.data.seoDescription,
    isFeatured: isChecked(formData, "isFeatured"),
  };

  try {
    if (id) await db.service.update({ where: { id }, data });
    else await db.service.create({ data });
  } catch (error) {
    console.error(error);
    return fail(path, "The service could not be saved. Please review the details and try again.");
  }

  await audit({
    userId: user.id,
    action: id ? "service.updated" : "service.created",
    entity: "Service",
    entityId: id || null,
    details: { slug, status: data.status },
  });
  revalidatePath("/", "layout");
  redirect(`/admin/services?saved=1`);
}

export async function deleteService(formData: FormData) {
  const user = await requirePermission("services.write");
  const id = formValue(formData, "id");
  if (!id) fail("/admin/services", "Missing service reference.");

  const service = await db.service.findUnique({ where: { id } });
  if (!service) fail("/admin/services", "Service not found.");
  await db.service.delete({ where: { id } });
  await audit({
    userId: user.id,
    action: "service.deleted",
    entity: "Service",
    entityId: id,
    details: { title: service.title, slug: service.slug },
  });
  revalidatePath("/", "layout");
  redirect("/admin/services?deleted=1");
}

export async function saveCategory(formData: FormData) {
  const user = await requirePermission("services.write");
  const id = formValue(formData, "id");
  const parsed = categorySchema.safeParse({
    name: formValue(formData, "name"),
    slug: formValue(formData, "slug"),
    description: formValue(formData, "description"),
    order: formValue(formData, "order"),
  });
  if (!parsed.success) return fail("/admin/services/categories", parsed.error.issues[0]?.message ?? "Invalid category.");

  const duplicate = await db.serviceCategory.findFirst({
    where: { slug: parsed.data.slug, ...(id ? { NOT: { id } } : {}) },
    select: { id: true },
  });
  if (duplicate) return fail("/admin/services/categories", "That category slug is already in use.");

  const data = { ...parsed.data, isVisible: isChecked(formData, "isVisible") };
  if (id) await db.serviceCategory.update({ where: { id }, data });
  else await db.serviceCategory.create({ data });

  await audit({
    userId: user.id,
    action: id ? "category.updated" : "category.created",
    entity: "ServiceCategory",
    entityId: id || null,
  });
  revalidatePath("/", "layout");
  redirect("/admin/services/categories?saved=1");
}

export async function deleteCategory(formData: FormData) {
  const user = await requirePermission("services.write");
  const id = formValue(formData, "id");
  if (!id) fail("/admin/services/categories", "Missing category reference.");

  const serviceCount = await db.service.count({ where: { categoryId: id } });
  if (serviceCount > 0) {
    fail(
      "/admin/services/categories",
      `This category is assigned to ${serviceCount} service(s). Move them to another category before deleting it.`,
    );
  }
  const category = await db.serviceCategory.delete({ where: { id } });
  await audit({
    userId: user.id,
    action: "category.deleted",
    entity: "ServiceCategory",
    entityId: id,
    details: { name: category.name },
  });
  revalidatePath("/", "layout");
  redirect("/admin/services/categories?deleted=1");
}
