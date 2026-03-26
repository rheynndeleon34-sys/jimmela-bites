import { Package, ShoppingCart, Truck, TrendingUp, Loader2, ArrowUpRight, Eye, Edit2, Trash2 } from "lucide-react";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { LowStockAlerts } from "@/components/admin/LowStockAlerts";
import { orderBy, limit } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useMemo } from "react";
import { isToday, parseISO, isThisMonth } from "date-fns";

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer: string;
  items: OrderItem[];
  total: number;
  status: string;
  date: string;
  createdAt?: any;
}

interface StockItem {
  id: string;
  product: string;
  stock: number;
  unit: string;
  status: string;
}

interface Delivery {
  id: string;
  date: string;
  status: string;
}

const statusStyles: Record<string, string> = {
  Processing: "bg-amber-50 text-amber-700",
  Shipped: "bg-blue-50 text-blue-700",
  Delivered: "bg-emerald-50 text-emerald-700",
  Cancelled: "bg-red-50 text-red-700",
};

const AdminDashboard = () => {
  const { data: allOrders, loading: ordersLoading } = useFirestoreCollection<Order>("orders", []);
  const { data: stockItems, loading: stockLoading } = useFirestoreCollection<StockItem>("stock", []);
  const { data: deliveries, loading: deliveriesLoading } = useFirestoreCollection<Delivery>("deliveries", []);
  const { toast } = useToast();

  const recentOrders = useMemo(() => {
    return [...allOrders]
      .sort((a, b) => {
        // Sort by date descending
        const dateA = new Date(a.date || "").getTime() || 0;
        const dateB = new Date(b.date || "").getTime() || 0;
        return dateB - dateA;
      })
      .slice(0, 5);
  }, [allOrders]);

  const computedStats = useMemo(() => {
    const totalOrders = allOrders.length;

    const totalStock = stockItems.reduce((sum, item) => sum + (Number(item.stock) || 0), 0);

    const todayDeliveries = deliveries.filter((d) => {
      try {
        if (!d.date) return false;
        const deliveryDate = new Date(d.date);
        const today = new Date();
        return (
          deliveryDate.getFullYear() === today.getFullYear() &&
          deliveryDate.getMonth() === today.getMonth() &&
          deliveryDate.getDate() === today.getDate()
        );
      } catch {
        return false;
      }
    }).length;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthRevenue = allOrders.reduce((sum, order) => {
      try {
        const orderDate = new Date(order.date || "");
        if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
          return sum + (Number(order.total) || 0);
        }
      } catch {}
      return sum;
    }, 0);

    return {
      totalOrders,
      totalStock,
      todayDeliveries,
      monthRevenue,
    };
  }, [allOrders, stockItems, deliveries]);

  const anyLoading = ordersLoading || stockLoading || deliveriesLoading;

  const stats = [
    {
      label: "Total Orders",
      value: computedStats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
    },
    {
      label: "In Stock",
      value: computedStats.totalStock.toLocaleString(),
      icon: Package,
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100",
    },
    {
      label: "Deliveries Today",
      value: String(computedStats.todayDeliveries),
      icon: Truck,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
    },
    {
      label: "Revenue (Month)",
      value: `₱${computedStats.monthRevenue.toLocaleString()}`,
      icon: TrendingUp,
      gradient: "from-amber-500 to-amber-600",
      bgGradient: "from-amber-50 to-amber-100",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back!</h1>
            <p className="text-muted-foreground">Here's what's happening with your business today</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2 text-sm text-muted-foreground">
            {anyLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <LowStockAlerts />

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="relative overflow-hidden rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-all duration-300 bg-card group"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                  <ArrowUpRight className="w-3 h-3" />
                  Live
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground font-display tabular-nums mb-1">
                {anyLoading ? "..." : stat.value}
              </p>
              <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-gradient-to-r from-slate-50 to-transparent">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">Recent Orders</h3>
            <p className="text-sm text-muted-foreground mt-1">Last 5 orders from your store</p>
          </div>
          {ordersLoading && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
        </div>

        {!ordersLoading && recentOrders.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <ShoppingCart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left bg-muted/40">
                  <th className="px-6 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Items</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-foreground">{o.id}</span>
                    </td>
                    <td className="px-6 py-4 text-foreground font-medium">{o.customer || "—"}</td>
                    <td className="px-6 py-4 text-muted-foreground hidden md:table-cell max-w-[250px]">
                      <span className="truncate block text-xs">
                        {Array.isArray(o.items) ? o.items.map((item) => item.productName).join(", ") : "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-foreground">
                        ₱{(Number(o.total) || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                          statusStyles[o.status] || "bg-muted text-muted-foreground"
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full mr-2 bg-current opacity-60"></span>
                        {o.status || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground hidden sm:table-cell text-xs">
                      {o.date || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
