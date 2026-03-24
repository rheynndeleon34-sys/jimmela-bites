import { useEffect, useState } from "react";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StockItem {
  id: string;
  product: string;
  sku: string;
  stock: number;
  unit: string;
  status: string;
}

const LOW_STOCK_THRESHOLD = 100; // Alert when stock is below this

export const LowStockAlerts = () => {
  const { data: stockItems } = useFirestoreCollection<StockItem>("stock", []);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [lowStockItems, setLowStockItems] = useState<StockItem[]>([]);

  useEffect(() => {
    const low = stockItems.filter(
      (item) => item.stock < LOW_STOCK_THRESHOLD && !dismissedAlerts.has(item.id)
    );
    setLowStockItems(low);
  }, [stockItems, dismissedAlerts]);

  const handleDismiss = (id: string) => {
    setDismissedAlerts((prev) => new Set(prev).add(id));
  };

  if (lowStockItems.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 mb-6">
      {lowStockItems.map((item) => (
        <div
          key={item.id}
          className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start justify-between"
        >
          <div className="flex gap-3 flex-1">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900">{item.product}</p>
              <p className="text-sm text-amber-800">
                Only {item.stock} {item.unit} remaining (below {LOW_STOCK_THRESHOLD} threshold)
              </p>
              <p className="text-xs text-amber-700 mt-1">SKU: {item.sku}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDismiss(item.id)}
            className="text-amber-600 hover:bg-amber-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};
