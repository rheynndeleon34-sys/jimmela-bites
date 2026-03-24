import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useFirestoreCRUD } from "@/hooks/useFirestoreCRUD";
import { generateAutoNumber } from "@/lib/adminHelpers";
import { Loader2 } from "lucide-react";

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

interface DeliveryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  editItem?: Delivery | null;
}

export const DeliveryModal = ({
  isOpen,
  onOpenChange,
  onSuccess,
  editItem,
}: DeliveryModalProps) => {
  const { toast } = useToast();
  const { add, update, loading, error } = useFirestoreCRUD<Delivery>("deliveries");

  const [formData, setFormData] = useState({
    driver: "",
    destination: "",
    items: "",
    status: "Pending",
    eta: "",
  });

  useEffect(() => {
    if (editItem) {
      setFormData({
        driver: editItem.driver,
        destination: editItem.destination,
        items: editItem.items,
        status: editItem.status,
        eta: editItem.eta,
      });
    } else {
      setFormData({
        driver: "",
        destination: "",
        items: "",
        status: "Pending",
        eta: "",
      });
    }
  }, [editItem, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // When editing, only validate status
    if (editItem) {
      try {
        const success = await update(editItem.id, { status: formData.status });
        if (success) {
          toast({
            title: "Success",
            description: "Delivery status updated successfully",
          });
          onOpenChange(false);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to update delivery";
        console.error("Delivery update error:", errorMsg);
        toast({
          title: "Error",
          description: error || errorMsg,
          variant: "destructive",
        });
      }
      onSuccess();
      return;
    }

    // Validation for new delivery
    if (!formData.driver.trim()) {
      toast({
        title: "Error",
        description: "Driver name is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.destination.trim()) {
      toast({
        title: "Error",
        description: "Destination is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.items.trim()) {
      toast({
        title: "Error",
        description: "Items description is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.eta.trim()) {
      toast({
        title: "Error",
        description: "ETA is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const id = await generateAutoNumber("deliveries", "DEL");
      const docId = await add({
        id,
        ...formData,
      } as Omit<Delivery, "id">);
      if (docId) {
        toast({
          title: "Success",
          description: `Delivery scheduled successfully (${id})`,
        });
        onOpenChange(false);
      }
      onSuccess();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to save delivery";
      console.error("Delivery save error:", errorMsg);
      toast({
        title: "Error",
        description: error || errorMsg,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editItem ? "Edit Delivery" : "Schedule New Delivery"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {editItem && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-700">
              ℹ️ Editing delivery: Only status can be changed
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="driver">Driver Name *</Label>
            <Input
              id="driver"
              placeholder="e.g., Kuya Rodel"
              value={formData.driver}
              onChange={(e) =>
                setFormData({ ...formData, driver: e.target.value })
              }
              disabled={!!editItem}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination">Destination *</Label>
            <Input
              id="destination"
              placeholder="e.g., Malolos, Bulacan"
              value={formData.destination}
              onChange={(e) =>
                setFormData({ ...formData, destination: e.target.value })
              }
              disabled={!!editItem}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="items">Items *</Label>
            <Input
              id="items"
              placeholder="e.g., Pork Siomai x50, Beef Siomai x30"
              value={formData.items}
              onChange={(e) =>
                setFormData({ ...formData, items: e.target.value })
              }
              disabled={!!editItem}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Transit">In Transit</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eta">ETA *</Label>
              <Input
                id="eta"
                placeholder="e.g., 2:30 PM"
                value={formData.eta}
                onChange={(e) =>
                  setFormData({ ...formData, eta: e.target.value })
                }
                disabled={!!editItem}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : editItem ? (
                "Update Status"
              ) : (
                "Schedule Delivery"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
