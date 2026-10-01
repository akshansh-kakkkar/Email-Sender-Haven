import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function apiError(error: unknown) {
  if (error instanceof ZodError) return NextResponse.json({ error: "Invalid request", details: error.issues.map((i) => i.message) }, { status: 400 });
  const message = error instanceof Error ? error.message : "Unexpected server error";
  console.error("Application error:", message);
  return NextResponse.json({ error: message.startsWith("Configuration error:") ? message : "Unable to complete the request." }, { status: 500 });
}
