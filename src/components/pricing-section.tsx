"use client";

import { useState } from "react";
import Link from "next/link";

const tiers = [
  {
    slug: "starter",
    name: "Starter",
    monthlyPrice: 19,
    annualPrice: 15.17,
    features: [
      "Up to 3 seats",
      "Unlimited conversation receipts",
      "OTP sign-off",
      "Client portal",
    ],
    popular: false,
  },
  {
    slug: "pro",
    name: "Pro",
    monthlyPrice: 39,
    annualPrice: 31.17,
    features: [
      "Up to 10 seats",
      "Assignments",
      "Advanced reminders",
      "Priority support",
    ],
    popular: true,
  },
  {
    slug: "enterprise",
    name: "Enterprise",
    monthlyPrice: 149,
    annualPrice: 119.17,
    features: [
      "Unlimited seats",
      "SSO & audit trail",
      "Custom playbooks",
      "Dedicated support",
    ],
    popular: false,
  },
];

export default function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="max-w-7xl mx-auto px-6 py-20 md:py-28">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Simple,{" "}
          <span className="text-mint">transparent</span> pricing
        </h2>
        <p className="mt-3 text-zinc-400">
          Start free. Upgrade when you need more seats and power.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 mb-10">
        <span className="text-sm text-zinc-400">Monthly</span>
        <button
          role="switch"
          aria-checked={annual}
          onClick={() => setAnnual((a) => !a)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            annual ? "bg-mint" : "bg-zinc-700"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              annual ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
        <span className="text-sm text-zinc-400">
          Annual{" "}
          <span className="text-mint font-medium">Save 20%</span>
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {tiers.map((t) => {
          const price = annual ? t.annualPrice : t.monthlyPrice;
          return (
            <div
              key={t.slug}
              className={`rounded-2xl border p-6 bg-surface relative ${
                t.popular
                  ? "border-mint/30 ring-1 ring-mint/20"
                  : "border-zinc-800"
              }`}
            >
              {t.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-mint text-zinc-950 text-xs font-semibold">
                  Most popular
                </div>
              )}

              <div className="font-semibold text-lg mb-1">{t.name}</div>
              <div className="mt-3 mb-5">
                <span className="text-4xl font-semibold tracking-tight">
                  ${price % 1 === 0 ? price : price.toFixed(2)}
                </span>
                <span className="text-sm text-zinc-500 ml-1">
                  {annual ? "/mo, billed annually" : "/mo"}
                </span>
              </div>

              <ul className="space-y-2 mb-6">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-zinc-400">
                    <svg
                      className="w-4 h-4 text-mint mt-0.5 shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={`/pricing?plan=${t.slug}`}
                className={`block w-full text-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  t.popular
                    ? "bg-mint text-zinc-950 hover:bg-mint-hover"
                    : "border border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:text-white"
                }`}
              >
                {t.popular ? "Start free trial" : "Subscribe"}
              </Link>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-zinc-600 mt-6">
        14-day money-back guarantee. Cancel anytime. No questions asked.
      </p>
    </section>
  );
}
