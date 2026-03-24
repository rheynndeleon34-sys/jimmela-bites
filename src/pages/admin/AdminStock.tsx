import { Loader2 } from "lucide-react";
import { useFirestoreCollection } from "@/hooks/useFirestore";

interface StockItem {
  id: string;
  product: string;
  sku: string;
  stock: number;
  unit: string;
  status: string;
}

const fallbackStock: StockItem[] = [
  { id: "1", product: "Pork Siomai", sku: "SIO-PRK", stock: 2400, unit: "packs", status: "In Stock" },
  { id: "2", product: "Beef Siomai", sku: "SIO-BEF", stock: 1850, unit: "packs", status: "In Stock" },
  { id: "3", product: "Japanese Siomai", sku: "SIO-JPN", stock: 320, unit: "packs", status: "Low Stock" },
  { id: "4", product: "Shark's Fin Siomai", sku: "SIO-SHK", stock: 980, unit: "packs", status: "In Stock" },
  { id: "5", product: "Longganisa Original", sku: "LNG-ORI", stock: 1600, unit: "packs", status: "In Stock" },
  { id: "6", product: "Longganisa Garlic", sku: "LNG-GRL", stock: 85, unit: "packs", status: "Low Stock" },
];

const statusStyles: Record<string, string> = {
  "In Stock": "bg-emerald-50 text-emerald-700",
  "Low Stock": "bg-amber-50 text-amber-700",
  "Out of Stock": "bg-red-50 text-red-700",
};

const AdminStock = () => {
  const { data: stockItems, loading } = useFirestoreCollection<StockItem>("stock", [], fallbackStock);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="font-display text-xl font-bold text-foreground">Stock Management</h3>
          {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
        </div>
        <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow-sm hover:shadow-md active:scale-[0.97] transition-all">
          + Add Stock
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Product</th>
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">SKU</th>
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Quantity</th>
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody>
            {stockItems.map((s) => (
              <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <td className="px-5 py-3.5 font-medium text-foreground">{s.product}</td>
                <td className="px-5 py-3.5 text-muted-foreground font-mono text-xs hidden sm:table-cell">{s.sku}</td>
                <td className="px-5 py-3.5 text-foreground tabular-nums">{s.stock.toLocaleString()} {s.unit}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[s.status] || "bg-muted text-muted-foreground"}`}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminStock;
