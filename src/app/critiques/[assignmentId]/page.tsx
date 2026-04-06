import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CritiqueStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { CritiqueFeedbackComposer } from "@/components/CritiqueFeedbackComposer";
import { CritiqueFeedbackReview } from "@/components/CritiqueFeedbackReview";
import { MarkFeedbackCompleteButton } from "@/components/MarkFeedbackCompleteButton";
import { stopCritiqueWithReader, submitCritiqueFeedback, unlockFullPieceForReader } from "@/app/critiques/actions";
import { combinedDraftForMarginAnnotation } from "@/lib/submissionMarginText";

export default async function CritiquePage({
  params,
}: {
  params: Promise<{ assignmentId: string }>;
}) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/auth/sign-in");

  const { assignmentId } = await params;
  const assignment = await db.critiqueAssignment.findUnique({
    where: { id: assignmentId },
    include: {
      submission: { include: { writer: true } },
      reader: true,
      feedback: { include: { comments: { orderBy: { createdAt: "asc" } } } },
    },
  });

  if (!assignment) notFound();

  const isWriter = assignment.submission.writerId === userId;
  const isReader = assignment.readerId === userId;
  if (!isWriter && !isReader) notFound();

  const sub = assignment.submission;

  const marginAnnotationText = combinedDraftForMarginAnnotation(sub.initialPages, {
    includeFullText: assignment.readerSeesFullPiece && sub.fullText.trim().length > 0,
    fullText: sub.fullText,
  });

  const defaultMarginComments =
    assignment.feedback?.comments.map((c) => ({
      id: c.id,
      quote: c.quote,
      message: c.message,
    })) ?? [];

  const isComplete = assignment.status === CritiqueStatus.COMPLETED;
  const isStopped = assignment.status === CritiqueStatus.STOPPED;
  const firstPassComplete = assignment.firstPassComplete;
  const hasFeedback = !!assignment.feedback;

  const readerHasFullManuscriptUnlocked =
    isReader &&
    assignment.readerSeesFullPiece &&
    sub.fullText.trim().length > 0 &&
    !isComplete &&
    !isStopped;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="flex flex-col gap-2">
        <Link
          className="text-sm font-medium text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]"
          href={isWriter ? `/writer/submissions/${sub.id}` : "/notifications"}
        >
          {isWriter ? "← Submission" : "← Notifications"}
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{sub.title}</h1>
        <p className="text-sm text-[color:var(--ink-muted)]">
          <span className="font-medium text-[color:var(--ink)]">{sub.genre}</span>
          {sub.subgenre ? ` · ${sub.subgenre}` : ""} · {sub.wordCount} words · Reader:{" "}
          {assignment.reader.name} · Writer: {sub.writer.name}
          {isComplete ? (
            <span className="ml-2 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-900">
              Critique complete
            </span>
          ) : firstPassComplete ? (
            <span className="ml-2 inline-flex rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-950">
              First pass complete
            </span>
          ) : null}
        </p>
      </div>

      {isWriter && hasFeedback && !isComplete && !firstPassComplete ? (
        <p className="mt-6 rounded-2xl border border-amber-200/90 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
          <span className="font-semibold">Draft in progress.</span> {assignment.reader.name} may still edit until
          they mark this critique complete. You can read what they’ve saved so far below.
        </p>
      ) : null}

      {isWriter && firstPassComplete && !isComplete ? (
        <p className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-950">
          <span className="font-semibold">First pass is complete.</span> Read their notes below, then decide
          whether to continue and share the full piece.
        </p>
      ) : null}

      {isWriter && isComplete && hasFeedback ? (
        <p className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
          <span className="font-semibold">Full critique is complete.</span> Below is your draft with their margin
          notes and overall response.
        </p>
      ) : null}

      {isReader && isStopped ? (
        <p className="mt-6 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900">
          <span className="font-semibold">This critique was ended by the writer.</span> You can still review what
          you already left below.
        </p>
      ) : null}

      {isReader && isComplete ? (
        <p className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-950">
          <span className="font-semibold">You marked the full critique complete.</span> The writer has been
          notified. Your notes below are read-only.
        </p>
      ) : null}

      {/* Reader: still editing — single column: excerpt + margin notes + summary */}
      {isReader && !isComplete && !isStopped ? (
        <div className="mt-8">
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-8">
            <h2 className="text-sm font-semibold text-zinc-900">Your feedback</h2>
            <p className="mt-1 text-xs text-zinc-600">
              {readerHasFullManuscriptUnlocked ? (
                <>
                  The writer unlocked their full manuscript. Below is the <span className="font-medium">entire</span>{" "}
                  piece: your existing margin notes on the opening are unchanged, then a divider, then the additional
                  pages—add more notes on the remainder. Save often, then mark the full critique complete when
                  you&apos;re finished.
                </>
              ) : (
                <>
                  Read and annotate the excerpt below (first ~3 pages). Save often. Mark the first pass complete when
                  you&apos;re done with those pages. If the writer continues with you, the rest of the draft will appear
                  here and you can build on the same feedback.
                </>
              )}
            </p>
            {readerHasFullManuscriptUnlocked ? (
              <p className="mt-3 rounded-xl border border-emerald-200/90 bg-emerald-50/90 px-3 py-2 text-xs text-emerald-950">
                <span className="font-semibold">Full piece unlocked.</span> Your first-pass notes and summary are kept;
                extend them for the full manuscript.
              </p>
            ) : null}
            <form action={submitCritiqueFeedback.bind(null, assignment.id)} className="mt-5 space-y-6">
              <CritiqueFeedbackComposer
                draftPlainForMargins={marginAnnotationText}
                defaultStrengths={assignment.feedback?.strengths ?? ""}
                defaultImprovements={assignment.feedback?.improvements ?? ""}
                defaultKeyTakeaways={assignment.feedback?.keyTakeaways ?? ""}
                defaultComments={defaultMarginComments}
                fullPieceUnlocked={readerHasFullManuscriptUnlocked}
              />
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] px-4 text-sm font-semibold text-white shadow-sm hover:opacity-95"
              >
                Save feedback
              </button>
            </form>
            {hasFeedback ? (
              <MarkFeedbackCompleteButton
                assignmentId={assignment.id}
                firstPassComplete={firstPassComplete}
                readerSeesFullPiece={assignment.readerSeesFullPiece}
              />
            ) : null}
            {firstPassComplete && !assignment.readerSeesFullPiece ? (
              <p className="mt-6 border-t border-zinc-200 pt-6 text-sm text-zinc-600">
                Waiting for the writer’s decision. If they continue with you, the full piece will appear here.
              </p>
            ) : null}
            {sub.fullText.trim() && !assignment.readerSeesFullPiece ? (
              <p className="mt-6 border-t border-zinc-200 pt-6 text-sm text-zinc-600">
                If the writer likes your feedback, they may unlock more pages for you on this critique.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Reader: completed — single read-only view (draft + margin + summary together) */}
      {isReader && isComplete && hasFeedback && assignment.feedback ? (
        <div className="mt-8">
          <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-8">
            <h2 className="text-sm font-semibold text-zinc-900">Your feedback</h2>
            <div className="mt-4">
              <CritiqueFeedbackReview
                feedback={assignment.feedback}
                marginAnnotationText={marginAnnotationText}
                readerName={assignment.reader.name ?? "You"}
              />
            </div>
          </section>
        </div>
      ) : null}

      {/* Writer: one column — manuscript + margin gutter (like reader), then overall feedback, then actions */}
      {isWriter ? (
        <div className="mt-8 mx-auto w-full max-w-4xl">
          <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-8">
            <h2 className="text-sm font-semibold text-zinc-900">Reader feedback</h2>
            <p className="mt-1 text-xs text-zinc-600">
              Your draft appears with {assignment.reader.name}&apos;s margin notes beside it, then their overall
              response below.
            </p>
            {assignment.feedback ? (
              <>
                <div className="mt-6">
                  <CritiqueFeedbackReview
                    feedback={assignment.feedback}
                    marginAnnotationText={marginAnnotationText}
                    readerName={assignment.reader.name ?? "Reader"}
                    layoutVariant="wide"
                  />
                </div>
                <div className="mt-10 border-t border-zinc-200 pt-8">
                  {/* Whole piece was in the first read (~3 pages or less): no unlock / no Yes–No — just closure */}
                  {!sub.fullText.trim() ? (
                    !firstPassComplete ? (
                      <p className="text-sm text-zinc-600">Waiting for the reader to finish the first pass.</p>
                    ) : (
                      <>
                        <h3 className="text-sm font-semibold text-zinc-900">End of this critique</h3>
                        <p className="mt-1 text-sm text-zinc-600">
                          Your full piece was shared from the start, so the reader has already seen all of it. Once
                          you’ve read their feedback above, that’s the end of this reader–writer exchange on Second
                          Reader for this piece—there’s nothing more to unlock or decide here.
                        </p>
                      </>
                    )
                  ) : (
                    <>
                      <h3 className="text-sm font-semibold text-zinc-900">Continue with this reader?</h3>
                      <p className="mt-1 text-sm text-zinc-600">
                        Readers only see your first ~3 pages until you choose to share more. If you say{" "}
                        <span className="font-medium text-zinc-800">Yes</span>, the rest of your manuscript opens to
                        this reader and they’re notified. If you say <span className="font-medium text-zinc-800">No</span>
                        , the rest stays private and they’re notified you’re continuing on your own.
                      </p>
                      {assignment.readerSeesFullPiece ? (
                        <p className="mt-3 text-sm text-zinc-600">
                          {assignment.reader.name} can already see your full manuscript.
                        </p>
                      ) : !firstPassComplete ? (
                        <p className="mt-3 text-sm text-zinc-600">Waiting for the reader to finish the first pass.</p>
                      ) : (
                        <div className="mt-4 flex flex-wrap gap-2">
                          <form action={unlockFullPieceForReader.bind(null, assignment.id)}>
                            <button
                              type="submit"
                              className="inline-flex h-10 items-center justify-center rounded-xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] px-4 text-sm font-semibold text-white shadow-sm hover:opacity-95"
                            >
                              Yes
                            </button>
                          </form>
                          <form action={stopCritiqueWithReader.bind(null, assignment.id)}>
                            <button
                              type="submit"
                              className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                            >
                              No
                            </button>
                          </form>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </>
            ) : (
              <p className="mt-4 text-sm text-zinc-600">No feedback yet.</p>
            )}
          </section>
        </div>
      ) : null}

      {/* Reader without feedback row yet but complete shouldn't happen */}
      {isReader && isComplete && !hasFeedback ? (
        <p className="mt-8 text-sm text-zinc-600">No feedback on file for this critique.</p>
      ) : null}
    </div>
  );
}
