import { authProvider } from "@/lib/admin/auth";
import { ROLES } from "@/lib/admin/access/roles";
import type { DataAdapter } from "../repository";
import { labelOf, newId, nowIso, slugify } from "../defaults";
import type {
  AuditEntry,
  Base,
  CollectionKey,
  CollectionMap,
  SeedData,
  SingletonKey,
  SingletonMap,
  Status,
} from "../types";

/**
 * DEMO ADAPTER: browser localStorage, seeded from the real website data.
 * Changes stay in this browser and never reach the live site.
 * To connect a database, implement `DataAdapter` (see ../repository.ts and
 * ./README.md) and swap the export in ../index.ts. Screens do not change.
 */

const STORAGE_KEY = "sg_admin_data_v1";
const VERSION = 1;

const ID_PREFIX: Record<CollectionKey, string> = {
  brands: "brd",
  models: "mdl",
  products: "prd",
  categories: "cat",
  countries: "cty",
  posts: "pst",
  blogCategories: "bct",
  tags: "tag",
  testimonials: "tst",
  jobs: "job",
  applications: "app",
  enquiries: "enq",
  media: "med",
  redirects: "rdr",
  log404: "l404",
  schemas: "sch",
  users: "usr",
  audit: "aud",
  snippets: "snp",
  plugins: "plg",
  backups: "bkp",
};

/** References that must follow a taxonomy merge. */
const MERGE_REFS: Partial<Record<CollectionKey, { coll: CollectionKey; field: string; multi?: boolean }[]>> = {
  brands: [
    { coll: "models", field: "brandId" },
    { coll: "products", field: "brandId" },
    { coll: "posts", field: "relatedBrandIds", multi: true },
    { coll: "testimonials", field: "relatedBrandId" },
  ],
  models: [
    { coll: "products", field: "modelId" },
    { coll: "posts", field: "relatedModelIds", multi: true },
  ],
  categories: [
    { coll: "products", field: "categoryId" },
    { coll: "models", field: "categoryIds", multi: true },
    { coll: "categories", field: "parentId" },
  ],
  countries: [
    { coll: "products", field: "countryIds", multi: true },
    { coll: "posts", field: "countryIds", multi: true },
  ],
  blogCategories: [{ coll: "posts", field: "categoryId" }],
  tags: [{ coll: "posts", field: "tagIds", multi: true }],
};

interface State {
  v: number;
  collections: { [K in CollectionKey]?: CollectionMap[K][] };
  singletons: Partial<SingletonMap>;
}

const EMPTY: readonly never[] = [];

export function createLocalAdapter(): DataAdapter {
  let state: State = { v: VERSION, collections: {}, singletons: {} };
  let ready = false;
  let loading: Promise<void> | null = null;
  const listeners = new Set<() => void>();

  const emit = () => listeners.forEach((l) => l());

  function persist() {
    try {
      const cleaned: State = {
        ...state,
        collections: {
          ...state.collections,
          // Uploaded previews are object URLs and cannot survive a reload.
          media: state.collections.media?.filter((m) => !m.url.startsWith("blob:")),
        },
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
    } catch {
      console.warn("[admin demo store] could not persist (storage full or blocked)");
    }
  }

  function actor() {
    const s = authProvider.getSession();
    return { name: s?.name ?? "System", role: s ? ROLES[s.roleId]?.label ?? "" : "" };
  }

  function coll<K extends CollectionKey>(key: K): CollectionMap[K][] {
    return (state.collections[key] ?? EMPTY) as CollectionMap[K][];
  }

  function setColl<K extends CollectionKey>(key: K, rows: CollectionMap[K][]) {
    state = { ...state, collections: { ...state.collections, [key]: rows } };
  }

  function audit(action: string, collection: string, summary: string, entityId = "", before = "", after = "") {
    const a = actor();
    const entry: AuditEntry = {
      id: newId(ID_PREFIX.audit),
      status: "published",
      createdAt: nowIso(),
      updatedAt: nowIso(),
      at: nowIso(),
      actor: a.name,
      actorRole: a.role,
      action,
      collection,
      entityId,
      summary,
      before: before.slice(0, 500),
      after: after.slice(0, 500),
    };
    setColl("audit", [entry, ...coll("audit")].slice(0, 500));
  }

  function snippet(obj: unknown): string {
    try {
      return JSON.stringify(obj);
    } catch {
      return "";
    }
  }

  function pick<T extends object>(obj: T, keys: string[]): Partial<T> {
    const out: Record<string, unknown> = {};
    for (const k of keys) out[k] = (obj as Record<string, unknown>)[k];
    return out as Partial<T>;
  }

  async function seed() {
    const { buildSeed } = await import("../seed");
    const data: SeedData = await buildSeed();
    state = { v: VERSION, collections: data.collections, singletons: data.singletons };
    persist();
  }

  function readStorage(): State | null {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as State;
      return parsed.v === VERSION ? parsed : null;
    } catch {
      return null;
    }
  }

  if (typeof window !== "undefined") {
    window.addEventListener("storage", (e) => {
      if (e.key !== STORAGE_KEY || !ready) return;
      const next = readStorage();
      if (next) {
        state = next;
        emit();
      }
    });
  }

  const adapter: DataAdapter = {
    load() {
      if (ready) return Promise.resolve();
      loading ??= (async () => {
        const stored = readStorage();
        if (stored) state = stored;
        else await seed();
        ready = true;
        emit();
      })();
      return loading;
    },
    isReady: () => ready,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    collection: (key) => coll(key),
    singleton: (key) => state.singletons[key] as SingletonMap[typeof key],

    async create(key, input) {
      const now = nowIso();
      const a = actor();
      const row = {
        status: "draft" as Status,
        ...input,
        id: input.id ?? newId(ID_PREFIX[key]),
        createdAt: now,
        updatedAt: now,
        updatedBy: a.name,
        isSample: false,
        deletedAt: null,
      } as unknown as CollectionMap[typeof key];
      setColl(key, [row, ...coll(key)]);
      audit("create", key, `Created ${labelOf(row)}`, (row as Base).id);
      persist();
      emit();
      return row;
    },

    async createMany(key, inputs) {
      const now = nowIso();
      const a = actor();
      const rows = inputs.map(
        (input) =>
          ({
            status: "draft" as Status,
            ...input,
            id: input.id ?? newId(ID_PREFIX[key]),
            createdAt: now,
            updatedAt: now,
            updatedBy: a.name,
            isSample: false,
            deletedAt: null,
          }) as unknown as CollectionMap[typeof key],
      );
      setColl(key, [...rows, ...coll(key)]);
      audit("import", key, `Imported ${rows.length} row(s) into ${key}`);
      persist();
      emit();
      return rows;
    },

    async update(key, id, patch) {
      const before = coll(key).find((r) => r.id === id);
      if (!before) throw new Error(`${key}/${id} not found`);
      const after = { ...before, ...patch, updatedAt: nowIso(), updatedBy: actor().name } as CollectionMap[typeof key];
      setColl(key, coll(key).map((r) => (r.id === id ? after : r)));
      const keys = Object.keys(patch);
      audit(
        patch.status && keys.length === 1 ? `status:${patch.status}` : "update",
        key,
        `Updated ${labelOf(after)}`,
        id,
        snippet(pick(before, keys)),
        snippet(pick(after, keys)),
      );
      persist();
      emit();
      return after;
    },

    async setStatus(key, id, status) {
      await adapter.update(key, id, { status, deletedAt: status === "trash" ? nowIso() : null } as never);
    },

    async trash(key, id) {
      const row = coll(key).find((r) => r.id === id);
      if (!row) return;
      setColl(
        key,
        coll(key).map((r) => (r.id === id ? { ...r, status: "trash" as Status, deletedAt: nowIso() } : r)),
      );
      audit("trash", key, `Moved ${labelOf(row)} to Trash`, id);
      persist();
      emit();
    },

    async restore(key, id) {
      const row = coll(key).find((r) => r.id === id);
      if (!row) return;
      setColl(
        key,
        coll(key).map((r) => (r.id === id ? { ...r, status: "draft" as Status, deletedAt: null } : r)),
      );
      audit("restore", key, `Restored ${labelOf(row)}`, id);
      persist();
      emit();
    },

    async purge(key, id) {
      const row = coll(key).find((r) => r.id === id);
      if (!row) return;
      setColl(key, coll(key).filter((r) => r.id !== id));
      audit("purge", key, `Permanently deleted ${labelOf(row)}`, id);
      persist();
      emit();
    },

    async duplicate(key, id) {
      const src = coll(key).find((r) => r.id === id);
      if (!src) throw new Error(`${key}/${id} not found`);
      const copy = JSON.parse(JSON.stringify(src)) as Record<string, unknown>;
      const suffix = (v: unknown, s: string) =>
        v && typeof v === "object" && "en" in (v as object)
          ? { ...(v as object), en: `${(v as { en: string }).en}${s}` }
          : typeof v === "string"
            ? `${v}${s}`
            : v;
      for (const k of ["name", "title"]) if (copy[k]) copy[k] = suffix(copy[k], " (Copy)");
      if (typeof copy.slug === "string" && copy.slug) copy.slug = `${slugify(copy.slug)}-copy`;
      const now = nowIso();
      copy.id = newId(ID_PREFIX[key]);
      copy.status = "draft";
      copy.createdAt = now;
      copy.updatedAt = now;
      copy.updatedBy = actor().name;
      copy.isSample = false;
      copy.deletedAt = null;
      const row = copy as unknown as CollectionMap[typeof key];
      setColl(key, [row, ...coll(key)]);
      audit("duplicate", key, `Duplicated ${labelOf(src)}`, copy.id as string);
      persist();
      emit();
      return row;
    },

    async bulkUpdate(key, ids, patch) {
      const set = new Set(ids);
      const now = nowIso();
      const by = actor().name;
      setColl(key, coll(key).map((r) => (set.has(r.id) ? ({ ...r, ...patch, updatedAt: now, updatedBy: by } as typeof r) : r)));
      audit("bulk-update", key, `Bulk updated ${ids.length} item(s) in ${key}`, "", "", snippet(patch));
      persist();
      emit();
    },

    async bulkTrash(key, ids) {
      const set = new Set(ids);
      const now = nowIso();
      setColl(key, coll(key).map((r) => (set.has(r.id) ? ({ ...r, status: "trash" as Status, deletedAt: now } as typeof r) : r)));
      audit("bulk-trash", key, `Moved ${ids.length} item(s) in ${key} to Trash`);
      persist();
      emit();
    },

    async merge(key, fromIds, intoId) {
      const refs = MERGE_REFS[key] ?? [];
      const from = new Set(fromIds.filter((i) => i !== intoId));
      for (const ref of refs) {
        const rows = coll(ref.coll) as unknown as Record<string, unknown>[];
        let changed = false;
        const next = rows.map((row) => {
          const v = row[ref.field];
          if (ref.multi && Array.isArray(v)) {
            if (!v.some((x) => from.has(x as string))) return row;
            changed = true;
            const merged = Array.from(new Set(v.map((x) => (from.has(x as string) ? intoId : x))));
            return { ...row, [ref.field]: merged };
          }
          if (typeof v === "string" && from.has(v)) {
            changed = true;
            return { ...row, [ref.field]: intoId };
          }
          return row;
        });
        if (changed) setColl(ref.coll, next as never);
      }
      const now = nowIso();
      setColl(key, coll(key).map((r) => (from.has(r.id) ? ({ ...r, status: "trash" as Status, deletedAt: now } as typeof r) : r)));
      audit("merge", key, `Merged ${from.size} ${key} item(s) into ${intoId}`, intoId);
      persist();
      emit();
    },

    async clear(key, predicate) {
      const rows = coll(key);
      const kept = predicate ? rows.filter((r) => !predicate(r)) : [];
      setColl(key, kept);
      audit("clear", key, `Cleared ${rows.length - kept.length} row(s) from ${key}`);
      persist();
      emit();
    },

    async saveSingleton(key: SingletonKey, value, summary) {
      const before = state.singletons[key];
      state = { ...state, singletons: { ...state.singletons, [key]: value } };
      audit("update", key, summary ?? `Updated ${key}`, key, snippet(before), snippet(value));
      persist();
      emit();
    },

    async logAction(action, collection, summary, entityId = "") {
      audit(action, collection, summary, entityId);
      persist();
      emit();
    },

    async reset() {
      await seed();
      ready = true;
      audit("reset", "system", "Demo data reset to the seeded set");
      persist();
      emit();
    },
  };

  return adapter;
}
