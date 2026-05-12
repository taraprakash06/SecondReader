"use client";

import React from "react";
import Link from "next/link";
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

      <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 px-3 py-3">
        <label htmlFor="accept-terms" className="flex cursor-pointer gap-3 text-sm leading-snug text-[color:var(--ink)]">
          <input
            id="accept-terms"
            name="acceptTerms"
            type="checkbox"
            required
            className="mt-0.5 h-5 w-5 shrink-0 rounded border-zinc-300 text-[color:var(--brand-magenta)] focus:ring-[color:var(--brand-magenta)]/30"
          />
          <span>
            I agree to the{" "}
            <Link
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[color:var(--brand-magenta)] underline decoration-[color:var(--brand-magenta)]/35 underline-offset-2 hover:decoration-[color:var(--brand-magenta)]"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[color:var(--brand-purple)] underline decoration-[color:var(--brand-purple)]/35 underline-offset-2 hover:decoration-[color:var(--brand-purple)]"
            >
              Privacy Policy
            </Link>
            . <span className="text-[color:var(--ink-muted)]">(Opens in a new tab so you can keep this page open.)</span>
          </span>
        </label>
      </div>

      {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
      <SubmitButton />
    </form>
  );
}

