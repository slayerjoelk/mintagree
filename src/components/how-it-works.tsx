export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Call ends",
      description:
        "You finish the client call with clear next steps in mind. Open MintAgree.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
    },
    {
      number: "02",
      title: "Receipt sent",
      description:
        "Fill in scope, deliverables, budget, and due dates. Attach files. Hit send. 90 seconds tops.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      ),
    },
    {
      number: "03",
      title: "Client signs",
      description:
        "They get a link. Enter the one-time code. Done — binding acknowledgment. Project begins aligned.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
          How <span className="text-mint">MintAgree</span> works
        </h2>
        <p className="mt-3 text-zinc-400">
          Three steps. Two minutes. Zero complexity.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {steps.map((s, i) => (
          <div key={s.number} className="relative">
            {/* Step card */}
            <div className="rounded-2xl border border-zinc-800 bg-surface p-6 h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-9 h-9 rounded-lg bg-mint/10 border border-mint/20 flex items-center justify-center text-mint">
                  {s.icon}
                </div>
                <span className="text-xs font-mono text-zinc-600">{s.number}</span>
              </div>
              <h3 className="font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{s.description}</p>
            </div>

            {/* Connector arrow */}
            {i < steps.length - 1 && (
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-zinc-800">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t border-r border-zinc-600 rotate-45" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
