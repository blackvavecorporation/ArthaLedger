"use client";

import { useActionState } from "react";
import { ArrowRight, Loader2, Lock } from "lucide-react";
import { loginAction, type AuthState } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      {state.error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[0.78rem] text-red-700"
        >
          {state.error}
        </div>
      )}
      <div>
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          placeholder="you@firm.com"
          className="mt-1.5"
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••••••"
          className="mt-1.5"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-navy-900 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
        {pending ? "Verifying…" : "Sign in securely"}
        {!pending && <ArrowRight className="h-4 w-4" />}
      </button>
      <p className="text-center text-[0.68rem] leading-5 text-navy-400">
        Password resets are handled by a super administrator in the server environment. Contact your
        firm administrator if you are locked out.
      </p>
    </form>
  );
}
