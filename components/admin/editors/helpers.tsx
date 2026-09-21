"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { Merge, Plus, Trash2, Upload } from "lucide-react";
import { db } from "@/lib/admin/data";
import { useActiveRows } from "@/lib/admin/data/hooks";
import { labelOf, textOf } from "@/lib/admin/data/defaults";
import type { CollectionKey, CollectionMap } from "@/lib/admin/data/types";
import { csvToObjects } from "@/lib/admin/util/csv";
import { Button } from "../ui/Button";
import { Card, CardBody, CardHeader } from "../ui/Card";
import { useFeedback } from "../ui/Feedback";
import { Overlay } from "../ui/Overlay";
import { Field, Select } from "../fields/inputs";

/* ------------------------------ bulk edit ------------------------------ */

export interface BulkField {
  name: string;
  label: string;
  kind: "select" | "toggle";
  options?: { value: string; label: string }[];
}

/** The PDF's "Bulk Edit": change one field on every selected row. */
export function BulkEditDialog({
  open,
  onClose,
  count,
  fields,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  count: number;
  fields: BulkField[];
  onApply: (patch: Record<string, unknown>) => Promise<void> | void;
}) {
  const [name, setName] = useState(fields[0]?.name ?? "");
  const [value, setValue] = useState("");
  const field = fields.find((f) => f.name === name);
  return (
    <Overlay
      open={open}
      onClose={onClose}
      title={`Bulk edit ${count} item${count === 1 ? "" : "s"}`}
      size="sm"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            disabled={!field}
            onClick={async () => {
              if (!field) return;
              await onApply({ [field.name]: field.kind === "toggle" ? value === "true" : value });
              onClose();
            }}
          >
            Apply
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Field to change">
          <Select
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setValue("");
            }}
          >
            {fields.map((f) => (
              <option key={f.name} value={f.name}>
                {f.label}
              </option>
            ))}
          </Select>
        </Field>
        {field && (
          <Field label="New value">
            <Select value={value} onChange={(e) => setValue(e.target.value)}>
              {field.kind === "toggle" ? (
                <>
                  <option value="">Choose...</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </>
              ) : (
                <>
                  <option value="">None / empty</option>
                  {field.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </>
              )}
            </Select>
          </Field>
        )}
      </div>
    </Overlay>
  );
}

/* -------------------------------- merge -------------------------------- */

/** Taxonomy merge (PDF "Merge"): re-points every reference and trashes the merged terms. */
export function MergeDialog<K extends CollectionKey>({
  open,
  onClose,
  collection,
  ids,
  singular,
}: {
  open: boolean;
  onClose: () => void;
  collection: K;
  ids: string[];
  singular: string;
}) {
  const rows = useActiveRows(collection);
  const { toast } = useFeedback();
  const [target, setTarget] = useState("");
  const options = rows.filter((r) => !ids.includes(r.id));
  return (
    <Overlay
      open={open}
      onClose={onClose}
      title={`Merge ${ids.length} ${singular}${ids.length === 1 ? "" : "s"}`}
      description="Everything assigned to the selected items moves to the item you choose. The selected items are moved to Trash."
      size="sm"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            icon={<Merge className="h-3.5 w-3.5" />}
            disabled={!target}
            onClick={async () => {
              await db.merge(collection, ids, target);
              toast(`Merged into ${labelOf(rows.find((r) => r.id === target))}.`);
              setTarget("");
              onClose();
            }}
          >
            Merge
          </Button>
        </>
      }
    >
      <Field label={`Merge into`}>
        <Select value={target} onChange={(e) => setTarget(e.target.value)}>
          <option value="">Choose {singular}...</option>
          {options.map((r) => (
            <option key={r.id} value={r.id}>
              {labelOf(r)}
            </option>
          ))}
        </Select>
      </Field>
    </Overlay>
  );
}

/* ---------------------------- assign relations ---------------------------- */

/**
 * "Assign ..." panels (Assign Models / Products / Content). Lists the rows of
 * `target` whose `field` points at `currentId`, and lets you add or remove them.
 * Changes are written straight to the data layer.
 */
export function AssignPanel<T extends CollectionKey>({
  title,
  description,
  target,
  field,
  multi,
  currentId,
  singular,
  filter,
}: {
  title: string;
  description?: string;
  target: T;
  field: string;
  /** field holds an id list (true) or a single id (false). */
  multi?: boolean;
  currentId: string | undefined;
  singular: string;
  filter?: (row: CollectionMap[T]) => boolean;
}) {
  const rows = useActiveRows(target);
  const [pick, setPick] = useState("");
  const usable = useMemo(() => (filter ? rows.filter(filter) : rows), [rows, filter]);
  const has = (r: CollectionMap[T]) => {
    const v = (r as unknown as Record<string, unknown>)[field];
    return multi ? Array.isArray(v) && v.includes(currentId) : v === currentId;
  };
  const assigned = usable.filter(has);
  const available = usable.filter((r) => !has(r));

  if (!currentId) {
    return (
      <Card>
        <CardHeader title={title} />
        <CardBody>
          <p className="text-sm text-slate-500">Save this {singular} first, then you can assign items here.</p>
        </CardBody>
      </Card>
    );
  }

  const write = async (row: CollectionMap[T], add: boolean) => {
    const v = (row as unknown as Record<string, unknown>)[field];
    const next = multi
      ? add
        ? [...((v as string[]) ?? []), currentId]
        : ((v as string[]) ?? []).filter((x) => x !== currentId)
      : add
        ? currentId
        : "";
    await db.update(target, row.id, { [field]: next } as never);
  };

  return (
    <Card>
      <CardHeader title={`${title} (${assigned.length})`} description={description} />
      <CardBody className="space-y-3">
        {assigned.length === 0 ? (
          <p className="text-sm text-slate-500">Nothing assigned yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100 border border-slate-200">
            {assigned.map((r) => (
              <li key={r.id} className="flex items-center gap-3 px-3 py-2 text-sm">
                <span className="min-w-0 flex-1 truncate">{textOf((r as unknown as Record<string, unknown>).name ?? (r as unknown as Record<string, unknown>).title)}</span>
                <button type="button" aria-label="Remove" onClick={() => write(r, false)} className="text-slate-400 hover:text-brand-red">
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex gap-2">
          <Select aria-label={`Add ${singular}`} value={pick} onChange={(e) => setPick(e.target.value)} className="max-w-md">
            <option value="">Add {singular}...</option>
            {available.map((r) => (
              <option key={r.id} value={r.id}>
                {labelOf(r)}
              </option>
            ))}
          </Select>
          <Button
            icon={<Plus className="h-3.5 w-3.5" />}
            disabled={!pick}
            onClick={async () => {
              const row = usable.find((r) => r.id === pick);
              if (row) await write(row, true);
              setPick("");
            }}
          >
            Assign
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

/* ------------------------------ CSV import ------------------------------ */

/** Import rows from a CSV file (header row = field names). */
export function CsvImportButton({
  label = "Import CSV",
  hint,
  onRows,
}: {
  label?: string;
  hint?: string;
  onRows: (rows: Record<string, string>[]) => Promise<number> | number;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const { toast } = useFeedback();
  return (
    <>
      <input
        ref={ref}
        type="file"
        accept=".csv,text/csv"
        hidden
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          try {
            const rows = csvToObjects(await file.text());
            if (!rows.length) return toast("The file has no data rows.", "error");
            const n = await onRows(rows);
            toast(`Imported ${n} row(s).`);
          } catch (err) {
            toast((err as Error).message || "Could not read the file", "error");
          }
        }}
      />
      <Button title={hint} icon={<Upload className="h-3.5 w-3.5" />} onClick={() => ref.current?.click()}>
        {label}
      </Button>
    </>
  );
}

/* ------------------------------- hierarchy ------------------------------- */

/** Products > Brand > Model > Product trail (the PDF asks for this hierarchy to stay visible). */
export function HierarchyTrail({ brand, model, product }: { brand?: string; model?: string; product?: string }) {
  const parts = ["Products", brand, model, product].filter(Boolean) as string[];
  return (
    <ol className="flex flex-wrap items-center gap-1.5 text-xs" aria-label="Product hierarchy">
      {parts.map((p, i) => (
        <li key={`${p}-${i}`} className="flex items-center gap-1.5">
          <span className={i === parts.length - 1 ? "font-bold text-ink" : "text-slate-500"}>{p}</span>
          {i < parts.length - 1 && <span className="text-slate-300">›</span>}
        </li>
      ))}
    </ol>
  );
}

export function Row({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-2">{children}</div>;
}
