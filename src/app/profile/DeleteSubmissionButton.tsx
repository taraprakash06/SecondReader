"use client";

import { useFormStatus } from "react-dom";
import { deleteSubmissionAction } from "@/app/profile/actions";

function DeleteSubmit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="shrink-0 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}

export function DeleteSubmissionButton({ submissionId }: { submissionId: string }) {
  return (
    <form
      action={deleteSubmissionAction}
      className="inline"
      onSubmit={(e) => {
        if (
          !confirm(
            "Delete this submission permanently? Critiques and invites tied to it will be removed.",
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="submissionId" value={submissionId} />
      <DeleteSubmit />
    </form>
  );
}
