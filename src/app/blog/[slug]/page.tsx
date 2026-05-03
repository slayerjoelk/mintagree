import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import FloatingOrbs from "@/components/floating-orbs";
import CanvasBackground from "@/components/canvas-background";

const posts: Record<string, {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tag: string;
  content: string[];
}> = {
  "scope-creep-agencies": {
    title: "The $12,000 scope creep mistake every agency makes",
    excerpt: "How a single undocumented voice note turned into three extra rounds of revisions — and how to prevent it.",
    date: "May 2026",
    readTime: "4 min read",
    tag: "Agencies",
    content: [
      "It started with a 15-minute voice note. The client said they wanted the logo 'a bit more modern.' The agency lead heard 'minor tweak' and told the designer to spend an hour on it.",
      "Three weeks later, the client was on round four of revisions. Each round was billed as out-of-scope, but the client claimed the original request included 'a full brand refresh.' The agency had no written record of what was actually agreed.",
      "The damage: $12,000 in unbilled hours, a strained client relationship, and a designer who nearly quit.",
      "This is scope creep. And it happens because verbal agreements evaporate. What one person remembers as a small tweak, another remembers as a major change order.",
      "The fix is not more contracts. It is faster documentation. A conversation receipt generated in 90 seconds, sent to the client, and confirmed with a one-time code. That is the paper trail that protects your margins.",
      "Every agency has a story like this. The ones that stop repeating it are the ones that document before they start.",
    ],
  },
  "otp-vs-esignature": {
    title: "Why OTP beats e-signature for client approvals",
    excerpt: "One-time codes remove login friction, cut approval time by 60%, and create the same binding record.",
    date: "April 2026",
    readTime: "3 min read",
    tag: "Product",
    content: [
      "DocuSign is powerful. It is also slow. Clients need to create accounts, verify emails, click through multiple screens, and remember passwords they will never use again.",
      "The average DocuSign workflow takes 8 minutes from send to sign. For a simple scope confirmation, that is overkill. Clients abandon the process. Deals stall.",
      "One-time codes flip the model. The client receives a receipt with a 4-digit code. They type it in. Done. Average completion time: under 30 seconds.",
      "The binding record is identical. Timestamp, IP, device fingerprint, and the exact text of what was agreed. In fact, OTP sign-off is often stronger evidence than an e-signature because there is no account sharing risk.",
      "For agencies, consultants, and freelancers, speed matters more than legal theatre. Get the yes. Document it. Move on.",
    ],
  },
  "whatsapp-to-receipts": {
    title: "Turning WhatsApp threads into signed receipts",
    excerpt: "The workflow that lets you document informal client conversations without losing speed or context.",
    date: "April 2026",
    readTime: "5 min read",
    tag: "Workflow",
    content: [
      "Clients love WhatsApp. It is fast, informal, and always open. Agencies hate WhatsApp. It is fast, informal, and impossible to audit.",
      "The problem is not the channel. It is the documentation gap. A client sends a voice note approving scope. Three weeks later, they have forgotten. You have no record.",
      "MintAgree bridges the gap. After the WhatsApp conversation, you open the app, paste the key points, and generate a receipt. The client receives it by email or WhatsApp and confirms with a code.",
      "The receipt includes the full context: scope, budget, due date, and a reference to the original WhatsApp thread. It is searchable, auditable, and binding.",
      "Best of both worlds: the speed of WhatsApp with the protection of a signed record.",
    ],
  },
  "verbal-yes-to-signed": {
    title: "Sales teams: from verbal yes to signed commitment",
    excerpt: "How top-performing sales teams use conversation receipts to accelerate pipeline and reduce stalled deals.",
    date: "March 2026",
    readTime: "4 min read",
    tag: "Sales",
    content: [
      "A verbal yes is not a commitment. It is intent. And intent fades.",
      "Top-performing sales teams know this. They do not wait for the contract. They confirm the deal terms immediately after the call with a conversation receipt.",
      "The receipt includes pricing, deliverables, timeline, and next steps. The prospect signs with a one-time code. Now there is a binding record of what was agreed.",
      "This does three things. First, it reduces ghosting. Prospects who have signed a summary of the deal are less likely to go silent. Second, it accelerates the contract process. Legal already knows the terms are approved. Third, it creates a paper trail that protects the rep if the deal changes later.",
      "The best sales teams close faster not because they are more persuasive, but because they are better at documenting the yes.",
    ],
  },
  "construction-change-orders": {
    title: "Construction change orders without the paper chase",
    excerpt: "Field-ready receipt workflows that get client sign-off before you leave the site.",
    date: "March 2026",
    readTime: "6 min read",
    tag: "Construction",
    content: [
      "Change orders are the lifeblood of construction. And the paperwork is the nightmare.",
      "Traditionally, a change order requires a site visit, a handwritten note, a typed form, a fax or email, and a signature that may take days to arrive. By then, the work is already done and the risk is already taken.",
      "MintAgree changes the workflow. On site, snap a photo of the change. Generate a receipt with scope, cost, and timeline. The client signs with a one-time code before you leave.",
      "The receipt is in your archive before you drive back. It includes the photo, the GPS location, the timestamp, and the client's digital signature. No lost paper. No delayed approvals. No unpaid work.",
      "For contractors who work on thin margins, this is not a convenience. It is survival.",
    ],
  },
  "built-in-90-days": {
    title: "Why we built MintAgree in 90 days",
    excerpt: "The story behind shipping a full-stack SaaS with Next.js, SQLite, and a single developer.",
    date: "February 2026",
    readTime: "7 min read",
    tag: "Engineering",
    content: [
      "MintAgree was built in 90 days by one developer. Not because we had unlimited time, but because we had a clear problem and a clear solution.",
      "The stack is intentionally simple. Next.js 16 for the frontend and API routes. SQLite via Turso for the database. Tailwind CSS for styling. No Kubernetes, no microservices, no overengineering.",
      "The 3D effects on the landing page — the floating receipt card, the particle system, the orbs — were built with React Three Fiber and Drei. They look premium but they are lightweight. The entire page loads in under 2 seconds.",
      "We chose SQLite because most SaaS startups do not need PostgreSQL on day one. SQLite is fast, simple, and scales farther than people think. Turso gives us edge distribution with zero config.",
      "The lesson is not that you should build fast. It is that you should build focused. Every feature we shipped solves a specific problem for a specific customer. Nothing else made the cut.",
      "The result: a product that agencies, consultants, and freelancers actually use. Not a prototype. A business.",
    ],
  },
};

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) notFound();

  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <FloatingOrbs />
      <CanvasBackground />
      <div className="relative z-10">
        <Nav />

        <article className="max-w-3xl mx-auto px-6 pt-28 pb-16 md:pt-36 md:pb-24">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-8"
          >
            <span>←</span> Back to blog
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium text-mint bg-mint/10 px-2 py-0.5 rounded-full">{post.tag}</span>
            <span className="text-xs text-zinc-500">{post.date} · {post.readTime}</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.08] text-balance mb-8">
            {post.title}
          </h1>

          <div className="prose prose-invert prose-zinc max-w-none">
            {post.content.map((paragraph, i) => (
              <p key={i} className="text-zinc-300 leading-relaxed mb-6 text-lg">{paragraph}</p>
            ))}
          </div>
        </article>

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

export async function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) return { title: "Not Found" };
  return {
    title: `${post.title} — MintAgree Blog`,
    description: post.excerpt,
  };
}
