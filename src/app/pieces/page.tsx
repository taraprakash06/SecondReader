import type { ComponentProps } from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  getSubmissionSlotUsageMap,
  submissionHasRoomForInviteOrVolunteer,
} from "@/lib/critiqueLimits";
import {
  formatFocusAreasLine,
  formatWriterBrowseNoteLine,
  formatWordCountLine,
} from "@/lib/submissionBrowseDisplay";
import { RequestToReadButton } from "@/app/pieces/RequestToReadButton";

export default async function BrowsePiecesPage() {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  const submissions = await db.submission.findMany({
    where: {
      requestsOpen: true,
      ...(userId ? { writerId: { not: userId } } : {}),
    },
    select: {
      id: true,
      title: true,
      genre: true,
      subgenre: true,
      wordCount: true,
      stage: true,
      writerFocusAreas: true,
      focusOther: true,
      writerBrowseNote: true,
      requestsOpen: true,
      writerId: true,
      writer: { select: { id: true, name: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 100,
  });

  const subIds = submissions.map((s) => s.id);
  const slotUsageMap = await getSubmissionSlotUsageMap(subIds);

  let readerHasSample = false;
  let assignmentBySub = new Map<string, string>();
  let volunteerBySub = new Map<string, "PENDING" | "ACCEPTED" | "DECLINED">();

  if (userId && subIds.length > 0) {
    const [readerUser, assignments, volunteers] = await Promise.all([
      db.user.findUnique({
        where: { id: userId },
        include: { readerProfile: { include: { feedbackSamples: { take: 1 } } } },
      }),
      db.critiqueAssignment.findMany({
        where: { readerId: userId, submissionId: { in: subIds } },
        select: { submissionId: true, id: true },
      }),
      db.readerVolunteerRequest.findMany({
        where: { readerId: userId, submissionId: { in: subIds } },
        select: { submissionId: true, status: true },
      }),
    ]);

    readerHasSample = Boolean(readerUser?.readerProfile?.feedbackSamples?.length);
    for (const a of assignments) {
      assignmentBySub.set(a.submissionId, a.id);
    }
    for (const v of volunteers) {
      volunteerBySub.set(v.submissionId, v.status);
    }
  }

  const callbackUrl = "/pieces";

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <div className="flex flex-col gap-2">
        <Link className="text-sm font-medium text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]" href="/">
          ← Home
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Browse Pieces</h1>
        <p className="text-sm leading-6 text-[color:var(--ink-muted)]">
          Read what writers are looking for. Full text stays private until a writer accepts your request. You
          can have up to 5 open requests at a time and up to 3 active critiques; each piece accepts at most 3
          readers/invites.
        </p>
        {userId ? (
          <p className="text-sm leading-6 text-[color:var(--ink-muted)]">
            <span className="font-medium text-[color:var(--ink)]">Your own pieces</span> aren’t listed here while
            you’re signed in—only other writers’ open submissions. Sign out (guest) to see how your listing
            appears to readers.
          </p>
        ) : null}
      </div>

      <div className="mt-10 space-y-6">
        {submissions.map((s) => {
          const genreLine = s.subgenre.trim() ? `${s.genre}, ${s.subgenre}` : s.genre;
          const focusLine = formatFocusAreasLine(s.writerFocusAreas, s.focusOther);
          const writerNote = formatWriterBrowseNoteLine(s.stage, s.writerBrowseNote);

          let buttonState: ComponentProps<typeof RequestToReadButton>["state"] = "signed_out";
          let assignmentId: string | null = null;

          if (!userId) {
            buttonState = "signed_out";
          } else if (!s.requestsOpen) {
            buttonState = "closed";
          } else if (assignmentBySub.has(s.id)) {
            buttonState = "connected";
            assignmentId = assignmentBySub.get(s.id) ?? null;
          } else if (volunteerBySub.get(s.id) === "PENDING") {
            buttonState = "pending";
          } else if (!readerHasSample) {
            buttonState = "need_sample";
          } else if (
            !submissionHasRoomForInviteOrVolunteer(slotUsageMap.get(s.id) ?? { activeAssignments: 0, pendingWriterInvites: 0 })
          ) {
            buttonState = "piece_full";
          } else {
            buttonState = "ready";
          }

          return (
            <article
              key={s.id}
              className="rounded-2xl border border-zinc-200 bg-white/95 p-6 shadow-sm backdrop-blur"
            >
              <h2 className="text-lg font-semibold text-[color:var(--ink)]">{s.title}</h2>
              <p className="mt-1 text-sm text-[color:var(--ink-muted)]">
                <span className="font-medium text-[color:var(--ink)]">Writer:</span> {s.writer.name}
              </p>
              <dl className="mt-4 space-y-2 text-sm">
                <div>
                  <dt className="inline font-medium text-[color:var(--ink)]">Genre:</dt>{" "}
                  <dd className="inline text-[color:var(--ink-muted)]">{genreLine || "—"}</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-[color:var(--ink)]">Length:</dt>{" "}
                  <dd className="inline text-[color:var(--ink-muted)]">{formatWordCountLine(s.wordCount)}</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-[color:var(--ink)]">Looking for feedback on:</dt>{" "}
                  <dd className="inline text-[color:var(--ink-muted)]">{focusLine}</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-[color:var(--ink)]">Writer note:</dt>{" "}
                  <dd className="inline text-[color:var(--ink-muted)]">{writerNote}</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-[color:var(--ink)]">Requests open:</dt>{" "}
                  <dd className="inline text-[color:var(--ink-muted)]">{s.requestsOpen ? "Yes" : "No"}</dd>
                </div>
              </dl>
              <div className="mt-5">
                <RequestToReadButton
                  submissionId={s.id}
                  state={buttonState}
                  signInCallbackUrl={callbackUrl}
                  connectedAssignmentId={assignmentId}
                />
              </div>
            </article>
          );
        })}
      </div>

      {submissions.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-zinc-300 p-8 text-sm text-[color:var(--ink-muted)]">
          No pieces are open for requests right now. Check back later, or open your own piece to writers from
          your submission page.
        </p>
      ) : null}
    </div>
  );
}
