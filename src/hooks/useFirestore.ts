import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useFirestoreCollection<T>(
  collectionName: string,
  constraints: QueryConstraint[] = [],
  fallback: T[] = []
) {
  const [data, setData] = useState<T[]>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, collectionName), ...constraints);
    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
        setData(docs.length > 0 ? docs : fallback);
        setLoading(false);
      },
      () => {
        setData(fallback);
        setLoading(false);
      }
    );
    return unsub;
  }, [collectionName]);

  return { data, loading };
}
