import React from "react";
import {
  annotateParagraphs,
  inferCommentKind,
  type MarginComment,
} from "@/lib/margin-comments";
import { renderWithHighlights } from "@/lib/margin-comments-render";

function MarginCardDisplay({
  comment,
  readerName,
  readerInitial,
}: {
  comment: MarginComment;
  readerName: string;
  readerInitial: string;
}) {
  const isSuggestion = inferCommentKind(comment.message) === "suggest";
  const kind = isSuggestion ? "Suggestion" : "Comment";
  return (
    <div className="rounded-lg border border-sky-200/80 bg-sky-50/90 px-3 py-2.5 shadow-sm">
      <div className="flex gap-2.5">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{ backgroundColor: "var(--margin-avatar, #78350f)" }}
        >
          {readerInitial.slice(0, 1).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-sm font-semibold text-zinc-900">{readerName}</span>
            <span className="text-[11px] text-zinc-500">Just now</span>
          </div>
          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-800/80">
            {kind}
          </p>
          <p className="mt-1 whitespace-pre-wrap text-sm leading-snug text-zinc-800">
            {comment.message}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Server-rendered margin layout for public profiles (no client JS, no hydration mismatch for this subtree).
 */
export function MarginCommentsStatic({
  text,
  comments,
  readerName = "Reader",
  readerInitial,
}: {
  text: string;
  comments: MarginComment[];
  readerName?: string;
  readerInitial?: string;
}) {
  const paragraphs = annotateParagraphs(text, comments);
  const initial =
    readerInitial ??
    (readerName
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .slice(0, 1) || "R");

  return (
    <div className="mt-0 flex flex-col overflow-hidden rounded-b-xl">
      <div className="divide-y divide-zinc-200/80 bg-zinc-100/50">
        {paragraphs.map((p) => (
          <div
            key={p.key}
            className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(260px,32%)]"
          >
            <div className="border-zinc-200 bg-white px-6 py-5 md:border-r md:pr-8">
              <div className="max-w-[52rem] font-serif text-[15px] leading-[1.75] tracking-[0.01em] text-zinc-900">
                {renderWithHighlights(p.text, p.annotations)}
              </div>
            </div>

            <div className="flex flex-col gap-3 border-zinc-200 bg-[#eceff2] px-3 py-4 md:border-0">
              {p.annotations.length === 0 ? (
                <div className="hidden min-h-[2rem] md:block" aria-hidden />
              ) : (
                p.annotations.map((a) => (
                  <div key={a.comment.id} className="relative">
                    <div
                      className="pointer-events-none absolute -left-2 top-4 hidden h-px w-2 bg-zinc-300 md:block"
                      aria-hidden
                    />
                    <MarginCardDisplay
                      comment={a.comment}
                      readerName={readerName}
                      readerInitial={initial}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
