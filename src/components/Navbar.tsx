import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/jimmela_logo.jpg";

const broken =

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Products", href: "#products" },
  { label: "Franchise", href: "#franchise" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-card/98 backdrop-blur-md shadow-lg shadow-foreground/5"
          : "bg-card/80 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto section-padding flex items-center justify-between h-16 lg:h-20">
        <a href="#home" className="flex items-center gap-2.5 group">
          <img
            src={logo}
            alt="Jimmela Food Products"
            className="h-10 w-10 lg:h-12 lg:w-12 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300"
          />
          <span className="font-display text-lg lg:text-xl font-bold text-foreground tracking-tight">
            Jimmela<span className="text-primary"> Food Products</span>
          </span>
        </a>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 rounded-lg hover:bg-primary/5"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="hidden md:inline-flex items-center px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
        >
          Order Now
        </a>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-foreground active:scale-95 transition-transform"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-card border-t border-border pb-4">
          <ul className="flex flex-col gap-1 section-padding pt-2">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-2.5 px-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="block text-center py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold"
              >
                Order Now
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
