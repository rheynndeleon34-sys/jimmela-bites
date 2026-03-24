import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Truck,
  LogOut,
  Menu,
  X,
  Loader2,
} from "lucide-react";
import { auth } from "@/lib/firebase";
import logo from "@/assets/jimmela_logo.jpg";

const sidebarLinks = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/admin/dashboard" },
  { label: "Orders", icon: ShoppingCart, to: "/admin/orders" },
  { label: "Stock", icon: Package, to: "/admin/stock" },
  { label: "Delivery", icon: Truck, to: "/admin/delivery" },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/admin", { replace: true });
      }
      setChecking(false);
    });
    return unsub;
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/admin");
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 bg-card border-r border-border flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-border shrink-0">
          <img src={logo} alt="Jimmela" className="h-8 w-8 rounded-full object-cover" />
          <span className="font-display text-sm font-bold text-foreground tracking-tight">
            Jimmela <span className="text-primary">Admin</span>
          </span>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
            >
              <link.icon className="w-4.5 h-4.5" />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors duration-150"
          >
            <LogOut className="w-4.5 h-4.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-foreground/20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        <header className="h-16 bg-card border-b border-border flex items-center px-4 lg:px-6 gap-4 shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-foreground active:scale-95 transition-transform"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h2 className="font-display text-lg font-bold text-foreground">Admin Panel</h2>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
