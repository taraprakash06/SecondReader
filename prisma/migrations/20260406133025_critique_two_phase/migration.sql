-- AlterTable
ALTER TABLE "CritiqueAssignment" ADD COLUMN     "firstPassComplete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "firstPassCompletedAt" TIMESTAMP(3),
ADD COLUMN     "fullPieceUnlockedAt" TIMESTAMP(3),
ADD COLUMN     "writerContinues" BOOLEAN,
ADD COLUMN     "writerDecidedAt" TIMESTAMP(3);
