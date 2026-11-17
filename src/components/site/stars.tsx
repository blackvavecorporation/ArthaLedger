import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stars({ rating, className }: { rating: number; className?: string }) {
  const safe = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      role="img"
      aria-label={`Rated ${safe} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            "h-3.5 w-3.5",
            index < safe ? "fill-gold-500 text-gold-500" : "fill-navy-100 text-navy-100",
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
