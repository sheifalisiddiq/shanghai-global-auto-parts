/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useRef, useState } from "react";
import { Check, ImageIcon, Search, Upload } from "lucide-react";
import { db } from "@/lib/admin/data";
import { useActiveRows } from "@/lib/admin/data/hooks";
import { cn } from "@/lib/utils/cn";
import { Button } from "../ui/Button";
import { useFeedback } from "../ui/Feedback";
import { Overlay } from "../ui/Overlay";

/** Modal image chooser backed by the Media library (the same library used by Media). */
export function MediaPicker({
  open,
  onClose,
  onPick,
  title = "Choose an image",
}: {
  open: boolean;
  onClose: () => void;
  onPick: (url: string) => void;
  title?: string;
}) {
  const items = useActiveRows("media");
  const { toast } = useFeedback();
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string>("");
  const file = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return items.filter((m) => m.type === "image" && (!s || `${m.name} ${m.title} ${m.alt} ${m.folder}`.toLowerCase().includes(s)));
  }, [items, q]);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    for (const f of Array.from(files)) {
      if (!f.type.startsWith("image/")) {
        toast(`${f.name} is not an image`, "error");
        continue;
      }
      const row = await db.create("media", {
        status: "published",
        name: f.name,
        url: URL.createObjectURL(f),
        type: "image",
        folder: "uploads (this session only)",
        size: f.size,
        alt: "",
        title: f.name.replace(/\.[^.]+$/, ""),
        uploadedBy: "You",
      });
      setSelected(row.url);
    }
    toast("Preview added. Demo uploads are not stored and disappear on reload.", "info");
  }

  return (
    <Overlay
      open={open}
      onClose={onClose}
      title={title}
      description="Pick from the Media library or upload a preview."
      size="xl"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            disabled={!selected}
            onClick={() => {
              onPick(selected);
              setSelected("");
              onClose();
            }}
          >
            Use selected image
          </Button>
        </>
      }
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label className="relative min-w-[12rem] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search media..."
            className="h-9 w-full border border-slate-300 pr-3 pl-9 text-sm outline-none focus:border-brand-red"
          />
        </label>
        <input ref={file} type="file" accept="image/*" multiple hidden onChange={(e) => upload(e.target.files)} />
        <Button icon={<Upload className="h-3.5 w-3.5" />} onClick={() => file.current?.click()}>
          Upload
        </Button>
      </div>
      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-500">No images match.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((m) => {
            const active = selected === m.url;
            return (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => setSelected(m.url)}
                  aria-pressed={active}
                  className={cn("group relative block w-full border bg-slate-50 text-left", active ? "border-brand-red ring-2 ring-brand-red" : "border-slate-200 hover:border-ink")}
                >
                  <span className="flex aspect-square items-center justify-center overflow-hidden bg-[repeating-conic-gradient(#f4f4f5_0%_25%,#fff_0%_50%)] bg-[length:16px_16px]">
                    <img src={m.url} alt={m.alt || m.title} className="max-h-full max-w-full object-contain" loading="lazy" />
                  </span>
                  <span className="block truncate px-2 py-1.5 text-[11px] text-slate-600">{m.name}</span>
                  {active && (
                    <span className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center bg-brand-red text-white">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Overlay>
  );
}

export function ImageThumb({ url, className }: { url: string; className?: string }) {
  return url ? (
    <img src={url} alt="" className={cn("object-contain", className)} />
  ) : (
    <span className={cn("flex items-center justify-center bg-slate-100 text-slate-300", className)}>
      <ImageIcon className="h-5 w-5" />
    </span>
  );
}
