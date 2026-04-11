import Link from "next/link";
import { auth } from "@/lib/auth";
import { BrowseReadersAuthGate } from "@/components/BrowseReadersAuthGate";
import { db } from "@/lib/db";

type SearchParams = {
  age?: string;
  q?: string;
};

function normalizeStringParam(input: string | string[] | undefined) {
  if (!input) return "";
  return Array.isArray(input) ? input[0] ?? "" : input;
}

/** Callback after sign-in so guests return to the same browse URL (filters preserved). */
function browseReadersLocation(sp: SearchParams): string {
  const age = normalizeStringParam(sp.age);
  const q = normalizeStringParam(sp.q);
  const params = new URLSearchParams();
  if (age) params.set("age", age);
  if (q) params.set("q", q);
  const qs = params.toString();
  return qs ? `/readers?${qs}` : "/readers";
}

export default async function ReadersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth();
  const sp = await searchParams;

  if (!session?.user?.id) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="flex flex-col gap-2">
          <Link className="text-sm font-medium text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]" href="/">
            ← Home
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">Browse readers</h1>
          <p className="text-sm leading-6 text-[color:var(--ink-muted)]">
            Readers are shown with a public feedback sample (required). Filter by age category and search by
            name/genres/values.
          </p>
        </div>
        <BrowseReadersAuthGate callbackPath={browseReadersLocation(sp)} />
      </div>
    );
  }

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
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-col gap-2">
        <Link className="text-sm font-medium text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]" href="/">
          ← Home
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Browse readers</h1>
        <p className="text-sm leading-relaxed text-[color:var(--ink-muted)] sm:leading-6">
          Readers are shown with a public feedback sample (required). Filter by age category
          and search by name/genres/values.
        </p>
      </div>

      <form className="mt-6 grid gap-4 rounded-2xl border border-zinc-200 bg-white/90 p-4 shadow-sm backdrop-blur sm:mt-8 md:grid-cols-3">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Age category</span>
          <select
            name="age"
            defaultValue={age}
            className="min-h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-base focus:border-[color:var(--brand-purple)]/50 focus:outline-none md:min-h-10 md:text-sm"
          >
            {ageOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm md:col-span-2">
          <span className="font-medium">Search</span>
          <input
            name="q"
            defaultValue={q}
            placeholder="e.g., poetry, pacing, line edits"
            className="min-h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-base focus:border-[color:var(--brand-magenta)]/50 focus:outline-none md:min-h-10 md:text-sm"
          />
        </label>

        <div className="md:col-span-3">
          <button
            type="submit"
            className="min-h-11 w-full rounded-xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] px-4 text-base font-semibold text-white shadow-sm hover:opacity-95 sm:w-auto sm:text-sm"
          >
            Apply filters
          </button>
        </div>
      </form>

      <div className="mt-6 grid gap-4 sm:mt-8">
        {readers.map((r) => (
          <div
            key={r.id}
            className="w-full max-w-full rounded-2xl border border-zinc-200 bg-white/95 p-4 shadow-sm backdrop-blur sm:p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
              <div className="min-w-0 space-y-2 sm:pr-4">
                <h2 className="text-lg font-semibold leading-snug">{r.user.name}</h2>
                <p className="text-sm leading-relaxed text-[color:var(--ink-muted)]">
                  <span className="font-medium text-[color:var(--ink)]">Genres:</span>{" "}
                  <span className="break-words">{r.genres || "—"}</span>
                </p>
                <p className="text-sm leading-relaxed text-[color:var(--ink-muted)]">
                  <span className="font-medium text-[color:var(--ink)]">Cares about:</span>{" "}
                  <span className="break-words">{r.caresAbout || "—"}</span>
                </p>
                <p className="text-sm leading-relaxed text-[color:var(--ink-muted)]">
                  <span className="font-medium text-[color:var(--ink)]">Philosophy:</span>{" "}
                  <span className="break-words">{r.feedbackPhilosophy || "—"}</span>
                </p>
              </div>

              <Link
                className="inline-flex min-h-11 w-full shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-[color:var(--ink)] hover:border-[color:var(--brand-magenta)]/35 hover:bg-[color:var(--paper-2)] sm:mt-0 sm:w-auto sm:self-start"
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

