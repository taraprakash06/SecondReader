import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { SignUpForm } from "@/components/SignUpForm";
import { safeInternalCallbackUrl } from "@/lib/safeRedirect";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams?: Promise<{ callbackUrl?: string | string[] }>;
}) {
  const sp = (await searchParams) ?? {};
  const raw = Array.isArray(sp.callbackUrl) ? sp.callbackUrl[0] : sp.callbackUrl;
  const destination = safeInternalCallbackUrl(raw, "/onboarding");

  const session = await auth();
  if (session?.user?.id) redirect("/");

  return (
    <div className="mx-auto w-full max-w-md px-6 py-16">
      <div className="flex flex-col gap-2">
        <Link
          className="text-sm font-medium text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]"
          href="/"
        >
          ← Home
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
        <p className="text-sm leading-6 text-[color:var(--ink-muted)]">
          You’ll be able to sign in and sign out securely.
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] p-[1px] shadow-sm">
        <div className="rounded-[23px] border border-zinc-200 bg-white/90 p-6 backdrop-blur">
          <Suspense fallback={<p className="text-sm text-[color:var(--ink-muted)]">Loading…</p>}>
            <SignUpForm />
          </Suspense>
          <p className="mt-4 text-sm text-[color:var(--ink-muted)]">
            Already have an account?{" "}
            <Link
              className="font-semibold text-[color:var(--brand-magenta)]"
              href={
                destination === "/onboarding"
                  ? "/auth/sign-in"
                  : `/auth/sign-in?callbackUrl=${encodeURIComponent(destination)}`
              }
            >
              Sign in
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

