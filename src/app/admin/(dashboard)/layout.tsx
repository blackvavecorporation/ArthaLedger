import { redirect } from "next/navigation";
import { logoutAction } from "@/actions/auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { getCurrentUser } from "@/lib/auth";
import { ADMIN_NAV_GROUPS } from "@/lib/admin-nav";
import { can } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const allowedHrefs = ADMIN_NAV_GROUPS.flatMap((group) => group.items)
    .filter((item) => item.permission === null || can(user.role, item.permission))
    .map((item) => item.href);

  return (
    <AdminShell
      user={{ name: user.name, email: user.email, roleLabel: user.roleLabel }}
      allowedHrefs={allowedHrefs}
      logoutAction={logoutAction}
    >
      {children}
    </AdminShell>
  );
}
