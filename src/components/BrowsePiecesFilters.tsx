import Link from "next/link";
import { draftStageLabel } from "@/lib/submissionBrowseDisplay";
import { WRITER_FOCUS_AREA_OPTIONS } from "@/lib/writerFocusAreas";
import type { BrowseLengthValue, BrowseSortValue } from "@/app/pieces/browseParams";
import { DraftStage } from "@prisma/client";
import type { WriterFocusAreaId } from "@/lib/writerFocusAreas";

const LENGTH_OPTIONS: { value: BrowseLengthValue; label: string }[] = [
  { value: "", label: "Any length" },
  { value: "under3k", label: "Under 3,000 words" },
  { value: "3k8k", label: "3,000 – 7,999 words" },
  { value: "8k15k", label: "8,000 – 14,999 words" },
  { value: "over15k", label: "15,000 words or more" },
];

const SORT_OPTIONS: { value: BrowseSortValue; label: string }[] = [
  { value: "updated", label: "Recently updated" },
  { value: "newest", label: "Newest listed" },
  { value: "most_requests", label: "Most read requests" },
  { value: "shortest", label: "Shortest (by word count)" },
  { value: "longest", label: "Longest (by word count)" },
];

const STAGES: DraftStage[] = [DraftStage.EARLY_DRAFT, DraftStage.POLISHED_DRAFT, DraftStage.PRE_SUBMISSION];

const selectClass =
  "mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-[color:var(--brand-magenta)]/40 focus:outline-none focus:ring-1 focus:ring-[color:var(--brand-magenta)]/25";

export function BrowsePiecesFilters({
  genres,
  current,
}: {
  genres: string[];
  current: {
    genre: string;
    length: BrowseLengthValue;
    focus: WriterFocusAreaId | "";
    stage: DraftStage | "";
    sort: BrowseSortValue;
  };
}) {
  return (
    <aside className="rounded-2xl border border-zinc-200 bg-white/95 p-5 shadow-sm backdrop-blur lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
      <h2 className="text-sm font-semibold text-zinc-900">Filters</h2>
      <p className="mt-1 text-xs leading-relaxed text-zinc-600">
        Narrow listings by genre, length, what the writer wants feedback on, and draft stage.
      </p>

      <form method="get" action="/pieces" className="mt-5 space-y-4">
        <label className="block text-xs font-medium text-zinc-800">
          Genre
          <select name="genre" defaultValue={current.genre || "all"} className={selectClass}>
            <option value="all">All genres</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-xs font-medium text-zinc-800">
          Length (full piece)
          <select name="length" defaultValue={current.length} className={selectClass}>
            {LENGTH_OPTIONS.map((o) => (
              <option key={o.value || "any"} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-xs font-medium text-zinc-800">
          Feedback type
          <select name="focus" defaultValue={current.focus} className={selectClass}>
            <option value="">Any</option>
            {WRITER_FOCUS_AREA_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-xs font-medium text-zinc-800">
          Draft stage
          <select name="stage" defaultValue={current.stage} className={selectClass}>
            <option value="">Any stage</option>
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {draftStageLabel(s)}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-xs font-medium text-zinc-800">
          Sort by
          <select name="sort" defaultValue={current.sort} className={selectClass}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-col gap-2 pt-1">
          <button
            type="submit"
            className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] px-4 text-sm font-semibold text-white shadow-sm hover:opacity-95"
          >
            Apply filters
          </button>
          <Link
            href="/pieces"
            className="inline-flex h-9 w-full items-center justify-center rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-800 hover:bg-zinc-50"
          >
            Clear all
          </Link>
        </div>
      </form>
    </aside>
  );
}
