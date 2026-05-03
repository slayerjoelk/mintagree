"use client";

import Link from "next/link";
import { useState } from "react";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Live demo", href: "/demo" },
    { label: "Changelog", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#blog" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "mailto:support@mintagree.com" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Security", href: "#" },
  ],
  Social: [
    { label: "Twitter / X", href: "https://x.com/mintagree" },
    { label: "LinkedIn", href: "https://linkedin.com/company/mintagree" },
    { label: "GitHub", href: "https://github.com/slayerjoelk/mintagree" },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="border-t border-zinc-800 bg-surface">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand + Newsletter */}
          <div className="col-span-2">
            <Link href="/" className="font-semibold text-mint tracking-tight text-lg">
              MintAgree
            </Link>
            <p className="mt-2 text-sm text-zinc-500 leading-relaxed max-w-xs">
              Voice agreement & client sign-off software. Turn every call into a binding receipt.
            </p>

            <div className="mt-5">
              <p className="text-xs text-zinc-500 font-medium mb-2">Get tips on client management</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className="rounded-lg bg-mint text-zinc-950 px-4 py-2 text-sm font-semibold hover:bg-mint-hover transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                {heading}
              </h4>
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} MintAgree. All rights reserved. Made in South Africa 🇿🇦
          </p>
          <div className="flex items-center gap-5 text-xs text-zinc-600">
            <Link href="https://x.com/mintagree" className="hover:text-zinc-400 transition-colors">X</Link>
            <Link href="https://linkedin.com/company/mintagree" className="hover:text-zinc-400 transition-colors">LinkedIn</Link>
            <Link href="https://github.com/slayerjoelk/mintagree" className="hover:text-zinc-400 transition-colors">GitHub</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
