import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiError } from "@/lib/api";
import { setSession } from "@/lib/auth";
import { requiredEnv } from "@/lib/env";
export async function POST(request: NextRequest) { try {
  const { secret } = z.object({ secret: z.string().min(1) }).parse(await request.json());
  const expected = requiredEnv("ADMIN_SECRET");
  const valid = secret.length === expected.length && crypto.timingSafeEqual(Buffer.from(secret), Buffer.from(expected));
  if (!valid) return NextResponse.json({ error: "Invalid admin secret" }, { status: 401 });
  return setSession(NextResponse.json({ success: true }));
} catch (error) { return apiError(error); } }
