"use client";

import { WriterFocusAreasField } from "@/components/WriterFocusAreasField";
import { WriterSubmitFormShell } from "@/components/WriterSubmitFormShell";
import { RichTextInitialPagesField } from "@/components/RichTextInitialPagesField";
import { createSubmission } from "./actions";

const STAGE_OPTIONS = [
  { id: "EARLY_DRAFT", label: "Early draft" },
  { id: "POLISHED_DRAFT", label: "Polished draft" },
  { id: "PRE_SUBMISSION", label: "Pre-submission" },
] as const;

export function WriterSubmitFormClient() {
  return (
    <WriterSubmitFormShell
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

        <label className="flex max-w-md flex-col gap-1 text-sm">
          <span className="font-medium">Stage</span>
          <select
            name="stage"
            defaultValue="EARLY_DRAFT"
            className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm focus:border-[color:var(--brand-magenta)]/50 focus:outline-none"
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
            className="h-10 rounded-xl border border-zinc-200 bg-white px-3 focus:border-[color:var(--brand-purple)]/50 focus:outline-none"
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
            rows={2}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-[color:var(--brand-magenta)]/50 focus:outline-none"
            placeholder="e.g. Mostly worried about pacing in the middle."
          />
        </label>

        <div className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-900">Paste your first pages</span>
          <p className="text-xs text-[color:var(--ink-muted)]">
            Paste from Word or Google Docs to keep bold, italics, underline, and similar formatting.
            The initial share is limited to about three pages of text.
          </p>
          <RichTextInitialPagesField />
          <p className="text-xs text-[color:var(--ink-muted)]">
            Reader preferences are guidelines. Readers will use judgment.
          </p>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="h-10 rounded-xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] px-4 text-sm font-medium text-white shadow-sm hover:opacity-95"
          >
            Create submission
          </button>
        </div>
      </div>
    </WriterSubmitFormShell>
  );
}
