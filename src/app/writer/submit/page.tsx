import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DraftStage, FeedbackFocus, FeedbackTonePreference } from "@prisma/client";
import { auth } from "@/lib/auth";

function clampInitialPages(text: string) {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  const pages = normalized.split(/\n\s*\n\s*\f\s*\n\s*\n/g); // rarely used; harmless
  if (pages.length >= 2) return pages.slice(0, 3).join("\n\n");

  // fallback heuristic: limit by ~9000 chars (roughly 3 pages double-spaced)
  const maxChars = 9000;
  return normalized.length > maxChars ? normalized.slice(0, maxChars).trimEnd() : normalized;
}

async function createSubmission(formData: FormData) {
  "use server";

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Please sign in.");

  const writer = await db.user.findUnique({ where: { id: userId } });
  if (!writer) throw new Error("User not found.");

  const title = String(formData.get("title") ?? "").trim();
  const genre = String(formData.get("genre") ?? "").trim();
  const subgenre = String(formData.get("subgenre") ?? "").trim();
  const wordCount = Number(formData.get("wordCount") ?? 0);
  const stage = String(formData.get("stage") ?? "").trim() as DraftStage;
  const focus1 = String(formData.get("focus1") ?? "").trim() as FeedbackFocus;
  const focus2Raw = String(formData.get("focus2") ?? "").trim();
  const focus2 = focus2Raw ? (focus2Raw as FeedbackFocus) : null;
  const focusOther = String(formData.get("focusOther") ?? "").trim();
  const tonePref = String(formData.get("tonePref") ?? "").trim() as FeedbackTonePreference;
  const notHelpful = String(formData.get("notHelpful") ?? "").trim();
  const initialText = String(formData.get("initialPages") ?? "");

  if (!title || !genre) throw new Error("Missing title/genre.");
  if (!Number.isFinite(wordCount) || wordCount <= 0) throw new Error("Invalid word count.");
  if (!Object.values(DraftStage).includes(stage)) throw new Error("Invalid stage.");
  if (!Object.values(FeedbackFocus).includes(focus1)) throw new Error("Invalid focus.");
  if (focus2 && !Object.values(FeedbackFocus).includes(focus2)) throw new Error("Invalid focus2.");
  if (!Object.values(FeedbackTonePreference).includes(tonePref)) throw new Error("Invalid tone.");
  if (!initialText.trim()) throw new Error("Please paste your first pages.");

  const initialPages = clampInitialPages(initialText);

  const submission = await db.submission.create({
    data: {
      writerId: writer.id,
      title,
      genre,
      subgenre,
      wordCount,
      stage,
      focus1,
      focus2: focus2 ?? undefined,
      focusOther,
      tonePref,
      notHelpful,
      initialPages,
    },
  });

  redirect(`/writer/submissions/${submission.id}`);
}

export default function WriterSubmitPage() {
  const stageOptions: { id: DraftStage; label: string }[] = [
    { id: DraftStage.EARLY_DRAFT, label: "Early draft" },
    { id: DraftStage.POLISHED_DRAFT, label: "Polished draft" },
    { id: DraftStage.PRE_SUBMISSION, label: "Pre-submission" },
  ];

  const focusOptions: { id: FeedbackFocus; label: string }[] = [
    { id: FeedbackFocus.BIG_PICTURE, label: "Big picture" },
    { id: FeedbackFocus.LINE_EDITS, label: "Line edits" },
    { id: FeedbackFocus.EMOTIONAL_IMPACT, label: "Emotional impact" },
    { id: FeedbackFocus.STRUCTURE, label: "Structure" },
    { id: FeedbackFocus.OTHER, label: "Other" },
  ];

  const toneOptions: { id: FeedbackTonePreference; label: string }[] = [
    { id: FeedbackTonePreference.GENTLE, label: "Gentle" },
    { id: FeedbackTonePreference.BALANCED, label: "Balanced" },
    { id: FeedbackTonePreference.DIRECT, label: "Direct" },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <div className="flex flex-col gap-2">
        <Link
          className="text-sm font-medium text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]"
          href="/writer"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Submit a piece</h1>
        <p className="text-sm leading-6 text-[color:var(--ink-muted)]">
          You’ll share only your first{" "}
          <span className="font-medium text-[color:var(--ink)]">3 pages</span> for
          now. If a reader is a fit, you can unlock more later.
        </p>
      </div>

      <form
        action={createSubmission}
        className="mt-8 grid gap-4 rounded-3xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] p-[1px] shadow-sm"
      >
        <div className="grid gap-4 rounded-[23px] border border-zinc-200 bg-white/90 p-6 backdrop-blur">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Title</span>
            <input
              name="title"
              required
              className="h-10 rounded-xl border border-zinc-200 bg-white px-3 focus:border-[color:var(--brand-magenta)]/50 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Word count (full piece)</span>
            <input
              name="wordCount"
              inputMode="numeric"
              required
              className="h-10 rounded-xl border border-zinc-200 bg-white px-3 focus:border-[color:var(--brand-purple)]/50 focus:outline-none"
              placeholder="e.g., 2400"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Genre</span>
            <input
              name="genre"
              required
              className="h-10 rounded-xl border border-zinc-200 bg-white px-3 focus:border-[color:var(--brand-magenta)]/50 focus:outline-none"
              placeholder="e.g., Literary Fiction"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Subgenre (optional)</span>
            <input
              name="subgenre"
              className="h-10 rounded-xl border border-zinc-200 bg-white px-3 focus:border-[color:var(--brand-purple)]/50 focus:outline-none"
              placeholder="e.g., Magical realism"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Stage</span>
            <select
              name="stage"
              defaultValue={DraftStage.EARLY_DRAFT}
              className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm focus:border-[color:var(--brand-magenta)]/50 focus:outline-none"
            >
              {stageOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">How do you prefer feedback to feel?</span>
            <select
              name="tonePref"
              defaultValue={FeedbackTonePreference.BALANCED}
              className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm focus:border-[color:var(--brand-purple)]/50 focus:outline-none"
            >
              {toneOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-900">
              What would you most value feedback on? What would be most helpful right now? (pick up
              to 2)
            </span>
            <select
              name="focus1"
              defaultValue={FeedbackFocus.BIG_PICTURE}
              className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm focus:border-[color:var(--brand-magenta)]/50 focus:outline-none"
            >
              {focusOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-900">Second choice (optional)</span>
            <select
              name="focus2"
              defaultValue=""
              className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm focus:border-[color:var(--brand-purple)]/50 focus:outline-none"
            >
              <option value="">—</option>
              {focusOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-900">If you picked “Other”, what do you mean?</span>
          <input
            name="focusOther"
            className="h-10 rounded-xl border border-zinc-200 bg-white px-3 focus:border-[color:var(--brand-magenta)]/50 focus:outline-none"
            placeholder="Short phrase"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-900">What feedback is not helpful right now? (optional)</span>
          <input
            name="notHelpful"
            className="h-10 rounded-xl border border-zinc-200 bg-white px-3 focus:border-[color:var(--brand-purple)]/50 focus:outline-none"
            placeholder="e.g., Not looking for grammar edits yet"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-900">Paste your first pages</span>
          <textarea
            name="initialPages"
            required
            rows={14}
            className="rounded-2xl border border-zinc-200 bg-white p-3 text-sm leading-6 focus:border-[color:var(--brand-magenta)]/50 focus:outline-none"
            placeholder="Paste up to ~3 pages. The app will keep only the first chunk for the initial share."
          />
          <p className="text-xs text-[color:var(--ink-muted)]">
            Reader preferences are guidelines. Readers will use judgment.
          </p>
        </label>

        <div className="flex items-center justify-end">
          <button className="h-10 rounded-xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] px-4 text-sm font-medium text-white shadow-sm hover:opacity-95">
            Create submission
          </button>
        </div>
        </div>
      </form>
    </div>
  );
}

