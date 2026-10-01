import { google } from "googleapis";
import crypto from "crypto";
import { requiredEnv } from "@/lib/env";

export type SendEmailInput = { to: string; subject: string; text: string; html?: string };
const SENDER = "chandigarh@haven.hackclub.com";
const b64 = (value: string) => Buffer.from(value, "utf8").toString("base64");
export async function sendEmail(input: SendEmailInput) {
  const client = new google.auth.OAuth2(requiredEnv("GOOGLE_CLIENT_ID"), requiredEnv("GOOGLE_CLIENT_SECRET"), process.env.GOOGLE_REDIRECT_URI);
  client.setCredentials({ refresh_token: requiredEnv("GOOGLE_REFRESH_TOKEN") });
  const boundary = `haven_${crypto.randomUUID()}`;
  const headers = [`From: Haven Chandigarh <${SENDER}>`, `To: ${input.to}`, `Subject: =?UTF-8?B?${b64(input.subject)}?=`, "MIME-Version: 1.0"];
  const body = input.html
    ? [...headers, `Content-Type: multipart/alternative; boundary=\"${boundary}\"`, "", `--${boundary}`, "Content-Type: text/plain; charset=UTF-8", "Content-Transfer-Encoding: base64", "", b64(input.text), `--${boundary}`, "Content-Type: text/html; charset=UTF-8", "Content-Transfer-Encoding: base64", "", b64(input.html), `--${boundary}--`].join("\r\n")
    : [...headers, "Content-Type: text/plain; charset=UTF-8", "Content-Transfer-Encoding: base64", "", b64(input.text)].join("\r\n");
  const gmail = google.gmail({ version: "v1", auth: client });
  const result = await gmail.users.messages.send({ userId: "me", requestBody: { raw: Buffer.from(body).toString("base64url") } });
  return { messageId: result.data.id ?? undefined };
}
