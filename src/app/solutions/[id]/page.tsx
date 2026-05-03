import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import FloatingOrbs from "@/components/floating-orbs";
import CanvasBackground from "@/components/canvas-background";

const solutions: Record<string, {
  title: string;
  headline: string;
  description: string;
  accent: string;
  useCases: { title: string; description: string }[];
  howItWorks: { step: string; title: string; description: string }[];
  benefits: { stat: string; label: string }[];
  body: string;
}> = {
  agencies: {
    title: "Agencies",
    headline: "Scope creep is the silent revenue killer",
    description: "Marketing, creative, and digital agencies. Confirm scope, budget, deliverables, and timelines after every client call or WhatsApp thread with a single receipt.",
    accent: "#2dd4bf",
    useCases: [
      { title: "Post-kickoff alignment", description: "Lock in approved scope, budget, and timelines immediately after the kickoff call — before work begins." },
      { title: "Change-order sign-off", description: "Mid-project scope changes get documented and signed in seconds, not days of email back-and-forth." },
      { title: "Pre-invoice approval", description: "Send a receipt summarizing completed work before invoicing. Clients approve with a one-time code." },
      { title: "WhatsApp negotiation docs", description: "Turn informal WhatsApp threads into structured, signed receipts with full context and attachments." },
    ],
    howItWorks: [
      { step: "01", title: "Wrap the call", description: "Finish your client call or WhatsApp thread with verbal agreement on scope." },
      { step: "02", title: "Generate the receipt", description: "MintAgree drafts a structured receipt with scope, budget, and deliverables in under 90 seconds." },
      { step: "03", title: "Client signs with OTP", description: "The client receives the receipt and confirms with a one-time code — no new accounts, no friction." },
    ],
    benefits: [
      { stat: "−67%", label: "Fewer scope disputes" },
      { stat: "2.3×", label: "Faster approvals" },
      { stat: "41%", label: "Protected margin" },
    ],
    body: "For agencies, scope creep is the silent revenue killer. A 15-minute voice note turns into three extra rounds of revisions, and the client claims that was always included. MintAgree solves this with structured conversation receipts. After every client call or WhatsApp thread, your team generates a receipt with approved scope, budget, and deadlines. The client signs with a one-time code — no new logins, no friction.",
  },
  consultants: {
    title: "Consultants",
    headline: "Every discovery call needs a paper trail",
    description: "Summarize discovery calls and WhatsApp conversations into OTP-signed receipts. Stakeholders approve next steps the same day.",
    accent: "#60a5fa",
    useCases: [
      { title: "Discovery call receipts", description: "Capture scope, deliverables, and timelines from discovery calls before writing the proposal." },
      { title: "Milestone approvals", description: "Get client sign-off at every milestone — advisory, implementation, or review phases." },
      { title: "Engagement sign-off", description: "Confirm advisory terms by email or WhatsApp with a structured, signed receipt." },
      { title: "Scope-change capture", description: "When the client asks for just one more thing, document it and get sign-off instantly." },
    ],
    howItWorks: [
      { step: "01", title: "Finish the call", description: "End your discovery or advisory call with verbal alignment on scope and next steps." },
      { step: "02", title: "Draft the receipt", description: "MintAgree structures the agreement into a receipt with scope, fees, and deadlines." },
      { step: "03", title: "Stakeholder confirms", description: "Clients and stakeholders approve with a one-time code — same day, zero friction." },
    ],
    benefits: [
      { stat: "−54%", label: "Fewer mid-project debates" },
      { stat: "1.8×", label: "Faster approval cycles" },
      { stat: "90s", label: "To generate a receipt" },
    ],
    body: "Consultants live and die by clear scope. Every discovery call introduces variables that, if undocumented, create friction downstream. MintAgree turns your verbal agreements into binding acknowledgment receipts. After a call, generate the receipt in under 90 seconds. The client confirms with a code. Stakeholders are aligned before you write the proposal.",
  },
  freelancers: {
    title: "Freelancers",
    headline: "Stop letting scope creep eat your rates",
    description: "Turn voice notes and WhatsApp messages into client approvals. Capture OTP sign-off on scope and revisions to eliminate scope creep.",
    accent: "#f472b6",
    useCases: [
      { title: "WhatsApp to signed receipt", description: "Turn informal WhatsApp agreements into structured receipts with scope, budget, and deliverables." },
      { title: "Revision-limit acknowledgment", description: "Clients agree to revision limits upfront — documented and signed before work starts." },
      { title: "Budget confirmation", description: "Lock in agreed pricing after negotiation with a one-time code sign-off." },
      { title: "Milestone handoff", description: "Get approval before delivering the next phase — no more unpaid extra rounds." },
    ],
    howItWorks: [
      { step: "01", title: "Agree on scope", description: "Discuss project scope by call, voice note, or WhatsApp with your client." },
      { step: "02", title: "Send the receipt", description: "MintAgree generates a clear receipt with scope, revisions, budget, and due date." },
      { step: "03", title: "Get OTP sign-off", description: "Client confirms with a one-time code. Work starts with a binding record." },
    ],
    benefits: [
      { stat: "−73%", label: "Less scope creep" },
      { stat: "2×", label: "Faster payment" },
      { stat: "100%", label: "Documented agreements" },
    ],
    body: "Freelancers juggle clients, revisions, and the constant risk of just one more thing. Without documentation, every friendly request becomes scope creep. MintAgree gives you a lightweight, zero-friction way to lock in agreements. Capture the scope from your WhatsApp chat or voice call, send a receipt, and get OTP sign-off before you start work.",
  },
  smb: {
    title: "SMBs",
    headline: "Standardize every client conversation",
    description: "Standardize post-call documentation across teams. Attach visuals, set due dates, and build a searchable paper trail.",
    accent: "#a78bfa",
    useCases: [
      { title: "Sales call to receipt", description: "Turn every sales call into a signed record of what was promised, by when, and for how much." },
      { title: "Service agreements", description: "Document service terms with clients as signed receipts — searchable and auditable." },
      { title: "Vendor alignment", description: "Align with vendors on deliverables, timelines, and costs with structured sign-off." },
      { title: "Internal approvals", description: "Team members get sign-off on scope before work begins — no more miscommunication." },
    ],
    howItWorks: [
      { step: "01", title: "Close the conversation", description: "Finish any client or vendor call with verbal agreement on terms." },
      { step: "02", title: "Document instantly", description: "Generate a receipt with scope, budget, due dates, and attachments in seconds." },
      { step: "03", title: "Signed and archived", description: "Counterparty signs with OTP. The receipt is stored in your searchable archive." },
    ],
    benefits: [
      { stat: "−48%", label: "Fewer miscommunications" },
      { stat: "3×", label: "Faster onboarding" },
      { stat: "100%", label: "Searchable archive" },
    ],
    body: "Small businesses thrive on speed — but speed without documentation creates risk. When team members verbally agree on scope with clients, nobody remembers the details the same way. MintAgree standardizes post-call documentation. Every conversation with a client becomes a signed receipt with clear scope, budget, and due dates. Attach photos, screenshots, or reference files for full context.",
  },
  msp: {
    title: "MSPs & IT",
    headline: "Every ticket needs a signed record",
    description: "Confirm tickets, changes, and budgets via receipts your clients sign with a one-time code. Lower churn.",
    accent: "#34d399",
    useCases: [
      { title: "Change-request approval", description: "Clients approve scope changes and additional hours with a one-time code — no email chains." },
      { title: "Incident documentation", description: "Document incident scope, resolution steps, and costs as a signed receipt for the record." },
      { title: "Budget confirmation", description: "Lock in approved budgets for out-of-scope work before the hours are billed." },
      { title: "WhatsApp acknowledgment", description: "Turn quick WhatsApp approvals into binding, structured receipts with full audit trails." },
    ],
    howItWorks: [
      { step: "01", title: "Discuss the change", description: "Client requests a change or additional work by call, ticket, or WhatsApp." },
      { step: "02", title: "Generate receipt", description: "MintAgree drafts a receipt with scope, cost, and timeline in under 90 seconds." },
      { step: "03", title: "OTP confirmation", description: "Client signs with a one-time code. Work proceeds with a binding record." },
    ],
    benefits: [
      { stat: "−62%", label: "Fewer billing disputes" },
      { stat: "1.9×", label: "Clearer SLAs" },
      { stat: "−31%", label: "Lower churn" },
    ],
    body: "Managed service providers face a critical documentation gap: clients approve scope verbally, then dispute the work later. Every undocumented yes is a churn risk. MintAgree closes the gap. After every client call or WhatsApp thread, send a structured receipt with scope, budget, and timeline. The client acknowledges with a one-time code.",
  },
  construction: {
    title: "Construction",
    headline: "Field-ready change orders, signed in seconds",
    description: "Lightweight change-order receipts with photos, dates, and OTP. Field-ready, office-backed.",
    accent: "#fbbf24",
    useCases: [
      { title: "Change-order approvals", description: "Document scope changes, costs, and timelines with photos — signed by client on-site." },
      { title: "Material substitution", description: "Get sign-off on material substitutions with photo evidence and cost impact." },
      { title: "Timeline extensions", description: "Clients acknowledge timeline changes with a one-time code — no delays waiting for signatures." },
      { title: "Photo-backed receipts", description: "Attach on-site photos to every receipt for visual proof of what was agreed." },
    ],
    howItWorks: [
      { step: "01", title: "Discuss on-site", description: "Agree on changes, costs, or timeline shifts during a site visit or call." },
      { step: "02", title: "Snap and document", description: "Attach photos, set costs, and generate the receipt before leaving the site." },
      { step: "03", title: "Instant sign-off", description: "Client approves with OTP. The signed receipt is in your archive before you drive back." },
    ],
    benefits: [
      { stat: "−71%", label: "Faster approvals" },
      { stat: "−55%", label: "Fewer disputes" },
      { stat: "100%", label: "Photo-backed records" },
    ],
    body: "Construction runs on change orders — and every change order needs sign-off. Paper-based approvals are slow. Email threads get lost. WhatsApp approvals are convenient but unenforceable. MintAgree bridges the gap. Snap photos on-site, generate a receipt with scope and cost, and get client sign-off in seconds.",
  },
  legal: {
    title: "Legal & Intake",
    headline: "Capture engagement terms before work begins",
    description: "Capture engagement terms post-intake: scope, fees, deadlines — archive the signed receipt as the record.",
    accent: "#94a3b8",
    useCases: [
      { title: "Engagement pre-approval", description: "Document scope, fees, and timelines as a signed receipt before the engagement letter is drafted." },
      { title: "Scope-change sign-off", description: "When engagement scope shifts, document the change and get client approval instantly." },
      { title: "Fee acknowledgment", description: "Clients confirm fee structures and billing terms with a one-time code — no ambiguity." },
      { title: "Consultation docs", description: "Turn WhatsApp or voice consultations into structured, signed records for the file." },
    ],
    howItWorks: [
      { step: "01", title: "Intake complete", description: "Finish client intake by call, meeting, or WhatsApp with aligned expectations." },
      { step: "02", title: "Draft the receipt", description: "MintAgree structures scope, fees, and deadlines into a receipt in under 90 seconds." },
      { step: "03", title: "Client confirms", description: "The client signs with a one-time code. The receipt becomes your binding record." },
    ],
    benefits: [
      { stat: "−58%", label: "Fewer fee disputes" },
      { stat: "100%", label: "Documented expectations" },
      { stat: "90s", label: "To capture terms" },
    ],
    body: "Legal intake creates binding expectations that live in email and voicemail. When expectations diverge, the firm bears the risk. MintAgree captures engagement terms post-intake as a signed receipt. Scope, fees, deadlines — all confirmed by the client with a one-time code before work begins.",
  },
  sales: {
    title: "Sales Teams",
    headline: "Turn verbal yes into signed commitment",
    description: "Turn verbal yes into signed acknowledgement of commercials and next steps. Pipeline moves faster.",
    accent: "#f87171",
    useCases: [
      { title: "Post-call commercial ack", description: "Document agreed pricing, deliverables, and next steps as a signed receipt after every sales call." },
      { title: "Trial scope alignment", description: "Align with prospects on trial scope, success criteria, and timelines before kickoff." },
      { title: "Contract pre-approval", description: "Get informal sign-off on deal terms before sending the formal contract — close faster." },
      { title: "WhatsApp deal docs", description: "Turn WhatsApp negotiations into structured receipts with full commercial context." },
    ],
    howItWorks: [
      { step: "01", title: "Close the call", description: "End your sales call with verbal agreement on commercials and next steps." },
      { step: "02", title: "Generate receipt", description: "MintAgree drafts a receipt with pricing, scope, and next steps in 90 seconds." },
      { step: "03", title: "Prospect signs", description: "The prospect confirms with a one-time code. Your CRM gets a binding record." },
    ],
    benefits: [
      { stat: "−44%", label: "Fewer stalled deals" },
      { stat: "1.6×", label: "Faster pipeline" },
      { stat: "100%", label: "Documented next steps" },
    ],
    body: "Sales teams lose deals to ambiguity. A verbal yes on a call is not a commitment — it is intent. Without documentation, deals stall. MintAgree transforms verbal agreement into structured acknowledgment. After every sales call, send a receipt summarizing commercials, deliverables, and next steps. The prospect signs with a code.",
  },
  enterprise: {
    title: "Enterprise",
    headline: "Governance-ready receipts at scale",
    description: "Governance-ready receipts with SSO, audit trail, and compliance-grade document handling.",
    accent: "#c084fc",
    useCases: [
      { title: "Procurement approvals", description: "Document procurement scope, budget, and vendor terms as signed receipts with full audit trails." },
      { title: "Vendor alignment", description: "Align with vendors on deliverables, SLAs, and costs with structured, signed records." },
      { title: "Internal sign-off", description: "Teams get cross-functional sign-off on project scope before execution — no surprises." },
      { title: "Compliance documentation", description: "Every receipt includes full audit trails, timestamps, and role-based access controls." },
    ],
    howItWorks: [
      { step: "01", title: "Align stakeholders", description: "Agree on scope, budget, and terms across teams and vendors by call or meeting." },
      { step: "02", title: "Generate receipt", description: "MintAgree structures the agreement with full context, attachments, and compliance fields." },
      { step: "03", title: "Governed sign-off", description: "Stakeholders sign with SSO-authenticated OTP. Full audit trail is captured automatically." },
    ],
    benefits: [
      { stat: "100%", label: "Audit trail coverage" },
      { stat: "−38%", label: "Faster internal approvals" },
      { stat: "SOC 2", label: "Compliance ready" },
    ],
    body: "Enterprise teams need governance, not just convenience. Every agreement needs an audit trail, role-based access, and compliance-grade documentation. MintAgree provides receipts with enterprise-grade controls. SSO login, full audit trails, and structured sign-off workflows that satisfy compliance requirements.",
  },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SolutionPage({ params }: Props) {
  const { id } = await params;
  const data = solutions[id];
  if (!data) notFound();

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

            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
              <div>
                <div
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs mb-6"
                  style={{ borderColor: `${data.accent}33`, backgroundColor: `${data.accent}11`, color: data.accent }}
                >
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: data.accent }} />
                  MintAgree for {data.title}
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] text-balance">
                  {data.headline.split(" ").slice(0, -2).join(" ")}{" "}
                  <span className="text-mint">{data.headline.split(" ").slice(-2).join(" ")}</span>
                </h1>

                <p className="mt-6 text-base md:text-lg text-zinc-400 leading-relaxed max-w-lg">
                  {data.description}
                </p>

                <div className="mt-8 flex items-center gap-3 flex-wrap">
                  <Link
                    href="/demo"
                    className="inline-flex items-center justify-center rounded-lg px-8 py-4 text-sm font-semibold bg-mint text-zinc-950 hover:bg-mint-hover transition-all shadow-glow hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Start free — {data.title}
                  </Link>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center justify-center rounded-lg px-6 py-3.5 text-sm font-medium border border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors"
                  >
                    See pricing
                  </Link>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {data.benefits.map((b) => (
                  <div
                    key={b.label}
                    className="rounded-xl border border-zinc-800 bg-surface p-5 text-center"
                  >
                    <div className="text-2xl md:text-3xl font-bold text-white">{b.stat}</div>
                    <div className="text-xs text-zinc-500 mt-1">{b.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Body */}
        <section className="max-w-3xl mx-auto px-6 py-12 md:py-16">
          <div className="prose prose-invert prose-zinc max-w-none">
            <p className="text-lg text-zinc-300 leading-relaxed">{data.body}</p>
          </div>
        </section>

        {/* Use Cases */}
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Built for how <span className="text-mint">{data.title}</span> work
            </h2>
            <p className="mt-3 text-zinc-400 max-w-xl mx-auto">
              Four use cases. One workflow. Call → Receipt → Sign-off.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.useCases.map((uc, i) => (
              <div
                key={uc.title}
                className="relative rounded-xl border border-zinc-800 bg-surface p-6 hover:border-zinc-700 hover:bg-surface-raised hover:-translate-y-0.5 transition-all group overflow-hidden"
              >
                <div
                  className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full"
                  style={{ backgroundColor: data.accent, opacity: 0.7 }}
                />
                <div className="pl-4">
                  <div
                    className="text-xs font-semibold uppercase tracking-wider mb-2"
                    style={{ color: data.accent }}
                  >
                    Use case 0{i + 1}
                  </div>
                  <h3 className="font-semibold text-white mb-2">{uc.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{uc.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 border-t border-white/5">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Three steps. <span className="text-mint">Two minutes.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.howItWorks.map((step) => (
              <div
                key={step.step}
                className="rounded-xl border border-zinc-800 bg-surface p-6 text-center"
              >
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl text-lg font-bold mb-4"
                  style={{ backgroundColor: `${data.accent}15`, color: data.accent }}
                >
                  {step.step}
                </div>
                <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-b from-zinc-950 to-zinc-900 border-t border-white/5 py-20 md:py-28">
          <div className="glow-border max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Stop losing deals to{" "}
              <span className="text-mint">ambiguity</span>.
            </h2>
            <p className="text-lg text-zinc-400 mb-2">
              Your first receipt is free. No credit card required.
            </p>
            <p className="text-sm text-zinc-500 mb-10">
              Get your clients aligned before the project starts. Not after it explodes.
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

            <div className="mt-10 flex flex-wrap items-center justify-center gap-5 text-xs text-zinc-600">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-zinc-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                SOC 2 Type II in progress
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-zinc-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                99.9% uptime
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-zinc-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                End-to-end encrypted
              </span>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  return Object.keys(solutions).map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const data = solutions[id];
  if (!data) return { title: "Not Found" };
  return {
    title: `MintAgree for ${data.title} — Conversation Receipts & Sign-Off`,
    description: data.description,
  };
}
