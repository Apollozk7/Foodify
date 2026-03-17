import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Gallery from "@/components/Gallery";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Gallery />
      <Pricing />
      <Footer />
    </main>
  );
}
