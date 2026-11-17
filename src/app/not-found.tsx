import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy-950 px-5 text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-grid-navy bg-[size:54px_54px] opacity-50"
        aria-hidden="true"
      />
      <div className="relative max-w-lg text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center border border-gold-400/40 bg-gold-500/10 text-gold-300">
          <Compass className="h-6 w-6" />
        </span>
        <p className="mt-6 font-display text-7xl font-medium text-gold-300">404</p>
        <h1 className="mt-3 font-display text-3xl font-medium">This page is not on the ledger.</h1>
        <p className="mt-3 text-sm leading-7 text-white/50">
          The page you are looking for may have moved or no longer exists. Return to the homepage or
          explore our services.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-gold-500 px-5 py-3 text-[0.8rem] font-semibold text-navy-950 hover:bg-gold-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center rounded-md border border-white/20 px-5 py-3 text-[0.8rem] font-semibold text-white hover:bg-white/10"
          >
            View services
          </Link>
        </div>
      </div>
    </main>
  );
}
