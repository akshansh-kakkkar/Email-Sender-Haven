import { NextRequest, NextResponse } from "next/server";
import { clearSession, requireAdmin } from "@/lib/auth";
export async function POST(request: NextRequest) { const denied = requireAdmin(request); return denied ?? clearSession(NextResponse.json({ success: true })); }
