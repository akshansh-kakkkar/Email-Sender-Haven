import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiError } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const row = z.object({ studentEmail: z.string().trim().email().max(320) });

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request); if (denied) return denied;
  try {
    const rows = z.array(row).min(1).max(500).parse(await request.json());
    const emails = [...new Set(rows.map((contact) => contact.studentEmail.toLowerCase()))];
    const existing = new Set((await prisma.parentContact.findMany({ where: { email: { in: emails } }, select: { email: true } })).map((contact) => contact.email.toLowerCase()));
    const contacts = []; let duplicates = 0;
    for (const row of rows) { const email = row.studentEmail.toLowerCase(); if (existing.has(email)) { duplicates++; continue; } existing.add(email); contacts.push({ email, participantId: email, source: "MANUAL" }); }
    const result = contacts.length ? await prisma.parentContact.createMany({ data: contacts, skipDuplicates: true }) : { count: 0 };
    return NextResponse.json({ imported: result.count, duplicates: duplicates + contacts.length - result.count, failed: 0 });
  } catch (error) { return apiError(error); }
}
