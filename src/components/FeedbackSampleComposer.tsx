"use client";

import React from "react";
import { InlineMarginComments } from "@/components/InlineMarginComments";

type DraftComment = {
  id: string;
  quote: string;
  message: string;
};

function newId() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

export function FeedbackSampleComposer({
  sampleText,
  defaultMode = "comment",
}: {
  sampleText: string;
  defaultMode?: "comment" | "suggest";
}) {
  const [quote, setQuote] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [comments, setComments] = React.useState<DraftComment[]>([]);
  const [selection, setSelection] = React.useState("");

  const commentBoxRef = React.useRef<HTMLDivElement | null>(null);
  const messageInputRef = React.useRef<HTMLInputElement | null>(null);

  const [strengths, setStrengths] = React.useState("");
  const [improvements, setImprovements] = React.useState("");
  const [keyTakeaways, setKeyTakeaways] = React.useState("");

  function addComment() {
    const q = quote.trim();
    const m = message.trim();
    if (!q || !m) return;
    setComments((prev) => [...prev, { id: newId(), quote: q, message: m }]);
    setQuote("");
    setMessage("");
  }

  function removeComment(id: string) {
    setComments((prev) => prev.filter((c) => c.id !== id));
  }

  function captureSelection() {
    const sel = window.getSelection();
    const text = sel?.toString() ?? "";
    const cleaned = text.replace(/\s+/g, " ").trim();
    setSelection(cleaned);
  }

  function useSelectionAsQuote() {
    const cleaned = selection.trim();
    if (!cleaned) return;
    setQuote(cleaned);
    setSelection("");
    commentBoxRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => messageInputRef.current?.focus(), 150);
  }

  return (
    <div className="mt-5 grid gap-4">
      <div className="rounded-2xl bg-[color:var(--paper-2)] p-4">
        <p className="text-xs font-semibold text-[color:var(--ink)]">Sample text</p>
        <div
          className="mt-2"
          onMouseUp={captureSelection}
          onKeyUp={captureSelection}
        >
          <InlineMarginComments text={sampleText} comments={comments} defaultMode={defaultMode} />
        </div>

        {selection ? (
          <div className="mt-3 flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white/80 p-3 text-sm backdrop-blur">
            <p className="text-xs font-semibold text-[color:var(--ink-muted)]">
              Selected text
            </p>
            <p className="text-[color:var(--ink)]">“{selection}”</p>
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={useSelectionAsQuote}
                className="h-9 rounded-xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] px-3 text-xs font-semibold text-white shadow-sm hover:opacity-95"
              >
                + Comment on selection
              </button>
              <button
                type="button"
                onClick={() => setSelection("")}
                className="text-xs font-semibold text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]"
              >
                Clear
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-xs text-[color:var(--ink-muted)]">
            Highlight a phrase in the text to add a comment (Google Docs-style).
          </p>
        )}
      </div>

      <div
        ref={commentBoxRef}
        className="rounded-2xl border border-zinc-200 bg-white/80 p-4 backdrop-blur"
      >
        <p className="text-xs font-semibold text-[color:var(--ink)]">Add an inline note</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-[color:var(--ink)]">Quote (auto-filled from highlight)</span>
            <input
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm focus:border-[color:var(--brand-magenta)]/50 focus:outline-none"
              placeholder='e.g., "it looked like a held breath."'
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-[color:var(--ink)]">Comment</span>
            <input
              ref={messageInputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm focus:border-[color:var(--brand-purple)]/50 focus:outline-none"
              placeholder="What would you say to the writer?"
            />
          </label>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={addComment}
            className="h-10 rounded-xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] px-4 text-sm font-semibold text-white shadow-sm hover:opacity-95"
          >
            Add comment
          </button>
          <p className="text-xs text-[color:var(--ink-muted)]">
            Tip: highlight text above and click “+ Comment on selection”.
          </p>
        </div>

        {comments.length ? (
          <div className="mt-4">
            <p className="text-xs font-semibold text-[color:var(--ink-muted)]">Draft comments</p>
            <div className="mt-2 space-y-2">
              {comments.map((c) => (
                <div key={c.id} className="rounded-xl bg-[color:var(--paper-2)] p-3 text-sm">
                  <p className="text-xs font-medium text-[color:var(--ink-muted)]">“{c.quote}”</p>
                  <p className="mt-1 text-[color:var(--ink)]">{c.message}</p>
                  <button
                    type="button"
                    onClick={() => removeComment(c.id)}
                    className="mt-2 text-xs font-semibold text-[color:var(--brand-magenta)] hover:opacity-80"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="rounded-2xl bg-[color:var(--paper-2)] p-4">
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

      {/* Server action payload */}
      <input type="hidden" name="commentsJson" value={JSON.stringify(comments)} />
      <input type="hidden" name="strengths" value={strengths} />
      <input type="hidden" name="improvements" value={improvements} />
      <input type="hidden" name="keyTakeaways" value={keyTakeaways} />
    </div>
  );
}

