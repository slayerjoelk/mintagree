"use client";

import { useInView } from "@/hooks/use-in-view";

export default function HowItWorks() {
  const { ref, inView } = useInView();

  const steps = [
    {
      number: "01",
      title: "Call ends",
      description:
        "You finish the client call with clear next steps. Open MintAgree.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
    },
    {
      number: "02",
      title: "Receipt sent",
      description:
        "Fill scope, deliverables, budget, due dates. Attach files. Hit send. 90 seconds.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      ),
    },
    {
      number: "03",
      title: "Client signs",
      description:
        "They get a link. Enter the one-time code. Done — binding acknowledgment. Project aligned.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
  ];

  return (
    <section
      ref={ref}
      className="bg-gradient-to-r from-zinc-950 via-zinc-900/40 to-zinc-950 py-20 md:py-28"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Three steps. Two minutes.{" "}
            <span className="text-mint">Zero scope creep.</span>
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Desktop connecting line */}
          <div className="hidden md:block absolute top-[3.25rem] left-[16.666%] right-[16.666%] h-px bg-gradient-to-r from-zinc-800 via-mint/50 to-zinc-800" />

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div
                key={s.number}
                className={`relative text-center ${
                  inView ? "animate-fade-in-up" : "opacity-0"
                } ${i === 1 ? "animate-fade-in-up-delay-1" : ""} ${
                  i === 2 ? "animate-fade-in-up-delay-2" : ""
                }`}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-mint/10 border border-mint/20 text-mint mb-5 relative z-10">
                  {s.icon}
                </div>
                <div className="text-5xl font-bold text-zinc-800/80 mb-3">
                  {s.number}
                </div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed max-w-xs mx-auto">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
