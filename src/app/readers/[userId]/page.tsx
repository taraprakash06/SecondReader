import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { InlineMarginComments } from "@/components/InlineMarginComments";

export default async function ReaderProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const profile = await db.readerProfile.findUnique({
    where: { userId },
    include: {
      user: true,
      feedbackSamples: {
        include: { samplePiece: true, comments: { orderBy: { createdAt: "asc" } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!profile || profile.feedbackSamples.length === 0) notFound();

  const s = profile.feedbackSamples[0];

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <div className="flex flex-col gap-2">
        <Link
          className="text-sm font-medium text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]"
          href="/readers"
        >
          ← Back to readers
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{profile.user.name}</h1>
        <p className="text-sm text-[color:var(--ink-muted)]">
          <span className="font-medium text-[color:var(--ink)]">Writing background:</span>{" "}
          {profile.writingBackground || "—"}
        </p>
        <p className="text-sm text-[color:var(--ink-muted)]">
          <span className="font-medium text-[color:var(--ink)]">Genres:</span> {profile.genres || "—"}
        </p>
        <p className="text-sm text-[color:var(--ink-muted)]">
          <span className="font-medium text-[color:var(--ink)]">Cares about:</span> {profile.caresAbout || "—"}
        </p>
        <p className="text-sm text-[color:var(--ink-muted)]">
          <span className="font-medium text-[color:var(--ink)]">Philosophy of feedback:</span>{" "}
          {profile.feedbackPhilosophy || "—"}
        </p>
      </div>

      <div className="mt-8 overflow-visible rounded-3xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] p-[1px] shadow-sm">
        <div className="rounded-[23px] border border-zinc-200 bg-white/90 p-8 pr-10 backdrop-blur">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold text-[color:var(--ink)]">Public feedback sample</p>
              <p className="mt-1 text-xs text-[color:var(--ink-muted)]">
                Showing latest sample (writers can browse multiple).
              </p>
            </div>
            <Link
              className="inline-flex h-9 items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 text-xs font-semibold text-[color:var(--ink)] hover:border-[color:var(--brand-magenta)]/35 hover:bg-[color:var(--paper-2)]"
              href={`/reader/onboarding?email=${encodeURIComponent(profile.user.email)}&name=${encodeURIComponent(profile.user.name)}`}
            >
              Add another feedback sample →
            </Link>
          </div>
          <h2 className="text-lg font-semibold">{s.samplePiece.title}</h2>
        </div>

        <div className="mt-5 grid gap-4">
          <div className="rounded-2xl bg-[color:var(--paper-2)] p-4">
            <p className="text-xs font-semibold text-[color:var(--ink)]">Sample text</p>
            <InlineMarginComments
              text={s.samplePiece.text}
              comments={s.comments.map((c) => ({
                id: c.id,
                quote: c.quote ?? "",
                message: c.message,
              }))}
            />
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-[color:var(--paper-2)] p-4">
          <p className="text-xs font-semibold text-[color:var(--ink)]">Summary</p>
          <div className="mt-2 space-y-3 text-sm leading-6 text-[color:var(--ink-muted)]">
            <div>
              <p className="font-medium text-[color:var(--ink)]">Strengths</p>
              <p>{s.publicStrengths || "—"}</p>
            </div>
            <div>
              <p className="font-medium text-[color:var(--ink)]">Areas for improvement</p>
              <p>{s.publicImprovements || "—"}</p>
            </div>
            <div>
              <p className="font-medium text-[color:var(--ink)]">Key takeaways</p>
              <p>{s.publicKeyTakeaways || "—"}</p>
            </div>
          </div>
        </div>

        {profile.feedbackSamples.length > 1 ? (
          <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4">
            <p className="text-xs font-semibold text-[color:var(--ink)]">More feedback samples</p>
            <ul className="mt-2 space-y-2 text-sm text-[color:var(--ink-muted)]">
              {profile.feedbackSamples.slice(1).map((fs) => (
                <li key={fs.id} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-[color:var(--ink)]">{fs.samplePiece.title}</p>
                    <p className="text-xs text-[color:var(--ink-muted)]">
                      {fs.genre.replaceAll("_", " ").toLowerCase()}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[color:var(--brand-purple)]">
                    (latest shown above)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        </div>
      </div>
    </div>
  );
}

