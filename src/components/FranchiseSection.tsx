import { useScrollReveal } from "@/hooks/useScrollReveal";
import { CheckCircle2 } from "lucide-react";

const benefits = [
  "Low capital start-up with high profit margins",
  "Complete product training & operational support",
  "Exclusive territory protection for your area",
  "Proven business model with established demand",
  "Marketing materials & brand assets provided",
  "Continuous supply of premium frozen products",
];

const FranchiseSection = () => {
  const headerRef = useScrollReveal();
  const cardRef = useScrollReveal();

  return (
    <section id="franchise" className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto section-padding">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div ref={headerRef} className="opacity-0">
            <span className="text-primary text-sm font-semibold tracking-wide uppercase">Franchise</span>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mt-3 mb-5">
              Be a Jimmela Partner
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-md">
              Join a growing network of food entrepreneurs. Our franchise model is designed for aspiring business owners who want a tested, profitable food venture with minimal risk.
            </p>
            <ul className="space-y-3.5">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-foreground text-sm">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div ref={cardRef} className="opacity-0">
            <div className="bg-primary rounded-2xl p-8 lg:p-10 text-primary-foreground shadow-xl shadow-primary/15">
              <h3 className="font-display text-2xl font-bold mb-3">Franchise Packages</h3>
              <p className="text-primary-foreground/80 text-sm mb-8">Choose the package that fits your goals.</p>

              <div className="space-y-4">
                {[
                  { name: "Starter Cart", price: "₱15,000", desc: "Cart setup + initial stock of 200 packs" },
                  { name: "Business Kiosk", price: "₱35,000", desc: "Full kiosk setup + 500 packs + signage" },
                  { name: "Premium Outlet", price: "₱75,000", desc: "Complete outlet package + exclusive territory" },
                ].map((pkg) => (
                  <div key={pkg.name} className="bg-primary-foreground/10 rounded-xl p-5 border border-primary-foreground/15">
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="font-semibold">{pkg.name}</span>
                      <span className="font-display text-xl font-bold">{pkg.price}</span>
                    </div>
                    <p className="text-primary-foreground/70 text-sm">{pkg.desc}</p>
                  </div>
                ))}
              </div>

              <a
                href="#contact"
                className="mt-8 block text-center py-3.5 rounded-lg bg-card text-primary font-semibold shadow-md hover:shadow-lg active:scale-[0.97] transition-all duration-200"
              >
                Inquire Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FranchiseSection;
