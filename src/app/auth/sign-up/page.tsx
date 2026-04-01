import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SignUpForm } from "@/components/SignUpForm";

export default async function SignUpPage() {
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
          <SignUpForm />
          <p className="mt-4 text-sm text-[color:var(--ink-muted)]">
            Already have an account?{" "}
            <Link className="font-semibold text-[color:var(--brand-magenta)]" href="/auth/sign-in">
              Sign in
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

