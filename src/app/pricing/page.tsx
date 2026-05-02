"use client";

import Link from "next/link";
import { useState } from "react";

const tiers = {
  starter: {
    name: "Starter",
    monthlyPrice: 19,
    annualPrice: 15.17,
    desc: "Up to 3 seats, unlimited receipts, OTP sign-off",
    popular: false,
  },
  pro: {
    name: "Pro",
    monthlyPrice: 39,
    annualPrice: 31.17,
    desc: "Up to 10 seats, assignments, advanced reminders",
    popular: true,
  },
  enterprise: {
    name: "Enterprise",
    monthlyPrice: 149,
    annualPrice: 119.17,
    desc: "Unlimited seats, SSO, audit trail, dedicated support",
    popular: false,
  },
} as const;

type TierKey = keyof typeof tiers;

export default function PricingPage() {
  const [selected, setSelected] = useState<TierKey>("pro");
  const [annual, setAnnual] = useState(false);

  const t = tiers[selected];
  const price = annual ? t.annualPrice : t.monthlyPrice;

  async function subscribe() {
    await fetch("/api/payfast/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: selected }),
    });
  }

  function formatUSD(n: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: n % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(n);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30">
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            AgreeMint
          </Link>
          <Link
            href="/demo"
            className="px-3 py-2 rounded-xl border bg-white hover:bg-slate-50 text-sm"
          >
            Live demo
          </Link>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <Link href="/" className="text-sm text-slate-600 hover:text-emerald-700 mb-4 inline-block">
          ← Back to home
        </Link>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">
          Checkout
        </h1>
        <p className="text-slate-600 mb-6">
          Choose your plan. 14-day money-back guarantee. Cancel anytime.
        </p>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-sm text-slate-600">Monthly</span>
          <button
            role="switch"
            aria-checked={annual}
            onClick={() => setAnnual((a) => !a)}
            className={
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors " +
              (annual ? "bg-emerald-600" : "bg-slate-200")
            }
          >
            <span
              className={
                "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform " +
                (annual ? "translate-x-6" : "translate-x-1")
              }
            />
          </button>
          <span className="text-sm text-slate-600">
            Annual{" "}
            <span className="text-emerald-700 font-medium">Save 20%</span>
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2 rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="font-semibold mb-4">Select your plan</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {(Object.entries(tiers) as [TierKey, (typeof tiers)[TierKey]][]).map(
                ([slug, info]) => (
                  <button
                    key={slug}
                    className={
                      "text-left rounded-xl border p-4 bg-white transition-all" +
                      (selected === slug ? " ring-2 ring-emerald-600" : "")
                    }
                    onClick={() => setSelected(slug)}
                  >
                    <div className="font-semibold flex flex-wrap items-center gap-1 mb-1">
                      {info.name}
                      {info.popular && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Popular
                        </span>
                      )}
                    </div>
                    <div className="text-xl font-semibold">
                      {formatUSD(annual ? info.annualPrice : info.monthlyPrice)}
                      <span className="text-sm font-normal text-slate-600">/mo</span>
                    </div>
                    <div className="text-sm text-slate-600 mt-1">{info.desc}</div>
                  </button>
                )
              )}
            </div>

            <div className="mt-6">
              <div className="text-sm text-slate-600">
                Selected: <b>{t.name}</b> · {formatUSD(price)}/mo
                {annual && ", billed annually"}
              </div>
              <button
                className="mt-3 inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-medium shadow-sm bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={subscribe}
              >
                Proceed to PayFast
              </button>
              <div className="text-xs text-slate-500 mt-2">
                You'll be redirected to secure PayFast checkout. Prices in USD.
                14-day money-back guarantee.
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="font-semibold mb-3">Order summary</h2>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>{t.name} plan</span>
                <span>{formatUSD(price)}/mo</span>
              </div>
              {annual && (
                <div className="flex justify-between text-emerald-700">
                  <span>Annual discount</span>
                  <span>−20%</span>
                </div>
              )}
              <div className="border-t pt-2 font-semibold flex justify-between">
                <span>Total</span>
                <span>
                  {formatUSD(annual ? price * 12 : price)}/{annual ? "yr" : "mo"}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4">
              Need help? support@agreemint.example.com
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
