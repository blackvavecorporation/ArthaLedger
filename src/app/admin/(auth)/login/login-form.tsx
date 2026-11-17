"use client";

import { useActionState } from "react";
import { ArrowRight, Loader2, Play } from "lucide-react";
import { loginAction, type AuthState } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="mt-6 space-y-5">
      {state.error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[0.78rem] text-red-700"
        >
          {state.error}
        </div>
      )}
      <div>
        <Label htmlFor="email">Demo email address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          placeholder="demo@arthaledger.example"
          className="mt-1.5"
        />
      </div>
      <div>
        <Label htmlFor="password">Demo password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="Enter the demo password above"
          className="mt-1.5"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-navy-900 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
        {pending ? "Opening demo…" : "Open admin demo"}
        {!pending && <ArrowRight className="h-4 w-4" />}
      </button>
      <p className="text-center text-[0.68rem] leading-5 text-navy-400">
        This demo login is public by design. It is not a security boundary and must not be used
        for real accounts or confidential information.
      </p>
    </form>
  );
}
