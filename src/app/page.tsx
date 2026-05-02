"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://mintagree.com";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30 text-slate-900">
      <Nav />
      <Hero />
      <Solutions />
      <SocialProof />
      <Features />
      <Pricing />
      <Blog />
      <FAQ />
      <SubscribeCTA />
      <Footer />
      <JsonLD />
    </main>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/demo", label: "Live demo" },
    { href: "#solutions", label: "Solutions" },
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
    { href: "#proof", label: "Results" },
    { href: "#blog", label: "Blog" },
    { href: "#faq", label: "FAQ" },
    { href: "/login", label: "Login" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          AgreeMint
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm" aria-label="Primary">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-emerald-700">
              {l.label}
            </Link>
          ))}
          <Link
            href="/pricing"
            className="px-3 py-2 rounded-xl border bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Subscribe
          </Link>
        </nav>
        <button
          className="md:hidden p-2 rounded-lg hover:bg-slate-100"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            {open ? (
              <path fillRule="evenodd" clipRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
            ) : (
              <path fillRule="evenodd" clipRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
            )}
          </svg>
        </button>
      </div>
      {open && (
        <nav
          className="md:hidden border-t bg-white px-6 py-3 flex flex-col gap-1 text-sm"
          aria-label="Mobile"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="py-2 hover:text-emerald-700"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/pricing"
            className="mt-2 inline-flex items-center justify-center rounded-xl border px-5 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700"
            onClick={() => setOpen(false)}
          >
            Subscribe
          </Link>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <div className="relative overflow-hidden" id="home">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 to-white" />
      <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white border rounded-full px-3 py-1 text-xs mb-3 shadow-sm">
              <span>New</span>
              <span className="text-emerald-700">Voice → Agreement</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
              Turn calls into signed client agreement receipts
            </h1>
            <p className="text-slate-600 mt-4">
              AgreeMint is voice agreement & client sign-off software for agencies,
              consultants, freelancers, SMBs, enterprises, MSPs, legal and construction
              teams. Send a clear conversation receipt with scope, budget and due dates,
              attach visuals, and capture OTP acknowledgement — so projects start aligned
              and disputes drop.
            </p>
            <div className="mt-6 flex gap-3">
              <Link
                href="/demo"
                className="inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-medium shadow-sm bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Try the live demo
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-medium shadow-sm bg-white hover:bg-slate-50"
              >
                Subscribe
              </Link>
            </div>
            <div className="text-xs text-slate-600 mt-3">
              No long contracts. Cancel anytime. 14-day money-back guarantee.
            </div>
          </div>
          <div className="rounded-2xl border bg-white/70 p-6 shadow-sm">
            <div className="text-sm text-slate-700">
              "After every call we send an AgreeMint receipt. Clients sign off in minutes,
              not days."
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4 text-xs">
              <StatBox value="4.9/5" label="Avg rating" />
              <StatBox value="2.3×" label="Faster approvals" />
              <StatBox value="90s" label="To send" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border p-3 bg-white text-center" aria-label={`${label}: ${value}`}>
      <div className="text-xl font-semibold">{value}</div>
      <div className="text-slate-600">{label}</div>
    </div>
  );
}

function Solutions() {
  const rows = [
    {
      id: "agencies",
      h: "For agencies",
      p: "Marketing, creative, and digital agencies use AgreeMint as voice agreement software to confirm scope, budget, deliverables and timelines after client calls.",
      k: "agency approval workflow, client sign-off software for agencies, creative brief sign-off",
    },
    {
      id: "consultants",
      h: "For consultants",
      p: "Summarize discovery calls into conversation receipts with OTP acknowledgement so stakeholders approve next steps fast.",
      k: "consultant sign-off, statement of work confirmation",
    },
    {
      id: "freelancers",
      h: "For freelancers",
      p: "Turn voice notes into client approvals. Capture OTP sign-off on scope and revisions to avoid scope creep.",
      k: "freelancer scope tool, client approval receipt",
    },
    {
      id: "smb",
      h: "For SMBs & services",
      p: "Standardize post-call receipts across teams — field services, studios, clinics — attach visuals and schedule delivery.",
      k: "service business software, post-call summary",
    },
    {
      id: "msp",
      h: "For MSPs & IT",
      p: "Confirm tickets, changes and budgets via conversation receipts that your clients sign with a one-time code.",
      k: "MSP agreement software, change request sign-off",
    },
    {
      id: "construction",
      h: "For construction & trades",
      p: "Send change-order style receipts with photos, due dates and OTP to keep jobs aligned.",
      k: "construction change order confirmation, site instruction receipt",
    },
    {
      id: "legal",
      h: "For legal & intake",
      p: "Capture engagement understanding post-intake: scope, fees, deadlines — then archive the signed receipt.",
      k: "legal intake confirmation, client acknowledgement tool",
    },
    {
      id: "sales",
      h: "For sales teams",
      p: "Turn verbal 'yes' into a signed acknowledgement summarizing commercials and next steps.",
      k: "sales call confirmation, customer approval receipt",
    },
    {
      id: "enterprise",
      h: "For enterprise",
      p: "Governance-ready conversation receipts with audit trail and SSO.",
      k: "enterprise approval software, audit-ready sign-off",
    },
  ];

  return (
    <section id="solutions" className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">
        Solutions for every team
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rows.map((r) => (
          <div key={r.id} className="rounded-2xl border p-5 bg-white shadow-sm">
            <h3 className="text-xl font-semibold">{r.h}</h3>
            <p className="text-slate-700 text-sm mt-1">{r.p}</p>
            <div className="text-xs text-slate-500 mt-2">{r.k}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SocialProof() {
  const [featured, setFeatured] = useState(0);

  const reviews = [
    {
      name: "Dana",
      role: "Agency owner",
      company: "Northstar Creative",
      industry: "Agency",
      quote:
        "Approvals jumped and scope creep vanished. Clients love the short receipt with OTP.",
      metric: "+38% faster approvals",
    },
    {
      name: "Miguel",
      role: "Consultant",
      company: "BluePeak Advisory",
      industry: "Consulting",
      quote:
        "I send a receipt 2 minutes after each discovery call. Stakeholders sign the same day.",
      metric: "Same-day sign-off",
    },
    {
      name: "Priya",
      role: "Freelancer",
      company: "Independent Designer",
      industry: "Freelance",
      quote:
        "Attach a mockup, share budget and revisions, get a code — sleep better.",
      metric: "Fewer disputes",
    },
    {
      name: "Jordan",
      role: "MSP Owner",
      company: "RapidIT",
      industry: "MSP",
      quote:
        "Change requests are clear now. Our ticket churn is lower and clients thank us.",
      metric: "−41% disputes",
    },
    {
      name: "Alexis",
      role: "Construction PM",
      company: "BuildRight",
      industry: "Construction",
      quote:
        "Photos + dates + OTP works like a lightweight change order.",
      metric: "Field-ready receipts",
    },
    {
      name: "Riley",
      role: "Legal Ops",
      company: "Lumen Legal",
      industry: "Legal",
      quote:
        "Intake confirmations are standardized and searchable. Huge win for alignment.",
      metric: "Audit-ready",
    },
  ];

  useEffect(() => {
    const id = setInterval(
      () => setFeatured((i) => (i + 1) % reviews.length),
      4000
    );
    return () => clearInterval(id);
  }, [reviews.length]);

  return (
    <section id="proof" className="max-w-7xl mx-auto px-6 py-16">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold">
              Loved by agencies, consultants, SMBs and enterprises
            </h2>
            <div className="text-slate-700 mt-1">
              ★★★★★ <b>4.9/5</b> · Based on 327+ verified reviews
            </div>
          </div>
          <div className="flex gap-2 text-xs text-slate-600">
            <span className="rounded-full border px-2 py-1">Faster approvals</span>
            <span className="rounded-full border px-2 py-1">Fewer disputes</span>
            <span className="rounded-full border px-2 py-1">Audit-ready</span>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mt-6 items-stretch">
          <div className="md:col-span-2 rounded-xl border p-5 bg-white shadow-sm">
            <div className="text-xs text-slate-500">Featured</div>
            <div className="text-xl font-semibold mt-1">
              "{reviews[featured].quote}"
            </div>
            <div className="text-slate-600 mt-2">
              {reviews[featured].name} — {reviews[featured].role}, {reviews[featured].company} ·{" "}
              <span className="text-slate-500">{reviews[featured].industry}</span>
            </div>
            <div className="mt-2 text-emerald-700 text-sm">{reviews[featured].metric}</div>
            <div className="mt-3 text-sm">★★★★★ 5.0</div>
          </div>
          <div className="grid gap-4">
            {reviews.slice(0, 3).map((r) => (
              <div key={r.name} className="rounded-xl border p-4 bg-white">
                <div className="text-sm">"{r.quote}"</div>
                <div className="text-xs text-slate-600 mt-2">
                  {r.name} · {r.industry} · ★★★★★
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="rounded-xl border p-4 bg-white">
            <div className="text-2xl font-semibold">2.3×</div>
            <div className="text-sm text-slate-600">
              Faster sign-offs vs raw transcripts
            </div>
          </div>
          <div className="rounded-xl border p-4 bg-white">
            <div className="text-2xl font-semibold">−41%</div>
            <div className="text-sm text-slate-600">
              Fewer scope disputes reported
            </div>
          </div>
          <div className="rounded-xl border p-4 bg-white">
            <div className="text-2xl font-semibold">90s</div>
            <div className="text-sm text-slate-600">
              Typical time to send a receipt
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { t: "Conversation receipts", s: "Convert voice notes and chats to client-friendly receipts." },
    { t: "Client sign-off (OTP)", s: "Capture OTP acknowledgement to reduce disputes." },
    { t: "Scope & budget tracking", s: "Confirm scope, deliverables, and budget after every call." },
    { t: "Visual attachments", s: "Attach screenshots or proofs and schedule delivery." },
    { t: "Playbooks", s: "Templates for agencies, consultants, freelancers and SMBs." },
    { t: "Assignments & reminders", s: "Assign items, due dates and follow-ups to teammates." },
  ];

  return (
    <section id="features" className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">
        Voice agreement features for service businesses
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((x, i) => (
          <div key={i} className="rounded-2xl border p-5 bg-white shadow-sm" aria-label={x.t}>
            <div className="font-semibold mb-1">{x.t}</div>
            <div className="text-slate-600 text-sm">{x.s}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  const [annual, setAnnual] = useState(false);

  const tiers = [
    {
      slug: "starter",
      name: "Starter",
      price: annual ? 15.17 : 19,
      bullets: [
        "Up to 3 seats",
        "Unlimited conversation receipts",
        "OTP sign-off",
        "Client portal",
      ],
      highlight: false,
    },
    {
      slug: "pro",
      name: "Pro",
      price: annual ? 31.17 : 39,
      bullets: [
        "Up to 10 seats",
        "Assignments",
        "Advanced reminders",
        "Priority support",
      ],
      highlight: true,
    },
    {
      slug: "enterprise",
      name: "Enterprise",
      price: annual ? 119.17 : 149,
      bullets: [
        "Unlimited seats",
        "SSO & audit trail",
        "Custom playbooks",
        "Dedicated support",
      ],
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">
        Simple pricing
      </h2>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm text-slate-600">Monthly</span>
        <button
          role="switch"
          aria-checked={annual}
          onClick={() => setAnnual((a) => !a)}
          className={
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors " +
            (annual ? "bg-emerald-600" : "bg-slate-200")
          }
        >
          <span
            className={
              "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform " +
              (annual ? "translate-x-6" : "translate-x-1")
            }
          />
        </button>
        <span className="text-sm text-slate-600">
          Annual{" "}
          <span className="text-emerald-700 font-medium">Save 20%</span>
        </span>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {tiers.map((t) => (
          <div
            key={t.slug}
            className={
              "rounded-2xl border p-6 bg-white shadow-sm" +
              (t.highlight ? " ring-2 ring-emerald-600" : "")
            }
          >
            <div className="flex items-baseline justify-between">
              <div className="font-semibold">{t.name}</div>
              {t.highlight && (
                <span className="px-2 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Most popular
                </span>
              )}
            </div>
            <div className="text-3xl font-semibold mt-1">
              ${t.price % 1 === 0 ? t.price : t.price.toFixed(2)}
              <span className="text-base font-normal text-slate-600">
                {annual ? "/mo, billed annually" : "/mo"}
              </span>
            </div>
            <ul className="mt-3 text-sm list-disc pl-5 space-y-1">
              {t.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-medium shadow-sm bg-emerald-600 text-white hover:bg-emerald-700 mt-4 w-full"
            >
              Subscribe
            </Link>
            <div className="text-xs text-slate-500 mt-2">
              14-day money-back guarantee.
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Blog() {
  const posts = [
    {
      slug: "conversation-receipts",
      title: "Conversation receipts vs transcripts: what clients actually sign",
      date: "2025-08-12",
      excerpt:
        "Why client sign-off improves when you send a concise conversation receipt instead of a raw transcript.",
    },
    {
      slug: "otp-client-signoff",
      title: "How OTP client sign-off reduces disputes",
      date: "2025-08-05",
      excerpt:
        "Lightweight authentication drastically improves clarity and accountability.",
    },
  ];

  return (
    <section id="blog" className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">
        Insights
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((p) => (
          <article
            key={p.slug}
            className="rounded-2xl border bg-white p-5 shadow-sm"
          >
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Article",
                  headline: p.title,
                  datePublished: p.date,
                  description: p.excerpt,
                  url: `${SITE_URL}/blog/${p.slug}`,
                  publisher: {
                    "@type": "Organization",
                    name: "AgreeMint",
                    url: SITE_URL,
                  },
                }),
              }}
            />
            <h3 className="text-xl font-semibold">{p.title}</h3>
            <div className="text-xs text-slate-500 mt-1">
              {new Date(p.date).toLocaleDateString()}
            </div>
            <p className="text-sm text-slate-700 mt-2">{p.excerpt}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  const qa = [
    {
      q: "What is a conversation receipt?",
      a: "A short, client-friendly summary of scope, budget and due dates generated from your voice notes or chats, sent for client sign-off with an OTP.",
    },
    {
      q: "Is OTP client sign-off legally binding?",
      a: "OTP provides lightweight identity confirmation. Always follow your jurisdiction's contract rules and consult counsel when needed.",
    },
    {
      q: "Can I attach visuals and schedule delivery?",
      a: "Yes. Upload proof images or screenshots and choose to send immediately or at a scheduled date/time.",
    },
    {
      q: "Who is this for?",
      a: "Agencies, consultants, freelancers, SMBs, MSPs, legal, construction and enterprise teams that need clear scope confirmation after calls.",
    },
  ];

  return (
    <section id="faq" className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">
        FAQ: voice agreement & client sign-off
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {qa.map((x, i) => (
          <div key={i} className="rounded-2xl border p-5 bg-white shadow-sm">
            <div className="font-semibold mb-1">{x.q}</div>
            <div className="text-slate-700 text-sm">{x.a}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SubscribeCTA() {
  return (
    <section id="subscribe" className="max-w-7xl mx-auto px-6 py-16">
      <div className="rounded-2xl border bg-white p-6 shadow-sm grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold">
            Start sending conversation receipts today
          </h2>
          <p className="text-slate-700 mt-2">
            Get clearer approvals, fewer disputes, and faster project kick-offs.
            14-day money-back guarantee.
          </p>
        </div>
        <div className="flex md:justify-end gap-3">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-medium shadow-sm bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Choose a plan
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-medium shadow-sm bg-white hover:bg-slate-50"
          >
            See the demo
          </Link>
        </div>
      </div>
      <div className="text-center text-xs text-slate-500 mt-3">
        Popular: voice agreement software · client sign-off tool · conversation
        receipts app · scope confirmation software · OTP agreement confirmation
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t">
      <div className="max-w-7xl mx-auto px-6 py-10 text-sm text-slate-600">
        <div>© {new Date().getFullYear()} AgreeMint. All rights reserved.</div>
        <div className="mt-2">
          Built for speed: minimal JS, lazy images, semantic HTML, no blocking fonts.
        </div>
      </div>
    </footer>
  );
}

function JsonLD() {
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "AgreeMint",
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/logo.png`,
      sameAs: [
        "https://www.linkedin.com/company/mintagree",
        "https://twitter.com/mintagree",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: "AgreeMint",
      url: `${SITE_URL}/`,
      description:
        "Voice agreement & client sign-off software for agencies, consultants, freelancers, SMBs and enterprises. Create conversation receipts with OTP acknowledgement, visual attachments and scheduling.",
      offers: [
        {
          "@type": "Offer",
          priceCurrency: "USD",
          price: 19,
          name: "Starter",
          availability: "https://schema.org/InStock",
        },
        {
          "@type": "Offer",
          priceCurrency: "USD",
          price: 39,
          name: "Pro",
          availability: "https://schema.org/InStock",
        },
        {
          "@type": "Offer",
          priceCurrency: "USD",
          price: 149,
          name: "Enterprise",
          availability: "https://schema.org/InStock",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "AgreeMint",
      url: `${SITE_URL}/`,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "19", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is a conversation receipt?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A short, client-friendly summary of scope, budget and due dates generated from your voice notes or chats, sent for client sign-off with an OTP.",
          },
        },
        {
          "@type": "Question",
          name: "Is OTP client sign-off legally binding?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "OTP provides lightweight identity confirmation. Always follow your jurisdiction's contract rules and consult counsel when needed.",
          },
        },
        {
          "@type": "Question",
          name: "Can I attach visuals and schedule delivery?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Upload proof images or screenshots and choose to send immediately or at a scheduled date/time.",
          },
        },
        {
          "@type": "Question",
          name: "Who is this for?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Agencies, consultants, freelancers, SMBs, MSPs, legal, construction and enterprise teams that need clear scope confirmation after calls.",
          },
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      url: `${SITE_URL}/`,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ];

  return (
    <>
      {ld.map((json, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
        />
      ))}
    </>
  );
}
