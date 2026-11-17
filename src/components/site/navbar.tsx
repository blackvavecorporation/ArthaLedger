"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Clock3, Mail, Menu, Phone, X } from "lucide-react";
import { Brand } from "@/components/site/brand";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = { id: string; label: string; href: string; isExternal: boolean };

export function Navbar({
  brandName,
  logoUrl,
  tagline,
  items,
  phone,
  email,
  hours,
}: {
  brandName: string;
  logoUrl: string | null;
  tagline: string;
  items: NavItem[];
  phone: string;
  email: string;
  hours: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40">
      <div className="hidden border-b border-white/10 bg-navy-950 text-white lg:block">
        <div className="container flex h-9 items-center justify-between text-[0.7rem] tracking-wide text-white/70">
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-3 w-3 text-gold-400" />
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-white">
                {phone}
              </a>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Mail className="h-3 w-3 text-gold-400" />
              <a href={`mailto:${email}`} className="hover:text-white">
                {email}
              </a>
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-3 w-3 text-gold-400" />
            {hours}
          </span>
        </div>
      </div>

      <div
        className={cn(
          "border-b bg-white/95 backdrop-blur transition-shadow duration-300",
          scrolled ? "border-navy-100 shadow-[0_4px_24px_-12px_rgba(11,27,51,0.25)]" : "border-transparent",
        )}
      >
        <div className="container flex h-[4.5rem] items-center justify-between gap-6">
          <Brand name={brandName} logoUrl={logoUrl} theme="light" />

          <nav aria-label="Main navigation" className="hidden items-center gap-7 lg:flex">
            {items.map((item) =>
              item.isExternal ? (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[0.82rem] font-medium text-navy-600 transition-colors hover:text-navy-950"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "relative py-2 text-[0.82rem] font-medium transition-colors hover:text-navy-950",
                    isActive(item.href) ? "text-navy-950" : "text-navy-500",
                  )}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span className="absolute -bottom-0.5 left-0 h-px w-full bg-gold-500" />
                  )}
                </Link>
              ),
            )}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <Link
              href="/admin/login"
              className="text-[0.78rem] font-medium text-navy-400 transition-colors hover:text-navy-700"
            >
              Login
            </Link>
            <Button asChild size="sm" variant="gold" className="h-9 px-4">
              <Link href="/contact">
                Book a consultation
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-navy-200 text-navy-800 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-b border-navy-100 bg-white shadow-lg lg:hidden"
          >
            <nav aria-label="Mobile navigation" className="container flex flex-col py-4">
              {items.map((item) =>
                item.isExternal ? (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="border-b border-navy-50 py-3.5 text-[0.95rem] font-medium text-navy-700"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between border-b border-navy-50 py-3.5 text-[0.95rem] font-medium",
                      isActive(item.href) ? "text-gold-700" : "text-navy-700",
                    )}
                  >
                    {item.label}
                    <ArrowRight className="h-4 w-4 text-navy-300" />
                  </Link>
                ),
              )}
              <div className="mt-4 flex flex-col gap-2 pb-2">
                <Button asChild variant="gold">
                  <Link href="/contact">Book a consultation</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/admin/login">Admin login</Link>
                </Button>
              </div>
              <div className="mt-2 space-y-2 border-t border-navy-50 pb-2 pt-4 text-xs text-navy-500">
                <p className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-gold-600" />
                  {phone}
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-gold-600" />
                  {email}
                </p>
                <p className="flex items-center gap-2">
                  <Clock3 className="h-3.5 w-3.5 text-gold-600" />
                  {hours}
                </p>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
