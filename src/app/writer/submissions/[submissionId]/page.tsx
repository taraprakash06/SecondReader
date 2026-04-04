import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SubmissionInitialPagesBody } from "@/components/SubmissionInitialPagesBody";
import {
  MAX_READER_SLOTS_PER_SUBMISSION,
  getSubmissionSlotUsage,
  submissionSlotsUsed,
} from "@/lib/critiqueLimits";
import {
  acceptVolunteerReadRequest,
  declineVolunteerReadRequest,
} from "@/app/pieces/actions";

export default async function WriterSubmissionDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ submissionId: string }>;
  searchParams?: Promise<{ created?: string }>;
}) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/auth/sign-in");

  const { submissionId } = await params;
  const sp = (await searchParams) ?? {};
  const justCreated = sp.created === "1" || sp.created === "true";

  const submission = await db.submission.findFirst({
    where: { id: submissionId, writerId: userId },
    include: {
      assignments: {
        include: {
          reader: { include: { readerProfile: { include: { feedbackSamples: true } } } },
          feedback: { include: { comments: { orderBy: { createdAt: "asc" } } } },
          tags: true,
        },
        orderBy: { updatedAt: "desc" },
      },
      volunteerRequests: {
        where: { status: "PENDING" },
        include: { reader: { select: { id: true, name: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!submission) notFound();

  const readerSlots = await getSubmissionSlotUsage(submissionId);
  const slotsUsed = submissionSlotsUsed(readerSlots);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      {justCreated ? (
        <div
          role="status"
          className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950"
        >
          <p className="font-semibold">Submission created</p>
          <p className="mt-1 text-emerald-900/90">
            Your piece is saved. You can invite readers from Browse Readers when you’re ready.
          </p>
        </div>
      ) : null}
      <div className="flex flex-col gap-2">
        <Link className="text-sm font-medium text-zinc-700 hover:text-zinc-900" href="/writer">
          ← Writer space
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{submission.title}</h1>
        <p className="text-sm text-zinc-700">
          <span className="font-medium text-zinc-900">{submission.genre}</span>
          {submission.subgenre ? ` · ${submission.subgenre}` : ""} · {submission.wordCount} words
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900">Your initial share (3-page gate)</h2>
          {submission.focusOther ? (
            <p className="mt-3 text-sm leading-6 text-zinc-700">
              <span className="font-medium text-zinc-900">Other focus:</span> {submission.focusOther}
            </p>
          ) : null}
          <SubmissionInitialPagesBody content={submission.initialPages} />
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900">Invites &amp; critiques</h2>
          <p className="mt-1 text-sm text-zinc-700">
            Browse readers, read a sample, then use <strong>Invite reader</strong> on their profile.
            When they accept, their feedback appears here. You can have up to{" "}
            {MAX_READER_SLOTS_PER_SUBMISSION} readers/invites in flight per piece (active critiques plus
            pending invites).
          </p>
          <p className="mt-2 text-xs text-zinc-600">
            Reader slots on this piece:{" "}
            <span className="font-semibold text-zinc-900">
              {slotsUsed} / {MAX_READER_SLOTS_PER_SUBMISSION}
            </span>{" "}
            ({readerSlots.activeAssignments} active, {readerSlots.pendingWriterInvites} pending invite
            {readerSlots.pendingWriterInvites === 1 ? "" : "s"})
          </p>

          {submission.volunteerRequests.length > 0 ? (
            <div className="mt-4 rounded-2xl border border-[color:var(--brand-magenta)]/25 bg-[color:var(--paper-2)] p-4">
              <p className="text-sm font-semibold text-zinc-900">Readers who requested this piece</p>
              <ul className="mt-3 space-y-3">
                {submission.volunteerRequests.map((vr) => (
                  <li
                    key={vr.id}
                    className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="text-sm font-medium text-zinc-900">{vr.reader.name}</span>
                    <div className="flex flex-wrap gap-2">
                      <form action={acceptVolunteerReadRequest.bind(null, vr.id)}>
                        <button
                          type="submit"
                          className="inline-flex h-9 items-center justify-center rounded-xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] px-3 text-xs font-semibold text-white shadow-sm hover:opacity-95"
                        >
                          Accept
                        </button>
                      </form>
                      <form action={declineVolunteerReadRequest.bind(null, vr.id)}>
                        <button
                          type="submit"
                          className="inline-flex h-9 items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-800 hover:bg-zinc-50"
                        >
                          Decline
                        </button>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-4 space-y-4">
            {submission.assignments.map((a) => (
              <div key={a.id} className="rounded-2xl border border-zinc-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{a.reader.name}</p>
                    <p className="text-xs text-zinc-600">Status: {a.status}</p>
                  </div>
                  <Link
                    className="text-sm font-medium text-zinc-700 hover:text-zinc-900"
                    href={`/critiques/${a.id}`}
                  >
                    Open critique →
                  </Link>
                </div>

                {a.feedback ? (
                  <div className="mt-3 rounded-xl bg-zinc-50 p-3 text-sm text-zinc-700">
                    <p className="font-medium text-zinc-900">Latest summary</p>
                    <p className="mt-1">
                      <span className="font-medium text-zinc-900">Strengths:</span>{" "}
                      {a.feedback.strengths || "—"}
                    </p>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-zinc-700">No feedback yet.</p>
                )}
              </div>
            ))}

            {submission.assignments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-700">
                No readers are connected yet.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

