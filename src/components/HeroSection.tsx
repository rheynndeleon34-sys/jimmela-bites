import { useEffect, useRef } from "react";
import heroImg from "@/assets/hero-food.jpg";

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("scroll-reveal"); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center overflow-hidden bg-jimmela-warm">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img src={heroImg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/60" />
      </div>

      <div ref={ref} className="relative container mx-auto section-padding py-32 lg:py-40 opacity-0">
        <div className="max-w-2xl">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/90 text-primary-foreground text-xs font-semibold tracking-wide uppercase mb-6">
            Premium Frozen Foods
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-card leading-[1.05] tracking-tight mb-6">
            Taste the Quality of{" "}
            <span className="text-primary">Jimmela</span>
          </h1>
          <p className="text-card/80 text-lg lg:text-xl max-w-lg leading-relaxed mb-10">
            From our kitchen to your table — premium siomai, longganisa, and more frozen delights delivered fresh to your business.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#products"
              className="inline-flex items-center px-7 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 active:scale-[0.97] transition-all duration-200"
            >
              View Products
            </a>
            <a
              href="#franchise"
              className="inline-flex items-center px-7 py-3.5 rounded-lg bg-card/15 text-card font-semibold border border-card/30 hover:bg-card/25 active:scale-[0.97] transition-all duration-200 backdrop-blur-sm"
            >
              Franchise With Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
