/** Immutable dotted-path helpers for form state ("og.title", "items.2.title"). */

export function getPath(obj: unknown, path: string): unknown {
  if (!path) return obj;
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc === null || acc === undefined) return undefined;
    return (acc as Record<string, unknown>)[key];
  }, obj);
}

export function setPath<T>(obj: T, path: string, value: unknown): T {
  if (!path) return value as T;
  const [head, ...rest] = path.split(".");
  const isIndex = /^\d+$/.test(head);
  const base: unknown = Array.isArray(obj) ? [...obj] : { ...((obj as object) ?? {}) };
  const current = (base as Record<string, unknown>)[head];
  const next = rest.length ? setPath(current ?? (/^\d+$/.test(rest[0]) ? [] : {}), rest.join("."), value) : value;
  if (isIndex && Array.isArray(base)) {
    (base as unknown[])[Number(head)] = next;
  } else {
    (base as Record<string, unknown>)[head] = next;
  }
  return base as T;
}
