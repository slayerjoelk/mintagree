import Link from "next/link";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import FloatingOrbs from "@/components/floating-orbs";
import CanvasBackground from "@/components/canvas-background";

const sections = [
  {
    title: "Acceptance of terms",
    content: [
      "By accessing or using MintAgree, you agree to be bound by these Terms of Service. If you do not agree, do not use the service.",
      "We may update these terms from time to time. Continued use after changes constitutes acceptance of the new terms.",
    ],
  },
  {
    title: "Service description",
    content: [
      "MintAgree provides conversation receipt and client sign-off software. You may create receipts, send them to clients, and collect OTP-based sign-off acknowledgments.",
      "The service is provided as-is. We do not guarantee that the service will be uninterrupted or error-free.",
    ],
  },
  {
    title: "User accounts",
    content: [
      "You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use.",
      "You must provide accurate and complete information when creating an account. You may not impersonate any person or entity.",
    ],
  },
  {
    title: "Acceptable use",
    content: [
      "You agree not to use MintAgree for any unlawful purpose or in any way that could damage, disable, or impair the service.",
      "You may not use the service to send spam, harass others, or distribute malicious content. We reserve the right to suspend accounts that violate this policy.",
    ],
  },
  {
    title: "Intellectual property",
    content: [
      "MintAgree and its original content, features, and functionality are owned by MintAgree and are protected by international copyright, trademark, and other intellectual property laws.",
      "You retain ownership of the content you create using MintAgree. By using the service, you grant us a limited license to host and transmit your content as necessary to operate the platform.",
    ],
  },
  {
    title: "Payment and billing",
    content: [
      "Paid plans are billed in advance on a monthly or annual basis. You may cancel at any time. Refunds are provided within 14 days of purchase if you are not satisfied.",
      "Prices are subject to change. We will notify you at least 30 days before any price change takes effect.",
    ],
  },
  {
    title: "Limitation of liability",
    content: [
      "MintAgree is not a substitute for legal advice or formal contracts. Receipts generated through the service represent acknowledgment of conversation terms, not legally binding contracts unless expressly agreed upon by both parties.",
      "To the maximum extent permitted by law, MintAgree shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the service.",
    ],
  },
  {
    title: "Termination",
    content: [
      "We may suspend or terminate your account at any time for violation of these terms. You may delete your account at any time from your account settings.",
      "Upon termination, your data will be retained for 30 days to allow for export, then permanently deleted.",
    ],
  },
  {
    title: "Governing law",
    content: [
      "These terms are governed by the laws of South Africa. Any disputes shall be resolved in the courts of South Africa.",
    ],
  },
];

export default function TermsPage() {
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
            Terms of{" "}
            <span className="text-mint">Service</span>
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
            <h3 className="font-semibold text-white mb-2">Questions?</h3>
            <p className="text-zinc-400 text-sm">
              Contact us at{" "}
              <a
                href="mailto:support@mintagree.com"
                className="text-mint hover:underline"
              >
                support@mintagree.com
              </a>
              . You can also review our{" "}
              <Link href="/privacy" className="text-mint hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}

export const metadata = {
  title: "Terms of Service — MintAgree",
  description:
    "The rules and guidelines for using MintAgree. Read our terms before using the service.",
};
