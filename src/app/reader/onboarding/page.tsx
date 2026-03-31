import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { FeedbackSampleComposer } from "@/components/FeedbackSampleComposer";
import { UserRole } from "@prisma/client";
import type { SampleGenre } from "@prisma/client";

type DraftComment = { id: string; quote: string; message: string };

const SAMPLE_GENRES = [
  "FICTION",
  "PERSONAL_ESSAY_MEMOIR",
  "POETRY",
  "LITERARY_NONFICTION",
  "GENRE_FICTION",
] as const satisfies readonly SampleGenre[];

function isSampleGenre(value: string): value is SampleGenre {
  return (SAMPLE_GENRES as readonly string[]).includes(value);
}

function normalizeString(input: FormDataEntryValue | null) {
  return String(input ?? "").trim();
}

async function saveFeedbackSample(formData: FormData) {
  "use server";

  const email = normalizeString(formData.get("email"));
  const name = normalizeString(formData.get("name")) || "Reader";
  const genreRaw = normalizeString(formData.get("genre"));
  const genre: SampleGenre = isSampleGenre(genreRaw) ? genreRaw : "FICTION";

  if (!email) throw new Error("Email is required.");

  const samplePiece =
    (await db.samplePiece.findFirst({ where: { genre }, orderBy: { createdAt: "asc" } })) ??
    (await db.samplePiece.findFirst({ orderBy: { createdAt: "asc" } }));
  if (!samplePiece) throw new Error("No sample piece exists.");

  const commentsJson = normalizeString(formData.get("commentsJson"));
  const strengths = normalizeString(formData.get("strengths"));
  const improvements = normalizeString(formData.get("improvements"));
  const keyTakeaways = normalizeString(formData.get("keyTakeaways"));

  const comments = (commentsJson ? (JSON.parse(commentsJson) as DraftComment[]) : []).filter(
    (c) => c && typeof c.quote === "string" && typeof c.message === "string",
  );

  const user = await db.user.upsert({
    where: { email },
    update: { name, role: UserRole.READER },
    create: {
      email,
      name,
      role: UserRole.READER,
      readerProfile: { create: {} },
    },
    include: { readerProfile: true },
  });

  const readerProfile =
    user.readerProfile ??
    (await db.readerProfile.create({
      data: { userId: user.id },
    }));

  await db.feedbackSample.create({
    data: {
      readerProfileId: readerProfile.id,
      samplePieceId: samplePiece.id,
      genre,
      publicStrengths: strengths,
      publicImprovements: improvements,
      publicKeyTakeaways: keyTakeaways,
      comments: {
        create: comments.map((c) => ({
          quote: (c.quote ?? "").trim(),
          message: (c.message ?? "").trim(),
        })),
      },
    },
  });

  redirect(`/readers/${user.id}`);
}

export default async function ReaderOnboardingPage({
  searchParams,
}: {
  searchParams?: Promise<{ genre?: string; email?: string; name?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const selectedGenre: SampleGenre = isSampleGenre((sp.genre ?? "").trim())
    ? ((sp.genre ?? "").trim() as SampleGenre)
    : "FICTION";

  const samplePiece =
    (await db.samplePiece.findFirst({
      where: { genre: selectedGenre },
      orderBy: { createdAt: "asc" },
    })) ??
    (await db.samplePiece.findFirst({ orderBy: { createdAt: "asc" } }));

  const pieces = await db.samplePiece.findMany({
    select: { genre: true, title: true },
    orderBy: { createdAt: "asc" },
  });

  if (!samplePiece) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <Link
          className="text-sm font-medium text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]"
          href="/reader"
        >
          ← Back
        </Link>
        <p className="mt-6 text-sm text-[color:var(--ink-muted)]">No sample piece found.</p>
      </div>
    );
  }

  const genreOptions: Array<{ id: SampleGenre; label: string }> = [
    { id: "FICTION", label: "Fiction" },
    { id: "PERSONAL_ESSAY_MEMOIR", label: "Personal essay / memoir" },
    { id: "POETRY", label: "Poetry" },
    { id: "LITERARY_NONFICTION", label: "Literary nonfiction" },
    { id: "GENRE_FICTION", label: "Genre fiction (fantasy, sci-fi, etc.)" },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <div className="flex flex-col gap-2">
        <Link
          className="text-sm font-medium text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]"
          href="/reader"
        >
          ← Reader space
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Create your feedback sample</h1>
        <p className="text-sm leading-6 text-[color:var(--ink-muted)]">
          Write a thoughtful critique on this short anonymous piece. Your inline notes + summary
          become your public sample so writers can see your style before they invite you in.
        </p>
      </div>

      <form
        action={saveFeedbackSample}
        className="mt-8 overflow-visible rounded-3xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] p-[1px] shadow-sm"
      >
        <div className="rounded-[23px] border border-zinc-200 bg-white/90 p-6 backdrop-blur">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-[color:var(--ink)]">Your name</span>
              <input
                name="name"
                defaultValue={sp.name ?? "Reader"}
                className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm focus:border-[color:var(--brand-magenta)]/50 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-[color:var(--ink)]">Email</span>
              <input
                name="email"
                defaultValue={sp.email ?? ""}
                className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm focus:border-[color:var(--brand-purple)]/50 focus:outline-none"
              />
            </label>
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold text-[color:var(--ink-muted)]">
              Anonymous piece: <span className="text-[color:var(--ink)]">{samplePiece.title}</span>
            </p>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-[color:var(--ink)]">Genre</span>
                <select
                  name="genre"
                  defaultValue={selectedGenre}
                  className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm focus:border-[color:var(--brand-magenta)]/50 focus:outline-none"
                >
                  {genreOptions.map((g) => {
                    const title = pieces.find((p) => p.genre === g.id)?.title;
                    return (
                      <option key={g.id} value={g.id}>
                        {g.label}
                        {title ? ` — ${title}` : ""}
                      </option>
                    );
                  })}
                </select>
              </label>
              <div className="rounded-xl border border-zinc-200 bg-[color:var(--paper-2)] p-3 text-xs text-[color:var(--ink-muted)]">
                Pick a genre you like to read. You can add more samples later.
              </div>
            </div>
          </div>

          <FeedbackSampleComposer sampleText={samplePiece.text} defaultMode="comment" />

          <div className="mt-6 flex items-center justify-end">
            <button className="h-10 rounded-xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] px-4 text-sm font-semibold text-white shadow-sm hover:opacity-95">
              Publish my feedback sample
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

