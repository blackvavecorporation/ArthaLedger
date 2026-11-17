import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function FormSection({
  title,
  description,
  children,
  className,
  id,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("rounded-xl border border-navy-100 bg-white shadow-sm", className)}>
      <div className="border-b border-navy-100 px-6 py-5">
        <h2 className="font-display text-xl font-semibold text-navy-950">{title}</h2>
        {description && <p className="mt-1 text-[0.78rem] leading-5 text-navy-500">{description}</p>}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="admin-label">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-[0.65rem] leading-4 text-navy-400">{hint}</p>}
    </div>
  );
}

export function CheckboxField({
  label,
  name,
  defaultChecked,
  hint,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
  hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 rounded-md border border-navy-100 bg-navy-50/40 px-3 py-2.5">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 rounded border-navy-300 accent-navy-900"
      />
      <span>
        <span className="block text-[0.78rem] font-medium text-navy-800">{label}</span>
        {hint && <span className="mt-0.5 block text-[0.65rem] leading-4 text-navy-400">{hint}</span>}
      </span>
    </label>
  );
}

export function FormGrid({ children, cols = 2 }: { children: ReactNode; cols?: 2 | 3 }) {
  return (
    <div className={cn("grid gap-5", cols === 2 ? "md:grid-cols-2" : "md:grid-cols-3")}>
      {children}
    </div>
  );
}

export function FormActions({ children }: { children: ReactNode }) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-navy-100 pt-5">
      {children}
    </div>
  );
}
