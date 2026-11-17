import Link from "next/link";
import { cn } from "@/lib/utils";

export function Brand({
  name,
  logoUrl,
  theme = "light",
  className,
  href = "/",
}: {
  name: string;
  logoUrl?: string | null;
  theme?: "light" | "dark";
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-3", className)}
      aria-label={`${name} home`}
    >
      {logoUrl ? (
        <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoUrl} alt={`${name} logo`} className="h-10 w-10 object-contain" />
        </span>
      ) : (
        <span
          className={cn(
            "relative flex h-10 w-10 items-center justify-center border font-display text-lg font-semibold tracking-tight transition-colors",
            theme === "dark"
              ? "border-gold-400/60 bg-navy-900 text-gold-300"
              : "border-gold-500/70 bg-navy-950 text-gold-300",
          )}
          aria-hidden="true"
        >
          AL
          <span className="absolute -bottom-px -right-px h-1.5 w-1.5 bg-gold-500" />
        </span>
      )}
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[1.35rem] font-semibold tracking-tight",
            theme === "dark" ? "text-white" : "text-navy-950",
          )}
        >
          {name}
        </span>
        <span
          className={cn(
            "mt-1 text-[0.58rem] font-semibold uppercase tracking-[0.2em]",
            theme === "dark" ? "text-gold-300/80" : "text-navy-400",
          )}
        >
          Financial expertise
        </span>
      </span>
    </Link>
  );
}
