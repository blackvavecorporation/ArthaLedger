import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  className,
}: {
  eyebrow?: string | null;
  title: string;
  description?: string | null;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className={cn("eyebrow", light && "eyebrow-light", align === "center" && "justify-center")}>
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "mt-4 text-[2.1rem] font-medium leading-[1.12] tracking-tight md:text-[2.7rem]",
          light ? "text-white" : "text-navy-950",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-5 text-[0.95rem] leading-7",
            light ? "text-white/60" : "text-navy-500",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
