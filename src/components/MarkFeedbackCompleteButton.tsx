"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { markCritiqueFeedbackComplete } from "@/app/critiques/actions";

export function MarkFeedbackCompleteButton({ assignmentId }: { assignmentId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 px-4 py-3">
      <p className="text-sm font-medium text-zinc-900">Done with this critique?</p>
      <p className="mt-1 text-xs text-zinc-600">
        When you mark feedback complete, the writer is notified and can read your margin notes and summary as
        finalized for this round.
      </p>
      {error ? (
        <p className="mt-2 text-xs font-medium text-rose-700" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="button"
        disabled={pending}
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
          pending ? "cursor-wait opacity-90" : "hover:bg-zinc-50"
        }`}
      >
        {pending ? "Marking complete…" : "Mark feedback complete"}
      </button>
    </div>
  );
}
