import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ShieldCheck, Truck, Heart, Award } from "lucide-react";

const values = [
  { icon: ShieldCheck, title: "Quality Assured", desc: "Every product meets strict food safety standards before reaching you." },
  { icon: Truck, title: "Reliable Delivery", desc: "Consistent supply chain so your business never runs out of stock." },
  { icon: Heart, title: "Made with Care", desc: "Recipes perfected over years, using locally sourced ingredients." },
  { icon: Award, title: "Trusted Brand", desc: "Serving 500+ partners across the Philippines with consistent excellence." },
];

const counters = [
  { value: "10+", label: "Years in Business" },
  { value: "500+", label: "Partner Stores" },
  { value: "6", label: "Product Lines" },
  { value: "50K+", label: "Packs Sold Monthly" },
];

const AboutSection = () => {
  const ref = useScrollReveal();

  return (
    <section id="about" className="py-24 lg:py-32 bg-jimmela-warm relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/3 rounded-full blur-3xl" />

      <div className="container mx-auto section-padding relative">
        <div ref={ref} className="max-w-3xl mx-auto text-center opacity-0">
          <span className="text-primary text-sm font-semibold tracking-wide uppercase">About Us</span>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mt-3 mb-5">
            The Jimmela Story
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Jimmela Food Products started with a simple mission: to bring delicious, affordable frozen food to small businesses and households across the Philippines. Based in Calumpit, Bulacan, we've grown from a family kitchen into a trusted food supplier — serving siomai carts, carinderias, and food stalls with products they can count on.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We believe great food shouldn't be complicated. That's why we handle the sourcing, preparation, and packaging — so our partners can focus on what they do best: serving their customers.
          </p>
        </div>

        {/* Counter strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16 mb-16">
          {counters.map((c, i) => {
            const CounterRef = () => {
              const r = useScrollReveal();
              return (
                <div
                  ref={r}
                  className="opacity-0 text-center bg-card rounded-2xl p-6 border border-border shadow-sm"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <p className="text-3xl lg:text-4xl font-display font-bold text-primary">{c.value}</p>
                  <p className="text-muted-foreground text-sm mt-1">{c.label}</p>
                </div>
              );
            };
            return <CounterRef key={c.label} />;
          })}
        </div>

        {/* Values */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => {
            const ValRef = () => {
              const r = useScrollReveal();
              return (
                <div
                  ref={r}
                  className="opacity-0 text-center p-6 lg:p-8 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 group"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <v.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">{v.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
                </div>
              );
            };
            return <ValRef key={v.title} />;
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
