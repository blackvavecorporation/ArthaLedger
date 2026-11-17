import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { NavEditor } from "@/components/admin/items-editor";
import { FeedbackBanner, type AdminSearchParams } from "@/components/admin/feedback";
import { PageHeader } from "@/components/admin/page-header";

export const dynamic = "force-dynamic";

export default async function NavigationSettingsPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>;
}) {
  await requirePermission("settings.write");
  const params = await searchParams;
  const items = await db.navItem.findMany({
    where: { location: "HEADER" },
    orderBy: [{ order: "asc" }, { label: "asc" }],
  });

  return (
    <>
      <PageHeader
        eyebrow="Site setup"
        title="Navbar"
        description="Manage the main navigation links. Links are ordered by the display order value and can be hidden without deletion."
      />
      <FeedbackBanner params={params} />
      <NavEditor items={items} location="HEADER" />
      <div className="mt-6 rounded-lg border border-navy-100 bg-white p-5">
        <p className="text-[0.72rem] leading-6 text-navy-500">
          <span className="font-semibold text-navy-800">Fixed navigation elements:</span> the brand
          logo, Login button (to <code className="rounded bg-navy-50 px-1">/admin/login</code>) and the
          gold consultation button are part of the interface design and remain available regardless of
          the links above. Internal links use paths such as <code className="rounded bg-navy-50 px-1">/services</code>;
          external links require a full https:// URL.
        </p>
      </div>
    </>
  );
}
