import { Package, ShoppingCart, Truck, TrendingUp, Loader2 } from "lucide-react";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { orderBy, limit } from "firebase/firestore";

interface Order {
  id: string;
  customer: string;
  items: string;
  total: string;
  status: string;
  date: string;
}

interface StatsDoc {
  id: string;
  totalOrders: number;
  inStock: number;
  deliveriesToday: number;
  revenueMonth: string;
  orderChange: string;
  stockChange: string;
  deliveryChange: string;
  revenueChange: string;
}

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
  { id: "ORD-2847", customer: "Maria Santos", items: "Pork Siomai x50, Beef Siomai x30", status: "Processing", date: "Mar 23, 2026" },
  { id: "ORD-2846", customer: "Aling Nena's Carinderia", items: "Longganisa Original x100", status: "Shipped", date: "Mar 23, 2026" },
  { id: "ORD-2845", customer: "JP Food Cart", items: "Japanese Siomai x80, Shark's Fin x40", status: "Delivered", date: "Mar 22, 2026" },
  { id: "ORD-2844", customer: "Kusina ni Carlo", items: "Pork Siomai x200", status: "Processing", date: "Mar 22, 2026" },
  { id: "ORD-2843", customer: "Mang Ben's Ihawan", items: "Longganisa Garlic x150", status: "Delivered", date: "Mar 21, 2026" },
];

const statusStyles: Record<string, string> = {
  Processing: "bg-amber-50 text-amber-700",
  Shipped: "bg-blue-50 text-blue-700",
  Delivered: "bg-emerald-50 text-emerald-700",
};

const AdminDashboard = () => {
  const { data: statsData, loading: statsLoading } = useFirestoreCollection<StatsDoc>("dashboard_stats", [], fallbackStats);
  const { data: orders, loading: ordersLoading } = useFirestoreCollection<Order>("orders", [orderBy("date", "desc"), limit(5)], fallbackOrders);

  const s = statsData[0] || fallbackStats[0];

  const stats = [
    { label: "Total Orders", value: s.totalOrders.toLocaleString(), icon: ShoppingCart, change: s.orderChange, color: "bg-primary/10 text-primary" },
    { label: "In Stock", value: s.inStock.toLocaleString(), icon: Package, change: s.stockChange, color: "bg-emerald-50 text-emerald-600" },
    { label: "Deliveries Today", value: String(s.deliveriesToday), icon: Truck, change: s.deliveryChange, color: "bg-blue-50 text-blue-600" },
    { label: "Revenue (Month)", value: s.revenueMonth, icon: TrendingUp, change: s.revenueChange, color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl p-5 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-emerald-600">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold text-foreground font-display tabular-nums">{stat.value}</p>
            <p className="text-muted-foreground text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-foreground">Recent Orders</h3>
          {ordersLoading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Order ID</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Customer</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Items</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-foreground">{o.id}</td>
                  <td className="px-5 py-3.5 text-foreground">{o.customer}</td>
                  <td className="px-5 py-3.5 text-muted-foreground hidden md:table-cell max-w-[200px] truncate">{o.items}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[o.status] || "bg-muted text-muted-foreground"}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground hidden sm:table-cell">{o.date}</td>
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
