import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { requiredEnv } from "@/lib/env";

const SESSION = "haven_admin_session";
const CSRF = "haven_admin_csrf";
const maxAge = 60 * 60 * 12;
function signature(value: string) { return crypto.createHmac("sha256", requiredEnv("ADMIN_SECRET")).update(value).digest("hex"); }

export function createAdminSession() {
  const expires = Math.floor(Date.now() / 1000) + maxAge;
  return `${expires}.${signature(String(expires))}`;
}
export function isAdmin(request: NextRequest) {
  try {
    const value = request.cookies.get(SESSION)?.value;
    if (!value) return false;
    const [expires, token] = value.split(".");
    return Boolean(expires && token && Number(expires) > Date.now() / 1000 && crypto.timingSafeEqual(Buffer.from(token), Buffer.from(signature(expires))));
  } catch { return false; }
}
export function requireAdmin(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    const csrf = request.headers.get("x-csrf-token");
    const cookie = request.cookies.get(CSRF)?.value;
    if (!csrf || !cookie || csrf !== cookie) return NextResponse.json({ error: "Invalid request token" }, { status: 403 });
  }
  return null;
}
export function setSession(response: NextResponse) {
  const csrf = crypto.randomBytes(24).toString("base64url");
  response.cookies.set(SESSION, createAdminSession(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge, path: "/" });
  response.cookies.set(CSRF, csrf, { httpOnly: false, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge, path: "/" });
  return response;
}
export function clearSession(response: NextResponse) { response.cookies.delete(SESSION); response.cookies.delete(CSRF); return response; }
export function csrfFromRequest(request: NextRequest) { return request.cookies.get(CSRF)?.value ?? ""; }
