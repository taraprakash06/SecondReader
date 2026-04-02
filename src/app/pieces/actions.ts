"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  MAX_ACTIVE_CRITIQUES_PER_READER,
  MAX_PENDING_VOLUNTEER_REQUESTS_PER_READER,
  MAX_READER_SLOTS_PER_SUBMISSION,
  countReaderActiveCritiques,
  countReaderPendingVolunteerRequests,
  getSubmissionSlotUsage,
  submissionHasRoomForInviteOrVolunteer,
  submissionHasRoomForNewAssignment,
} from "@/lib/critiqueLimits";

export async function createVolunteerReadRequest(submissionId: string) {
  const session = await auth();
  const readerId = session?.user?.id;
  if (!readerId) throw new Error("Sign in to request a read.");

  const reader = await db.user.findUnique({
    where: { id: readerId },
    include: {
      readerProfile: { include: { feedbackSamples: { take: 1 } } },
    },
  });
  if (!reader?.readerProfile || reader.readerProfile.feedbackSamples.length === 0) {
    throw new Error("Complete a public feedback sample first (Reader onboarding).");
  }

  const submission = await db.submission.findUnique({
    where: { id: submissionId },
    include: {
      assignments: { where: { readerId } },
      volunteerRequests: { where: { readerId } },
    },
  });
  if (!submission) throw new Error("Piece not found.");
  if (!submission.requestsOpen) throw new Error("This writer is not taking requests right now.");
  if (submission.writerId === readerId) throw new Error("You can’t request your own piece.");

  const [readerActive, pendingVolunteers, pieceSlots] = await Promise.all([
    countReaderActiveCritiques(readerId),
    countReaderPendingVolunteerRequests(readerId),
    getSubmissionSlotUsage(submissionId),
  ]);
  if (readerActive >= MAX_ACTIVE_CRITIQUES_PER_READER) {
    throw new Error(
      `You’re at the limit of ${MAX_ACTIVE_CRITIQUES_PER_READER} active critiques. Finish one before requesting more pieces.`,
    );
  }
  if (!submissionHasRoomForInviteOrVolunteer(pieceSlots)) {
    throw new Error("This piece already has the maximum number of readers/invites.");
  }

  if (submission.assignments.length > 0) {
    throw new Error("You’re already connected on this piece.");
  }

  const existing = submission.volunteerRequests[0];
  if (existing?.status === "PENDING") {
    throw new Error("You already have a pending request for this piece.");
  }
  if (existing?.status === "ACCEPTED") {
    throw new Error("This request was already accepted.");
  }

  if (pendingVolunteers >= MAX_PENDING_VOLUNTEER_REQUESTS_PER_READER) {
    throw new Error(
      `You can have at most ${MAX_PENDING_VOLUNTEER_REQUESTS_PER_READER} open requests at a time. Wait for a response or focus on your current requests first.`,
    );
  }

  const readerName = reader.name;
  const title = submission.title;

  if (existing?.status === "DECLINED") {
    await db.notification.deleteMany({ where: { volunteerRequestId: existing.id } });
    await db.$transaction([
      db.readerVolunteerRequest.update({
        where: { id: existing.id },
        data: { status: "PENDING", writerId: submission.writerId },
      }),
      db.notification.create({
        data: {
          userId: submission.writerId,
          type: "READER_VOLUNTEER",
          title: "Reader volunteered",
          body: `${readerName} requested to read “${title}”.`,
          volunteerRequestId: existing.id,
        },
      }),
    ]);
    revalidatePath("/pieces");
    revalidatePath("/notifications");
    revalidatePath(`/writer/submissions/${submissionId}`);
    return { ok: true as const };
  }

  await db.readerVolunteerRequest.create({
    data: {
      submissionId,
      readerId,
      writerId: submission.writerId,
      status: "PENDING",
      notification: {
        create: {
          userId: submission.writerId,
          type: "READER_VOLUNTEER",
          title: "Reader volunteered",
          body: `${readerName} requested to read “${title}”.`,
        },
      },
    },
  });

  revalidatePath("/pieces");
  revalidatePath("/notifications");
  revalidatePath(`/writer/submissions/${submissionId}`);
  return { ok: true as const };
}

export async function acceptVolunteerReadRequest(requestId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Sign in.");

  const reqRow = await db.readerVolunteerRequest.findFirst({
    where: { id: requestId, writerId: userId, status: "PENDING" },
    include: { submission: true, reader: true },
  });
  if (!reqRow) throw new Error("Request not found.");

  const [readerActive, submissionSlots] = await Promise.all([
    countReaderActiveCritiques(reqRow.readerId),
    getSubmissionSlotUsage(reqRow.submissionId),
  ]);
  if (readerActive >= MAX_ACTIVE_CRITIQUES_PER_READER) {
    throw new Error(
      `This reader already has ${MAX_ACTIVE_CRITIQUES_PER_READER} active critiques and can’t take another right now.`,
    );
  }
  if (!submissionHasRoomForNewAssignment(submissionSlots)) {
    throw new Error(
      `This piece already has ${MAX_READER_SLOTS_PER_SUBMISSION} active readers. Decline this request or wait until a critique wraps up.`,
    );
  }

  const assignment = await db.$transaction(async (tx) => {
    await tx.readerVolunteerRequest.update({
      where: { id: requestId },
      data: { status: "ACCEPTED" },
    });
    const a = await tx.critiqueAssignment.upsert({
      where: {
        submissionId_readerId: {
          submissionId: reqRow.submissionId,
          readerId: reqRow.readerId,
        },
      },
      create: {
        submissionId: reqRow.submissionId,
        readerId: reqRow.readerId,
        status: "ACTIVE",
      },
      update: {},
    });
    await tx.notification.updateMany({
      where: { volunteerRequestId: requestId },
      data: { read: true },
    });
    const writer = await tx.user.findUniqueOrThrow({ where: { id: userId } });
    await tx.notification.create({
      data: {
        userId: reqRow.readerId,
        type: "VOLUNTEER_ACCEPTED",
        title: "Request accepted",
        body: `${writer.name} accepted your request to read “${reqRow.submission.title}”. You can open the piece and leave feedback when you’re ready.`,
        relatedAssignmentId: a.id,
      },
    });
    return a;
  });

  revalidatePath("/notifications");
  revalidatePath("/pieces");
  revalidatePath(`/critiques/${assignment.id}`);
  revalidatePath(`/writer/submissions/${reqRow.submissionId}`);
}

export async function declineVolunteerReadRequest(requestId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Sign in.");

  const reqRow = await db.readerVolunteerRequest.findFirst({
    where: { id: requestId, writerId: userId, status: "PENDING" },
  });
  if (!reqRow) throw new Error("Request not found.");

  await db.$transaction([
    db.readerVolunteerRequest.update({
      where: { id: requestId },
      data: { status: "DECLINED" },
    }),
    db.notification.updateMany({
      where: { volunteerRequestId: requestId },
      data: { read: true },
    }),
  ]);

  revalidatePath("/notifications");
  revalidatePath("/pieces");
  revalidatePath(`/writer/submissions/${reqRow.submissionId}`);
}

export async function setSubmissionRequestsOpen(submissionId: string, requestsOpen: boolean) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Sign in.");

  const sub = await db.submission.findFirst({
    where: { id: submissionId, writerId: userId },
  });
  if (!sub) throw new Error("Submission not found.");

  await db.submission.update({
    where: { id: submissionId },
    data: { requestsOpen },
  });

  revalidatePath("/profile");
  revalidatePath("/pieces");
  revalidatePath(`/writer/submissions/${submissionId}`);
}
