import { NextRequest, NextResponse } from "next/server";
import { storeInboundMessage } from "@/lib/whatsapp";

// Disable body parsing so we can read raw form data
export const dynamic = "force-dynamic";

/**
 * Twilio incoming WhatsApp webhook
 * Twilio sends x-www-form-urlencoded data with these fields:
 *   From, To, Body, MessageSid, NumMedia, MediaContentType0, MediaUrl0...
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const from = formData.get("From") as string | null;
    const to = formData.get("To") as string | null;
    const body = (formData.get("Body") as string | null) ?? "";
    const twilioSid = (formData.get("MessageSid") as string | null) ?? "";
    const numMedia = parseInt((formData.get("NumMedia") as string | null) ?? "0", 10);

    if (!from || !to) {
      return new Response(
        '<?xml version="1.0" encoding="UTF-8"?><Response/>',
        { status: 200, headers: { "Content-Type": "text/xml" } }
      );
    }

    // Extract first media URL if present
    let mediaUrl: string | null = null;
    if (numMedia > 0) {
      mediaUrl = (formData.get("MediaUrl0") as string | null) ?? null;
    }

    await storeInboundMessage({
      from,
      to,
      body,
      twilioSid,
      mediaUrl,
    });

    // Return empty TwiML — Twilio expects XML response
    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?><Response/>',
      { status: 200, headers: { "Content-Type": "text/xml" } }
    );
  } catch (err) {
    console.error("Twilio webhook error:", err);
    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?><Response/>',
      { status: 200, headers: { "Content-Type": "text/xml" } }
    );
  }
}
