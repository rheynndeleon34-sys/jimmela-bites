import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useFirestoreCRUD } from "@/hooks/useFirestoreCRUD";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { generateAutoNumber, calculateOrderTotal, formatCurrency } from "@/lib/adminHelpers";
import { Loader2, X } from "lucide-react";

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

interface StockItem {
  id: string;
  product: string;
  sku: string;
  stock: number;
  unit: string;
  status: string;
}

interface OrderModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  editItem?: Order | null;
}

export const OrderModal = ({
  isOpen,
  onOpenChange,
  onSuccess,
  editItem,
}: OrderModalProps) => {
  const { toast } = useToast();
  const { add, update, loading, error } = useFirestoreCRUD<Order>("orders");
  const { data: stockItems } = useFirestoreCollection<StockItem>("stock", []);

  const [formData, setFormData] = useState({
    customer: "",
    items: [] as OrderItem[],
    status: "Processing",
  });

  const [tempItem, setTempItem] = useState({
    productId: "",
    quantity: 1,
    price: 0,
  });

  useEffect(() => {
    if (editItem) {
      setFormData({
        customer: editItem.customer,
        items: editItem.items,
        status: editItem.status,
      });
    } else {
      setFormData({
        customer: "",
        items: [],
        status: "Processing",
      });
    }
  }, [editItem, isOpen]);

  const handleAddItem = () => {
    if (!tempItem.productId) {
      toast({
        title: "Error",
        description: "Please select a product",
        variant: "destructive",
      });
      return;
    }

    if (tempItem.quantity <= 0) {
      toast({
        title: "Error",
        description: "Quantity must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    if (tempItem.price <= 0) {
      toast({
        title: "Error",
        description: "Price must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    const product = stockItems.find((p) => p.id === tempItem.productId);
    if (!product) return;

    // Check if already exists in items
    const existingIndex = formData.items.findIndex(
      (item) => item.productId === tempItem.productId
    );

    if (existingIndex >= 0) {
      const updated = [...formData.items];
      updated[existingIndex].quantity += tempItem.quantity;
      setFormData({ ...formData, items: updated });
    } else {
      setFormData({
        ...formData,
        items: [
          ...formData.items,
          {
            productId: tempItem.productId,
            productName: product.product,
            quantity: tempItem.quantity,
            price: tempItem.price,
          },
        ],
      });
    }

    setTempItem({ productId: "", quantity: 1, price: 0 });
  };

  const handleRemoveItem = (productId: string) => {
    setFormData({
      ...formData,
      items: formData.items.filter((item) => item.productId !== productId),
    });
  };

  const checkStockAvailability = (): boolean => {
    for (const item of formData.items) {
      const stock = stockItems.find((s) => s.id === item.productId);
      if (!stock) {
        toast({
          title: "Error",
          description: `Product "${item.productName}" not found in stock`,
          variant: "destructive",
        });
        return false;
      }

      if (stock.stock < item.quantity) {
        toast({
          title: "Insufficient Stock",
          description: `${stock.product} has only ${stock.stock} ${stock.unit} available, but you requested ${item.quantity}`,
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const deductStock = async () => {
    const { updateDoc, doc } = await import("firebase/firestore");
    const { db } = await import("@/lib/firebase");

    for (const item of formData.items) {
      const stock = stockItems.find((s) => s.id === item.productId);
      if (stock) {
        const newStockQty = stock.stock - item.quantity;
        const newStatus =
          newStockQty === 0
            ? "Out of Stock"
            : newStockQty < 100
              ? "Low Stock"
              : "In Stock";

        try {
          await updateDoc(doc(db, "stock", item.productId), {
            stock: newStockQty,
            status: newStatus,
            updatedAt: new Date(),
          });
          console.log(
            `[Stock Updated] ${stock.product}: ${stock.stock} → ${newStockQty}`
          );
        } catch (err) {
          console.error(`Failed to deduct stock for ${stock.product}:`, err);
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customer.trim()) {
      toast({
        title: "Error",
        description: "Customer name is required",
        variant: "destructive",
      });
      return;
    }

    if (formData.items.length === 0) {
      toast({
        title: "Error",
        description: "At least one item is required",
        variant: "destructive",
      });
      return;
    }

    const total = formData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    try {
      if (editItem) {
        // Only allow status updates when editing
        const success = await update(editItem.id, {
          status: formData.status,
        });
        if (success) {
          toast({
            title: "Success",
            description: "Order status updated successfully",
          });
          onOpenChange(false);
        }
      } else {
        // Check stock before creating order
        if (!checkStockAvailability()) {
          return;
        }

        const id = await generateAutoNumber("orders", "ORD");
        const docId = await add({
          id,
          customer: formData.customer,
          items: formData.items,
          status: formData.status,
          total,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
        } as Omit<Order, "id">);

        if (docId) {
          // Deduct stock after order is created
          await deductStock();
          toast({
            title: "Success",
            description: `Order created successfully (${id}) and stock updated`,
          });
          onOpenChange(false);
        }
      }
      onSuccess();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to save order";
      console.error("Order form error:", errorMsg);
      toast({
        title: "Error",
        description: error || errorMsg,
        variant: "destructive",
      });
    }
  };

  const total = formData.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editItem ? "Edit Order" : "Create New Order"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer">Customer Name *</Label>
            <Input
              id="customer"
              placeholder="e.g., Maria Santos"
              value={formData.customer}
              onChange={(e) =>
                setFormData({ ...formData, customer: e.target.value })
              }
              disabled={!!editItem}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!editItem && (
            <div className="border rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-sm">Add Items</h4>

            <div className="space-y-2">
              <Label htmlFor="product">Select Product *</Label>
              <Select value={tempItem.productId} onValueChange={(value) => setTempItem({ ...tempItem, productId: value })}>
                <SelectTrigger id="product">
                  <SelectValue placeholder="Choose a product..." />
                </SelectTrigger>
                <SelectContent>
                  {stockItems.filter((stock) => stock.id && stock.id.trim() !== "").map((stock) => (
                    <SelectItem key={stock.id} value={stock.id}>
                      {stock.product} ({stock.status}) - {stock.stock} {stock.unit} available
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="qty">Quantity *</Label>
                <Input
                  id="qty"
                  type="number"
                  min="1"
                  value={tempItem.quantity}
                  onChange={(e) =>
                    setTempItem({
                      ...tempItem,
                      quantity: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price per Unit *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={tempItem.price}
                  onChange={(e) =>
                    setTempItem({
                      ...tempItem,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={handleAddItem}
              className="w-full"
            >
              Add to Order
            </Button>
            </div>
          )}

          {formData.items.length > 0 && (
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-sm">Order Items {editItem && "(Read-only)"}</h4>
              <div className="space-y-2">
                {formData.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between p-2 bg-muted rounded text-sm"
                  >
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} × {formatCurrency(item.price)} ={" "}
                        {formatCurrency(item.quantity * item.price)}
                      </p>
                    </div>
                    {!editItem && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.productId)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t flex justify-between items-center">
                <span className="font-semibold">Total:</span>
                <span className="text-lg font-bold text-primary">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          )}

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
                "Create Order"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
