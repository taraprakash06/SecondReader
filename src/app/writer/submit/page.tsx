import Link from "next/link";
import { auth } from "@/lib/auth";
import { WriterSubmitAuthGate } from "@/components/WriterSubmitAuthGate";
import { FIRST_READ_SHARE_LABEL } from "@/lib/manuscriptSplit";
import { WriterSubmitFormLoader } from "./WriterSubmitFormLoader";

export default async function WriterSubmitPage() {
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-col gap-2">
        <Link
          className="text-sm font-medium text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]"
          href="/writer"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Submit a piece</h1>
        <p className="text-sm leading-6 text-[color:var(--ink-muted)]">
          Upload your <span className="font-medium text-[color:var(--ink)]">full manuscript</span> here. The platform
          only shows readers your{" "}
          <span className="font-medium text-[color:var(--ink)]">first {FIRST_READ_SHARE_LABEL}</span> at first; you can
          share the rest with a reader after you see their feedback.
        </p>
      </div>

      {userId ? <WriterSubmitFormLoader /> : <WriterSubmitAuthGate />}
    </div>
  );
}
