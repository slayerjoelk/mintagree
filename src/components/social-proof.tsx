const testimonials = [
  {
    quote:
      "Approvals jumped and scope creep vanished. Clients love the short receipt with OTP — we send one after every kickoff call now.",
    name: "Dana",
    role: "Agency owner",
    company: "Northstar Creative",
  },
  {
    quote:
      "I send a receipt 2 minutes after each discovery call. Stakeholders sign the same day. My project starts with alignment, not ambiguity.",
    name: "Miguel",
    role: "Consultant",
    company: "BluePeak Advisory",
  },
  {
    quote:
      "Attach a mockup, share budget and revisions, get a code — sleep better. This replaced my scope creep problem overnight.",
    name: "Priya",
    role: "Independent Designer",
    company: "Freelance",
  },
];

const logoNames = [
  "Northstar", "BluePeak", "RapidIT", "BuildRight", "Lumen", "Studio V",
];

export default function SocialProof() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Trusted by teams who{" "}
          <span className="text-mint">ship on clarity</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="rounded-2xl border border-zinc-800 bg-surface p-6 flex flex-col"
          >
            <div className="text-4xl text-mint font-serif mb-2 leading-none">
              &ldquo;
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed flex-1">
              {t.quote}
            </p>
            <div className="mt-4 pt-4 border-t border-zinc-800">
              <div className="font-semibold text-sm">{t.name}</div>
              <div className="text-xs text-zinc-500">
                {t.role}, {t.company}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Logo wall */}
      <div className="text-center">
        <p className="text-xs text-zinc-600 mb-4 uppercase tracking-widest font-mono">
          Trusted by forward-thinking teams
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 opacity-40">
          {logoNames.map((name) => (
            <span key={name} className="text-sm font-semibold text-zinc-500">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
