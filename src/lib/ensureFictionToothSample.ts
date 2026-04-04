import { SampleGenre } from "@prisma/client";
import { db } from "@/lib/db";
import {
  CANONICAL_TOOTH_TITLE,
  FICTION_TOOTH_TEXT,
  LEGACY_TOOTH_TITLE,
} from "@/lib/sampleTexts/fictionTooth";

/**
 * Ensures the fiction onboarding sample exists (e.g. fresh Postgres without `prisma db seed`).
 * Safe to call on every reader onboarding load; upsert is idempotent.
 */
export async function ensureFictionToothSamplePiece(): Promise<void> {
  await db.samplePiece.updateMany({
    where: { title: LEGACY_TOOTH_TITLE },
    data: { title: CANONICAL_TOOTH_TITLE },
  });

  await db.samplePiece.upsert({
    where: { title: CANONICAL_TOOTH_TITLE },
    update: { genre: SampleGenre.FICTION },
    create: {
      title: CANONICAL_TOOTH_TITLE,
      genre: SampleGenre.FICTION,
      text: FICTION_TOOTH_TEXT,
    },
  });
}
