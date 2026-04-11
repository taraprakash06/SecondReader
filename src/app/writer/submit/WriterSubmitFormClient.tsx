"use client";

import { useRouter } from "next/navigation";
import { useActionState, useCallback, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { WriterGenreSubgenreFields } from "@/components/WriterGenreSubgenreFields";
import { WriterFocusAreasField } from "@/components/WriterFocusAreasField";
import { WriterSubmitFormShell } from "@/components/WriterSubmitFormShell";
import { RichTextInitialPagesField } from "@/components/RichTextInitialPagesField";
import { FIRST_READ_SHARE_LABEL } from "@/lib/manuscriptSplit";
import { MAX_MANUSCRIPT_SUBMIT_UTF8_BYTES } from "@/lib/sanitizeRichText";
import { createSubmission, type CreateSubmissionState } from "./actions";

function CreateSubmissionButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] px-4 text-base font-semibold text-white shadow-sm sm:min-h-10 sm:min-w-[11rem] sm:w-auto sm:text-sm ${
        pending ? "cursor-wait opacity-95" : "hover:opacity-95"
      }`}
    >
      {pending ? (
        <>
          <span
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
            aria-hidden
          />
          Submitting…
        </>
      ) : (
        "Create submission"
      )}
    </button>
  );
}

const STAGE_OPTIONS = [
  { id: "EARLY_DRAFT", label: "Early draft" },
  { id: "POLISHED_DRAFT", label: "Polished draft" },
  { id: "PRE_SUBMISSION", label: "Pre-submission" },
] as const;

const initialSubmissionState: CreateSubmissionState = { error: null };

export function WriterSubmitFormClient() {
  const router = useRouter();
  const [state, formAction] = useActionState(createSubmission, initialSubmissionState);
  const [clientError, setClientError] = useState<string | null>(null);

  useEffect(() => {
    if (state.submissionId) {
      router.replace(`/writer/submissions/${state.submissionId}?created=1`);
    }
  }, [state.submissionId, router]);

  const onBeforeSubmit = useCallback((form: HTMLFormElement) => {
    setClientError(null);
    const hidden = form.querySelector<HTMLInputElement>("input[name='fullManuscript']");
    const raw = hidden?.value ?? "";
    const bytes = new TextEncoder().encode(raw).length;
    if (bytes > MAX_MANUSCRIPT_SUBMIT_UTF8_BYTES) {
      setClientError(
        "Your manuscript is still too large to send (heavy Word or Docs formatting). Copy into a plain-text editor, paste back here, or paste a shorter sample.",
      );
      return false;
    }
    return true;
  }, []);

  const displayError = clientError ?? state.error;

  return (
    <WriterSubmitFormShell
      action={formAction}
      onBeforeSubmit={onBeforeSubmit}
      className="mt-6 grid gap-4 rounded-2xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] p-[1px] shadow-sm sm:mt-8 sm:rounded-3xl"
    >
      <div className="grid gap-5 rounded-[22px] border border-zinc-200 bg-white/90 p-4 backdrop-blur sm:gap-4 sm:rounded-[23px] sm:p-6">
        {displayError ? (
          <p
            className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900"
            role="alert"
          >
            {displayError}
          </p>
        ) : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">Title</span>
            <input
              name="title"
              required
              className="min-h-12 w-full rounded-xl border border-zinc-200 bg-white px-3 text-base focus:border-[color:var(--brand-magenta)]/50 focus:outline-none md:min-h-10 md:text-sm"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">Word count (full piece)</span>
            <input
              name="wordCount"
              inputMode="numeric"
              required
              className="min-h-12 w-full rounded-xl border border-zinc-200 bg-white px-3 text-base focus:border-[color:var(--brand-purple)]/50 focus:outline-none md:min-h-10 md:text-sm"
              placeholder="e.g., 2400"
            />
          </label>
        </div>

        <WriterGenreSubgenreFields />

        <label className="flex max-w-full flex-col gap-1.5 text-sm sm:max-w-md">
          <span className="font-medium">Stage</span>
          <select
            name="stage"
            defaultValue="EARLY_DRAFT"
            className="min-h-12 w-full rounded-xl border border-zinc-200 bg-white px-3 text-base focus:border-[color:var(--brand-magenta)]/50 focus:outline-none md:min-h-10 md:text-sm"
          >
            {STAGE_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-zinc-900">
            What would you most value feedback on and what would you like the reader to focus on?{" "}
            <span className="font-normal text-[color:var(--ink-muted)]">Pick up to 5.</span>
          </span>
          <WriterFocusAreasField />
        </div>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-900">
            What feedback is not helpful right now? (optional)
          </span>
          <input
            name="notHelpful"
            className="min-h-12 w-full rounded-xl border border-zinc-200 bg-white px-3 text-base focus:border-[color:var(--brand-purple)]/50 focus:outline-none md:min-h-10 md:text-sm"
            placeholder="e.g., Not looking for grammar edits yet"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-900">Note to readers browsing your piece (optional)</span>
          <span className="text-xs text-[color:var(--ink-muted)]">
            Shown on Browse Pieces with your draft stage—e.g. what you’re worried about. No manuscript text
            here.
          </span>
          <textarea
            name="writerBrowseNote"
            rows={3}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-base leading-relaxed focus:border-[color:var(--brand-magenta)]/50 focus:outline-none md:text-sm"
            placeholder="e.g. Mostly worried about pacing in the middle."
          />
        </label>

        <div className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-900">Paste your full manuscript</span>
          <p className="text-xs text-[color:var(--ink-muted)]">
            Paste from Word or Google Docs to keep bold, italics, underline, and similar formatting. Your whole piece
            is saved here; readers only see the first {FIRST_READ_SHARE_LABEL} until you choose to share more after
            feedback.
          </p>
          <RichTextInitialPagesField />
          <p className="text-xs text-[color:var(--ink-muted)]">
            Reader preferences are guidelines. Readers will use judgment.
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-3 sm:items-end">
          <p className="max-w-md text-left text-xs text-[color:var(--ink-muted)] sm:text-right">
            Wait for the redirect after you submit—no need to click again.
          </p>
          <CreateSubmissionButton />
        </div>
      </div>
    </WriterSubmitFormShell>
  );
}
