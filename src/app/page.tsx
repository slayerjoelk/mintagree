import Nav from "@/components/nav";
import Hero from "@/components/hero";
import CanvasBackground from "@/components/canvas-background";
import SocialProof from "@/components/social-proof";
import HowItWorks from "@/components/how-it-works";
import Features from "@/components/features";
import Solutions from "@/components/solutions";
import PricingSection from "@/components/pricing-section";
import FAQ from "@/components/faq";
import CTASection from "@/components/cta-section";
import Footer from "@/components/footer";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <CanvasBackground />
      <Nav />
      <Hero />
      <SocialProof />
      <HowItWorks />
      <Features />
      <Solutions />
      <PricingSection />
      <FAQ />
      <CTASection />
      <Footer />
    </main>
  );
}
