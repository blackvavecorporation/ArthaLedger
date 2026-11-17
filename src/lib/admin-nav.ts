import type { Permission } from "@/lib/permissions";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: string;
  permission: Permission | null;
  exact?: boolean;
};

export const ADMIN_NAV_GROUPS: { label: string; items: AdminNavItem[] }[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: "LayoutDashboard", permission: "dashboard.view", exact: true },
    ],
  },
  {
    label: "Website content",
    items: [
      { label: "Home page", href: "/admin/content/home", icon: "Home", permission: "content.read" },
      { label: "About page", href: "/admin/content/about", icon: "Info", permission: "content.read" },
      { label: "Services", href: "/admin/services", icon: "Briefcase", permission: "services.write" },
      { label: "Testimonials", href: "/admin/testimonials", icon: "MessageSquareQuote", permission: "testimonials.write" },
      { label: "FAQs", href: "/admin/faqs", icon: "HelpCircle", permission: "faqs.write" },
      { label: "Legal pages", href: "/admin/legal", icon: "Scale", permission: "legal.write" },
      { label: "SEO", href: "/admin/seo", icon: "Search", permission: "seo.write" },
    ],
  },
  {
    label: "Site setup",
    items: [
      { label: "Branding", href: "/admin/content/branding", icon: "Palette", permission: "settings.write" },
      { label: "Contact information", href: "/admin/content/contact", icon: "Building2", permission: "settings.write" },
      { label: "Navigation", href: "/admin/content/navigation", icon: "Menu", permission: "settings.write" },
      { label: "Footer", href: "/admin/content/footer", icon: "PanelBottom", permission: "settings.write" },
      { label: "Media library", href: "/admin/media", icon: "Images", permission: "media.write" },
    ],
  },
  {
    label: "Client desk",
    items: [
      { label: "Enquiries", href: "/admin/enquiries", icon: "Inbox", permission: "enquiries.read" },
      { label: "Appointments", href: "/admin/appointments", icon: "CalendarClock", permission: "appointments.read" },
      { label: "Chat conversations", href: "/admin/conversations", icon: "MessagesSquare", permission: "conversations.read" },
    ],
  },
  {
    label: "Security",
    items: [
      { label: "Audit logs", href: "/admin/audit-logs", icon: "ScrollText", permission: "audit.read" },
      { label: "Admin users", href: "/admin/users", icon: "UserPlus", permission: "users.manage" },
      { label: "My account", href: "/admin/account", icon: "UserCog", permission: null },
    ],
  },
];
