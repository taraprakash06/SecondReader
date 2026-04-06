import { richTextPlainLength, sanitizeRichText } from "@/lib/sanitizeRichText";

/**
 * Approximate manuscript pages (prose). Midpoint of 250–300 words/page.
 * Used only for the “first read” gate (first 3 pages vs full short piece).
 */
export const WORDS_PER_PAGE = 275;

/** Number of pages readers see before an unlock is needed (long works). */
export const FIRST_READ_PAGE_COUNT = 3;

/** If total words ≤ this, the whole piece is the first read (no `fullText`, no unlock). */
export const FIRST_READ_MAX_WORDS = WORDS_PER_PAGE * FIRST_READ_PAGE_COUNT;

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

/** Plain words after stripping HTML (best-effort). */
export function wordCountFromHtml(html: string): number {
  const plain = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (!plain) return 0;
  return plain.split(/\s+/).filter(Boolean).length;
}

/**
 * Sanitize pasted HTML for a full manuscript; enforce generous upper bounds.
 */
export function sanitizeFullManuscript(raw: string): string {
  const html = sanitizeRichText(raw);
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
 * - If total length ≤ ~3 pages (by word count): entire piece is `initialPages`, `fullText` is empty
 *   (flash fiction, short essays, short poems — no unlock needed).
 * - If longer: first ~3 pages of words go to `initialPages`, rest to `fullText` (split at `<p>` boundaries when possible).
 */
export function splitIntoInitialPagesAndFullText(html: string): {
  initialPages: string;
  fullText: string;
} {
  const totalWords = wordCountFromHtml(html);
  if (totalWords <= FIRST_READ_MAX_WORDS) {
    return { initialPages: html, fullText: "" };
  }

  const blocks = [...html.matchAll(/<p\b[^>]*>[\s\S]*?<\/p>/gi)].map((m) => m[0]);
  if (blocks.length === 0) {
    return splitOversizeBlockByWords(html, "");
  }

  const initialBlocks: string[] = [];
  let acc = 0;
  let i = 0;
  for (; i < blocks.length; i++) {
    const w = wordCountFromHtml(blocks[i]);
    if (w > FIRST_READ_MAX_WORDS && initialBlocks.length === 0) {
      return splitOversizeBlockByWords(blocks[i], blocks.slice(i + 1).join(""));
    }
    if (acc >= FIRST_READ_MAX_WORDS) {
      break;
    }
    if (acc + w > FIRST_READ_MAX_WORDS && acc > 0) {
      break;
    }
    initialBlocks.push(blocks[i]);
    acc += w;
  }

  const initialPages = initialBlocks.join("");
  const fullText = blocks.slice(i).join("");
  return { initialPages, fullText };
}

function splitOversizeBlockByWords(firstBlockHtml: string, followingHtml: string): {
  initialPages: string;
  fullText: string;
} {
  const plain = firstBlockHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = plain.split(/\s+/).filter(Boolean);
  if (words.length <= FIRST_READ_MAX_WORDS) {
    return { initialPages: firstBlockHtml, fullText: followingHtml };
  }
  const head = words.slice(0, FIRST_READ_MAX_WORDS).join(" ");
  const tail = words.slice(FIRST_READ_MAX_WORDS).join(" ");
  const initialPages = `<p>${escapeHtml(head)}</p>`;
  const restParts: string[] = [];
  if (tail) {
    restParts.push(`<p>${escapeHtml(tail)}</p>`);
  }
  if (followingHtml.trim()) {
    restParts.push(followingHtml);
  }
  return { initialPages, fullText: restParts.join("") };
}
