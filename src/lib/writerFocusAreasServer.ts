import { FeedbackFocus } from "@prisma/client";
import type { WriterFocusAreaId } from "@/lib/writerFocusAreas";

/** Maps writer areas to legacy `focus1` / `focus2` columns on Submission. */
export function writerAreaToLegacyFocus(area: WriterFocusAreaId): FeedbackFocus {
  switch (area) {
    case "BIG_PICTURE_OVERALL":
      return FeedbackFocus.BIG_PICTURE;
    case "STRUCTURE_PACING":
      return FeedbackFocus.STRUCTURE;
    case "EMOTIONAL_IMPACT":
      return FeedbackFocus.EMOTIONAL_IMPACT;
    case "LINE_LEVEL_WRITING":
      return FeedbackFocus.LINE_EDITS;
    case "OTHER":
      return FeedbackFocus.OTHER;
    default:
      return FeedbackFocus.OTHER;
  }
}
