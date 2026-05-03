"use client";

import { useInView } from "@/hooks/use-in-view";

const features = [
  {
    large: true,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    title: "Conversation receipts",
    description:
      "After every call, generate a structured receipt with scope, deliverables, budget, and due dates. Clients see exactly what was agreed — nothing more, nothing less.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: "OTP sign-off",
    description:
      "Clients acknowledge with a one-time code — no accounts, no passwords, no friction. Binding confirmation in seconds.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    title: "Scope & budget tracking",
    description:
      "Every receipt locks scope, deliverables, and budget in writing. Disputes drop. Projects start aligned.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    title: "Visual attachments",
    description:
      "Attach screenshots, mockups, and reference files. Schedule delivery and keep everything in one thread.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: "Automated reminders",
    description:
      "Follow-ups sent before due dates. No more chasing clients. Receipts get signed on time, every time.",
  },
];

const delayClasses = [
  "animate-fade-in-up",
  "animate-fade-in-up animate-fade-in-up-delay-1",
  "animate-fade-in-up animate-fade-in-up-delay-2",
  "animate-fade-in-up animate-fade-in-up-delay-3",
  "animate-fade-in-up animate-fade-in-up-delay-4",
];

export default function Features() {
  const { ref, inView } = useInView();

  return (
    <section
      ref={ref}
      id="features"
      className="max-w-7xl mx-auto px-6 py-20 md:py-28"
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Built to close the gap between{" "}
          <span className="text-mint">spoken</span> and{" "}
          <span className="text-mint">signed</span>
        </h2>
        <p className="mt-3 text-zinc-400 max-w-xl mx-auto">
          Everything you need to turn verbal agreements into binding receipts —
          without contracts, without complexity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-fr">
        {features.map((f, i) =>
          f.large ? (
            <div
              key={i}
              className={`md:col-span-2 md:row-span-2 rounded-2xl border border-zinc-800 bg-surface p-6 md:p-8 flex flex-col justify-between group hover:border-zinc-700 hover:-translate-y-1 hover:shadow-lg transition-all ${
                inView ? "animate-fade-in-up" : "opacity-0"
              }`}
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-mint/10 border border-mint/20 flex items-center justify-center text-mint mb-4">
                  {f.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                  {f.description}
                </p>
              </div>
              <div className="mt-6 p-3 rounded-lg bg-surface-raised font-mono text-xs text-zinc-500 overflow-hidden border border-zinc-800 group-hover:border-zinc-700 transition-colors">
                <span className="text-zinc-500">POST</span>{" "}
                <span className="text-mint">/v1/receipts</span>{" "}
                <span className="text-zinc-600">{`{ "scope", "budget" }`}</span>
              </div>
            </div>
          ) : (
            <div
              key={i}
              className={`rounded-2xl border border-zinc-800 bg-surface p-5 group hover:border-zinc-700 hover:-translate-y-1 hover:shadow-md hover:bg-gradient-to-b hover:from-transparent hover:to-mint/5 transition-all ${
                inView ? delayClasses[i] || "animate-fade-in-up" : "opacity-0"
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-mint/10 border border-mint/20 flex items-center justify-center text-mint mb-3">
                {f.icon}
              </div>
              <h3 className="font-semibold mb-1.5">{f.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {f.description}
              </p>
            </div>
          )
        )}
      </div>
    </section>
  );
}
