import React from "react";
import type { ParagraphBlock } from "./margin-comments";

export function renderWithHighlights(
  text: string,
  annotations: ParagraphBlock["annotations"],
): React.ReactNode {
  if (annotations.length === 0) return text;

  const nodes: React.ReactNode[] = [];
  let cursor = 0;

  annotations.forEach((a, idx) => {
    if (a.start > cursor) nodes.push(text.slice(cursor, a.start));

    const quoteText = text.slice(a.start, a.end);
    const isSuggest = a.kind === "suggest";
    nodes.push(
      <span
        key={`${a.comment.id}-${idx}`}
        className={
          isSuggest
            ? "rounded-sm bg-emerald-50 px-0.5 text-emerald-900 line-through decoration-emerald-600 decoration-2 [box-decoration-break:clone]"
            : "rounded-sm bg-amber-100 px-0.5 text-[color:var(--ink)] shadow-[inset_0_-1px_0_0_rgba(234,179,8,0.35)] [box-decoration-break:clone]"
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
