import Link from "next/link";

export default function WriterLanding() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <div className="flex flex-col gap-2">
        <Link className="text-sm font-medium text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]" href="/">
          ← Home
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Writer space</h1>
        <p className="text-sm leading-6 text-[color:var(--ink-muted)]">
          For the MVP, we’ll use a demo writer account. Next you’ll be able to submit your first 3
          pages and then browse readers by sample and filters.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          className="rounded-2xl border border-zinc-200 bg-white/90 p-6 shadow-sm backdrop-blur hover:border-[color:var(--brand-magenta)]/35 hover:bg-[color:var(--paper-2)]"
          href="/writer/submit"
        >
          <h2 className="text-lg font-semibold">Submit a piece (3-page limit)</h2>
          <p className="mt-1 text-sm leading-6 text-[color:var(--ink-muted)]">
            Add genre, word count, draft stage, and what kind of feedback you want right now.
          </p>
        </Link>

        <Link
          className="rounded-2xl border border-zinc-200 bg-white/90 p-6 shadow-sm backdrop-blur hover:border-[color:var(--brand-purple)]/35 hover:bg-[color:var(--paper-2)]"
          href="/readers"
        >
          <h2 className="text-lg font-semibold">Browse readers</h2>
          <p className="mt-1 text-sm leading-6 text-[color:var(--ink-muted)]">
            Filter and read public feedback samples before inviting a reader in.
          </p>
        </Link>
      </div>
    </div>
  );
}

