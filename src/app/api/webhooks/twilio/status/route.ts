import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { receiptDelivery } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

/**
 * Twilio status callback webhook
 * https://www.twilio.com/docs/usage/webhooks/sms-webhooks#webhook-status-callbacks
 * Fields: MessageSid, MessageStatus (queued, sent, delivered, read, failed, undelivered)
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const messageSid = formData.get("MessageSid") as string | null;
    const status = formData.get("MessageStatus") as string | null;

    if (!messageSid || !status) {
      return new Response(null, { status: 200 });
    }

    // Map Twilio status to our status enum
    let mapped: string;
    switch (status) {
      case "queued":
      case "sending":
        mapped = "sent";
        break;
      case "sent":
        mapped = "delivered";
        break;
      case "delivered":
      case "read":
        mapped = status; // already matches
        break;
      case "failed":
      case "undelivered":
        mapped = "failed";
        break;
      default:
        mapped = "sent";
    }

    // Update delivery record by external_id
    await db
      .update(receiptDelivery)
      .set({ status: mapped })
      .where(eq(receiptDelivery.externalId, messageSid));

    return new Response(null, { status: 200 });
  } catch (err) {
    console.error("Twilio status callback error:", err);
    return new Response(null, { status: 200 });
  }
}
