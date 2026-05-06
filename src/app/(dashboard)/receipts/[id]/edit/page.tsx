"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Receipt {
  id: string;
  subject: string;
  bullets: string[];
  amount: number | null;
  currency: string | null;
  dueDate: string | null;
  clientEmail: string | null;
  clientName: string | null;
  requireOtp: boolean | null;
}

export default function EditReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");

  const [subject, setSubject] = useState("");
  const [bullets, setBullets] = useState<string[]>([""]);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [dueDate, setDueDate] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const [requireOtp, setRequireOtp] = useState(true);

  useEffect(() => {
    params.then(({ id }) => {
      setId(id);
      fetch(`/api/receipts/${id}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.error) { setError(d.error); setFetchLoading(false); return; }
          const r = d.receipt as Receipt;
          setSubject(r.subject || "");
          setBullets(r.bullets?.length ? r.bullets : [""]);
          setAmount(r.amount ? String(r.amount) : "");
          setCurrency(r.currency || "USD");
          setDueDate(r.dueDate || "");
          setClientEmail(r.clientEmail || "");
          setClientName(r.clientName || "");
          setRequireOtp(r.requireOtp ?? true);
          setFetchLoading(false);
        })
        .catch(() => { setError("Failed to load receipt"); setFetchLoading(false); });
    });
  }, [params]);

  function updateBullet(i: number, v: string) {
    const n = [...bullets];
    n[i] = v;
    setBullets(n);
  }
  function addBullet() { setBullets([...bullets, ""]); }
  function removeBullet(i: number) { setBullets(bullets.filter((_, x) => x !== i)); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    setLoading(true);
    setError("");

    const filtered = bullets.filter((b) => b.trim());
    if (!subject.trim()) { setError("Subject is required."); setLoading(false); return; }
    if (!filtered.length) { setError("At least one bullet is required."); setLoading(false); return; }

    try {
      const res = await fetch(`/api/receipts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          bullets: filtered,
          amount: amount ? parseFloat(amount) : undefined,
          currency,
          dueDate: dueDate || undefined,
          clientEmail: clientEmail || undefined,
          clientName: clientName || undefined,
          requireOtp,
        }),
      });
      const d = await res.json();
      if (!res.ok) { setError(d.error || "Failed to update"); setLoading(false); return; }
      router.push(`/dashboard/receipts/${id}`);
    } catch {
      setError("Network error");
      setLoading(false);
    }
  }

  if (fetchLoading) return <div className="max-w-3xl text-slate-500 text-sm">Loading receipt...</div>;

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link href={`/dashboard/receipts/${id}`} className="text-sm text-slate-500 hover:text-slate-700">
          ← Back to receipt
        </Link>
        <h2 className="text-2xl font-semibold mt-1">Edit receipt</h2>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <input
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bullet points</label>
          <div className="space-y-2">
            {bullets.map((b, i) => (
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input type="number" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Currency</label>
            <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" value={currency} onChange={(e) => setCurrency(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Due date</label>
            <input type="date" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Client name</label>
            <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" value={clientName} onChange={(e) => setClientName(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Client email</label>
          <input type="email" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
        </div>

        <div className="flex items-center gap-2">
          <input id="otp" type="checkbox" checked={requireOtp} onChange={(e) => setRequireOtp(e.target.checked)} />
          <label htmlFor="otp" className="text-sm">Require OTP to sign</label>
        </div>

        {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <button type="submit" disabled={loading} className="inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50">
          {loading ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
