"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const schema = z.object({
  name: z.string().min(1).max(80),
  writeGenres: z.array(z.string()).min(1),
  readGenres: z.array(z.string()).min(1),
});

export async function completeOnboardingAction(formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/auth/sign-in");

  const name = String(formData.get("name") ?? "").trim();

  const writeGenres = formData.getAll("writeGenres").map((v) => String(v));
  const readGenres = formData.getAll("readGenres").map((v) => String(v));

  const parsed = schema.safeParse({ name, writeGenres, readGenres });
  if (!parsed.success) {
    return { ok: false as const, error: "Please pick at least 1 genre in each section." };
  }

  const write = parsed.data.writeGenres.join(",");
  const read = parsed.data.readGenres.join(",");

  await db.user.update({
    where: { id: userId },
    data: {
      name: parsed.data.name,
      role: "BOTH",
      writeGenres: write,
      readGenres: read,
      onboarded: true,
      readerProfile: {
        upsert: {
          create: { genres: read },
          update: { genres: read },
        },
      },
    },
  });

  redirect("/");
}

