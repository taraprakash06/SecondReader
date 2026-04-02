"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const bioSchema = z.string().max(4000);
const readerFieldSchema = z.string().max(2000);

export async function updateProfileBioAction(formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/auth/sign-in");

  const bio = bioSchema.parse(String(formData.get("bio") ?? ""));

  await db.user.update({
    where: { id: userId },
    data: { bio },
  });

  revalidatePath("/profile");
}

export async function updateReaderPublicBlurbsAction(formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/auth/sign-in");

  const genres = readerFieldSchema.parse(String(formData.get("genres") ?? "").trim());
  const caresAbout = readerFieldSchema.parse(String(formData.get("caresAbout") ?? "").trim());
  const feedbackPhilosophy = readerFieldSchema.parse(
    String(formData.get("feedbackPhilosophy") ?? "").trim(),
  );

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) redirect("/auth/sign-in");

  const canEdit =
    user.role === "READER" ||
    user.role === "BOTH" ||
    (await db.readerProfile.findUnique({ where: { userId } })) != null;
  if (!canEdit) {
    throw new Error("Complete reader onboarding first to edit these fields.");
  }

  await db.readerProfile.upsert({
    where: { userId },
    create: {
      userId,
      genres,
      caresAbout,
      feedbackPhilosophy,
    },
    update: { genres, caresAbout, feedbackPhilosophy },
  });

  revalidatePath("/profile");
  revalidatePath("/readers");
  revalidatePath(`/readers/${userId}`);
}
