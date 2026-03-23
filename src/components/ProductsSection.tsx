import { useScrollReveal } from "@/hooks/useScrollReveal";
import siomaiPork from "@/assets/siomai-pork.jpg";
import siomaiBeef from "@/assets/siomai-beef.jpg";
import siomaiJapanese from "@/assets/siomai-japanese.jpg";
import siomaiSharksfin from "@/assets/siomai-sharksfin.jpg";
import longganisaOriginal from "@/assets/longganisa-original.jpg";
import longganisaGarlic from "@/assets/longganisa-garlic.jpg";

const products = [
  { name: "Pork Siomai", category: "Siomai", image: siomaiPork, desc: "Classic savory pork filling wrapped in delicate wonton skin." },
  { name: "Beef Siomai", category: "Siomai", image: siomaiBeef, desc: "Premium beef blend with aromatic spices for a richer taste." },
  { name: "Japanese Siomai", category: "Siomai", image: siomaiJapanese, desc: "Japanese-inspired flavors with a smooth, silky texture." },
  { name: "Shark's Fin Siomai", category: "Siomai", image: siomaiSharksfin, desc: "Delicate and flavorful, a timeless dim sum favorite." },
  { name: "Longganisang Calumpit Original", category: "Longganisa", image: longganisaOriginal, desc: "Authentic Calumpit-style sweet & garlicky longganisa." },
  { name: "Longganisang Calumpit Garlic", category: "Longganisa", image: longganisaGarlic, desc: "Extra garlic punch for those who love bold flavors." },
];

const ProductCard = ({ product, index }: { product: typeof products[0]; index: number }) => {
  const ref = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`opacity-0 group`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
        <div className="relative overflow-hidden aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
            {product.category}
          </span>
        </div>
        <div className="p-5">
          <h3 className="font-display text-lg font-bold text-foreground mb-1.5">{product.name}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{product.desc}</p>
        </div>
      </div>
    </div>
  );
};

const ProductsSection = () => {
  const headerRef = useScrollReveal();

  return (
    <section id="products" className="py-24 lg:py-32 bg-jimmela-cream">
      <div className="container mx-auto section-padding">
        <div ref={headerRef} className="text-center max-w-xl mx-auto mb-16 opacity-0">
          <span className="text-primary text-sm font-semibold tracking-wide uppercase">Our Products</span>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mt-3 mb-4">
            Frozen Favorites, Fresh Taste
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Every piece is crafted with quality ingredients — ready to cook, easy to love.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {products.map((p, i) => (
            <ProductCard key={p.name} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
