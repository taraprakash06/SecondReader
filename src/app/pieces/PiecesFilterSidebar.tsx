import Link from "next/link";
import { WRITER_FOCUS_AREA_OPTIONS } from "@/lib/writerFocusAreas";
import type { BrowsePiecesQuery } from "@/lib/browsePiecesQuery";
import { SUBMISSION_GENRE_OPTIONS } from "@/lib/submissionTaxonomy";

const LENGTH_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Any length" },
  { value: "under2k", label: "Under 2,000 words" },
  { value: "2k5k", label: "2,000–4,999 words" },
  { value: "5k10k", label: "5,000–9,999 words" },
  { value: "10kplus", label: "10,000+ words" },
];

const STAGE_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Any stage" },
  { value: "EARLY_DRAFT", label: "Early draft" },
  { value: "POLISHED_DRAFT", label: "Polished draft" },
  { value: "PRE_SUBMISSION", label: "Pre-submission" },
];

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "most_requests", label: "Most reader requests" },
  { value: "shortest", label: "Shortest first" },
  { value: "longest", label: "Longest first" },
];

export function PiecesFilterSidebar({ query }: { query: BrowsePiecesQuery }) {
  const lengthValue = query.length === "any" ? "" : query.length;
  const genreDefault = (SUBMISSION_GENRE_OPTIONS as readonly string[]).includes(query.genre) ? query.genre : "";

  return (
    <aside className="lg:sticky lg:top-24">
      <div className="rounded-2xl border border-zinc-200 bg-white/95 p-4 shadow-sm backdrop-blur sm:p-5">
        <h2 className="text-sm font-semibold text-[color:var(--ink)]">Filter &amp; sort</h2>
        <p className="mt-1 text-xs leading-relaxed text-[color:var(--ink-muted)]">
          Narrow listings by genre, length, feedback focus, and draft stage. Sort changes the order of results.
        </p>

        <form method="get" action="/pieces" className="mt-4 space-y-4">
          <label className="block grid gap-1.5 text-sm">
            <span className="font-medium text-zinc-800">Genre</span>
            <select
              name="genre"
              defaultValue={genreDefault}
              className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-[color:var(--brand-magenta)]/40 focus:outline-none focus:ring-1 focus:ring-[color:var(--brand-magenta)]/30"
            >
              <option value="">Any genre</option>
              {SUBMISSION_GENRE_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            <span className="text-[11px] text-[color:var(--ink-muted)]">
              Matches listings that include this genre (writers can pick more than one).
            </span>
          </label>

          <label className="block grid gap-1.5 text-sm">
            <span className="font-medium text-zinc-800">Length (word count)</span>
            <select
              name="length"
              defaultValue={lengthValue}
              className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-[color:var(--brand-magenta)]/40 focus:outline-none focus:ring-1 focus:ring-[color:var(--brand-magenta)]/30"
            >
              {LENGTH_OPTIONS.map((o) => (
                <option key={o.value || "any"} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block grid gap-1.5 text-sm">
            <span className="font-medium text-zinc-800">Feedback type</span>
            <select
              name="focus"
              defaultValue={query.focus}
              className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-[color:var(--brand-magenta)]/40 focus:outline-none focus:ring-1 focus:ring-[color:var(--brand-magenta)]/30"
            >
              <option value="">Any</option>
              {WRITER_FOCUS_AREA_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
            <span className="text-[11px] text-[color:var(--ink-muted)]">
              Piece must include this focus among the writer’s choices.
            </span>
          </label>

          <label className="block grid gap-1.5 text-sm">
            <span className="font-medium text-zinc-800">Draft stage</span>
            <select
              name="stage"
              defaultValue={query.stage}
              className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-[color:var(--brand-magenta)]/40 focus:outline-none focus:ring-1 focus:ring-[color:var(--brand-magenta)]/30"
            >
              {STAGE_OPTIONS.map((o) => (
                <option key={o.value || "any-stage"} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block grid gap-1.5 text-sm">
            <span className="font-medium text-zinc-800">Sort by</span>
            <select
              name="sort"
              defaultValue={query.sort}
              className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-[color:var(--brand-magenta)]/40 focus:outline-none focus:ring-1 focus:ring-[color:var(--brand-magenta)]/30"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              className="inline-flex h-9 items-center justify-center rounded-xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] px-4 text-xs font-semibold text-white shadow-sm hover:opacity-95"
            >
              Apply
            </button>
            <Link
              href="/pieces"
              className="text-center text-xs font-semibold text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]"
            >
              Clear filters
            </Link>
          </div>
        </form>
      </div>
    </aside>
  );
}
