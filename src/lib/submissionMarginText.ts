import { submissionInitialPagesLooksLikeHtml } from "@/lib/sanitizeRichText";

/**
 * Plain text used for margin-note matching (highlights) on a submission excerpt.
 * Strips HTML when the writer pasted rich text so quotes align with the rendered draft.
 */
export function submissionTextForMarginAnnotation(content: string): string {
  const t = content.trim();
  if (!t) return "";
  if (!submissionInitialPagesLooksLikeHtml(t)) {
    return t.replace(/\r\n/g, "\n");
  }
  const block = t
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\u00a0/g, " ");
  return block
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Text the reader can annotate: initial share, optionally plus unlocked pages (same rules as visibility).
 */
export function combinedDraftForMarginAnnotation(
  initialPages: string,
  opts: { includeFullText?: boolean; fullText?: string },
): string {
  const a = submissionTextForMarginAnnotation(initialPages);
  if (!opts.includeFullText || !opts.fullText?.trim()) return a;
  const b = submissionTextForMarginAnnotation(opts.fullText);
  if (!b) return a;
  if (!a) return b;
  // Clear divider between the gated first read and the remainder (one paragraph for layout).
  return `${a}\n\n──────── Additional pages — your earlier notes on the opening still apply above ────────\n\n${b}`;
}
