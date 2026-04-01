import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { OnboardingForm } from "@/components/OnboardingForm";

export default async function OnboardingPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/auth/sign-in");

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) redirect("/auth/sign-in");
  if (user.onboarded) redirect("/");

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-14">
      <div className="flex flex-col gap-2">
        <Link
          className="text-sm font-medium text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]"
          href="/"
        >
          ← Home
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Set up your profile</h1>
        <p className="text-sm leading-6 text-[color:var(--ink-muted)]">
          Second Reader is built for lasting relationships. Choose the genres you write and the
          genres you love to read—this sets you up as both a writer and a reader.
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] p-[1px] shadow-sm">
        <div className="rounded-[23px] border border-zinc-200 bg-white/90 p-6 backdrop-blur">
          <OnboardingForm initialName={user.name} initialEmail={user.email} />
        </div>
      </div>
    </div>
  );
}

