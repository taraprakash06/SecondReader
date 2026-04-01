import Link from "next/link";

const messages: Record<string, { title: string; description: string }> = {
  Configuration: {
    title: "Server configuration",
    description:
      "Check that NEXTAUTH_SECRET is set and NEXTAUTH_URL matches how you open the app (including port and 127.0.0.1 vs localhost).",
  },
  CredentialsSignin: {
    title: "Sign-in failed",
    description: "That email or password doesn’t match our records.",
  },
  AccessDenied: {
    title: "Access denied",
    description: "You don’t have permission to sign in.",
  },
  SessionRequired: {
    title: "Session required",
    description: "Sign in to continue.",
  },
  Verification: {
    title: "Link expired",
    description: "The sign-in link is no longer valid.",
  },
  default: {
    title: "Something went wrong",
    description: "There was a problem with sign-in. Try again from the sign-in page.",
  },
};

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  const raw = sp.error ?? "default";
  const key =
    raw === "undefined" || raw === "" ? "default" : raw;
  const msg = messages[key] ?? messages.default;

  return (
    <div className="mx-auto w-full max-w-md px-6 py-16">
      <div className="flex flex-col gap-2">
        <Link
          className="text-sm font-medium text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]"
          href="/"
        >
          ← Home
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{msg.title}</h1>
        <p className="text-sm leading-6 text-[color:var(--ink-muted)]">{msg.description}</p>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] p-[1px] shadow-sm">
        <div className="rounded-[23px] border border-zinc-200 bg-white/90 p-6 backdrop-blur">
          {raw && raw !== "undefined" ? (
            <p className="mb-4 font-mono text-xs text-zinc-400">Code: {raw}</p>
          ) : null}
          <Link
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] px-4 text-sm font-semibold text-white shadow-sm hover:opacity-95"
            href="/auth/sign-in"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
