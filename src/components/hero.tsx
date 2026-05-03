"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";

const stats = [
  { value: "90s", label: "To send" },
  { value: "2.3×", label: "Faster approvals" },
  { value: "−41%", label: "Fewer disputes" },
];

export default function Hero() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / 20;
      const y = (e.clientY - rect.top - rect.height / 2) / 20;
      setTransform(
        `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg) translateZ(10px)`
      );
    };

    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-mint/5 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left — Text */}
          <div className="order-2 md:order-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-mint/20 bg-mint/5 px-3 py-1 text-xs text-mint mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
              Voice → Signed Agreement
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.08] text-balance">
              Every call ends
              <br />
              with a{" "}
              <span className="text-mint">receipt</span>
            </h1>

            <p className="mt-5 text-base md:text-lg text-zinc-400 leading-relaxed max-w-md">
              Turn voice conversations into signed, binding client agreement
              receipts. Scope, budget, due dates — confirmed in one message.
              No contracts. No disputes.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <Link
                href="/demo"
                className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium bg-mint text-zinc-950 hover:bg-mint-hover transition-colors shadow-glow"
              >
                Try the live demo
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium border border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors"
              >
                See pricing
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-xl font-semibold font-mono text-mint">
                    {s.value}
                  </div>
                  <div className="text-xs text-zinc-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — 3D Receipt Card */}
          <div
            className="order-1 md:order-2 flex justify-center"
            // 3D wrapper
            style={{ perspective: "1200px" }}
          >
            <div
              ref={cardRef}
              className="relative w-full max-w-sm rounded-2xl border border-zinc-800 bg-surface p-6 shadow-lg transition-transform duration-75 ease-out"
              style={{
                transform,
                transformStyle: "preserve-3d",
              }}
            >
              {/* Receipt content */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                  Conversation Receipt
                </span>
                <span className="text-xs font-mono text-zinc-600">#MRC-042</span>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-zinc-500">Client</span>
                  <div className="text-zinc-200 font-medium">Northstar Creative</div>
                </div>
                <div>
                  <span className="text-zinc-500">Scope</span>
                  <div className="text-zinc-200">
                    Q2 brand refresh — logo, guidelines, 12 templates
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-800">
                  <div>
                    <span className="text-zinc-500 text-xs">Budget</span>
                    <div className="text-zinc-200 font-mono">$8,500</div>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-xs">Due</span>
                    <div className="text-zinc-200 font-mono">Jun 15, 2026</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800">
                  <span className="text-zinc-500 text-xs">Attachments</span>
                  <div className="flex gap-1.5 mt-1">
                    <span className="px-2 py-0.5 text-xs rounded-md bg-surface-raised text-zinc-300">
                      📎 brief.pdf
                    </span>
                    <span className="px-2 py-0.5 text-xs rounded-md bg-surface-raised text-zinc-300">
                      🖼 moodboard
                    </span>
                  </div>
                </div>

                {/* OTP section */}
                <div className="mt-2 pt-3 border-t border-dashed border-zinc-700">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Client sign-off</span>
                    <span className="px-3 py-1 rounded-md bg-mint/10 border border-mint/20 text-mint font-mono text-sm font-semibold tracking-[0.2em]">
                      8392
                    </span>
                  </div>
                </div>

                {/* Signature line */}
                <div className="mt-3 pt-2 border-t border-zinc-800">
                  <div className="text-xs text-zinc-500 mb-1">Signed by</div>
                  <div className="h-px w-3/5 bg-zinc-600 mb-1" />
                  <div className="text-xs text-zinc-600 font-mono">
                    dana.h@northstar.co · 2min ago
                  </div>
                </div>
              </div>

              {/* Reflective shine on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.03] via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
