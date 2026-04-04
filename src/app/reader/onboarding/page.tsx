import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { FeedbackSampleComposer } from "@/components/FeedbackSampleComposer";
import { UserRole, SampleGenre } from "@prisma/client";
import { auth } from "@/lib/auth";
import { ensureFictionToothSamplePiece } from "@/lib/ensureFictionToothSample";
import {
  CANONICAL_TOOTH_TITLE,
  LEGACY_TOOTH_TITLE,
} from "@/lib/sampleTexts/fictionTooth";

type DraftComment = { id: string; quote: string; message: string };

const FICTION_GENRE: SampleGenre = "FICTION";

function normalizeString(input: FormDataEntryValue | null) {
  return String(input ?? "").trim();
}

async function getToothSamplePiece() {
  await ensureFictionToothSamplePiece();
  return (
    (await db.samplePiece.findUnique({ where: { title: CANONICAL_TOOTH_TITLE } })) ??
    (await db.samplePiece.findUnique({ where: { title: LEGACY_TOOTH_TITLE } }))
  );
}

async function saveFeedbackSample(formData: FormData) {
  "use server";

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Please sign in.");

  const samplePiece = await getToothSamplePiece();
  if (!samplePiece) throw new Error("Fiction sample piece is missing from the database.");

  const commentsJson = normalizeString(formData.get("commentsJson"));
  const strengths = normalizeString(formData.get("strengths"));
  const improvements = normalizeString(formData.get("improvements"));
  const keyTakeaways = normalizeString(formData.get("keyTakeaways"));

  const comments = (commentsJson ? (JSON.parse(commentsJson) as DraftComment[]) : []).filter(
    (c) => c && typeof c.quote === "string" && typeof c.message === "string",
  );

  const user = await db.user.update({
    where: { id: userId },
    data: { role: UserRole.READER },
    include: { readerProfile: { include: { feedbackSamples: true } } },
  });

  const readerProfile =
    user.readerProfile ??
    (await db.readerProfile.create({
      data: { userId: user.id },
    }));

  const existing = await db.feedbackSample.count({
    where: { readerProfileId: readerProfile.id },
  });
  if (existing > 0) {
    redirect(`/readers/${user.id}`);
  }

  await db.feedbackSample.create({
    data: {
      readerProfileId: readerProfile.id,
      samplePieceId: samplePiece.id,
      genre: FICTION_GENRE,
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
  searchParams?: Promise<{ email?: string; name?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/sign-in");
  }

  const userId = session.user.id;

  const existingProfile = await db.readerProfile.findUnique({
    where: { userId },
    include: { feedbackSamples: { take: 1 } },
  });
  if (existingProfile && existingProfile.feedbackSamples.length > 0) {
    redirect(`/readers/${userId}`);
  }

  const sp = (await searchParams) ?? {};

  const samplePiece = await getToothSamplePiece();

  if (!samplePiece) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <Link
          className="text-sm font-medium text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]"
          href="/reader"
        >
          ← Back
        </Link>
        <p className="mt-6 text-sm text-[color:var(--ink-muted)]">
          Something went wrong loading the sample piece. Please try again in a moment.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <div className="flex flex-col gap-2">
        <Link
          className="text-sm font-medium text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]"
          href="/reader"
        >
          ← Reader space
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Your feedback sample</h1>
        <p className="text-sm leading-6 text-[color:var(--ink-muted)]">
          Write a thoughtful critique on this short anonymous fiction piece (<em>The Tooth</em>). Your
          inline notes and summary become your public sample so writers can see your style before they
          invite you in. Each reader completes one sample.
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

          <div className="mt-6 rounded-xl border border-zinc-200 bg-[color:var(--paper-2)] p-4">
            <p className="text-xs font-semibold text-[color:var(--ink)]">Piece you’re reviewing</p>
            <p className="mt-1 text-sm text-[color:var(--ink)]">
              <span className="font-medium">Fiction</span> — <em>Tooth</em>
            </p>
            <p className="mt-2 text-xs text-[color:var(--ink-muted)]">
              This is the only public sample piece for readers right now.
            </p>
          </div>

          <FeedbackSampleComposer sampleText={samplePiece.text} defaultMode="comment" />

          <input type="hidden" name="genre" value={FICTION_GENRE} />
          <input type="hidden" name="sampleTitle" value={samplePiece.title} />

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
