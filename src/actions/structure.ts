"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { audit, requirePermission } from "@/lib/auth";
import {
  contentItemSchema,
  formValue,
  isChecked,
  navItemSchema,
  socialLinkSchema,
  statSchema,
  teamMemberSchema,
} from "@/lib/admin-schemas";

function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function success(path: string): never {
  redirect(`${path}?saved=1`);
}

function refreshSite() {
  revalidatePath("/", "layout");
}

async function deleteAndRedirect(params: {
  permission: "settings.write" | "content.write";
  entity: "NavItem" | "SocialLink" | "Stat" | "WhyChooseItem" | "ExpertiseItem" | "ValueItem" | "TeamMember";
  id: string;
  path: string;
  action: string;
}) {
  const user = await requirePermission(params.permission);
  if (!params.id) fail(params.path, "Missing item reference.");
  try {
    if (params.entity === "NavItem") await db.navItem.delete({ where: { id: params.id } });
    if (params.entity === "SocialLink") await db.socialLink.delete({ where: { id: params.id } });
    if (params.entity === "Stat") await db.stat.delete({ where: { id: params.id } });
    if (params.entity === "WhyChooseItem") await db.whyChooseItem.delete({ where: { id: params.id } });
    if (params.entity === "ExpertiseItem") await db.expertiseItem.delete({ where: { id: params.id } });
    if (params.entity === "ValueItem") await db.valueItem.delete({ where: { id: params.id } });
    if (params.entity === "TeamMember") await db.teamMember.delete({ where: { id: params.id } });
  } catch (error) {
    console.error(error);
    fail(params.path, "The item could not be deleted. It may already have been removed.");
  }
  await audit({ userId: user.id, action: params.action, entity: params.entity, entityId: params.id });
  refreshSite();
  redirect(`${params.path}?deleted=1`);
}

export async function saveNavItem(formData: FormData) {
  const user = await requirePermission("settings.write");
  const id = formValue(formData, "id");
  const parsed = navItemSchema.safeParse({
    label: formValue(formData, "label"),
    href: formValue(formData, "href"),
    location: formValue(formData, "location"),
    order: formValue(formData, "order"),
  });
  if (!parsed.success) return fail("/admin/content/navigation", parsed.error.issues[0]?.message ?? "Invalid navigation item.");
  const data = { ...parsed.data, isVisible: isChecked(formData, "isVisible"), isExternal: isChecked(formData, "isExternal") };

  if (id) await db.navItem.update({ where: { id }, data });
  else await db.navItem.create({ data });
  await audit({ userId: user.id, action: id ? "nav.updated" : "nav.created", entity: "NavItem", entityId: id || null });
  refreshSite();
  success("/admin/content/navigation");
}

export async function deleteNavItem(formData: FormData) {
  await deleteAndRedirect({
    permission: "settings.write",
    entity: "NavItem",
    id: formValue(formData, "id"),
    path: "/admin/content/navigation",
    action: "nav.deleted",
  });
}

export async function saveSocialLink(formData: FormData) {
  const user = await requirePermission("settings.write");
  const id = formValue(formData, "id");
  const parsed = socialLinkSchema.safeParse({
    platform: formValue(formData, "platform"),
    url: formValue(formData, "url"),
    order: formValue(formData, "order"),
  });
  if (!parsed.success) return fail("/admin/content/footer", parsed.error.issues[0]?.message ?? "Invalid social link.");
  const data = { ...parsed.data, isVisible: isChecked(formData, "isVisible") };

  if (id) await db.socialLink.update({ where: { id }, data });
  else await db.socialLink.create({ data });
  await audit({ userId: user.id, action: id ? "social.updated" : "social.created", entity: "SocialLink", entityId: id || null });
  refreshSite();
  success("/admin/content/footer");
}

export async function deleteSocialLink(formData: FormData) {
  await deleteAndRedirect({
    permission: "settings.write",
    entity: "SocialLink",
    id: formValue(formData, "id"),
    path: "/admin/content/footer",
    action: "social.deleted",
  });
}

export async function saveStat(formData: FormData) {
  const user = await requirePermission("content.write");
  const id = formValue(formData, "id");
  const parsed = statSchema.safeParse({
    label: formValue(formData, "label"),
    value: formValue(formData, "value"),
    description: formValue(formData, "description"),
    order: formValue(formData, "order"),
  });
  if (!parsed.success) return fail("/admin/content/home", parsed.error.issues[0]?.message ?? "Invalid statistic.");
  const data = { ...parsed.data, isVisible: isChecked(formData, "isVisible") };

  if (id) await db.stat.update({ where: { id }, data });
  else await db.stat.create({ data });
  await audit({ userId: user.id, action: id ? "stat.updated" : "stat.created", entity: "Stat", entityId: id || null });
  refreshSite();
  success("/admin/content/home");
}

export async function deleteStat(formData: FormData) {
  await deleteAndRedirect({
    permission: "content.write",
    entity: "Stat",
    id: formValue(formData, "id"),
    path: "/admin/content/home",
    action: "stat.deleted",
  });
}

export async function saveContentItem(formData: FormData) {
  const user = await requirePermission("content.write");
  const kind = formValue(formData, "kind");
  const id = formValue(formData, "id");
  const parsed = contentItemSchema.safeParse({
    title: formValue(formData, "title"),
    description: formValue(formData, "description"),
    icon: formValue(formData, "icon"),
    order: formValue(formData, "order"),
  });
  if (!parsed.success) return fail(pathForKind(kind), parsed.error.issues[0]?.message ?? "Invalid item.");
  const data = { ...parsed.data, isVisible: isChecked(formData, "isVisible") };

  if (kind === "why") {
    if (id) await db.whyChooseItem.update({ where: { id }, data });
    else await db.whyChooseItem.create({ data });
  } else if (kind === "expertise") {
    if (id) await db.expertiseItem.update({ where: { id }, data });
    else await db.expertiseItem.create({ data });
  } else if (kind === "value") {
    if (id) await db.valueItem.update({ where: { id }, data });
    else await db.valueItem.create({ data });
  } else {
    return fail("/admin/content/home", "Unknown content item type.");
  }

  await audit({
    userId: user.id,
    action: `${kind}.${id ? "updated" : "created"}`,
    entity: kind,
    entityId: id || null,
  });
  refreshSite();
  success(pathForKind(kind));
}

function pathForKind(kind: string) {
  return kind === "value" ? "/admin/content/about" : "/admin/content/home";
}

export async function deleteContentItem(formData: FormData) {
  const kind = formValue(formData, "kind");
  const id = formValue(formData, "id");
  const path = pathForKind(kind);
  const user = await requirePermission("content.write");
  if (!id) fail(path, "Missing item reference.");

  try {
    if (kind === "why") await db.whyChooseItem.delete({ where: { id } });
    else if (kind === "expertise") await db.expertiseItem.delete({ where: { id } });
    else if (kind === "value") await db.valueItem.delete({ where: { id } });
    else fail(path, "Unknown content item type.");
  } catch (error) {
    console.error(error);
    fail(path, "The item could not be deleted.");
  }
  await audit({ userId: user.id, action: `${kind}.deleted`, entity: kind, entityId: id });
  refreshSite();
  redirect(`${path}?deleted=1`);
}

export async function saveTeamMember(formData: FormData) {
  const user = await requirePermission("content.write");
  const id = formValue(formData, "id");
  const parsed = teamMemberSchema.safeParse({
    name: formValue(formData, "name"),
    designation: formValue(formData, "designation"),
    qualifications: formValue(formData, "qualifications"),
    bio: formValue(formData, "bio"),
    imageUrl: formValue(formData, "imageUrl"),
    linkedinUrl: formValue(formData, "linkedinUrl"),
    order: formValue(formData, "order"),
  });
  if (!parsed.success) return fail("/admin/content/about", parsed.error.issues[0]?.message ?? "Invalid team member.");
  const data = { ...parsed.data, isVisible: isChecked(formData, "isVisible") };

  if (id) await db.teamMember.update({ where: { id }, data });
  else await db.teamMember.create({ data });
  await audit({ userId: user.id, action: id ? "team.updated" : "team.created", entity: "TeamMember", entityId: id || null });
  refreshSite();
  success("/admin/content/about");
}

export async function deleteTeamMember(formData: FormData) {
  await deleteAndRedirect({
    permission: "content.write",
    entity: "TeamMember",
    id: formValue(formData, "id"),
    path: "/admin/content/about",
    action: "team.deleted",
  });
}
