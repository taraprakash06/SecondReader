import Link from "next/link";
import { WriterSubmitFormLoader } from "./WriterSubmitFormLoader";

export default function WriterSubmitPage() {
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

      <WriterSubmitFormLoader />
    </div>
  );
}
