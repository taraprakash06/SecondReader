import Link from "next/link";
import { db } from "@/lib/db";

type SearchParams = {
  age?: string;
  q?: string;
};

function normalizeStringParam(input: string | string[] | undefined) {
  if (!input) return "";
  return Array.isArray(input) ? input[0] ?? "" : input;
}

export default async function ReadersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const age = normalizeStringParam(sp.age);
  const q = normalizeStringParam(sp.q);

  const readers = await db.readerProfile.findMany({
    where: {
      ...(q
        ? {
            OR: [
              { user: { name: { contains: q } } },
              { genres: { contains: q } },
              { caresAbout: { contains: q } },
            ],
          }
        : {}),
      ...(age ? { ageCategory: age as never } : {}),
      feedbackSamples: { some: {} },
    },
    include: {
      user: true,
      feedbackSamples: {
        include: { samplePiece: true, comments: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 50,
  });

  const ageOptions = [
    { id: "", label: "Any age" },
    { id: "TEEN", label: "Teen" },
    { id: "ADULT", label: "Adult" },
    { id: "SENIOR", label: "Senior" },
    { id: "UNSPECIFIED", label: "Unspecified" },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <div className="flex flex-col gap-2">
        <Link className="text-sm font-medium text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]" href="/">
          ← Home
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Browse readers</h1>
        <p className="text-sm leading-6 text-[color:var(--ink-muted)]">
          Readers are shown with a public feedback sample (required). Filter by age category
          and search by name/genres/values.
        </p>
      </div>

      <form className="mt-8 grid gap-3 rounded-2xl border border-zinc-200 bg-white/90 p-4 shadow-sm backdrop-blur sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Age category</span>
          <select
            name="age"
            defaultValue={age}
            className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm focus:border-[color:var(--brand-purple)]/50 focus:outline-none"
          >
            {ageOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span className="font-medium">Search</span>
          <input
            name="q"
            defaultValue={q}
            placeholder="e.g., poetry, pacing, line edits"
            className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm focus:border-[color:var(--brand-magenta)]/50 focus:outline-none"
          />
        </label>

        <div className="sm:col-span-3">
          <button className="h-10 rounded-xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] px-4 text-sm font-medium text-white shadow-sm hover:opacity-95">
            Apply filters
          </button>
        </div>
      </form>

      <div className="mt-8 grid gap-4">
        {readers.map((r) => (
          <div
            key={r.id}
            className="rounded-2xl border border-zinc-200 bg-white/95 p-6 shadow-sm backdrop-blur"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">{r.user.name}</h2>
                <p className="text-sm text-[color:var(--ink-muted)]">
                  <span className="font-medium text-[color:var(--ink)]">Genres:</span>{" "}
                  {r.genres || "—"}
                </p>
                <p className="text-sm text-[color:var(--ink-muted)]">
                  <span className="font-medium text-[color:var(--ink)]">Cares about:</span>{" "}
                  {r.caresAbout || "—"}
                </p>
                <p className="text-sm text-[color:var(--ink-muted)]">
                  <span className="font-medium text-[color:var(--ink)]">Philosophy:</span>{" "}
                  {r.feedbackPhilosophy || "—"}
                </p>
              </div>

              <Link
                className="mt-3 inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-[color:var(--ink)] hover:border-[color:var(--brand-magenta)]/35 hover:bg-[color:var(--paper-2)] sm:mt-0"
                href={`/readers/${r.userId}`}
              >
                View sample →
              </Link>
            </div>

            {r.feedbackSamples[0] ? (
              <div className="mt-5 overflow-hidden rounded-2xl bg-zinc-50 p-[1px]">
                <div className="bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] p-[1px]">
                  <div className="rounded-[15px] bg-white p-5">
                    <p className="text-xs font-semibold text-[color:var(--ink)]">Feedback sample (excerpt)</p>
                    <p className="mt-2 text-sm text-[color:var(--ink-muted)]">
                      <span className="font-medium text-[color:var(--ink)]">Strengths:</span>{" "}
                  {r.feedbackSamples[0].publicStrengths || "—"}
                </p>
                    <p className="mt-1 text-sm text-[color:var(--ink-muted)]">
                      <span className="font-medium text-[color:var(--ink)]">Areas to improve:</span>{" "}
                  {r.feedbackSamples[0].publicImprovements || "—"}
                </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ))}

        {readers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-sm text-[color:var(--ink-muted)]">
            No readers match those filters yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}

