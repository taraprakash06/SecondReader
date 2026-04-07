import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16 text-[color:var(--ink)]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(1000px_circle_at_15%_15%,color-mix(in_oklab,var(--brand-magenta),transparent_60%)_0%,transparent_55%),radial-gradient(900px_circle_at_85%_20%,color-mix(in_oklab,var(--brand-purple),transparent_65%)_0%,transparent_55%),linear-gradient(180deg,var(--paper-2),var(--paper))]" />
      <main className="w-full max-w-5xl rounded-3xl border border-[color:color-mix(in_oklab,var(--brand-magenta),#000_90%)]/10 bg-white/90 p-10 shadow-[0_30px_80px_-50px_rgba(161,0,255,0.35)] backdrop-blur">
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
            <div className="min-w-0 max-w-full sm:pt-1">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Second Reader
              </h1>
            </div>
          </div>

          <p className="max-w-2xl text-base leading-7 text-[color:var(--ink-muted)]">
            Find readers you trust based on their feedback samples. You upload your full manuscript; readers only see
            your first ~3 pages until you choose to share more. If their feedback is helpful, you can open the rest
            of your piece to them. Readers are limited to a few active critiques so every piece gets real attention.
          </p>
          <p className="max-w-2xl text-base font-medium leading-7 text-[color:var(--ink)]">
            Most people here are both writers and readers — you can do both.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <Link
            className="group rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-[color:var(--brand-magenta)]/40 hover:shadow-[0_18px_60px_-45px_rgba(255,42,166,0.55)]"
            href="/writer"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="text-lg font-semibold">Submit Your Work</h2>
                <p className="mt-1 text-sm leading-6 text-[color:var(--ink-muted)]">
                  Upload your full piece (readers only see the first ~3 pages at first), set genre + word count, and
                  say what feedback you want.
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
                <h2 className="text-lg font-semibold">Submit Feedback Sample</h2>
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

        <section className="mt-14 border-t border-zinc-200/80 pt-10">
          <h2 className="text-xl font-semibold tracking-tight text-[color:var(--ink)]">
            How Second Reader works
          </h2>
          <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-12">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--brand-magenta)]">
                For writers
              </h3>
              <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-6 text-[color:var(--ink-muted)]">
                <li>
                  Upload your full manuscript (
                  <Link className="font-medium text-[color:var(--ink)] underline decoration-[color:var(--brand-magenta)]/40 underline-offset-2 hover:decoration-[color:var(--brand-magenta)]" href="/writer">
                    Submit Your Work
                  </Link>
                  )—readers only see the first ~3 pages until you share more.
                </li>
                <li>Browse readers or receive requests.</li>
                <li>Invite readers you trust (up to 3 readers per piece).</li>
                <li>Receive feedback on your first pages from a reader.</li>
                <li>Share the rest of your piece with that reader if it’s a fit.</li>
                <li>Build ongoing critique relationships.</li>
              </ol>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--brand-purple)]">
                For readers
              </h3>
              <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-6 text-[color:var(--ink-muted)]">
                <li>
                  Complete your feedback sample (
                  <Link className="font-medium text-[color:var(--ink)] underline decoration-[color:var(--brand-purple)]/40 underline-offset-2 hover:decoration-[color:var(--brand-purple)]" href="/reader">
                    Submit Feedback Sample
                  </Link>
                  ).
                </li>
                <li>Browse open submissions or accept invitations from writers.</li>
                <li>Read the first 3 pages.</li>
                <li>Leave inline notes + a short summary of feedback.</li>
                <li>Get invited to read more (up to 3 active critiques at a time).</li>
                <li>Build trust and long-term partnerships.</li>
              </ol>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
