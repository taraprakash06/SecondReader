-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('WRITER', 'READER', 'BOTH');

-- CreateEnum
CREATE TYPE "DraftStage" AS ENUM ('EARLY_DRAFT', 'POLISHED_DRAFT', 'PRE_SUBMISSION');

-- CreateEnum
CREATE TYPE "FeedbackFocus" AS ENUM ('BIG_PICTURE', 'LINE_EDITS', 'EMOTIONAL_IMPACT', 'STRUCTURE', 'OTHER');

-- CreateEnum
CREATE TYPE "WriterFocusArea" AS ENUM ('BIG_PICTURE_OVERALL', 'STRUCTURE_PACING', 'CLARITY_FLOW', 'CHARACTER_VOICE', 'EMOTIONAL_IMPACT', 'LINE_LEVEL_WRITING', 'DIALOGUE', 'OPENING_FIRST_PAGES', 'ENDING', 'PLACES_WORKING_WELL', 'PLACES_CONFUSION', 'PLACES_UNNECESSARY', 'OTHER');

-- CreateEnum
CREATE TYPE "FeedbackTonePreference" AS ENUM ('GENTLE', 'BALANCED', 'DIRECT');

-- CreateEnum
CREATE TYPE "ReaderAgeCategory" AS ENUM ('TEEN', 'ADULT', 'SENIOR', 'UNSPECIFIED');

-- CreateEnum
CREATE TYPE "CritiqueStatus" AS ENUM ('ACTIVE', 'STOPPED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ReaderInviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- CreateEnum
CREATE TYPE "ReaderVolunteerStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- CreateEnum
CREATE TYPE "ReputationTag" AS ENUM ('BIG_PICTURE_THINKING', 'LINE_LEVEL_DETAIL', 'ENCOURAGING_TONE', 'BRUTALLY_HONEST', 'GOOD_WITH_PACING', 'GOOD_WITH_POETRY', 'GOOD_WITH_PROSE');

-- CreateEnum
CREATE TYPE "SampleGenre" AS ENUM ('FICTION', 'PERSONAL_ESSAY_MEMOIR', 'POETRY', 'LITERARY_NONFICTION', 'GENRE_FICTION');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT NOT NULL DEFAULT '',
    "role" "UserRole" NOT NULL DEFAULT 'WRITER',
    "passwordHash" TEXT,
    "writeGenres" TEXT NOT NULL DEFAULT '',
    "readGenres" TEXT NOT NULL DEFAULT '',
    "onboarded" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "ReaderProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ageCategory" "ReaderAgeCategory" NOT NULL DEFAULT 'UNSPECIFIED',
    "writingBackground" TEXT NOT NULL DEFAULT '',
    "genres" TEXT NOT NULL DEFAULT '',
    "caresAbout" TEXT NOT NULL DEFAULT '',
    "feedbackPhilosophy" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReaderProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "writerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "subgenre" TEXT NOT NULL DEFAULT '',
    "wordCount" INTEGER NOT NULL,
    "stage" "DraftStage" NOT NULL,
    "writerFocusAreas" TEXT NOT NULL DEFAULT '[]',
    "focus1" "FeedbackFocus" NOT NULL,
    "focus2" "FeedbackFocus",
    "focusOther" TEXT NOT NULL DEFAULT '',
    "tonePref" "FeedbackTonePreference" NOT NULL,
    "notHelpful" TEXT NOT NULL DEFAULT '',
    "writerBrowseNote" TEXT NOT NULL DEFAULT '',
    "requestsOpen" BOOLEAN NOT NULL DEFAULT true,
    "initialPages" TEXT NOT NULL,
    "fullText" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CritiqueAssignment" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "readerId" TEXT NOT NULL,
    "status" "CritiqueStatus" NOT NULL DEFAULT 'ACTIVE',
    "unlockedPages" INTEGER NOT NULL DEFAULT 3,
    "readerSeesFullPiece" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CritiqueAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReaderInvite" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "readerId" TEXT NOT NULL,
    "writerId" TEXT NOT NULL,
    "status" "ReaderInviteStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReaderInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReaderVolunteerRequest" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "readerId" TEXT NOT NULL,
    "writerId" TEXT NOT NULL,
    "status" "ReaderVolunteerStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReaderVolunteerRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "inviteId" TEXT,
    "volunteerRequestId" TEXT,
    "relatedAssignmentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CritiqueFeedback" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "strengths" TEXT NOT NULL DEFAULT '',
    "improvements" TEXT NOT NULL DEFAULT '',
    "keyTakeaways" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CritiqueFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InlineComment" (
    "id" TEXT NOT NULL,
    "feedbackId" TEXT NOT NULL,
    "quote" TEXT NOT NULL DEFAULT '',
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InlineComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedbackTag" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "tag" "ReputationTag" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeedbackTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SamplePiece" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "genre" "SampleGenre" NOT NULL DEFAULT 'FICTION',
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SamplePiece_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedbackSample" (
    "id" TEXT NOT NULL,
    "readerProfileId" TEXT NOT NULL,
    "samplePieceId" TEXT NOT NULL,
    "genre" "SampleGenre" NOT NULL DEFAULT 'FICTION',
    "publicStrengths" TEXT NOT NULL DEFAULT '',
    "publicImprovements" TEXT NOT NULL DEFAULT '',
    "publicKeyTakeaways" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeedbackSample_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SampleInlineComment" (
    "id" TEXT NOT NULL,
    "feedbackSampleId" TEXT NOT NULL,
    "quote" TEXT NOT NULL DEFAULT '',
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SampleInlineComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "ReaderProfile_userId_key" ON "ReaderProfile"("userId");

-- CreateIndex
CREATE INDEX "CritiqueAssignment_readerId_status_idx" ON "CritiqueAssignment"("readerId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "CritiqueAssignment_submissionId_readerId_key" ON "CritiqueAssignment"("submissionId", "readerId");

-- CreateIndex
CREATE INDEX "ReaderInvite_readerId_status_idx" ON "ReaderInvite"("readerId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ReaderInvite_submissionId_readerId_key" ON "ReaderInvite"("submissionId", "readerId");

-- CreateIndex
CREATE INDEX "ReaderVolunteerRequest_writerId_status_idx" ON "ReaderVolunteerRequest"("writerId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ReaderVolunteerRequest_submissionId_readerId_key" ON "ReaderVolunteerRequest"("submissionId", "readerId");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_inviteId_key" ON "Notification"("inviteId");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_volunteerRequestId_key" ON "Notification"("volunteerRequestId");

-- CreateIndex
CREATE INDEX "Notification_userId_read_idx" ON "Notification"("userId", "read");

-- CreateIndex
CREATE UNIQUE INDEX "CritiqueFeedback_assignmentId_key" ON "CritiqueFeedback"("assignmentId");

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackTag_assignmentId_tag_key" ON "FeedbackTag"("assignmentId", "tag");

-- CreateIndex
CREATE UNIQUE INDEX "SamplePiece_title_key" ON "SamplePiece"("title");

-- CreateIndex
CREATE INDEX "FeedbackSample_readerProfileId_createdAt_idx" ON "FeedbackSample"("readerProfileId", "createdAt");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReaderProfile" ADD CONSTRAINT "ReaderProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_writerId_fkey" FOREIGN KEY ("writerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CritiqueAssignment" ADD CONSTRAINT "CritiqueAssignment_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CritiqueAssignment" ADD CONSTRAINT "CritiqueAssignment_readerId_fkey" FOREIGN KEY ("readerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReaderInvite" ADD CONSTRAINT "ReaderInvite_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReaderInvite" ADD CONSTRAINT "ReaderInvite_readerId_fkey" FOREIGN KEY ("readerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReaderInvite" ADD CONSTRAINT "ReaderInvite_writerId_fkey" FOREIGN KEY ("writerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReaderVolunteerRequest" ADD CONSTRAINT "ReaderVolunteerRequest_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReaderVolunteerRequest" ADD CONSTRAINT "ReaderVolunteerRequest_readerId_fkey" FOREIGN KEY ("readerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReaderVolunteerRequest" ADD CONSTRAINT "ReaderVolunteerRequest_writerId_fkey" FOREIGN KEY ("writerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_inviteId_fkey" FOREIGN KEY ("inviteId") REFERENCES "ReaderInvite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_volunteerRequestId_fkey" FOREIGN KEY ("volunteerRequestId") REFERENCES "ReaderVolunteerRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CritiqueFeedback" ADD CONSTRAINT "CritiqueFeedback_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "CritiqueAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InlineComment" ADD CONSTRAINT "InlineComment_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "CritiqueFeedback"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackTag" ADD CONSTRAINT "FeedbackTag_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "CritiqueAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackSample" ADD CONSTRAINT "FeedbackSample_readerProfileId_fkey" FOREIGN KEY ("readerProfileId") REFERENCES "ReaderProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackSample" ADD CONSTRAINT "FeedbackSample_samplePieceId_fkey" FOREIGN KEY ("samplePieceId") REFERENCES "SamplePiece"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SampleInlineComment" ADD CONSTRAINT "SampleInlineComment_feedbackSampleId_fkey" FOREIGN KEY ("feedbackSampleId") REFERENCES "FeedbackSample"("id") ON DELETE CASCADE ON UPDATE CASCADE;
