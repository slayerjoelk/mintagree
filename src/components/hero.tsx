"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useInView } from "@/hooks/use-in-view";
import { useRef, useEffect } from "react";

const ReceiptScene = dynamic(() => import("@/components/receipt-scene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] md:h-[480px] rounded-2xl bg-surface border border-zinc-800 animate-pulse" />
  ),
});

const stats = [
  { value: "90s", label: "To send" },
  { value: "2.3×", label: "Faster approvals" },
  { value: "−41%", label: "Fewer disputes" },
];

const logos = [
  "Northstar Creative",
  "Atlas Design",
  "Meridian Studio",
  "Vertex Labs",
];

export default function Hero() {
  const { ref: sectionRef, inView } = useInView();
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = spotlightRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--mouse-x", `${x}%`);
      el.style.setProperty("--mouse-y", `${y}%`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24 grid-pattern"
    >
      <div ref={spotlightRef} className="mouse-spotlight relative max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className={`order-2 md:order-1 ${inView ? "animate-blur-in" : "opacity-0"}`}>
            <div className="inline-flex items-center gap-2 rounded-full border border-mint/20 bg-mint/5 px-3 py-1 text-xs text-mint mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
              Voice or WhatsApp → Signed Agreement
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] text-balance">
              Turn verbal agreements into{" "}
              <span className="text-shimmer">signed receipts</span>{" "}
              — in 90 seconds.
            </h1>

            <p className="mt-6 text-base md:text-lg text-zinc-400 leading-relaxed max-w-lg">
              Scope creep kills projects. MintAgree turns every client call or WhatsApp
              conversation into a binding receipt — scope, budget, due dates, and
              client sign-off. No contracts. No confusion.
            </p>

            <div className="mt-8 flex items-center gap-3 flex-wrap">
              <Link href="/demo" className="inline-flex items-center justify-center rounded-lg px-8 py-4 text-sm font-semibold bg-mint text-zinc-950 hover:bg-mint-hover transition-all shadow-glow hover:scale-[1.02] active:scale-[0.98]">
                Send your first receipt — free
              </Link>
              <Link href="/pricing" className="inline-flex items-center justify-center rounded-lg px-6 py-3.5 text-sm font-medium border border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors">
                See pricing
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl md:text-3xl font-bold font-mono text-white">{s.value}</div>
                  <div className="text-xs text-zinc-400 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            <div className={`mt-10 ${inView ? "animate-blur-in animate-blur-in-delay-2" : "opacity-0"}`}>
              <p className="text-xs text-zinc-500 mb-3 uppercase tracking-wider font-medium">Trusted by 200+ agencies</p>
              <div className="flex flex-wrap items-center gap-5">
                {logos.map((name) => (
                  <span key={name} className="text-sm text-zinc-500 font-medium opacity-60 hover:opacity-100 transition-opacity">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={`order-1 md:order-2 h-[420px] md:h-[520px] w-full ${inView ? "animate-blur-in animate-blur-in-delay-1" : "opacity-0"}`}>
            <ReceiptScene />
          </div>
        </div>
      </div>
    </section>
  );
}
