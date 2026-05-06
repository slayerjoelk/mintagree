"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function NewReceiptPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("templateId");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [limitStatus, setLimitStatus] = useState<{
    allowed: boolean;
    plan: string;
    limit: number | null;
    used: number;
  } | null>(null);

  const [subject, setSubject] = useState("Client conversation receipt");
  const [bullets, setBullets] = useState(["Confirm project scope", "3 rounds of revisions", "Brand assets due Friday"]);
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const [requireOtp, setRequireOtp] = useState(true);

  useEffect(() => {
    fetch("/api/me/plan")
      .then((r) => r.json())
      .then((d) => {
        if (d.limitStatus) setLimitStatus(d.limitStatus);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!templateId) return;
    let cancelled = false;
    fetch(`/api/templates/${templateId}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        const t = d.template;
        if (!t) return;
        if (t.subject) setSubject(t.subject);
        if (t.bullets?.length) setBullets(t.bullets);
        if (t.amount) setAmount(String(t.amount));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [templateId]);

  function addBullet() {
    setBullets([...bullets, ""]);
  }

  function updateBullet(index: number, value: string) {
    const next = [...bullets];
    next[index] = value;
    setBullets(next);
  }

  function removeBullet(index: number) {
    setBullets(bullets.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const filteredBullets = bullets.filter((b) => b.trim().length > 0);

    if (filteredBullets.length === 0) {
      setError("At least one bullet point is required.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/receipts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          bullets: filteredBullets,
          amount: amount ? parseFloat(amount) : null,
          dueDate: dueDate || null,
          clientEmail: clientEmail || null,
          clientName: clientName || null,
          requireOtp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create receipt");
        setLoading(false);
        return;
      }

      router.push(`/dashboard/receipts/${data.receipt.id}`);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link
          href="/dashboard/receipts"
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          ← Back to receipts
        </Link>
        <h2 className="text-2xl font-semibold mt-1">New conversation receipt</h2>
      </div>

      {limitStatus && !limitStatus.allowed && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 mb-4 text-sm text-amber-800">
          <p className="font-medium mb-1">Monthly receipt limit reached</p>
          <p className="text-amber-700">
            You&apos;ve used {limitStatus.used} of {limitStatus.limit} receipts on your{" "}
            {limitStatus.plan} plan.{" "}
            <a href="/dashboard/settings/billing" className="underline">Upgrade</a> to create more.
          </p>
        </div>
      )}

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
                  placeholder={`Item ${i + 1}`}
                />
                <button
                  type="button"
                  className="rounded-lg border px-3 py-1 text-sm bg-white hover:bg-slate-50"
                  onClick={() => removeBullet(i)}
                >
                  −
                </button>
              </div>
            ))}
            <button
              type="button"
              className="rounded-lg border px-3 py-1 text-sm bg-white hover:bg-slate-50"
              onClick={addBullet}
            >
              + Add bullet
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Amount (optional)</label>
            <input
              type="number"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Due date (optional)</label>
            <input
              type="date"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Client email</label>
            <input
              type="email"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="client@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Client name</label>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Taylor"
            />
          </div>
        </div>

        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={requireOtp}
            onChange={(e) => setRequireOtp(e.target.checked)}
          />
          Require OTP verification on client sign-off
        </label>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Create & send receipt"}
        </button>
      </form>
    </div>
  );
}
