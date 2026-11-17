import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/data/site";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Demo sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/admin");

  return (
    <div>
      <p className="eyebrow">Admin demo access</p>
      <h1 className="mt-4 font-display text-4xl font-medium tracking-tight text-navy-950">
        Explore the demo console.
      </h1>
      <p className="mt-3 text-sm leading-6 text-navy-500">
        This is a frontend demonstration. The login is intentionally fixed and does not
        authenticate a real user or connect to a database.
      </p>

      <div className="mt-6 rounded-lg border border-gold-200 bg-gold-50 px-4 py-4">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-gold-800">
          Demo credentials
        </p>
        <dl className="mt-2 space-y-1 font-mono text-[0.75rem] text-gold-900">
          <div className="flex flex-wrap gap-x-2">
            <dt className="font-semibold">Email:</dt>
            <dd>{DEMO_EMAIL}</dd>
          </div>
          <div className="flex flex-wrap gap-x-2">
            <dt className="font-semibold">Password:</dt>
            <dd>{DEMO_PASSWORD}</dd>
          </div>
        </dl>
      </div>

      <LoginForm />
      <p className="mt-6 text-[0.7rem] leading-5 text-navy-400">
        Demo changes are kept only for the current running session and are not permanently saved.
        Do not enter real client data.
      </p>
    </div>
  );
}
