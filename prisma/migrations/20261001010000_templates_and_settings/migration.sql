ALTER TABLE "ParentCall" ADD COLUMN "description" TEXT;
CREATE TABLE "EmailTemplate" (
  "id" TEXT NOT NULL, "name" TEXT NOT NULL, "type" TEXT NOT NULL DEFAULT 'OTHER', "subject" TEXT NOT NULL,
  "greeting" TEXT NOT NULL DEFAULT '', "body" TEXT NOT NULL, "dateText" TEXT NOT NULL DEFAULT '📅 Date: {{date}}',
  "timeText" TEXT NOT NULL DEFAULT '⏰ Time: {{time}} ({{timezone}})', "linkText" TEXT NOT NULL DEFAULT '🔗 Join here: {{meeting_link}}',
  "closing" TEXT NOT NULL DEFAULT '', "signature" TEXT NOT NULL DEFAULT '', "isActive" BOOLEAN NOT NULL DEFAULT true,
  "isArchived" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "EmailTemplate_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "EmailTemplate_type_isActive_isArchived_idx" ON "EmailTemplate"("type", "isActive", "isArchived");
CREATE TABLE "EventSettings" (
  "id" TEXT NOT NULL, "eventName" TEXT NOT NULL DEFAULT 'Haven Chandigarh', "eventLocation" TEXT NOT NULL DEFAULT 'Chandigarh',
  "eventDate" TEXT, "eventWebsite" TEXT, "organizerName" TEXT NOT NULL DEFAULT 'Akshansh',
  "organizerEmail" TEXT NOT NULL DEFAULT 'chandigarh@haven.hackclub.com', "organizerOrganization" TEXT,
  "supportEmail" TEXT, "logoUrl" TEXT, "accentColor" TEXT NOT NULL DEFAULT '#f97316', "emailSignature" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "EventSettings_pkey" PRIMARY KEY ("id")
);
