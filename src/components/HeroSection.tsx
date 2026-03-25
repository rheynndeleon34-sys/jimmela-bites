import { useEffect, useRef, useState } from "react";
import heroImg from "@/assets/hero-food.jpg";
import { ChefHat, Users, Star, Truck } from "lucide-react";

const stats = [
  { icon: ChefHat, value: "6+", label: "Premium Products" },
  { icon: Users, value: "500+", label: "Happy Partners" },
  { icon: Star, value: "10+", label: "Years of Quality" },
  { icon: Truck, value: "1K+", label: "Monthly Deliveries" },
];

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          el.classList.add("scroll-reveal");
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-foreground">
      {/* Background image with parallax-like overlay */}
      <div className="absolute inset-0">
        <img src={heroImg} alt="" className="w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-primary/5 rounded-full blur-2xl" />

      <div ref={ref} className="relative container mx-auto section-padding py-32 lg:py-40 opacity-0">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary-foreground text-xs font-semibold tracking-wide uppercase mb-8 border border-primary/30 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Premium Frozen Foods
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-extrabold text-card leading-[1.02] tracking-tight mb-6">
            Taste the
            <br />
            Quality of{" "}
            <span className="text-primary relative">
              Jimmela
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 8 C50 2, 150 2, 198 8" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
              </svg>
            </span>
          </h1>
          <p className="text-card/70 text-lg lg:text-xl max-w-lg leading-relaxed mb-10">
            From our kitchen to your table — premium siomai, longganisa, and more frozen delights delivered fresh to your business.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#products"
              className="inline-flex items-center px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-sm"
            >
              Explore Products
            </a>
            <a
              href="#franchise"
              className="inline-flex items-center px-8 py-4 rounded-full bg-card/10 text-card font-semibold border border-card/20 hover:bg-card/20 active:scale-[0.97] transition-all duration-200 backdrop-blur-sm text-sm"
            >
              Franchise With Us
            </a>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-card/10 backdrop-blur-md border-t border-card/10">
        <div className="container mx-auto section-padding">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-5 lg:py-6">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex items-center gap-3 ${
                  visible ? "animate-fade-in" : "opacity-0"
                }`}
                style={{ animationDelay: `${400 + i * 150}ms`, animationFillMode: "both" }}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-card text-lg font-bold font-display leading-none">{stat.value}</p>
                  <p className="text-card/50 text-xs mt-0.5">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
