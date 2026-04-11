"use client";

import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export function AuthButton() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <span className="inline-flex min-h-11 min-w-11 items-center justify-center text-xs font-semibold text-[color:var(--ink-muted)] md:min-h-9 md:min-w-0">
        …
      </span>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Link
        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 text-xs font-semibold text-[color:var(--ink)] hover:bg-[color:var(--paper-2)] md:min-h-9"
        href="/auth/sign-in"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex max-w-[100vw] items-center gap-1.5 sm:gap-2">
      <Link
        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white px-2.5 text-xs font-semibold text-[color:var(--ink)] hover:bg-[color:var(--paper-2)] sm:px-3 md:min-h-9"
        href="/profile"
      >
        Profile
      </Link>
      <button
        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white px-2.5 text-xs font-semibold text-[color:var(--ink)] hover:bg-[color:var(--paper-2)] sm:px-3 md:min-h-9"
        onClick={() => signOut({ callbackUrl: "/" })}
        type="button"
      >
        Sign out
      </button>
    </div>
  );
}

