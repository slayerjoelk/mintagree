import Link from "next/link";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import FloatingOrbs from "@/components/floating-orbs";
import CanvasBackground from "@/components/canvas-background";

const roles = [
  {
    title: "Full-Stack Engineer",
    department: "Engineering",
    location: "Remote (South Africa timezone)",
    type: "Full-time",
    description: "Build the core receipt engine, WhatsApp integrations, and client portal. Next.js, TypeScript, SQLite, and passion for clean UI.",
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    description: "Own the design system, landing pages, and dashboard UX. Figma, Tailwind, and obsession over every pixel.",
  },
  {
    title: "Customer Success Lead",
    department: "Operations",
    location: "Remote (South Africa timezone)",
    type: "Full-time",
    description: "Onboard agencies and consultants, gather feedback, and turn customer insights into product improvements.",
  },
];

const perks = [
  "Fully remote",
  "Competitive salary + equity",
  "Unlimited receipts (obviously)",
  "Flexible hours",
  "Annual team retreat",
  "Learning budget",
];

export default function CareersPage() {
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
                We are hiring
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] text-balance">
                Build the future of{" "}
                <span className="text-mint">client agreements</span>
              </h1>

              <p className="mt-6 text-base md:text-lg text-zinc-400 leading-relaxed max-w-xl">
                Small team, big mission. We are obsessed with eliminating scope creep and making client sign-off effortless.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-12 md:py-16 border-t border-white/5">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
            {perks.map((perk) => (
              <div
                key={perk}
                className="rounded-xl border border-zinc-800 bg-surface p-4 text-center"
              >
                <div className="text-sm text-zinc-300">{perk}</div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold tracking-tight mb-8">
            Open <span className="text-mint">positions</span>
          </h2>

          <div className="space-y-4">
            {roles.map((role) => (
              <div
                key={role.title}
                className="relative rounded-xl border border-zinc-800 bg-surface p-6 hover:border-zinc-700 hover:bg-surface-raised transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-mint bg-mint/10 px-2 py-0.5 rounded-full">{role.department}</span>
                      <span className="text-xs text-zinc-500">{role.type}</span>
                    </div>
                    <h3 className="font-semibold text-white text-lg">{role.title}</h3>
                    <p className="text-sm text-zinc-400 mt-1">{role.location}</p>
                  </div>
                  <a
                    href="mailto:careers@mintagree.com?subject=Application: "
                    className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium border border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:text-white transition-colors whitespace-nowrap"
                  >
                    Apply →
                  </a>
                </div>
                <p className="text-sm text-zinc-400 mt-4 leading-relaxed">{role.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-b from-zinc-950 to-zinc-900 border-t border-white/5 py-20 md:py-28">
          <div className="glow-border max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Do not see your{" "}
              <span className="text-mint">role</span>?
            </h2>
            <p className="text-lg text-zinc-400 mb-8">
              We are always looking for exceptional people. Send us your story.
            </p>
            <a
              href="mailto:careers@mintagree.com"
              className="inline-flex items-center justify-center rounded-lg px-8 py-4 text-sm font-semibold bg-mint text-zinc-950 hover:bg-mint-hover transition-all shadow-glow hover:scale-[1.02] active:scale-[0.98]"
            >
              Email careers@mintagree.com
            </a>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}

export const metadata = {
  title: "Careers — MintAgree",
  description: "Join the team building the future of client agreements. Fully remote. Competitive salary + equity.",
};
