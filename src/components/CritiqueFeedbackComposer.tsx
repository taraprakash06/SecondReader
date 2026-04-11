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
  fullPieceUnlocked = false,
  firstReadIsWholePiece = false,
}: {
  draftPlainForMargins: string;
  defaultStrengths: string;
  defaultImprovements: string;
  defaultKeyTakeaways: string;
  defaultComments: MarginDraftComment[];
  /** When true, reader has the full manuscript after writer unlock; prior notes on the opening are preserved. */
  fullPieceUnlocked?: boolean;
  /** When true, the first-read text is the writer's entire submission (no extended portion). */
  firstReadIsWholePiece?: boolean;
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

  const fullManuscriptLabels = fullPieceUnlocked || firstReadIsWholePiece;

  return (
    <>
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 sm:text-sm">
            {fullManuscriptLabels ? "Full manuscript — margin notes" : "Shared draft — margin notes"}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-zinc-600 sm:text-xs sm:leading-normal">
            {fullPieceUnlocked ? (
              <>
                The opening includes your <span className="font-medium text-zinc-800">saved</span> margin notes from
                the first pass. After the divider line, continue annotating the rest of the piece the same way. Update
                your summary below to reflect feedback on the full manuscript when you’re ready.
              </>
            ) : firstReadIsWholePiece ? (
              <>
                This is the writer&apos;s <span className="font-medium text-zinc-800">complete</span>{" "}
                submission—
                everything they shared is below, with nothing more to unlock. Select text to add comments or deletion
                suggestions, then add your overall summary. When you&apos;re done, mark the critique complete.
              </>
            ) : (
              <>
                Select text in the excerpt below (or type a phrase) to add comments or deletion suggestions. Paste from
                Word may show as plain text—highlights still match the piece. Then add your overall summary under this
                section.
              </>
            )}
          </p>
        </div>
        <MarginNotesEditor
          sampleText={draftPlainForMargins}
          comments={comments}
          setComments={setComments}
          readerName={readerName}
          readerInitial={readerInitial}
          layoutVariant="wide"
          heading={fullManuscriptLabels ? "Full manuscript" : "Your excerpt"}
          description={
            <>
              <span className="font-semibold text-zinc-800">Comment</span>: highlight in the text and add your note.{" "}
              <span className="font-semibold text-zinc-800">Suggest</span>: mark text to delete — it shows with a green
              strikethrough.
            </>
          }
        />
      </div>

      <div className="mt-6 border-t border-zinc-200 pt-6">
        <h3 className="text-base font-semibold text-zinc-900 sm:text-sm">Your feedback summary</h3>
        <p className="mt-1 text-sm leading-relaxed text-zinc-600 sm:text-xs sm:leading-normal">
          {fullManuscriptLabels
            ? "Overall strengths, improvements, and takeaways for the whole piece—alongside all margin notes above."
            : "Overall strengths, improvements, and takeaways—alongside any margin notes above."}
        </p>
        <div className="mt-4 space-y-3">
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium text-zinc-800">Strengths</span>
            <textarea
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              rows={4}
              className="w-full min-h-[5.5rem] rounded-xl border border-zinc-200 px-3 py-2.5 text-base leading-relaxed focus:border-[color:var(--brand-magenta)]/40 focus:outline-none focus:ring-1 focus:ring-[color:var(--brand-magenta)]/25 md:text-sm"
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium text-zinc-800">Areas for improvement</span>
            <textarea
              value={improvements}
              onChange={(e) => setImprovements(e.target.value)}
              rows={4}
              className="w-full min-h-[5.5rem] rounded-xl border border-zinc-200 px-3 py-2.5 text-base leading-relaxed focus:border-[color:var(--brand-magenta)]/40 focus:outline-none focus:ring-1 focus:ring-[color:var(--brand-magenta)]/25 md:text-sm"
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium text-zinc-800">Key takeaways</span>
            <textarea
              value={keyTakeaways}
              onChange={(e) => setKeyTakeaways(e.target.value)}
              rows={4}
              className="w-full min-h-[5.5rem] rounded-xl border border-zinc-200 px-3 py-2.5 text-base leading-relaxed focus:border-[color:var(--brand-magenta)]/40 focus:outline-none focus:ring-1 focus:ring-[color:var(--brand-magenta)]/25 md:text-sm"
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
