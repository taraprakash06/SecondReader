import DOMPurify from "isomorphic-dompurify";
import type { Config } from "dompurify";

/** Inline and block formatting from paste (Word, Docs, etc.). */
const SANITIZE_CONFIG: Config = {
  ALLOWED_TAGS: [
    "p",
    "br",
    "div",
    "span",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "strike",
    "sub",
    "sup",
    "h1",
    "h2",
    "h3",
    "h4",
    "blockquote",
    "ul",
    "ol",
    "li",
  ],
  ALLOWED_ATTR: ["style", "class"],
  ALLOW_DATA_ATTR: false,
};

/**
 * Same tags as {@link sanitizeRichText}, but strips `class` and `style`.
 * Word/Google Docs paste otherwise multiplies payload size (often >1MB for a few pages)
 * and trips Server Action body limits.
 */
const SANITIZE_MANUSCRIPT_PASTE_CONFIG: Config = {
  ...SANITIZE_CONFIG,
  ALLOWED_ATTR: [],
};

export function sanitizeRichText(html: string): string {
  return DOMPurify.sanitize(html.trim(), SANITIZE_CONFIG);
}

/** Use for full-manuscript paste before submit and on the server; keeps structure, drops Word bloat. */
export function sanitizeManuscriptRichText(html: string): string {
  return DOMPurify.sanitize(html.trim(), SANITIZE_MANUSCRIPT_PASTE_CONFIG);
}

/** Plain text length after stripping tags (approximate “page” size). */
export function richTextPlainLength(html: string): number {
  const plain = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return plain.length;
}

/** Legacy submissions stored as plain text (no HTML tags). */
export function submissionInitialPagesLooksLikeHtml(s: string): boolean {
  const t = s.trim();
  if (!t) return false;
  return t.startsWith("<");
}

const MAX_PLAIN_CHARS = 15_000;
const MAX_HTML_CHARS = 600_000;

/**
 * Validates and returns sanitized HTML for Submission.initialPages.
 * Rejects empty content after sanitization.
 */
export function sanitizeAndValidateInitialPages(raw: string): string {
  const html = sanitizeRichText(raw);
  if (html.length > MAX_HTML_CHARS) {
    throw new Error("That excerpt is too long to save.");
  }
  const plainLen = richTextPlainLength(html);
  if (plainLen < 1) {
    throw new Error("Please paste your first pages.");
  }
  if (plainLen > MAX_PLAIN_CHARS) {
    throw new Error(
      "That excerpt is longer than the initial share (~3 pages). Shorten the paste and try again.",
    );
  }
  return html;
}
