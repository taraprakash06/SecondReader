import { PrismaClient } from "@prisma/client";

/** Increment when Prisma schema changes in ways that make an old `PrismaClient` throw validation errors. */
const PRISMA_SINGLETON_VERSION = 4;

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var __prismaSingletonVersion: number | undefined;
}

function getPrismaClient(): PrismaClient {
  const g = globalThis as typeof globalThis & {
    __prisma?: PrismaClient;
    __prismaSingletonVersion?: number;
  };
  const existing = g.__prisma;
  const versionMismatch =
    existing != null && g.__prismaSingletonVersion !== PRISMA_SINGLETON_VERSION;

  // After `prisma generate` or schema edits, an old dev singleton may lack new models/fields and
  // throw PrismaClientValidationError (e.g. `requestsOpen` on Submission).
  const e = existing as unknown as {
    notification?: { count?: unknown };
    readerVolunteerRequest?: { findFirst?: unknown };
  };
  const looksCurrent =
    existing &&
    typeof e.notification?.count === "function" &&
    typeof e.readerVolunteerRequest?.findFirst === "function";

  if (existing && (versionMismatch || !looksCurrent)) {
    void existing.$disconnect().catch(() => {});
    g.__prisma = undefined;
    g.__prismaSingletonVersion = undefined;
  }
  if (!g.__prisma) {
    g.__prisma = new PrismaClient();
    g.__prismaSingletonVersion = PRISMA_SINGLETON_VERSION;
  }
  return g.__prisma;
}

export const db = getPrismaClient();
