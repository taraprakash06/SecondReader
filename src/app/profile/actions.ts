"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const bioSchema = z.string().max(4000);

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
