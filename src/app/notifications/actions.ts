"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  MAX_ACTIVE_CRITIQUES_PER_READER,
  countReaderActiveCritiques,
  getSubmissionSlotUsage,
  submissionHasRoomForNewAssignment,
} from "@/lib/critiqueLimits";

export async function acceptReaderInvite(inviteId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Sign in.");

  const invite = await db.readerInvite.findFirst({
    where: { id: inviteId, readerId: userId, status: "PENDING" },
  });
  if (!invite) throw new Error("Invite not found.");

  const [readerActive, submissionSlots] = await Promise.all([
    countReaderActiveCritiques(userId),
    getSubmissionSlotUsage(invite.submissionId),
  ]);
  if (readerActive >= MAX_ACTIVE_CRITIQUES_PER_READER) {
    throw new Error(
      `You already have ${MAX_ACTIVE_CRITIQUES_PER_READER} active critiques. Finish or step back from one before accepting another.`,
    );
  }
  if (!submissionHasRoomForNewAssignment(submissionSlots)) {
    throw new Error("This piece already has the maximum number of active readers.");
  }

  const assignment = await db.$transaction(async (tx) => {
    await tx.readerInvite.update({
      where: { id: inviteId },
      data: { status: "ACCEPTED" },
    });
    const a = await tx.critiqueAssignment.upsert({
      where: {
        submissionId_readerId: {
          submissionId: invite.submissionId,
          readerId: invite.readerId,
        },
      },
      create: {
        submissionId: invite.submissionId,
        readerId: invite.readerId,
        status: "ACTIVE",
      },
      update: {},
    });
    await tx.notification.updateMany({
      where: { inviteId },
      data: { read: true },
    });
    return a;
  });

  revalidatePath("/notifications");
  revalidatePath("/pieces");
  revalidatePath(`/critiques/${assignment.id}`);
  revalidatePath(`/writer/submissions/${invite.submissionId}`);
  redirect(`/critiques/${assignment.id}`);
}

export async function declineReaderInvite(inviteId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Sign in.");

  const invite = await db.readerInvite.findFirst({
    where: { id: inviteId, readerId: userId, status: "PENDING" },
  });
  if (!invite) throw new Error("Invite not found.");

  await db.$transaction([
    db.readerInvite.update({
      where: { id: inviteId },
      data: { status: "DECLINED" },
    }),
    db.notification.updateMany({
      where: { inviteId },
      data: { read: true },
    }),
  ]);

  revalidatePath("/notifications");
  revalidatePath("/pieces");
}
