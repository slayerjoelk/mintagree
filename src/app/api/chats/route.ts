import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { conversationThreads, messages, receipts } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

// GET /api/chats — list conversation threads for the user
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  const threads = await db
    .select()
    .from(conversationThreads)
    .where(eq(conversationThreads.userId, session.user.id))
    .orderBy(desc(conversationThreads.lastMessageAt))
    .limit(limit);

  const filtered =
    status && status !== "all"
      ? threads.filter((t) => t.status === status)
      : threads;

  return NextResponse.json({ threads: filtered });
}
