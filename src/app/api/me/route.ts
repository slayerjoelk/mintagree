import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { receipts, clients, templates, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const webhookUrl = body.webhookUrl === null ? null : String(body.webhookUrl || "").trim();

  if (webhookUrl && !/^https?:\/\//.test(webhookUrl)) {
    return NextResponse.json({ error: "Invalid URL. Must start with http:// or https://" }, { status: 400 });
  }

  await db
    .update(users)
    .set({ webhookUrl: webhookUrl || null })
    .where(eq(users.id, session.user.id));

  return NextResponse.json({ success: true, webhookUrl });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  await db.delete(receipts).where(eq(receipts.userId, userId));
  await db.delete(clients).where(eq(clients.userId, userId));
  await db.delete(templates).where(eq(templates.userId, userId));
  // Note: NextAuth user row remains in auth DB

  return NextResponse.json({ success: true });
}
