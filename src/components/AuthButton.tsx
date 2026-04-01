"use client";

import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export function AuthButton() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <span className="text-xs font-semibold text-[color:var(--ink-muted)]">…</span>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Link
        className="inline-flex h-9 items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 text-xs font-semibold text-[color:var(--ink)] hover:bg-[color:var(--paper-2)]"
        href="/auth/sign-in"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        className="inline-flex h-9 items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 text-xs font-semibold text-[color:var(--ink)] hover:bg-[color:var(--paper-2)]"
        href="/profile"
      >
        Profile
      </Link>
      <button
        className="inline-flex h-9 items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 text-xs font-semibold text-[color:var(--ink)] hover:bg-[color:var(--paper-2)]"
        onClick={() => signOut({ callbackUrl: "/" })}
        type="button"
      >
        Sign out
      </button>
    </div>
  );
}

