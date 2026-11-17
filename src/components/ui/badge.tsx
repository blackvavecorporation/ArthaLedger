import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[0.7rem] font-semibold tracking-wide",
  {
    variants: {
      variant: {
        default: "border-transparent bg-navy-900 text-white",
        gold: "border-gold-200 bg-gold-50 text-gold-800",
        outline: "border-navy-200 bg-white text-navy-700",
        success: "border-emerald-200 bg-emerald-50 text-emerald-700",
        warning: "border-amber-200 bg-amber-50 text-amber-800",
        destructive: "border-red-200 bg-red-50 text-red-700",
        muted: "border-navy-100 bg-navy-50 text-navy-500",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
