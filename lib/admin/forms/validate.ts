import type { FieldDef } from "./types";
import { getPath } from "./path";

/** Returns { "path": "message" } for every required field that is empty. */
export function validateFields(fields: FieldDef[], record: unknown, prefix = ""): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const f of fields) {
    if (f.type === "group") {
      Object.assign(errors, validateFields(f.fields, record, prefix));
      continue;
    }
    if (f.type === "info" || !("name" in f) || !f.name) continue;
    if (f.when && !f.when((record ?? {}) as Record<string, unknown>)) continue;
    const path = prefix ? `${prefix}.${f.name}` : f.name;
    const value = getPath(record, path);

    if (f.type === "repeater" && Array.isArray(value)) {
      value.forEach((_, i) => Object.assign(errors, validateFields(f.item, record, `${path}.${i}`)));
    }
    if (!("required" in f) || !f.required) continue;

    const empty =
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === "object" && !Array.isArray(value) && "en" in (value as object) && !(value as { en: string }).en.trim());
    if (empty) errors[path] = `${f.label} is required`;
  }
  return errors;
}
