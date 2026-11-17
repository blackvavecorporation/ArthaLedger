"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { submitContact, type ContactState } from "@/actions/public";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: ContactState = { status: "idle" };

export function ContactForm({
  services,
  defaultServiceId,
}: {
  services: { id: string; title: string }[];
  defaultServiceId?: string;
}) {
  const [state, formAction, pending] = useActionState(submitContact, initialState);
  const [hideSuccess, setHideSuccess] = useState(false);
  const showSuccess = state.status === "success" && !hideSuccess;

  if (showSuccess) {
    return (
      <div className="flex min-h-[28rem] flex-col items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50/60 p-8 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h2 className="mt-5 font-display text-3xl font-medium text-navy-950">Demo enquiry accepted.</h2>
        <p className="mt-3 max-w-md text-sm leading-7 text-navy-600">{state.message}</p>
        <button
          type="button"
          onClick={() => setHideSuccess(true)}
          className="mt-6 inline-flex items-center gap-1.5 rounded-md bg-navy-900 px-5 py-3 text-[0.78rem] font-semibold text-white hover:bg-navy-800"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      onSubmit={() => setHideSuccess(false)}
      className="rounded-xl border border-navy-100 bg-white p-6 shadow-soft md:p-8"
    >
      <p className="eyebrow">Enquiry form</p>
      <h2 className="mt-3 font-display text-3xl font-medium text-navy-950">
        Tell us what you need help with.
      </h2>
      <p className="mt-2 text-[0.82rem] leading-6 text-navy-500">
        Fields marked * are required. Please do not include passwords, OTPs or bank credentials in
        this form.
      </p>

      {state.status === "error" && (
        <div
          role="alert"
          className="mt-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[0.78rem] leading-5 text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{state.message}</span>
        </div>
      )}

      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Full name *</Label>
          <Input
            id="name"
            name="name"
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
            placeholder="Your name"
            className="mt-1.5"
            aria-invalid={Boolean(state.errors?.name)}
          />
          {state.errors?.name && <p className="mt-1 text-xs text-red-600">{state.errors.name}</p>}
        </div>
        <div>
          <Label htmlFor="phone">Phone number *</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="+91 98765 43210"
            className="mt-1.5"
            aria-invalid={Boolean(state.errors?.phone)}
          />
          {state.errors?.phone && <p className="mt-1 text-xs text-red-600">{state.errors.phone}</p>}
        </div>
      </div>

      <div className="mt-5">
        <Label htmlFor="email">Email address *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@business.com"
          className="mt-1.5"
          aria-invalid={Boolean(state.errors?.email)}
        />
        {state.errors?.email && <p className="mt-1 text-xs text-red-600">{state.errors.email}</p>}
      </div>

      <div className="mt-5">
        <Label htmlFor="serviceId">Service you are interested in</Label>
        <select
          id="serviceId"
          name="serviceId"
          defaultValue={defaultServiceId ?? ""}
          className="mt-1.5 h-11 w-full rounded-md border border-navy-200 bg-white px-3.5 text-sm text-navy-800 shadow-sm focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
        >
          <option value="">Select a service (optional)</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.title}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5">
        <Label htmlFor="message">How can we help? *</Label>
        <Textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={3000}
          placeholder="A short summary of your requirement, the entity type and any relevant timelines."
          className="mt-1.5"
          aria-invalid={Boolean(state.errors?.message)}
        />
        {state.errors?.message && <p className="mt-1 text-xs text-red-600">{state.errors.message}</p>}
      </div>

      <label className="mt-5 flex items-start gap-2.5 text-[0.7rem] leading-5 text-navy-500">
        <input type="checkbox" name="consent" required className="mt-0.5 accent-navy-900" />
        <span>
          I agree that the firm may contact me about this enquiry and I have read the{" "}
          <Link href="/legal/privacy-policy" className="underline hover:text-navy-800">
            Privacy Policy
          </Link>
          .
        </span>
      </label>
      {state.errors?.consent && <p className="mt-1 text-xs text-red-600">{state.errors.consent}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-gold-500 text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-400 disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {pending ? "Sending your enquiry…" : "Send enquiry"}
      </button>
      <p className="mt-3 text-center text-[0.65rem] leading-5 text-navy-400">
        Demo only — this form validates your input but does not store, email or deliver it. Do not
        submit real personal or financial information.
      </p>
    </form>
  );
}
