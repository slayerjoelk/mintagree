"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface Message {
  id: string;
  direction: "inbound" | "outbound";
  body: string;
  createdAt: string;
}

interface DraftReceipt {
  subject: string;
  bullets: string[];
  amount: number | null;
  currency: string;
  dueDate: string | null;
  confidence: number;
  clientName: string | null;
  aiSummary: string;
}

export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const threadId = params.threadId as string;

  const [thread, setThread] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState<DraftReceipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Editable form state
  const [subject, setSubject] = useState("");
  const [bullets, setBullets] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [sending, setSending] = useState(false);

  const statusLabel: Record<string, string> = {
    active: "Active",
    pending_review: "Needs review",
    completed: "Done",
    skipped: "Skipped",
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [detailRes, draftRes] = await Promise.all([
        fetch(`/api/chats/${threadId}`),
        fetch(`/api/chats/${threadId}/draft`),
      ]);

      if (!detailRes.ok) {
        const err = await detailRes.json();
        throw new Error(err.error || "Failed to load thread");
      }

      const detail = await detailRes.json();
      setThread(detail.thread);
      setMessages(detail.messages);

      if (draftRes.ok) {
        const d = await draftRes.json();
        setDraft(d.draft);
        // Pre-fill form
        setSubject(d.draft.subject || "");
        setBullets(d.draft.bullets.join("\n") || "");
        setAmount(d.draft.amount ? String(d.draft.amount) : "");
        setCurrency(d.draft.currency || "USD");
        setClientName(d.draft.clientName || detail.thread.clientName || "");
        setClientEmail(detail.thread.clientEmail || "");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [threadId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSend = async () => {
    setSending(true);
    try {
      const body = {
        subject,
        bullets: bullets
          .split("\n")
          .map((b) => b.trim())
          .filter((b) => b.length > 0),
        amount: amount ? parseFloat(amount) : null,
        currency,
        clientPhone: thread?.clientPhone,
        clientName: clientName || null,
        clientEmail: clientEmail || null,
        requireOtp: true,
      };

      const res = await fetch(`/api/chats/${threadId}/send`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Send failed");
      }

      router.push(`/dashboard/receipts/${data.receipt.id}`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  };

  const handleSkip = async () => {
    fetch(`/api/chats/${threadId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: "skipped" }),
    }).catch(() => {});
    router.push("/dashboard/chats");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border bg-red-50 border-red-200 p-8 text-center">
        <p className="text-red-700">{error}</p>
        <Link
          href="/dashboard/chats"
          className="mt-4 inline-flex items-center text-sm text-emerald-700 hover:underline"
        >
          ← Back to conversations
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/dashboard/chats"
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              ← WhatsApp
            </Link>
          </div>
          <h2 className="text-xl font-semibold">
            {thread.clientName || thread.clientPhone}
          </h2>
          <p className="text-sm text-slate-500">
            {statusLabel[thread.status] || thread.status} · {messages.length} messages
            {draft && (
              <span className="ml-2">· AI confidence {Math.round(draft.confidence * 100)}%</span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSkip}
            className="rounded-xl border px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
          >
            Skip
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chat history */}
        <div className="rounded-2xl border bg-white overflow-hidden flex flex-col max-h-[600px]">
          <div className="px-4 py-3 border-b bg-slate-50">
            <span className="text-sm font-medium text-slate-700">Chat history</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.direction === "inbound" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.direction === "inbound"
                      ? "bg-slate-100 text-slate-800 rounded-bl-sm"
                      : "bg-emerald-600 text-white rounded-br-sm"
                  }`}
                >
                  <p>{m.body}</p>
                  <p
                    className={`text-[10px] mt-1 ${
                      m.direction === "inbound" ? "text-slate-400" : "text-emerald-200"
                    }`}
                  >
                    {new Date(m.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Draft editor */}
        <div className="rounded-2xl border bg-white overflow-hidden">
          <div className="px-4 py-3 border-b bg-slate-50 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">AI Draft Receipt</span>
            {draft && (
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  draft.confidence >= 0.7
                    ? "bg-emerald-100 text-emerald-700"
                    : draft.confidence >= 0.4
                    ? "bg-amber-100 text-amber-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {Math.round(draft.confidence * 100)}%
              </span>
            )}
          </div>

          <div className="p-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Client name
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Client email (optional, for backup)
              </label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                placeholder="client@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Scope / Bullets (one per line)
              </label>
              <textarea
                value={bullets}
                onChange={(e) => setBullets(e.target.value)}
                rows={6}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="USD">USD</option>
                  <option value="ZAR">ZAR</option>
                  <option value="GBP">GBP</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleSend}
                disabled={sending}
                className="w-full inline-flex items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Sending…
                  </>
                ) : (
                  "Send receipt to client"
                )}
              </button>
              <p className="text-xs text-slate-400 text-center mt-2">
                WhatsApp message + email backup with OTP verification
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
