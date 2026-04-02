import type { DraftStage } from "@prisma/client";
import { WRITER_FOCUS_AREA_OPTIONS } from "@/lib/writerFocusAreas";

const STAGE_LABELS: Record<DraftStage, string> = {
  EARLY_DRAFT: "Early draft",
  POLISHED_DRAFT: "Polished draft",
  PRE_SUBMISSION: "Pre-submission",
};

export function draftStageLabel(stage: DraftStage): string {
  return STAGE_LABELS[stage] ?? stage;
}

/** Comma-separated focus labels for Browse Pieces / cards. */
export function formatFocusAreasLine(writerFocusAreasJson: string, focusOther: string): string {
  let ids: string[] = [];
  try {
    ids = JSON.parse(writerFocusAreasJson) as string[];
  } catch {
    return "—";
  }
  if (!Array.isArray(ids) || ids.length === 0) return "—";
  const labels: string[] = [];
  for (const id of ids) {
    const opt = WRITER_FOCUS_AREA_OPTIONS.find((o) => o.id === id);
    if (opt) labels.push(opt.label);
  }
  if (ids.includes("OTHER") && focusOther.trim()) {
    labels.push(`Other: ${focusOther.trim()}`);
  }
  return labels.length ? labels.join(", ") : "—";
}

/** Shown as “Writer note” on browse cards. */
export function formatWriterBrowseNoteLine(stage: DraftStage, writerBrowseNote: string): string {
  const stagePart = draftStageLabel(stage);
  const note = writerBrowseNote.trim();
  if (note) return `${stagePart}. ${note}`;
  return stagePart;
}

export function formatWordCountLine(wordCount: number): string {
  if (!Number.isFinite(wordCount) || wordCount < 1) return "—";
  return `${wordCount.toLocaleString()} words`;
}
