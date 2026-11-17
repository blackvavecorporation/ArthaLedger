import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Demo setup",
  robots: { index: false, follow: false },
};

export default function SetupPage() {
  return (
    <div>
      <p className="eyebrow">Demo mode</p>
      <h1 className="mt-4 font-display text-4xl font-medium tracking-tight text-navy-950">
        Setup is disabled.
      </h1>
      <p className="mt-3 text-sm leading-6 text-navy-500">
        This deployment is a hardcoded demonstration with no database and no user provisioning.
        First-run setup, password hashing and account creation are intentionally unavailable.
      </p>
      <div className="mt-8 rounded-lg border border-gold-200 bg-gold-50 p-5 text-sm text-gold-900">
        Use the credentials shown on the demo sign-in page.
        <Link href="/admin/login" className="mt-3 block font-semibold underline">
          Go to demo sign in →
        </Link>
      </div>
    </div>
  );
}
