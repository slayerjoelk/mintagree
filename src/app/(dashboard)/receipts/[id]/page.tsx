import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { receipts, attachments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function ReceiptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const [receipt] = await db
    .select()
    .from(receipts)
    .where(eq(receipts.id, id))
    .limit(1);

  if (!receipt || receipt.userId !== session.user.id) {
    return (
      <div className="max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4">Receipt not found</h2>
        <Link href="/dashboard/receipts" className="text-emerald-600 hover:underline text-sm">
          ← Back to receipts
        </Link>
      </div>
    );
  }

  const receiptAttachments = await db
    .select()
    .from(attachments)
    .where(eq(attachments.receiptId, id));

  let bullets: string[] = [];
  try { bullets = JSON.parse(receipt.bullets || "[]"); } catch { /* corrupted row */ }

  const statusColors: Record<string, string> = {
    draft: "bg-slate-100 text-slate-700",
    sent: "bg-blue-100 text-blue-700",
    viewed: "bg-yellow-100 text-yellow-700",
    signed: "bg-emerald-100 text-emerald-700",
    disputed: "bg-red-100 text-red-700",
  };

  const signUrl = `${process.env.NEXT_PUBLIC_APP_URL}/sign/${receipt.token}`;

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link
          href="/dashboard/receipts"
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          ← Back to receipts
        </Link>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-2xl font-semibold">{receipt.subject}</h2>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                statusColors[receipt.status || "draft"] || statusColors.draft
              }`}
            >
              {receipt.status}
            </span>
            <Link
              href={`/dashboard/receipts/${receipt.id}/edit`}
              className="rounded-lg border px-3 py-1 text-xs bg-white hover:bg-slate-50"
            >
              Edit
            </Link>
          </div>
        </div>

        <ul className="list-disc pl-5 space-y-1 mb-4">
          {bullets.map((b, i) => (
            <li key={i} className="text-slate-700">{b}</li>
          ))}
        </ul>

        {receipt.amount && (
          <p className="text-sm mb-1">
            <strong>Amount:</strong>{" "}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: receipt.currency || "USD",
            }).format(receipt.amount)}
          </p>
        )}

        {receipt.dueDate && (
          <p className="text-sm mb-1">
            <strong>Due:</strong> {receipt.dueDate}
          </p>
        )}

        {receipt.clientEmail && (
          <p className="text-sm mb-1">
            <strong>Client:</strong> {receipt.clientName || receipt.clientEmail}{" "}
            <span className="text-slate-500">({receipt.clientEmail})</span>
          </p>
        )}

        {receipt.requireOtp && receipt.otp && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
            <p className="text-xs text-emerald-700 mb-1">OTP verification code</p>
            <p className="text-2xl font-mono font-bold tracking-widest text-emerald-800">
              {receipt.otp}
            </p>
          </div>
        )}

        {receiptAttachments.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Attachments</p>
            <div className="flex flex-wrap gap-2">
              {receiptAttachments.map((a) => (
                <a
                  key={a.id}
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border px-3 py-1 text-sm hover:bg-slate-50"
                >
                  📎 {a.filename}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t flex gap-3">
          <div className="flex-1">
            <p className="text-xs text-slate-500 mb-1">Client sign-off link</p>
            <div className="flex gap-2">
              <input
                readOnly
                value={signUrl}
                className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs bg-slate-50"
              />
              <button
                onClick={() => navigator.clipboard.writeText(signUrl)}
                className="rounded-lg border px-3 py-1.5 text-xs bg-white hover:bg-slate-50"
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-3">
          Created {receipt.createdAt ? new Date(receipt.createdAt).toLocaleString() : "—"}
        </p>
      </div>
    </div>
  );
}
