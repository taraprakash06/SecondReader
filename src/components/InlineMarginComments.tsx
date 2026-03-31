"use client";

import React from "react";

type MarginComment = {
  id: string;
  quote: string;
  message: string;
};

type Mode = "comment" | "suggest";

type Paragraph = {
  key: string;
  text: string;
  annotations: Array<{ start: number; end: number; comment: MarginComment }>;
};

function escapeRegExp(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function splitParagraphs(text: string): Paragraph[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  const parts = normalized.split(/\n{2,}/g);
  return parts
    .map((p, i) => ({ key: `p-${i}`, text: p.trim(), annotations: [] as Paragraph["annotations"] }))
    .filter((p) => p.text.length > 0);
}

function annotateParagraphs(text: string, comments: MarginComment[]): Paragraph[] {
  const paragraphs = splitParagraphs(text);
  const usable = comments
    .map((c) => ({ ...c, quote: (c.quote ?? "").trim() }))
    .filter((c) => c.quote.length > 0);

  if (usable.length === 0) return paragraphs;

  // For MVP: match each quote to the first non-overlapping occurrence within a paragraph.
  for (const para of paragraphs) {
    const occupied: Array<{ start: number; end: number }> = [];

    for (const c of usable) {
      const re = new RegExp(escapeRegExp(c.quote), "g");
      let match: RegExpExecArray | null;
      // eslint-disable-next-line no-cond-assign
      while ((match = re.exec(para.text))) {
        const start = match.index;
        const end = start + match[0].length;
        const overlaps = occupied.some((o) => !(end <= o.start || start >= o.end));
        if (!overlaps) {
          occupied.push({ start, end });
          para.annotations.push({ start, end, comment: c });
          break;
        }
      }
    }

    para.annotations.sort((a, b) => a.start - b.start);
  }

  return paragraphs;
}

function renderWithHighlights(
  text: string,
  annotations: Paragraph["annotations"],
  mode: Mode,
) {
  if (annotations.length === 0) return text;

  const nodes: React.ReactNode[] = [];
  let cursor = 0;

  annotations.forEach((a, idx) => {
    if (a.start > cursor) nodes.push(text.slice(cursor, a.start));

    const quoteText = text.slice(a.start, a.end);
    nodes.push(
      <span
        key={`${a.comment.id}-${idx}`}
        className={
          mode === "suggest"
            ? "rounded-sm bg-[color-mix(in_oklab,var(--brand-purple),white_88%)] px-0.5 underline decoration-[color:var(--brand-purple)] decoration-2 underline-offset-2 [box-decoration-break:clone]"
            : "rounded-sm bg-[color-mix(in_oklab,var(--brand-magenta),white_86%)] px-0.5 [box-decoration-break:clone]"
        }
      >
        {quoteText}
      </span>,
    );
    cursor = a.end;
  });

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

export function InlineMarginComments({
  text,
  comments,
  defaultMode = "comment",
}: {
  text: string;
  comments: MarginComment[];
  defaultMode?: Mode;
}) {
  const [mode, setMode] = React.useState<Mode>(defaultMode);
  const paragraphs = annotateParagraphs(text, comments);

  return (
    <div className="mt-3">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xs font-semibold text-[color:var(--ink-muted)]">Mode</span>
        <div className="inline-flex rounded-xl border border-zinc-200 bg-white p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode("comment")}
            className={`rounded-lg px-2 py-1 ${
              mode === "comment"
                ? "bg-[color-mix(in_oklab,var(--brand-magenta),white_85%)] text-[color:var(--ink)]"
                : "text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]"
            }`}
          >
            Comment
          </button>
          <button
            type="button"
            onClick={() => setMode("suggest")}
            className={`rounded-lg px-2 py-1 ${
              mode === "suggest"
                ? "bg-[color-mix(in_oklab,var(--brand-purple),white_88%)] text-[color:var(--ink)]"
                : "text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]"
            }`}
          >
            Suggest
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {paragraphs.map((p) => (
          <div
            key={p.key}
            className="mx-auto grid w-full grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_320px] lg:max-w-[1080px] lg:grid-cols-[720px_320px]"
          >
            <div className="rounded-xl bg-white/70 px-6 py-5 text-[15px] leading-7 text-[color:var(--ink)] shadow-sm">
              {renderWithHighlights(p.text, p.annotations, mode)}
            </div>

            <div className="space-y-3">
              {p.annotations.map((a) => (
                <div key={a.comment.id} className="relative">
                  <div className="hidden md:block absolute -left-3 top-5 h-px w-3 bg-[color:color-mix(in_oklab,var(--brand-purple),#000_80%)]/30" />
                  <div className="rounded-xl border border-zinc-200 bg-[color:var(--paper-2)] p-4 text-sm leading-6">
                    <p className="text-xs font-semibold text-[color:var(--ink-muted)]">
                      {mode === "suggest" ? "Suggestion" : "Comment"}
                    </p>
                    <p className="mt-1 text-[color:var(--ink)]">{a.comment.message}</p>
                  </div>
                </div>
              ))}
              {p.annotations.length === 0 ? <div className="hidden md:block" /> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

