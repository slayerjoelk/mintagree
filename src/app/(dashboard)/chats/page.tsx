import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { conversationThreads } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export default async function ChatsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const threads = await db
    .select({
      id: conversationThreads.id,
      clientPhone: conversationThreads.clientPhone,
      clientName: conversationThreads.clientName,
      status: conversationThreads.status,
      source: conversationThreads.source,
      messageCount: conversationThreads.messageCount,
      lastMessageAt: conversationThreads.lastMessageAt,
      subject: conversationThreads.subject,
      draftReceiptId: conversationThreads.draftReceiptId,
      updatedAt: conversationThreads.updatedAt,
    })
    .from(conversationThreads)
    .where(eq(conversationThreads.userId, session.user.id))
    .orderBy(desc(conversationThreads.lastMessageAt))
    .limit(100);

  const statusConfig: Record<string, { label: string; color: string }> = {
    active: { label: "Active", color: "bg-emerald-100 text-emerald-700" },
    pending_review: { label: "Review", color: "bg-amber-100 text-amber-700" },
    completed: { label: "Done", color: "bg-slate-100 text-slate-600" },
    skipped: { label: "Skipped", color: "bg-red-100 text-red-700" },
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">WhatsApp Conversations</h2>
          <p className="text-slate-600 text-sm mt-1">
            {threads.length} conversation{threads.length !== 1 ? "s" : ""} · review AI-drafted receipts
          </p>
        </div>
      </div>

      {threads.length === 0 ? (
        <div className="rounded-2xl border bg-white p-12 text-center">
          <div className="text-4xl mb-3">💬</div>
          <h3 className="text-lg font-semibold mb-1">No conversations yet</h3>
          <p className="text-slate-600 text-sm mb-4">
            Connect your WhatsApp number to receive client messages and auto-generate receipts.
          </p>
          <Link
            href="/dashboard/settings"
            className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Configure WhatsApp
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="text-left px-4 py-3 font-medium text-slate-600">Client</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">Phone</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">Msgs</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">Last message</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {threads.map((t) => {
                const cfg = statusConfig[t.status || "active"] || statusConfig.active;
                return (
                  <tr key={t.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <span className="font-medium">
                        {t.clientName || "Unknown"}
                      </span>
                      {t.draftReceiptId && (
                        <span className="ml-2 inline-flex px-1.5 py-0.5 rounded text-xs bg-blue-50 text-blue-600 border border-blue-100">
                          Receipt
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600 hidden md:table-cell">
                      {t.clientPhone}
                    </td>
                    <td className="px-4 py-3 text-slate-600 hidden md:table-cell">
                      {t.messageCount}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}
                      >
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 hidden md:table-cell">
                      {t.lastMessageAt
                        ? new Date(t.lastMessageAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {t.status === "completed" && t.draftReceiptId ? (
                        <Link
                          href={`/dashboard/receipts/${t.draftReceiptId}`}
                          className="text-sm text-emerald-700 hover:underline font-medium"
                        >
                          View receipt
                        </Link>
                      ) : (
                        <Link
                          href={`/dashboard/chats/${t.id}`}
                          className="text-sm text-emerald-700 hover:underline font-medium"
                        >
                          {t.status === "pending_review" ? "Review draft" : "Open"}
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
