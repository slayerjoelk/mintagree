"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Template {
  id: string;
  name: string;
  subject: string | null;
  bullets: string;
  amount: number | null;
  industry: string | null;
  createdAt: string | Date | null;
}

export default function TemplatesPage() {
  const router = useRouter();
  const [templatesList, setTemplatesList] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [editBullets, setEditBullets] = useState<string[]>([]);
  const [editAmount, setEditAmount] = useState("");
  const [editIndustry, setEditIndustry] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const fetchTemplates = useCallback(async () => {
    try {
      const res = await fetch("/api/templates");
      if (!res.ok) throw new Error("Failed to load templates");
      const data = await res.json();
      setTemplatesList(data.templates || []);
    } catch {
      setError("Could not load templates");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  function startEdit(t: Template) {
    let bullets: string[] = [];
    try { bullets = JSON.parse(t.bullets || "[]"); } catch { /* corrupted */ }
    setEditingId(t.id);
    setEditName(t.name);
    setEditSubject(t.subject || "");
    setEditBullets(bullets.length ? bullets : [""]);
    setEditAmount(t.amount ? String(t.amount) : "");
    setEditIndustry(t.industry || "");
    setError("");
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    setEditLoading(true);
    setError("");

    const filtered = editBullets.filter((b) => b.trim());
    if (!editName.trim()) { setError("Name is required."); setEditLoading(false); return; }
    if (!filtered.length) { setError("At least one bullet is required."); setEditLoading(false); return; }

    try {
      const res = await fetch(`/api/templates/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          subject: editSubject || undefined,
          bullets: filtered,
          amount: editAmount ? parseFloat(editAmount) : undefined,
          industry: editIndustry || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update template");
        setEditLoading(false);
        return;
      }
      setTemplatesList(templatesList.map((t) => (t.id === editingId ? data.template : t)));
      setEditingId(null);
    } catch {
      setError("Network error");
    } finally {
      setEditLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this template?")) return;
    try {
      const res = await fetch(`/api/templates/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setTemplatesList(templatesList.filter((t) => t.id !== id));
    } catch {
      setError("Failed to delete template");
    }
  }

  function useTemplate(t: Template) {
    const params = new URLSearchParams();
    params.set("templateId", t.id);
    router.push(`/dashboard/receipts/new?${params.toString()}`);
  }

  function updateBullet(i: number, v: string) {
    const n = [...editBullets];
    n[i] = v;
    setEditBullets(n);
  }
  function addBullet() { setEditBullets([...editBullets, ""]); }
  function removeBullet(i: number) { setEditBullets(editBullets.filter((_, x) => x !== i)); }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Templates</h2>
          <p className="text-slate-600 text-sm mt-1">
            {templatesList.length} template{templatesList.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/dashboard/templates/new"
          className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700"
        >
          New template
        </Link>
      </div>

      {error && !editingId && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 mb-4">{error}</div>
      )}

      {loading ? (
        <div className="text-slate-500 text-sm">Loading...</div>
      ) : templatesList.length === 0 ? (
        <div className="rounded-2xl border bg-white p-12 text-center">
          <div className="text-4xl mb-3">📋</div>
          <h3 className="text-lg font-semibold mb-1">No templates yet</h3>
          <p className="text-slate-600 text-sm mb-4">
            Create reusable receipt templates with pre-filled bullets, amounts, and subjects.
          </p>
          <Link
            href="/dashboard/templates/new"
            className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Create template
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {templatesList.map((t) => {
            let bullets: string[] = [];
            try { bullets = JSON.parse(t.bullets || "[]"); } catch { /* corrupted row */ }

            if (editingId === t.id) {
              return (
                <form
                  key={t.id}
                  onSubmit={handleUpdate}
                  className="rounded-2xl border bg-white p-5 shadow-sm space-y-3"
                >
                  <h3 className="font-semibold text-sm">Edit template</h3>
                  <div>
                    <label className="block text-xs font-medium mb-1">Name</label>
                    <input
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Subject</label>
                    <input
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      value={editSubject}
                      onChange={(e) => setEditSubject(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Bullets</label>
                    <div className="space-y-2">
                      {editBullets.map((b, i) => (
                        <div key={i} className="flex gap-2">
                          <input
                            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                            value={b}
                            onChange={(e) => updateBullet(i, e.target.value)}
                          />
                          <button type="button" className="rounded-lg border px-3 py-1 text-sm bg-white hover:bg-slate-50" onClick={() => removeBullet(i)}>−</button>
                        </div>
                      ))}
                      <button type="button" className="rounded-lg border px-3 py-1 text-sm bg-white hover:bg-slate-50" onClick={addBullet}>+ Add bullet</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1">Amount</label>
                      <input type="number" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} placeholder="0.00" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Industry</label>
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" value={editIndustry} onChange={(e) => setEditIndustry(e.target.value)} />
                    </div>
                  </div>
                  {error && <div className="text-sm text-red-600">{error}</div>}
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={editLoading}
                      className="rounded-lg px-4 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {editLoading ? "Saving..." : "Update"}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEditingId(null); setError(""); }}
                      className="rounded-lg border px-4 py-2 text-sm bg-white hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              );
            }

            return (
              <div key={t.id} className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{t.name}</h3>
                  {t.industry && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{t.industry}</span>
                  )}
                </div>
                {t.subject && (
                  <p className="text-sm text-slate-600 mb-2">{t.subject}</p>
                )}
                <ul className="list-disc pl-5 text-sm space-y-0.5 mb-3">
                  {bullets.slice(0, 5).map((b, i) => (
                    <li key={i} className="text-slate-700">{b}</li>
                  ))}
                  {bullets.length > 5 && (
                    <li className="text-slate-400">+{bullets.length - 5} more items</li>
                  )}
                </ul>
                {t.amount && (
                  <p className="text-xs text-slate-500">Default amount: ${t.amount}</p>
                )}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => useTemplate(t)}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    Use template
                  </button>
                  <button
                    onClick={() => startEdit(t)}
                    className="rounded-lg border px-3 py-1.5 text-xs bg-white hover:bg-slate-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="rounded-lg border px-3 py-1.5 text-xs text-red-600 bg-white hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
