import Nav from "@/components/nav";
import Footer from "@/components/footer";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <Nav />
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">
          Privacy Policy
        </h1>

        <p className="text-zinc-400 mb-6">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">What we collect</h2>
          <p className="text-zinc-400 mb-3">
            We collect the minimum data required to run the service: your email address, conversation metadata, receipt data, and client contact details. We do not sell your data.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">How we use data</h2>
          <p className="text-zinc-400 mb-3">
            Your data is used solely to operate MintAgree: sending receipts, enabling client sign-off, and providing analytics. We never share data with third parties for advertising.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Data retention</h2>
          <p className="text-zinc-400 mb-3">
            Receipt and conversation data is retained as long as your account is active. You can request deletion of your account and all associated data at any time.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Contact</h2>
          <p className="text-zinc-400 mb-3">
            For privacy questions, contact{" "}
            <a href="mailto:support@mintagree.com" className="text-mint hover:underline">
              support@mintagree.com
            </a>.
          </p>
        </section>
      </div>
      <Footer />
    </main>
  );
}
