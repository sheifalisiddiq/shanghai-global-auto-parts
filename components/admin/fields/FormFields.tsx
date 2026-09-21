"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Plus, Trash2, Wand2, X } from "lucide-react";
import { useCollection } from "@/lib/admin/data/hooks";
import { labelOf, loc, slugify, textOf } from "@/lib/admin/data/defaults";
import type { Localized } from "@/lib/admin/data/types";
import { getPath, setPath } from "@/lib/admin/forms/path";
import type { FieldDef, Option, OptionSource } from "@/lib/admin/forms/types";
import { cn } from "@/lib/utils/cn";
import { Button } from "../ui/Button";
import { Collapsible } from "../ui/Collapsible";
import { Field, Select, TextArea, TextInput, Toggle } from "./inputs";
import { ImageField } from "./ImageField";
import { ImageThumb, MediaPicker } from "./MediaPicker";
import { RichTextEditor } from "./RichTextEditor";
import { SortableList } from "./Sortable";

type Rec = Record<string, unknown>;

interface FormFieldsProps {
  fields: FieldDef[];
  value: Rec;
  onChange: (next: Rec) => void;
  readOnly?: boolean;
  errors?: Record<string, string>;
  /** Path of the object these fields belong to ("" = root, "items.2" inside a repeater). */
  basePath?: string;
  /** Two-column layout for short fields. */
  columns?: boolean;
}

export function FormFields({ fields, value, onChange, readOnly, errors = {}, basePath = "", columns }: FormFieldsProps) {
  const scope = (basePath ? getPath(value, basePath) : value) as Rec;
  return (
    <div className={cn(columns ? "grid gap-x-5 gap-y-5 sm:grid-cols-2" : "space-y-5")}>
      {fields.map((f, i) => {
        if (f.when && !f.when(scope ?? {})) return null;
        const wide = f.type === "textarea" || f.type === "richtext" || f.type === "repeater" || f.type === "gallery" || f.type === "group" || f.type === "info" || f.type === "image" || (f.type === "text" && "localized" in f && f.localized);
        return (
          <div key={`${f.type}-${"name" in f ? f.name : ""}-${i}`} className={cn(columns && wide && "sm:col-span-2")}>
            <FieldRenderer field={f} value={value} onChange={onChange} readOnly={readOnly} errors={errors} basePath={basePath} />
          </div>
        );
      })}
    </div>
  );
}

function FieldRenderer({ field: f, value, onChange, readOnly, errors, basePath }: { field: FieldDef } & Omit<FormFieldsProps, "fields" | "columns">) {
  if (f.type === "info") {
    return <p className="border-l-2 border-slate-300 bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-600">{f.text}</p>;
  }
  if (f.type === "group") {
    return (
      <Collapsible title={f.label} defaultOpen={!f.collapsed}>
        <FormFields fields={f.fields} value={value} onChange={onChange} readOnly={readOnly} errors={errors} basePath={basePath} />
      </Collapsible>
    );
  }

  const path = basePath ? `${basePath}.${f.name}` : f.name;
  const current = getPath(value, path);
  const set = (v: unknown) => onChange(setPath(value, path, v));
  const error = errors?.[path];
  const common = { label: f.label, help: f.help, error, required: f.required };

  switch (f.type) {
    case "text":
    case "textarea":
    case "url":
    case "email":
    case "tel":
    case "number":
    case "date":
    case "datetime": {
      const multi = f.type === "textarea";
      const inputType = f.type === "url" ? "text" : f.type === "datetime" ? "datetime-local" : f.type === "textarea" ? "text" : f.type;
      const render = (val: string, setVal: (v: string) => void, rtl = false) => {
        const id = `${path}${rtl ? "-ar" : ""}`;
        return multi ? (
          <TextArea id={id} rows={f.rows ?? 3} value={val} readOnly={readOnly} dir={rtl ? "rtl" : undefined} onChange={(e) => setVal(e.target.value)} placeholder={f.placeholder} />
        ) : (
          <TextInput
            id={id}
            type={inputType}
            value={val}
            readOnly={readOnly}
            dir={rtl ? "rtl" : undefined}
            placeholder={f.placeholder}
            onChange={(e) => setVal(e.target.value)}
          />
        );
      };
      if (f.localized) {
        const l = toLoc(current);
        return (
          <LocalizedControl {...common} value={l} onChange={set} counter={f.max ? (lang) => `${l[lang].length}/${f.max}` : undefined}>
            {(lang) => render(l[lang], (v) => set({ ...l, [lang]: v }), lang === "ar")}
          </LocalizedControl>
        );
      }
      const str = current === undefined || current === null ? "" : String(current);
      const shown = f.type === "datetime" ? isoToLocalInput(str) : str;
      return (
        <Field {...common} htmlFor={path} counter={f.max ? `${str.length}/${f.max}` : undefined}>
          {render(shown, (v) => set(f.type === "number" ? (v === "" ? "" : Number(v)) : f.type === "datetime" ? (v ? new Date(v).toISOString() : "") : v))}
        </Field>
      );
    }

    case "richtext": {
      const l = toLoc(current);
      return (
        <LocalizedControl {...common} value={l} onChange={set} single={!f.localized}>
          {(lang) => (
            <RichTextEditor
              key={`${path}-${lang}`}
              value={l[lang]}
              readOnly={readOnly}
              rtl={lang === "ar"}
              onChange={(html) => set({ ...toLoc(getPath(value, path)), [lang]: html })}
            />
          )}
        </LocalizedControl>
      );
    }

    case "select":
      return (
        <Field {...common} htmlFor={path}>
          <SelectControl id={path} value={String(current ?? "")} onChange={set} readOnly={readOnly} options={f.options} source={f.optionsFrom} allowEmpty={f.allowEmpty ?? !!f.optionsFrom} />
        </Field>
      );

    case "multiselect":
      return (
        <Field {...common}>
          <MultiSelectControl value={(current as string[]) ?? []} onChange={set} readOnly={readOnly} options={f.options} source={f.optionsFrom} />
        </Field>
      );

    case "toggle":
      return <Toggle checked={!!current} onChange={set} label={f.label} help={f.help} disabled={readOnly} />;

    case "image":
      return <ImageField label={f.label} help={f.help} value={String(current ?? "")} onChange={set} readOnly={readOnly} error={error} required={f.required} />;

    case "gallery":
      return (
        <Field {...common}>
          <GalleryControl value={(current as { url: string; alt: Localized }[]) ?? []} onChange={set} readOnly={readOnly} />
        </Field>
      );

    case "strings":
      return (
        <Field {...common}>
          <StringsControl value={(current as string[]) ?? []} onChange={set} readOnly={readOnly} placeholder={f.placeholder} />
        </Field>
      );

    case "slug": {
      const str = String(current ?? "");
      return (
        <Field {...common} htmlFor={path}>
          <div className="flex gap-2">
            <TextInput id={path} value={str} readOnly={readOnly} onChange={(e) => set(e.target.value.toLowerCase().replace(/s+/g, "-").replace(/[^a-z0-9-]/g, ""))} placeholder="url-friendly-name" />
            {!readOnly && (
              <Button icon={<Wand2 className="h-3.5 w-3.5" />} onClick={() => set(slugify(textOf(getPath(value, basePath ? `${basePath}.${f.from}` : f.from))))}>
                From {f.from === "name" ? "name" : "title"}
              </Button>
            )}
          </div>
        </Field>
      );
    }

    case "repeater":
      return (
        <Field {...common}>
          <RepeaterControl def={f} path={path} value={value} onChange={onChange} readOnly={readOnly} errors={errors ?? {}} />
        </Field>
      );
  }
}

function isoToLocalInput(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/* --------------------------- localized wrapper --------------------------- */

export function toLoc(v: unknown): Localized {
  if (v && typeof v === "object" && "en" in (v as object)) {
    const l = v as Partial<Localized>;
    return { en: l.en ?? "", ar: l.ar ?? "" };
  }
  return loc(typeof v === "string" ? v : "");
}

export function LocalizedControl({
  label,
  help,
  error,
  required,
  value,
  children,
  counter,
  single,
}: {
  label: string;
  help?: string;
  error?: string;
  required?: boolean;
  value: Localized;
  onChange: (v: Localized) => void;
  children: (lang: "en" | "ar") => React.ReactNode;
  counter?: (lang: "en" | "ar") => string;
  /** Not localized (English only): no tabs. */
  single?: boolean;
}) {
  const [lang, setLang] = useState<"en" | "ar">("en");
  if (single) {
    return (
      <Field label={label} help={help} error={error} required={required}>
        {children("en")}
      </Field>
    );
  }
  return (
    <Field label={label} help={help} error={error} required={required} counter={counter?.(lang)}>
      <div role="tablist" aria-label={`${label} language`} className="mb-1.5 inline-flex border border-slate-200">
        {(["en", "ar"] as const).map((l) => {
          const missing = !value[l].trim();
          return (
            <button
              key={l}
              type="button"
              role="tab"
              aria-selected={lang === l}
              onClick={() => setLang(l)}
              className={cn("flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold tracking-wider uppercase", lang === l ? "bg-ink text-white" : "text-slate-500 hover:text-ink")}
            >
              {l === "en" ? "English" : "العربية"}
              {missing && l === "ar" && <span title="Arabic missing" className="h-1.5 w-1.5 rounded-full bg-amber-400" />}
            </button>
          );
        })}
      </div>
      {children(lang)}
    </Field>
  );
}

/* ------------------------------ option lists ------------------------------ */

export function useOptionList(source: OptionSource | undefined): Option[] {
  const rows = useCollection(source ?? "brands");
  const brands = useCollection("brands");
  return useMemo(() => {
    if (!source) return [];
    const brandName = new Map(brands.map((b) => [b.id, textOf(b.name)]));
    return (rows as unknown as readonly (Rec & { id: string; status: string })[])
      .filter((r) => r.status !== "trash")
      .map((r) => {
        let label = labelOf(r);
        if (source === "models") label = `${brandName.get(String(r.brandId)) ?? "?"}: ${label}`;
        if (source === "products") label = `${label} (${String(r.sku ?? "")})`;
        return { value: r.id, label };
      })
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [rows, brands, source]);
}

function SelectControl({
  id,
  value,
  onChange,
  options,
  source,
  readOnly,
  allowEmpty,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options?: Option[];
  source?: OptionSource;
  readOnly?: boolean;
  allowEmpty?: boolean;
}) {
  const fromData = useOptionList(source);
  const list = options ?? fromData;
  return (
    <Select id={id} value={value} disabled={readOnly} onChange={(e) => onChange(e.target.value)}>
      {allowEmpty && <option value="">None</option>}
      {list.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </Select>
  );
}

function MultiSelectControl({
  value,
  onChange,
  options,
  source,
  readOnly,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  options?: Option[];
  source?: OptionSource;
  readOnly?: boolean;
}) {
  const fromData = useOptionList(source);
  const list = options ?? fromData;
  const label = (v: string) => list.find((o) => o.value === v)?.label ?? v;
  const remaining = list.filter((o) => !value.includes(o.value));
  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {value.map((v) => (
            <li key={v} className="flex items-center gap-1 border border-slate-200 bg-slate-50 py-1 pr-1 pl-2 text-xs text-ink">
              {label(v)}
              {!readOnly && (
                <button type="button" aria-label={`Remove ${label(v)}`} onClick={() => onChange(value.filter((x) => x !== v))} className="flex h-5 w-5 items-center justify-center text-slate-400 hover:text-brand-red">
                  <X className="h-3 w-3" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {!readOnly && (
        <Select
          aria-label="Add"
          value=""
          onChange={(e) => e.target.value && onChange([...value, e.target.value])}
          className="max-w-md"
        >
          <option value="">{remaining.length ? "Add..." : "Nothing left to add"}</option>
          {remaining.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      )}
    </div>
  );
}

function StringsControl({ value, onChange, readOnly, placeholder }: { value: string[]; onChange: (v: string[]) => void; readOnly?: boolean; placeholder?: string }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const parts = draft
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length) onChange(Array.from(new Set([...value, ...parts])));
    setDraft("");
  };
  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {value.map((v) => (
            <li key={v} className="flex items-center gap-1 border border-slate-200 bg-slate-50 py-1 pr-1 pl-2 text-xs text-ink">
              {v}
              {!readOnly && (
                <button type="button" aria-label={`Remove ${v}`} onClick={() => onChange(value.filter((x) => x !== v))} className="flex h-5 w-5 items-center justify-center text-slate-400 hover:text-brand-red">
                  <X className="h-3 w-3" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {!readOnly && (
        <div className="flex gap-2">
          <TextInput
            value={draft}
            placeholder={placeholder ?? "Type and press Enter (comma separates several)"}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
          />
          <Button icon={<Plus className="h-3.5 w-3.5" />} onClick={add}>
            Add
          </Button>
        </div>
      )}
    </div>
  );
}

function GalleryControl({ value, onChange, readOnly }: { value: { url: string; alt: Localized }[]; onChange: (v: { url: string; alt: Localized }[]) => void; readOnly?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-2">
      {value.length === 0 && <p className="text-xs text-slate-500">No images yet.</p>}
      <SortableList
        items={value}
        onChange={onChange}
        disabled={readOnly}
        renderRow={(item, i, controls) => (
          <div className="flex items-center gap-3 border border-slate-200 bg-white p-2">
            {controls}
            <ImageThumb url={item.url} className="h-14 w-14 shrink-0 border border-slate-200" />
            <div className="min-w-0 flex-1">
              <TextInput
                aria-label="Image ALT text"
                placeholder="ALT text (English)"
                value={item.alt.en}
                readOnly={readOnly}
                className="h-9"
                onChange={(e) => onChange(value.map((g, j) => (j === i ? { ...g, alt: { ...g.alt, en: e.target.value } } : g)))}
              />
            </div>
            {!readOnly && (
              <button type="button" aria-label="Remove image" onClick={() => onChange(value.filter((_, j) => j !== i))} className="flex h-8 w-8 items-center justify-center text-slate-400 hover:text-brand-red">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      />
      {!readOnly && (
        <Button icon={<Plus className="h-3.5 w-3.5" />} onClick={() => setOpen(true)}>
          Add image
        </Button>
      )}
      <MediaPicker open={open} onClose={() => setOpen(false)} onPick={(url) => onChange([...value, { url, alt: loc("") }])} title="Add to gallery" />
    </div>
  );
}

function blankFor(fields: FieldDef[]): Rec {
  const out: Rec = {};
  for (const f of fields) {
    if (f.type === "group") Object.assign(out, blankFor(f.fields));
    if (f.type === "info" || !("name" in f) || !f.name) continue;
    switch (f.type) {
      case "toggle":
        out[f.name] = false;
        break;
      case "multiselect":
      case "strings":
      case "gallery":
      case "repeater":
        out[f.name] = [];
        break;
      case "text":
      case "textarea":
      case "richtext":
        out[f.name] = "localized" in f && f.localized ? loc("") : "";
        break;
      default:
        out[f.name] = "";
    }
  }
  return out;
}

function RepeaterControl({
  def,
  path,
  value,
  onChange,
  readOnly,
  errors,
}: {
  def: Extract<FieldDef, { type: "repeater" }>;
  path: string;
  value: Rec;
  onChange: (next: Rec) => void;
  readOnly?: boolean;
  errors: Record<string, string>;
}) {
  const items = (getPath(value, path) as Rec[] | undefined) ?? [];
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const setItems = (next: Rec[]) => onChange(setPath(value, path, next));
  const isOpen = (i: number) => open[i] ?? items.length <= 3;

  return (
    <div className="space-y-2">
      {items.length === 0 && <p className="text-xs text-slate-500">Nothing added yet.</p>}
      <SortableList
        items={items}
        onChange={setItems}
        disabled={readOnly}
        renderRow={(item, i, controls) => {
          const title = def.titleKey ? textOf(item[def.titleKey]) : "";
          const expanded = isOpen(i);
          return (
            <div className="border border-slate-200 bg-white">
              <div className="flex items-center gap-1 pr-2">
                {controls}
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => setOpen((o) => ({ ...o, [i]: !isOpen(i) }))}
                  className="flex min-w-0 flex-1 items-center gap-2 py-2.5 pl-1 text-left"
                >
                  <span className="text-[11px] font-bold text-slate-400">{i + 1}</span>
                  <span className="truncate text-sm font-semibold text-ink">{title || `${def.label} item`}</span>
                  <ChevronDown className={cn("ml-auto h-4 w-4 shrink-0 text-slate-400 transition-transform", expanded && "rotate-180")} />
                </button>
                {!readOnly && (
                  <button type="button" aria-label="Remove item" onClick={() => setItems(items.filter((_, j) => j !== i))} className="flex h-8 w-8 items-center justify-center text-slate-400 hover:text-brand-red">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              {expanded && (
                <div className="border-t border-slate-100 p-4">
                  <FormFields fields={def.item} value={value} onChange={onChange} readOnly={readOnly} errors={errors} basePath={`${path}.${i}`} />
                </div>
              )}
            </div>
          );
        }}
      />
      {!readOnly && (!def.max || items.length < def.max) && (
        <Button icon={<Plus className="h-3.5 w-3.5" />} onClick={() => setItems([...items, blankFor(def.item)])}>
          {def.addLabel ?? "Add item"}
        </Button>
      )}
    </div>
  );
}
