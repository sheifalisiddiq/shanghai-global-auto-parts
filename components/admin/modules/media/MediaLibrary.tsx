/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useRef, useState } from "react";
import { LayoutGrid, List, Search, Trash2, Upload } from "lucide-react";
import { db } from "@/lib/admin/data";
import { useCollection, useDataReady } from "@/lib/admin/data/hooks";
import type { MediaItem } from "@/lib/admin/data/types";
import { useCan } from "@/lib/admin/auth/AuthContext";
import { cn } from "@/lib/utils/cn";
import { Badge, SampleBadge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import { EmptyState } from "../../ui/Card";
import { useFeedback } from "../../ui/Feedback";
import { Overlay } from "../../ui/Overlay";
import { PageHeader } from "../../ui/PageHeader";
import { Field, Select, TextInput } from "../../fields/inputs";

const bytes = (n: number) => (n ? (n > 1_000_000 ? `${(n / 1_000_000).toFixed(1)} MB` : `${Math.round(n / 1000)} KB`) : "-");

/**
 * Media library. Not defined as a module by the PDF beyond image + ALT-text
 * fields; provided as a design decision because several roles need it.
 * Demo: uploads are previews only (object URLs) and are not stored.
 */
export function MediaLibrary() {
  const ready = useDataReady();
  const all = useCollection("media");
  const can = useCan();
  const { toast, confirm } = useFeedback();
  const [q, setQ] = useState("");
  const [folder, setFolder] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [openId, setOpenId] = useState<string | null>(null);
  const file = useRef<HTMLInputElement>(null);
  const canCreate = can("media", "create");

  const items = useMemo(() => all.filter((m) => m.status !== "trash"), [all]);
  const folders = useMemo(() => Array.from(new Set(items.map((m) => m.folder))).sort(), [items]);
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return items.filter((m) => (!folder || m.folder === folder) && (!s || `${m.name} ${m.title} ${m.alt}`.toLowerCase().includes(s)));
  }, [items, q, folder]);
  const open = items.find((m) => m.id === openId) ?? null;

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    let n = 0;
    for (const f of Array.from(files)) {
      const type = f.type.startsWith("image/") ? "image" : f.type.startsWith("video/") ? "video" : "document";
      await db.create("media", {
        status: "published",
        name: f.name,
        url: URL.createObjectURL(f),
        type,
        folder: "uploads (this session only)",
        size: f.size,
        alt: "",
        title: f.name.replace(/\.[^.]+$/, ""),
        uploadedBy: "You",
      });
      n++;
    }
    toast(`${n} file(s) added as previews. Demo uploads are not stored and disappear on reload.`, "info");
  }

  return (
    <>
      <PageHeader
        title="Media"
        description="Images used across the site. ALT text helps accessibility and SEO."
        actions={
          canCreate && (
            <>
              <input ref={file} type="file" accept="image/*,video/*,application/pdf" multiple hidden onChange={(e) => { void upload(e.target.files); e.target.value = ""; }} />
              <Button variant="primary" icon={<Upload className="h-3.5 w-3.5" />} onClick={() => file.current?.click()}>
                Upload
              </Button>
            </>
          )
        }
      />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label className="relative min-w-[12rem] flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search media..." aria-label="Search media" className="h-9 w-full border border-slate-300 bg-white pr-3 pl-9 text-sm outline-none focus:border-brand-red" />
        </label>
        <select aria-label="Folder" value={folder} onChange={(e) => setFolder(e.target.value)} className="h-9 max-w-[14rem] border border-slate-300 bg-white px-2 text-sm outline-none focus:border-brand-red">
          <option value="">All folders</option>
          {folders.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
        <div className="ml-auto inline-flex border border-slate-200 bg-white">
          {(["grid", "list"] as const).map((v) => (
            <button key={v} type="button" aria-label={`${v} view`} aria-pressed={view === v} onClick={() => setView(v)} className={cn("flex h-9 w-9 items-center justify-center", view === v ? "bg-ink text-white" : "text-slate-500 hover:text-ink")}>
              {v === "grid" ? <LayoutGrid className="h-4 w-4" /> : <List className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </div>

      {!ready ? (
        <div className="h-64 animate-pulse border border-slate-200 bg-white" />
      ) : filtered.length === 0 ? (
        <div className="border border-slate-200 bg-white">
          <EmptyState title="No media found" description="Try a different search or folder." />
        </div>
      ) : view === "grid" ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {filtered.map((m) => (
            <li key={m.id}>
              <button type="button" onClick={() => setOpenId(m.id)} className="group block w-full border border-slate-200 bg-white text-left transition-colors hover:border-ink">
                <span className="flex aspect-square items-center justify-center overflow-hidden bg-[repeating-conic-gradient(#f4f4f5_0%_25%,#fff_0%_50%)] bg-[length:16px_16px]">
                  {m.type === "image" ? <img src={m.url} alt={m.alt || m.title} className="max-h-full max-w-full object-contain" loading="lazy" /> : <Badge>{m.type}</Badge>}
                </span>
                <span className="block truncate px-2 pt-1.5 text-xs font-semibold text-ink">{m.name}</span>
                <span className="block truncate px-2 pb-1.5 text-[11px] text-slate-500">{m.alt ? "ALT set" : "No ALT text"}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="overflow-x-auto border border-slate-200 bg-white">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} onClick={() => setOpenId(m.id)} className="cursor-pointer border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="w-16 p-2">{m.type === "image" ? <img src={m.url} alt="" className="h-10 w-10 object-contain" /> : <Badge>{m.type}</Badge>}</td>
                  <td className="p-2 font-semibold text-ink">{m.name}</td>
                  <td className="p-2 text-slate-500">{m.folder}</td>
                  <td className="p-2 text-slate-500">{bytes(m.size)}</td>
                  <td className="p-2 text-slate-500">{m.alt ? "ALT set" : "No ALT text"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <MediaDetail
          key={open.id}
          item={open}
          canEdit={can("media", "edit")}
          canDelete={can("media", "delete")}
          onClose={() => setOpenId(null)}
          onDelete={async () => {
            const ok = await confirm({ title: `Delete "${open.name}"?`, description: "Pages that use this image will show a broken image until it is replaced.", confirmLabel: "Delete" });
            if (!ok) return;
            await db.purge("media", open.id);
            toast("Media deleted.");
            setOpenId(null);
          }}
        />
      )}
    </>
  );
}

function MediaDetail({ item, canEdit, canDelete, onClose, onDelete }: { item: MediaItem; canEdit: boolean; canDelete: boolean; onClose: () => void; onDelete: () => void }) {
  const { toast } = useFeedback();
  const [alt, setAlt] = useState(item.alt);
  const [title, setTitle] = useState(item.title);
  return (
    <Overlay
      open
      onClose={onClose}
      variant="drawer"
      title={item.name}
      description={item.isSample ? <SampleBadge /> : undefined}
      footer={
        <>
          {canDelete && (
            <Button variant="danger" icon={<Trash2 className="h-3.5 w-3.5" />} onClick={onDelete}>
              Delete
            </Button>
          )}
          <span className="flex-1" />
          <Button onClick={onClose}>Close</Button>
          {canEdit && (
            <Button variant="primary" onClick={async () => { await db.update("media", item.id, { alt, title }); toast("Media details saved."); onClose(); }}>
              Save
            </Button>
          )}
        </>
      }
    >
      {item.type === "image" && (
        <div className="mb-5 flex max-h-72 items-center justify-center overflow-hidden border border-slate-200 bg-[repeating-conic-gradient(#f4f4f5_0%_25%,#fff_0%_50%)] bg-[length:16px_16px]">
          <img src={item.url} alt={alt || title} className="max-h-72 object-contain" />
        </div>
      )}
      <div className="space-y-4">
        <Field label="ALT text" help="Describe the image for people using screen readers and for search engines.">
          <TextInput value={alt} readOnly={!canEdit} onChange={(e) => setAlt(e.target.value)} />
        </Field>
        <Field label="Title">
          <TextInput value={title} readOnly={!canEdit} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="URL">
          <TextInput value={item.url} readOnly />
        </Field>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <Field label="Folder"><Select disabled value={item.folder}><option>{item.folder}</option></Select></Field>
          <Field label="Size"><p className="pt-2 text-ink">{bytes(item.size)}</p></Field>
        </div>
      </div>
    </Overlay>
  );
}
