/**
 * Sanitize a path for use as next-auth `callbackUrl` or post-auth redirects.
 * Rejects protocol-relative URLs and absolute URLs to avoid open redirects.
 */
export function safeInternalCallbackUrl(raw: string | null | undefined, fallback: string): string {
  const t = String(raw ?? "").trim();
  if (!t.startsWith("/") || t.startsWith("//")) return fallback;
  if (t.includes("://")) return fallback;
  return t;
}
