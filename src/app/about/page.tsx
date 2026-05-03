import Link from "next/link";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import FloatingOrbs from "@/components/floating-orbs";
import CanvasBackground from "@/components/canvas-background";

const values = [
  {
    title: "Frictionless agreements",
    description: "No PDFs. No DocuSign. No back-and-forth. Just a clear conversation receipt with a one-time code for sign-off.",
    accent: "#2dd4bf",
  },
  {
    title: "Documentation by default",
    description: "Every agreement is captured automatically. No relying on memory, email threads, or verbal promises that fade.",
    accent: "#60a5fa",
  },
  {
    title: "Built for speed",
    description: "90 seconds from conversation to signed receipt. Because the best documentation is the kind that actually gets done.",
    accent: "#a78bfa",
  },
];

const team = [
  {
    name: "Joel van Niekerk",
    role: "Founder & CEO",
    bio: "Built MintAgree after watching too many projects derail because scope was discussed verbally but never confirmed in writing.",
  },
];

const stats = [
  { value: "2,300+", label: "Receipts sent this month" },
  { value: "200+", label: "Agencies using MintAgree" },
  { value: "9", label: "Industries served" },
  { value: "4.8/5", label: "Average rating" },
];

export default function AboutPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <FloatingOrbs />
      <CanvasBackground />
      <div className="relative z-10">
        <Nav />

        {/* Hero */}
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
                About MintAgree
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] text-balance">
                We believe agreements should be{" "}
                <span className="text-mint">frictionless</span>
              </h1>

              <p className="mt-6 text-base md:text-lg text-zinc-400 leading-relaxed max-w-xl">
                MintAgree turns verbal agreements into signed receipts. Built for professionals
                who close deals on calls and need client acknowledgment without contracts.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="max-w-7xl mx-auto px-6 py-12 md:py-16 border-t border-white/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-zinc-800 bg-surface p-6 text-center"
              >
                <div className="text-2xl md:text-3xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-zinc-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Our{" "}
                <span className="text-mint">mission</span>
              </h2>
              <p className="text-lg text-zinc-400 leading-relaxed">
                Eliminate scope creep by making it effortless to document and confirm
                every client conversation — by voice or WhatsApp.
              </p>
              <p className="text-zinc-400 mt-4">
                Founded in 2025, MintAgree was built after watching too many projects derail
                because scope was discussed verbally but never confirmed in writing. We believe
                the best way to protect your work is to document it before you start — not after
                it goes wrong.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-surface p-8">
              <blockquote className="text-lg text-zinc-300 leading-relaxed italic">
                "The most expensive conversation is the one you did not document."
              </blockquote>
              <div className="mt-4 text-sm text-zinc-500">— Why we built MintAgree</div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 border-t border-white/5">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              What we{" "}
              <span className="text-mint">stand for</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="relative rounded-xl border border-zinc-800 bg-surface p-6 hover:border-zinc-700 hover:bg-surface-raised hover:-translate-y-0.5 transition-all group overflow-hidden"
              >
                <div
                  className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full"
                  style={{ backgroundColor: v.accent, opacity: 0.7 }}
                />
                <div className="pl-4">
                  <h3 className="font-semibold text-white mb-2">{v.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{v.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 border-t border-white/5">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              The{" "}
              <span className="text-mint">team</span>
            </h2>
            <p className="mt-3 text-zinc-400 max-w-xl mx-auto">
              Small team, big mission. Built with obsession over every detail.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            {team.map((t) => (
              <div
                key={t.name}
                className="rounded-xl border border-zinc-800 bg-surface p-6 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-zinc-800 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-xl font-bold text-mint">{t.name.charAt(0)}</span>
                </div>
                <h3 className="font-semibold text-white">{t.name}</h3>
                <p className="text-xs text-mint font-medium mt-1">{t.role}</p>
                <p className="text-sm text-zinc-400 mt-3 leading-relaxed">{t.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-b from-zinc-950 to-zinc-900 border-t border-white/5 py-20 md:py-28">
          <div className="glow-border max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Ready to eliminate{" "}
              <span className="text-mint">scope creep</span>?
            </h2>
            <p className="text-lg text-zinc-400 mb-2">
              Your first receipt is free. No credit card required.
            </p>
            <p className="text-sm text-zinc-500 mb-10">
              Join 200+ agencies who never start work without a signed receipt.
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
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}

export const metadata = {
  title: "About MintAgree — Conversation Receipts & Client Sign-Off",
  description:
    "MintAgree turns verbal agreements into signed receipts. Built for professionals who close deals on calls and need client acknowledgment without contracts.",
};
