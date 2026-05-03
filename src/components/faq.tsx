"use client";

import { useState } from "react";
import { useInView } from "@/hooks/use-in-view";

const faqs = [
  {
    q: "What is a conversation receipt?",
    a: "A conversation receipt is a structured summary of what was agreed on a call — scope, deliverables, budget, and due dates — sent to the client for quick OTP acknowledgement. It's lighter than a contract but more binding than an email.",
  },
  {
    q: "How does OTP sign-off work?",
    a: "Your client receives a link to the receipt. They enter a one-time code displayed on the page. No accounts, no passwords, no downloads. The acknowledgment is timestamped and archived.",
  },
  {
    q: "Do I need a credit card?",
    a: "No. Start on the Free plan with no credit card. Upgrade when you need more receipts or seats.",
  },
  {
    q: "Can I switch plans?",
    a: "Yes. Upgrade or downgrade anytime. If you downgrade, your existing receipts stay accessible. If you upgrade, you immediately unlock new features.",
  },
  {
    q: "Is this legally binding?",
    a: "Conversation receipts with OTP acknowledgement create a clear audit trail of mutual understanding. For high-stakes engagements, pair with formal contracts. For day-to-day scope alignment, receipts are sufficient for most service businesses.",
  },
  {
    q: "Can I attach files to receipts?",
    a: "Yes. Attach PDFs, images, screenshots, and reference files. They're included in the receipt and visible to the client before sign-off.",
  },
  {
    q: "What industries use MintAgree?",
    a: "Agencies, consultants, freelancers, SMBs, MSPs, construction, legal, and sales teams. Anyone who needs client acknowledgment after a call.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel anytime with no penalties. All paid plans come with a 14-day money-back guarantee.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { ref, inView } = useInView();

  return (
    <section ref={ref} id="faq" className="max-w-3xl mx-auto px-6 py-20 md:py-28">
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12">
        Frequently asked{" "}
        <span className="text-mint">questions</span>
      </h2>

      <div className={`space-y-3 ${inView ? "animate-fade-in-up" : "opacity-0"}`}>
        {faqs.map((f, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="rounded-xl border border-zinc-800 bg-surface overflow-hidden hover:border-zinc-700 transition-colors"
            >
              <button
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 text-sm font-medium hover:text-mint transition-colors"
                onClick={() => setOpenIndex(isOpen ? null : i)}
              >
                {f.q}
                <svg
                  className={`w-4 h-4 text-zinc-500 transition-transform shrink-0 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              {isOpen && (
                <div className="px-5 pb-4 text-sm text-zinc-400 leading-relaxed">
                  {f.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
