import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

const FROM = process.env.EMAIL_FROM || "MintAgree <receipts@mintagree.com>";

export async function sendMagicLinkEmail(
  email: string,
  url: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Sign in to AgreeMint",
      html: magicLinkTemplate(url),
    });
    if (error) return { success: false, error: error instanceof Error ? error.message : (error as {message?: string}).message ?? String(error) };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function sendReceiptEmail(
  to: string,
  subject: string,
  body: {
    bullets: string[];
    amount: number | null;
    currency: string;
    dueDate: string | null;
    requireOtp: boolean;
    otp: string | null;
    signUrl: string;
  }
): Promise<{ success: boolean; error?: string }> {
  const { bullets, amount, currency, dueDate, requireOtp, otp, signUrl } =
    body;

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to,
      subject,
      html: receiptEmailTemplate({
        subject,
        bullets,
        amount,
        currency,
        dueDate,
        requireOtp,
        otp,
        signUrl,
      }),
    });
    if (error) return { success: false, error: error instanceof Error ? error.message : (error as {message?: string}).message ?? String(error) };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function sendReceiptSignedNotification(
  to: string,
  subject: string,
  clientName: string | null,
  action: string
): Promise<{ success: boolean; error?: string }> {
  const name = escapeHtml(clientName || "Your client");
  const safeSubject = escapeHtml(subject);
  const verb = action === "acknowledged" ? "signed" : "disputed";

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to,
      subject: `${name} ${verb} your receipt`,
      html: `<div style="font-family:sans-serif;max-width:500px;margin:0 auto">
        <h2>Receipt ${verb}</h2>
        <p>${name} has <strong>${verb}</strong> the receipt &ldquo;${safeSubject}&rdquo;.</p>
        ${action === "disputed" ? '<p style="color:#dc2626">Action required — follow up with your client to resolve the dispute.</p>' : '<p>The agreement is now confirmed. ✅</p>'}
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />
        <p style="font-size:12px;color:#9ca3af">Sent by AgreeMint — voice agreement &amp; client sign-off software</p>
      </div>`,
    });
    if (error) return { success: false, error: error instanceof Error ? error.message : (error as {message?: string}).message ?? String(error) };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// ── Templates ──

function magicLinkTemplate(url: string): string {
  return `
    <div style="font-family:sans-serif;max-width:500px;margin:0 auto">
      <div style="text-align:center;padding:20px 0">
        <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#059669;margin-right:6px"></span>
        <strong>AgreeMint</strong>
      </div>
      <h2>Sign in to AgreeMint</h2>
      <p>Click the button below to sign in. This link expires in 10 minutes and can only be used once.</p>
      <a href="${url}" style="display:inline-block;background:#059669;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">Sign in</a>
      <p style="font-size:12px;color:#9ca3af">If you didn't request this, you can safely ignore this email.</p>
    </div>`;
}

function receiptEmailTemplate(args: {
  subject: string;
  bullets: string[];
  amount: number | null;
  currency: string;
  dueDate: string | null;
  requireOtp: boolean;
  otp: string | null;
  signUrl: string;
}): string {
  const { subject, bullets, amount, currency, dueDate, requireOtp, otp, signUrl } = args;

  const safeSubject = escapeHtml(subject);
  const safeBullets = bullets.map(escapeHtml);
  const safeDueDate = dueDate ? escapeHtml(dueDate) : null;

  const amountStr =
    amount !== null
      ? new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount)
      : null;

  return `
    <div style="font-family:sans-serif;max-width:500px;margin:0 auto">
      <div style="text-align:center;padding:20px 0;border-bottom:1px solid #e5e7eb">
        <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#059669;margin-right:6px"></span>
        <strong>AgreeMint</strong>
      </div>
      <h2>${safeSubject}</h2>
      <ul style="padding-left:20px;line-height:1.6">
        ${safeBullets.map((b) => `<li>${b}</li>`).join("")}
      </ul>
      ${amountStr ? `<p><strong>Amount:</strong> ${amountStr}</p>` : ""}
      ${safeDueDate ? `<p><strong>Due:</strong> ${safeDueDate}</p>` : ""}
      ${requireOtp && otp ? `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:16px 0;text-align:center"><p style="margin:0;font-size:12px;color:#166534">Your one-time verification code:</p><p style="margin:8px 0 0;font-size:24px;font-weight:700;letter-spacing:4px;color:#065f46">${otp}</p></div>` : ""}
      <p>Please review and confirm this agreement.</p>
      <a href="${signUrl}" style="display:inline-block;background:#059669;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Review &amp; Sign</a>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />
      <p style="font-size:12px;color:#9ca3af">This is a conversation receipt — not a legally binding contract. Sent via AgreeMint.</p>
    </div>`;
}
