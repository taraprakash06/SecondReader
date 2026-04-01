"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { completeOnboardingAction } from "@/app/onboarding/actions";

const GENRES = [
  "Fiction",
  "Poetry",
  "Personal essay / memoir",
  "Literary nonfiction",
  "Genre fiction (fantasy, sci-fi, etc.)",
] as const;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] px-4 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-60"
    >
      {pending ? "Saving…" : "Finish setup"}
    </button>
  );
}

function CheckboxGroup({
  name,
  label,
}: {
  name: "writeGenres" | "readGenres";
  label: string;
}) {
  return (
    <fieldset className="grid gap-2 rounded-2xl border border-zinc-200 bg-white p-4">
      <legend className="px-1 text-sm font-semibold text-[color:var(--ink)]">{label}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {GENRES.map((g) => (
          <label
            key={`${name}-${g}`}
            className="flex items-start gap-2 rounded-xl bg-[color:var(--paper-2)] p-3 text-sm"
          >
            <input
              type="checkbox"
              name={name}
              value={g}
              className="mt-0.5 h-4 w-4 accent-[color:var(--brand-magenta)]"
            />
            <span className="text-[color:var(--ink)]">{g}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function OnboardingForm({
  initialName,
  initialEmail,
}: {
  initialName: string;
  initialEmail: string;
}) {
  const [error, setError] = React.useState<string | null>(null);

  async function action(formData: FormData) {
    setError(null);
    const res = await completeOnboardingAction(formData);
    if (!res.ok) setError(res.error);
  }

  return (
    <form action={action} className="grid gap-4">
      <div>
        <p className="text-xs font-semibold text-[color:var(--ink-muted)]">Signed in as</p>
        <p className="text-sm font-semibold text-[color:var(--ink)]">{initialEmail}</p>
      </div>

      <label className="grid gap-1 text-sm">
        <span className="font-medium text-[color:var(--ink)]">Name</span>
        <input
          name="name"
          defaultValue={initialName}
          required
          className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm focus:border-[color:var(--brand-magenta)]/50 focus:outline-none"
        />
      </label>

      <CheckboxGroup name="writeGenres" label="Genres you write" />
      <CheckboxGroup name="readGenres" label="Genres you like to read" />

      {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
      <SubmitButton />
    </form>
  );
}

