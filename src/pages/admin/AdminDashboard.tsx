import { Package, ShoppingCart, Truck, TrendingUp, Loader2, ArrowUpRight, ArrowDownRight, Eye, Edit2, Trash2 } from "lucide-react";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { LowStockAlerts } from "@/components/admin/LowStockAlerts";
import { orderBy, limit } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface OrderItem {
  productId?: string;
  productName?: string;
  quantity?: number;
  price?: number;
}

interface Order {
  id: string;
  customer?: string;
  items?: OrderItem[];
  total?: number;
  status?: string;
  date?: string;
}

interface StatsDoc {
  id: string;
  totalOrders?: number;
  inStock?: number;
  deliveriesToday?: number;
  revenueMonth?: string;
  orderChange?: string;
  stockChange?: string;
  deliveryChange?: string;
  revenueChange?: string;
}

// Fallback data with safe defaults
const fallbackStats: StatsDoc[] = [
  {
    id: "summary",
    totalOrders: 1247,
    inStock: 8432,
    deliveriesToday: 38,
    revenueMonth: "₱284,500",
    orderChange: "+12.3%",
    stockChange: "+3.1%",
    deliveryChange: "+5.7%",
    revenueChange: "+8.9%",
  },
];

const fallbackOrders: Order[] = [
  { id: "ORD-2847", customer: "Maria Santos", items: [{productName: "Pork Siomai"}], total: 4000, status: "Processing", date: "Mar 23, 2026" },
  { id: "ORD-2846", customer: "Aling Nena's Carinderia", items: [{productName: "Longganisa Original"}], total: 8500, status: "Shipped", date: "Mar 23, 2026" },
  { id: "ORD-2845", customer: "JP Food Cart", items: [{productName: "Japanese Siomai"}], total: 6800, status: "Delivered", date: "Mar 22, 2026" },
];

const statusStyles: Record<string, string> = {
  Processing: "bg-amber-50 text-amber-700",
  Shipped: "bg-blue-50 text-blue-700",
  Delivered: "bg-emerald-50 text-emerald-700",
};

const AdminDashboard = () => {
  const { toast } = useToast();
  
  // Use fallback data immediately to ensure dashboard loads
  const { data: statsData, loading: statsLoading } = useFirestoreCollection<StatsDoc>("dashboard_stats", [], fallbackStats);
  const { data: ordersData, loading: ordersLoading } = useFirestoreCollection<Order>("orders", [orderBy("date", "desc"), limit(5)], fallbackOrders);
  
  // Safely get the first stats document with fallback
  const s = (statsData && statsData[0]) || fallbackStats[0];
  
  // Safe stats with default values for missing fields
  const stats = [
    {
      label: "Total Orders",
      value: s.totalOrders?.toLocaleString() || "0",
      icon: ShoppingCart,
      change: s.orderChange || "0%",
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
    },
    {
      label: "In Stock", 
      value: s.inStock?.toLocaleString() || "0",
      icon: Package,
      change: s.stockChange || "0%",
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100",
    },
    {
      label: "Deliveries Today",
      value: String(s.deliveriesToday || 0),
      icon: Truck,
      change: s.deliveryChange || "0%",
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
    },
    {
      label: "Revenue (Month)",
      value: s.revenueMonth || "₱0",
      icon: TrendingUp,
      change: s.revenueChange || "0%",
      gradient: "from-amber-500 to-amber-600",
      bgGradient: "from-amber-50 to-amber-100",
    },
  ];

  const isPositiveChange = (change: string) => change?.startsWith("+") || false;
  
  // Safe orders array
  const safeOrders = Array.isArray(ordersData) && ordersData.length > 0 ? ordersData : fallbackOrders;

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
            className="relative overflow-hidden rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-all duration-300 bg-card group"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
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
                <th className="px-6 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
               </tr>
            </thead>
            <tbody>
              {safeOrders.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <span className="font-semibold text-foreground">{o.id}</span>
                  </td>
                  <td className="px-6 py-4 text-foreground font-medium">
                    {o.customer || "Unknown Customer"}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground hidden md:table-cell max-w-[250px]">
                    <span className="truncate block text-xs">
                      {o.items && Array.isArray(o.items) && o.items.length > 0
                        ? o.items.map((item) => item.productName || "Unknown Product").join(", ")
                        : "No items"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-foreground">
                      ₱{o.total?.toLocaleString() || "0"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                        statusStyles[o.status || ""] || "bg-muted text-muted-foreground"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full mr-2 bg-current opacity-60"></span>
                      {o.status || "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground hidden sm:table-cell text-xs">
                    {o.date || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600" title="View details">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-amber-100 hover:text-amber-600" title="Edit order">
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
      </div>
    </div>
  );
};

export default AdminDashboard;