"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Receipt {
  id: string;
  subject: string;
  status: string | null;
  clientEmail: string | null;
  clientName: string | null;
  amount: number | null;
  currency: string | null;
  createdAt: string | Date | null;
}

interface Props {
  receipts: Receipt[];
}

export default function ReceiptsList({ receipts }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = receipts.filter((r) => {
    const q = search.toLowerCase();
    const matchesSearch =
      r.subject.toLowerCase().includes(q) ||
      (r.clientName?.toLowerCase() || "").includes(q) ||
      (r.clientEmail?.toLowerCase() || "").includes(q);
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  async function handleDelete(id: string) {
    if (!confirm("Delete this receipt?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/receipts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      router.refresh();
    } catch {
      alert("Failed to delete receipt");
    } finally {
      setDeletingId(null);
    }
  }

  const statusColors: Record<string, string> = {
    draft: "bg-slate-100 text-slate-700",
    sent: "bg-blue-100 text-blue-700",
    viewed: "bg-yellow-100 text-yellow-700",
    signed: "bg-emerald-100 text-emerald-700",
    disputed: "bg-red-100 text-red-700",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Receipts</h2>
          <p className="text-slate-600 text-sm mt-1">
            {filtered.length} of {receipts.length} receipt{receipts.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/dashboard/receipts/new"
          className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700"
        >
          New receipt
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search receipts..."
          className="w-full sm:w-72 rounded-lg border border-slate-200 px-3 py-2 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="viewed">Viewed</option>
          <option value="signed">Signed</option>
          <option value="disputed">Disputed</option>
        </select>
      </div>

      {receipts.length === 0 ? (
        <div className="rounded-2xl border bg-white p-12 text-center">
          <div className="text-4xl mb-3">📋</div>
          <h3 className="text-lg font-semibold mb-1">No receipts yet</h3>
          <p className="text-slate-600 text-sm mb-4">Create your first conversation receipt and send it to a client.</p>
          <Link
            href="/dashboard/receipts/new"
            className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Create receipt
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="text-left px-4 py-3 font-medium text-slate-600">Subject</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">Client</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">Amount</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">Date</th>
                <th className="text-right px-4 py-3 font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/receipts/${r.id}`}
                      className="font-medium hover:text-emerald-700"
                    >
                      {r.subject}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600 hidden md:table-cell">
                    {r.clientName || r.clientEmail || "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600 hidden md:table-cell">
                    {r.amount
                      ? new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: r.currency || "USD",
                        }).format(r.amount)
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        statusColors[r.status || "draft"] || statusColors.draft
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 hidden md:table-cell">
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dashboard/receipts/${r.id}/edit`}
                      className="text-xs text-emerald-700 hover:underline mr-3"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(r.id)}
                      disabled={deletingId === r.id}
                      className="text-xs text-red-600 hover:underline disabled:opacity-50"
                    >
                      {deletingId === r.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
