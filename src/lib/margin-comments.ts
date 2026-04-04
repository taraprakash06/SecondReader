export type MarginComment = {
  id: string;
  quote: string;
  message: string;
};

export type HighlightKind = "comment" | "suggest";

export type ParagraphBlock = {
  key: string;
  text: string;
  annotations: Array<{
    start: number;
    end: number;
    comment: MarginComment;
    kind: HighlightKind;
  }>;
};

export function escapeRegExp(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function inferCommentKind(message: string): HighlightKind {
  return message.trim().toLowerCase().startsWith("delete:") ? "suggest" : "comment";
}

export function splitParagraphs(text: string): ParagraphBlock[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  const parts = normalized.split(/\n{2,}/g);
  return parts
    .map((p, i) => ({
      key: `p-${i}`,
      text: p.trim(),
      annotations: [] as ParagraphBlock["annotations"],
    }))
    .filter((p) => p.text.length > 0);
}

export function annotateParagraphs(text: string, comments: MarginComment[]): ParagraphBlock[] {
  const paragraphs = splitParagraphs(text);
  const usable = comments
    .map((c) => ({ ...c, quote: (c.quote ?? "").trim() }))
    .filter((c) => c.quote.length > 0);

  if (usable.length === 0) return paragraphs;

  /** One highlight per comment id for the whole piece (not once per paragraph). */
  const placedCommentIds = new Set<string>();

  for (const para of paragraphs) {
    const occupied: Array<{ start: number; end: number }> = [];

    for (const c of usable) {
      if (placedCommentIds.has(c.id)) continue;

      const re = new RegExp(escapeRegExp(c.quote), "g");
      let match: RegExpExecArray | null;
      // eslint-disable-next-line no-cond-assign
      while ((match = re.exec(para.text))) {
        const start = match.index;
        const end = start + match[0].length;
        const overlaps = occupied.some((o) => !(end <= o.start || start >= o.end));
        if (!overlaps) {
          occupied.push({ start, end });
          placedCommentIds.add(c.id);
          para.annotations.push({
            start,
            end,
            comment: c,
            kind: inferCommentKind(c.message),
          });
          break;
        }
      }
    }

    para.annotations.sort((a, b) => a.start - b.start);
  }

  return paragraphs;
}
