import Link from "next/link";

export default function CTASection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
      <div className="relative rounded-3xl bg-gradient-to-br from-mint/10 via-mint/5 to-transparent border border-mint/20 p-10 md:p-16 text-center overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-mint/10 blur-[100px]" />

        <div className="relative">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            Ready to mint your first agreement?
          </h2>
          <p className="text-zinc-400 mb-8 max-w-md mx-auto">
            Send a conversation receipt in 90 seconds. No contracts. No credit
            card required to start.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/demo"
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium bg-mint text-zinc-950 hover:bg-mint-hover transition-colors shadow-glow"
            >
              Try the live demo
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium border border-zinc-700 text-zinc-300 hover:border-zinc-600 transition-colors"
            >
              View pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
