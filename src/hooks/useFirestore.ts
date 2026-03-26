import { useState, useEffect, useRef, useMemo } from "react";
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

  // Stable serialization of constraints for dependency tracking
  const constraintsKey = useMemo(
    () => JSON.stringify(constraints.map((c) => String(c))),
    [constraints]
  );

  useEffect(() => {
    setLoading(true);
    setError(null);

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
          setData(fallback);
          setLoading(false);
        }
      );

      return unsub;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(`[Firestore Error] ${collectionName}:`, errorMessage);
      setError(errorMessage);
      setData(fallback);
      setLoading(false);
    }
  }, [collectionName, constraintsKey]);

  return { data, loading, error };
}
