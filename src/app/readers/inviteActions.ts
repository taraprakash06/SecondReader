"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatReaderInviteNotificationBody } from "@/lib/submissionInviteSummary";
import {
  MAX_READER_SLOTS_PER_SUBMISSION,
  getSubmissionSlotUsage,
  submissionHasRoomForInviteOrVolunteer,
} from "@/lib/critiqueLimits";

export async function createReaderInvite(readerUserId: string, submissionId: string) {
  const session = await auth();
  const writerId = session?.user?.id;
  if (!writerId) throw new Error("Sign in to invite a reader.");

  if (readerUserId === writerId) throw new Error("You can’t invite yourself.");

  const submission = await db.submission.findFirst({
    where: { id: submissionId, writerId },
  });
  if (!submission) throw new Error("Submission not found.");

  const reader = await db.user.findUnique({
    where: { id: readerUserId },
    include: {
      readerProfile: {
        include: { feedbackSamples: { take: 1 } },
      },
    },
  });
  const samples = reader?.readerProfile?.feedbackSamples ?? [];
  if (!reader?.readerProfile || samples.length === 0) {
    throw new Error("That person isn’t available as a reader yet.");
  }

  const existing = await db.readerInvite.findUnique({
    where: {
      submissionId_readerId: { submissionId, readerId: readerUserId },
    },
  });

  const writer = await db.user.findUniqueOrThrow({ where: { id: writerId } });
  const body = formatReaderInviteNotificationBody(writer.name, submission);

  if (existing) {
    if (existing.status === "PENDING") {
      throw new Error("You already have a pending invite for this piece.");
    }
    if (existing.status === "ACCEPTED") {
      throw new Error("This reader is already connected on this piece.");
    }
    if (existing.status === "DECLINED") {
      const slotsForResend = await getSubmissionSlotUsage(submissionId);
      if (!submissionHasRoomForInviteOrVolunteer(slotsForResend)) {
        throw new Error(
          `This piece is at the limit of ${MAX_READER_SLOTS_PER_SUBMISSION} readers/invites (active + pending).`,
        );
      }
      await db.notification.deleteMany({ where: { inviteId: existing.id } });
      await db.$transaction([
        db.readerInvite.update({
          where: { id: existing.id },
          data: { status: "PENDING", writerId },
        }),
        db.notification.create({
          data: {
            userId: readerUserId,
            type: "READER_INVITE",
            title: "New reading invite",
            body,
            inviteId: existing.id,
          },
        }),
      ]);
      revalidatePath("/notifications");
      revalidatePath("/pieces");
      revalidatePath(`/readers/${readerUserId}`);
      return { ok: true as const };
    }
  }

  const slots = await getSubmissionSlotUsage(submissionId);
  if (!submissionHasRoomForInviteOrVolunteer(slots)) {
    throw new Error(
      `This piece is at the limit of ${MAX_READER_SLOTS_PER_SUBMISSION} readers/invites (active + pending).`,
    );
  }

  await db.readerInvite.create({
    data: {
      submissionId,
      readerId: readerUserId,
      writerId,
      status: "PENDING",
      notification: {
        create: {
          userId: readerUserId,
          type: "READER_INVITE",
          title: "New reading invite",
          body,
        },
      },
    },
  });

  revalidatePath("/notifications");
  revalidatePath("/pieces");
  revalidatePath(`/readers/${readerUserId}`);
  return { ok: true as const };
}
