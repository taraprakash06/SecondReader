"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

const urlErrorMessages: Record<string, string> = {
  CredentialsSignin: "Invalid email or password.",
  Configuration: "Server configuration error. Check NEXTAUTH_URL and NEXTAUTH_SECRET.",
  AccessDenied: "You don’t have permission to sign in.",
  SessionRequired: "Please sign in to continue.",
};

export function SignInForm() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  const [error, setError] = React.useState<string | null>(() =>
    urlError && urlErrorMessages[urlError] ? urlErrorMessages[urlError] : null,
  );

  React.useEffect(() => {
    if (urlError && urlErrorMessages[urlError]) {
      setError(urlErrorMessages[urlError]);
    }
  }, [urlError]);
  const [pending, setPending] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/",
    });

    if (res?.error) setError("Invalid email or password.");
    setPending(false);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <label className="grid gap-1 text-sm">
        <span className="font-medium text-[color:var(--ink)]">Email</span>
        <input
          name="email"
          type="email"
          required
          className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm focus:border-[color:var(--brand-magenta)]/50 focus:outline-none"
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-medium text-[color:var(--ink)]">Password</span>
        <input
          name="password"
          type="password"
          required
          className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm focus:border-[color:var(--brand-purple)]/50 focus:outline-none"
        />
      </label>

      {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}

      <button
        className="h-10 w-full rounded-xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] px-4 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

