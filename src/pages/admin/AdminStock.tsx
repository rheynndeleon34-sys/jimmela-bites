import { useState } from "react";
import { Loader2, Edit2, Trash2, Upload } from "lucide-react";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { StockModal } from "@/components/modals/StockModal";
import { DeleteConfirmDialog } from "@/components/modals/DeleteConfirmDialog";
import { BulkImportModal } from "@/components/modals/BulkImportModal";
import { Button } from "@/components/ui/button";

interface StockItem {
  id: string;
  product: string;
  sku: string;
  stock: number;
  unit: string;
  status: string;
  createdAt?: any;
  updatedAt?: any;
}

const fallbackStock: StockItem[] = [
  { id: "STO-0001", product: "Pork Siomai", sku: "SIO-PRK", stock: 2400, unit: "packs", status: "In Stock" },
  { id: "STO-0002", product: "Beef Siomai", sku: "SIO-BEF", stock: 1850, unit: "packs", status: "In Stock" },
  { id: "STO-0003", product: "Japanese Siomai", sku: "SIO-JPN", stock: 320, unit: "packs", status: "Low Stock" },
  { id: "STO-0004", product: "Shark's Fin Siomai", sku: "SIO-SHK", stock: 980, unit: "packs", status: "In Stock" },
  { id: "STO-0005", product: "Longganisa Original", sku: "LNG-ORI", stock: 1600, unit: "packs", status: "In Stock" },
  { id: "STO-0006", product: "Longganisa Garlic", sku: "LNG-GRL", stock: 85, unit: "packs", status: "Low Stock" },
];

const statusStyles: Record<string, string> = {
  "In Stock": "bg-emerald-50 text-emerald-700",
  "Low Stock": "bg-amber-50 text-amber-700",
  "Out of Stock": "bg-red-50 text-red-700",
};

const AdminStock = () => {
  const { data: stockItems, loading, error } = useFirestoreCollection<StockItem>("stock", []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<StockItem | null>(null);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);

  const handleAddClick = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (item: StockItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item: StockItem) => {
    setDeletingItem(item);
    setDeleteDialogOpen(true);
  };

  const handleModalSuccess = () => {
    setEditingItem(null);
  };

  const handleDeleteSuccess = () => {
    setDeletingItem(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="font-display text-xl font-bold text-foreground">Stock Management</h3>
          {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsBulkImportOpen(true)}
            variant="outline"
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            Bulk Import
          </Button>
          <Button
            onClick={handleAddClick}
            className="bg-primary text-primary-foreground shadow-sm hover:shadow-md active:scale-[0.97]"
          >
            + Add Stock
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Product</th>
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">SKU</th>
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Quantity</th>
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                  Loading stock data...
                </td>
              </tr>
            )}
            {error && !loading && (
              <tr>
                <td colSpan={5} className="px-5 py-4 text-center text-red-600">
                  Error: {error}
                </td>
              </tr>
            )}
            {!loading && !error && stockItems.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                  No stock items yet. Click "Add Stock" to get started.
                </td>
              </tr>
            )}
            {!loading && stockItems.map((s) => (
              <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <td className="px-5 py-3.5 font-medium text-foreground">{s.product}</td>
                <td className="px-5 py-3.5 text-muted-foreground font-mono text-xs hidden sm:table-cell">{s.sku}</td>
                <td className="px-5 py-3.5 text-foreground tabular-nums">{s.stock.toLocaleString()} {s.unit}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[s.status] || "bg-muted text-muted-foreground"}`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditClick(s)}
                    className="text-blue-600 hover:bg-blue-50"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(s)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <StockModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleModalSuccess}
        editItem={editingItem}
      />

      {deletingItem && (
        <DeleteConfirmDialog
          isOpen={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onSuccess={handleDeleteSuccess}
          collectionName="stock"
          itemId={deletingItem.id}
          itemName={`${deletingItem.product} (${deletingItem.id})`}
        />
      )}

      <BulkImportModal
        isOpen={isBulkImportOpen}
        onOpenChange={setIsBulkImportOpen}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default AdminStock;
