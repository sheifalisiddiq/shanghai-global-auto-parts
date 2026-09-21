import type {
  Base,
  CollectionKey,
  CollectionMap,
  CreateInput,
  SingletonKey,
  SingletonMap,
  Status,
} from "./types";

/**
 * THE data seam. Every admin screen talks to a `DataAdapter` and nothing else.
 *
 * Reads are synchronous snapshots (`collection()` / `singleton()`), stable by
 * reference until the data changes, so React can subscribe with
 * useSyncExternalStore. A database adapter keeps a client cache that it fills
 * and revalidates from the server; mutations are async and resolve once the
 * server accepted them.
 *
 * Today: `adapters/local` (browser localStorage, seeded from the real site).
 * Later: `adapters/db` implementing this same interface (see adapters/README.md).
 */
export interface DataAdapter {
  /** Hydrate the cache (read storage / seed / fetch). Idempotent. */
  load(): Promise<void>;
  isReady(): boolean;
  subscribe(listener: () => void): () => void;

  collection<K extends CollectionKey>(key: K): readonly CollectionMap[K][];
  singleton<K extends SingletonKey>(key: K): SingletonMap[K];

  create<K extends CollectionKey>(key: K, input: CreateInput<CollectionMap[K]>): Promise<CollectionMap[K]>;
  update<K extends CollectionKey>(key: K, id: string, patch: Partial<CollectionMap[K]>): Promise<CollectionMap[K]>;
  setStatus<K extends CollectionKey>(key: K, id: string, status: Status): Promise<void>;
  /** Soft delete: status "trash". */
  trash<K extends CollectionKey>(key: K, id: string): Promise<void>;
  restore<K extends CollectionKey>(key: K, id: string): Promise<void>;
  /** Permanent delete (only from Trash in the UI). */
  purge<K extends CollectionKey>(key: K, id: string): Promise<void>;
  duplicate<K extends CollectionKey>(key: K, id: string): Promise<CollectionMap[K]>;
  bulkUpdate<K extends CollectionKey>(key: K, ids: string[], patch: Partial<CollectionMap[K]>): Promise<void>;
  bulkTrash<K extends CollectionKey>(key: K, ids: string[]): Promise<void>;
  /** Taxonomy merge: re-point references from `fromIds` to `intoId`, then trash the merged terms. */
  merge<K extends CollectionKey>(key: K, fromIds: string[], intoId: string): Promise<void>;
  /** Import many rows at once (CSV import, seeding, "Test Form"). */
  createMany<K extends CollectionKey>(key: K, inputs: CreateInput<CollectionMap[K]>[]): Promise<CollectionMap[K][]>;
  clear<K extends CollectionKey>(key: K, predicate?: (row: CollectionMap[K]) => boolean): Promise<void>;

  saveSingleton<K extends SingletonKey>(key: K, value: SingletonMap[K], summary?: string): Promise<void>;

  /** Record an audit entry for a non-CRUD action (generate sitemap, restore backup, ...). */
  logAction(action: string, collection: string, summary: string, entityId?: string): Promise<void>;
  /** Demo only: restore the seeded data set. */
  reset(): Promise<void>;
}

export type { Base };
