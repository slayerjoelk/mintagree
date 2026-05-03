import Link from "next/link";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import FloatingOrbs from "@/components/floating-orbs";
import CanvasBackground from "@/components/canvas-background";

const features = [
  {
    title: "End-to-end encryption",
    description: "All receipt data is encrypted in transit using TLS 1.3 and at rest using AES-256. Your agreements are never exposed in plaintext.",
  },
  {
    title: "SOC 2 Type II in progress",
    description: "We are actively pursuing SOC 2 Type II certification. Our infrastructure providers are already SOC 2 compliant.",
  },
  {
    title: "Single-use OTP codes",
    description: "Client sign-off codes are single-use, time-limited, and cryptographically secure. No replay attacks possible.",
  },
  {
    title: "No data selling",
    description: "We do not sell, rent, or share your data with third parties for advertising or any other purpose.",
  },
  {
    title: "99.9% uptime SLA",
    description: "Built on resilient infrastructure with automatic failover. Your receipts are always accessible when you need them.",
  },
  {
    title: "GDPR compliant",
    description: "Right to access, right to deletion, right to export. Request your data or delete your account at any time.",
  },
];

export default function SecurityPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <FloatingOrbs />
      <CanvasBackground />
      <div className="relative z-10">
        <Nav />

        <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24 grid-pattern">
          <div className="max-w-7xl mx-auto px-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-8"
            >
              <span>←</span> Back to home
            </Link>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-mint/20 bg-mint/5 px-3 py-1 text-xs text-mint mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
                Security
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] text-balance">
                Your agreements are{" "}
                <span className="text-mint">encrypted by default</span>
              </h1>

              <p className="mt-6 text-base md:text-lg text-zinc-400 leading-relaxed max-w-xl">
                Security is not a feature — it is the foundation. Every receipt, every sign-off, every byte of data is protected.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-12 md:py-16 border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="relative rounded-xl border border-zinc-800 bg-surface p-6 hover:border-zinc-700 hover:bg-surface-raised hover:-translate-y-0.5 transition-all group overflow-hidden"
              >
                <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-mint/70" />
                <div className="pl-4">
                  <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6 py-12 md:py-16">
          <div className="rounded-xl border border-zinc-800 bg-surface p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Security questions?</h2>
            <p className="text-zinc-400 mb-4">
              Contact our security team at{" "}
              <a href="mailto:security@mintagree.com" className="text-mint hover:underline">
                security@mintagree.com
              </a>
              . We respond to security inquiries within 24 hours.
            </p>
            <p className="text-sm text-zinc-500">
              For responsible disclosure of vulnerabilities, please email us directly. We do not have a bug bounty program yet, but we deeply appreciate researchers who help us improve.
            </p>
          </div>
        </section>

        <section className="bg-gradient-to-b from-zinc-950 to-zinc-900 border-t border-white/5 py-20 md:py-28">
          <div className="glow-border max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Ready to eliminate{" "}
              <span className="text-mint">scope creep</span>?
            </h2>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link href="/demo" className="inline-flex items-center justify-center rounded-lg px-8 py-4 text-sm font-semibold bg-mint text-zinc-950 hover:bg-mint-hover transition-all shadow-glow hover:scale-[1.02] active:scale-[0.98]">
                Start free
              </Link>
              <Link href="/demo" className="inline-flex items-center justify-center rounded-lg px-6 py-3.5 text-sm font-medium border border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:text-white transition-colors">
                Book a demo
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}

export const metadata = {
  title: "Security — MintAgree",
  description: "End-to-end encryption, SOC 2 compliance, single-use OTP codes, and zero data selling. Your agreements are protected.",
};
