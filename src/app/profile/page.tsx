import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { MarginCommentsStatic } from "@/components/MarginCommentsStatic";
import { updateProfileBioAction } from "@/app/profile/actions";

function genreLabel(genre: string) {
  return genre.replaceAll("_", " ").toLowerCase();
}

export default async function ProfilePage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/auth/sign-in");

  const user = await db.user.findUniqueOrThrow({
    where: { id: userId },
    include: {
      readerProfile: {
        include: {
          feedbackSamples: {
            include: {
              samplePiece: true,
              comments: { orderBy: { createdAt: "asc" } },
            },
            orderBy: { createdAt: "desc" },
          },
        },
      },
      submissions: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          genre: true,
          subgenre: true,
          wordCount: true,
          createdAt: true,
        },
      },
    },
  });

  const samples = user.readerProfile?.feedbackSamples ?? [];
  /** Readers have one public sample (fiction / The Tooth). Legacy rows may exist; show the latest only. */
  const readerSamples = samples.slice(0, 1);
  const submissions = user.submissions;

  const showReaderSection =
    user.role === "READER" || user.role === "BOTH" || samples.length > 0;
  const showWriterSection =
    user.role === "WRITER" || user.role === "BOTH" || submissions.length > 0;

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <div className="flex flex-col gap-2">
        <Link
          className="text-sm font-medium text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]"
          href="/"
        >
          ← Home
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Your profile</h1>
        <p className="text-sm leading-6 text-[color:var(--ink-muted)]">
          What you see on your public reader page and your writer submissions.
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] p-[1px] shadow-sm">
        <div className="rounded-[23px] border border-zinc-200 bg-white/90 p-6 backdrop-blur">
          <dl className="grid gap-4 text-sm">
            <div>
              <dt className="font-medium text-[color:var(--ink)]">Name</dt>
              <dd className="mt-1 text-[color:var(--ink-muted)]">{user.name}</dd>
            </div>
            <div>
              <dt className="font-medium text-[color:var(--ink)]">Email</dt>
              <dd className="mt-1 text-[color:var(--ink-muted)]">{user.email}</dd>
            </div>
            <div>
              <dt className="font-medium text-[color:var(--ink)]">Bio</dt>
              <dd className="mt-1 text-[color:var(--ink-muted)]">
                {user.bio ? (
                  <span className="whitespace-pre-wrap">{user.bio}</span>
                ) : (
                  <span className="italic text-zinc-400">No bio yet.</span>
                )}
              </dd>
            </div>
          </dl>

          <form action={updateProfileBioAction} className="mt-6 border-t border-zinc-200 pt-6">
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-[color:var(--ink)]">
                {user.bio ? "Update bio" : "Add a bio (optional)"}
              </span>
              <textarea
                name="bio"
                rows={4}
                defaultValue={user.bio}
                className="min-h-[100px] w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-[color:var(--ink)] focus:border-[color:var(--brand-magenta)]/50 focus:outline-none"
                placeholder="A few lines about you, your writing, or how you like to give feedback."
              />
            </label>
            <button
              type="submit"
              className="mt-3 inline-flex h-9 items-center justify-center rounded-xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] px-4 text-xs font-semibold text-white shadow-sm hover:opacity-95"
            >
              Save bio
            </button>
          </form>
        </div>
      </div>

      {showReaderSection ? (
        <section className="mt-10">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">As a reader</h2>
              <p className="text-sm text-[color:var(--ink-muted)]">
                Your public fiction feedback sample (readers complete one sample on <em>The Tooth</em>
                ).
              </p>
            </div>
            {readerSamples.length > 0 ? (
              <Link
                className="text-sm font-semibold text-[color:var(--brand-magenta)] hover:underline"
                href={`/readers/${user.id}`}
              >
                View public reader page →
              </Link>
            ) : null}
          </div>

          {readerSamples.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-zinc-200 bg-white/90 p-6 text-sm text-[color:var(--ink-muted)]">
              <p>You don’t have a public feedback sample yet.</p>
              <Link
                className="mt-3 inline-flex font-semibold text-[color:var(--brand-purple)] hover:underline"
                href="/reader/onboarding"
              >
                Write your fiction sample →
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-10">
              {readerSamples.map((s) => (
                <div
                  key={s.id}
                  id={`sample-${s.id}`}
                  className="overflow-visible rounded-3xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] p-[1px] shadow-sm"
                >
                  <div className="rounded-[23px] border border-zinc-200 bg-white/90 p-6 pr-10 backdrop-blur">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                      <h3 className="text-base font-semibold">{s.samplePiece.title}</h3>
                      <span className="text-xs font-medium text-[color:var(--ink-muted)]">
                        {genreLabel(s.genre)}
                      </span>
                    </div>
                    <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                      <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-2.5">
                        <p className="text-xs font-semibold text-[color:var(--ink)]">Sample text</p>
                      </div>
                      <MarginCommentsStatic
                        text={s.samplePiece.text}
                        readerName={user.name}
                        comments={s.comments.map((c) => ({
                          id: c.id,
                          quote: c.quote ?? "",
                          message: c.message,
                        }))}
                      />
                    </div>
                    <div className="mt-4 rounded-2xl bg-[color:var(--paper-2)] p-4">
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
              ))}
            </div>
          )}
        </section>
      ) : null}

      {showWriterSection ? (
        <section className="mt-10">
          <h2 className="text-lg font-semibold">As a writer</h2>
          <p className="mt-1 text-sm text-[color:var(--ink-muted)]">
            Pieces you’ve submitted to be reviewed will appear here.
          </p>

          {submissions.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-zinc-200 bg-white/90 p-6 text-sm text-[color:var(--ink-muted)]">
              <p>No submissions yet.</p>
              <Link
                className="mt-3 inline-flex font-semibold text-[color:var(--brand-magenta)] hover:underline"
                href="/writer/submit"
              >
                Submit a piece →
              </Link>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {submissions.map((sub) => (
                <li key={sub.id}>
                  <Link
                    href={`/writer/submissions/${sub.id}`}
                    className="block rounded-2xl border border-zinc-200 bg-white/90 p-4 transition hover:border-[color:var(--brand-magenta)]/35 hover:bg-[color:var(--paper-2)]"
                  >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-semibold text-[color:var(--ink)]">{sub.title}</p>
                        <p className="text-sm text-[color:var(--ink-muted)]">
                          {sub.genre}
                          {sub.subgenre ? ` · ${sub.subgenre}` : ""} · {sub.wordCount} words
                        </p>
                      </div>
                      <p className="text-xs text-[color:var(--ink-muted)]">
                        {sub.createdAt.toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <p className="mt-2 text-xs font-medium text-[color:var(--brand-magenta)]">
                      Open submission →
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}
    </div>
  );
}
