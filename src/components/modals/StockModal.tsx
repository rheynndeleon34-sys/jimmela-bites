import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useFirestoreCRUD } from "@/hooks/useFirestoreCRUD";
import { generateAutoNumber, calculateStockStatus } from "@/lib/adminHelpers";
import { Loader2 } from "lucide-react";

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

interface StockModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  editItem?: StockItem | null;
}

export const StockModal = ({
  isOpen,
  onOpenChange,
  onSuccess,
  editItem,
}: StockModalProps) => {
  const { toast } = useToast();
  const { add, update, loading, error } = useFirestoreCRUD<StockItem>("stock");

  const [formData, setFormData] = useState({
    product: "",
    sku: "",
    stock: 0,
    unit: "packs",
  });

  useEffect(() => {
    if (editItem) {
      setFormData({
        product: editItem.product,
        sku: editItem.sku,
        stock: editItem.stock,
        unit: editItem.unit,
      });
    } else {
      setFormData({
        product: "",
        sku: "",
        stock: 0,
        unit: "packs",
      });
    }
  }, [editItem, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.product.trim()) {
      toast({
        title: "Error",
        description: "Product name is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.sku.trim()) {
      toast({
        title: "Error",
        description: "SKU is required",
        variant: "destructive",
      });
      return;
    }

    if (formData.stock < 0) {
      toast({
        title: "Error",
        description: "Stock quantity cannot be negative",
        variant: "destructive",
      });
      return;
    }

    const status = calculateStockStatus(formData.stock);

    try {
      if (editItem) {
        await update(editItem.id, {
          ...formData,
          status,
        });
        toast({
          title: "Success",
          description: "Stock updated successfully",
        });
      } else {
        const id = await generateAutoNumber("stock", "STO");
        await add({
          id,
          ...formData,
          status,
        } as Omit<StockItem, "id">);
        toast({
          title: "Success",
          description: `Stock added successfully (${id})`,
        });
      }
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      toast({
        title: "Error",
        description: error || "Failed to save stock",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editItem ? "Edit Stock" : "Add New Stock"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product">Product Name *</Label>
            <Input
              id="product"
              placeholder="e.g., Pork Siomai"
              value={formData.product}
              onChange={(e) =>
                setFormData({ ...formData, product: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sku">SKU *</Label>
            <Input
              id="sku"
              placeholder="e.g., SIO-PRK"
              value={formData.sku}
              onChange={(e) =>
                setFormData({ ...formData, sku: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock">Quantity *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: parseInt(e.target.value) })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                <SelectTrigger id="unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="packs">Packs</SelectItem>
                  <SelectItem value="boxes">Boxes</SelectItem>
                  <SelectItem value="kg">KG</SelectItem>
                  <SelectItem value="pieces">Pieces</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-sm text-muted-foreground p-2 bg-muted rounded">
            Status will be: <span className="font-semibold text-foreground">{calculateStockStatus(formData.stock)}</span>
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
              ) : (
                editItem ? "Update Stock" : "Add Stock"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
