import logo from "@/assets/jimmela_logo.jpg";
import { ArrowUp } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground text-card relative">
    {/* Back to top */}
    <div className="absolute -top-5 left-1/2 -translate-x-1/2">
      <a
        href="#home"
        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:-translate-y-1 transition-transform duration-200"
      >
        <ArrowUp className="w-4 h-4" />
      </a>
    </div>

    <div className="container mx-auto section-padding pt-16 pb-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            <img src={logo} alt="Jimmela" className="h-10 w-10 rounded-full object-cover ring-2 ring-card/20" />
            <span className="font-display text-lg font-bold">Jimmela Food</span>
          </div>
          <p className="text-card/50 text-sm leading-relaxed max-w-xs">
            Premium frozen food products for businesses and food entrepreneurs across the Philippines.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-4 text-card/80">Quick Links</h4>
          <ul className="space-y-2.5">
            {["Home", "Products", "Franchise", "About", "Contact"].map((l) => (
              <li key={l}>
                <a
                  href={`#${l.toLowerCase()}`}
                  className="text-card/50 text-sm hover:text-primary transition-colors duration-200"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-4 text-card/80">Products</h4>
          <ul className="space-y-2.5">
            {["Pork Siomai", "Beef Siomai", "Japanese Siomai", "Shark's Fin Siomai", "Longganisa Original", "Longganisa Garlic"].map((p) => (
              <li key={p}>
                <span className="text-card/50 text-sm">{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-4 text-card/80">Contact</h4>
          <ul className="space-y-2.5 text-card/50 text-sm">
            <li>+63 917 123 4567</li>
            <li>orders@jimmelafood.ph</li>
            <li>Calumpit, Bulacan</li>
            <li>Mon–Sat, 8AM – 5PM</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-card/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-card/30 text-xs">
          © {new Date().getFullYear()} Jimmela Food Products. All rights reserved.
        </p>
        <p className="text-card/20 text-xs">
          Calumpit, Bulacan, Philippines
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
