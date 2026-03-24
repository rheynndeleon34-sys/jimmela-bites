import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Generate auto-numbered IDs like "STO-001", "ORD-2847", "DEL-0412"
 */
export async function generateAutoNumber(
  collectionName: string,
  prefix: string
): Promise<string> {
  try {
    const q = query(collection(db, collectionName));
    const snapshot = await getDocs(q);
    const maxNumber = snapshot.docs.reduce((max, doc) => {
      const data = doc.data();
      const id = data.id || "";
      const numberMatch = id.match(/(\d+)$/);
      if (numberMatch) {
        const num = parseInt(numberMatch[1], 10);
        return Math.max(max, num);
      }
      return max;
    }, 0);

    const nextNumber = maxNumber + 1;
    return `${prefix}-${String(nextNumber).padStart(4, "0")}`;
  } catch (error) {
    console.error("Error generating auto number:", error);
    return `${prefix}-0001`;
  }
}

/**
 * Calculate stock status based on quantity
 * In Stock: > 500
 * Low Stock: 50-500
 * Out of Stock: < 50
 */
export function calculateStockStatus(quantity: number): string {
  if (quantity > 500) return "In Stock";
  if (quantity >= 50) return "Low Stock";
  return "Out of Stock";
}

/**
 * Format currency for Philippine Peso
 */
export function formatCurrency(amount: number): string {
  return `₱${amount.toLocaleString("en-PH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Calculate order total from items
 */
export function calculateOrderTotal(items: OrderItem[]): number {
  return items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
}

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}
