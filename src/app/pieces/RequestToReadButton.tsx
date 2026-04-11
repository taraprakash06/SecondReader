"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { createVolunteerReadRequest } from "@/app/pieces/actions";
import { FIRST_READ_SHARE_LABEL } from "@/lib/manuscriptSplit";

type State =
  | "signed_out"
  | "ready"
  | "pending"
  | "connected"
  | "closed"
  | "need_sample"
  | "piece_full";

type Props = {
  submissionId: string;
  state: State;
  signInCallbackUrl: string;
  /** When the reader is already assigned, link straight to the critique workspace. */
  connectedAssignmentId?: string | null;
};

export function RequestToReadButton({
  submissionId,
  state,
  signInCallbackUrl,
  connectedAssignmentId,
}: Props) {
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);
  const [pending, start] = useTransition();

  if (state === "need_sample") {
    return (
      <div className="text-sm text-[color:var(--ink-muted)]">
        <Link className="font-semibold text-[color:var(--brand-purple)] hover:underline" href="/reader/onboarding">
          Finish reader onboarding
        </Link>{" "}
        to request reads.
      </div>
    );
  }

  if (state === "piece_full") {
    return (
      <p className="text-sm font-medium text-[color:var(--ink-muted)]">
        This piece already has the maximum number of readers/invites.
      </p>
    );
  }

  if (state === "closed") {
    return <p className="text-sm font-medium text-[color:var(--ink-muted)]">Requests closed</p>;
  }

  if (state === "connected") {
    const href = connectedAssignmentId
      ? `/critiques/${connectedAssignmentId}`
      : "/notifications";
    const label = connectedAssignmentId ? "Open piece & feedback →" : "Open notifications";
    return (
      <Link
        className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-[color:var(--ink)] hover:bg-[color:var(--paper-2)]"
        href={href}
      >
        {label}
      </Link>
    );
  }

  if (state === "pending") {
    return <p className="text-sm font-medium text-amber-900">Request pending — writer hasn’t responded yet.</p>;
  }

  if (state === "signed_out") {
    return (
      <div className="flex flex-col gap-1.5">
        <Link
          className="inline-flex h-10 w-fit items-center justify-center rounded-xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] px-4 text-sm font-semibold text-white shadow-sm hover:opacity-95"
          href={`/auth/sign-in?callbackUrl=${encodeURIComponent(signInCallbackUrl)}`}
        >
          Sign in to request
        </Link>
        <p className="max-w-md text-xs leading-relaxed text-[color:var(--ink-muted)]">
          Sign in to request access to the first section ({FIRST_READ_SHARE_LABEL}).
        </p>
      </div>
    );
  }

  function onClick() {
    setErr("");
    setOk(false);
    start(async () => {
      try {
        await createVolunteerReadRequest(submissionId);
        setOk(true);
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Something went wrong.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={onClick}
        className="inline-flex h-10 items-center justify-center rounded-xl bg-[linear-gradient(90deg,var(--brand-magenta),var(--brand-purple))] px-4 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Request to Read"}
      </button>
      {ok ? (
        <p className="text-sm font-medium text-emerald-800">Request sent. The writer will see it in Notifications.</p>
      ) : null}
      {err ? <p className="text-sm text-red-700">{err}</p> : null}
    </div>
  );
}
