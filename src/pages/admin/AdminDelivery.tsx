import { useState } from "react";
import { Truck, MapPin, Clock, Loader2, Edit2, Trash2 } from "lucide-react";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { DeliveryModal } from "@/components/modals/DeliveryModal";
import { DeleteConfirmDialog } from "@/components/modals/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";

interface Delivery {
  id: string;
  driver: string;
  destination: string;
  items: string;
  status: string;
  eta: string;
  createdAt?: any;
  updatedAt?: any;
}

const fallbackDeliveries: Delivery[] = [
  { id: "DEL-0412", driver: "Kuya Rodel", destination: "Malolos, Bulacan", items: "Pork Siomai x50, Beef x30", status: "In Transit", eta: "2:30 PM" },
  { id: "DEL-0411", driver: "Kuya Jun", destination: "Meycauayan, Bulacan", items: "Longganisa Original x100", status: "Delivered", eta: "—" },
  { id: "DEL-0410", driver: "Kuya Rodel", destination: "San Jose del Monte", items: "Japanese Siomai x80", status: "In Transit", eta: "4:00 PM" },
  { id: "DEL-0409", driver: "Kuya Mark", destination: "Calumpit, Bulacan", items: "Shark's Fin x40, Garlic Longganisa x60", status: "Pending", eta: "Tomorrow" },
  { id: "DEL-0408", driver: "Kuya Jun", destination: "Hagonoy, Bulacan", items: "Pork Siomai x200", status: "Delivered", eta: "—" },
];

const statusStyles: Record<string, string> = {
  "In Transit": "bg-blue-50 text-blue-700",
  Delivered: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
};

const AdminDelivery = () => {
  const { data: deliveries, loading } = useFirestoreCollection<Delivery>("deliveries", [], fallbackDeliveries);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Delivery | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<Delivery | null>(null);

  const handleAddClick = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (item: Delivery) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item: Delivery) => {
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
          <h3 className="font-display text-xl font-bold text-foreground">Delivery Tracking</h3>
          {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
        </div>
        <Button
          onClick={handleAddClick}
          className="bg-primary text-primary-foreground shadow-sm hover:shadow-md active:scale-[0.97]"
        >
          + Schedule Delivery
        </Button>
      </div>

      <div className="grid gap-4">
        {deliveries.map((d) => (
          <div
            key={d.id}
            className="bg-card rounded-xl border border-border shadow-sm p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{d.id}</p>
                  <p className="text-muted-foreground text-xs">{d.driver}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    statusStyles[d.status] || "bg-muted text-muted-foreground"
                  }`}
                >
                  {d.status}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm mb-3">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" /> {d.destination}
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="w-3.5 h-3.5" /> ETA: {d.eta}
              </span>
            </div>
            <p className="text-muted-foreground text-xs mb-4">{d.items}</p>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditClick(d)}
                className="text-blue-600 hover:bg-blue-50"
              >
                <Edit2 className="w-4 h-4 mr-1.5" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteClick(d)}
                className="text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-1.5" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <DeliveryModal
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
          collectionName="deliveries"
          itemId={deletingItem.id}
          itemName={`Delivery to ${deletingItem.destination} (${deletingItem.id})`}
        />
      )}
    </div>
  );
};

export default AdminDelivery;
