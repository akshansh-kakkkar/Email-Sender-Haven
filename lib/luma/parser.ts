/**
 * Adapter boundary for Luma webhook payloads. Luma's exact event envelope must be
 * confirmed against the event's webhook documentation before production use.
 */
export type LumaRegistration = { registrationId?: string; participantName?: string; participantEmail?: string; parentName?: string; parentEmail?: string };
const stringAt = (record: Record<string, unknown>, paths: string[]) => {
  for (const path of paths) { let value: unknown = record; for (const key of path.split(".")) value = value && typeof value === "object" ? (value as Record<string, unknown>)[key] : undefined; if (typeof value === "string" && value.trim()) return value.trim(); }
};
export function parseLumaRegistration(payload: unknown): LumaRegistration {
  if (!payload || typeof payload !== "object") return {};
  const source = payload as Record<string, unknown>;
  return {
    registrationId: stringAt(source, ["registration.id", "data.registration.id", "id"]),
    participantName: stringAt(source, ["registration.name", "data.registration.name", "participant.name"]),
    participantEmail: stringAt(source, ["registration.email", "data.registration.email", "participant.email"]),
    parentName: stringAt(source, ["parent.name", "registration.parent_name", "data.parent.name"]),
    parentEmail: stringAt(source, ["parent.email", "registration.parent_email", "data.parent.email"]),
  };
}
