import type { MetadataRoute } from "next";
import { getLegalPages, getServices } from "@/lib/content";
import { getSiteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/testimonials`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  try {
    const [services, legalPages] = await Promise.all([getServices(), getLegalPages()]);
    return [
      ...staticRoutes,
      ...services.map((service) => ({
        url: `${base}/services/${service.slug}`,
        lastModified: service.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
      ...legalPages.map((page) => ({
        url: `${base}/legal/${page.slug}`,
        lastModified: page.updatedAt,
        changeFrequency: "yearly" as const,
        priority: 0.3,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
