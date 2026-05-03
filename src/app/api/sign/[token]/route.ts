import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { receipts, signatures, users } from "@/lib/db/schema";
import { verifyOtp } from "@/lib/otp";
import { signSchema } from "@/lib/validations";
import { sendReceiptSignedNotification } from "@/lib/email";
import { eq } from "drizzle-orm";

const otpAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const COOLDOWN_MS = 15_000;

// GET /api/sign/[token] — Public: fetch receipt by token (no auth)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const [receipt] = await db
    .select()
    .from(receipts)
    .where(eq(receipts.token, token))
    .limit(1);

  if (!receipt) {
    return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
  }

  // Mark as viewed
  if (receipt.status === "sent") {
    await db
      .update(receipts)
      .set({ status: "viewed" })
      .where(eq(receipts.id, receipt.id));
  }

  let bullets: string[] = [];
  try { bullets = JSON.parse(receipt.bullets || "[]"); } catch { /* corrupted row */ }

  return NextResponse.json({
    receipt: {
      id: receipt.id,
      subject: receipt.subject,
      bullets,
      amount: receipt.amount,
      currency: receipt.currency,
      dueDate: receipt.dueDate,
      requireOtp: receipt.requireOtp,
      status: receipt.status,
      channel: receipt.channel,
      createdAt: receipt.createdAt,
    },
  });
}

// POST /api/sign/[token] — Public: sign off on receipt
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const [receipt] = await db
    .select()
    .from(receipts)
    .where(eq(receipts.token, token))
    .limit(1);

  if (!receipt) {
    return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
  }

  if (receipt.status === "signed" || receipt.status === "disputed") {
    return NextResponse.json(
      { error: "This receipt has already been signed" },
      { status: 409 }
    );
  }

  const now = Date.now();
  const attempt = otpAttempts.get(token) ?? { count: 0, lastAttempt: 0 };
  if (attempt.count >= MAX_ATTEMPTS && now - attempt.lastAttempt < COOLDOWN_MS) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait before trying again." },
      { status: 429 }
    );
  }
  if (now - attempt.lastAttempt >= COOLDOWN_MS) {
    attempt.count = 0;
  }
  attempt.count += 1;
  attempt.lastAttempt = now;
  otpAttempts.set(token, attempt);

  const body = await req.json();
  const parsed = signSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { action, clientName, otp } = parsed.data;

  // Verify OTP if required
  if (receipt.requireOtp) {
    if (!otp) {
      return NextResponse.json(
        { error: "OTP is required for this receipt" },
        { status: 400 }
      );
    }
    if (!receipt.otp || !verifyOtp(otp, receipt.otp)) {
      return NextResponse.json(
        { error: "Invalid OTP code" },
        { status: 400 }
      );
    }
  }

  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
  const newStatus = action === "acknowledged" ? "signed" : "disputed";

  await db.transaction(async (tx) => {
    await tx.update(receipts)
      .set({ status: newStatus, updatedAt: new Date() })
      .where(eq(receipts.id, receipt.id));

    await tx.insert(signatures).values({
      receiptId: receipt.id,
      clientEmail: receipt.clientEmail || "unknown",
      clientName: clientName || null,
      action,
      otpUsed: otp || null,
      ip,
    });

    const [user] = await tx
      .select({ email: users.email })
      .from(users)
      .where(eq(users.id, receipt.userId))
      .limit(1);

    if (user?.email) {
      await sendReceiptSignedNotification(
        user.email,
        receipt.subject,
        clientName || null,
        action
      );
    }
  });

  return NextResponse.json({
    success: true,
    action,
    message:
      action === "acknowledged"
        ? "Receipt acknowledged. Thank you! ✅"
        : "Dispute recorded. We'll contact you shortly.",
  });
}
