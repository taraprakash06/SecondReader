"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function submitCritiqueFeedback(assignmentId: string, formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Sign in.");

  const assignment = await db.critiqueAssignment.findUnique({
    where: { id: assignmentId },
    include: { submission: true },
  });
  if (!assignment || assignment.readerId !== userId) throw new Error("Not allowed.");

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

  revalidatePath(`/critiques/${assignmentId}`);
  revalidatePath(`/writer/submissions/${assignment.submissionId}`);
}

export async function unlockFullPieceForReader(assignmentId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Sign in.");

  const assignment = await db.critiqueAssignment.findUnique({
    where: { id: assignmentId },
    include: { submission: true, feedback: true },
  });
  if (!assignment) throw new Error("Not found.");
  if (assignment.submission.writerId !== userId) throw new Error("Only the writer can share more pages.");
  if (!assignment.feedback) throw new Error("Wait for the reader’s feedback first.");
  if (!assignment.submission.fullText.trim()) {
    throw new Error("Add more pages to this submission from your writer dashboard when that’s available.");
  }

  await db.critiqueAssignment.update({
    where: { id: assignmentId },
    data: { readerSeesFullPiece: true },
  });

  revalidatePath(`/critiques/${assignmentId}`);
  revalidatePath(`/writer/submissions/${assignment.submissionId}`);
}
