import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { receipts, attachments } from "@/lib/db/schema";
import { receiptPatchSchema } from "@/lib/validations";
import { eq } from "drizzle-orm";

// GET /api/receipts/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const [receipt] = await db
    .select()
    .from(receipts)
    .where(eq(receipts.id, id))
    .limit(1);

  if (!receipt || receipt.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const receiptAttachments = await db
    .select()
    .from(attachments)
    .where(eq(attachments.receiptId, id));

  let bullets: string[] = [];
  try { bullets = JSON.parse(receipt.bullets || "[]"); } catch { /* corrupted row */ }

  return NextResponse.json({
    receipt: {
      ...receipt,
      bullets,
      attachments: receiptAttachments,
    },
  });
}

// PATCH /api/receipts/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const [receipt] = await db
    .select()
    .from(receipts)
    .where(eq(receipts.id, id))
    .limit(1);

  if (!receipt || receipt.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = receiptPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { subject, bullets, amount, currency, dueDate, clientEmail, clientName, requireOtp } = parsed.data;

  const [updated] = await db
    .update(receipts)
    .set({
      ...(subject !== undefined && { subject }),
      ...(bullets !== undefined && { bullets: JSON.stringify(bullets) }),
      ...(amount !== undefined && { amount }),
      ...(currency !== undefined && { currency }),
      ...(dueDate !== undefined && { dueDate }),
      ...(clientEmail !== undefined && { clientEmail }),
      ...(clientName !== undefined && { clientName }),
      ...(requireOtp !== undefined && { requireOtp }),
      updatedAt: new Date(),
    })
    .where(eq(receipts.id, id))
    .returning();

  return NextResponse.json({ receipt: updated });
}

// DELETE /api/receipts/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const [receipt] = await db
    .select()
    .from(receipts)
    .where(eq(receipts.id, id))
    .limit(1);

  if (!receipt || receipt.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.delete(receipts).where(eq(receipts.id, id));
  return NextResponse.json({ success: true });
}
