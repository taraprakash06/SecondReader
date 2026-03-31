import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16 text-[color:var(--ink)]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(1000px_circle_at_15%_15%,color-mix(in_oklab,var(--brand-magenta),transparent_60%)_0%,transparent_55%),radial-gradient(900px_circle_at_85%_20%,color-mix(in_oklab,var(--brand-purple),transparent_65%)_0%,transparent_55%),linear-gradient(180deg,var(--paper-2),var(--paper))]" />
      <main className="w-full max-w-4xl rounded-3xl border border-[color:color-mix(in_oklab,var(--brand-magenta),#000_90%)]/10 bg-white/90 p-10 shadow-[0_30px_80px_-50px_rgba(161,0,255,0.35)] backdrop-blur">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="relative h-14 w-[280px]">
              <Image
                src="/second-reader-logo.svg"
                alt="Second Reader"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
            <div className="sm:pt-1">
              <p className="text-sm font-medium text-[color:var(--ink-muted)]">
                A trust-first critique partner meet-up space
              </p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Second Reader
              </h1>
            </div>
          </div>

          <p className="max-w-2xl text-base leading-7 text-[color:var(--ink-muted)]">
            Find trusted readers. Start with 3 pages.
          </p>
          <p className="max-w-2xl text-base leading-7 text-[color:var(--ink-muted)]">
            Share only what feels safe. Readers show a public feedback sample
            first. If it’s a fit, unlock more pages. Readers are capped at a few
            active critiques to keep attention real.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <Link
            className="group rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-[color:var(--brand-magenta)]/40 hover:shadow-[0_18px_60px_-45px_rgba(255,42,166,0.55)]"
            href="/writer"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="text-lg font-semibold">I’m a writer</h2>
                <p className="mt-1 text-sm leading-6 text-[color:var(--ink-muted)]">
                  Share 3 pages, set genre + word count, and ask for the kind of
                  feedback you want right now.
                </p>
              </div>
              <span className="text-sm font-medium text-[color:var(--brand-magenta)]">
                Start →
              </span>
            </div>
          </Link>

          <Link
            className="group rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-[color:var(--brand-purple)]/35 hover:shadow-[0_18px_60px_-45px_rgba(161,0,255,0.5)]"
            href="/readers"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="text-lg font-semibold">I’m browsing readers</h2>
                <p className="mt-1 text-sm leading-6 text-[color:var(--ink-muted)]">
                  Filter by age category and feedback style. Read public feedback
                  samples before you invite anyone in.
                </p>
              </div>
              <span className="text-sm font-medium text-[color:var(--brand-purple)]">
                Browse →
              </span>
            </div>
          </Link>

          <Link
            className="group rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-[color:var(--brand-magenta)]/25 hover:shadow-[0_18px_60px_-45px_rgba(255,42,166,0.35)]"
            href="/reader"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="text-lg font-semibold">I’m a reader</h2>
                <p className="mt-1 text-sm leading-6 text-[color:var(--ink-muted)]">
                  Give thoughtful feedback. Build trust. Start with a feedback
                  sample and review 3-page submissions.
                </p>
              </div>
              <span className="text-sm font-medium text-[color:var(--brand-magenta)]">
                Contribute →
              </span>
            </div>
          </Link>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          <div className="bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] p-[1px]">
            <div className="rounded-[15px] bg-white p-6">
              <h3 className="text-sm font-semibold">How it works</h3>
              <ol className="mt-3 space-y-2 text-sm leading-6 text-[color:var(--ink-muted)]">
            <li>
                <span className="font-medium text-[color:var(--ink)]">Step 1:</span> Share
              your first 3 pages (or the whole piece if shorter).
            </li>
            <li>
                <span className="font-medium text-[color:var(--ink)]">Step 2:</span> Reader
              gives inline notes + a short summary.
            </li>
            <li>
                <span className="font-medium text-[color:var(--ink)]">Step 3:</span> You
              choose to stop or continue (unlock more pages).
            </li>
              </ol>
              <p className="mt-3 text-xs text-[color:var(--ink-muted)]">
            Writer preferences are guidelines, not constraints—readers use their
            judgment.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
