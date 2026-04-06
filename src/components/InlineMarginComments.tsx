"use client";

import React from "react";
import { annotateParagraphs, inferCommentKind, type MarginComment } from "@/lib/margin-comments";
import { renderWithHighlights } from "@/lib/margin-comments-render";
import {
  marginCommentsLayout,
  type MarginCommentsLayoutVariant,
} from "@/lib/margin-comments-layout";

export type { MarginComment };

function MarginCard({
  comment,
  readerName,
  readerInitial,
  onRemove,
}: {
  comment: MarginComment;
  readerName: string;
  readerInitial: string;
  onRemove?: () => void;
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
          <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-sm font-semibold text-zinc-900">{readerName}</span>
              <span className="text-[11px] text-zinc-500">Just now</span>
            </div>
            {onRemove ? (
              <button
                type="button"
                onClick={onRemove}
                className="text-[11px] font-semibold text-rose-600 hover:text-rose-800"
              >
                Remove
              </button>
            ) : null}
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

export function InlineMarginComments({
  text,
  comments,
  readerName = "Reader",
  readerInitial,
  onRemoveComment,
  layoutVariant = "default",
}: {
  text: string;
  comments: MarginComment[];
  readerName?: string;
  readerInitial?: string;
  onRemoveComment?: (id: string) => void;
  /** `wide` uses a broader text column (critique / wide feedback). */
  layoutVariant?: MarginCommentsLayoutVariant;
}) {
  const layout = marginCommentsLayout(layoutVariant);
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
          <div key={p.key} className={layout.rowGrid}>
            <div className={layout.textCell}>
              <div className={layout.textInner}>{renderWithHighlights(p.text, p.annotations)}</div>
            </div>

            <div className={layout.sidebar}>
              {p.annotations.length === 0 ? (
                <div className={`hidden min-h-[2rem] ${layout.showEmptyGutter}`} aria-hidden />
              ) : (
                p.annotations.map((a) => (
                  <div key={a.comment.id} className="relative">
                    <div
                      className={`pointer-events-none absolute -left-2 top-4 hidden h-px w-2 bg-zinc-300 ${layout.showConnector}`}
                      aria-hidden
                    />
                    <MarginCard
                      comment={a.comment}
                      readerName={readerName}
                      readerInitial={initial}
                      onRemove={
                        onRemoveComment ? () => onRemoveComment(a.comment.id) : undefined
                      }
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
