import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiError } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({ ids: z.array(z.string().cuid()).min(1).max(200), action: z.enum(["ENABLE", "DISABLE", "DELETE"]) });
export async function POST(request: NextRequest) { const denied = requireAdmin(request); if (denied) return denied; try { const { ids, action } = schema.parse(await request.json()); if (action === "DELETE") await prisma.parentContact.deleteMany({ where: { id: { in: ids } } }); else await prisma.parentContact.updateMany({ where: { id: { in: ids } }, data: { isActive: action === "ENABLE" } }); return NextResponse.json({ success: true, count: ids.length }); } catch (error) { return apiError(error); } }
