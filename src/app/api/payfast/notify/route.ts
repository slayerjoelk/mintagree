import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

// PayFast ITN (Instant Transaction Notification) handler
// https://developers.payfast.co.za/docs#step_3_confirming_the_payment

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const body: Record<string, string> = {};
    formData.forEach((value, key) => {
      body[key] = String(value);
    });

    // 1. Verify signature
    const signature = body.signature;
    delete body.signature;

    const passphrase = process.env.PAYFAST_PASSPHRASE || "";
    const pfOutput = Object.keys(body)
      .sort()
      .map((k) => `${k}=${encodeURIComponent(body[k]).replace(/%20/g, "+")}`)
      .join("&");
    const expectedSig = crypto
      .createHash("md5")
      .update(pfOutput + (passphrase ? `&passphrase=${encodeURIComponent(passphrase)}` : ""))
      .digest("hex");

    if (signature !== expectedSig) {
      console.error("PayFast ITN signature mismatch");
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // 2. Validate payment status
    const paymentStatus = body.payment_status;
    if (paymentStatus !== "COMPLETE") {
      console.log(`PayFast ITN: payment_status=${paymentStatus}, skipping`);
      return NextResponse.json({ ok: true });
    }

    // 3. Extract plan from custom_str1
    const plan = body.custom_str1 || "starter";
    const buyerEmail = body.email_address;

    if (!buyerEmail) {
      console.error("PayFast ITN: missing email_address");
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // 4. Update user plan
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, buyerEmail))
      .limit(1);

    if (!user) {
      console.error(`PayFast ITN: no user found for email ${buyerEmail}`);
      return NextResponse.json({ ok: false }, { status: 404 });
    }

    await db
      .update(users)
      .set({ plan })
      .where(eq(users.id, user.id));

    console.log(`PayFast ITN: upgraded user ${user.id} to plan ${plan}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("PayFast ITN handler error:", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
