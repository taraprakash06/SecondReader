"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { MarginNotesEditor, type MarginDraftComment } from "@/components/MarginNotesEditor";

export function FeedbackSampleComposer({
  sampleText,
  defaultMode = "comment",
}: {
  sampleText: string;
  defaultMode?: "comment" | "suggest";
}) {
  const { data: session } = useSession();
  const readerName = session?.user?.name?.trim() || "You";
  const readerInitial =
    readerName
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .slice(0, 1) || "Y";

  const [comments, setComments] = React.useState<MarginDraftComment[]>([]);

  const [strengths, setStrengths] = React.useState("");
  const [improvements, setImprovements] = React.useState("");
  const [keyTakeaways, setKeyTakeaways] = React.useState("");

  return (
    <div className="mt-5 grid gap-4">
      <MarginNotesEditor
        sampleText={sampleText}
        comments={comments}
        setComments={setComments}
        readerName={readerName}
        readerInitial={readerInitial}
        defaultMode={defaultMode}
      />

      <div className="rounded-2xl bg-white p-4">
        <p className="text-xs font-semibold text-[color:var(--ink)]">Summary (shown publicly)</p>
        <div className="mt-3 grid gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-[color:var(--ink)]">Strengths</span>
            <textarea
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              rows={3}
              className="rounded-xl border border-zinc-200 bg-white p-3 text-sm leading-6 focus:border-[color:var(--brand-magenta)]/50 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-[color:var(--ink)]">Areas for improvement</span>
            <textarea
              value={improvements}
              onChange={(e) => setImprovements(e.target.value)}
              rows={3}
              className="rounded-xl border border-zinc-200 bg-white p-3 text-sm leading-6 focus:border-[color:var(--brand-purple)]/50 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-[color:var(--ink)]">Key takeaways</span>
            <textarea
              value={keyTakeaways}
              onChange={(e) => setKeyTakeaways(e.target.value)}
              rows={3}
              className="rounded-xl border border-zinc-200 bg-white p-3 text-sm leading-6 focus:border-[color:var(--brand-magenta)]/50 focus:outline-none"
            />
          </label>
        </div>
      </div>

      <input type="hidden" name="commentsJson" value={JSON.stringify(comments)} />
      <input type="hidden" name="strengths" value={strengths} />
      <input type="hidden" name="improvements" value={improvements} />
      <input type="hidden" name="keyTakeaways" value={keyTakeaways} />
    </div>
  );
}
