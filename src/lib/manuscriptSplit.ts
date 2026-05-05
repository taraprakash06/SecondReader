import { richTextPlainLength, sanitizeManuscriptRichText } from "@/lib/sanitizeRichText";

/**
 * Target word count for the reader’s first pass (before unlock). Split prefers ending at
 * `.` `!` `?` shortly after this count so sentences are not cut mid-way.
 */
export const FIRST_READ_TARGET_WORDS = 1000;

/** User-facing shorthand; keep aligned with {@link FIRST_READ_TARGET_WORDS}. */
export const FIRST_READ_SHARE_LABEL = "~1,000 words";

/** @deprecated Use {@link FIRST_READ_TARGET_WORDS}. Kept for any external imports. */
export const FIRST_READ_MAX_WORDS = FIRST_READ_TARGET_WORDS;

const MAX_MANUSCRIPT_HTML_CHARS = 600_000;
const MAX_MANUSCRIPT_PLAIN_CHARS = 1_000_000;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function htmlToPlainWords(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

/** Plain words after stripping HTML (best-effort). */
export function wordCountFromHtml(html: string): number {
  const plain = htmlToPlainWords(html);
  if (!plain) return 0;
  return plain.split(/\s+/).filter(Boolean).length;
}

/**
 * After at least `minWords` words, extend to the end of the current sentence (. ! ?), scanning
 * forward then backward in plain text. Falls back to a hard word boundary if no punctuation fits.
 */
export function findPlainCutAfterSentence(plain: string, minWords: number): number {
  const t = plain.replace(/\s+/g, " ").trim();
  if (!t) return 0;
  const words = t.split(/\s+/).filter(Boolean);
  if (words.length === 0) return 0;
  if (words.length <= minWords) return t.length;

  const wordRanges: { end: number }[] = [];
  for (const m of t.matchAll(/\S+/g)) {
    wordRanges.push({ end: m.index! + m[0].length });
  }
  if (wordRanges.length < minWords) return t.length;

  const minEndExclusive = wordRanges[minWords - 1].end;
  const rawTail = t.slice(minEndExclusive);
  const leadWs = rawTail.match(/^\s*/)?.[0].length ?? 0;
  const tail = rawTail.slice(leadWs);
  const re = /[.!?]["']?(?:\s+|$)/;
  const m = tail.match(re);
  if (m && m.index !== undefined) {
    return Math.min(minEndExclusive + leadWs + m.index + m[0].length, t.length);
  }

  let best = -1;
  const head = t.slice(0, minEndExclusive);
  const reAll = /[.!?]["']?(?:\s+|$)/g;
  let mm: RegExpExecArray | null;
  while ((mm = reAll.exec(head)) !== null) {
    best = mm.index + mm[0].length;
  }
  if (best > 0) return best;

  return minEndExclusive;
}

/**
 * Split one HTML block into two HTML fragments (escaped plain `<p>`) at ~minWords with sentence end.
 */
function splitHtmlBlockAtSentenceBoundary(blockHtml: string, minWords: number): {
  before: string;
  after: string;
} {
  const plain = htmlToPlainWords(blockHtml);
  if (!plain) {
    return { before: blockHtml, after: "" };
  }
  const cut = findPlainCutAfterSentence(plain, Math.max(1, minWords));
  const head = plain.slice(0, cut).trim();
  const tail = plain.slice(cut).trim();
  return {
    before: head ? `<p>${escapeHtml(head)}</p>` : "",
    after: tail ? `<p>${escapeHtml(tail)}</p>` : "",
  };
}

/**
 * Sanitize pasted HTML for a full manuscript; enforce generous upper bounds.
 */
export function sanitizeFullManuscript(raw: string): string {
  const html = sanitizeManuscriptRichText(raw);
  if (!html.trim()) {
    throw new Error("Please paste your full manuscript.");
  }
  if (html.length > MAX_MANUSCRIPT_HTML_CHARS) {
    throw new Error("That manuscript is too long to save.");
  }
  const plainLen = richTextPlainLength(html);
  if (plainLen < 1) {
    throw new Error("Please paste your full manuscript.");
  }
  if (plainLen > MAX_MANUSCRIPT_PLAIN_CHARS) {
    throw new Error("That manuscript is too long to save.");
  }
  return html;
}

/**
 * Split sanitized HTML into what readers see first vs the remainder.
 *
 * - If total words ≤ {@link FIRST_READ_TARGET_WORDS}: entire piece is `initialPages`, `fullText` is empty.
 * - If longer: first ~{@link FIRST_READ_TARGET_WORDS} words go to `initialPages`, ending at `.` `!` `?` when possible;
 *   remainder in `fullText`. Splits prefer `<p>` / `<div>` block boundaries, then sentence-aware plain text.
 */
export function splitIntoInitialPagesAndFullText(html: string): {
  initialPages: string;
  fullText: string;
} {
  const totalWords = wordCountFromHtml(html);
  if (totalWords <= FIRST_READ_TARGET_WORDS) {
    return { initialPages: html, fullText: "" };
  }

  const blocks = segmentHtmlIntoBlocks(html);
  if (blocks.length === 0) {
    return splitOversizeBlockAtSentence(html, "", FIRST_READ_TARGET_WORDS);
  }

  const initialBlocks: string[] = [];
  let acc = 0;
  let i = 0;
  for (; i < blocks.length; i++) {
    const w = wordCountFromHtml(blocks[i]);
    if (acc >= FIRST_READ_TARGET_WORDS) {
      break;
    }
    if (acc + w <= FIRST_READ_TARGET_WORDS) {
      initialBlocks.push(blocks[i]);
      acc += w;
      continue;
    }
    if (w === 0) continue;
    const need = FIRST_READ_TARGET_WORDS - acc;
    if (acc === 0) {
      return splitOversizeBlockAtSentence(blocks[i], blocks.slice(i + 1).join(""), FIRST_READ_TARGET_WORDS);
    }
    const { before, after } = splitHtmlBlockAtSentenceBoundary(blocks[i], need);
    if (before) initialBlocks.push(before);
    const restParts = [after, ...blocks.slice(i + 1)].filter((s) => s.trim().length > 0);
    return { initialPages: initialBlocks.join(""), fullText: restParts.join("") };
  }

  const initialPages = initialBlocks.join("");
  const fullText = blocks.slice(i).join("");
  return { initialPages, fullText };
}

/**
 * Prefer `<p>` blocks; otherwise use sibling `<div>` segments (common Word paste).
 * Falls back to [] so callers use word-based split.
 */
function segmentHtmlIntoBlocks(html: string): string[] {
  const trimmed = html.trim();
  const pBlocks = [...trimmed.matchAll(/<p\b[^>]*>[\s\S]*?<\/p>/gi)].map((m) => m[0]);
  if (pBlocks.length > 0) {
    const joined = pBlocks.join("");
    if (joined.length >= trimmed.length * 0.5 || pBlocks.length >= 2) {
      return pBlocks;
    }
  }

  const divBlocks = [...trimmed.matchAll(/<div\b[^>]*>[\s\S]*?<\/div>/gi)].map((m) => m[0]);
  if (divBlocks.length === 0) return [];

  const coverage = divBlocks.reduce((sum, b) => sum + b.length, 0);
  if (coverage < trimmed.length * 0.72) return [];

  if (divBlocks.length === 1) {
    const inner = divBlocks[0].replace(/^<div\b[^>]*>/i, "").replace(/<\/div>\s*$/i, "");
    if (inner.length < divBlocks[0].length * 0.55) return [divBlocks[0]];
    const innerSeg = segmentHtmlIntoBlocks(inner);
    return innerSeg.length > 0 ? innerSeg : [divBlocks[0]];
  }

  return divBlocks;
}

function splitOversizeBlockAtSentence(firstBlockHtml: string, followingHtml: string, minWords: number): {
  initialPages: string;
  fullText: string;
} {
  const plain = htmlToPlainWords(firstBlockHtml);
  const words = plain.split(/\s+/).filter(Boolean);
  if (words.length <= minWords) {
    return { initialPages: firstBlockHtml, fullText: followingHtml };
  }
  const { before, after } = splitHtmlBlockAtSentenceBoundary(firstBlockHtml, minWords);
  const restParts: string[] = [];
  if (after.trim()) restParts.push(after);
  if (followingHtml.trim()) restParts.push(followingHtml);
  return { initialPages: before || firstBlockHtml, fullText: restParts.join("") };
}
