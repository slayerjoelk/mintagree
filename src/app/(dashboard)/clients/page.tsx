"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Client {
  id: string;
  email: string;
  name: string | null;
  company: string | null;
  createdAt: string | Date | null;
}

export default function ClientsPage() {
  const [clientsList, setClientsList] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [formEmail, setFormEmail] = useState("");
  const [formName, setFormName] = useState("");
  const [formCompany, setFormCompany] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const fetchClients = useCallback(async () => {
    try {
      const res = await fetch("/api/clients");
      if (!res.ok) throw new Error("Failed to load clients");
      const data = await res.json();
      setClientsList(data.clients || []);
    } catch {
      setError("Could not load clients");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const filtered = clientsList.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.email.toLowerCase().includes(q) ||
      (c.name?.toLowerCase() || "").includes(q) ||
      (c.company?.toLowerCase() || "").includes(q)
    );
  });

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setFormLoading(true);
    setError("");
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formEmail, name: formName || null, company: formCompany || null }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to add client");
        setFormLoading(false);
        return;
      }
      setClientsList([data.client, ...clientsList]);
      setShowAddForm(false);
      setFormEmail("");
      setFormName("");
      setFormCompany("");
    } catch {
      setError("Network error");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleUpdate(e: React.FormEvent, id: string) {
    e.preventDefault();
    setFormLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formEmail, name: formName || null, company: formCompany || null }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update client");
        setFormLoading(false);
        return;
      }
      setClientsList(clientsList.map((c) => (c.id === id ? data.client : c)));
      setEditingId(null);
    } catch {
      setError("Network error");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this client?")) return;
    try {
      const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setClientsList(clientsList.filter((c) => c.id !== id));
    } catch {
      setError("Failed to delete client");
    }
  }

  function startEdit(c: Client) {
    setEditingId(c.id);
    setFormEmail(c.email);
    setFormName(c.name || "");
    setFormCompany(c.company || "");
    setError("");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Clients</h2>
          <p className="text-slate-600 text-sm mt-1">
            {clientsList.length} client{clientsList.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => { setShowAddForm(true); setEditingId(null); setFormEmail(""); setFormName(""); setFormCompany(""); setError(""); }}
          className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700"
        >
          + Add client
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search clients..."
          className="w-full md:w-72 rounded-lg border border-slate-200 px-3 py-2 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Add / Edit form */}
      {(showAddForm || editingId) && (
        <form
          onSubmit={editingId ? (e) => handleUpdate(e, editingId) : handleAdd}
          className="rounded-2xl border bg-white p-5 shadow-sm mb-6 space-y-3"
        >
          <h3 className="font-semibold text-sm">{editingId ? "Edit client" : "New client"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">Email</label>
              <input
                type="email"
                required
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Name</label>
              <input
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Company</label>
              <input
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                value={formCompany}
                onChange={(e) => setFormCompany(e.target.value)}
              />
            </div>
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={formLoading}
              className="rounded-lg px-4 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {formLoading ? "Saving..." : editingId ? "Update" : "Add"}
            </button>
            <button
              type="button"
              onClick={() => { setShowAddForm(false); setEditingId(null); setError(""); }}
              className="rounded-lg border px-4 py-2 text-sm bg-white hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      {loading ? (
        <div className="text-slate-500 text-sm">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border bg-white p-12 text-center">
          <div className="text-4xl mb-3">👥</div>
          <h3 className="text-lg font-semibold mb-1">No clients found</h3>
          <p className="text-slate-600 text-sm mb-4">
            {search ? "Try a different search term." : "Clients are added when you send receipts or add them manually."}
          </p>
          {!search && (
            <Link
              href="/dashboard/receipts/new"
              className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Create a receipt
            </Link>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="text-left px-4 py-3 font-medium text-slate-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Email</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">Company</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">Added</th>
                <th className="text-right px-4 py-3 font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{c.name || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{c.email}</td>
                  <td className="px-4 py-3 text-slate-600 hidden md:table-cell">{c.company || "—"}</td>
                  <td className="px-4 py-3 text-slate-500 hidden md:table-cell">
                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => startEdit(c)}
                      className="text-xs text-emerald-700 hover:underline mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Delete
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
