"use client";

import { useState, useEffect } from "react";

interface Receipt {
  id: string;
  subject: string;
  bullets: string[];
  amount: number | null;
  currency: string;
  dueDate: string | null;
  requireOtp: boolean;
  status: string;
  channel: string;
  createdAt: string;
}

export default function SignPage({ params }: { params: { token: string } }) {
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [signing, setSigning] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [otp, setOtp] = useState("");
  const [clientName, setClientName] = useState("");

  useEffect(() => {
    fetch(`/api/sign/${params.token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setReceipt(data.receipt);
        }
      })
      .catch(() => setError("Failed to load receipt"))
      .finally(() => setLoading(false));
  }, [params.token]);

  async function handleSign(action: "acknowledged" | "disputed") {
    setSigning(true);
    setError("");

    try {
      const res = await fetch(`/api/sign/${params.token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          clientName: clientName || null,
          otp: receipt?.requireOtp ? otp : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Sign-off failed");
        setSigning(false);
        return;
      }

      setResult({ success: true, message: data.message });
    } catch {
      setError("Network error. Please try again.");
    }

    setSigning(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-600 border-t-transparent mx-auto mb-3" />
          <p className="text-slate-600 text-sm">Loading receipt...</p>
        </div>
      </div>
    );
  }

  if (error && !receipt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white">
        <div className="rounded-2xl border bg-white p-8 shadow-sm max-w-md text-center">
          <div className="text-4xl mb-3">🔍</div>
          <h2 className="text-xl font-semibold mb-1">Receipt not found</h2>
          <p className="text-slate-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white">
        <div className="rounded-2xl border bg-white p-8 shadow-sm max-w-md text-center">
          <div className="text-5xl mb-3">
            {result.message.includes("✅") ? "✅" : "⚡"}
          </div>
          <h2 className="text-xl font-semibold mb-2">
            {result.message.includes("✅") ? "Confirmed!" : "Noted"}
          </h2>
          <p className="text-slate-600 text-sm">{result.message}</p>
        </div>
      </div>
    );
  }

  const r = receipt!;
  const alreadyDone = r.status === "signed" || r.status === "disputed";
  const isWhatsApp = r.channel === "whatsapp";
  const isEmail = r.channel === "email" || !r.channel;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <span className="inline-block w-3 h-3 rounded-full bg-emerald-500" />
            <span className="font-semibold text-lg">MintAgree</span>
          </div>
          <p className="text-slate-500 text-sm">
            Voice agreement &amp; client sign-off
          </p>
        </div>

        {/* Receipt card */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-semibold">{r.subject}</h2>
            <div className="flex gap-1.5">
              {/* Channel badge */}
              {isWhatsApp ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                  💬 WhatsApp
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  📧 Email
                </span>
              )}
              {alreadyDone && (
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                    r.status === "signed"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {r.status}
                </span>
              )}
            </div>
          </div>

          {/* Channel notice */}
          <div className={`text-xs mb-4 p-2 rounded-lg ${
            isWhatsApp
              ? "bg-green-50 text-green-700 border border-green-100"
              : "bg-blue-50 text-blue-700 border border-blue-100"
          }`}>
            {isWhatsApp
              ? "This agreement was drafted from your WhatsApp conversation and sent for confirmation."
              : "This agreement was sent to your email for confirmation."}
          </div>

          <ul className="list-disc pl-5 space-y-1 mb-4">
            {r.bullets.map((b, i) => (
              <li key={i} className="text-slate-700 text-sm">
                {b}
              </li>
            ))}
          </ul>

          {r.amount && (
            <p className="text-sm mb-1">
              <strong>Amount:</strong>{" "}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: r.currency || "USD",
              }).format(r.amount)}
            </p>
          )}

          {r.dueDate && (
            <p className="text-sm mb-1">
              <strong>Due:</strong> {r.dueDate}
            </p>
          )}
        </div>

        {/* Sign-off section */}
        {!alreadyDone && (
          <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="font-semibold mb-4">Confirm this agreement</h3>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Your name
                </label>
                <input
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>

              {r.requireOtp && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Verification code
                  </label>
                  <input
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono text-lg tracking-widest"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="000000"
                    maxLength={6}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {isWhatsApp
                      ? "Enter the 6-digit code sent to you via WhatsApp or email"
                      : "Enter the 6-digit code from the email you received"}
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 mb-4">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                disabled={signing}
                onClick={() => handleSign("acknowledged")}
                className="flex-1 inline-flex items-center justify-center rounded-xl border px-4 py-3 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {signing ? "Submitting..." : "I agree ✅"}
              </button>
              <button
                disabled={signing}
                onClick={() => handleSign("disputed")}
                className="inline-flex items-center justify-center rounded-xl border px-4 py-3 text-sm font-medium bg-white hover:bg-slate-50 disabled:opacity-50"
              >
                {signing ? "..." : "Dispute"}
              </button>
            </div>
          </div>
        )}

        {alreadyDone && (
          <div className="mt-6 rounded-2xl border bg-slate-50 p-6 shadow-sm text-center">
            <p className="text-slate-600 text-sm">
              {r.status === "signed"
                ? "This receipt has already been signed. No further action needed."
                : "This receipt has been disputed. Your contact will follow up."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
