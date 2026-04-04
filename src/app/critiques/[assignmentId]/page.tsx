import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubmissionInitialPagesBody } from "@/components/SubmissionInitialPagesBody";
import { CritiqueFeedbackComposer } from "@/components/CritiqueFeedbackComposer";
import { MarginCommentsStatic } from "@/components/MarginCommentsStatic";
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

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
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
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900">Shared draft</h2>
          <p className="mt-1 text-xs text-zinc-600">Initial pages the writer chose to share first.</p>
          {isReader ? (
            <p className="mt-2 text-xs text-zinc-500">
              Use the <span className="font-medium text-zinc-700">Margin notes</span> panel on the right to select
              phrases—the plain excerpt there matches this draft.
            </p>
          ) : null}
          <div className="mt-4">
            <SubmissionInitialPagesBody content={sub.initialPages} />
          </div>

          {canSeeFull && sub.fullText.trim() ? (
            <div className="mt-8 border-t border-zinc-200 pt-8">
              <h3 className="text-sm font-semibold text-zinc-900">Additional pages</h3>
              <p className="mt-1 text-xs text-zinc-600">
                The writer unlocked the rest of the piece for you.
              </p>
              <div className="mt-4">
                <SubmissionInitialPagesBody content={sub.fullText} />
              </div>
            </div>
          ) : isReader && sub.fullText.trim() && !assignment.readerSeesFullPiece ? (
            <p className="mt-6 text-sm text-zinc-600">
              If the writer likes your feedback, they may unlock more pages here.
            </p>
          ) : null}
        </section>

        <section className="space-y-6">
          {isReader ? (
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-zinc-900">Your feedback</h2>
              <p className="mt-1 text-xs text-zinc-600">
                Add inline margin notes on the excerpt and your overall summary—save when you’re ready.
              </p>
              <form action={submitCritiqueFeedback.bind(null, assignment.id)} className="mt-4 space-y-6">
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
            </div>
          ) : null}

          {isWriter ? (
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-zinc-900">Reader response</h2>
              {assignment.feedback ? (
                <div className="mt-3 space-y-6">
                  {assignment.feedback.comments.length > 0 ? (
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-900">Margin notes</h3>
                      <p className="mt-1 text-xs text-zinc-600">
                        Inline comments from {assignment.reader.name} on the same plain-text excerpt they used when
                        writing feedback.
                      </p>
                      <div className="mt-3 overflow-hidden rounded-2xl border border-zinc-200">
                        <MarginCommentsStatic
                          text={marginAnnotationText}
                          comments={assignment.feedback.comments.map((c) => ({
                            id: c.id,
                            quote: c.quote,
                            message: c.message,
                          }))}
                          readerName={assignment.reader.name ?? "Reader"}
                        />
                      </div>
                    </div>
                  ) : null}
                  <div className="space-y-3 text-sm text-zinc-700">
                    <div>
                      <p className="font-medium text-zinc-900">Strengths</p>
                      <p className="mt-1 whitespace-pre-wrap">{assignment.feedback.strengths || "—"}</p>
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900">Areas for improvement</p>
                      <p className="mt-1 whitespace-pre-wrap">{assignment.feedback.improvements || "—"}</p>
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900">Key takeaways</p>
                      <p className="mt-1 whitespace-pre-wrap">{assignment.feedback.keyTakeaways || "—"}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mt-1 text-sm text-zinc-600">No feedback yet.</p>
              )}

              {assignment.feedback ? (
                <div className="mt-6 border-t border-zinc-200 pt-6">
                  <h3 className="text-sm font-semibold text-zinc-900">Share more pages</h3>
                  <p className="mt-1 text-sm text-zinc-600">
                    If you’re happy with this feedback, you can let {assignment.reader.name} read any
                    additional pages you’ve added to this submission.
                  </p>
                  {!sub.fullText.trim() ? (
                    <p className="mt-3 text-sm text-amber-800">
                      Add extended pages to this submission in the database when your workflow supports
                      it—then the unlock button will appear here.
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
          ) : null}
        </section>
      </div>
    </div>
  );
}
