"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Download, MoreHorizontal, Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { downloadText, toCsv } from "@/lib/admin/util/csv";
import type { Status } from "@/lib/admin/data/types";
import { SampleBadge } from "./Badge";
import { Button } from "./Button";
import { EmptyState } from "./Card";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  /** Enables sorting and (unless `csv` is set) CSV export. */
  value?: (row: T) => string | number | boolean | null | undefined;
  csv?: (row: T) => string | number | boolean | null | undefined;
  className?: string;
  /** Skipped from the CSV export. */
  noCsv?: boolean;
}

export interface TableFilter<T> {
  key: string;
  label: string;
  options: { value: string; label: string }[];
  match: (row: T, value: string) => boolean;
}

export interface RowAction<T> {
  label: string;
  icon?: ReactNode;
  tone?: "danger";
  hidden?: boolean;
  onRun: (row: T) => void | Promise<void>;
}

export interface BulkAction {
  label: string;
  icon?: ReactNode;
  tone?: "danger";
  onRun: (ids: string[]) => void | Promise<void>;
}

interface Row {
  id: string;
  status?: Status;
  isSample?: boolean;
}

interface DataTableProps<T extends Row> {
  rows: readonly T[];
  columns: Column<T>[];
  searchText?: (row: T) => string;
  searchPlaceholder?: string;
  filters?: TableFilter<T>[];
  /** Adds a Status filter (hides Trash unless chosen). Default: on when rows have a status. */
  withStatus?: boolean;
  pageSize?: number;
  selectable?: boolean;
  bulkActions?: BulkAction[];
  rowActions?: (row: T) => RowAction<T>[];
  onRowClick?: (row: T) => void;
  toolbar?: ReactNode;
  exportName?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  defaultSort?: { key: string; dir: "asc" | "desc" };
}

const STATUSES: Status[] = ["draft", "published", "scheduled", "archived", "trash"];

export function DataTable<T extends Row>({
  rows,
  columns,
  searchText,
  searchPlaceholder = "Search...",
  filters = [],
  withStatus,
  pageSize = 15,
  selectable,
  bulkActions = [],
  rowActions,
  onRowClick,
  toolbar,
  exportName,
  emptyTitle = "Nothing here yet",
  emptyDescription,
  emptyAction,
  defaultSort,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("active");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(defaultSort ?? null);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const hasStatus = withStatus ?? rows.some((r) => r.status !== undefined);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = rows.filter((r) => {
      if (hasStatus) {
        if (status === "active" ? r.status === "trash" : r.status !== status) return false;
      }
      if (q && searchText && !searchText(r).toLowerCase().includes(q)) return false;
      for (const f of filters) {
        const v = filterValues[f.key];
        if (v && !f.match(r, v)) return false;
      }
      return true;
    });
    if (sort) {
      const col = columns.find((c) => c.key === sort.key);
      if (col?.value) {
        const get = col.value;
        out = [...out].sort((a, b) => {
          const av = get(a) ?? "";
          const bv = get(b) ?? "";
          const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv), undefined, { numeric: true });
          return sort.dir === "asc" ? cmp : -cmp;
        });
      }
    }
    return out;
  }, [rows, query, status, filterValues, sort, hasStatus, searchText, filters, columns]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pages - 1);
  const visible = filtered.slice(safePage * pageSize, safePage * pageSize + pageSize);
  const selectedIds = useMemo(() => [...selected].filter((id) => rows.some((r) => r.id === id)), [selected, rows]);
  const allOnPage = visible.length > 0 && visible.every((r) => selected.has(r.id));

  const resetPage = () => setPage(0);

  function exportCsv() {
    const cols = columns.filter((c) => !c.noCsv && (c.csv || c.value));
    const anySample = filtered.some((r) => r.isSample);
    const headers = [...cols.map((c) => c.header), ...(anySample ? ["Sample"] : [])];
    const data = filtered.map((r) => [
      ...cols.map((c) => (c.csv ? c.csv(r) : c.value?.(r))),
      ...(anySample ? [r.isSample ? "Sample" : ""] : []),
    ]);
    downloadText(`${exportName ?? "export"}.csv`, toCsv(headers, data));
  }

  return (
    <div className="border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 p-3">
        {searchText && (
          <label className="relative min-w-[12rem] flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                resetPage();
              }}
              placeholder={searchPlaceholder}
              aria-label="Search"
              className="h-9 w-full border border-slate-300 pr-3 pl-9 text-sm outline-none focus:border-brand-red"
            />
          </label>
        )}
        {hasStatus && (
          <select
            aria-label="Status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              resetPage();
            }}
            className="h-9 border border-slate-300 bg-white px-2 text-sm outline-none focus:border-brand-red"
          >
            <option value="active">All (except Trash)</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s[0].toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        )}
        {filters.map((f) => (
          <select
            key={f.key}
            aria-label={f.label}
            value={filterValues[f.key] ?? ""}
            onChange={(e) => {
              setFilterValues((v) => ({ ...v, [f.key]: e.target.value }));
              resetPage();
            }}
            className="h-9 max-w-[11rem] border border-slate-300 bg-white px-2 text-sm outline-none focus:border-brand-red"
          >
            <option value="">{f.label}: all</option>
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ))}
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {toolbar}
          {exportName && (
            <Button size="sm" icon={<Download className="h-3.5 w-3.5" />} onClick={exportCsv}>
              Export
            </Button>
          )}
        </div>
      </div>

      {selectable && selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2">
          <span className="text-xs font-semibold text-ink">{selectedIds.length} selected</span>
          {bulkActions.map((a) => (
            <Button
              key={a.label}
              size="sm"
              variant={a.tone === "danger" ? "danger" : "subtle"}
              icon={a.icon}
              onClick={async () => {
                await a.onRun(selectedIds);
                setSelected(new Set());
              }}
            >
              {a.label}
            </Button>
          ))}
          <button type="button" className="ml-auto text-xs text-slate-500 hover:text-ink" onClick={() => setSelected(new Set())}>
            Clear selection
          </button>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] tracking-[0.12em] text-slate-500 uppercase">
                {selectable && (
                  <th className="w-10 px-3 py-2.5">
                    <input
                      type="checkbox"
                      aria-label="Select all on this page"
                      checked={allOnPage}
                      onChange={(e) =>
                        setSelected((s) => {
                          const n = new Set(s);
                          visible.forEach((r) => (e.target.checked ? n.add(r.id) : n.delete(r.id)));
                          return n;
                        })
                      }
                    />
                  </th>
                )}
                {columns.map((c) => (
                  <th key={c.key} className={cn("px-3 py-2.5 font-semibold", c.className)}>
                    {c.value ? (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 uppercase hover:text-ink"
                        onClick={() =>
                          setSort((s) => (s?.key === c.key ? { key: c.key, dir: s.dir === "asc" ? "desc" : "asc" } : { key: c.key, dir: "asc" }))
                        }
                      >
                        {c.header}
                        {sort?.key === c.key && (sort.dir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                      </button>
                    ) : (
                      c.header
                    )}
                  </th>
                ))}
                {rowActions && <th className="w-10 px-3 py-2.5" aria-label="Actions" />}
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-slate-100 last:border-0 hover:bg-slate-50/70",
                    onRowClick && "cursor-pointer",
                    row.status === "trash" && "opacity-60",
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        aria-label="Select row"
                        checked={selected.has(row.id)}
                        onChange={(e) =>
                          setSelected((s) => {
                            const n = new Set(s);
                            if (e.target.checked) n.add(row.id);
                            else n.delete(row.id);
                            return n;
                          })
                        }
                      />
                    </td>
                  )}
                  {columns.map((c, i) => (
                    <td key={c.key} className={cn("px-3 py-2.5 align-middle", c.className)}>
                      <div className="flex flex-wrap items-center gap-2">
                        {c.render ? c.render(row) : String(c.value?.(row) ?? "")}
                        {i === 0 && row.isSample && <SampleBadge />}
                      </div>
                    </td>
                  ))}
                  {rowActions && (
                    <td className="px-3 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <RowMenu actions={rowActions(row).filter((a) => !a.hidden)} row={row} />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 px-3 py-2 text-xs text-slate-500">
        <span>
          {filtered.length === 0 ? "0 results" : `${safePage * pageSize + 1}-${Math.min(filtered.length, (safePage + 1) * pageSize)} of ${filtered.length}`}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous page"
            disabled={safePage === 0}
            onClick={() => setPage(safePage - 1)}
            className="flex h-8 w-8 items-center justify-center hover:bg-slate-100 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="px-2">
            Page {safePage + 1} / {pages}
          </span>
          <button
            type="button"
            aria-label="Next page"
            disabled={safePage >= pages - 1}
            onClick={() => setPage(safePage + 1)}
            className="flex h-8 w-8 items-center justify-center hover:bg-slate-100 disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function RowMenu<T>({ actions, row }: { actions: RowAction<T>[]; row: T }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);
  if (!actions.length) return null;
  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        type="button"
        aria-label="Row actions"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 w-8 items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-ink"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <ul className="absolute right-0 z-30 mt-1 w-48 border border-slate-200 bg-white py-1 shadow-lg">
          {actions.map((a) => (
            <li key={a.label}>
              <button
                type="button"
                onClick={async () => {
                  setOpen(false);
                  await a.onRun(row);
                }}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] hover:bg-slate-50",
                  a.tone === "danger" ? "text-brand-red" : "text-ink",
                )}
              >
                {a.icon}
                {a.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

