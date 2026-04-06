import type { DraftStage } from "@prisma/client";
import { WRITER_FOCUS_AREA_IDS } from "@/lib/writerFocusAreas";

const ALLOWED_FOCUS = new Set<string>(WRITER_FOCUS_AREA_IDS);
const ALLOWED_STAGES: DraftStage[] = ["EARLY_DRAFT", "POLISHED_DRAFT", "PRE_SUBMISSION"];

export type BrowseLengthFilter = "any" | "under2k" | "2k5k" | "5k10k" | "10kplus";

export type BrowseSort = "newest" | "shortest" | "longest" | "most_requests";

export type BrowsePiecesQuery = {
  genre: string;
  length: BrowseLengthFilter;
  focus: string;
  stage: string;
  sort: BrowseSort;
};

const SORT_DEFAULT: BrowseSort = "newest";

function firstString(v: string | string[] | undefined): string {
  if (v === undefined) return "";
  return Array.isArray(v) ? (v[0] ?? "") : v;
}

export function parseBrowsePiecesSearchParams(sp: {
  [key: string]: string | string[] | undefined;
}): BrowsePiecesQuery {
  const genre = firstString(sp.genre).trim();
  const lengthRaw = firstString(sp.length).trim();
  const focusRaw = firstString(sp.focus).trim();
  const focus = focusRaw && ALLOWED_FOCUS.has(focusRaw) ? focusRaw : "";
  const stageRaw = firstString(sp.stage).trim();
  const stage =
    stageRaw && ALLOWED_STAGES.includes(stageRaw as DraftStage) ? stageRaw : "";
  const sortRaw = firstString(sp.sort).trim();

  const lengthAllowed: BrowseLengthFilter[] = ["any", "under2k", "2k5k", "5k10k", "10kplus"];
  const lengthNorm = lengthRaw === "" ? "any" : lengthRaw;
  const length = (lengthAllowed.includes(lengthNorm as BrowseLengthFilter)
    ? lengthNorm
    : "any") as BrowseLengthFilter;

  const sortAllowed: BrowseSort[] = ["newest", "shortest", "longest", "most_requests"];
  const sort = sortAllowed.includes(sortRaw as BrowseSort) ? (sortRaw as BrowseSort) : SORT_DEFAULT;

  return { genre, length, focus, stage, sort };
}

export type BrowseSubmissionRow = {
  id: string;
  genre: string;
  subgenre: string;
  wordCount: number;
  stage: DraftStage;
  writerFocusAreas: string;
  createdAt: Date;
};

export function submissionMatchesBrowseFilters(s: BrowseSubmissionRow, q: BrowsePiecesQuery): boolean {
  if (q.genre) {
    const needle = q.genre.toLowerCase();
    const hay = `${s.genre} ${s.subgenre}`.toLowerCase();
    if (!hay.includes(needle)) return false;
  }

  if (q.length !== "any") {
    const wc = s.wordCount;
    switch (q.length) {
      case "under2k":
        if (wc >= 2000) return false;
        break;
      case "2k5k":
        if (wc < 2000 || wc > 4999) return false;
        break;
      case "5k10k":
        if (wc < 5000 || wc > 9999) return false;
        break;
      case "10kplus":
        if (wc < 10000) return false;
        break;
      default:
        break;
    }
  }

  if (q.focus) {
    let ids: string[] = [];
    try {
      ids = JSON.parse(s.writerFocusAreas) as string[];
    } catch {
      return false;
    }
    if (!Array.isArray(ids) || !ids.includes(q.focus)) return false;
  }

  if (q.stage && ALLOWED_STAGES.includes(q.stage as DraftStage)) {
    if (s.stage !== q.stage) return false;
  }

  return true;
}

export function sortBrowseSubmissions<T extends BrowseSubmissionRow>(
  rows: T[],
  sort: BrowseSort,
  volunteerCountBySubmissionId: Map<string, number>,
): T[] {
  const out = [...rows];
  switch (sort) {
    case "newest":
      out.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      break;
    case "shortest":
      out.sort((a, b) => a.wordCount - b.wordCount);
      break;
    case "longest":
      out.sort((a, b) => b.wordCount - a.wordCount);
      break;
    case "most_requests":
      out.sort((a, b) => {
        const ca = volunteerCountBySubmissionId.get(a.id) ?? 0;
        const cb = volunteerCountBySubmissionId.get(b.id) ?? 0;
        return cb - ca || b.createdAt.getTime() - a.createdAt.getTime();
      });
      break;
    default:
      break;
  }
  return out;
}

export function hasActiveBrowseFilters(q: BrowsePiecesQuery): boolean {
  return !!(q.genre || q.length !== "any" || q.focus || q.stage);
}
