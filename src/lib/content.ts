import { cache } from "react";
import type { NavLocation } from "@prisma/client";
import { db } from "@/lib/db";

export const getSettings = cache(async () => {
  const settings = await db.websiteSettings.findUnique({ where: { id: "main" } });
  if (!settings) {
    throw new Error("Website settings are not initialised. Run the database seed.");
  }
  return settings;
});

export const getHomeContent = cache(async () => {
  const content = await db.homePageContent.findUnique({ where: { id: "main" } });
  if (!content) throw new Error("Home page content is not initialised. Run the database seed.");
  return content;
});

export const getAboutContent = cache(async () => {
  const content = await db.aboutPageContent.findUnique({ where: { id: "main" } });
  if (!content) throw new Error("About page content is not initialised. Run the database seed.");
  return content;
});

export const getSeoSettings = cache(async () => {
  return db.sEOSettings.findUnique({ where: { id: "main" } });
});

export const getNavigation = cache(async (location: NavLocation) => {
  return db.navItem.findMany({
    where: { location, isVisible: true },
    orderBy: [{ order: "asc" }, { label: "asc" }],
  });
});

export const getAllNavigation = cache(async () => {
  return db.navItem.findMany({
    orderBy: [{ location: "asc" }, { order: "asc" }, { label: "asc" }],
  });
});

export const getSocialLinks = cache(async () => {
  return db.socialLink.findMany({
    where: { isVisible: true },
    orderBy: [{ order: "asc" }],
  });
});

export const getServices = cache(async (options: { includeDrafts?: boolean } = {}) => {
  return db.service.findMany({
    where: options.includeDrafts ? {} : { status: "PUBLISHED" },
    include: { category: true },
    orderBy: [{ order: "asc" }, { title: "asc" }],
  });
});

export const getFeaturedServices = cache(async () => {
  return db.service.findMany({
    where: { status: "PUBLISHED", isFeatured: true },
    include: { category: true },
    orderBy: [{ order: "asc" }],
    take: 6,
  });
});

export const getServiceBySlug = cache(async (slug: string) => {
  return db.service.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { category: true },
  });
});

export const getServiceById = cache(async (id: string) => {
  return db.service.findUnique({ where: { id }, include: { category: true } });
});

export const getServiceCategories = cache(async (includeHidden = false) => {
  return db.serviceCategory.findMany({
    where: includeHidden ? {} : { isVisible: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });
});

export const getPublishedTestimonials = cache(async () => {
  return db.testimonial.findMany({
    where: { isApproved: true, isPublished: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
});

export const getPublishedFAQs = cache(async () => {
  return db.fAQ.findMany({
    where: { isPublished: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
});

export const getLegalPage = cache(async (slug: string) => {
  return db.legalPage.findFirst({
    where: { slug, status: "PUBLISHED" },
  });
});

export const getLegalPages = cache(async () => {
  return db.legalPage.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { title: "asc" },
    select: { id: true, title: true, slug: true, updatedAt: true },
  });
});

export const getStats = cache(async () => {
  return db.stat.findMany({ where: { isVisible: true }, orderBy: { order: "asc" } });
});

export const getWhyChooseItems = cache(async () => {
  return db.whyChooseItem.findMany({ where: { isVisible: true }, orderBy: { order: "asc" } });
});

export const getExpertiseItems = cache(async () => {
  return db.expertiseItem.findMany({ where: { isVisible: true }, orderBy: { order: "asc" } });
});

export const getValues = cache(async () => {
  return db.valueItem.findMany({ where: { isVisible: true }, orderBy: { order: "asc" } });
});

export const getTeamMembers = cache(async () => {
  return db.teamMember.findMany({ where: { isVisible: true }, orderBy: { order: "asc" } });
});
