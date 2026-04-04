"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { MarginNotesEditor, type MarginDraftComment } from "@/components/MarginNotesEditor";

export function CritiqueFeedbackComposer({
  draftPlainForMargins,
  defaultStrengths,
  defaultImprovements,
  defaultKeyTakeaways,
  defaultComments,
}: {
  draftPlainForMargins: string;
  defaultStrengths: string;
  defaultImprovements: string;
  defaultKeyTakeaways: string;
  defaultComments: MarginDraftComment[];
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

  const [comments, setComments] = React.useState<MarginDraftComment[]>(defaultComments);
  const [strengths, setStrengths] = React.useState(defaultStrengths);
  const [improvements, setImprovements] = React.useState(defaultImprovements);
  const [keyTakeaways, setKeyTakeaways] = React.useState(defaultKeyTakeaways);

  return (
    <>
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900">Margin notes</h3>
          <p className="mt-1 text-xs text-zinc-600">
            This panel uses a plain-text copy of the shared draft (and any unlocked pages) so you can select
            phrases. Add comments or deletion suggestions, then fill out your overall summary below.
          </p>
        </div>
        <MarginNotesEditor
          sampleText={draftPlainForMargins}
          comments={comments}
          setComments={setComments}
          readerName={readerName}
          readerInitial={readerInitial}
          heading="Draft excerpt (plain text)"
          description={
            <>
              <span className="font-semibold text-zinc-800">Comment</span>: highlight text and add your note.{" "}
              <span className="font-semibold text-zinc-800">Suggest</span>: mark text to delete — it shows with a green
              strikethrough.
            </>
          }
        />
      </div>

      <div className="mt-6 border-t border-zinc-200 pt-6">
        <h3 className="text-sm font-semibold text-zinc-900">Your feedback summary</h3>
        <p className="mt-1 text-xs text-zinc-600">
          Overall strengths, improvements, and takeaways—alongside any margin notes above.
        </p>
        <div className="mt-4 space-y-3">
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-zinc-800">Strengths</span>
            <textarea
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-zinc-800">Areas for improvement</span>
            <textarea
              value={improvements}
              onChange={(e) => setImprovements(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-zinc-800">Key takeaways</span>
            <textarea
              value={keyTakeaways}
              onChange={(e) => setKeyTakeaways(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            />
          </label>
        </div>
      </div>

      <input type="hidden" name="commentsJson" value={JSON.stringify(comments)} />
      <input type="hidden" name="strengths" value={strengths} />
      <input type="hidden" name="improvements" value={improvements} />
      <input type="hidden" name="keyTakeaways" value={keyTakeaways} />
    </>
  );
}
