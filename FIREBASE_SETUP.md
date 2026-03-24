# Firebase Setup Guide for Jimmela Bites Admin

This guide walks you through verifying and setting up Firefox collections required for the admin system to work correctly.

## Prerequisites

- Firebase project already created
- Firebase Console access at [https://console.firebase.google.com](https://console.firebase.google.com)
- Admin Dashboard running locally or deployed

## Step 1: Open Firebase Console

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Select your Jimmela Bites project
3. Click on **Firestore Database** in the left sidebar

## Step 2: Verify Collections Exist

The admin system requires **4 collections**. Check if they exist:

### Required Collections:

1. **stock** - Product inventory
   - Documents contain: `product`, `sku`, `stock`, `unit`, `status`, `createdAt`, `updatedAt`
   - Example document ID: `STO-0001`

2. **orders** - Customer orders
   - Documents contain: `customer`, `items[]`, `total`, `status`, `date`, `createdAt`, `updatedAt`
   - Example document ID: `ORD-2847`

3. **deliveries** - Delivery schedules
   - Documents contain: `driver`, `destination`, `items`, `status`, `eta`, `createdAt`, `updatedAt`
   - Example document ID: `DEL-0412`

4. **admin_users** - Admin role assignments
   - Documents contain: `role`, `permissions[]`, `createdAt`, `updatedAt`
   - Document ID: User UID from Authentication

### How to Check:

1. In Firestore Console, look at the left panel
2. You should see a list of collections
3. If any are **missing**, you'll need to create them (see Step 3)

## Step 3: Create Missing Collections

If a collection doesn't exist, create it manually:

1. Click the **"Create collection"** button in Firestore Console
2. Enter the collection name (e.g., `stock`)
3. Click **Next**
4. You can either:
   - Add a document now, OR
   - Start with an empty collection and add data via the admin dashboard

### Recommended: Add Sample Stock Data

To test the admin system, add at least one stock item:

1. In the `stock` collection, click **"Add document"**
2. Set Document ID to: `STO-0001`
3. Add these fields:
   ```
   product: "Pork Siomai" (string)
   sku: "SIO-PRK" (string)
   stock: 2400 (number)
   unit: "packs" (string)
   status: "In Stock" (string)
   createdAt: (set to server timestamp)
   updatedAt: (set to server timestamp)
   ```
4. Click **Save**

## Step 4: Test the Admin System

### Test Stock Management:

1. Open the admin dashboard: `http://localhost:5173/admin/stock`
2. You should see:
   - Loading spinner briefly while data loads
   - Your sample "Pork Siomai" item appears in the table
   - "Add Stock" button works and new items appear immediately

3. **Troubleshooting if items don't appear:**
   - Check browser console (F12) for error messages
   - Look for `[Firestore]` messages showing data loaded
   - Verify the collection name exactly matches `stock` (case-sensitive)

### Test Orders Management:

1. Navigate to `http://localhost:5173/admin/orders`
2. Click **"New Order"** button
3. Orders table should show loading initially, then "No orders yet" message
4. Create a test order - verify it appears immediately after saving

### Test Delivery Tracking:

1. Navigate to `http://localhost:5173/admin/delivery`
2. Click **"Schedule Delivery"** button
3. Create a test delivery - verify it appears immediately

## Step 5: Verify Real-Time Updates Work

The admin system uses **real-time Firestore listeners**. To verify this works:

### Desktop Test:

1. Open admin dashboard in one browser window: `http://localhost:5173/admin/stock`
2. Open Firebase Console in another window
3. In Firestore Console, add a new document to `stock` collection
4. After ~1-2 seconds, the new item appears in the admin dashboard **without page refresh**

If items don't appear immediately, there may be configuration issues:

- Check Firestore Security Rules allow reads from your user
- Verify Firebase Config in `src/lib/firebase.ts` is correct
- Check browser console for permission denied errors

## Firestore Collections Data Schema

### stock Collection

```typescript
{
  id: string;           // Auto-generated "STO-0001"
  product: string;      // Product name
  sku: string;         // Stock keeping unit
  stock: number;       // Quantity in inventory
  unit: string;        // "packs", "boxes", "pieces", etc
  status: string;      // "In Stock", "Low Stock", "Out of Stock"
  createdAt: timestamp; // Firebase server timestamp
  updatedAt: timestamp; // Firebase server timestamp
}
```

### orders Collection

```typescript
{
  id: string;           // Auto-generated "ORD-2847"
  customer: string;     // Customer name
  items: [
    {
      productId: string;
      productName: string;
      quantity: number;
      price: number;
    }
  ];
  total: number;        // Total order value
  status: string;       // "Processing", "Shipped", "Delivered", "Cancelled"
  date: string;         // Date string "Mar 23, 2026"
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

### deliveries Collection

```typescript
{
  id: string;           // Auto-generated "DEL-0412"
  driver: string;       // Driver name
  destination: string;  // Delivery address
  items: string;        // Description of items
  status: string;       // "Pending", "In Transit", "Delivered"
  eta: string;         // Estimated time of arrival
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

### admin_users Collection

```typescript
{
  // Document ID is user's UID from Firebase Auth
  role: string;         // "admin" or "user"
  permissions: [string]; // ["manage_stock", "manage_orders", etc]
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

## Troubleshooting

### Problem: "Loading..." spinner spins forever

**Cause:** Firestore listener can't connect or permission denied

**Solution:**
1. Check Firebase config in `src/lib/firebase.ts`
2. Check Firestore security rules in Firebase Console
3. Check browser console for error messages (F12)
4. Log: Look for `[Firestore Error]` messages

### Problem: Add/Edit/Delete buttons don't show success

**Cause:** Operation succeeded but UI not showing real-time update

**Solution:**
1. Check browser console for `[CRUD]` log messages
2. Manually refresh page and verify data was saved to Firestore
3. Check Firestore Console - if data appears there, the sync is delayed
4. May indicate network latency - try again after 2-3 seconds

### Problem: Form shows error: "collection does not exist"

**Cause:** Collection name mismatch or missing database

**Solution:**
1. Go to Firestore Console
2. Verify collection exists with exact name (case-sensitive)
3. If missing, create it with the "Create collection" button
4. Refresh admin dashboard

### Problem: Can't see data from Firestore, only "No items" message

**Cause:** Data exists but real-time listener not firing

**Solution:**
1. Open Firestore Console
2. Click on the collection (e.g., `stock`)
3. Verify documents exist with correct data
4. Check browser console (F12) for `[Firestore]` log messages
5. If no logs, firestore library may not be initialized - check `src/lib/firebase.ts`

## Firestore Security Rules

By default, Firestore blocks all access. Add rules to allow reads from authenticated users:

In Firebase Console > Firestore Database > Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read all collections
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

⚠️ **WARNING:** This rule allows write access to all users. For production, implement more restrictive rules.

## Next Steps

1. ✅ Create all 4 collections in Firestore
2. ✅ Add sample data manually or via admin dashboard
3. ✅ Test real-time updates work
4. ✅ Verify loading/error states display correctly
5. ✅ Review Firestore Security Rules for your use case

For more help, check console logs and Firebase documentation at [https://firebase.google.com/docs/firestore](https://firebase.google.com/docs/firestore).
