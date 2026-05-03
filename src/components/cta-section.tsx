"use client";

import Link from "next/link";
import { useInView } from "@/hooks/use-in-view";

export default function CTASection() {
  const { ref, inView } = useInView();

  return (
    <section
      ref={ref}
      className={`bg-gradient-to-b from-zinc-950 to-zinc-900 border-t border-white/5 py-20 md:py-28 ${
        inView ? "animate-fade-in-up" : "opacity-0"
      }`}
    >
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Stop losing money to{" "}
          <span className="text-mint">scope creep</span>.
        </h2>
        <p className="text-lg text-zinc-400 mb-2">
          Your first receipt is free. No credit card required.
        </p>
        <p className="text-sm text-zinc-500 mb-10">
          Get your clients aligned before the project starts. Not after it
          explodes.
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/demo"
            className="inline-flex items-center justify-center rounded-lg px-8 py-4 text-sm font-semibold bg-mint text-zinc-950 hover:bg-mint-hover transition-all shadow-glow hover:scale-[1.02] active:scale-[0.98]"
          >
            Start free
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center justify-center rounded-lg px-6 py-3.5 text-sm font-medium border border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:text-white transition-colors"
          >
            Book a 15-min demo
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-5 text-xs text-zinc-600">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-zinc-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            SOC 2 Type II in progress
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-zinc-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            99.9% uptime
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-zinc-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            End-to-end encrypted
          </span>
        </div>
      </div>
    </section>
  );
}
