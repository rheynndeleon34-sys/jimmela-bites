import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export type UserRole = "admin" | "user";

interface UserPermissions {
  canManageStock: boolean;
  canManageOrders: boolean;
  canManageDelivery: boolean;
  canViewAnalytics: boolean;
  canViewFinancials: boolean;
  canManageUsers: boolean;
}

export function useUserRole() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>("user");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setRole("user");
        setLoading(false);
        return;
      }

      setUser(currentUser);

      try {
        const userDoc = await getDoc(doc(db, "admin_users", currentUser.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role || "user");
        } else {
          setRole("user");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setRole("user");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const permissions: UserPermissions = {
    canManageStock: role === "admin",
    canManageOrders: role === "admin",
    canManageDelivery: role === "admin",
    canViewAnalytics: role === "admin",
    canViewFinancials: role === "admin",
    canManageUsers: role === "admin",
  };

  return {
    role,
    isAdmin: role === "admin",
    loading,
    permissions,
  };
}

export function useRequireAdmin() {
  const { isAdmin, loading } = useUserRole();

  return {
    isAdmin,
    loading,
    canAccess: isAdmin,
  };
}
