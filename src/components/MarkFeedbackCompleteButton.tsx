"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { markCritiqueFeedbackComplete } from "@/app/critiques/actions";

export function MarkFeedbackCompleteButton({
  assignmentId,
  firstPassComplete,
  readerSeesFullPiece,
  submissionHasExtendedPortion,
}: {
  assignmentId: string;
  firstPassComplete: boolean;
  readerSeesFullPiece: boolean;
  /** True when the submission has text beyond the first-read gate (longer work). */
  submissionHasExtendedPortion: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | null>(null);

  const waitingForUnlock =
    submissionHasExtendedPortion && firstPassComplete && !readerSeesFullPiece;

  const label = !submissionHasExtendedPortion
    ? "Mark critique complete"
    : !firstPassComplete
      ? "Mark first-pass feedback complete"
      : readerSeesFullPiece
        ? "Mark full critique complete"
        : "Waiting for full piece…";

  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 px-4 py-3">
      <p className="text-sm font-medium text-zinc-900">Done with this critique?</p>
      <p className="mt-1 text-xs text-zinc-600">
        {!submissionHasExtendedPortion ? (
          <>
            You&apos;re reading the writer&apos;s <span className="font-medium text-zinc-800">full</span> manuscript—
            there isn&apos;t more to unlock. When you mark complete, the writer is notified and your notes become
            read-only.
          </>
        ) : !firstPassComplete ? (
          <>
            When you mark this first pass complete, the writer is notified and can decide whether to continue with
            you.
          </>
        ) : (
          <>
            When you mark the full critique complete, the writer is notified and your notes become read-only.
          </>
        )}
      </p>
      {error ? (
        <p className="mt-2 text-xs font-medium text-rose-700" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="button"
        disabled={pending || waitingForUnlock}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            try {
              await markCritiqueFeedbackComplete(assignmentId);
              router.refresh();
            } catch (e) {
              setError(e instanceof Error ? e.message : "Couldn’t mark complete.");
            }
          });
        }}
        className={`mt-3 inline-flex h-10 items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-900 shadow-sm ${
          pending || waitingForUnlock ? "cursor-not-allowed opacity-80" : "hover:bg-zinc-50"
        }`}
      >
        {pending ? "Marking complete…" : label}
      </button>
    </div>
  );
}
