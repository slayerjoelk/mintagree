"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Thread {
  id: string;
  clientPhone: string;
  clientName: string | null;
  clientEmail: string | null;
  status: string;
  messageCount: number;
  lastMessageAt: string;
  aiSummary: string | null;
}

const STATUS_BADGE: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending_review: "bg-amber-50 text-amber-700 border-amber-200",
  completed: "bg-slate-100 text-slate-600 border-slate-200",
  skipped: "bg-slate-100 text-slate-400 border-slate-200",
};

const STATUS_LABEL: Record<string, string> = {
  active: "Active",
  pending_review: "Needs review",
  completed: "Done",
  skipped: "Skipped",
};

export default function ChatsPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function fetchThreads() {
      try {
        const res = await fetch(`/api/chats?status=${filter}`);
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        setThreads(data.threads || []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchThreads();
  }, [filter]);

  const filtered =
    filter === "all" ? threads : threads.filter((t) => t.status === filter);

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">WhatsApp conversations</h2>
        <select
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setLoading(true); }}
          className="rounded-xl border px-3 py-1.5 text-sm bg-white"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="pending_review">Needs review</option>
          <option value="completed">Done</option>
          <option value="skipped">Skipped</option>
        </select>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
        </div>
      )}

      {error && !loading && (
        <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600">No conversations yet.</p>
          <p className="text-sm text-slate-500 mt-2">
            When clients message your WhatsApp number, threads appear here.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((t) => (
          <Link
            key={t.id}
            href={`/dashboard/chats/${t.id}`}
            className="block rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">
                    {t.clientName || t.clientPhone}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full border text-xs ${STATUS_BADGE[t.status] || STATUS_BADGE.active}`}
                  >
                    {STATUS_LABEL[t.status] || t.status}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1 truncate">
                  {t.aiSummary || `${t.messageCount} messages`}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                  <span>{t.messageCount} msgs</span>
                  {t.lastMessageAt && (
                    <span>
                      {new Date(t.lastMessageAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <svg className="w-5 h-5 text-slate-400 mt-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
