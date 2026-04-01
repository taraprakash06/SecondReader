"use client";

import React from "react";
import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();
  const readerName = session?.user?.name?.trim() || "You";
  const readerInitial =
    readerName
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .slice(0, 1) || "Y";

  const [quote, setQuote] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [comments, setComments] = React.useState<DraftComment[]>([]);
  const [selection, setSelection] = React.useState("");
  const [mode, setMode] = React.useState<"comment" | "suggest">(defaultMode);

  const messageInputRef = React.useRef<HTMLInputElement | null>(null);

  const [strengths, setStrengths] = React.useState("");
  const [improvements, setImprovements] = React.useState("");
  const [keyTakeaways, setKeyTakeaways] = React.useState("");

  function setModeAndReset(next: "comment" | "suggest") {
    setMode(next);
    if (next === "suggest") {
      setMessage("");
    }
  }

  function addComment() {
    const q = quote.trim();
    if (!q) return;

    if (mode === "suggest") {
      const m = `Delete: "${q}"`;
      setComments((prev) => [...prev, { id: newId(), quote: q, message: m }]);
      setQuote("");
      return;
    }

    const m = message.trim();
    if (!m) return;
    setComments((prev) => [...prev, { id: newId(), quote: q, message: m }]);
    setQuote("");
    setMessage("");
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
    setTimeout(() => {
      if (mode === "comment") {
        messageInputRef.current?.focus();
      }
    }, 50);
  }

  return (
    <div className="mt-5 grid gap-4">
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-zinc-200 bg-zinc-50 px-4 py-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-zinc-900">Sample text</p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-600">
              <span className="font-semibold text-zinc-800">Comment</span>: highlight text and add your note.{" "}
              <span className="font-semibold text-zinc-800">Suggest</span>: mark text to delete — it gets a green
              strikethrough.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-zinc-600">Mode</span>
            <div className="inline-flex rounded-lg border border-zinc-200 bg-white p-0.5 text-xs font-semibold shadow-sm">
              <button
                type="button"
                onClick={() => setModeAndReset("comment")}
                className={`rounded-md px-3 py-1.5 transition ${
                  mode === "comment"
                    ? "bg-amber-100 text-zinc-900 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                Comment
              </button>
              <button
                type="button"
                onClick={() => setModeAndReset("suggest")}
                className={`rounded-md px-3 py-1.5 transition ${
                  mode === "suggest"
                    ? "bg-emerald-100 text-zinc-900 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                Suggest
              </button>
            </div>
          </div>
        </div>

        <div className="border-b border-zinc-200 bg-white px-4 py-3">
          {selection ? (
            <div
              className={`mb-3 flex flex-col gap-2 rounded-lg border px-3 py-2 text-sm ${
                mode === "suggest"
                  ? "border-emerald-200/90 bg-emerald-50/80"
                  : "border-amber-200/80 bg-amber-50/80"
              }`}
            >
              <p
                className={`text-[11px] font-semibold uppercase tracking-wide ${
                  mode === "suggest" ? "text-emerald-900/80" : "text-amber-900/80"
                }`}
              >
                Selected text
              </p>
              <p className="text-zinc-800">“{selection}”</p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={useSelectionAsQuote}
                  className="h-8 rounded-lg bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] px-3 text-xs font-semibold text-white shadow-sm hover:opacity-95"
                >
                  + Add to margin
                </button>
                <button
                  type="button"
                  onClick={() => setSelection("")}
                  className="text-xs font-semibold text-zinc-500 hover:text-zinc-800"
                >
                  Clear
                </button>
              </div>
            </div>
          ) : null}

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-xs font-semibold text-zinc-700">Phrase to attach (from highlight)</span>
            <input
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="h-9 rounded-lg border border-zinc-200 bg-zinc-50/80 px-3 text-sm text-zinc-900 focus:border-amber-400/80 focus:outline-none focus:ring-1 focus:ring-amber-400/40"
              placeholder={mode === "suggest" ? "Text to strike through / delete…" : "Phrase you’re responding to…"}
            />
          </label>

          {mode === "comment" ? (
            <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-xs font-semibold text-zinc-700">Comment</span>
                <input
                  ref={messageInputRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="h-9 rounded-lg border border-zinc-200 bg-zinc-50/80 px-3 text-sm text-zinc-900 focus:border-sky-400/80 focus:outline-none focus:ring-1 focus:ring-sky-400/40"
                  placeholder="What would you tell the writer?"
                />
              </label>
              <button
                type="button"
                onClick={addComment}
                className="h-9 shrink-0 rounded-lg bg-zinc-900 px-4 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800"
              >
                Add to margin
              </button>
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              <p className="text-xs text-emerald-900/85">
                <span className="font-semibold">Deletion</span> — the phrase above is shown with a green strikethrough
                in the sample.
              </p>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={addComment}
                  className="h-9 rounded-lg bg-zinc-900 px-4 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800"
                >
                  Add deletion to margin
                </button>
              </div>
            </div>
          )}
        </div>

        <div onMouseUp={captureSelection} onKeyUp={captureSelection}>
          <InlineMarginComments
            text={sampleText}
            comments={comments}
            readerName={readerName}
            readerInitial={readerInitial}
            onRemoveComment={(id) => setComments((prev) => prev.filter((c) => c.id !== id))}
          />
        </div>
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

      <input type="hidden" name="commentsJson" value={JSON.stringify(comments)} />
      <input type="hidden" name="strengths" value={strengths} />
      <input type="hidden" name="improvements" value={improvements} />
      <input type="hidden" name="keyTakeaways" value={keyTakeaways} />
    </div>
  );
}
