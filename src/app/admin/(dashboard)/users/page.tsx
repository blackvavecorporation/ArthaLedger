import { KeyRound, Plus, UserCog } from "lucide-react";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { createAdminUser, resetAdminUserPassword, updateAdminUser } from "@/actions/users";
import { FeedbackBanner, type AdminSearchParams } from "@/components/admin/feedback";
import { PageHeader } from "@/components/admin/page-header";
import { SubmitButton } from "@/components/admin/submit-button";
import { CheckboxField, Field, FormSection } from "@/components/admin/form";
import { ROLE_PERMISSIONS } from "@/lib/permissions";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>;
}) {
  const actor = await requirePermission("users.manage");
  const params = await searchParams;
  const users = await db.adminUser.findMany({ include: { role: true }, orderBy: { createdAt: "asc" } });

  return (
    <>
      <PageHeader
        eyebrow="Security"
        title="Admin users"
        description="Manage who can access the admin dashboard and what they can do. Only SUPER_ADMIN accounts can access this page."
      />
      <FeedbackBanner params={params} />

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="space-y-4">
          {users.map((user) => {
            const formId = `user-${user.id}`;
            const passwordFormId = `password-${user.id}`;
            return (
              <div key={user.id} className="rounded-xl border border-navy-100 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-950 text-[0.7rem] font-semibold text-gold-300">
                      {user.name
                        .split(" ")
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join("")}
                    </span>
                    <div>
                      <p className="font-medium text-navy-900">
                        {user.name}
                        {user.id === actor.id && (
                          <span className="ml-2 rounded bg-gold-50 px-1.5 py-0.5 text-[0.58rem] font-semibold uppercase text-gold-800">
                            You
                          </span>
                        )}
                      </p>
                      <p className="text-[0.7rem] text-navy-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right text-[0.65rem] text-navy-400">
                    <p className={user.isActive ? "font-medium text-emerald-700" : "font-medium text-red-600"}>
                      {user.isActive ? "Active" : "Deactivated"}
                    </p>
                    <p className="mt-0.5">Last sign-in: {formatDate(user.lastLoginAt, true)}</p>
                  </div>
                </div>

                <form id={formId} action={updateAdminUser} className="mt-4 grid gap-4 border-t border-navy-100 pt-4 md:grid-cols-[1fr_auto]">
                  <input type="hidden" name="id" value={user.id} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Role" htmlFor={`role-${user.id}`}>
                      <select id={`role-${user.id}`} name="role" defaultValue={user.role.name} className="admin-input">
                        <option value="SUPER_ADMIN">Super admin — full access</option>
                        <option value="ADMIN">Administrator — content & client desk</option>
                        <option value="EDITOR">Content editor — website content</option>
                      </select>
                    </Field>
                    <div className="flex items-end">
                      <CheckboxField label="Active account" name="isActive" defaultChecked={user.isActive} />
                    </div>
                  </div>
                  <div className="flex items-end justify-end">
                    <SubmitButton form={formId} size="sm" pendingLabel="Saving…">
                      Update user
                    </SubmitButton>
                  </div>
                </form>

                <details className="mt-4 border-t border-navy-100 pt-3">
                  <summary className="cursor-pointer text-[0.7rem] font-medium text-navy-500 hover:text-navy-800">
                    Reset password
                  </summary>
                  <form id={passwordFormId} action={resetAdminUserPassword} className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
                    <input type="hidden" name="id" value={user.id} />
                    <Field label="New password" htmlFor={`new-password-${user.id}`} className="flex-1">
                      <input
                        id={`new-password-${user.id}`}
                        name="newPassword"
                        type="password"
                        minLength={12}
                        required
                        autoComplete="new-password"
                        className="admin-input"
                      />
                    </Field>
                    <SubmitButton form={passwordFormId} variant="outline" size="sm" pendingLabel="Resetting…">
                      <KeyRound className="h-3.5 w-3.5" />
                      Reset
                    </SubmitButton>
                  </form>
                </details>
              </div>
            );
          })}
        </div>

        <div>
          <div className="sticky top-24 space-y-4">
            <FormSection title="Add admin user" description="Create a named account with least-privilege access.">
              <form action={createAdminUser} className="space-y-4">
                <Field label="Full name" htmlFor="name">
                  <input id="name" name="name" required className="admin-input" />
                </Field>
                <Field label="Email address" htmlFor="email">
                  <input id="email" name="email" type="email" required className="admin-input" />
                </Field>
                <Field label="Temporary password" htmlFor="password" hint="At least 12 characters with a letter and number. Ask the user to change it after first sign-in.">
                  <input id="password" name="password" type="password" minLength={12} required autoComplete="new-password" className="admin-input" />
                </Field>
                <Field label="Role" htmlFor="role">
                  <select id="role" name="role" defaultValue="EDITOR" className="admin-input">
                    <option value="EDITOR">Content editor</option>
                    <option value="ADMIN">Administrator</option>
                    <option value="SUPER_ADMIN">Super admin</option>
                  </select>
                </Field>
                <SubmitButton className="w-full" pendingLabel="Creating…">
                  <Plus className="h-4 w-4" />
                  Create user
                </SubmitButton>
              </form>
            </FormSection>

            <div className="rounded-xl border border-navy-100 bg-white p-5 text-[0.68rem] leading-6 text-navy-500 shadow-sm">
              <div className="mb-2 flex items-center gap-2 text-[0.72rem] font-semibold text-navy-800">
                <UserCog className="h-4 w-4 text-gold-600" />
                Role scope
              </div>
              <p><span className="font-medium text-navy-700">Editor:</span> {ROLE_PERMISSIONS.EDITOR.length} content permissions.</p>
              <p><span className="font-medium text-navy-700">Administrator:</span> {ROLE_PERMISSIONS.ADMIN.length} permissions including enquiries and client desk.</p>
              <p><span className="font-medium text-navy-700">Super admin:</span> full access including this page and audit logs.</p>
              <p className="mt-2 text-navy-400">You cannot deactivate your own account, and at least one active super admin must remain.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
