"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { createReaderInvite } from "@/app/readers/inviteActions";

type Props = {
  readerUserId: string;
  submissions: { id: string; title: string }[];
};

export function InviteReaderForm({ readerUserId, submissions }: Props) {
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);
  const [pending, start] = useTransition();
  const [subId, setSubId] = useState(submissions[0]?.id ?? "");

  if (submissions.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-zinc-200 bg-[color:var(--paper-2)] p-4 text-sm text-[color:var(--ink-muted)]">
        <p>Submit a piece first, then you can invite this reader.</p>
        <Link
          className="mt-2 inline-block font-semibold text-[color:var(--brand-magenta)] hover:underline"
          href="/writer/submit"
        >
          Submit a piece →
        </Link>
      </div>
    );
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setOk(false);
    start(async () => {
      try {
        await createReaderInvite(readerUserId, subId);
        setOk(true);
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Something went wrong.");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-3">
      <label className="grid gap-1 text-sm">
        <span className="font-medium text-[color:var(--ink)]">Piece to share</span>
        <select
          value={subId}
          onChange={(e) => setSubId(e.target.value)}
          className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm"
        >
          {submissions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-10 items-center justify-center rounded-xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] px-4 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Invite reader"}
      </button>
      {ok ? (
        <p className="text-sm font-medium text-emerald-800">Invite sent. They’ll see it in Notifications.</p>
      ) : null}
      {err ? <p className="text-sm text-red-700">{err}</p> : null}
    </form>
  );
}
