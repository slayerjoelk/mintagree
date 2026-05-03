import { notFound } from "next/navigation";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

const solutions: Record<string, { title: string; description: string; body: string }> = {
  agencies: {
    title: "Agencies",
    description: "Marketing, creative, and digital agencies. Confirm scope, budget, deliverables, and timelines after every client call or WhatsApp thread with a single receipt.",
    body: `For agencies, scope creep is the silent revenue killer. A 15-minute voice note turns into three extra rounds of revisions, and the client claims "that was always included."

MintAgree solves this with structured conversation receipts. After every client call or WhatsApp thread, your team generates a receipt with approved scope, budget, and deadlines. The client signs with a one-time code — no new logins, no friction.

Use cases:
- Post-kickoff scope alignment
- Change-order sign-off after mid-project calls
- Approval receipts before invoice submission
- WhatsApp negotiation documentation

Result: fewer disputes, faster approvals, and a paper trail that protects your margins.`
  },
  consultants: {
    title: "Consultants",
    description: "Summarize discovery calls and WhatsApp conversations into OTP-signed receipts. Stakeholders approve next steps the same day.",
    body: `Consultants live and die by clear scope. Every discovery call introduces variables that, if undocumented, create friction downstream.

MintAgree turns your verbal agreements into binding acknowledgment receipts. After a call, generate the receipt in under 90 seconds. The client confirms with a code. Stakeholders are aligned before you write the proposal.

Use cases:
- Discovery call scope receipts
- Milestone approval documentation
- Advisory engagement sign-off by email or WhatsApp
- Change-of-scope capture

Result: faster approval cycles, fewer mid-project scope debates, and a professional record your clients respect.`
  },
  freelancers: {
    title: "Freelancers",
    description: "Turn voice notes and WhatsApp messages into client approvals. Capture OTP sign-off on scope and revisions to eliminate scope creep.",
    body: `Freelancers juggle clients, revisions, and the constant risk of "just one more thing." Without documentation, every friendly request becomes scope creep.

MintAgree gives you a lightweight, zero-friction way to lock in agreements. Capture the scope from your WhatsApp chat or voice call, send a receipt, and get OTP sign-off before you start work.

Use cases:
- WhatsApp thread to signed receipt
- Revision-limits acknowledgment
- Budget confirmation after price negotiation
- Milestone approval before deliverable handoff

Result: clients respect your boundaries, invoices get paid faster, and your work stays within scope.`
  },
  smb: {
    title: "SMBs",
    description: "Standardize post-call documentation across teams. Attach visuals, set due dates, and build a searchable paper trail.",
    body: `Small businesses thrive on speed — but speed without documentation creates risk. When team members verbally agree on scope with clients, nobody remembers the details the same way.

MintAgree standardizes post-call documentation. Every conversation with a client becomes a signed receipt with clear scope, budget, and due dates. Attach photos, screenshots, or reference files for full context.

Use cases:
- Sales call to receipt
- Service agreement documentation
- Vendor scope alignment
- Internal approvals with paper trail

Result: fewer miscommunications, faster onboarding, and a searchable archive of every client agreement.`
  },
  msp: {
    title: "MSPs & IT",
    description: "Confirm tickets, changes, and budgets via receipts your clients sign with a one-time code. Lower churn.",
    body: `Managed service providers face a critical documentation gap: clients approve scope verbally, then dispute the work later. Every undocumented "yes" is a churn risk.

MintAgree closes the gap. After every client call or WhatsApp thread, send a structured receipt with scope, budget, and timeline. The client acknowledges with a one-time code.

Use cases:
- Change-request approval
- Incident scope documentation
- Budget confirmation for additional hours
- WhatsApp thread to signed acknowledgment

Result: fewer disputes, clearer SLAs, and clients who trust your process.`
  },
  construction: {
    title: "Construction",
    description: "Lightweight change-order receipts with photos, dates, and OTP. Field-ready, office-backed.",
    body: `Construction runs on change orders — and every change order needs sign-off. Paper-based approvals are slow. Email threads get lost. WhatsApp approvals are convenient but unenforceable.

MintAgree bridges the gap. Snap photos on-site, generate a receipt with scope and cost, and get client sign-off in seconds.

Use cases:
- Change-order approvals
- Material substitution sign-off
- Timeline extension acknowledgment
- Photo-backed agreement receipts

Result: faster approvals, fewer disputes, and a digital archive you can search.`
  },
  legal: {
    title: "Legal & Intake",
    description: "Capture engagement terms post-intake: scope, fees, deadlines — archive the signed receipt as the record.",
    body: `Legal intake creates binding expectations that live in email and voicemail. When expectations diverge, the firm bears the risk.

MintAgree captures engagement terms post-intake as a signed receipt. Scope, fees, deadlines — all confirmed by the client with a one-time code before work begins.

Use cases:
- Engagement letter pre-approval
- Scope-change sign-off
- Fee acknowledgment receipts
- WhatsApp consultation documentation

Result: clearer expectations, fewer fee disputes, and an archive that stands up.`
  },
  sales: {
    title: "Sales Teams",
    description: 'Turn verbal "yes" into signed acknowledgement of commercials and next steps. Pipeline moves faster.',
    body: `Sales teams lose deals to ambiguity. A verbal "yes" on a call isn't a commitment — it's intent. Without documentation, deals stall.

MintAgree transforms verbal agreement into structured acknowledgment. After every sales call, send a receipt summarizing commercials, deliverables, and next steps. The prospect signs with a code.

Use cases:
- Post-call commercial acknowledgment
- Trial scope alignment
- Contract pre-approval
- WhatsApp negotiation documentation

Result: fewer stalled deals, clearer next steps, and a paper trail that accelerates your pipeline.`
  },
  enterprise: {
    title: "Enterprise",
    description: "Governance-ready receipts with SSO, audit trail, and compliance-grade document handling.",
    body: `Enterprise teams need governance, not just convenience. Every agreement needs an audit trail, role-based access, and compliance-grade documentation.

MintAgree provides receipts with enterprise-grade controls. SSO login, full audit trails, and structured sign-off workflows that satisfy compliance requirements.

Use cases:
- Procurement approval receipts
- Vendor scope alignment
- Internal sign-off workflows
- Compliance documentation

Result: faster internal approvals, complete audit trails, and governance that scales.`
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
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <Nav />
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        <a
          href="/"
          className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-1 mb-6"
        >
          <span>←</span> Back to home
        </a>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          MintAgree for <span className="text-mint">{data.title}</span>
        </h1>
        <p className="text-zinc-400 text-lg mb-10">{data.description}</p>
        <div className="prose prose-invert prose-zinc max-w-none">
          {data.body.split("\n\n").map((paragraph, i) => {
            const lines = paragraph.split("\n").filter((l) => l.trim());
            if (lines[0]?.startsWith("Use cases:") || lines[0]?.startsWith("Result:")) {
              return (
                <div key={i} className="mb-6">
                  <p className="text-zinc-300 font-medium mb-2">{lines[0]}</p>
                  <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                    {lines.slice(1).map((item, j) => (
                      <li key={j}>{item.replace(/^[-–]\s*/, "")}</li>
                    ))}
                  </ul>
                </div>
              );
            }
            return (
              <p key={i} className="text-zinc-300 leading-relaxed mb-4">
                {lines.join(" ")}
              </p>
            );
          })}
        </div>
      </div>
      <Footer />
    </main>
  );
}
