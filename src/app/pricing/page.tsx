import Nav from "@/components/nav";
import Footer from "@/components/footer";
import PricingSection from "@/components/pricing-section";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Nav />
      <div className="pt-20">
        <PricingSection />
      </div>
      <Footer />
    </main>
  );
}
