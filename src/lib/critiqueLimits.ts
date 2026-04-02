import { db } from "@/lib/db";

/**
 * Active readers + pending writer→reader invites on one piece.
 * Each counts toward the same cap so “3 invites” and “3 concurrent readers” stay aligned.
 */
export const MAX_READER_SLOTS_PER_SUBMISSION = 3;

/** How many critiques a reader works at once (max of the 2–3 range). */
export const MAX_ACTIVE_CRITIQUES_PER_READER = 3;

/** Pending “Request to Read” across all pieces for one reader. */
export const MAX_PENDING_VOLUNTEER_REQUESTS_PER_READER = 5;

export type SubmissionSlotUsage = {
  activeAssignments: number;
  pendingWriterInvites: number;
};

export async function getSubmissionSlotUsage(submissionId: string): Promise<SubmissionSlotUsage> {
  const [activeAssignments, pendingWriterInvites] = await Promise.all([
    db.critiqueAssignment.count({
      where: { submissionId, status: "ACTIVE" },
    }),
    db.readerInvite.count({
      where: { submissionId, status: "PENDING" },
    }),
  ]);
  return { activeAssignments, pendingWriterInvites };
}

export function submissionSlotsUsed(u: SubmissionSlotUsage): number {
  return u.activeAssignments + u.pendingWriterInvites;
}

export function submissionHasRoomForInviteOrVolunteer(u: SubmissionSlotUsage): boolean {
  return submissionSlotsUsed(u) < MAX_READER_SLOTS_PER_SUBMISSION;
}

export function submissionHasRoomForNewAssignment(u: SubmissionSlotUsage): boolean {
  return u.activeAssignments < MAX_READER_SLOTS_PER_SUBMISSION;
}

export async function countReaderActiveCritiques(readerId: string): Promise<number> {
  return db.critiqueAssignment.count({
    where: { readerId, status: "ACTIVE" },
  });
}

export async function countReaderPendingVolunteerRequests(readerId: string): Promise<number> {
  return db.readerVolunteerRequest.count({
    where: { readerId, status: "PENDING" },
  });
}

export async function getSubmissionSlotUsageMap(
  submissionIds: string[],
): Promise<Map<string, SubmissionSlotUsage>> {
  const map = new Map<string, SubmissionSlotUsage>();
  if (submissionIds.length === 0) return map;

  const unique = [...new Set(submissionIds)];

  const [activeRows, pendingRows] = await Promise.all([
    db.critiqueAssignment.groupBy({
      by: ["submissionId"],
      where: { submissionId: { in: unique }, status: "ACTIVE" },
      _count: { _all: true },
    }),
    db.readerInvite.groupBy({
      by: ["submissionId"],
      where: { submissionId: { in: unique }, status: "PENDING" },
      _count: { _all: true },
    }),
  ]);

  for (const id of unique) {
    map.set(id, { activeAssignments: 0, pendingWriterInvites: 0 });
  }
  for (const r of activeRows) {
    const cur = map.get(r.submissionId);
    if (cur) cur.activeAssignments = r._count._all;
  }
  for (const r of pendingRows) {
    const cur = map.get(r.submissionId);
    if (cur) cur.pendingWriterInvites = r._count._all;
  }
  return map;
}
