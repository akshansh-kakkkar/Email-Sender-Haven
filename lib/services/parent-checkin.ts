import { EmailStatus, EmailType, ParentCall, ParentContact } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email/gmail";
import { defaultParentCheckin, renderTemplate } from "@/lib/email/templates";

const safeMessage = (error: unknown) => error instanceof Error ? error.message.replace(/(refresh_token|client_secret|api[_-]?key)=?[^\s&]+/gi, "$1=[redacted]").slice(0, 500) : "Email provider rejected the request";
async function sendWithRetry(input: Parameters<typeof sendEmail>[0]) {
  let last: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try { return await sendEmail(input); } catch (error) {
      last = error;
      const message = error instanceof Error ? error.message : "";
      if (!/429|rate|timeout|temporar|5\d\d/i.test(message) || attempt === 2) break;
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
  throw last;
}
export async function sendParentCheckinEmail(parent: ParentContact, call: ParentCall) {
  // ParticipantId is the established field where the Luma adapter stores the
  // student's email. Never fall back to parent.email: these messages are now
  // explicitly student-only.
  if (!parent.participantId) return { status: "skipped" as const };
  const recipient = parent.participantId.toLowerCase();
  const alreadySent = await prisma.emailLog.findFirst({ where: { recipient, parentCallId: call.id, type: EmailType.PARENT_CHECKIN, status: EmailStatus.SENT } });
  if (alreadySent) return { status: "skipped" as const };
  const [template, settings] = await Promise.all([prisma.emailTemplate.findFirst({ where: { type: "PARENT_CHECKIN", isActive: true, isArchived: false }, orderBy: { updatedAt: "desc" } }), getSettings()]);
  const email = renderTemplate(template ?? defaultParentCheckin, call, settings, parent);
  try {
    const result = await sendWithRetry({ to: recipient, ...email });
    await prisma.emailLog.create({ data: { recipient, subject: email.subject, type: EmailType.PARENT_CHECKIN, status: EmailStatus.SENT, messageId: result.messageId, parentCallId: call.id, sentAt: new Date() } });
    return { status: "sent" as const, messageId: result.messageId };
  } catch (error) {
    await prisma.emailLog.create({ data: { recipient, subject: email.subject, type: EmailType.PARENT_CHECKIN, status: EmailStatus.FAILED, error: safeMessage(error), parentCallId: call.id } });
    return { status: "failed" as const, error: safeMessage(error) };
  }
}
async function getSettings() { const existing=await prisma.eventSettings.findFirst(); return existing ?? prisma.eventSettings.create({data:{}}); }
export async function sendActiveParentCheckin() {
  const call = await prisma.parentCall.findFirst({ where: { isActive: true }, orderBy: { updatedAt: "desc" } });
  if (!call) throw new Error("No active Parent Check-In call is configured.");
  const parents = await prisma.parentContact.findMany({ where: { isActive: true, participantId: { not: null } }, orderBy: { createdAt: "asc" } });
  const results = await Promise.all(parents.map((parent) => sendParentCheckinEmail(parent, call)));
  return { total: parents.length, sent: results.filter((r) => r.status === "sent").length, failed: results.filter((r) => r.status === "failed").length, skipped: results.filter((r) => r.status === "skipped").length };
}
