import Nav from "@/components/nav";
import Footer from "@/components/footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <Nav />
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
          About{" "}<span className="text-mint">MintAgree</span>
        </h1>
        <p className="text-zinc-400 text-lg mb-6">
          MintAgree turns verbal agreements into signed receipts. Built for professionals
          who close deals on calls and need client acknowledgment without contracts.
        </p>
        <p className="text-zinc-400 mb-4">
          Founded in 2025, MintAgree was built after watching too many projects derail
          because scope was discussed verbally but never confirmed in writing.
        </p>
        <p className="text-zinc-400 mb-4">
          We believe agreements should be frictionless. No PDFs. No DocuSign. No back-and-forth.
          Just a clear conversation receipt with a one-time code for sign-off.
        </p>
        <div className="mt-10 border-t border-zinc-800 pt-6">
          <h2 className="text-xl font-semibold mb-3">Our mission</h2>
          <p className="text-zinc-400">
            Eliminate scope creep by making it effortless to document and confirm
            every client conversation — by voice or WhatsApp.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
