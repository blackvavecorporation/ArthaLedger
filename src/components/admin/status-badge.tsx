import { Badge } from "@/components/ui/badge";

export function StatusBadge({
  status,
}: {
  status: "NEW" | "IN_PROGRESS" | "RESOLVED" | "SPAM" | "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "DRAFT" | "PUBLISHED" | "APPROVED";
}) {
  const variants: Record<string, "default" | "gold" | "success" | "warning" | "destructive" | "muted" | "outline"> = {
    NEW: "gold",
    IN_PROGRESS: "warning",
    RESOLVED: "success",
    SPAM: "destructive",
    PENDING: "gold",
    CONFIRMED: "success",
    COMPLETED: "outline",
    CANCELLED: "destructive",
    DRAFT: "muted",
    PUBLISHED: "success",
    APPROVED: "success",
  };
  return (
    <Badge variant={variants[status] ?? "outline"}>
      {status.replaceAll("_", " ").toLowerCase().replace(/^\w/, (letter) => letter.toUpperCase())}
    </Badge>
  );
}
