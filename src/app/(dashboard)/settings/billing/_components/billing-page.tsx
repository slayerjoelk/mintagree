"use client";

import { useState } from "react";
import Link from "next/link";

interface BillingPageProps {
  user: {
    email?: string | null;
    name?: string | null;
    plan?: string | null;
  } | null;
}

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  starter: "Starter",
  pro: "Pro",
  enterprise: "Enterprise",
};

const tiers = [
  { slug: "starter", name: "Starter", price: "R349", period: "/mo", features: ["Up to 3 seats", "Unlimited receipts", "OTP sign-off", "Client portal", "Reminders"] },
  { slug: "pro", name: "Pro", price: "R699", period: "/mo", features: ["Up to 10 seats", "Unlimited receipts", "Assignments", "Advanced reminders", "Priority support"] },
  { slug: "enterprise", name: "Enterprise", price: "R2,699", period: "/mo", features: ["Unlimited seats", "SSO & audit trail", "Custom playbooks", "Dedicated support", "SLA guarantee"] },
];

export default function BillingPage({ user }: BillingPageProps) {
  const [subscribing, setSubscribing] = useState<string | null>(null);

  const currentPlan = user?.plan || "free";
  const currentLabel = PLAN_LABELS[currentPlan] || "Free";

  async function subscribe(plan: string) {
    setSubscribing(plan);
    try {
      const res = await fetch("/api/payfast/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const html = await res.text();
      if (res.ok && html.includes("<!DOCTYPE html>")) {
        // PayFast returns an auto-submit HTML form — render it
        const w = window.open("", "_blank");
        if (w) w.document.write(html);
      } else {
        alert("Failed to start checkout");
      }
    } catch {
      alert("Network error");
    } finally {
      setSubscribing(null);
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Link href="/dashboard/settings" className="text-sm text-slate-500 hover:text-slate-700">
          ← Back to settings
        </Link>
        <h2 className="text-2xl font-semibold mt-1">Billing &amp; plans</h2>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm mb-6">
        <h3 className="font-semibold mb-2">Current plan</h3>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">{currentLabel}</span>
        </div>
        <p className="text-sm text-slate-600">
          {currentPlan === "free"
            ? "You're on the Free plan — 5 receipts per month, 1 seat."
            : `You're on the ${currentLabel} plan.`}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {tiers.map((t) => {
          const isCurrent = currentPlan === t.slug;
          return (
            <div
              key={t.slug}
              className={`rounded-2xl border p-5 ${
                isCurrent ? "border-emerald-300 bg-emerald-50/50" : "bg-white border-slate-200"
              }`}
            >
              <div className="font-semibold text-lg mb-1">{t.name}</div>
              <div className="mb-3">
                <span className="text-2xl font-semibold">{t.price}</span>
                <span className="text-sm text-slate-500">{t.period}</span>
              </div>
              <ul className="space-y-1.5 text-sm text-slate-600 mb-4">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              {isCurrent ? (
                <button disabled className="w-full rounded-lg px-4 py-2 text-sm font-medium bg-emerald-600 text-white opacity-70 cursor-default">
                  Current plan
                </button>
              ) : (
                <button
                  onClick={() => subscribe(t.slug)}
                  disabled={subscribing === t.slug}
                  className="w-full rounded-lg px-4 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {subscribing === t.slug ? "Redirecting..." : `Upgrade to ${t.name}`}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-slate-500 mt-4">
        Prices in South African Rand (ZAR). Billed monthly via PayFast. Cancel anytime.
      </p>
    </div>
  );
}
