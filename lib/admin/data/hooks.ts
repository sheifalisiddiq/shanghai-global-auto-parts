"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { db } from "./index";
import type { CollectionKey, CollectionMap, SingletonKey, SingletonMap } from "./types";

const EMPTY: readonly never[] = [];

/** Kicks off (once) loading the adapter and reports readiness. */
export function useDataReady(): boolean {
  useEffect(() => {
    void db.load();
  }, []);
  return useSyncExternalStore(
    db.subscribe,
    () => db.isReady(),
    () => false,
  );
}

/** All rows of a collection (including Trash; filter by status in the screen). */
export function useCollection<K extends CollectionKey>(key: K): readonly CollectionMap[K][] {
  const ready = useDataReady();
  const rows = useSyncExternalStore(
    db.subscribe,
    () => db.collection(key),
    () => EMPTY as readonly CollectionMap[K][],
  );
  return ready ? rows : (EMPTY as readonly CollectionMap[K][]);
}

/** Non-trashed rows. */
export function useActiveRows<K extends CollectionKey>(key: K): CollectionMap[K][] {
  const rows = useCollection(key);
  return useMemo(() => rows.filter((r) => r.status !== "trash"), [rows]);
}

export function useEntity<K extends CollectionKey>(key: K, id: string | undefined): {
  ready: boolean;
  entity: CollectionMap[K] | undefined;
} {
  const ready = useDataReady();
  const rows = useCollection(key);
  const entity = useMemo(() => (id ? rows.find((r) => r.id === id) : undefined), [rows, id]);
  return { ready, entity };
}

export function useSingleton<K extends SingletonKey>(key: K): { ready: boolean; value: SingletonMap[K] | undefined } {
  const ready = useDataReady();
  const value = useSyncExternalStore(
    db.subscribe,
    () => (db.isReady() ? db.singleton(key) : undefined),
    () => undefined,
  );
  return { ready, value };
}
