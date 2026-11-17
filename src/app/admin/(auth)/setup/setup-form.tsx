"use client";

import { useActionState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { setupAction, type AuthState } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthState = {};

export function SetupForm() {
  const [state, formAction, pending] = useActionState(setupAction, initialState);

  return (
    <form action={formAction} className="mt-7 space-y-4">
      {state.error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[0.78rem] text-red-700">
          {state.error}
        </div>
      )}
      <div>
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" required minLength={2} maxLength={100} className="mt-1.5" />
        {state.fieldErrors?.name && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.name}</p>}
      </div>
      <div>
        <Label htmlFor="email">Email address</Label>
        <Input id="email" name="email" type="email" autoComplete="username" required className="mt-1.5" />
        {state.fieldErrors?.email && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.email}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={12}
            className="mt-1.5"
          />
          {state.fieldErrors?.password && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.password}</p>}
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required className="mt-1.5" />
          {state.fieldErrors?.confirmPassword && (
            <p className="mt-1 text-xs text-red-600">{state.fieldErrors.confirmPassword}</p>
          )}
        </div>
      </div>
      <p className="text-[0.68rem] leading-4 text-navy-400">
        At least 12 characters with a letter, number and symbol. This account receives SUPER_ADMIN
        permissions.
      </p>
      <div>
        <Label htmlFor="setupToken">Setup token</Label>
        <Input id="setupToken" name="setupToken" type="password" autoComplete="off" required className="mt-1.5" />
        <p className="mt-1 text-[0.65rem] text-navy-400">
          The value of ADMIN_SETUP_TOKEN from the server environment. Never share it publicly.
        </p>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-navy-900 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
        {pending ? "Creating account…" : "Create administrator"}
      </button>
    </form>
  );
}
