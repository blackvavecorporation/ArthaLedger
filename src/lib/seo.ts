import type { Metadata } from "next";
import { getSeoSettings, getSettings } from "@/lib/content";
import { absoluteUrl, truncate } from "@/lib/utils";

export const FALLBACK_TITLE = "ArthaLedger | Chartered Accountancy & Business Advisory";
export const FALLBACK_DESCRIPTION =
  "ArthaLedger provides accounting, tax, GST, registration, compliance and business advisory services for Indian businesses.";

export async function getRootMetadata(): Promise<Metadata> {
  try {
    const [seo, settings] = await Promise.all([getSeoSettings(), getSettings()]);
    const description = seo?.description ?? FALLBACK_DESCRIPTION;
    const ogImage = seo?.ogImageUrl ? absoluteUrl(seo.ogImageUrl) : undefined;
    return {
      metadataBase: new URL(seo?.canonicalBase || absoluteUrl("/")),
      title: {
        default: seo?.siteTitle ?? FALLBACK_TITLE,
        template: seo?.titleTemplate ?? "%s | ArthaLedger",
      },
      description,
      keywords: seo?.keywords ?? undefined,
      applicationName: settings.brandName,
      authors: [{ name: settings.brandName }],
      creator: settings.brandName,
      alternates: { canonical: "/" },
      openGraph: {
        type: "website",
        locale: "en_IN",
        siteName: settings.brandName,
        title: seo?.siteTitle ?? FALLBACK_TITLE,
        description,
        url: absoluteUrl("/"),
        images: ogImage ? [{ url: ogImage }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: seo?.siteTitle ?? FALLBACK_TITLE,
        description,
        images: ogImage ? [ogImage] : undefined,
        site: seo?.twitterHandle ?? undefined,
      },
      robots: { index: true, follow: true },
      icons: {
        icon: settings.faviconUrl || "/favicon.svg",
      },
    };
  } catch {
    return {
      metadataBase: new URL(absoluteUrl("/")),
      title: { default: FALLBACK_TITLE, template: "%s | ArthaLedger" },
      description: FALLBACK_DESCRIPTION,
    };
  }
}

export async function pageMetadata(options: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  noIndex?: boolean;
  type?: "website" | "article";
}): Promise<Metadata> {
  let siteName = "ArthaLedger";
  let seoOgImage: string | null = null;
  let base = absoluteUrl("/");
  try {
    const [settings, seo] = await Promise.all([getSettings(), getSeoSettings()]);
    siteName = settings.brandName;
    seoOgImage = seo?.ogImageUrl ?? null;
    base = seo?.canonicalBase || base;
  } catch {
    // Metadata must remain renderable even if the database is not yet initialised.
  }
  const description = truncate(options.description, 300);
  const image = options.image || seoOgImage;
  const url = `${base.replace(/\/$/, "")}${options.path.startsWith("/") ? options.path : `/${options.path}`}`;
  return {
    title: options.title,
    description,
    alternates: { canonical: options.path },
    robots: options.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: options.type ?? "website",
      locale: "en_IN",
      siteName,
      title: options.title,
      description,
      url,
      images: image ? [{ url: image.startsWith("http") ? image : `${base.replace(/\/$/, "")}${image.startsWith("/") ? image : `/${image}`}` }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: options.title,
      description,
      images: image ? [image.startsWith("http") ? image : `${base.replace(/\/$/, "")}${image.startsWith("/") ? image : `/${image}`}`] : undefined,
    },
  };
}
