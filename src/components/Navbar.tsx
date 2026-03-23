import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/jimmela_logo.jpg";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Products", href: "#products" },
  { label: "Franchise", href: "#franchise" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm shadow-[0_1px_3px_hsl(var(--border))]">
      <div className="container mx-auto section-padding flex items-center justify-between h-16 lg:h-20">
        <a href="#home" className="flex items-center gap-2.5">
          <img src={logo} alt="Jimmela Food Products" className="h-10 w-10 lg:h-12 lg:w-12 rounded-full object-cover" />
          <span className="font-display text-lg lg:text-xl font-bold text-foreground tracking-tight">
            Jimmela<span className="text-primary"> Food</span>
          </span>
        </a>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="hidden md:inline-flex items-center px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.97] transition-all duration-200"
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
      {open && (
        <div className="md:hidden bg-card border-t border-border pb-4">
          <ul className="flex flex-col gap-1 section-padding pt-2">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-2.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="block text-center py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold"
              >
                Order Now
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
