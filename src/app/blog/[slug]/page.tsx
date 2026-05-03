import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import FloatingOrbs from "@/components/floating-orbs";
import CanvasBackground from "@/components/canvas-background";
import fs from "fs";
import path from "path";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tag: string;
  content: string[];
  keywords?: string[];
  metaDescription?: string;
}

function getPosts(): Record<string, BlogPost> {
  const filePath = path.join(process.cwd(), "content", "blog-posts.json");
  const json = fs.readFileSync(filePath, "utf-8");
  const posts: BlogPost[] = JSON.parse(json);
  const map: Record<string, BlogPost> = {};
  for (const post of posts) {
    map[post.slug] = post;
  }
  return map;
}

function getAllSlugs(): string[] {
  const filePath = path.join(process.cwd(), "content", "blog-posts.json");
  const json = fs.readFileSync(filePath, "utf-8");
  const posts: BlogPost[] = JSON.parse(json);
  return posts.map((p) => p.slug);
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const posts = getPosts();
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
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const posts = getPosts();
  const post = posts[slug];
  if (!post) return { title: "Not Found" };
  return {
    title: `${post.title} — MintAgree Blog`,
    description: post.metaDescription || post.excerpt,
    keywords: post.keywords?.join(", "),
  };
}
