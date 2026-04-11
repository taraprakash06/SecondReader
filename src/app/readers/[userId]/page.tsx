import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { BrowseReadersAuthGate } from "@/components/BrowseReadersAuthGate";
import { MarginCommentsStatic } from "@/components/MarginCommentsStatic";
import { InviteReaderForm } from "@/app/readers/[userId]/InviteReaderForm";

export default async function ReaderProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="flex flex-col gap-2">
          <Link className="text-sm font-medium text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]" href="/">
            ← Home
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">Reader profile</h1>
          <p className="text-sm leading-6 text-[color:var(--ink-muted)]">
            Sign in to view this reader&apos;s public feedback sample and invite them to your work.
          </p>
        </div>
        <BrowseReadersAuthGate callbackPath={`/readers/${userId}`} />
      </div>
    );
  }

  const isSelf = session.user.id === userId;

  const writerSubmissions =
    !isSelf
      ? await db.submission.findMany({
          where: { writerId: session.user.id },
          orderBy: { createdAt: "desc" },
          select: { id: true, title: true },
        })
      : [];

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
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-col gap-2">
        <Link
          className="text-sm font-medium text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]"
          href="/readers"
        >
          ← Browse readers
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{profile.user.name}</h1>
        <dl className="mt-4 space-y-2 text-sm">
          <div>
            <dt className="inline font-medium text-[color:var(--ink)]">Genres:</dt>{" "}
            <dd className="inline text-[color:var(--ink-muted)]">{profile.genres.trim() ? profile.genres : "—"}</dd>
          </div>
          <div>
            <dt className="inline font-medium text-[color:var(--ink)]">Cares about:</dt>{" "}
            <dd className="inline text-[color:var(--ink-muted)]">
              {profile.caresAbout.trim() ? profile.caresAbout : "—"}
            </dd>
          </div>
          <div>
            <dt className="inline font-medium text-[color:var(--ink)]">Philosophy:</dt>{" "}
            <dd className="inline text-[color:var(--ink-muted)]">
              {profile.feedbackPhilosophy.trim() ? profile.feedbackPhilosophy : "—"}
            </dd>
          </div>
        </dl>
        {profile.writingBackground.trim() ? (
          <p className="mt-4 text-sm text-[color:var(--ink-muted)]">
            <span className="font-medium text-[color:var(--ink)]">Writing background:</span>{" "}
            {profile.writingBackground}
          </p>
        ) : null}
      </div>

      <div className="mt-8 overflow-visible rounded-3xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] p-[1px] shadow-sm">
        <div className="rounded-[23px] border border-zinc-200 bg-white/90 p-8 pr-10 backdrop-blur">
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-xs font-semibold text-[color:var(--ink)]">Public feedback sample</p>
            <p className="mt-1 text-xs text-[color:var(--ink-muted)]">
              Fiction — each reader has one sample on the same short piece.
            </p>
          </div>
          <h2 className="text-lg font-semibold">{s.samplePiece.title}</h2>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-2.5">
            <p className="text-xs font-semibold text-[color:var(--ink)]">Sample text</p>
          </div>
          <MarginCommentsStatic
            text={s.samplePiece.text}
            readerName={profile.user.name}
            comments={s.comments.map((c) => ({
              id: c.id,
              quote: c.quote ?? "",
              message: c.message,
            }))}
          />
        </div>

        <div className="mt-6 rounded-2xl bg-white p-4">
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
        </div>
      </div>

      {!isSelf ? (
        <section className="mt-10 rounded-3xl border border-zinc-200 bg-white/90 p-6 shadow-sm backdrop-blur">
          <h2 className="text-lg font-semibold text-[color:var(--ink)]">Ask for feedback</h2>
          <p className="mt-1 text-sm text-[color:var(--ink-muted)]">
            After you’ve read their sample, choose a piece you’ve submitted and send an invite. They’ll
            get a notification and can accept or decline.
          </p>
          <InviteReaderForm readerUserId={userId} submissions={writerSubmissions} />
        </section>
      ) : null}
    </div>
  );
}

