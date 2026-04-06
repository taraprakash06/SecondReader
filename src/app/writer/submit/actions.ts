"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DraftStage, FeedbackTonePreference } from "@prisma/client";
import { auth } from "@/lib/auth";
import { parseWriterFocusAreasJson } from "@/lib/writerFocusAreas";
import { writerAreaToLegacyFocus } from "@/lib/writerFocusAreasServer";
import { sanitizeFullManuscript, splitIntoInitialPagesAndFullText } from "@/lib/manuscriptSplit";

export async function createSubmission(formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Please sign in.");

  const writer = await db.user.findUnique({ where: { id: userId } });
  if (!writer) throw new Error("User not found.");

  const title = String(formData.get("title") ?? "").trim();
  const genre = String(formData.get("genre") ?? "").trim();
  const subgenre = String(formData.get("subgenre") ?? "").trim();
  const wordCount = Number(formData.get("wordCount") ?? 0);
  const stage = String(formData.get("stage") ?? "").trim() as DraftStage;
  const focusAreasJson = String(formData.get("writerFocusAreasJson") ?? "[]");
  const focusAreas = parseWriterFocusAreasJson(focusAreasJson);
  const focusOtherRaw = String(formData.get("focusOther") ?? "").trim();
  const notHelpful = String(formData.get("notHelpful") ?? "").trim();
  const writerBrowseNote = String(formData.get("writerBrowseNote") ?? "").trim().slice(0, 2000);
  const manuscriptRaw = String(formData.get("fullManuscript") ?? "");

  if (!title || !genre) throw new Error("Missing title/genre.");
  if (!Number.isFinite(wordCount) || wordCount <= 0) throw new Error("Invalid word count.");
  if (!Object.values(DraftStage).includes(stage)) throw new Error("Invalid stage.");
  const sanitizedFull = sanitizeFullManuscript(manuscriptRaw);
  const { initialPages, fullText } = splitIntoInitialPagesAndFullText(sanitizedFull);
  if (focusAreas.includes("OTHER") && focusOtherRaw.length < 3) {
    throw new Error('Please add a short explanation when you select "Other".');
  }
  const focusOther = focusAreas.includes("OTHER") ? focusOtherRaw : "";
  const focus1 = writerAreaToLegacyFocus(focusAreas[0]);
  const focus2 = focusAreas.length > 1 ? writerAreaToLegacyFocus(focusAreas[1]) : null;

  const submission = await db.submission.create({
    data: {
      writerId: writer.id,
      title,
      genre,
      subgenre,
      wordCount,
      stage,
      writerFocusAreas: JSON.stringify(focusAreas),
      focus1,
      ...(focus2 != null ? { focus2 } : {}),
      focusOther,
      tonePref: FeedbackTonePreference.BALANCED,
      notHelpful,
      writerBrowseNote,
      initialPages,
      fullText,
    },
  });

  redirect(`/writer/submissions/${submission.id}?created=1`);
}
