import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Maria Santos",
    role: "Siomai Cart Owner, Manila",
    quote: "Jimmela's products are consistently delicious. My customers keep coming back! Best supplier I've ever had.",
    rating: 5,
  },
  {
    name: "Aling Nena",
    role: "Carinderia Owner, Bulacan",
    quote: "The longganisa is a hit every morning. Affordable, tasty, and always delivered on time. Highly recommended!",
    rating: 5,
  },
  {
    name: "Carlo Reyes",
    role: "Food Cart Franchise Partner",
    quote: "Starting my food cart with Jimmela was the best decision. Great support, great products, and great margins.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const headerRef = useScrollReveal();

  return (
    <section className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/3 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl translate-y-1/2" />

      <div className="container mx-auto section-padding relative">
        <div ref={headerRef} className="text-center max-w-xl mx-auto mb-16 opacity-0">
          <span className="text-primary text-sm font-semibold tracking-wide uppercase">Testimonials</span>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mt-3 mb-4">
            What Our Partners Say
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Real stories from real business owners who trust Jimmela.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, i) => {
            const CardRef = () => {
              const ref = useScrollReveal();
              return (
                <div
                  ref={ref}
                  className="opacity-0 bg-card rounded-2xl p-6 lg:p-8 border border-border shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 relative group"
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  <Quote className="w-10 h-10 text-primary/10 absolute top-6 right-6 group-hover:text-primary/20 transition-colors" />
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-foreground text-sm leading-relaxed mb-6 relative z-10">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-foreground text-sm font-semibold">{t.name}</p>
                      <p className="text-muted-foreground text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              );
            };
            return <CardRef key={t.name} />;
          })}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
