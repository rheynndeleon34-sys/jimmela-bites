const orders = [
  { id: "ORD-2847", customer: "Maria Santos", items: "Pork Siomai x50, Beef Siomai x30", total: "₱4,200", status: "Processing", date: "Mar 23, 2026" },
  { id: "ORD-2846", customer: "Aling Nena's Carinderia", items: "Longganisa Original x100", total: "₱8,500", status: "Shipped", date: "Mar 23, 2026" },
  { id: "ORD-2845", customer: "JP Food Cart", items: "Japanese Siomai x80, Shark's Fin x40", total: "₱6,800", status: "Delivered", date: "Mar 22, 2026" },
  { id: "ORD-2844", customer: "Kusina ni Carlo", items: "Pork Siomai x200", total: "₱9,200", status: "Processing", date: "Mar 22, 2026" },
  { id: "ORD-2843", customer: "Mang Ben's Ihawan", items: "Longganisa Garlic x150", total: "₱12,750", status: "Delivered", date: "Mar 21, 2026" },
  { id: "ORD-2842", customer: "Tindahan ni Lola", items: "Beef Siomai x60", total: "₱3,600", status: "Cancelled", date: "Mar 21, 2026" },
];

const statusStyles: Record<string, string> = {
  Processing: "bg-amber-50 text-amber-700",
  Shipped: "bg-blue-50 text-blue-700",
  Delivered: "bg-emerald-50 text-emerald-700",
  Cancelled: "bg-red-50 text-red-700",
};

const AdminOrders = () => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h3 className="font-display text-xl font-bold text-foreground">Orders</h3>
      <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow-sm hover:shadow-md active:scale-[0.97] transition-all">
        + New Order
      </button>
    </div>

    <div className="bg-card rounded-xl border border-border shadow-sm overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Order ID</th>
            <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Customer</th>
            <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Items</th>
            <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total</th>
            <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
            <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer">
              <td className="px-5 py-3.5 font-medium text-foreground">{o.id}</td>
              <td className="px-5 py-3.5 text-foreground">{o.customer}</td>
              <td className="px-5 py-3.5 text-muted-foreground hidden lg:table-cell max-w-[220px] truncate">{o.items}</td>
              <td className="px-5 py-3.5 font-semibold text-foreground tabular-nums">{o.total}</td>
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
);

export default AdminOrders;
