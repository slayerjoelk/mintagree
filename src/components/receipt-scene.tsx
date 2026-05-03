"use client";

import { useRef, useEffect, useCallback } from "react";

export default function ReceiptScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  const animate = useCallback(() => {
    if (!cardRef.current) return;
    const { x, y } = mouse.current;
    cardRef.current.style.transform = `perspective(800px) rotateX(${y * -12}deg) rotateY(${x * 18}deg)`;
    raf.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    raf.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, [animate]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[420px] md:min-h-[520px] rounded-2xl bg-zinc-900/60 border border-zinc-800/50 overflow-hidden flex items-center justify-center"
      style={{ perspective: "800px" }}
    >
      <div
        ref={cardRef}
        className="relative w-[90%] max-w-[340px] aspect-[3/4] rounded-2xl bg-zinc-900 border border-zinc-700/60 shadow-[0_0_40px_rgba(0,0,0,0.3)]"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.1s ease-out",
          background: "linear-gradient(180deg, #1c1c1f 0%, #18181b 100%)",
        }}
      >
        {/* Glow edge */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            boxShadow: "inset 0 0 20px rgba(45,212,191,0.08), 0 0 60px rgba(45,212,191,0.06)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 p-5 md:p-6 flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-[8px] md:text-[9px] text-zinc-500 tracking-[0.15em] font-mono uppercase">
              Conversation Receipt
            </span>
            <span className="text-[8px] text-zinc-600 font-mono">#MRC-042</span>
          </div>

          {/* Client */}
          <div className="mb-5">
            <span className="block text-[8px] text-zinc-500 mb-0.5">Client</span>
            <span className="text-sm md:text-base text-zinc-200 font-semibold">Northstar Creative</span>
          </div>

          {/* Scope */}
          <div className="mb-5">
            <span className="block text-[8px] text-zinc-500 mb-0.5">Scope</span>
            <span className="text-[11px] md:text-xs text-zinc-300 leading-snug">
              Q2 brand refresh — logo, guidelines, 12 templates
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-zinc-800 mb-5" />

          {/* Budget / Due */}
          <div className="flex gap-8 mb-6">
            <div>
              <span className="block text-[8px] text-zinc-400 mb-0.5">Budget</span>
              <span className="text-sm md:text-base text-zinc-200 font-semibold">$8,500</span>
            </div>
            <div>
              <span className="block text-[8px] text-zinc-400 mb-0.5">Due</span>
              <span className="text-sm md:text-base text-zinc-200 font-semibold">Jun 15</span>
            </div>
          </div>

          {/* Client sign-off + OTP */}
          <div className="flex items-center justify-between mt-auto">
            <div>
              <span className="block text-[8px] text-zinc-400 mb-0.5">Client sign-off</span>
            </div>
            <div className="bg-[#2dd4bf] text-zinc-950 font-bold tracking-widest text-sm px-3 py-1 rounded-md shadow-[0_0_12px_rgba(45,212,191,0.4)]">
              8392
            </div>
          </div>

          {/* Signed by */}
          <div className="mt-3">
            <span className="block text-[7px] text-zinc-500">Signed by</span>
            <span className="text-[9px] text-zinc-400">
              dana.h@northstar.co · 2min ago
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
