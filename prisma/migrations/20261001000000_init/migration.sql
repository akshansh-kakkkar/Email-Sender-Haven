CREATE TYPE "EmailType" AS ENUM ('PARENT_CHECKIN', 'REGISTRATION', 'TEST', 'OTHER');
CREATE TYPE "EmailStatus" AS ENUM ('SENT', 'FAILED');

CREATE TABLE "ParentContact" (
  "id" TEXT NOT NULL, "name" TEXT, "email" TEXT NOT NULL, "participantName" TEXT,
  "participantId" TEXT, "source" TEXT NOT NULL DEFAULT 'MANUAL', "lumaRegistrationId" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "ParentContact_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ParentCall" (
  "id" TEXT NOT NULL, "date" TEXT NOT NULL, "time" TEXT NOT NULL, "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  "lumaLink" TEXT NOT NULL, "title" TEXT NOT NULL DEFAULT 'Haven Chandigarh — Parent Check-In Call', "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ParentCall_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "EmailLog" (
  "id" TEXT NOT NULL, "recipient" TEXT NOT NULL, "subject" TEXT NOT NULL, "type" "EmailType" NOT NULL,
  "status" "EmailStatus" NOT NULL, "messageId" TEXT, "error" TEXT, "parentCallId" TEXT,
  "sentAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EmailLog_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ParentContact_email_key" ON "ParentContact"("email");
CREATE UNIQUE INDEX "ParentContact_lumaRegistrationId_key" ON "ParentContact"("lumaRegistrationId");
CREATE INDEX "EmailLog_recipient_parentCallId_type_status_idx" ON "EmailLog"("recipient", "parentCallId", "type", "status");
CREATE INDEX "EmailLog_createdAt_idx" ON "EmailLog"("createdAt");
ALTER TABLE "EmailLog" ADD CONSTRAINT "EmailLog_parentCallId_fkey" FOREIGN KEY ("parentCallId") REFERENCES "ParentCall"("id") ON DELETE SET NULL ON UPDATE CASCADE;
