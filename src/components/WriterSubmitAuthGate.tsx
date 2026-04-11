"use client";

import Link from "next/link";
import { safeInternalCallbackUrl } from "@/lib/safeRedirect";

const SUBMIT_PATH = "/writer/submit";

export function WriterSubmitAuthGate() {
  const callbackPath = safeInternalCallbackUrl(SUBMIT_PATH, SUBMIT_PATH);
  const q = encodeURIComponent(callbackPath);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4 backdrop-blur-[2px]"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="submit-auth-title"
        className="w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl"
      >
        <h2 id="submit-auth-title" className="text-lg font-semibold tracking-tight text-[color:var(--ink)]">
          Sign in to submit
        </h2>
        <p className="mt-2 text-sm leading-6 text-[color:var(--ink-muted)]">
          You need an account to paste your manuscript and publish it for readers. Log in or create a free account to
          continue.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href={`/auth/sign-in?callbackUrl=${q}`}
            className="flex h-10 items-center justify-center rounded-xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] px-4 text-sm font-semibold text-white shadow-sm hover:opacity-95"
          >
            Log in
          </Link>
          <Link
            href={`/auth/sign-up?callbackUrl=${q}`}
            className="flex h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-[color:var(--ink)] hover:border-[color:var(--brand-magenta)]/35 hover:bg-[color:var(--paper-2)]"
          >
            Create account
          </Link>
        </div>
        <p className="mt-4 text-center">
          <Link
            href="/writer"
            className="text-sm font-medium text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]"
          >
            ← Back to writer space
          </Link>
        </p>
      </div>
    </div>
  );
}
