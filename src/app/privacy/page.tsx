import Nav from "@/components/nav";
import Footer from "@/components/footer";
import FloatingOrbs from "@/components/floating-orbs";
import CanvasBackground from "@/components/canvas-background";

const sections = [
  {
    title: "What we collect",
    content: [
      "We collect the minimum data required to run the service: your email address, conversation metadata, receipt data, and client contact details. We do not sell your data.",
      "When you use MintAgree, we store the receipts you create, the client information you provide, and the sign-off records generated. This data is necessary for the core functionality of the platform.",
    ],
  },
  {
    title: "How we use data",
    content: [
      "Your data is used solely to operate MintAgree: sending receipts, enabling client sign-off, and providing analytics. We never share data with third parties for advertising.",
      "We may use aggregated, anonymized data to improve our service and understand usage patterns. This data cannot be used to identify you or your clients.",
    ],
  },
  {
    title: "Data retention",
    content: [
      "Receipt and conversation data is retained as long as your account is active. You can request deletion of your account and all associated data at any time.",
      "Deleted data is removed from our active systems within 30 days. Backup copies may be retained for up to 90 days for disaster recovery purposes.",
    ],
  },
  {
    title: "Security",
    content: [
      "All data is encrypted in transit using TLS 1.3 and at rest using AES-256. We use SOC 2 Type II compliant infrastructure providers.",
      "Client sign-off codes are single-use and time-limited. Receipt data is never exposed to unauthorized parties.",
    ],
  },
  {
    title: "Your rights",
    content: [
      "You have the right to access, correct, or delete your personal data. You can export your receipt data at any time from your dashboard.",
      "To exercise your rights, contact us at support@mintagree.com. We will respond within 30 days.",
    ],
  },
  {
    title: "Cookies",
    content: [
      "We use essential cookies to maintain your session and keep you signed in. We do not use tracking cookies or third-party analytics cookies.",
    ],
  },
  {
    title: "Changes to this policy",
    content: [
      "We may update this privacy policy from time to time. We will notify you of significant changes via email or a notice on the platform.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <FloatingOrbs />
      <CanvasBackground />
      <div className="relative z-10">
        <Nav />

        <section className="max-w-3xl mx-auto px-6 pt-28 pb-16 md:pt-36 md:pb-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-mint/20 bg-mint/5 px-3 py-1 text-xs text-mint mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
            Legal
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Privacy{" "}
            <span className="text-mint">Policy</span>
          </h1>

          <p className="text-zinc-400 mb-12">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <div className="space-y-12">
            {sections.map((section) => (
              <div key={section.title} className="border-t border-zinc-800 pt-8">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {section.title}
                </h2>
                <div className="space-y-3">
                  {section.content.map((p, i) => (
                    <p key={i} className="text-zinc-400 leading-relaxed">{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-xl border border-zinc-800 bg-surface p-6">
            <h3 className="font-semibold text-white mb-2">Contact us</h3>
            <p className="text-zinc-400 text-sm">
              For privacy questions or data requests, email{" "}
              <a
                href="mailto:support@mintagree.com"
                className="text-mint hover:underline"
              >
                support@mintagree.com
              </a>
              . We respond within 30 days.
            </p>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}

export const metadata = {
  title: "Privacy Policy — MintAgree",
  description:
    "How MintAgree collects, uses, and protects your data. We never sell your information.",
};
