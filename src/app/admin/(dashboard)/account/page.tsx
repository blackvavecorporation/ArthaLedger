import { LogOut, ShieldCheck } from "lucide-react";
import { db } from "@/lib/db";
import { logoutAction } from "@/actions/auth";
import { requireUser } from "@/lib/auth";
import { ROLE_PERMISSIONS } from "@/lib/permissions";
import { PageHeader } from "@/components/admin/page-header";
import { ChangePasswordForm } from "./change-password-form";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await requireUser();
  const record = await db.adminUser.findUnique({
    where: { id: user.id },
    include: { role: true },
  });

  return (
    <>
      <PageHeader
        eyebrow="Demo account"
        title="My account"
        description="A sample profile and permission view. The demo password is fixed and cannot be changed."
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-xl border border-navy-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy-950 font-display text-lg text-gold-300">
                {user.name
                  .split(" ")
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")}
              </span>
              <div>
                <h2 className="font-display text-2xl font-semibold text-navy-950">{user.name}</h2>
                <p className="text-[0.8rem] text-navy-500">{user.email}</p>
                <p className="mt-1 inline-flex rounded-full bg-gold-50 px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wide text-gold-800">
                  {record?.role.name.replaceAll("_", " ")}
                </p>
              </div>
            </div>
            <dl className="mt-6 grid gap-3 border-t border-navy-100 pt-5 text-[0.74rem] sm:grid-cols-2">
              <div>
                <dt className="text-navy-400">Last sign-in</dt>
                <dd className="mt-0.5 text-navy-700">{formatDate(record?.lastLoginAt, true)}</dd>
              </div>
              <div>
                <dt className="text-navy-400">Account created</dt>
                <dd className="mt-0.5 text-navy-700">{formatDate(record?.createdAt)}</dd>
              </div>
            </dl>
            <form action={logoutAction} className="mt-6 border-t border-navy-100 pt-5">
              <button
                type="submit"
                className="inline-flex h-9 items-center gap-2 rounded-md border border-navy-200 px-3.5 text-[0.74rem] font-medium text-navy-700 hover:bg-navy-50"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out of this session
              </button>
            </form>
          </div>

          <div className="rounded-xl border border-navy-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-gold-600" />
              <h2 className="font-display text-xl font-semibold text-navy-950">Effective permissions</h2>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {ROLE_PERMISSIONS[user.role].map((permission) => (
                <span
                  key={permission}
                  className="rounded border border-navy-100 bg-navy-50 px-2 py-1 font-mono text-[0.6rem] text-navy-500"
                >
                  {permission}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-navy-100 bg-white p-6 shadow-sm">
          <h2 className="font-display text-xl font-semibold text-navy-950">Change password</h2>
          <p className="mb-5 mt-1 text-[0.76rem] leading-6 text-navy-500">
            Use a unique password for this admin account. Never reuse a personal or shared password.
          </p>
          <ChangePasswordForm />
        </div>
      </div>
    </>
  );
}
