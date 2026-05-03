import twilio from "twilio";
import { db } from "@/lib/db";
import { conversationThreads, messages, users, clients } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;

let _twilioClient: twilio.Twilio | null = null;

function getTwilioClient(): twilio.Twilio {
  if (!_twilioClient) {
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
      throw new Error("Twilio credentials not configured");
    }
    _twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  }
  return _twilioClient;
}

/** Verify Twilio webhook signature (required for production) */
export function verifyTwilioWebhook(
  url: string,
  params: Record<string, string>,
  signature: string
): boolean {
  if (!TWILIO_AUTH_TOKEN) return true; // dev fallback
  return twilio.validateRequest(
    TWILIO_AUTH_TOKEN,
    signature,
    url,
    params
  );
}

/** Upsert a conversation thread and store the incoming message */
export async function storeInboundMessage(params: {
  from: string;       // client's WhatsApp number
  to: string;         // Twilio WhatsApp number
  body: string;
  twilioSid: string;
  mediaUrl?: string | null;
}) {
  const { from, to, body, twilioSid, mediaUrl } = params;

  // Find user by matching Twilio number (stored user metadata or lookup table)
  // For MVP: we look up user by scanning all clients — NOT efficient, but works for small scale.
  // In production: store userId → Twilio phone mapping in a separate table.
  const allClients = await db.select().from(clients);
  const matchedClient = allClients.find(
    (c) => c.phone?.replace(/\s/g, "") === from.replace(/\s/g, "")
  );

  if (!matchedClient) {
    console.warn(`No client found for phone ${from}. Creating ghost thread.`);
    // We still store the message in a thread so the user can claim it later
  }

  const userId = matchedClient?.userId ?? "unclaimed";

  // Upsert conversation thread
  let thread = await db
    .select()
    .from(conversationThreads)
    .where(
      and(
        eq(conversationThreads.userId, userId),
        eq(conversationThreads.clientPhone, from),
        eq(conversationThreads.source, "whatsapp")
      )
    )
    .get();

  if (!thread) {
    const newThreadId = createId();
    await db.insert(conversationThreads).values({
      id: newThreadId,
      userId,
      clientPhone: from,
      clientName: null,
      clientEmail: matchedClient?.email ?? null,
      source: "whatsapp",
      status: "active",
      messageCount: 1,
      lastMessageAt: new Date(),
    });
    thread = {
      id: newThreadId,
      userId,
      clientPhone: from,
      clientName: null,
      clientEmail: matchedClient?.email ?? null,
      source: "whatsapp",
      status: "active",
      draftReceiptId: null,
      messageCount: 1,
      aiSummary: null,
      subject: null,
      lastMessageAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } else {
    await db
      .update(conversationThreads)
      .set({
        messageCount: (thread.messageCount ?? 0) + 1,
        lastMessageAt: new Date(),
        status: "needs_attention",
        updatedAt: new Date(),
      })
      .where(eq(conversationThreads.id, thread.id));
  }

  // Store message
  await db.insert(messages).values({
    id: createId(),
    threadId: thread.id,
    direction: "inbound",
    from,
    to,
    body,
    mediaUrl: mediaUrl ?? null,
    twilioSid,
    aiProcessed: false,
  });

  return { threadId: thread.id, isNew: !thread?.id };
}

/** Send a WhatsApp message via Twilio */
export async function sendWhatsAppMessage(
  to: string,
  body: string
): Promise<{ success: boolean; sid?: string; error?: string }> {
  try {
    const message = await getTwilioClient().messages.create({
      from: TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${to.replace(/^whatsapp:/, "")}`,
      body,
    });
    return { success: true, sid: message.sid };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Twilio send failed:", msg);
    return { success: false, error: msg };
  }
}

/** Map a user to their Twilio number. In production this should be a user_settings table. */
export async function resolveUserByWhatsAppNumber(
  toNumber: string
): Promise<{ userId: string; twilioNumber: string } | null> {
  // MVP: every user shares one Twilio number
  // V2: user_settings table with per-user Twilio numbers
  const user = await db.select().from(users).limit(1).get();
  if (!user) return null;
  return { userId: user.id, twilioNumber: toNumber };
}
