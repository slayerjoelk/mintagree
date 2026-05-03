import Link from "next/link";

const posts = [
  {
    title: "What is a conversation receipt? The freelancer's post-call secret weapon",
    date: "May 3, 2026",
    slug: "what-is-a-conversation-receipt",
    excerpt: "Stop sending long emails after client calls. Here's why conversation receipts close the gap between spoken and signed.",
  },
  {
    title: "How to confirm scope after a client call (without sounding legal)",
    date: "May 1, 2026",
    slug: "confirm-scope-after-client-call",
    excerpt: "The words you use matter. Here's the exact language that gets clients to acknowledge scope without triggering their lawyer instinct.",
  },
  {
    title: "Client sign-off tools: why PDF contracts are killing your cash flow",
    date: "April 28, 2026",
    slug: "client-sign-off-tools-vs-pdf-contracts",
    excerpt: "Average PDF contract turnaround: 4.7 days. Average receipt sign-off: 2 minutes. The math is brutal.",
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
          href="#blog"
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
