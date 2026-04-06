import { DraftStage, Prisma } from "@prisma/client";
import type { WriterFocusAreaId } from "@/lib/writerFocusAreas";
import { WRITER_FOCUS_AREA_IDS } from "@/lib/writerFocusAreas";

const FOCUS_SET = new Set<string>(WRITER_FOCUS_AREA_IDS);

export const BROWSE_LENGTH_VALUES = ["", "under3k", "3k8k", "8k15k", "over15k"] as const;
export type BrowseLengthValue = (typeof BROWSE_LENGTH_VALUES)[number];

export const BROWSE_SORT_VALUES = [
  "updated",
  "newest",
  "most_requests",
  "shortest",
  "longest",
] as const;
export type BrowseSortValue = (typeof BROWSE_SORT_VALUES)[number];

export function parseBrowseSearchParams(raw: Record<string, string | string[] | undefined>) {
  const gRaw = typeof raw.genre === "string" ? raw.genre.trim() : "";
  const g = gRaw === "all" ? "" : gRaw;
  const len = typeof raw.length === "string" ? raw.length.trim() : "";
  const focus = typeof raw.focus === "string" ? raw.focus.trim() : "";
  const st = typeof raw.stage === "string" ? raw.stage.trim() : "";
  const sortRaw = typeof raw.sort === "string" ? raw.sort.trim() : "";

  const length: BrowseLengthValue = BROWSE_LENGTH_VALUES.includes(len as BrowseLengthValue)
    ? (len as BrowseLengthValue)
    : "";

  const sort: BrowseSortValue = BROWSE_SORT_VALUES.includes(sortRaw as BrowseSortValue)
    ? (sortRaw as BrowseSortValue)
    : "updated";

  const focusId: WriterFocusAreaId | "" =
    focus && FOCUS_SET.has(focus) ? (focus as WriterFocusAreaId) : "";

  const stage: DraftStage | "" =
    st && (Object.values(DraftStage) as string[]).includes(st) ? (st as DraftStage) : "";

  return { genre: g, length, focus: focusId, stage, sort };
}

export function buildSubmissionWhere(
  base: Prisma.SubmissionWhereInput,
  filters: ReturnType<typeof parseBrowseSearchParams>,
): Prisma.SubmissionWhereInput {
  const { genre, length, focus, stage } = filters;

  const where: Prisma.SubmissionWhereInput = { ...base };

  if (genre && genre !== "all") {
    where.genre = { equals: genre, mode: "insensitive" };
  }

  if (length) {
    switch (length) {
      case "under3k":
        where.wordCount = { lt: 3000 };
        break;
      case "3k8k":
        where.wordCount = { gte: 3000, lt: 8000 };
        break;
      case "8k15k":
        where.wordCount = { gte: 8000, lt: 15000 };
        break;
      case "over15k":
        where.wordCount = { gte: 15000 };
        break;
      default:
        break;
    }
  }

  if (focus) {
    where.writerFocusAreas = { contains: `"${focus}"` };
  }

  if (stage) {
    where.stage = stage;
  }

  return where;
}

export function buildSubmissionOrderBy(
  sort: BrowseSortValue,
): Prisma.SubmissionOrderByWithRelationInput | Prisma.SubmissionOrderByWithRelationInput[] {
  switch (sort) {
    case "newest":
      return { createdAt: "desc" };
    case "shortest":
      return { wordCount: "asc" };
    case "longest":
      return { wordCount: "desc" };
    case "most_requests":
      return { volunteerRequests: { _count: "desc" } };
    case "updated":
    default:
      return { updatedAt: "desc" };
  }
}
