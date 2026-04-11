import type { ComponentProps } from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  getSubmissionSlotUsageMap,
  submissionHasRoomForInviteOrVolunteer,
} from "@/lib/critiqueLimits";
import {
  formatFocusAreasLine,
  formatWriterBrowseNoteLine,
  formatWordCountLine,
} from "@/lib/submissionBrowseDisplay";
import { RequestToReadButton } from "@/app/pieces/RequestToReadButton";
import { PiecesFilterSidebar } from "@/app/pieces/PiecesFilterSidebar";
import {
  hasActiveBrowseFilters,
  parseBrowsePiecesSearchParams,
  sortBrowseSubmissions,
  submissionMatchesBrowseFilters,
  type BrowsePiecesQuery,
} from "@/lib/browsePiecesQuery";

export default async function BrowsePiecesPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  const sp = (await searchParams) ?? {};
  const query: BrowsePiecesQuery = parseBrowsePiecesSearchParams(sp);

  const submissionsRaw = await db.submission.findMany({
    where: {
      requestsOpen: true,
      ...(userId ? { writerId: { not: userId } } : {}),
    },
    select: {
      id: true,
      title: true,
      genre: true,
      subgenre: true,
      wordCount: true,
      stage: true,
      writerFocusAreas: true,
      focusOther: true,
      writerBrowseNote: true,
      requestsOpen: true,
      writerId: true,
      createdAt: true,
      writer: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  const subIds = submissionsRaw.map((s) => s.id);

  const volunteerCounts =
    subIds.length > 0
      ? await db.readerVolunteerRequest.groupBy({
          by: ["submissionId"],
          where: { submissionId: { in: subIds } },
          _count: { _all: true },
        })
      : [];

  const volunteerCountMap = new Map<string, number>(
    volunteerCounts.map((r) => [r.submissionId, r._count._all]),
  );

  const submissionsFiltered = submissionsRaw.filter((s) =>
    submissionMatchesBrowseFilters(s, query),
  );

  const submissions = sortBrowseSubmissions(submissionsFiltered, query.sort, volunteerCountMap);

  const slotUsageMap = await getSubmissionSlotUsageMap(subIds);

  let readerHasSample = false;
  const assignmentBySub = new Map<string, string>();
  const volunteerBySub = new Map<string, "PENDING" | "ACCEPTED" | "DECLINED">();

  if (userId && subIds.length > 0) {
    const [readerUser, assignments, volunteers] = await Promise.all([
      db.user.findUnique({
        where: { id: userId },
        include: { readerProfile: { include: { feedbackSamples: { take: 1 } } } },
      }),
      db.critiqueAssignment.findMany({
        where: { readerId: userId, submissionId: { in: subIds } },
        select: { submissionId: true, id: true },
      }),
      db.readerVolunteerRequest.findMany({
        where: { readerId: userId, submissionId: { in: subIds } },
        select: { submissionId: true, status: true },
      }),
    ]);

    readerHasSample = Boolean(readerUser?.readerProfile?.feedbackSamples?.length);
    for (const a of assignments) {
      assignmentBySub.set(a.submissionId, a.id);
    }
    for (const v of volunteers) {
      volunteerBySub.set(v.submissionId, v.status);
    }
  }

  const callbackUrl = "/pieces";
  const totalOpen = submissionsRaw.length;
  const narrowedList = submissionsFiltered.length !== submissionsRaw.length;
  const filterActive = narrowedList || hasActiveBrowseFilters(query);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-col gap-2">
        <Link className="text-sm font-medium text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]" href="/">
          ← Home
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Browse Pieces</h1>
        <p className="text-sm leading-6 text-[color:var(--ink-muted)]">
          Read what writers are looking for. Full text stays private until a writer accepts your request.
        </p>
        <div
          className="mt-3 rounded-xl border border-zinc-200/90 bg-white px-4 py-3 text-sm leading-relaxed text-zinc-700 shadow-sm"
          role="note"
        >
          <ul className="list-inside list-disc space-y-1 marker:text-zinc-400">
            <li>You can request up to 5 pieces at a time.</li>
            <li>Writers accept up to 3 readers per piece.</li>
          </ul>
        </div>
        {userId ? (
          <p className="text-sm leading-6 text-[color:var(--ink-muted)]">
            <span className="font-medium text-[color:var(--ink)]">Your own pieces</span> aren’t listed here while
            you’re signed in—only other writers’ open submissions. Sign out (guest) to see how your listing
            appears to readers.
          </p>
        ) : null}
      </div>

      <div className="mt-8 grid gap-6 md:mt-10 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)] lg:items-start lg:gap-10">
        <PiecesFilterSidebar query={query} />

        <div className="min-w-0">
          <p className="text-xs text-[color:var(--ink-muted)]">
            {filterActive ? (
              <>
                Showing <span className="font-semibold text-[color:var(--ink)]">{submissions.length}</span> of{" "}
                <span className="font-semibold text-[color:var(--ink)]">{totalOpen}</span> open{" "}
                {totalOpen === 1 ? "piece" : "pieces"}
              </>
            ) : (
              <>
                <span className="font-semibold text-[color:var(--ink)]">{submissions.length}</span> open{" "}
                {submissions.length === 1 ? "piece" : "pieces"}
              </>
            )}
          </p>

          <div className="mt-6 space-y-6">
            {submissions.map((s) => {
              const genreLine = s.subgenre.trim() ? `${s.genre}, ${s.subgenre}` : s.genre;
              const focusLine = formatFocusAreasLine(s.writerFocusAreas, s.focusOther);
              const writerNote = formatWriterBrowseNoteLine(s.stage, s.writerBrowseNote);

              let buttonState: ComponentProps<typeof RequestToReadButton>["state"] = "signed_out";
              let assignmentId: string | null = null;

              if (!userId) {
                buttonState = "signed_out";
              } else if (!s.requestsOpen) {
                buttonState = "closed";
              } else if (assignmentBySub.has(s.id)) {
                buttonState = "connected";
                assignmentId = assignmentBySub.get(s.id) ?? null;
              } else if (volunteerBySub.get(s.id) === "PENDING") {
                buttonState = "pending";
              } else if (!readerHasSample) {
                buttonState = "need_sample";
              } else if (
                !submissionHasRoomForInviteOrVolunteer(
                  slotUsageMap.get(s.id) ?? { activeAssignments: 0, pendingWriterInvites: 0 },
                )
              ) {
                buttonState = "piece_full";
              } else {
                buttonState = "ready";
              }

              const genreMeta = genreLine.trim() || "—";
              const lengthMeta = formatWordCountLine(s.wordCount);

              return (
                <article
                  key={s.id}
                  className="w-full max-w-full rounded-xl border border-zinc-200/90 bg-white p-4 shadow-sm backdrop-blur md:rounded-2xl md:p-6"
                >
                  <div className="flex flex-col gap-3 md:hidden">
                    <h2 className="text-xl font-semibold leading-snug tracking-tight text-[color:var(--ink)]">
                      {s.title}
                    </h2>
                    <p className="text-sm leading-snug text-[color:var(--ink-muted)]">
                      <span className="break-words">{genreMeta}</span>
                      <span className="text-zinc-400"> · </span>
                      <span>{lengthMeta}</span>
                    </p>
                    <p className="line-clamp-4 text-sm leading-relaxed text-[color:var(--ink-muted)]">
                      {writerNote}
                    </p>
                  </div>

                  <div className="hidden md:block">
                    <h2 className="text-lg font-semibold leading-snug text-[color:var(--ink)]">{s.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-[color:var(--ink-muted)]">
                      <span className="font-medium text-[color:var(--ink)]">Writer:</span> {s.writer.name}
                    </p>
                    <div className="mt-4 space-y-3 text-sm leading-relaxed">
                      <p className="break-words">
                        <span className="font-medium text-[color:var(--ink)]">Genre: </span>
                        <span className="text-[color:var(--ink-muted)]">{genreLine || "—"}</span>
                      </p>
                      <p>
                        <span className="font-medium text-[color:var(--ink)]">Length: </span>
                        <span className="text-[color:var(--ink-muted)]">{lengthMeta}</span>
                      </p>
                      <p className="break-words">
                        <span className="font-medium text-[color:var(--ink)]">Looking for feedback on: </span>
                        <span className="text-[color:var(--ink-muted)]">{focusLine}</span>
                      </p>
                      <p className="break-words">
                        <span className="font-medium text-[color:var(--ink)]">Writer note: </span>
                        <span className="text-[color:var(--ink-muted)]">{writerNote}</span>
                      </p>
                      <p>
                        <span className="font-medium text-[color:var(--ink)]">Requests open: </span>
                        <span className="text-[color:var(--ink-muted)]">{s.requestsOpen ? "Yes" : "No"}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 w-full min-w-0 md:mt-5">
                    <RequestToReadButton
                      submissionId={s.id}
                      state={buttonState}
                      signInCallbackUrl={callbackUrl}
                      connectedAssignmentId={assignmentId}
                    />
                  </div>
                </article>
              );
            })}
          </div>

          {submissions.length === 0 ? (
            <p className="mt-10 rounded-2xl border border-dashed border-zinc-300 p-8 text-sm text-[color:var(--ink-muted)]">
              {totalOpen === 0
                ? "No pieces are open for requests right now. Check back later, or open your own piece to writers from your submission page."
                : "No pieces match these filters. Try clearing filters or broadening genre, length, or focus."}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
