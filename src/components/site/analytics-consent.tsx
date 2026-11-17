"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { Cookie, X } from "lucide-react";

const STORAGE_KEY = "al_analytics_consent_v1";

/**
 * Optional analytics is loaded only after explicit consent. Essential cookies
 * (the secure admin session) are not affected by this control.
 */
export function AnalyticsConsent({ gaMeasurementId }: { gaMeasurementId: string }) {
  const [consent, setConsent] = useState<"granted" | "denied" | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    setConsent(stored === "granted" || stored === "denied" ? stored : null);
    setReady(true);
  }, []);

  function decide(value: "granted" | "denied") {
    window.localStorage.setItem(STORAGE_KEY, value);
    setConsent(value);
  }

  if (!ready) return null;

  if (consent === "granted") {
    return (
      <>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaMeasurementId)}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${gaMeasurementId.replace(
            /[^A-Za-z0-9-]/g,
            "",
          )}', { anonymize_ip: true });`}
        </Script>
      </>
    );
  }

  if (consent === "denied") return null;

  return (
    <div
      role="dialog"
      aria-label="Analytics cookie preferences"
      className="fixed bottom-5 left-4 z-40 w-[min(23rem,calc(100vw-2rem))] rounded-xl border border-navy-100 bg-white p-4 shadow-lift"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-700">
          <Cookie className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[0.78rem] font-semibold text-navy-900">Optional analytics</p>
          <p className="mt-1 text-[0.7rem] leading-5 text-navy-500">
            We would like to use privacy-conscious analytics to understand website usage. Essential
            cookies required for security are always active. Read our{" "}
            <Link href="/legal/cookie-policy" className="underline hover:text-navy-800">
              Cookie Policy
            </Link>
            .
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => decide("granted")}
              className="rounded-md bg-navy-900 px-3 py-1.5 text-[0.7rem] font-semibold text-white hover:bg-navy-800"
            >
              Accept analytics
            </button>
            <button
              type="button"
              onClick={() => decide("denied")}
              className="rounded-md border border-navy-200 px-3 py-1.5 text-[0.7rem] font-medium text-navy-600 hover:bg-navy-50"
            >
              Decline
            </button>
          </div>
        </div>
        <button
          type="button"
          aria-label="Dismiss analytics preferences"
          onClick={() => decide("denied")}
          className="rounded p-1 text-navy-300 hover:bg-navy-50 hover:text-navy-600"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
