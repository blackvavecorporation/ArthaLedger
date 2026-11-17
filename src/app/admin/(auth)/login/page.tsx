import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./login-form";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/admin");

  const adminCount = await db.adminUser.count().catch(() => 0);

  return (
    <div>
      <p className="eyebrow">Admin access</p>
      <h1 className="mt-4 font-display text-4xl font-medium tracking-tight text-navy-950">
        Welcome back.
      </h1>
      <p className="mt-3 text-sm leading-6 text-navy-500">
        Sign in to manage the website and client enquiries.
      </p>
      <LoginForm />
      {adminCount === 0 && (
        <p className="mt-6 rounded-lg border border-gold-200 bg-gold-50 px-4 py-3 text-[0.75rem] leading-5 text-gold-900">
          No administrator exists yet.{" "}
          <Link href="/admin/setup" className="font-semibold underline">
            Complete first-run setup
          </Link>{" "}
          using the setup token from the server environment.
        </p>
      )}
      <p className="mt-6 text-[0.7rem] leading-5 text-navy-400">
        Access is limited to authorised firm personnel. Accounts are protected by role-based
        permissions and session security.
      </p>
    </div>
  );
}
