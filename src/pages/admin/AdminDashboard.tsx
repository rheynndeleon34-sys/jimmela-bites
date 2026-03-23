import { Package, ShoppingCart, Truck, TrendingUp } from "lucide-react";

const stats = [
  { label: "Total Orders", value: "1,247", icon: ShoppingCart, change: "+12.3%", color: "bg-primary/10 text-primary" },
  { label: "In Stock", value: "8,432", icon: Package, change: "+3.1%", color: "bg-emerald-50 text-emerald-600" },
  { label: "Deliveries Today", value: "38", icon: Truck, change: "+5.7%", color: "bg-blue-50 text-blue-600" },
  { label: "Revenue (Month)", value: "₱284,500", icon: TrendingUp, change: "+8.9%", color: "bg-amber-50 text-amber-600" },
];

const recentOrders = [
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

const AdminDashboard = () => (
  <div className="space-y-6">
    {/* Stats */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-card rounded-xl p-5 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-emerald-600">{s.change}</span>
          </div>
          <p className="text-2xl font-bold text-foreground font-display tabular-nums">{s.value}</p>
          <p className="text-muted-foreground text-xs mt-1">{s.label}</p>
        </div>
      ))}
    </div>

    {/* Recent Orders */}
    <div className="bg-card rounded-xl border border-border shadow-sm">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="font-display text-base font-bold text-foreground">Recent Orders</h3>
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
            {recentOrders.map((o) => (
              <tr key={o.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <td className="px-5 py-3.5 font-medium text-foreground">{o.id}</td>
                <td className="px-5 py-3.5 text-foreground">{o.customer}</td>
                <td className="px-5 py-3.5 text-muted-foreground hidden md:table-cell max-w-[200px] truncate">{o.items}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[o.status]}`}>
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

export default AdminDashboard;
