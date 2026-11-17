import Link from "next/link";
import { ArrowLeft, Database, FlaskConical, ShieldCheck } from "lucide-react";
import { Brand } from "@/components/site/brand";
import { getSettings } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  let brandName = "ArthaLedger";
  let logoUrl: string | null = null;
  let tagline = "Your Business. Our Financial Expertise.";
  try {
    const settings = await getSettings();
    brandName = settings.brandName;
    logoUrl = settings.logoUrl;
    tagline = settings.tagline;
  } catch {
    // The demo login page should still render if content is unavailable.
  }

  return (
    <div className="flex min-h-screen bg-ivory">
      <div className="relative hidden w-[46%] flex-col justify-between overflow-hidden bg-navy-950 p-12 text-white lg:flex">
        <div
          className="pointer-events-none absolute inset-0 bg-grid-navy bg-[size:52px_52px] opacity-50"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-gold-500/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative">
          <Brand name={brandName} logoUrl={logoUrl} theme="dark" />
        </div>
        <div className="relative max-w-md">
          <p className="eyebrow eyebrow-light">Admin demonstration</p>
          <h1 className="mt-5 font-display text-4xl font-medium leading-[1.15]">
            Explore the workspace behind {brandName}.
          </h1>
          <p className="mt-5 text-sm leading-7 text-white/55">
            Browse the dashboard, CMS forms, enquiry screens and client-desk views using a fixed
            sample dataset. No live data is involved.
          </p>
          <ul className="mt-10 space-y-4 text-[0.8rem] text-white/55">
            <li className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-400/30 bg-gold-500/10 text-gold-300">
                <FlaskConical className="h-3.5 w-3.5" />
              </span>
              Public demo login with documented credentials
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-400/30 bg-gold-500/10 text-gold-300">
                <Database className="h-3.5 w-3.5" />
              </span>
              No database, migrations or server-side persistence
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-400/30 bg-gold-500/10 text-gold-300">
                <ShieldCheck className="h-3.5 w-3.5" />
              </span>
              No real client information or access control claim
            </li>
          </ul>
        </div>
        <p className="relative text-[0.68rem] text-white/30">{tagline}</p>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between px-5 py-5 lg:px-10">
          <div className="lg:hidden">
            <Brand name={brandName} logoUrl={logoUrl} theme="light" />
          </div>
          <Link
            href="/"
            className="ml-auto inline-flex items-center gap-1.5 text-[0.75rem] font-medium text-navy-500 transition-colors hover:text-navy-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to website
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-5 pb-16 pt-4">
          <div className="w-full max-w-[26rem]">{children}</div>
        </div>
        <p className="px-5 pb-6 text-center text-[0.65rem] text-navy-400">
          Demo environment only. Do not enter real personal or client information.
        </p>
      </div>
    </div>
  );
}
