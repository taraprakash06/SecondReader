import { WRITER_FOCUS_AREA_OPTIONS } from "@/lib/writerFocusAreas";

type Sub = {
  genre: string;
  subgenre: string;
  writerFocusAreas: string;
  focusOther: string;
};

/** Parenthetical after the piece title: genre + what they want feedback on. */
export function formatSubmissionInviteParenthetical(sub: Sub): string {
  const genrePart = sub.subgenre.trim()
    ? `${sub.genre}, ${sub.subgenre}`
    : sub.genre;

  let focus = "";
  try {
    const ids = JSON.parse(sub.writerFocusAreas) as string[];
    const labels: string[] = [];
    for (const id of ids) {
      const opt = WRITER_FOCUS_AREA_OPTIONS.find((o) => o.id === id);
      if (opt) labels.push(opt.label);
    }
    if (ids.includes("OTHER") && sub.focusOther.trim()) {
      labels.push(`Other: ${sub.focusOther.trim()}`);
    }
    focus = labels.join("; ");
  } catch {
    focus = "";
  }

  if (!focus) return genrePart;
  return `${genrePart}; looking for: ${focus}`;
}

export function formatReaderInviteNotificationBody(writerName: string, sub: Sub): string {
  const detail = formatSubmissionInviteParenthetical(sub);
  return `${writerName} invited you to read their piece (${detail})`;
}
