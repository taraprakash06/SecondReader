import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { SignInForm } from "@/components/SignInForm";
import { safeInternalCallbackUrl } from "@/lib/safeRedirect";

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: Promise<{ callbackUrl?: string | string[] }>;
}) {
  const sp = (await searchParams) ?? {};
  const raw = Array.isArray(sp.callbackUrl) ? sp.callbackUrl[0] : sp.callbackUrl;
  const destination = safeInternalCallbackUrl(raw, "/");

  const session = await auth();
  if (session?.user?.id) redirect(destination);

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-col gap-2">
        <Link
          className="text-sm font-medium text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]"
          href="/"
        >
          ← Home
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-sm leading-6 text-[color:var(--ink-muted)]">
          Sign in to Second Reader.
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] p-[1px] shadow-sm">
        <div className="rounded-[23px] border border-zinc-200 bg-white/90 p-6 backdrop-blur">
          <Suspense fallback={<p className="text-sm text-[color:var(--ink-muted)]">Loading…</p>}>
            <SignInForm />
          </Suspense>
          <p className="mt-4 text-sm text-[color:var(--ink-muted)]">
            New here?{" "}
            <Link
              className="font-semibold text-[color:var(--brand-magenta)]"
              href={
                destination === "/"
                  ? "/auth/sign-up"
                  : `/auth/sign-up?callbackUrl=${encodeURIComponent(destination)}`
              }
            >
              Create an account
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

