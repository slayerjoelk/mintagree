"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const links = [
  { href: "#features", label: "Features" },
  { href: "#solutions", label: "Solutions" },
  { href: "#pricing", label: "Pricing" },
  { href: "/demo", label: "Demo" },
  { href: "/login", label: "Login" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl transition-colors ${
        scrolled ? "border-b border-white/5" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg text-mint tracking-tight">
          MintAgree
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/demo"
            className="px-4 py-2 rounded-lg bg-mint text-zinc-950 font-medium text-sm hover:bg-mint-hover transition-colors"
          >
            Start free
          </Link>
        </nav>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            {open ? (
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              />
            ) : (
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav
          className="md:hidden border-t border-white/5 bg-zinc-950 px-6 py-3 flex flex-col gap-1 text-sm"
          aria-label="Mobile"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="py-2 text-zinc-400 hover:text-white transition-colors"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/demo"
            className="mt-2 inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium bg-mint text-zinc-950 hover:bg-mint-hover transition-colors"
            onClick={() => setOpen(false)}
          >
            Start free
          </Link>
        </nav>
      )}
    </header>
  );
}
