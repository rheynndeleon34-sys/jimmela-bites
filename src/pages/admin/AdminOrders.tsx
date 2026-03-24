import { useState } from "react";
import { Loader2, Edit2, Trash2 } from "lucide-react";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { orderBy } from "firebase/firestore";
import { OrderModal } from "@/components/modals/OrderModal";
import { DeleteConfirmDialog } from "@/components/modals/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";

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
  updatedAt?: any;
}

const fallbackOrders: Order[] = [
  { id: "ORD-2847", customer: "Maria Santos", items: [{productId: "1", productName: "Pork Siomai x50, Beef Siomai x30", quantity: 80, price: 5250}], total: 4200, status: "Processing", date: "Mar 23, 2026" },
  { id: "ORD-2846", customer: "Aling Nena's Carinderia", items: [{productId: "2", productName: "Longganisa Original x100", quantity: 100, price: 8500}], total: 8500, status: "Shipped", date: "Mar 23, 2026" },
  { id: "ORD-2845", customer: "JP Food Cart", items: [{productId: "3", productName: "Japanese Siomai x80, Shark's Fin x40", quantity: 120, price: 6800}], total: 6800, status: "Delivered", date: "Mar 22, 2026" },
  { id: "ORD-2844", customer: "Kusina ni Carlo", items: [{productId: "4", productName: "Pork Siomai x200", quantity: 200, price: 9200}], total: 9200, status: "Processing", date: "Mar 22, 2026" },
  { id: "ORD-2843", customer: "Mang Ben's Ihawan", items: [{productId: "5", productName: "Longganisa Garlic x150", quantity: 150, price: 12750}], total: 12750, status: "Delivered", date: "Mar 21, 2026" },
  { id: "ORD-2842", customer: "Tindahan ni Lola", items: [{productId: "6", productName: "Beef Siomai x60", quantity: 60, price: 3600}], total: 3600, status: "Cancelled", date: "Mar 21, 2026" },
];

const statusStyles: Record<string, string> = {
  Processing: "bg-amber-50 text-amber-700",
  Shipped: "bg-blue-50 text-blue-700",
  Delivered: "bg-emerald-50 text-emerald-700",
  Cancelled: "bg-red-50 text-red-700",
};

const AdminOrders = () => {
  const { data: orders, loading } = useFirestoreCollection<Order>("orders", [orderBy("date", "desc")], fallbackOrders);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Order | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<Order | null>(null);

  const handleAddClick = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (item: Order) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item: Order) => {
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
          <h3 className="font-display text-xl font-bold text-foreground">Orders</h3>
          {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
        </div>
        <Button
          onClick={handleAddClick}
          className="bg-primary text-primary-foreground shadow-sm hover:shadow-md active:scale-[0.97]"
        >
          + New Order
        </Button>
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
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <td className="px-5 py-3.5 font-medium text-foreground">{o.id}</td>
                <td className="px-5 py-3.5 text-foreground">{o.customer}</td>
                <td className="px-5 py-3.5 text-muted-foreground hidden lg:table-cell max-w-[220px] truncate">
                  {o.items.map((item) => item.productName).join(", ")}
                </td>
                <td className="px-5 py-3.5 font-semibold text-foreground tabular-nums">₱{o.total.toLocaleString()}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[o.status] || "bg-muted text-muted-foreground"}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-muted-foreground hidden sm:table-cell">{o.date}</td>
                <td className="px-5 py-3.5 flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditClick(o)}
                    className="text-blue-600 hover:bg-blue-50"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(o)}
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

      <OrderModal
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
          collectionName="orders"
          itemId={deletingItem.id}
          itemName={`${deletingItem.customer}'s Order (${deletingItem.id})`}
        />
      )}
    </div>
  );
};

export default AdminOrders;
