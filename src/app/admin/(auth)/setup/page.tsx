import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { SetupForm } from "./setup-form";

export const metadata: Metadata = {
  title: "First-run setup",
  robots: { index: false, follow: false },
};

export default async function SetupPage() {
  const user = await getCurrentUser();
  if (user) redirect("/admin");

  const adminCount = await db.adminUser.count().catch(() => -1);
  const setupEnabled = Boolean(process.env.ADMIN_SETUP_TOKEN);

  return (
    <div>
      <p className="eyebrow">Controlled setup</p>
      <h1 className="mt-4 font-display text-4xl font-medium tracking-tight text-navy-950">
        Create the first administrator.
      </h1>
      <p className="mt-3 text-sm leading-6 text-navy-500">
        This one-time flow is available only while no admin account exists. It requires the
        <code className="mx-1 rounded bg-navy-50 px-1 py-0.5 text-[0.72rem] text-navy-700">
          ADMIN_SETUP_TOKEN
        </code>
        configured on the server.
      </p>

      {adminCount > 0 ? (
        <div className="mt-8 rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900">
          Setup has already been completed.
          <Link href="/admin/login" className="mt-3 block font-semibold underline">
            Go to sign in →
          </Link>
        </div>
      ) : adminCount === -1 ? (
        <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          The database is not reachable. Check DATABASE_URL and run migrations before setup.
        </div>
      ) : !setupEnabled ? (
        <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          First-run setup is disabled because ADMIN_SETUP_TOKEN is not set. Add a strong token to the
          server environment and restart the application.
        </div>
      ) : (
        <SetupForm />
      )}
    </div>
  );
}
