import { useScrollReveal } from "@/hooks/useScrollReveal";
import { CheckCircle2, ArrowRight } from "lucide-react";

const benefits = [
  "Low capital start-up with high profit margins",
  "Complete product training & operational support",
  "Exclusive territory protection for your area",
  "Proven business model with established demand",
  "Marketing materials & brand assets provided",
  "Continuous supply of premium frozen products",
];

const steps = [
  { step: "01", title: "Inquire", desc: "Reach out to us via contact form or phone" },
  { step: "02", title: "Choose Package", desc: "Select the franchise tier that fits you" },
  { step: "03", title: "Setup & Train", desc: "We help you set up and train your team" },
  { step: "04", title: "Start Earning", desc: "Begin serving customers and growing" },
];

const FranchiseSection = () => {
  const headerRef = useScrollReveal();
  const cardRef = useScrollReveal();
  const stepsRef = useScrollReveal();

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
            <ul className="space-y-3">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 group">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-foreground text-sm">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div ref={cardRef} className="opacity-0">
            <div className="bg-primary rounded-3xl p-8 lg:p-10 text-primary-foreground shadow-2xl shadow-primary/20 relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary-foreground/5 rounded-full" />
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-primary-foreground/5 rounded-full" />

              <h3 className="font-display text-2xl font-bold mb-3 relative">Franchise Packages</h3>
              <p className="text-primary-foreground/70 text-sm mb-8 relative">Choose the package that fits your goals.</p>

              <div className="space-y-4 relative">
                {[
                  { name: "Starter Cart", price: "₱15,000", desc: "Cart setup + initial stock of 200 packs", popular: false },
                  { name: "Business Kiosk", price: "₱35,000", desc: "Full kiosk setup + 500 packs + signage", popular: true },
                  { name: "Premium Outlet", price: "₱75,000", desc: "Complete outlet package + exclusive territory", popular: false },
                ].map((pkg) => (
                  <div
                    key={pkg.name}
                    className={`rounded-2xl p-5 border transition-all duration-200 hover:scale-[1.02] ${
                      pkg.popular
                        ? "bg-primary-foreground/20 border-primary-foreground/30"
                        : "bg-primary-foreground/10 border-primary-foreground/15"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{pkg.name}</span>
                        {pkg.popular && (
                          <span className="text-[10px] font-bold uppercase bg-primary-foreground/20 px-2 py-0.5 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <span className="font-display text-xl font-bold">{pkg.price}</span>
                    </div>
                    <p className="text-primary-foreground/60 text-sm">{pkg.desc}</p>
                  </div>
                ))}
              </div>

              <a
                href="#contact"
                className="mt-8 flex items-center justify-center gap-2 py-4 rounded-2xl bg-card text-primary font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 relative"
              >
                Inquire Now <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* How it works steps */}
        <div ref={stepsRef} className="opacity-0 mt-20">
          <h3 className="font-display text-2xl font-bold text-foreground text-center mb-10">How It Works</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.step} className="text-center group">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary font-display text-xl font-bold mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  {s.step}
                </div>
                <h4 className="font-display text-lg font-bold text-foreground mb-1">{s.title}</h4>
                <p className="text-muted-foreground text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FranchiseSection;
