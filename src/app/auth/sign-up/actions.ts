"use server";

import { redirect } from "next/navigation";
import { hash } from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { safeInternalCallbackUrl } from "@/lib/safeRedirect";

const schema = z.object({
  name: z.string().min(1).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(200),
});

export async function signUpAction(formData: FormData) {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false as const, error: "Please check the form and try again." };
  }

  const { name, email, password } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return { ok: false as const, error: "That email is already in use." };

  const passwordHash = await hash(password, 12);
  await db.user.create({
    data: { name, email, passwordHash, role: "WRITER" },
  });

  const rawCallback = String(formData.get("callbackUrl") ?? "");
  const afterSignIn = safeInternalCallbackUrl(rawCallback || null, "/onboarding");
  redirect(`/auth/sign-in?callbackUrl=${encodeURIComponent(afterSignIn)}`);
}

