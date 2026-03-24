import { useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface CRUDState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export function useFirestoreCRUD<T extends { id?: string }>(
  collectionName: string
) {
  const [state, setState] = useState<CRUDState>({
    loading: false,
    error: null,
    success: false,
  });

  const add = async (data: Omit<T, "id">): Promise<string | null> => {
    setState({ loading: true, error: null, success: false });
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setState({ loading: false, error: null, success: true });
      return docRef.id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add";
      setState({ loading: false, error: errorMessage, success: false });
      return null;
    }
  };

  const update = async (id: string, data: Partial<T>): Promise<boolean> => {
    setState({ loading: true, error: null, success: false });
    try {
      await updateDoc(doc(db, collectionName, id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
      setState({ loading: false, error: null, success: true });
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update";
      setState({ loading: false, error: errorMessage, success: false });
      return false;
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    setState({ loading: true, error: null, success: false });
    try {
      await deleteDoc(doc(db, collectionName, id));
      setState({ loading: false, error: null, success: true });
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete";
      setState({ loading: false, error: errorMessage, success: false });
      return false;
    }
  };

  const clearState = () => {
    setState({ loading: false, error: null, success: false });
  };

  return { ...state, add, update, remove, clearState };
}
