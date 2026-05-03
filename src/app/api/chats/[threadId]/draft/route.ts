import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { conversationThreads, messages } from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { draftReceiptFromThread } from "@/lib/ai-drafter";

// GET /api/chats/[threadId]/draft — return AI-generated draft for this thread
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { threadId } = await params;

  // Verify thread belongs to user
  const thread = await db
    .select()
    .from(conversationThreads)
    .where(
      and(
        eq(conversationThreads.id, threadId),
        eq(conversationThreads.userId, session.user.id)
      )
    )
    .get();

  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  // Fetch messages
  const msgs = await db
    .select()
    .from(messages)
    .where(eq(messages.threadId, threadId))
    .orderBy(asc(messages.createdAt));

  const draft = draftReceiptFromThread(
    msgs.map((m) => ({ direction: m.direction as "inbound" | "outbound", body: m.body }))
  );

  return NextResponse.json({
    thread,
    messages: msgs,
    draft,
  });
}
