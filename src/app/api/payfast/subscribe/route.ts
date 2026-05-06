import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import crypto from "crypto";

const PAYFAST_URL = "https://sandbox.payfast.co.za/eng/process";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const plan = body.plan as string;

  const merchantId = process.env.PAYFAST_MERCHANT_ID;
  const merchantKey = process.env.PAYFAST_MERCHANT_KEY;
  const passphrase = process.env.PAYFAST_PASSPHRASE;

  if (!merchantId || !merchantKey) {
    return NextResponse.json(
      { error: "PayFast not configured" },
      { status: 500 }
    );
  }

  const email = session.user.email || "";
  const name = session.user.name || "";

  const amounts: Record<string, string> = {
    starter: "19.00",
    pro: "39.00",
    enterprise: "149.00",
  };

  if (!amounts[plan]) {
    return NextResponse.json(
      { error: "Invalid plan. Use: starter, pro, enterprise" },
      { status: 400 }
    );
  }

  const data: Record<string, string> = {
    merchant_id: merchantId,
    merchant_key: merchantKey,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?payment=cancelled`,
    notify_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payfast/notify`,
    name_first: name.split(" ")[0] || "User",
    name_last: name.split(" ").slice(1).join(" ") || " ",
    email_address: email,
    m_payment_id: crypto.randomUUID(),
    amount: amounts[plan],
    item_name: `MintAgree ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
    custom_str1: plan,
    custom_str2: crypto.randomUUID(),
  };

  // Build signature: sorted keys, &key=value, append &passphrase=, MD5
  const sorted = Object.keys(data).sort();
  const pfOutput = sorted
    .filter((k) => k !== "signature")
    .map((k) => `${k}=${encodeURIComponent(data[k]).replace(/%20/g, "+")}`)
    .join("&");

  const signatureString = pfOutput + (passphrase ? `&passphrase=${encodeURIComponent(passphrase)}` : "");
  data.signature = crypto.createHash("md5").update(signatureString).digest("hex");

  // Build HTML auto-submit form
  const inputs = Object.entries(data)
    .map(([k, v]) => `<input type="hidden" name="${k}" value="${v.replace(/"/g, "&quot;")}" />`)
    .join("\n");

  const html = `<!DOCTYPE html>
<html>
<head><title>Redirecting to PayFast...</title></head>
<body onload="document.forms[0].submit()">
  <p>Redirecting to PayFast secure checkout...</p>
  <form method="POST" action="${PAYFAST_URL}">
    ${inputs}
  </form>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}
