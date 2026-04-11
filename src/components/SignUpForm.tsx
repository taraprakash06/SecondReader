"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { signUpAction } from "@/app/auth/sign-up/actions";
import { safeInternalCallbackUrl } from "@/lib/safeRedirect";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className="h-10 w-full rounded-xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] px-4 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-60"
      disabled={pending}
      type="submit"
    >
      {pending ? "Creating…" : "Create account"}
    </button>
  );
}

export function SignUpForm() {
  const searchParams = useSearchParams();
  const callbackUrl = React.useMemo(
    () => safeInternalCallbackUrl(searchParams.get("callbackUrl"), "/onboarding"),
    [searchParams],
  );
  const [error, setError] = React.useState<string | null>(null);

  async function action(formData: FormData) {
    setError(null);
    const res = await signUpAction(formData);
    if (!res.ok) setError(res.error);
  }

  return (
    <form action={action} className="grid gap-3">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <label className="grid gap-1 text-sm">
        <span className="font-medium text-[color:var(--ink)]">Name</span>
        <input
          name="name"
          required
          className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm focus:border-[color:var(--brand-magenta)]/50 focus:outline-none"
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-medium text-[color:var(--ink)]">Email</span>
        <input
          name="email"
          type="email"
          required
          className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm focus:border-[color:var(--brand-purple)]/50 focus:outline-none"
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-medium text-[color:var(--ink)]">Password</span>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm focus:border-[color:var(--brand-magenta)]/50 focus:outline-none"
        />
        <span className="text-xs text-[color:var(--ink-muted)]">At least 8 characters.</span>
      </label>

      {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
      <SubmitButton />
    </form>
  );
}

