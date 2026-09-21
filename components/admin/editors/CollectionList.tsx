"use client";

import { useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Archive, Copy, Pencil, Plus, RotateCcw, Trash2, UploadCloud } from "lucide-react";
import { db } from "@/lib/admin/data";
import { useCollection, useDataReady } from "@/lib/admin/data/hooks";
import type { Base, CollectionKey, CollectionMap } from "@/lib/admin/data/types";
import type { Resource } from "@/lib/admin/access/permissions";
import { useCan } from "@/lib/admin/auth/AuthContext";
import { labelOf } from "@/lib/admin/data/defaults";
import { Button } from "../ui/Button";
import { useFeedback } from "../ui/Feedback";
import { PageHeader, type Crumb } from "../ui/PageHeader";
import { DataTable, type BulkAction, type Column, type RowAction, type TableFilter } from "../ui/DataTable";

interface CollectionListProps<K extends CollectionKey> {
  collection: K;
  resource: Resource;
  title: string;
  description?: string;
  singular: string;
  /** Full-page editors: route base ("/admin/products/all"). Rows link to `${base}/${id}`. */
  editBase?: string;
  /** Drawer editors: called instead of navigating. */
  onEdit?: (row: CollectionMap[K]) => void;
  onNew?: () => void;
  columns: Column<CollectionMap[K]>[];
  searchText: (row: CollectionMap[K]) => string;
  filters?: TableFilter<CollectionMap[K]>[];
  exportName?: string;
  crumbs?: Crumb[];
  /** Restrict the rows shown (e.g. contact vs product enquiries). */
  rowFilter?: (row: CollectionMap[K]) => boolean;
  extraRowActions?: (row: CollectionMap[K]) => RowAction<CollectionMap[K]>[];
  extraBulkActions?: BulkAction[];
  headerActions?: ReactNode;
  toolbar?: ReactNode;
  /** Adds Archive to row/bulk actions. */
  archivable?: boolean;
  newLabel?: string;
  /** Hide Publish/Archive actions (collections with no publishing). */
  noPublish?: boolean;
  aboveTable?: ReactNode;
  defaultSort?: { key: string; dir: "asc" | "desc" };
  pageSize?: number;
  /** Show the Draft/Published/... status filter (off for records with no publishing workflow). */
  withStatus?: boolean;
  /** Delete is permanent (after a confirmation) instead of Trash first. */
  hardDelete?: boolean;
}

/** Table screen shared by every collection: search, filters, bulk + row actions, safe delete, CSV export. */
export function CollectionList<K extends CollectionKey>(p: CollectionListProps<K>) {
  const router = useRouter();
  const can = useCan();
  const { toast, confirm } = useFeedback();
  const ready = useDataReady();
  const all = useCollection(p.collection);
  const rows = useMemo(() => (p.rowFilter ? all.filter(p.rowFilter) : all), [all, p.rowFilter]);

  const canCreate = can(p.resource, "create");
  const canEdit = can(p.resource, "edit");
  const canPublish = can(p.resource, "publish") && !p.noPublish;
  const canDelete = can(p.resource, "delete");

  const open = (row: CollectionMap[K]) => {
    if (p.onEdit) p.onEdit(row);
    else if (p.editBase) router.push(`${p.editBase}/${row.id}`);
  };

  async function trash(ids: string[]) {
    const ok = await confirm({
      title: `Move ${ids.length} ${ids.length === 1 ? p.singular : `${p.singular}s`} to Trash?`,
      description: "They will be hidden and can be restored from the Trash filter.",
      confirmLabel: "Move to Trash",
    });
    if (!ok) return;
    await db.bulkTrash(p.collection, ids);
    toast("Moved to Trash.");
  }

  async function purge(row: CollectionMap[K]) {
    const ok = await confirm({
      title: `Permanently delete "${labelOf(row)}"?`,
      description: "This cannot be undone.",
      confirmLabel: "Delete permanently",
      requireText: "DELETE",
    });
    if (!ok) return;
    await db.purge(p.collection, row.id);
    toast("Deleted permanently.");
  }

  async function hardDelete(ids: string[]) {
    const ok = await confirm({
      title: `Delete ${ids.length} ${ids.length === 1 ? p.singular : `${p.singular}s`}?`,
      description: "This cannot be undone.",
      confirmLabel: "Delete",
    });
    if (!ok) return;
    for (const id of ids) await db.purge(p.collection, id);
    toast("Deleted.");
  }

  const rowActions = (row: CollectionMap[K]): RowAction<CollectionMap[K]>[] => {
    const trashed = row.status === "trash";
    if (p.hardDelete) {
      return [
        { label: canEdit ? "Open" : "View", icon: <Pencil className="h-3.5 w-3.5" />, onRun: open },
        ...(p.extraRowActions?.(row) ?? []),
        { label: "Delete", icon: <Trash2 className="h-3.5 w-3.5" />, tone: "danger", hidden: !canDelete, onRun: (r) => hardDelete([r.id]) },
      ];
    }
    return [
      { label: canEdit ? "Edit" : "View", icon: <Pencil className="h-3.5 w-3.5" />, onRun: open, hidden: trashed && !canEdit },
      ...(p.extraRowActions?.(row) ?? []),
      { label: "Duplicate", icon: <Copy className="h-3.5 w-3.5" />, hidden: !canCreate || trashed, onRun: async (r) => { await db.duplicate(p.collection, r.id); toast("Duplicated as a draft."); } },
      { label: row.status === "published" ? "Unpublish (set to draft)" : "Publish", icon: <UploadCloud className="h-3.5 w-3.5" />, hidden: !canPublish || trashed, onRun: async (r) => { await db.setStatus(p.collection, r.id, r.status === "published" ? "draft" : "published"); toast(r.status === "published" ? "Moved to draft." : "Published."); } },
      { label: "Archive", icon: <Archive className="h-3.5 w-3.5" />, hidden: !p.archivable || !canPublish || trashed || row.status === "archived", onRun: async (r) => { await db.setStatus(p.collection, r.id, "archived"); toast("Archived."); } },
      { label: "Move to Trash", icon: <Trash2 className="h-3.5 w-3.5" />, tone: "danger", hidden: !canDelete || trashed, onRun: (r) => trash([r.id]) },
      { label: "Restore", icon: <RotateCcw className="h-3.5 w-3.5" />, hidden: !canDelete || !trashed, onRun: async (r) => { await db.restore(p.collection, r.id); toast("Restored as a draft."); } },
      { label: "Delete permanently", icon: <Trash2 className="h-3.5 w-3.5" />, tone: "danger", hidden: !canDelete || !trashed, onRun: purge },
    ];
  };

  const bulk: BulkAction[] = [
    ...(canPublish
      ? [
          { label: "Publish", icon: <UploadCloud className="h-3.5 w-3.5" />, onRun: async (ids: string[]) => { await db.bulkUpdate(p.collection, ids, { status: "published" } as never); toast(`${ids.length} published.`); } },
          ...(p.archivable ? [{ label: "Archive", icon: <Archive className="h-3.5 w-3.5" />, onRun: async (ids: string[]) => { await db.bulkUpdate(p.collection, ids, { status: "archived" } as never); toast(`${ids.length} archived.`); } }] : []),
        ]
      : []),
    ...(p.extraBulkActions ?? []),
    ...(canDelete ? [{ label: p.hardDelete ? "Delete" : "Move to Trash", icon: <Trash2 className="h-3.5 w-3.5" />, tone: "danger" as const, onRun: p.hardDelete ? hardDelete : trash }] : []),
  ];

  const newHref = p.editBase ? `${p.editBase}/new` : undefined;

  return (
    <>
      <PageHeader
        title={p.title}
        description={p.description}
        crumbs={p.crumbs}
        actions={
          <>
            {p.headerActions}
            {canCreate && (newHref || p.onNew) && (
              <Button variant="primary" icon={<Plus className="h-3.5 w-3.5" />} href={newHref} onClick={p.onNew}>
                {p.newLabel ?? `New ${p.singular}`}
              </Button>
            )}
          </>
        }
      />
      {p.aboveTable}
      {!ready ? (
        <div className="h-64 animate-pulse border border-slate-200 bg-white" aria-label="Loading" />
      ) : (
        <DataTable<CollectionMap[K] & Base>
          rows={rows as (CollectionMap[K] & Base)[]}
          columns={p.columns as Column<CollectionMap[K] & Base>[]}
          searchText={p.searchText as (r: CollectionMap[K] & Base) => string}
          filters={p.filters as TableFilter<CollectionMap[K] & Base>[] | undefined}
          selectable={bulk.length > 0}
          bulkActions={bulk}
          rowActions={rowActions as (r: CollectionMap[K] & Base) => RowAction<CollectionMap[K] & Base>[]}
          onRowClick={open as (r: CollectionMap[K] & Base) => void}
          exportName={p.exportName ?? p.collection}
          toolbar={p.toolbar}
          defaultSort={p.defaultSort}
          pageSize={p.pageSize}
          withStatus={p.withStatus ?? !p.hardDelete}
          emptyTitle={`No ${p.singular}s yet`}
          emptyDescription={canCreate ? `Create the first ${p.singular} to get started.` : undefined}
          emptyAction={canCreate && (newHref || p.onNew) ? <Button variant="primary" href={newHref} onClick={p.onNew} icon={<Plus className="h-3.5 w-3.5" />}>{p.newLabel ?? `New ${p.singular}`}</Button> : undefined}
        />
      )}
    </>
  );
}
