import { Info, ShieldCheck, UserCog } from "lucide-react";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { PageHeader } from "@/components/admin/page-header";
import { FeedbackBanner, type AdminSearchParams } from "@/components/admin/feedback";
import { ROLE_PERMISSIONS } from "@/lib/permissions";
import type { RoleName } from "@/lib/demo-types";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>;
}) {
  const actor = await requirePermission("users.manage");
  const params = await searchParams;
  const users = await db.adminUser.findMany({
    include: { role: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <>
      <PageHeader
        eyebrow="Demo data"
        title="Admin users"
        description="A read-only sample account and role view. Account creation, password changes and real authentication are disabled in this demo."
      />
      <FeedbackBanner params={params} />

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="rounded-xl border border-navy-100 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-950 text-[0.7rem] font-semibold text-gold-300">
                    {user.name
                      .split(" ")
                      .slice(0, 2)
                      .map((part: string) => part[0])
                      .join("")}
                  </span>
                  <div>
                    <p className="font-medium text-navy-900">
                      {user.name}
                      {user.id === actor.id && (
                        <span className="ml-2 rounded bg-gold-50 px-1.5 py-0.5 text-[0.58rem] font-semibold uppercase text-gold-800">
                          Demo session
                        </span>
                      )}
                    </p>
                    <p className="text-[0.7rem] text-navy-400">{user.email}</p>
                  </div>
                </div>
                <div className="text-right text-[0.65rem] text-navy-400">
                  <p className={user.isActive ? "font-medium text-emerald-700" : "font-medium text-red-600"}>
                    {user.isActive ? "Active (sample)" : "Inactive (sample)"}
                  </p>
                  <p className="mt-0.5">Last sign-in: {formatDate(user.lastLoginAt, true)}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-navy-100 pt-4">
                <span className="rounded-full bg-gold-50 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-wide text-gold-800">
                  {user.role.name.replaceAll("_", " ")}
                </span>
                <span className="text-[0.68rem] text-navy-400">
                  {ROLE_PERMISSIONS[user.role.name as RoleName].length} demo permissions
                </span>
                <span className="ml-auto text-[0.65rem] text-navy-300">
                  Created {formatDate(user.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="sticky top-24 space-y-4">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-[0.72rem] leading-6 text-amber-900">
              <p className="flex items-center gap-2 font-semibold">
                <Info className="h-4 w-4" />
                Read-only demo
              </p>
              <p className="mt-2">
                User provisioning, role changes and password resets are intentionally disabled. The
                public demo login is fixed and documented. No credential is stored in a database.
              </p>
            </div>

            <div className="rounded-xl border border-navy-100 bg-white p-5 text-[0.68rem] leading-6 text-navy-500 shadow-sm">
              <div className="mb-2 flex items-center gap-2 text-[0.72rem] font-semibold text-navy-800">
                <UserCog className="h-4 w-4 text-gold-600" />
                Sample role scope
              </div>
              <p><span className="font-medium text-navy-700">Editor:</span> {ROLE_PERMISSIONS.EDITOR.length} content permissions.</p>
              <p><span className="font-medium text-navy-700">Administrator:</span> {ROLE_PERMISSIONS.ADMIN.length} permissions including sample enquiries and client desk.</p>
              <p><span className="font-medium text-navy-700">Super admin:</span> full demo navigation, including this page and audit logs.</p>
              <p className="mt-2 flex items-start gap-1.5 text-navy-400">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Permissions describe the original application's structure; they do not protect real
                accounts or data in this demo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
