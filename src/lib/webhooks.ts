import { db } from "@/lib/db";
import { users, receipts, signatures, clients } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";

export interface WebhookPayload {
  event: "receipt.signed" | "receipt.disputed";
  timestamp: string;
  receipt: {
    id: string;
    token: string;
    subject: string;
    bullets: string[];
    amount: number | null;
    currency: string;
    dueDate: string | null;
    status: string;
    channel: string;
    createdAt: string;
  };
  client: {
    name: string | null;
    email: string | null;
    phone: string | null;
  };
  signature: {
    action: string;
    ip: string | null;
    signedAt: string;
  };
  sender: {
    id: string;
    email: string | null;
    name: string | null;
    company: string | null;
  };
}

/**
 * Fire an outbound webhook to the user's configured URL.
 * Fails silently — we never block the sign-off UX on webhook delivery.
 */
export async function fireWebhook(payload: WebhookPayload, webhookUrl: string) {
  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "AgreeMint-Webhook/1.0",
        "X-AgreeMint-Event": payload.event,
      },
      body: JSON.stringify(payload),
    });
    return {
      success: res.ok,
      status: res.status,
      body: res.ok ? null : await res.text().catch(() => null),
    };
  } catch (e: any) {
    console.error("Webhook fire error:", e?.message || e);
    return { success: false, status: 0, body: e?.message };
  }
}

/** Build payload and fire if user has a webhook URL configured */
export async function maybeFireReceiptWebhook(receiptId: string, signatureId: string) {
  const [receipt] = await db
    .select()
    .from(receipts)
    .where(eq(receipts.id, receiptId))
    .limit(1);

  if (!receipt) return;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, receipt.userId))
    .limit(1);

  if (!user?.webhookUrl) return;

  const [sig] = await db
    .select()
    .from(signatures)
    .where(eq(signatures.id, signatureId))
    .limit(1);

  const clientRows = await db
    .select()
    .from(clients)
    .where(
      and(
        eq(clients.userId, receipt.userId),
        eq(clients.email, receipt.clientEmail || "")
      )
    )
    .limit(1);

  const client = clientRows[0] ?? null;

  let bullets: string[] = [];
  try { bullets = JSON.parse(receipt.bullets || "[]"); } catch { /* ignore */ }

  const payload: WebhookPayload = {
    event: receipt.status === "signed" ? "receipt.signed" : "receipt.disputed",
    timestamp: new Date().toISOString(),
    receipt: {
      id: receipt.id,
      token: receipt.token,
      subject: receipt.subject,
      bullets,
      amount: receipt.amount ?? null,
      currency: receipt.currency || "USD",
      dueDate: receipt.dueDate ?? null,
      status: receipt.status || "sent",
      channel: receipt.channel || "email",
      createdAt: receipt.createdAt ? new Date(receipt.createdAt).toISOString() : new Date().toISOString(),
    },
    client: {
      name: receipt.clientName || client?.name || null,
      email: receipt.clientEmail || client?.email || null,
      phone: client?.phone || null,
    },
    signature: {
      action: sig?.action || "acknowledged",
      ip: sig?.ip || null,
      signedAt: sig?.createdAt ? new Date(sig.createdAt).toISOString() : new Date().toISOString(),
    },
    sender: {
      id: user.id,
      email: user.email,
      name: user.name || null,
      company: user.company || null,
    },
  };

  return fireWebhook(payload, user.webhookUrl);
}
