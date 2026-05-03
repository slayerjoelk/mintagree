import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { conversationThreads, messages } from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { z } from "zod";

const patchSchema = z.object({
  status: z.enum(["active", "pending_review", "completed", "skipped"]).optional(),
  subject: z.string().max(200).optional(),
});

// GET /api/chats/[threadId] — thread detail with messages
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { threadId } = await params;

  const [thread] = await db
    .select()
    .from(conversationThreads)
    .where(
      and(
        eq(conversationThreads.id, threadId),
        eq(conversationThreads.userId, session.user.id)
      )
    )
		.limit(1);

  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  const [msgs] = await db
    .select()
    .from(messages)
    .where(eq(messages.threadId, threadId))
    .orderBy(asc(messages.createdAt));

  return NextResponse.json({ thread, messages: msgs });
}

// PATCH /api/chats/[threadId] — update status or subject
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { threadId } = await params;
  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const [existing] = await db
    .select()
    .from(conversationThreads)
    .where(
      and(
        eq(conversationThreads.id, threadId),
        eq(conversationThreads.userId, session.user.id)
      )
    )
		.limit(1);

  if (!existing) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  const update: Record<string, string> = {};
  if (parsed.data.status) update.status = parsed.data.status;
  if (parsed.data.subject) update.subject = parsed.data.subject;

  await db
    .update(conversationThreads)
    .set(update)
    .where(eq(conversationThreads.id, threadId));

  return NextResponse.json({ success: true });
}
