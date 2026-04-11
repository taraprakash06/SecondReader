"use client";

import { useEffect, useMemo, useState } from "react";
import {
  SUBMISSION_GENRE_OPTIONS,
  subgenreOptionsForGenres,
} from "@/lib/submissionTaxonomy";

const MAX_SUBGENRES = 2;

function genreInputId(g: string) {
  return `submission-genre-${g.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
}

function subInputId(s: string) {
  return `submission-sub-${s.replace(/[^a-z0-9]+/gi, "-").toLowerCase().slice(0, 48)}`;
}

export function WriterGenreSubgenreFields() {
  const [genres, setGenres] = useState<string[]>([]);
  const [subgenres, setSubgenres] = useState<string[]>([]);

  const subOptions = useMemo(() => subgenreOptionsForGenres(genres), [genres]);

  useEffect(() => {
    setSubgenres((prev) => {
      const allowed = new Set(subgenreOptionsForGenres(genres));
      return prev.filter((s) => allowed.has(s)).slice(0, MAX_SUBGENRES);
    });
  }, [genres]);

  function toggleGenre(g: string) {
    setGenres((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));
  }

  function toggleSub(s: string) {
    setSubgenres((prev) => {
      if (prev.includes(s)) return prev.filter((x) => x !== s);
      if (prev.length >= MAX_SUBGENRES) return prev;
      return [...prev, s];
    });
  }

  return (
    <div className="grid gap-6">
      <input type="hidden" name="genresJson" value={JSON.stringify(genres)} readOnly />
      <input type="hidden" name="subgenresJson" value={JSON.stringify(subgenres)} readOnly />

      <div className="grid gap-2">
        <div>
          <span className="text-sm font-medium text-zinc-900">Genre</span>
          <p className="mt-0.5 text-xs text-[color:var(--ink-muted)]">
            Select any genres that apply (multi-select).
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {SUBMISSION_GENRE_OPTIONS.map((g) => {
            const id = genreInputId(g);
            const checked = genres.includes(g);
            return (
              <div
                key={g}
                className="flex items-start gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm leading-snug transition hover:border-[color:var(--brand-magenta)]/35"
              >
                <input
                  id={id}
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleGenre(g)}
                  className="mt-0.5 size-4 shrink-0 rounded border-zinc-300 text-[color:var(--brand-magenta)] focus:ring-[color:var(--brand-magenta)]/30"
                />
                <label htmlFor={id} className="flex-1 cursor-pointer text-[color:var(--ink)]">
                  {g}
                </label>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-2">
        <div>
          <span className="text-sm font-medium text-zinc-900">Subgenre</span>
          <p className="mt-0.5 text-xs text-[color:var(--ink-muted)]">
            Select up to two subgenres max. Options depend on the genres you selected above.
          </p>
        </div>
        {genres.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 px-3 py-2 text-xs text-zinc-600">
            Choose at least one genre to see subgenre options.
          </p>
        ) : subOptions.length === 0 ? null : (
          <div className="grid gap-2 sm:grid-cols-2">
            {subOptions.map((s) => {
              const id = subInputId(s);
              const checked = subgenres.includes(s);
              const atCap = subgenres.length >= MAX_SUBGENRES && !checked;
              return (
                <div
                  key={s}
                  className={`flex items-start gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm leading-snug transition hover:border-[color:var(--brand-purple)]/35 ${
                    atCap ? "opacity-45" : ""
                  }`}
                >
                  <input
                    id={id}
                    type="checkbox"
                    checked={checked}
                    disabled={atCap}
                    onChange={() => toggleSub(s)}
                    className="mt-0.5 size-4 shrink-0 rounded border-zinc-300 text-[color:var(--brand-purple)] focus:ring-[color:var(--brand-purple)]/30"
                  />
                  <label
                    htmlFor={id}
                    className={`flex-1 text-[color:var(--ink)] ${atCap ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    {s}
                  </label>
                </div>
              );
            })}
          </div>
        )}
        {genres.length > 0 && subOptions.length > 0 ? (
          <p className="text-xs text-[color:var(--ink-muted)]">
            {subgenres.length} of {MAX_SUBGENRES} subgenres selected
          </p>
        ) : null}
      </div>
    </div>
  );
}
