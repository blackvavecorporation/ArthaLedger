import Link from "next/link";
import { Camera, Globe, Mail, MapPin, Phone, Play } from "lucide-react";
import { Brand } from "@/components/site/brand";

function SocialGlyph({ platform }: { platform: string }) {
  const key = platform.toLowerCase();
  if (key === "instagram") return <Camera className="h-3.5 w-3.5" />;
  if (key === "youtube") return <Play className="h-3.5 w-3.5" />;
  if (key === "linkedin") return <span className="text-[0.68rem] font-bold leading-none">in</span>;
  if (key === "twitter" || key === "x") return <span className="text-[0.75rem] font-semibold leading-none">𝕏</span>;
  if (key === "facebook") return <span className="text-[0.85rem] font-bold leading-none">f</span>;
  return <Globe className="h-3.5 w-3.5" />;
}

export function Footer({
  brandName,
  logoUrl,
  tagline,
  about,
  address,
  phone,
  email,
  hours,
  copyright,
  footerLinks,
  legalLinks,
  services,
  socialLinks,
}: {
  brandName: string;
  logoUrl: string | null;
  tagline: string;
  about: string | null;
  address: string;
  phone: string;
  email: string;
  hours: string;
  copyright: string | null;
  footerLinks: { id: string; label: string; href: string; isExternal: boolean }[];
  legalLinks: { id: string; label: string; href: string; isExternal: boolean }[];
  services: { id: string; title: string; slug: string }[];
  socialLinks: { id: string; platform: string; url: string }[];
}) {
  return (
    <footer className="relative overflow-hidden bg-navy-950 text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-grid-navy bg-[size:56px_56px] opacity-40"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-gold-500/5 blur-3xl" aria-hidden="true" />
      <div className="container relative pb-24 pt-16 sm:pb-28">
        <div className="grid gap-12 pb-14 md:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_0.9fr_1.1fr]">
          <div>
            <Brand name={brandName} logoUrl={logoUrl} theme="dark" />
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/55">
              {about || tagline}
            </p>
            {socialLinks.length > 0 && (
              <div className="mt-6 flex items-center gap-2.5">
                {socialLinks.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${brandName} on ${social.platform}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-gold-400/60 hover:text-gold-300"
                  >
                    <SocialGlyph platform={social.platform} />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-sans text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-gold-400">
              Explore
            </h3>
            <ul className="mt-5 space-y-3">
              {footerLinks.map((link) => (
                <li key={link.id}>
                  {link.isExternal ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-gold-400">
              Services
            </h3>
            <ul className="mt-5 space-y-3">
              {services.slice(0, 6).map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/services" className="text-sm font-medium text-gold-300 hover:text-gold-200">
                  View all services →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-gold-400">
              Office
            </h3>
            <ul className="mt-5 space-y-3.5 text-sm text-white/60">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-500/80" />
                <span className="leading-6">{address}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-500/80" />
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-white">
                  {phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-500/80" />
                <a href={`mailto:${email}`} className="break-all hover:text-white">
                  {email}
                </a>
              </li>
              <li className="text-white/40">{hours}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 py-5">
          <div className="flex flex-col gap-4 text-[0.72rem] text-white/40 md:flex-row md:items-center md:justify-between">
            <p>{copyright || `© ${new Date().getFullYear()} ${brandName}. All rights reserved.`}</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {legalLinks.map((link) => (
                <Link key={link.id} href={link.href} className="transition-colors hover:text-white/80">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <p className="mt-4 max-w-4xl text-[0.68rem] leading-5 text-white/30">
            Demonstration website. All firm details, services, testimonials and contact information
            are sample content. The site is not professional advice, does not represent a real firm,
            and the forms do not store or deliver submissions.
          </p>
        </div>
      </div>
    </footer>
  );
}
