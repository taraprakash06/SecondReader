import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CritiqueStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubmissionInitialPagesBody } from "@/components/SubmissionInitialPagesBody";
import { CritiqueFeedbackComposer } from "@/components/CritiqueFeedbackComposer";
import { CritiqueFeedbackReview } from "@/components/CritiqueFeedbackReview";
import { MarkFeedbackCompleteButton } from "@/components/MarkFeedbackCompleteButton";
import { submitCritiqueFeedback, unlockFullPieceForReader } from "@/app/critiques/actions";
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
  const canSeeFull =
    isWriter || (isReader && assignment.readerSeesFullPiece && sub.fullText.trim().length > 0);

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
  const hasFeedback = !!assignment.feedback;

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
              Feedback complete
            </span>
          ) : null}
        </p>
      </div>

      {isWriter && hasFeedback && !isComplete ? (
        <p className="mt-6 rounded-2xl border border-amber-200/90 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
          <span className="font-semibold">Draft in progress.</span> {assignment.reader.name} may still edit until
          they mark this critique complete. You can read what they’ve saved so far below.
        </p>
      ) : null}

      {isWriter && isComplete && hasFeedback ? (
        <p className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
          <span className="font-semibold">Feedback is complete.</span> Below is your draft with their margin notes
          and overall response.
        </p>
      ) : null}

      {isReader && isComplete ? (
        <p className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-950">
          <span className="font-semibold">You marked this critique complete.</span> The writer has been notified.
          Your notes below are read-only.
        </p>
      ) : null}

      {/* Reader: still editing — single column: excerpt + margin notes + summary */}
      {isReader && !isComplete ? (
        <div className="mt-8">
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-8">
            <h2 className="text-sm font-semibold text-zinc-900">Your feedback</h2>
            <p className="mt-1 text-xs text-zinc-600">
              Read and annotate the excerpt below (includes any pages the writer unlocked). Save, then mark
              complete when you’re finished.
            </p>
            <form action={submitCritiqueFeedback.bind(null, assignment.id)} className="mt-5 space-y-6">
              <CritiqueFeedbackComposer
                draftPlainForMargins={marginAnnotationText}
                defaultStrengths={assignment.feedback?.strengths ?? ""}
                defaultImprovements={assignment.feedback?.improvements ?? ""}
                defaultKeyTakeaways={assignment.feedback?.keyTakeaways ?? ""}
                defaultComments={defaultMarginComments}
              />
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] px-4 text-sm font-semibold text-white shadow-sm hover:opacity-95"
              >
                Save feedback
              </button>
            </form>
            {hasFeedback ? <MarkFeedbackCompleteButton assignmentId={assignment.id} /> : null}
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

      {/* Writer: view feedback */}
      {isWriter ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-10">
          <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-sm font-semibold text-zinc-900">Your draft</h2>
            <p className="mt-1 text-xs text-zinc-600">Initial pages you shared with this reader.</p>
            <div className="mt-4">
              <SubmissionInitialPagesBody content={sub.initialPages} />
            </div>

            {canSeeFull && sub.fullText.trim() ? (
              <div className="mt-8 border-t border-zinc-200 pt-8">
                <h3 className="text-sm font-semibold text-zinc-900">Additional pages</h3>
                <p className="mt-1 text-xs text-zinc-600">Unlocked for this reader.</p>
                <div className="mt-4">
                  <SubmissionInitialPagesBody content={sub.fullText} />
                </div>
              </div>
            ) : null}
          </section>

          <section className="space-y-6">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-zinc-900">Reader response</h2>
              {assignment.feedback ? (
                <div className="mt-4">
                  <CritiqueFeedbackReview
                    feedback={assignment.feedback}
                    marginAnnotationText={marginAnnotationText}
                    readerName={assignment.reader.name ?? "Reader"}
                  />
                </div>
              ) : (
                <p className="mt-3 text-sm text-zinc-600">No feedback yet.</p>
              )}

              {assignment.feedback ? (
                <div className="mt-8 border-t border-zinc-200 pt-8">
                  <h3 className="text-sm font-semibold text-zinc-900">Share more pages</h3>
                  <p className="mt-1 text-sm text-zinc-600">
                    If you’re happy with this feedback, you can let {assignment.reader.name} read any additional
                    pages you’ve added to this submission.
                  </p>
                  {!sub.fullText.trim() ? (
                    <p className="mt-3 text-sm text-amber-800">
                      Add extended pages to this submission from your writer dashboard when that’s available.
                    </p>
                  ) : assignment.readerSeesFullPiece ? (
                    <p className="mt-3 text-sm text-zinc-600">
                      {assignment.reader.name} can already see your additional pages.
                    </p>
                  ) : (
                    <form action={unlockFullPieceForReader.bind(null, assignment.id)} className="mt-4">
                      <button
                        type="submit"
                        className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                      >
                        Unlock additional pages for {assignment.reader.name}
                      </button>
                    </form>
                  )}
                </div>
              ) : null}
            </div>
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
