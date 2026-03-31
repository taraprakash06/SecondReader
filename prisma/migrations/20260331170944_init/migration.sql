-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'WRITER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ReaderProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "ageCategory" TEXT NOT NULL DEFAULT 'UNSPECIFIED',
    "writingBackground" TEXT NOT NULL DEFAULT '',
    "genres" TEXT NOT NULL DEFAULT '',
    "caresAbout" TEXT NOT NULL DEFAULT '',
    "feedbackPhilosophy" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ReaderProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "writerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "subgenre" TEXT NOT NULL DEFAULT '',
    "wordCount" INTEGER NOT NULL,
    "stage" TEXT NOT NULL,
    "focus1" TEXT NOT NULL,
    "focus2" TEXT,
    "focusOther" TEXT NOT NULL DEFAULT '',
    "tonePref" TEXT NOT NULL,
    "notHelpful" TEXT NOT NULL DEFAULT '',
    "initialPages" TEXT NOT NULL,
    "fullText" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Submission_writerId_fkey" FOREIGN KEY ("writerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CritiqueAssignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "submissionId" TEXT NOT NULL,
    "readerId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "unlockedPages" INTEGER NOT NULL DEFAULT 3,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CritiqueAssignment_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CritiqueAssignment_readerId_fkey" FOREIGN KEY ("readerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CritiqueFeedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assignmentId" TEXT NOT NULL,
    "strengths" TEXT NOT NULL DEFAULT '',
    "improvements" TEXT NOT NULL DEFAULT '',
    "keyTakeaways" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CritiqueFeedback_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "CritiqueAssignment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InlineComment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "feedbackId" TEXT NOT NULL,
    "quote" TEXT NOT NULL DEFAULT '',
    "message" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InlineComment_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "CritiqueFeedback" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FeedbackTag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assignmentId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FeedbackTag_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "CritiqueAssignment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SamplePiece" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "FeedbackSample" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "readerProfileId" TEXT NOT NULL,
    "samplePieceId" TEXT NOT NULL,
    "publicStrengths" TEXT NOT NULL DEFAULT '',
    "publicImprovements" TEXT NOT NULL DEFAULT '',
    "publicKeyTakeaways" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FeedbackSample_readerProfileId_fkey" FOREIGN KEY ("readerProfileId") REFERENCES "ReaderProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FeedbackSample_samplePieceId_fkey" FOREIGN KEY ("samplePieceId") REFERENCES "SamplePiece" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SampleInlineComment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "feedbackSampleId" TEXT NOT NULL,
    "quote" TEXT NOT NULL DEFAULT '',
    "message" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SampleInlineComment_feedbackSampleId_fkey" FOREIGN KEY ("feedbackSampleId") REFERENCES "FeedbackSample" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ReaderProfile_userId_key" ON "ReaderProfile"("userId");

-- CreateIndex
CREATE INDEX "CritiqueAssignment_readerId_status_idx" ON "CritiqueAssignment"("readerId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "CritiqueAssignment_submissionId_readerId_key" ON "CritiqueAssignment"("submissionId", "readerId");

-- CreateIndex
CREATE UNIQUE INDEX "CritiqueFeedback_assignmentId_key" ON "CritiqueFeedback"("assignmentId");

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackTag_assignmentId_tag_key" ON "FeedbackTag"("assignmentId", "tag");

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackSample_readerProfileId_key" ON "FeedbackSample"("readerProfileId");
