"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Briefcase,
  CalendarClock,
  ExternalLink,
  HelpCircle,
  Home,
  Images,
  Inbox,
  Info,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  MessagesSquare,
  PanelBottom,
  Palette,
  Scale,
  ScrollText,
  Search,
  UserCog,
  UserPlus,
  X,
  type LucideIcon,
} from "lucide-react";
import { ADMIN_NAV_GROUPS } from "@/lib/admin-nav";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard,
  Home,
  Info,
  Briefcase,
  MessageSquareQuote,
  HelpCircle,
  Scale,
  Search,
  Palette,
  Building2,
  Menu,
  PanelBottom,
  Images,
  Inbox,
  CalendarClock,
  MessagesSquare,
  ScrollText,
  UserCog,
  UserPlus,
};

export function AdminShell({
  user,
  allowedHrefs,
  logoutAction,
  children,
}: {
  user: { name: string; email: string; roleLabel: string };
  allowedHrefs: string[];
  logoutAction: () => Promise<void>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  const groups = ADMIN_NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => allowedHrefs.includes(item.href)),
  })).filter((group) => group.items.length > 0);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-white/10 px-5">
        <span className="relative flex h-9 w-9 items-center justify-center border border-gold-400/50 bg-navy-900 font-display text-sm font-semibold text-gold-300">
          AL
          <span className="absolute -bottom-px -right-px h-1.5 w-1.5 bg-gold-500" />
        </span>
        <div>
          <p className="font-display text-[1.05rem] font-semibold leading-tight text-white">
            ArthaLedger
          </p>
          <p className="text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-white/35">
            Admin console
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
          className="ml-auto rounded p-1.5 text-white/50 hover:bg-white/10 hover:text-white lg:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="no-scrollbar flex-1 overflow-y-auto px-3 py-5" aria-label="Admin navigation">
        {groups.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="mb-2 px-3 text-[0.55rem] font-semibold uppercase tracking-[0.16em] text-white/25">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = ICONS[item.icon] || LayoutDashboard;
                const active = isActive(item.href, item.exact);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-2.5 rounded-md px-3 py-2 text-[0.78rem] font-medium transition-colors",
                        active
                          ? "bg-white/10 text-white"
                          : "text-white/50 hover:bg-white/[0.06] hover:text-white/90",
                      )}
                    >
                      <Icon className={cn("h-4 w-4", active ? "text-gold-400" : "text-white/30 group-hover:text-white/60")} />
                      <span className="flex-1">{item.label}</span>
                      {active && <span className="h-1 w-1 rounded-full bg-gold-400" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/10 p-3">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="mb-2 flex items-center gap-2 rounded-md px-3 py-2 text-[0.72rem] text-white/45 hover:bg-white/[0.06] hover:text-white"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View public website ↗
        </a>
        <div className="flex items-center gap-2.5 rounded-md bg-white/[0.04] px-3 py-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-[0.7rem] font-semibold text-gold-300">
            {user.name
              .split(" ")
              .slice(0, 2)
              .map((part) => part[0])
              .join("")}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.72rem] font-medium text-white/85">{user.name}</p>
            <p className="truncate text-[0.58rem] uppercase tracking-wide text-white/30">{user.roleLabel}</p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              aria-label="Sign out"
              title="Sign out"
              className="rounded p-1.5 text-white/35 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f6f8]">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 bg-navy-950 lg:block">{sidebar}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-[17rem] bg-navy-950 shadow-2xl">{sidebar}</aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-navy-100 bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
            className="rounded-md border border-navy-200 p-2 text-navy-700 lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-navy-400">
            Admin workspace
          </p>
          <div className="ml-auto flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1.5 text-[0.72rem] font-medium text-navy-500 hover:text-navy-900 sm:inline-flex"
            >
              View site
              <ExternalLink className="h-3 w-3" />
            </a>
            <span className="hidden h-6 w-px bg-navy-100 sm:block" />
            <Link href="/admin/account" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-900 text-[0.65rem] font-semibold text-gold-300">
                {user.name
                  .split(" ")
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")}
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-[0.72rem] font-medium leading-tight text-navy-800">
                  {user.name}
                </span>
                <span className="block text-[0.58rem] uppercase tracking-wide text-navy-400">
                  {user.roleLabel}
                </span>
              </span>
            </Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1440px] px-4 py-7 sm:px-6 lg:px-9 lg:py-9">
          {children}
        </main>
      </div>
    </div>
  );
}
