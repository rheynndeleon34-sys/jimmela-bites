import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FranchiseSection from "@/components/FranchiseSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <ProductsSection />
    <TestimonialsSection />
    <FranchiseSection />
    <AboutSection />
    <ContactSection />
    <Footer />
  </div>
);

export default Index;
