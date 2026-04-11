"use client";

import Link from "next/link";
import { safeInternalCallbackUrl } from "@/lib/safeRedirect";

type Props = {
  /** Where to return after sign-in (e.g. `/readers` or `/readers/[userId]`). */
  callbackPath?: string;
};

export function BrowseReadersAuthGate({ callbackPath = "/readers" }: Props) {
  const cb = safeInternalCallbackUrl(callbackPath, "/readers");
  const q = encodeURIComponent(cb);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4 backdrop-blur-[2px]"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="browse-readers-auth-title"
        className="w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl"
      >
        <h2
          id="browse-readers-auth-title"
          className="text-lg font-semibold tracking-tight text-[color:var(--ink)]"
        >
          Sign in to browse readers
        </h2>
        <p className="mt-2 text-sm leading-6 text-[color:var(--ink-muted)]">
          You need an account to browse readers and read public feedback samples before inviting someone to your piece.
          Log in or create a free account to continue.
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
          <Link className="text-sm font-medium text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]" href="/">
            ← Home
          </Link>
        </p>
      </div>
    </div>
  );
}
