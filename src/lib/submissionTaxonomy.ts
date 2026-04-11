/**
 * Canonical genres and subgenres for writer submissions (Browse Pieces / filters use the same strings).
 */

export const SUBMISSION_GENRE_OPTIONS = [
  "Fiction",
  "Nonfiction",
  "Poetry",
  "Drama / Script",
  "Hybrid / Experimental",
] as const;

export type SubmissionGenre = (typeof SUBMISSION_GENRE_OPTIONS)[number];

const SUBGENRES_BY_GENRE: Record<SubmissionGenre, readonly string[]> = {
  Fiction: [
    "Literary Fiction",
    "Speculative (sci-fi / fantasy)",
    "Commercial (romance, thriller, mystery)",
    "Historical Fiction",
    "Flash / Short Story",
  ],
  Nonfiction: [
    "Personal Essay / Memoir",
    "Creative Nonfiction",
    "Journalism / Reportage",
    "Cultural Criticism",
    "Academic / Critical",
  ],
  Poetry: ["Free Verse", "Formal / Metered", "Prose Poetry", "Narrative Poetry", "Experimental"],
  "Drama / Script": ["Stage Play", "Screenplay", "TV Script", "Monologue", "Sketch / Short-form"],
  "Hybrid / Experimental": [
    "Hybrid (poetry + prose)",
    "Fragmented / Nonlinear",
    "Lyric Essay",
    "Multimedia / Visual",
    "Experimental",
  ],
};

const GENRE_SET = new Set<string>(SUBMISSION_GENRE_OPTIONS);

/** Union of subgenre labels allowed for the given genres (deduped, stable order). */
export function subgenreOptionsForGenres(genres: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const g of genres) {
    if (!GENRE_SET.has(g)) continue;
    const list = SUBGENRES_BY_GENRE[g as SubmissionGenre];
    for (const s of list) {
      if (seen.has(s)) continue;
      seen.add(s);
      out.push(s);
    }
  }
  return out;
}

export function isValidGenre(g: string): g is SubmissionGenre {
  return GENRE_SET.has(g);
}

export function parseStringArrayJson(raw: string, field: string): string[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`Invalid ${field} data.`);
  }
  if (!Array.isArray(parsed)) throw new Error(`Invalid ${field} data.`);
  const out = parsed
    .filter((x): x is string => typeof x === "string")
    .map((x) => x.trim())
    .filter(Boolean);
  return [...new Set(out)];
}

export function validateSubmissionGenres(genres: string[]): void {
  if (genres.length === 0) {
    throw new Error("Select at least one genre.");
  }
  for (const g of genres) {
    if (!isValidGenre(g)) {
      throw new Error(`Invalid genre: ${g}`);
    }
  }
}

const MAX_SUBGENRES = 2;

export function validateSubmissionSubgenres(genres: string[], subgenres: string[]): void {
  if (subgenres.length > MAX_SUBGENRES) {
    throw new Error("Select up to two subgenres max.");
  }
  const allowed = new Set(subgenreOptionsForGenres(genres));
  for (const s of subgenres) {
    if (!allowed.has(s)) {
      throw new Error(`Invalid subgenre for your genres: ${s}`);
    }
  }
}

/** Stored on `Submission.genre` (multi). */
export function joinGenresForStorage(genres: string[]): string {
  return genres.join(" · ");
}

/** Stored on `Submission.subgenre` (0–2). */
export function joinSubgenresForStorage(subgenres: string[]): string {
  return subgenres.join(" · ");
}
