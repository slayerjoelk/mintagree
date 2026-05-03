import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { conversationThreads, receipts, receiptDelivery, clients } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { generateOtp, generateToken } from "@/lib/otp";
import { sendReceiptEmail } from "@/lib/email";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";

const sendSchema = z.object({
  subject: z.string().min(1).max(200),
  bullets: z.array(z.string().min(1)).min(1),
  amount: z.number().min(0).nullable().optional(),
  currency: z.string().optional(),
  dueDate: z.string().nullable().optional(),
  clientPhone: z.string().min(1),
  clientName: z.string().nullable().optional(),
  clientEmail: z.string().email().nullable().optional(),
  requireOtp: z.boolean().default(true),
});

// POST /api/chats/[threadId]/send — create receipt from draft, send via both channels
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { threadId } = await params;
  const body = await req.json();
  const parsed = sendSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const {
    subject,
    bullets,
    amount,
    currency,
    dueDate,
    clientPhone,
    clientName,
    clientEmail,
    requireOtp,
  } = parsed.data;

  const userId = session.user.id;
  const token = generateToken();
  const otp = requireOtp ? generateOtp() : null;

  // Verify thread belongs to user
  const [thread] = await db
    .select()
    .from(conversationThreads)
    .where(
      and(
        eq(conversationThreads.id, threadId),
        eq(conversationThreads.userId, userId)
      )
    )
    .limit(1);

  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  // Normalize phone (strip whatsapp: prefix if present)
  const phone = clientPhone.replace(/^whatsapp:/, "").trim();

  const result = await db.transaction(async (tx) => {
    // 1. Create receipt
    const [inserted] = await tx
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
        channel: "whatsapp",
        requireOtp,
        otp,
        status: "draft",
      })
      .returning();

    // 2. Upsert client if not exists
    if (clientEmail) {
      const [existing] = await tx
        .select({ id: clients.id })
        .from(clients)
        .where(and(eq(clients.userId, userId), eq(clients.email, clientEmail)))
        .limit(1);
      if (!existing) {
        await tx.insert(clients).values({
          userId,
          email: clientEmail,
          name: clientName ?? null,
          phone: phone ?? null,
          channel: "whatsapp",
          whatsappOptIn: true,
        });
      }
    }

    // 3. Send WhatsApp message (PRIMARY channel)
    const signUrl = `${process.env.NEXT_PUBLIC_APP_URL}/sign/${token}`;
    const whatsAppBody = `Hi${clientName ? ` ${clientName}` : ""}. Here is what we agreed:\n\n${bullets.map((b) => `• ${b}`).join("\n")}${amount ? `\n\nAmount: ${currency || "USD"} ${amount}` : ""}\n\nPlease review and confirm:\n${signUrl}${requireOtp && otp ? `\n\nYour OTP: ${otp}` : ""}`;

    const waResult = await sendWhatsAppMessage(phone, whatsAppBody);

    await tx.insert(receiptDelivery).values({
      id: createId(),
      receiptId: inserted.id,
      channel: "whatsapp",
      status: waResult.success ? "sent" : "failed",
      externalId: waResult.sid ?? null,
      error: waResult.error ?? null,
      sentAt: new Date(),
    });

    // 4. Send email (BACKUP channel)
    let emailResult = null;
    if (clientEmail) {
      emailResult = await sendReceiptEmail(clientEmail, subject, {
        bullets,
        amount: amount ?? null,
        currency: currency || "USD",
        dueDate: dueDate ?? null,
        requireOtp,
        otp,
        signUrl,
      });

      await tx.insert(receiptDelivery).values({
        id: createId(),
        receiptId: inserted.id,
        channel: "email",
        status: emailResult.success ? "sent" : "failed",
        error: emailResult.error ?? null,
        sentAt: new Date(),
      });
    }

    // 5. Update receipt status
    const allDelivered = waResult.success && (!clientEmail || emailResult?.success);
    await tx.update(receipts)
      .set({ status: allDelivered ? "sent" : "draft" })
      .where(eq(receipts.id, inserted.id));

    // 6. Update thread: mark completed, attach receipt
    await tx.update(conversationThreads)
      .set({
        status: "completed",
        draftReceiptId: inserted.id,
        updatedAt: new Date(),
      })
      .where(eq(conversationThreads.id, threadId));

    return {
      receipt: { ...inserted, status: allDelivered ? "sent" : "draft" },
      whatsApp: waResult,
      email: emailResult,
    };
  });

  return NextResponse.json(result, { status: 201 });
}
