import { useState, useEffect, useRef } from "react";
import {
  collection,
  query,
  onSnapshot,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useFirestoreCollection<T>(
  collectionName: string,
  constraints: QueryConstraint[] = [],
  fallback: T[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const constraintsRef = useRef<string>("");

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Track constraints to detect changes
    const constraintsKey = JSON.stringify(
      constraints.map((c) => JSON.stringify(c))
    );

    // Only re-subscribe if constraints actually changed
    if (constraintsRef.current === constraintsKey) {
      setLoading(false);
      return;
    }

    constraintsRef.current = constraintsKey;

    try {
      const q = query(collection(db, collectionName), ...constraints);
      console.log(
        `[Firestore] Subscribing to ${collectionName} with ${constraints.length} constraints`
      );
      
      const unsub = onSnapshot(
        q,
        (snap) => {
          const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
          console.log(
            `[Firestore] ${collectionName} updated:`,
            docs.length,
            "items"
          );
          setData(docs);
          setLoading(false);
          setError(null);
        },
        (err) => {
          const errorMessage = err instanceof Error ? err.message : String(err);
          console.error(`[Firestore Error] ${collectionName}:`, errorMessage);
          setError(errorMessage);
          setData([]);
          setLoading(false);
        }
      );

      return unsub;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(`[Firestore Error] ${collectionName}:`, errorMessage);
      setError(errorMessage);
      setData([]);
      setLoading(false);
    }
  }, [collectionName]);

  return { data, loading, error };
}
