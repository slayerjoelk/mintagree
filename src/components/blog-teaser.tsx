import Link from "next/link";

const posts = [
  {
    title: "The $12,000 scope creep mistake every agency makes",
    date: "May 2, 2026",
    slug: "scope-creep-agencies",
    excerpt:
      "How a single undocumented voice note turned into three extra rounds of revisions — and how to prevent it.",
  },
  {
    title: "Why OTP beats e-signature for client approvals",
    date: "April 28, 2026",
    slug: "otp-vs-esignature",
    excerpt:
      "One-time codes remove login friction, cut approval time by 60%, and create the same binding record.",
  },
  {
    title: "Turning WhatsApp threads into signed receipts",
    date: "April 25, 2026",
    slug: "whatsapp-to-receipts",
    excerpt:
      "The workflow that lets you document informal client conversations without losing speed or context.",
  },
];

export default function BlogTeaser() {
  return (
    <section id="blog" className="max-w-7xl mx-auto px-6 py-20 md:py-28">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            From the <span className="text-mint">blog</span>
          </h2>
          <p className="mt-2 text-zinc-400 text-sm">
            Guides, strategies, and category-defining content.
          </p>
        </div>
        <Link
          href="/blog"
          className="hidden md:block text-sm text-mint hover:text-mint-hover transition-colors"
        >
          View all posts →
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="rounded-2xl border border-zinc-800 bg-surface p-5 group hover:border-zinc-700 transition-colors"
          >
            <div className="text-xs text-zinc-600 font-mono mb-3">{p.date}</div>
            <h3 className="font-semibold text-sm leading-snug mb-2 group-hover:text-mint transition-colors">
              {p.title}
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">{p.excerpt}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
