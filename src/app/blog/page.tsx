import Link from "next/link";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import FloatingOrbs from "@/components/floating-orbs";
import CanvasBackground from "@/components/canvas-background";

const posts = [
  {
    slug: "scope-creep-agencies",
    title: "The $12,000 scope creep mistake every agency makes",
    excerpt: "How a single undocumented voice note turned into three extra rounds of revisions — and how to prevent it.",
    date: "May 2026",
    readTime: "4 min read",
    tag: "Agencies",
  },
  {
    slug: "otp-vs-esignature",
    title: "Why OTP beats e-signature for client approvals",
    excerpt: "One-time codes remove login friction, cut approval time by 60%, and create the same binding record.",
    date: "April 2026",
    readTime: "3 min read",
    tag: "Product",
  },
  {
    slug: "whatsapp-to-receipts",
    title: "Turning WhatsApp threads into signed receipts",
    excerpt: "The workflow that lets you document informal client conversations without losing speed or context.",
    date: "April 2026",
    readTime: "5 min read",
    tag: "Workflow",
  },
  {
    slug: "verbal-yes-to-signed",
    title: "Sales teams: from verbal yes to signed commitment",
    excerpt: "How top-performing sales teams use conversation receipts to accelerate pipeline and reduce stalled deals.",
    date: "March 2026",
    readTime: "4 min read",
    tag: "Sales",
  },
  {
    slug: "construction-change-orders",
    title: "Construction change orders without the paper chase",
    excerpt: "Field-ready receipt workflows that get client sign-off before you leave the site.",
    date: "March 2026",
    readTime: "6 min read",
    tag: "Construction",
  },
  {
    slug: "built-in-90-days",
    title: "Why we built MintAgree in 90 days",
    excerpt: "The story behind shipping a full-stack SaaS with Next.js, SQLite, and a single developer.",
    date: "February 2026",
    readTime: "7 min read",
    tag: "Engineering",
  },
];

export default function BlogPage() {
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
                MintAgree Blog
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] text-balance">
                Insights on{" "}
                <span className="text-mint">client agreements</span>
              </h1>

              <p className="mt-6 text-base md:text-lg text-zinc-400 leading-relaxed max-w-xl">
                Practical guides on eliminating scope creep, closing deals faster, and building trust with clients.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="relative rounded-xl border border-zinc-800 bg-surface p-6 hover:border-zinc-700 hover:bg-surface-raised hover:-translate-y-0.5 transition-all group cursor-pointer overflow-hidden block"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-mint bg-mint/10 px-2 py-0.5 rounded-full">{post.tag}</span>
                  <span className="text-xs text-zinc-500">{post.date}</span>
                </div>
                <h3 className="font-semibold text-white mb-2 group-hover:text-mint transition-colors">{post.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-4">{post.excerpt}</p>
                <div className="text-xs text-zinc-600">{post.readTime}</div>
              </Link>
            ))}
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
  title: "Blog — MintAgree",
  description: "Practical guides on eliminating scope creep, closing deals faster, and building trust with clients.",
};
