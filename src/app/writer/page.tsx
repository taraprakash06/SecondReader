import Link from "next/link";
import { FIRST_READ_SHARE_LABEL } from "@/lib/manuscriptSplit";

export default function WriterLanding() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-col gap-2">
        <Link className="text-sm font-medium text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]" href="/">
          ← Home
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Writer space</h1>
        <p className="text-sm leading-6 text-[color:var(--ink-muted)]">
          Upload your full manuscript, then browse readers by sample and filters. Readers only see the first{" "}
          {FIRST_READ_SHARE_LABEL} until you choose to share more.
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <div className="bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] p-[1px]">
          <div className="rounded-[15px] bg-white p-6">
            <h2 className="text-sm font-semibold">How it works (for writers)</h2>
            <ol className="mt-3 space-y-2 text-sm leading-6 text-[color:var(--ink-muted)]">
              <li>
                <span className="font-medium text-[color:var(--ink)]">Step 1:</span> Paste your full manuscript—only
                the first {FIRST_READ_SHARE_LABEL} are shown to readers at first.
              </li>
              <li>
                <span className="font-medium text-[color:var(--ink)]">Step 2:</span> A reader gives inline margin notes
                + a short summary on those pages.
              </li>
              <li>
                <span className="font-medium text-[color:var(--ink)]">Step 3:</span> You choose whether to share the
                rest of the piece with that reader or take feedback on your own.
              </li>
            </ol>
            <p className="mt-3 text-xs text-[color:var(--ink-muted)]">
              Writer preferences are guidelines, not constraints—readers use their judgment.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link
          className="rounded-2xl border border-zinc-200 bg-white/90 p-6 shadow-sm backdrop-blur hover:border-[color:var(--brand-magenta)]/35 hover:bg-[color:var(--paper-2)]"
          href="/writer/submit"
        >
          <h2 className="text-lg font-semibold">Submit a piece</h2>
          <p className="mt-1 text-sm leading-6 text-[color:var(--ink-muted)]">
            Paste your full manuscript; readers only see the first {FIRST_READ_SHARE_LABEL} until you choose to share more.
          </p>
          <p className="mt-2 text-sm leading-6 text-[color:var(--ink-muted)]">
            You can remove your piece at any time. If you plan to submit it to a journal, contest, or publication, remove
            it from your profile. It will no longer appear on Browse Pieces.
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

