"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewTemplatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [bullets, setBullets] = useState([""]);
  const [amount, setAmount] = useState("");
  const [industry, setIndustry] = useState("");

  function updateBullet(i: number, v: string) {
    const n = [...bullets];
    n[i] = v;
    setBullets(n);
  }
  function addBullet() { setBullets([...bullets, ""]); }
  function removeBullet(i: number) { setBullets(bullets.filter((_, x) => x !== i)); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const filtered = bullets.filter((b) => b.trim());
    if (!name.trim()) { setError("Name is required."); setLoading(false); return; }
    if (!filtered.length) { setError("At least one bullet is required."); setLoading(false); return; }

    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          subject: subject || undefined,
          bullets: filtered,
          amount: amount ? parseFloat(amount) : undefined,
          industry: industry || undefined,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Failed to create template");
        setLoading(false);
        return;
      }
      router.push("/dashboard/templates");
    } catch {
      setError("Network error.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link href="/dashboard/templates" className="text-sm text-slate-500 hover:text-slate-700">
          ← Back to templates
        </Link>
        <h2 className="text-2xl font-semibold mt-1">New template</h2>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Template name</label>
          <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Default subject</label>
          <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bullet points</label>
          <div className="space-y-2">
            {bullets.map((b, i) => (
              <div key={i} className="flex gap-2">
                <input className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" value={b} onChange={(e) => updateBullet(i, e.target.value)} />
                <button type="button" className="rounded-lg border px-3 py-1 text-sm bg-white hover:bg-slate-50" onClick={() => removeBullet(i)}>−</button>
              </div>
            ))}
            <button type="button" className="rounded-lg border px-3 py-1 text-sm bg-white hover:bg-slate-50" onClick={addBullet}>+ Add bullet</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Default amount</label>
            <input type="number" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Industry</label>
            <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. Agency, Consulting" />
          </div>
        </div>

        {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <button type="submit" disabled={loading} className="inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50">
          {loading ? "Creating..." : "Create template"}
        </button>
      </form>
    </div>
  );
}
