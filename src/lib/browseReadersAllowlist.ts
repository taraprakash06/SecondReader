/**
 * Emails whose reader profiles appear on Browse Readers. Friends can be added as they onboard.
 */
export const BROWSE_READERS_ALLOWED_EMAILS = ["tara.prakash@example.com"] as const;

export function browseReadersEmailFilter() {
  return { in: [...BROWSE_READERS_ALLOWED_EMAILS] };
}
