import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText, Scale } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { SimpleMarkdown } from "@/components/simple-markdown";
import { getLegalPage, getLegalPages } from "@/lib/content";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getLegalPage(slug).catch(() => null);
  if (!page) {
    const preview = (await searchParams).preview === "1";
    const user = preview ? await getCurrentUser().catch(() => null) : null;
    if (preview && user && can(user.role, "content.read")) {
      return { title: "Legal page preview", robots: { index: false, follow: false } };
    }
    return { title: "Page not found" };
  }
  return pageMetadata({
    title: page.seoTitle || page.title,
    description: page.seoDescription || `${page.title} for the ArthaLedger website.`,
    path: `/legal/${page.slug}`,
  });
}

export default async function LegalPage({ params, searchParams }: Props) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  let page = await getLegalPage(slug);
  if (!page && query.preview === "1") {
    const user = await getCurrentUser();
    if (user && can(user.role, "content.read")) {
      page = await db.legalPage.findUnique({ where: { slug } });
    }
  }
  if (!page) notFound();
  const allPages = await getLegalPages();
  const isPreview = page.status !== "PUBLISHED";

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title={page.title}
        description={`Last updated ${formatDate(page.updatedAt)}. Please read this page carefully.`}
        breadcrumb={[{ label: "Home", href: "/" }, { label: page.title }]}
      />

      {isPreview && (
        <div className="border-b border-amber-200 bg-amber-50">
          <div className="container flex flex-wrap items-center gap-3 py-3">
            <Badge variant="warning">Admin preview</Badge>
            <p className="text-[0.72rem] text-amber-900">
              This legal page is a draft and is not visible to the public.
            </p>
            <Link href={`/admin/legal/${page.id}`} className="ml-auto text-[0.7rem] font-semibold text-amber-900 underline">
              Edit page
            </Link>
          </div>
        </div>
      )}

      <section className="section bg-ivory">
        <div className="container grid gap-10 lg:grid-cols-[1fr_17rem]">
          <article className="rounded-xl border border-navy-100 bg-white p-6 shadow-soft md:p-10">
            <div className="mb-8 flex items-center gap-3 border-b border-navy-100 pb-5">
              <span className="flex h-10 w-10 items-center justify-center border border-gold-200 bg-gold-50 text-gold-700">
                <Scale className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-navy-400">
                  Website policy
                </p>
                <p className="text-sm font-medium text-navy-800">
                  Effective {formatDate(page.updatedAt)}
                </p>
              </div>
            </div>
            <SimpleMarkdown content={page.content} />
            <div className="mt-10 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="text-[0.7rem] leading-6 text-amber-900">
                These policies may contain placeholders or draft language prepared for review. The
                firm should complete its legal details and obtain professional legal review before
                relying on the published text.
              </p>
            </div>
          </article>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-xl border border-navy-100 bg-white p-5">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-navy-400">
                Legal pages
              </p>
              <nav className="mt-3 space-y-1">
                {allPages.map((item) => (
                  <Link
                    key={item.id}
                    href={`/legal/${item.slug}`}
                    className={`flex items-center gap-2 rounded-md px-2.5 py-2 text-[0.78rem] transition-colors ${
                      item.slug === page.slug
                        ? "bg-navy-50 font-semibold text-navy-900"
                        : "text-navy-500 hover:bg-navy-50 hover:text-navy-800"
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5 text-gold-600" />
                    {item.title}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="mt-4 rounded-xl border border-navy-100 bg-white p-5 text-[0.72rem] leading-6 text-navy-500">
              Questions about this policy?{" "}
              <Link href="/contact" className="font-semibold text-gold-700 underline">
                Contact the firm
              </Link>
              .
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
