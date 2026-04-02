/**
 * Writer focus-area options (must match Prisma enum `WriterFocusArea`).
 * No `@prisma/client` imports here — this module is safe for client components.
 */

export const WRITER_FOCUS_AREA_IDS = [
  "BIG_PICTURE_OVERALL",
  "STRUCTURE_PACING",
  "CLARITY_FLOW",
  "CHARACTER_VOICE",
  "EMOTIONAL_IMPACT",
  "LINE_LEVEL_WRITING",
  "DIALOGUE",
  "OPENING_FIRST_PAGES",
  "ENDING",
  "PLACES_WORKING_WELL",
  "PLACES_CONFUSION",
  "PLACES_UNNECESSARY",
  "OTHER",
] as const;

export type WriterFocusAreaId = (typeof WRITER_FOCUS_AREA_IDS)[number];

const ALLOWED = new Set<string>(WRITER_FOCUS_AREA_IDS);

export const WRITER_FOCUS_AREA_OPTIONS: { id: WriterFocusAreaId; label: string }[] = [
  { id: "BIG_PICTURE_OVERALL", label: "Big picture / overall direction" },
  { id: "STRUCTURE_PACING", label: "Structure and pacing" },
  { id: "CLARITY_FLOW", label: "Clarity and flow" },
  { id: "CHARACTER_VOICE", label: "Character or voice" },
  { id: "EMOTIONAL_IMPACT", label: "Emotional impact" },
  { id: "LINE_LEVEL_WRITING", label: "Line-level writing/line edits" },
  { id: "DIALOGUE", label: "Dialogue" },
  { id: "OPENING_FIRST_PAGES", label: "Opening / first pages" },
  { id: "ENDING", label: "Ending" },
  { id: "PLACES_WORKING_WELL", label: "Places that are working well" },
  { id: "PLACES_CONFUSION", label: "Places of confusion" },
  { id: "PLACES_UNNECESSARY", label: "Places that are unnecessary and can be cut" },
  { id: "OTHER", label: "Other (describe below)" },
];

export function parseWriterFocusAreasJson(raw: string): WriterFocusAreaId[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Invalid focus selections.");
  }
  if (!Array.isArray(parsed)) throw new Error("Invalid focus selections.");
  const out: WriterFocusAreaId[] = [];
  for (const item of parsed) {
    if (typeof item !== "string" || !ALLOWED.has(item)) {
      throw new Error("Invalid focus selection.");
    }
    const id = item as WriterFocusAreaId;
    if (!out.includes(id)) out.push(id);
  }
  if (out.length < 1 || out.length > 5) {
    throw new Error("Pick 1–5 focus areas.");
  }
  return out;
}
