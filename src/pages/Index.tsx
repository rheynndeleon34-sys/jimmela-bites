import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import FranchiseSection from "@/components/FranchiseSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <ProductsSection />
    <FranchiseSection />
    <AboutSection />
    <ContactSection />
    <Footer />
  </div>
);

export default Index;
