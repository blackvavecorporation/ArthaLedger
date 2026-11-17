import {
  BadgeCheck,
  BadgeIndianRupee,
  BookOpen,
  Briefcase,
  Building2,
  Calculator,
  CalendarCheck,
  ClipboardCheck,
  Compass,
  Eye,
  Factory,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  Handshake,
  Landmark,
  Lightbulb,
  LineChart,
  Lock,
  MessagesSquare,
  Network,
  ReceiptText,
  Scale,
  SearchCheck,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Users,
  WalletCards,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  BadgeCheck,
  BadgeIndianRupee,
  BookOpen,
  Briefcase,
  Building2,
  Calculator,
  CalendarCheck,
  ClipboardCheck,
  Compass,
  Eye,
  Factory,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  Handshake,
  Landmark,
  Lightbulb,
  LineChart,
  Lock,
  MessagesSquare,
  Network,
  ReceiptText,
  Scale,
  SearchCheck,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Users,
  WalletCards,
  Zap,
};

export const ICON_NAMES = Object.keys(ICONS);

export function ContentIcon({
  name,
  className,
}: {
  name?: string | null;
  className?: string;
}) {
  const Icon = (name && ICONS[name]) || Briefcase;
  return <Icon className={cn("h-5 w-5", className)} aria-hidden="true" />;
}
