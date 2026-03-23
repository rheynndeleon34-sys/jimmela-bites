import logo from "@/assets/jimmela_logo.jpg";

const Footer = () => (
  <footer className="bg-foreground text-card py-12 lg:py-16">
    <div className="container mx-auto section-padding">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <img src={logo} alt="Jimmela" className="h-9 w-9 rounded-full object-cover" />
            <span className="font-display text-lg font-bold">Jimmela Food</span>
          </div>
          <p className="text-card/60 text-sm leading-relaxed max-w-xs">
            Premium frozen food products for businesses and food entrepreneurs across the Philippines.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-4">Quick Links</h4>
          <ul className="space-y-2.5">
            {["Products", "Franchise", "About", "Contact"].map((l) => (
              <li key={l}>
                <a href={`#${l.toLowerCase()}`} className="text-card/60 text-sm hover:text-card transition-colors">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-4">Products</h4>
          <ul className="space-y-2.5">
            {["Pork Siomai", "Beef Siomai", "Japanese Siomai", "Shark's Fin Siomai", "Longganisang Calumpit"].map((p) => (
              <li key={p}>
                <span className="text-card/60 text-sm">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-card/10 pt-6 text-center">
        <p className="text-card/40 text-xs">
          © {new Date().getFullYear()} Jimmela Food Products. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
