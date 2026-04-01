import Link from "next/link";

export default function ReaderLanding() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <div className="flex flex-col gap-2">
        <Link
          className="text-sm font-medium text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]"
          href="/"
        >
          ← Home
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Reader space</h1>
        <p className="text-sm leading-6 text-[color:var(--ink-muted)]">
          On Second Reader, trust comes from what you do—not a résumé or a star
          rating. Your first step is a public feedback sample so writers can see
          your tone and depth.
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] p-[1px] shadow-sm">
        <div className="rounded-[23px] border border-zinc-200 bg-white/90 p-6 backdrop-blur">
          <h2 className="text-lg font-semibold">How it works (for readers)</h2>
          <ol className="mt-3 space-y-2 text-sm leading-6 text-[color:var(--ink-muted)]">
            <li>
              <span className="font-medium text-[color:var(--ink)]">Step 1:</span>{" "}
              Write your one public feedback sample on the anonymous fiction piece <em>The Tooth</em>{" "}
              (about 1–2 pages).
            </li>
            <li>
              <span className="font-medium text-[color:var(--ink)]">Step 2:</span>{" "}
              Writers browse your sample and invite you into a critique.
            </li>
            <li>
              <span className="font-medium text-[color:var(--ink)]">Step 3:</span>{" "}
              You give inline margin notes + a short summary on their first 3 pages.
            </li>
          </ol>
          <p className="mt-4 text-sm text-[color:var(--ink-muted)]">
            Readers are capped at a few active critiques at a time so each piece
            gets real attention.
          </p>

          <div className="mt-6">
            <Link
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] px-4 text-sm font-semibold text-white shadow-sm hover:opacity-95"
              href="/reader/onboarding"
            >
              Write my feedback sample →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

