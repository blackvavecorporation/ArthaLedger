"use client";

import { useActionState } from "react";
import { KeyRound, Loader2 } from "lucide-react";
import { changePasswordAction, type AuthState } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthState = {};

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePasswordAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[0.75rem] text-red-700">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-[0.75rem] text-emerald-800">
          {state.success}
        </p>
      )}
      <div>
        <Label htmlFor="currentPassword">Current password</Label>
        <Input id="currentPassword" name="currentPassword" type="password" autoComplete="current-password" required className="mt-1.5" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="newPassword">New password</Label>
          <Input id="newPassword" name="newPassword" type="password" autoComplete="new-password" minLength={12} required className="mt-1.5" />
          {state.fieldErrors?.newPassword && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.newPassword}</p>}
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required className="mt-1.5" />
          {state.fieldErrors?.confirmPassword && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.confirmPassword}</p>}
        </div>
      </div>
      <p className="text-[0.68rem] leading-5 text-navy-400">
        At least 12 characters with a letter and a number. Existing sessions remain valid until they
        expire, so sign out of shared devices separately.
      </p>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-10 items-center gap-2 rounded-md bg-navy-900 px-4 text-[0.78rem] font-semibold text-white hover:bg-navy-800 disabled:opacity-50"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
        {pending ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
