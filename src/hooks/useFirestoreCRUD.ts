import { useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
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
      console.log(`[CRUD] Adding to ${collectionName}:`, data);
      
      // Check if data has an id field
      const dataWithId = data as any;
      const docId = dataWithId.id;

      if (docId) {
        // If ID provided, use setDoc to create with specific ID
        await setDoc(doc(db, collectionName, docId), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        console.log(`[CRUD] Successfully added to ${collectionName}:`, docId);
        setState({ loading: false, error: null, success: true });
        return docId;
      } else {
        // Otherwise, use addDoc to auto-generate ID
        const docRef = await addDoc(collection(db, collectionName), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        console.log(`[CRUD] Successfully added to ${collectionName}:`, docRef.id);
        setState({ loading: false, error: null, success: true });
        return docRef.id;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add";
      console.error(`[CRUD Error] Add to ${collectionName}:`, errorMessage);
      setState({ loading: false, error: errorMessage, success: false });
      return null;
    }
  };

  const update = async (id: string, data: Partial<T>): Promise<boolean> => {
    setState({ loading: true, error: null, success: false });
    try {
      console.log(`[CRUD] Updating ${collectionName}/${id}:`, data);
      await updateDoc(doc(db, collectionName, id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
      console.log(`[CRUD] Successfully updated ${collectionName}/${id}`);
      setState({ loading: false, error: null, success: true });
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update";
      console.error(`[CRUD Error] Update ${collectionName}/${id}:`, errorMessage);
      setState({ loading: false, error: errorMessage, success: false });
      return false;
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    setState({ loading: true, error: null, success: false });
    try {
      console.log(`[CRUD] Deleting ${collectionName}/${id}`);
      await deleteDoc(doc(db, collectionName, id));
      console.log(`[CRUD] Successfully deleted ${collectionName}/${id}`);
      setState({ loading: false, error: null, success: true });
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete";
      console.error(`[CRUD Error] Delete ${collectionName}/${id}:`, errorMessage);
      setState({ loading: false, error: errorMessage, success: false });
      return false;
    }
  };

  const clearState = () => {
    setState({ loading: false, error: null, success: false });
  };

  return { ...state, add, update, remove, clearState };
}
