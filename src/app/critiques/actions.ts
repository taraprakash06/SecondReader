"use server";

import { revalidatePath } from "next/cache";
import { CritiqueStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

/** After the reader saves feedback, clear the “open piece & leave feedback” notification. */
async function markVolunteerAcceptedNotificationRead(readerId: string, assignmentId: string) {
  await db.notification.updateMany({
    where: {
      userId: readerId,
      type: "VOLUNTEER_ACCEPTED",
      relatedAssignmentId: assignmentId,
    },
    data: { read: true },
  });
}

export async function submitCritiqueFeedback(assignmentId: string, formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Sign in.");

  const assignment = await db.critiqueAssignment.findUnique({
    where: { id: assignmentId },
    include: { submission: true },
  });
  if (!assignment || assignment.readerId !== userId) throw new Error("Not allowed.");
  if (assignment.status === CritiqueStatus.STOPPED) {
    throw new Error("This critique was stopped and can’t be edited.");
  }
  if (assignment.status === CritiqueStatus.COMPLETED) {
    throw new Error("This critique is complete and can’t be edited.");
  }

  const strengths = String(formData.get("strengths") ?? "").trim();
  const improvements = String(formData.get("improvements") ?? "").trim();
  const keyTakeaways = String(formData.get("keyTakeaways") ?? "").trim();

  const commentsJson = String(formData.get("commentsJson") ?? "").trim();
  type Parsed = { quote: string; message: string };
  let parsedComments: Parsed[] = [];
  if (commentsJson) {
    try {
      const raw = JSON.parse(commentsJson) as unknown;
      if (Array.isArray(raw)) {
        parsedComments = raw
          .filter(
            (c): c is Parsed =>
              c !== null &&
              typeof c === "object" &&
              typeof (c as Parsed).quote === "string" &&
              typeof (c as Parsed).message === "string",
          )
          .map((c) => ({
            quote: c.quote.trim(),
            message: c.message.trim(),
          }))
          .filter((c) => c.quote.length > 0 && c.message.length > 0);
      }
    } catch {
      // ignore invalid JSON
    }
  }

  if (!strengths && !improvements && !keyTakeaways && parsedComments.length === 0) {
    throw new Error("Add at least one margin note or fill in the summary fields.");
  }

  const feedback = await db.critiqueFeedback.upsert({
    where: { assignmentId: assignment.id },
    create: {
      assignmentId: assignment.id,
      strengths,
      improvements,
      keyTakeaways,
    },
    update: { strengths, improvements, keyTakeaways },
  });

  await db.inlineComment.deleteMany({ where: { feedbackId: feedback.id } });
  if (parsedComments.length > 0) {
    await db.inlineComment.createMany({
      data: parsedComments.map((c) => ({
        feedbackId: feedback.id,
        quote: c.quote,
        message: c.message,
      })),
    });
  }

  await markVolunteerAcceptedNotificationRead(userId, assignment.id);

  revalidatePath(`/critiques/${assignmentId}`);
  revalidatePath(`/writer/submissions/${assignment.submissionId}`);
  revalidatePath("/notifications");
}

export async function markCritiqueFeedbackComplete(assignmentId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Sign in.");

  const assignment = await db.critiqueAssignment.findUnique({
    where: { id: assignmentId },
    include: {
      submission: true,
      reader: true,
      feedback: { include: { comments: true } },
    },
  });
  if (!assignment || assignment.readerId !== userId) throw new Error("Not allowed.");

  if (assignment.status === CritiqueStatus.STOPPED) {
    throw new Error("This critique was stopped by the writer.");
  }
  if (assignment.status === CritiqueStatus.COMPLETED) {
    revalidatePath(`/critiques/${assignmentId}`);
    return;
  }

  if (!assignment.feedback) {
    throw new Error("Save your feedback first (use Save feedback).");
  }

  const f = assignment.feedback;
  const hasSummary = !!(f.strengths.trim() || f.improvements.trim() || f.keyTakeaways.trim());
  const hasMargins = f.comments.length > 0;
  if (!hasSummary && !hasMargins) {
    throw new Error("Add at least one margin note or summary field before marking complete.");
  }

  if (!assignment.firstPassComplete) {
    await db.critiqueAssignment.update({
      where: { id: assignmentId },
      data: { firstPassComplete: true, firstPassCompletedAt: new Date() },
    });

    await db.notification.create({
      data: {
        userId: assignment.submission.writerId,
        type: "CRITIQUE_FIRST_PASS_COMPLETE",
        title: `${assignment.reader.name} finished feedback on your first pages`,
        body: "Read their notes, then decide whether to continue and share the full piece.",
        relatedAssignmentId: assignment.id,
      },
    });
  } else {
    if (!assignment.readerSeesFullPiece) {
      throw new Error("Wait for the writer to unlock the full piece before marking the full critique complete.");
    }

    await db.critiqueAssignment.update({
      where: { id: assignmentId },
      data: { status: CritiqueStatus.COMPLETED },
    });

    await db.notification.create({
      data: {
        userId: assignment.submission.writerId,
        type: "CRITIQUE_FULL_PIECE_COMPLETE",
        title: `${assignment.reader.name} finished the full critique on “${assignment.submission.title}”`,
        body: "Open your critique to read their complete margin notes and summary.",
        relatedAssignmentId: assignment.id,
      },
    });
  }

  await markVolunteerAcceptedNotificationRead(userId, assignment.id);

  revalidatePath(`/critiques/${assignmentId}`);
  revalidatePath(`/writer/submissions/${assignment.submissionId}`);
  revalidatePath("/notifications");
}

export async function unlockFullPieceForReader(assignmentId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Sign in.");

  const assignment = await db.critiqueAssignment.findUnique({
    where: { id: assignmentId },
    include: { submission: true, feedback: true, reader: true },
  });
  if (!assignment) throw new Error("Not found.");
  if (assignment.submission.writerId !== userId) throw new Error("Only the writer can share more pages.");
  if (!assignment.feedback) throw new Error("Wait for the reader’s feedback first.");
  if (!assignment.firstPassComplete) {
    throw new Error("Wait for the reader to mark their first-pass feedback complete.");
  }
  if (!assignment.submission.fullText.trim()) {
    throw new Error("Add more pages to this submission from your writer dashboard when that’s available.");
  }

  await db.$transaction(async (tx) => {
    await tx.critiqueAssignment.update({
      where: { id: assignmentId },
      data: {
        readerSeesFullPiece: true,
        fullPieceUnlockedAt: new Date(),
        writerContinues: true,
        writerDecidedAt: assignment.writerDecidedAt ?? new Date(),
      },
    });

    await tx.notification.create({
      data: {
        userId: assignment.readerId,
        type: "FULL_PIECE_UNLOCKED",
        title: `Thanks for your feedback on the first pages of “${assignment.submission.title}”`,
        body: "The writer found your feedback helpful and has shared more of the piece with you to receive your feedback.",
        relatedAssignmentId: assignment.id,
      },
    });
  });

  revalidatePath(`/critiques/${assignmentId}`);
  revalidatePath(`/writer/submissions/${assignment.submissionId}`);
  revalidatePath("/notifications");
}

export async function stopCritiqueWithReader(assignmentId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Sign in.");

  const assignment = await db.critiqueAssignment.findUnique({
    where: { id: assignmentId },
    include: { submission: true, reader: true },
  });
  if (!assignment) throw new Error("Not found.");
  if (assignment.submission.writerId !== userId) throw new Error("Only the writer can stop a critique.");
  if (!assignment.firstPassComplete) {
    throw new Error("Wait for the reader to finish their first-pass feedback first.");
  }
  if (assignment.status === CritiqueStatus.COMPLETED) {
    throw new Error("This critique is already completed.");
  }

  await db.$transaction(async (tx) => {
    await tx.critiqueAssignment.update({
      where: { id: assignmentId },
      data: { status: CritiqueStatus.STOPPED, writerContinues: false, writerDecidedAt: new Date() },
    });
    await tx.notification.create({
      data: {
        userId: assignment.readerId,
        type: "CRITIQUE_STOPPED",
        title: `Thanks for your feedback on “${assignment.submission.title}”`,
        body: `The writer has decided to continue revisions from here on their own, but they appreciated your notes.`,
        relatedAssignmentId: assignment.id,
      },
    });
  });

  revalidatePath(`/critiques/${assignmentId}`);
  revalidatePath(`/writer/submissions/${assignment.submissionId}`);
  revalidatePath("/notifications");
}
