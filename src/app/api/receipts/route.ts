import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { receipts, clients } from "@/lib/db/schema";
import { receiptSchema } from "@/lib/validations";
import { generateOtp, generateToken } from "@/lib/otp";
import { sendReceiptEmail } from "@/lib/email";
import { eq, desc, and } from "drizzle-orm";

// POST /api/receipts — Create receipt
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = receiptSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { subject, bullets, amount, currency, dueDate, clientEmail, clientName, requireOtp } = parsed.data;

  const userId = session.user.id;
  const token = generateToken();
  const otp = requireOtp ? generateOtp() : null;

  let emailFailed = false;

  const receipt = await db.transaction(async (tx) => {
    const inserted = tx
      .insert(receipts)
      .values({
        userId,
        token,
        subject,
        bullets: JSON.stringify(bullets),
        amount: amount ?? null,
        currency: currency || "USD",
        dueDate: dueDate ?? null,
        clientEmail: clientEmail ?? null,
        clientName: clientName ?? null,
        requireOtp,
        otp,
        status: "draft",
      })
      .returning()
      .get();

    if (clientEmail) {
      const existing = tx
        .select({ id: clients.id })
        .from(clients)
        .where(and(eq(clients.userId, userId), eq(clients.email, clientEmail)))
        .get();
      if (!existing) {
        tx.insert(clients).values({
          userId,
          email: clientEmail,
          name: clientName ?? null,
        }).run();
      }

      const signUrl = `${process.env.NEXT_PUBLIC_APP_URL}/sign/${token}`;
      const emailResult = await sendReceiptEmail(clientEmail, subject, {
        bullets,
        amount: amount ?? null,
        currency: currency || "USD",
        dueDate: dueDate ?? null,
        requireOtp,
        otp,
        signUrl,
      });

      if (!emailResult.success) {
        emailFailed = true;
        return inserted;
      }

      tx.update(receipts).set({ status: "sent" }).where(eq(receipts.id, inserted.id)).run();
      return { ...inserted, status: "sent" as const };
    }

    tx.update(receipts).set({ status: "sent" }).where(eq(receipts.id, inserted.id)).run();
    return { ...inserted, status: "sent" as const };
  });

  if (emailFailed) {
    return NextResponse.json(
      { receipt, warning: "Receipt saved but email failed to send" },
      { status: 201 }
    );
  }

  return NextResponse.json({ receipt }, { status: 201 });
}

// GET /api/receipts — List receipts
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const limit = parseInt(searchParams.get("limit") || "50");

  const results = await db
    .select()
    .from(receipts)
    .where(eq(receipts.userId, session.user.id))
    .orderBy(desc(receipts.createdAt))
    .limit(limit);

  const filtered = status && status !== "all"
    ? results.filter((r) => r.status === status)
    : results;

  return NextResponse.json({ receipts: filtered });
}
