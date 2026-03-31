import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

const DEMO_WRITER_EMAIL = "writer@example.com";

export default async function WriterSubmissionDetailPage({
  params,
}: {
  params: Promise<{ submissionId: string }>;
}) {
  const writer = await db.user.findUnique({ where: { email: DEMO_WRITER_EMAIL } });
  if (!writer) throw new Error("Demo writer not seeded.");

  const { submissionId } = await params;

  const submission = await db.submission.findFirst({
    where: { id: submissionId, writerId: writer.id },
    include: {
      assignments: {
        include: {
          reader: { include: { readerProfile: { include: { feedbackSample: true } } } },
          feedback: { include: { comments: { orderBy: { createdAt: "asc" } } } },
          tags: true,
        },
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  if (!submission) notFound();

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <div className="flex flex-col gap-2">
        <Link className="text-sm font-medium text-zinc-700 hover:text-zinc-900" href="/writer">
          ← Writer space
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{submission.title}</h1>
        <p className="text-sm text-zinc-700">
          <span className="font-medium text-zinc-900">{submission.genre}</span>
          {submission.subgenre ? ` · ${submission.subgenre}` : ""} · {submission.wordCount} words
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900">Your initial share (3-page gate)</h2>
          <pre className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-800">
            {submission.initialPages}
          </pre>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900">Requests / critiques</h2>
          <p className="mt-1 text-sm text-zinc-700">
            In the MVP, you’ll “request” a reader by opening their profile and choosing them (next
            step we’ll implement).
          </p>

          <div className="mt-4 space-y-4">
            {submission.assignments.map((a) => (
              <div key={a.id} className="rounded-2xl border border-zinc-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{a.reader.name}</p>
                    <p className="text-xs text-zinc-600">Status: {a.status}</p>
                  </div>
                  <Link
                    className="text-sm font-medium text-zinc-700 hover:text-zinc-900"
                    href={`/critiques/${a.id}`}
                  >
                    Open critique →
                  </Link>
                </div>

                {a.feedback ? (
                  <div className="mt-3 rounded-xl bg-zinc-50 p-3 text-sm text-zinc-700">
                    <p className="font-medium text-zinc-900">Latest summary</p>
                    <p className="mt-1">
                      <span className="font-medium text-zinc-900">Strengths:</span>{" "}
                      {a.feedback.strengths || "—"}
                    </p>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-zinc-700">No feedback yet.</p>
                )}
              </div>
            ))}

            {submission.assignments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-700">
                No readers are connected yet.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

