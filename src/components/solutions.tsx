const audiences = [
  { id: "agencies", label: "Agencies", description: "Marketing, creative, and digital agencies. Confirm scope, budget, deliverables, and timelines after every client call with a single receipt.", accent: "#2dd4bf" },
  { id: "consultants", label: "Consultants", description: "Summarize discovery calls into OTP-signed receipts. Stakeholders approve next steps the same day.", accent: "#60a5fa" },
  { id: "freelancers", label: "Freelancers", description: "Turn voice notes into client approvals. Capture OTP sign-off on scope and revisions to eliminate scope creep.", accent: "#f472b6" },
  { id: "smb", label: "SMBs", description: "Standardize post-call documentation across teams. Attach visuals, set due dates, and build a searchable paper trail.", accent: "#a78bfa" },
  { id: "msp", label: "MSPs & IT", description: "Confirm tickets, changes, and budgets via receipts your clients sign with a one-time code. Lower churn.", accent: "#34d399" },
  { id: "construction", label: "Construction", description: "Lightweight change-order receipts with photos, dates, and OTP. Field-ready, office-backed.", accent: "#fbbf24" },
  { id: "legal", label: "Legal & Intake", description: "Capture engagement terms post-intake: scope, fees, deadlines — archive the signed receipt as the record.", accent: "#94a3b8" },
  { id: "sales", label: "Sales teams", description: 'Turn verbal "yes" into signed acknowledgement of commercials and next steps. Pipeline moves faster.', accent: "#f87171" },
  { id: "enterprise", label: "Enterprise", description: "Governance-ready receipts with SSO, audit trail, and compliance-grade document handling.", accent: "#c084fc" },
];

export default function Solutions() {
  return (
    <section id="solutions" className="max-w-7xl mx-auto px-6 py-20 md:py-28">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Built for every team that{" "}
          <span className="text-mint">talks to clients</span>
        </h2>
        <p className="mt-3 text-zinc-400 max-w-xl mx-auto">
          Nine industries. One workflow. Call → Receipt → Sign-off.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {audiences.map((a) => (
          <div
            key={a.id}
            className="relative rounded-xl border border-zinc-800 bg-surface p-4 hover:border-zinc-700 hover:bg-surface-raised transition-all group cursor-default overflow-hidden"
          >
            <div
              className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full transition-all group-hover:h-[calc(100%-16px)] group-hover:top-2"
              style={{ backgroundColor: a.accent, opacity: 0.7 }}
            />
            <h3 className="font-semibold text-sm pl-3" style={{ color: a.accent }}>
              {a.label}
            </h3>
            <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed pl-3">
              {a.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
