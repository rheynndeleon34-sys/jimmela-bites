import { Package, ShoppingCart, Truck, TrendingUp, Loader2, ArrowUpRight, ArrowDownRight, Eye, Edit2, Trash2 } from "lucide-react";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { LowStockAlerts } from "@/components/admin/LowStockAlerts";
import { orderBy, limit } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useMemo } from "react";
import { startOfMonth, subMonths, format, isToday, parseISO } from "date-fns";

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
}

interface StockItem {
  id: string;
  product: string;
  stock: number;
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
};

const AdminDashboard = () => {
  const { data: allOrders } = useFirestoreCollection<Order>("orders", [], []);
  const { data: orders, loading: ordersLoading } = useFirestoreCollection<Order>("orders", [orderBy("date", "desc"), limit(5)], []);
  const { data: stockItems } = useFirestoreCollection<StockItem>("stock", [], []);
  const { data: deliveries } = useFirestoreCollection<Delivery>("deliveries", [], []);
  const { toast } = useToast();

  const computedStats = useMemo(() => {
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));

    // Total Orders
    const totalOrders = allOrders.length;

    // In Stock — sum of all stock quantities
    const inStock = stockItems.reduce((sum, item) => sum + (item.stock || 0), 0);

    // Deliveries Today
    const deliveriesToday = deliveries.filter((d) => {
      try {
        return isToday(parseISO(d.date));
      } catch {
        return false;
      }
    }).length;

    // Revenue this month
    const thisMonthOrders = allOrders.filter((o) => {
      try {
        const d = parseISO(o.date);
        return d >= thisMonthStart;
      } catch {
        return false;
      }
    });
    const revenueMonth = thisMonthOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    // Revenue last month for comparison
    const lastMonthOrders = allOrders.filter((o) => {
      try {
        const d = parseISO(o.date);
        return d >= lastMonthStart && d < thisMonthStart;
      } catch {
        return false;
      }
    });
    const revenueLast = lastMonthOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    // Percentage changes
    const calcChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? "+100%" : "0%";
      const pct = ((current - previous) / previous) * 100;
      return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
    };

    const orderChange = calcChange(thisMonthOrders.length, lastMonthOrders.length);
    const revenueChange = calcChange(revenueMonth, revenueLast);

    return { totalOrders, inStock, deliveriesToday, revenueMonth, orderChange, revenueChange };
  }, [allOrders, stockItems, deliveries]);

  const stats = [
    {
      label: "Total Orders",
      value: computedStats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      change: computedStats.orderChange,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      textColor: "text-blue-700",
    },
    {
      label: "In Stock",
      value: computedStats.inStock.toLocaleString(),
      icon: Package,
      change: "—",
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100",
      textColor: "text-emerald-700",
    },
    {
      label: "Deliveries Today",
      value: String(computedStats.deliveriesToday),
      icon: Truck,
      change: "—",
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
      textColor: "text-purple-700",
    },
    {
      label: "Revenue (Month)",
      value: `₱${computedStats.revenueMonth.toLocaleString()}`,
      icon: TrendingUp,
      change: computedStats.revenueChange,
      gradient: "from-amber-500 to-amber-600",
      bgGradient: "from-amber-50 to-amber-100",
      textColor: "text-amber-700",
    },
  ];

  const isPositiveChange = (change: string) => change.startsWith("+");

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back!</h1>
            <p className="text-muted-foreground">Here's what's happening with your business today</p>
          </div>
          <div className="mt-4 md:mt-0 text-sm text-muted-foreground">
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
            className={`relative overflow-hidden rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-all duration-300 bg-card group`}
          >
            {/* Gradient Background Accent */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                {stat.change !== "—" ? (
                  <div
                    className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                      isPositiveChange(stat.change)
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {isPositiveChange(stat.change) ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {stat.change}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground px-2 py-1">Live</span>
                )}
              </div>

              <p className="text-3xl font-bold text-foreground font-display tabular-nums mb-1">
                {stat.value}
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

        {orders.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <ShoppingCart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left bg-muted/40">
                  <th className="px-6 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                    Items
                  </th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                    Date
                  </th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o, idx) => (
                  <tr
                    key={o.id}
                    className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <span className="font-semibold text-foreground">{o.id}</span>
                    </td>
                    <td className="px-6 py-4 text-foreground font-medium">{o.customer}</td>
                    <td className="px-6 py-4 text-muted-foreground hidden md:table-cell max-w-[250px]">
                      <span className="truncate block text-xs">
                        {o.items.map((item) => item.productName).join(", ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-foreground">
                        ₱{o.total.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                          statusStyles[o.status] || "bg-muted text-muted-foreground"
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full mr-2 bg-current opacity-60"></span>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground hidden sm:table-cell text-xs">
                      {o.date}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-amber-100 hover:text-amber-600"
                          title="Edit order"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                          title="Delete order"
                          onClick={() =>
                            toast({
                              title: "Delete Order",
                              description: `Are you sure you want to delete ${o.id}? This action cannot be undone.`,
                              variant: "destructive",
                            })
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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
