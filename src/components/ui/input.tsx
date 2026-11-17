import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-md border border-navy-200 bg-white px-3.5 py-2 text-sm text-navy-900 shadow-sm transition-colors placeholder:text-navy-400 focus-visible:border-gold-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/20 disabled:cursor-not-allowed disabled:bg-navy-50 disabled:opacity-70 aria-[invalid=true]:border-red-400",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex min-h-[130px] w-full rounded-md border border-navy-200 bg-white px-3.5 py-3 text-sm text-navy-900 shadow-sm transition-colors placeholder:text-navy-400 focus-visible:border-gold-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/20 aria-[invalid=true]:border-red-400",
      className,
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = "Textarea";
