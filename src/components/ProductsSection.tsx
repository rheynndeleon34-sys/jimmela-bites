import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ArrowRight } from "lucide-react";
import siomaiPork from "@/assets/siomai-pork.jpg";
import siomaiBeef from "@/assets/siomai-beef.jpg";
import siomaiJapanese from "@/assets/siomai-japanese.jpg";
import siomaiSharksfin from "@/assets/siomai-sharksfin.jpg";
import longganisaOriginal from "@/assets/longganisa-original.jpg";
import longganisaGarlic from "@/assets/longganisa-garlic.jpg";

const products = [
  { name: "Pork Siomai", category: "Siomai", image: siomaiPork, desc: "Classic savory pork filling wrapped in delicate wonton skin.", tag: "Bestseller" },
  { name: "Beef Siomai", category: "Siomai", image: siomaiBeef, desc: "Premium beef blend with aromatic spices for a richer taste.", tag: null },
  { name: "Japanese Siomai", category: "Siomai", image: siomaiJapanese, desc: "Japanese-inspired flavors with a smooth, silky texture.", tag: "Popular" },
  { name: "Shark's Fin Siomai", category: "Siomai", image: siomaiSharksfin, desc: "Delicate and flavorful, a timeless dim sum favorite.", tag: null },
  { name: "Longganisa Original", category: "Longganisa", image: longganisaOriginal, desc: "Authentic Calumpit-style sweet & garlicky longganisa.", tag: "Classic" },
  { name: "Longganisa Garlic", category: "Longganisa", image: longganisaGarlic, desc: "Extra garlic punch for those who love bold flavors.", tag: null },
];

const categories = ["All", "Siomai", "Longganisa"];

const ProductCard = ({ product, index }: { product: typeof products[0]; index: number }) => {
  const ref = useScrollReveal();

  return (
    <div
      ref={ref}
      className="opacity-0 group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-border hover:border-primary/20 hover:-translate-y-1">
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
            >
              Order Now <ArrowRight className="w-3 h-3" />
            </a>
          </div>
          {/* Category badge */}
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-card/90 backdrop-blur-sm text-foreground text-xs font-semibold shadow-sm">
            {product.category}
          </span>
          {/* Tag badge */}
          {product.tag && (
            <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-sm">
              {product.tag}
            </span>
          )}
        </div>
        <div className="p-5">
          <h3 className="font-display text-lg font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors duration-200">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{product.desc}</p>
        </div>
      </div>
    </div>
  );
};

const ProductsSection = () => {
  const headerRef = useScrollReveal();
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All" ? products : products.filter((p) => p.category === activeFilter);

  return (
    <section id="products" className="py-24 lg:py-32 bg-jimmela-cream">
      <div className="container mx-auto section-padding">
        <div ref={headerRef} className="text-center max-w-xl mx-auto mb-12 opacity-0">
          <span className="text-primary text-sm font-semibold tracking-wide uppercase">Our Products</span>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mt-3 mb-4">
            Frozen Favorites, Fresh Taste
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Every piece is crafted with quality ingredients — ready to cook, easy to love.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeFilter === cat
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "bg-card text-muted-foreground hover:text-foreground border border-border hover:border-primary/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filtered.map((p, i) => (
            <ProductCard key={p.name} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
