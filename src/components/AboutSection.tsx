import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ShieldCheck, Truck, Heart } from "lucide-react";

const values = [
  { icon: ShieldCheck, title: "Quality Assured", desc: "Every product meets strict food safety standards before reaching you." },
  { icon: Truck, title: "Reliable Delivery", desc: "Consistent supply chain so your business never runs out of stock." },
  { icon: Heart, title: "Made with Care", desc: "Recipes perfected over years, using locally sourced ingredients." },
];

const AboutSection = () => {
  const ref = useScrollReveal();

  return (
    <section id="about" className="py-24 lg:py-32 bg-jimmela-warm">
      <div className="container mx-auto section-padding">
        <div ref={ref} className="max-w-3xl mx-auto text-center opacity-0">
          <span className="text-primary text-sm font-semibold tracking-wide uppercase">About Us</span>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mt-3 mb-5">
            The Jimmela Story
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Jimmela Food Products started with a simple mission: to bring delicious, affordable frozen food to small businesses and households across the Philippines. Based in Calumpit, Bulacan, we've grown from a family kitchen into a trusted food supplier — serving siomai carts, carinderias, and food stalls with products they can count on.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We believe great food shouldn't be complicated. That's why we handle the sourcing, preparation, and packaging — so our partners can focus on what they do best: serving their customers.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mt-16">
          {values.map((v, i) => {
            const ValRef = () => {
              const r = useScrollReveal();
              return (
                <div ref={r} className="opacity-0 text-center p-6 lg:p-8" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-4">
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
