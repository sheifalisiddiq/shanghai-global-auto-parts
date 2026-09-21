"use client";

import { useRef, useState } from "react";
import { Copy, Download, Eye, History, Play, Power, RotateCcw, ShieldCheck, Upload } from "lucide-react";
import { db } from "@/lib/admin/data";
import { useSingleton } from "@/lib/admin/data/hooks";
import { nowIso } from "@/lib/admin/data/defaults";
import type { Backup, CodeSnippet, Plugin } from "@/lib/admin/data/types";
import { downloadText } from "@/lib/admin/util/csv";
import { useAuth, useCan } from "@/lib/admin/auth/AuthContext";
import { cn } from "@/lib/utils/cn";
import { CollectionList } from "../../editors/CollectionList";
import { Field, Select, TextArea, TextInput, Toggle } from "../../fields/inputs";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import { Card, CardBody, CardHeader } from "../../ui/Card";
import { useFeedback } from "../../ui/Feedback";
import { Overlay } from "../../ui/Overlay";
import { PageHeader } from "../../ui/PageHeader";

const fmt = (iso: string) => (iso ? new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "Never");

/* ------------------------- Code / script manager ------------------------- */

const CODE_TYPES: { value: CodeSnippet["codeType"]; label: string }[] = [
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "javascript", label: "JavaScript" },
  { value: "approved", label: "Approved snippet" },
];
const PLACEMENTS: { value: CodeSnippet["placement"]; label: string }[] = [
  { value: "header", label: "Header" },
  { value: "before-body-close", label: "Before </body>" },
  { value: "footer", label: "Footer" },
  { value: "page-specific", label: "Page-specific" },
];

/** Static checks only. Code is NEVER executed in the admin. */
function validateCode(type: CodeSnippet["codeType"], code: string): { ok: boolean; message: string } {
  if (!code.trim()) return { ok: false, message: "The snippet is empty." };
  if (type === "javascript") {
    try {
      // Parses only (Function constructor is not called), so nothing runs.
      new Function(code);
      return { ok: true, message: "JavaScript syntax looks valid." };
    } catch (e) {
      return { ok: false, message: `Syntax error: ${(e as Error).message}` };
    }
  }
  if (type === "css") {
    const open = (code.match(/{/g) ?? []).length;
    const close = (code.match(/}/g) ?? []).length;
    return open === close ? { ok: true, message: "CSS braces are balanced." } : { ok: false, message: `Unbalanced braces: ${open} "{" vs ${close} "}".` };
  }
  const doc = new DOMParser().parseFromString(code, "text/html");
  return doc.querySelector("parsererror") ? { ok: false, message: "The HTML could not be parsed." } : { ok: true, message: "HTML parsed without errors." };
}

interface CodeDraft {
  id?: string;
  name: string;
  description: string;
  codeType: CodeSnippet["codeType"];
  placement: CodeSnippet["placement"];
  scope: CodeSnippet["scope"];
  scopeTargets: string;
  code: string;
  enabled: boolean;
}

const blankCode: CodeDraft = { name: "", description: "", codeType: "javascript", placement: "header", scope: "site-wide", scopeTargets: "", code: "", enabled: false };

export function CodeManagerScreen() {
  const can = useCan();
  const { session } = useAuth();
  const { toast, confirm } = useFeedback();
  const [draft, setDraft] = useState<CodeDraft | null>(null);
  const [preview, setPreview] = useState<CodeSnippet | null>(null);
  const [history, setHistory] = useState<CodeSnippet | null>(null);
  const [check, setCheck] = useState<{ ok: boolean; message: string } | null>(null);
  const file = useRef<HTMLInputElement>(null);
  const canEdit = can("code", "edit");
  const canManage = can("code", "manage");

  async function save() {
    if (!draft) return;
    if (!draft.name.trim() || !draft.code.trim()) return toast("Name and code are required.", "error");
    const v = validateCode(draft.codeType, draft.code);
    const validation = v.ok ? "valid" : "invalid";
    if (draft.id) {
      const prev = db.collection("snippets").find((s) => s.id === draft.id);
      const changed = prev && prev.code !== draft.code;
      const version = changed ? (prev?.version ?? 1) + 1 : (prev?.version ?? 1);
      const history = changed && prev ? [...prev.history, { version, at: nowIso(), by: session?.name ?? "You", code: draft.code }].slice(-10) : (prev?.history ?? []);
      await db.update("snippets", draft.id, { ...draft, version, history, validation } as never);
    } else {
      await db.create("snippets", {
        ...draft,
        status: "published",
        version: 1,
        author: session?.name ?? "You",
        validation,
        history: [{ version: 1, at: nowIso(), by: session?.name ?? "You", code: draft.code }],
      } as never);
    }
    toast("Snippet saved.");
    setDraft(null);
    setCheck(null);
  }

  return (
    <>
      <CollectionList
        collection="snippets"
        resource="code"
        title="Code / Script Manager"
        description="Add approved HTML, CSS or JavaScript to the site. Code is stored as text and is never executed inside the admin."
        singular="snippet"
        crumbs={[{ label: "Technical" }]}
        hardDelete
        newLabel="Add Code"
        onNew={() => { setCheck(null); setDraft(blankCode); }}
        onEdit={(r) => { setCheck(null); setDraft({ id: r.id, name: r.name, description: r.description, codeType: r.codeType, placement: r.placement, scope: r.scope, scopeTargets: r.scopeTargets, code: r.code, enabled: r.enabled }); }}
        exportName="code-snippets"
        searchText={(r) => `${r.name} ${r.description}`}
        headerActions={
          canManage ? (
            <>
              <input
                ref={file}
                type="file"
                accept=".js,.css,.html,.txt"
                hidden
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  e.target.value = "";
                  if (!f) return;
                  const ext = f.name.split(".").pop()?.toLowerCase();
                  setCheck(null);
                  setDraft({ ...blankCode, name: f.name, code: await f.text(), codeType: ext === "css" ? "css" : ext === "html" ? "html" : "javascript" });
                }}
              />
              <Button icon={<Upload className="h-3.5 w-3.5" />} onClick={() => file.current?.click()}>
                Upload Snippet
              </Button>
            </>
          ) : undefined
        }
        columns={[
          { key: "name", header: "Snippet", value: (r) => r.name, render: (r) => <span className="font-semibold text-ink">{r.name}</span> },
          { key: "type", header: "Type", value: (r) => r.codeType },
          { key: "place", header: "Placement", value: (r) => PLACEMENTS.find((p) => p.value === r.placement)?.label ?? r.placement },
          { key: "scope", header: "Scope", value: (r) => (r.scope === "site-wide" ? "Site-wide" : r.scopeTargets || "Selected pages") },
          { key: "ver", header: "Version", value: (r) => r.version },
          { key: "by", header: "Author", value: (r) => r.author },
          { key: "val", header: "Validation", value: (r) => r.validation, render: (r) => <Badge tone={r.validation === "valid" ? "green" : r.validation === "invalid" ? "red" : "neutral"}>{r.validation}</Badge> },
          { key: "on", header: "Status", value: (r) => r.enabled, render: (r) => <Badge tone={r.enabled ? "green" : "neutral"}>{r.enabled ? "Enabled" : "Disabled"}</Badge> },
        ]}
        extraRowActions={(row) => [
          { label: "Preview", icon: <Eye className="h-3.5 w-3.5" />, onRun: () => setPreview(row) },
          { label: "Validate", icon: <ShieldCheck className="h-3.5 w-3.5" />, onRun: async (r) => { const v = validateCode(r.codeType, r.code); await db.update("snippets", r.id, { validation: v.ok ? "valid" : "invalid" }); toast(v.message, v.ok ? "success" : "error"); } },
          { label: "Version history / rollback", icon: <History className="h-3.5 w-3.5" />, onRun: () => setHistory(row) },
          ...(canEdit
            ? [
                { label: row.enabled ? "Disable" : "Enable", icon: <Power className="h-3.5 w-3.5" />, onRun: async (r: CodeSnippet) => { await db.update("snippets", r.id, { enabled: !r.enabled }); } },
                { label: "Duplicate", icon: <Copy className="h-3.5 w-3.5" />, onRun: async (r: CodeSnippet) => { await db.duplicate("snippets", r.id); toast("Duplicated (disabled copy)."); } },
              ]
            : []),
        ]}
      />
      <Overlay
        open={!!draft}
        onClose={() => setDraft(null)}
        variant="drawer"
        title={draft?.id ? "Edit code" : "Add code"}
        footer={
          <>
            <Button onClick={() => setDraft(null)}>Cancel</Button>
            <Button icon={<ShieldCheck className="h-3.5 w-3.5" />} onClick={() => draft && setCheck(validateCode(draft.codeType, draft.code))}>
              Validate
            </Button>
            {(canEdit || !draft?.id) && <Button variant="primary" onClick={save}>Save</Button>}
          </>
        }
      >
        {draft && (
          <div className="space-y-4">
            <Field label="Name" required><TextInput value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
            <Field label="Description"><TextInput value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Code type">
                <Select value={draft.codeType} onChange={(e) => setDraft({ ...draft, codeType: e.target.value as CodeSnippet["codeType"] })}>
                  {CODE_TYPES.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
                </Select>
              </Field>
              <Field label="Placement">
                <Select value={draft.placement} onChange={(e) => setDraft({ ...draft, placement: e.target.value as CodeSnippet["placement"] })}>
                  {PLACEMENTS.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
                </Select>
              </Field>
              <Field label="Scope">
                <Select value={draft.scope} onChange={(e) => setDraft({ ...draft, scope: e.target.value as CodeSnippet["scope"] })}>
                  <option value="site-wide">Site-wide</option>
                  <option value="selected">Selected pages / content types</option>
                </Select>
              </Field>
              {draft.scope === "selected" && (
                <Field label="Pages / content types" help="e.g. /products, /blogs"><TextInput value={draft.scopeTargets} onChange={(e) => setDraft({ ...draft, scopeTargets: e.target.value })} /></Field>
              )}
            </div>
            <Toggle checked={draft.enabled} onChange={(v) => setDraft({ ...draft, enabled: v })} label="Enabled" help="Disabled snippets are kept but not added to the site." />
            <Field label="Code" required><TextArea rows={14} spellCheck={false} className="font-mono text-[12.5px]" value={draft.code} onChange={(e) => { setDraft({ ...draft, code: e.target.value }); setCheck(null); }} /></Field>
            {check && <p className={cn("border-l-2 px-3 py-2 text-sm", check.ok ? "border-emerald-500 bg-emerald-50 text-emerald-800" : "border-brand-red bg-brand-red/5 text-brand-red-dark")}>{check.message}</p>}
          </div>
        )}
      </Overlay>
      <Overlay open={!!preview} onClose={() => setPreview(null)} variant="drawer" title={preview?.name ?? ""} description="Preview only: this code is not run here.">
        <pre className="max-h-[70vh] overflow-auto bg-ink p-4 text-[12px] leading-relaxed text-white/90">{preview?.code}</pre>
      </Overlay>
      <Overlay open={!!history} onClose={() => setHistory(null)} variant="drawer" title="Version history" description={history?.name}>
        <ul className="space-y-3">
          {history?.history.slice().reverse().map((h) => (
            <li key={h.version} className="border border-slate-200 p-3">
              <div className="flex items-center gap-2 text-sm">
                <Badge tone={h.version === history.version ? "green" : "neutral"}>v{h.version}{h.version === history.version ? " (current)" : ""}</Badge>
                <span className="text-slate-500">{fmt(h.at)} by {h.by}</span>
                {h.version !== history.version && canEdit && (
                  <Button size="sm" className="ml-auto" icon={<RotateCcw className="h-3 w-3" />} onClick={async () => {
                    const ok = await confirm({ title: `Roll back to v${h.version}?`, confirmLabel: "Roll back" });
                    if (!ok) return;
                    await db.update("snippets", history.id, { code: h.code, version: history.version + 1, history: [...history.history, { version: history.version + 1, at: nowIso(), by: session?.name ?? "You", code: h.code }].slice(-10) } as never);
                    toast(`Rolled back to v${h.version}.`);
                    setHistory(null);
                  }}>
                    Roll back
                  </Button>
                )}
              </div>
              <pre className="mt-2 max-h-32 overflow-auto bg-slate-50 p-2 text-xs whitespace-pre-wrap">{h.code}</pre>
            </li>
          ))}
        </ul>
      </Overlay>
    </>
  );
}

/* ------------------------------- Plugins ------------------------------- */

export function PluginsScreen() {
  const can = useCan();
  const { toast, confirm } = useFeedback();
  const [upload, setUpload] = useState<null | { name: string; size: number; checks: { label: string; ok: boolean }[] }>(null);
  const file = useRef<HTMLInputElement>(null);
  const canManage = can("plugins", "manage");

  async function onFile(f: File | undefined) {
    if (!f) return;
    const isZip = /\.zip$/i.test(f.name);
    setUpload({
      name: f.name,
      size: f.size,
      checks: [
        { label: "File type is .zip", ok: isZip },
        { label: "Version detected", ok: isZip },
        { label: "Compatible with this site version", ok: isZip },
        { label: "No missing dependencies", ok: isZip },
        { label: "Security scan (simulated)", ok: isZip },
      ],
    });
  }

  const setState = async (r: Plugin, patch: Partial<Plugin>, msg: string) => {
    await db.update("plugins", r.id, patch);
    await db.logAction("plugin", "plugins", `${msg}: ${r.name}`, r.id);
    toast(`${msg} (simulated).`);
  };

  return (
    <>
      <CollectionList
        collection="plugins"
        resource="plugins"
        title="Plugin Upload"
        description="Upload and manage plugins. Every action is simulated in this demo (nothing is installed)."
        singular="plugin"
        crumbs={[{ label: "Technical" }]}
        hardDelete
        exportName="plugins"
        searchText={(r) => `${r.name} ${r.author} ${r.description}`}
        headerActions={
          canManage ? (
            <>
              <input ref={file} type="file" accept=".zip,application/zip" hidden onChange={(e) => { void onFile(e.target.files?.[0]); e.target.value = ""; }} />
              <Button variant="primary" icon={<Upload className="h-3.5 w-3.5" />} onClick={() => file.current?.click()}>
                Upload Plugin
              </Button>
            </>
          ) : undefined
        }
        columns={[
          { key: "name", header: "Plugin", value: (r) => r.name, render: (r) => <span className="font-semibold text-ink">{r.name}</span> },
          { key: "ver", header: "Version", value: (r) => r.version },
          { key: "by", header: "Author", value: (r) => r.author },
          { key: "desc", header: "Description", value: (r) => r.description },
          { key: "date", header: "Installed", value: (r) => r.installedAt, render: (r) => (r.installed ? fmt(r.installedAt) : "-"), csv: (r) => r.installedAt },
          { key: "state", header: "Status", value: (r) => (r.installed ? (r.active ? "Active" : "Inactive") : "Not installed"), render: (r) => <Badge tone={!r.installed ? "neutral" : r.active ? "green" : "amber"}>{!r.installed ? "Not installed" : r.active ? "Active" : "Inactive"}</Badge> },
          { key: "upd", header: "Update", value: (r) => r.updateAvailable, render: (r) => (r.updateAvailable ? <Badge tone="blue">v{r.updateAvailable}</Badge> : <span className="text-slate-300">Up to date</span>) },
        ]}
        extraRowActions={(r) =>
          canManage
            ? [
                { label: "Install", icon: <Download className="h-3.5 w-3.5" />, hidden: r.installed, onRun: (x: Plugin) => setState(x, { installed: true, installedAt: nowIso() }, "Installed") },
                { label: "Activate", icon: <Play className="h-3.5 w-3.5" />, hidden: !r.installed || r.active, onRun: (x: Plugin) => setState(x, { active: true }, "Activated") },
                { label: "Deactivate", icon: <Power className="h-3.5 w-3.5" />, hidden: !r.installed || !r.active, onRun: (x: Plugin) => setState(x, { active: false }, "Deactivated") },
                { label: "Update", icon: <Upload className="h-3.5 w-3.5" />, hidden: !r.updateAvailable, onRun: async (x: Plugin) => { const ok = await confirm({ title: `Update ${x.name} to v${x.updateAvailable}?`, description: "A backup is taken first so you can roll back.", confirmLabel: "Backup and update" }); if (ok) { await db.create("backups", { status: "published", type: "code", createdAt: nowIso(), createdBy: "System", notes: `Before updating ${x.name}`, sizeMb: 12, restorePoint: true }); await setState(x, { version: x.updateAvailable, updateAvailable: "" }, "Updated"); } } },
                { label: "Test on staging", icon: <ShieldCheck className="h-3.5 w-3.5" />, onRun: async (x: Plugin) => { await db.logAction("plugin", "plugins", `Staging test passed: ${x.name}`, x.id); toast("Staging test passed (simulated)."); } },
                { label: "Rollback", icon: <RotateCcw className="h-3.5 w-3.5" />, hidden: !r.installed, onRun: async (x: Plugin) => { const ok = await confirm({ title: `Roll back ${x.name}?`, description: "Restores the package from before the last update (simulated).", confirmLabel: "Roll back" }); if (ok) { await db.logAction("plugin", "plugins", `Rolled back ${x.name}`, x.id); toast("Rolled back (simulated)."); } } },
              ]
            : []
        }
      />
      <Overlay
        open={!!upload}
        onClose={() => setUpload(null)}
        title="Upload plugin"
        description={upload ? `${upload.name} (${Math.round(upload.size / 1000)} KB)` : undefined}
        footer={
          <>
            <Button onClick={() => setUpload(null)}>Cancel</Button>
            <Button
              variant="primary"
              disabled={!upload?.checks.every((c) => c.ok)}
              onClick={async () => {
                if (!upload) return;
                const name = upload.name.replace(/\.zip$/i, "").replace(/[-_]/g, " ");
                await db.create("plugins", { status: "published", name, version: "1.0.0", author: "Uploaded package", description: "Uploaded in the demo (simulated).", installedAt: nowIso(), active: false, updateAvailable: "", installed: false, checks: upload.checks.map((c) => c.label) });
                toast("Plugin uploaded. Install it from the list.");
                setUpload(null);
              }}
            >
              Add to list
            </Button>
          </>
        }
      >
        <ul className="space-y-2">
          {upload?.checks.map((c) => (
            <li key={c.label} className="flex items-center gap-2 text-sm">
              <span className={c.ok ? "text-emerald-600" : "text-brand-red"}>{c.ok ? "✓" : "✗"}</span>
              {c.label}
            </li>
          ))}
        </ul>
        {!upload?.checks.every((c) => c.ok) && <p className="mt-4 text-sm text-brand-red-dark">Only plugin packages (.zip) can be uploaded.</p>}
      </Overlay>
    </>
  );
}

/* -------------------------------- Backups -------------------------------- */

const BACKUP_KINDS: { id: "database" | "media" | "settings" | "code"; label: string; mb: number }[] = [
  { id: "database", label: "Database", mb: 38 },
  { id: "media", label: "Media", mb: 320 },
  { id: "settings", label: "Settings", mb: 1 },
  { id: "code", label: "Code and plugins", mb: 12 },
];

export function BackupsScreen() {
  const can = useCan();
  const { session } = useAuth();
  const { toast, confirm } = useFeedback();
  const [creating, setCreating] = useState(false);
  const [kinds, setKinds] = useState<Set<string>>(new Set(["database", "settings"]));
  const [notes, setNotes] = useState("");
  const canManage = can("backups", "manage");

  async function create() {
    const chosen = BACKUP_KINDS.filter((k) => kinds.has(k.id));
    if (!chosen.length) return toast("Choose at least one thing to back up.", "error");
    const all = chosen.length === BACKUP_KINDS.length;
    await db.createMany(
      "backups",
      (all ? [{ type: "full", mb: chosen.reduce((s, k) => s + k.mb, 0) }] : chosen.map((k) => ({ type: k.id, mb: k.mb }))).map((b) => ({
        status: "published",
        type: b.type,
        createdAt: nowIso(),
        createdBy: session?.name ?? "You",
        notes,
        sizeMb: b.mb,
        restorePoint: true,
      })) as never,
    );
    toast("Backup created (simulated).");
    setCreating(false);
    setNotes("");
  }

  const restore = async (r: Backup, label: string) => {
    const ok = await confirm({
      title: `${label} from ${fmt(r.createdAt)}?`,
      description: "Current data is replaced by this backup. Demo: nothing is actually changed; the action is recorded in the audit log.",
      confirmLabel: label,
      requireText: "RESTORE",
    });
    if (!ok) return;
    await db.logAction("restore", "backups", `${label}: ${r.type} backup ${fmt(r.createdAt)}`, r.id);
    toast(`${label} complete (simulated).`);
  };

  return (
    <>
      <CollectionList
        collection="backups"
        resource="backups"
        title="Backup & Rollback"
        description="Create backups and restore a previous point. Simulated in this demo."
        singular="backup"
        crumbs={[{ label: "Technical" }]}
        hardDelete
        newLabel="Create Backup"
        onNew={canManage ? () => setCreating(true) : undefined}
        exportName="backups"
        defaultSort={{ key: "date", dir: "desc" }}
        searchText={(r) => `${r.type} ${r.notes} ${r.createdBy}`}
        columns={[
          { key: "date", header: "Date / time", value: (r) => r.createdAt, render: (r) => fmt(r.createdAt), csv: (r) => r.createdAt },
          { key: "type", header: "Type", value: (r) => r.type, render: (r) => <Badge>{r.type}</Badge> },
          { key: "by", header: "Created by", value: (r) => r.createdBy },
          { key: "notes", header: "Notes", value: (r) => r.notes },
          { key: "size", header: "Size", value: (r) => r.sizeMb, render: (r) => `${r.sizeMb} MB` },
          { key: "rp", header: "Restore point", value: (r) => r.restorePoint, render: (r) => <Badge tone={r.restorePoint ? "green" : "neutral"}>{r.restorePoint ? "Yes" : "No"}</Badge> },
        ]}
        extraRowActions={(row) => [
          { label: "Download backup", icon: <Download className="h-3.5 w-3.5" />, onRun: (r: Backup) => downloadText(`backup-${r.type}-${r.createdAt.slice(0, 10)}.txt`, `Demo backup placeholder\nType: ${r.type}\nCreated: ${r.createdAt}\nNotes: ${r.notes}\n`, "text/plain") },
          ...(canManage
            ? [
                { label: "Restore", icon: <RotateCcw className="h-3.5 w-3.5" />, onRun: (r: Backup) => restore(r, "Restore") },
                { label: "Rollback to this point", icon: <History className="h-3.5 w-3.5" />, hidden: !row.restorePoint, onRun: (r: Backup) => restore(r, "Roll back") },
              ]
            : []),
        ]}
      />
      <Overlay
        open={creating}
        onClose={() => setCreating(false)}
        title="Create backup"
        size="sm"
        footer={<><Button onClick={() => setCreating(false)}>Cancel</Button><Button variant="primary" onClick={create}>Create backup</Button></>}
      >
        <div className="space-y-3">
          {BACKUP_KINDS.map((k) => (
            <Toggle key={k.id} checked={kinds.has(k.id)} label={k.label} help={`About ${k.mb} MB`} onChange={(v) => setKinds((s) => { const n = new Set(s); if (v) n.add(k.id); else n.delete(k.id); return n; })} />
          ))}
          <Field label="Notes"><TextInput value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Why are you backing up?" /></Field>
        </div>
      </Overlay>
    </>
  );
}

/* --------------------------------- Cache --------------------------------- */

export function CacheScreen() {
  const can = useCan();
  const { toast } = useFeedback();
  const { value, ready } = useSingleton("cache");
  const [status, setStatus] = useState(false);
  const manage = can("cache", "manage");
  if (!ready || !value) return <div className="h-64 animate-pulse border border-slate-200 bg-white" />;

  const run = async (label: string, patch: Partial<typeof value>) => {
    await db.saveSingleton("cache", { ...value, ...patch }, `${label} (simulated)`);
    toast(`${label} (simulated).`);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Cache / Performance"
        description="Clear caches and rebuild assets. Simulated in this demo."
        crumbs={[{ label: "Technical" }]}
        actions={
          <>
            <Button icon={<Eye className="h-3.5 w-3.5" />} onClick={() => setStatus(true)}>View Status</Button>
            {manage && (
              <>
                <Button onClick={() => run("Assets rebuilt", { lastAssetRebuild: nowIso() })}>Rebuild Assets</Button>
                <Button onClick={() => run("CDN purged", { lastCdnPurge: nowIso() })}>Purge CDN</Button>
                <Button variant="primary" onClick={() => run("Cache cleared", { lastCleared: nowIso() })}>Clear Cache</Button>
              </>
            )}
          </>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader title="Controls" />
          <CardBody className="space-y-4">
            <Toggle checked={value.pageCache} disabled={!manage} label="Page cache" onChange={(v) => run(`Page cache ${v ? "enabled" : "disabled"}`, { pageCache: v })} />
            <Toggle checked={value.objectCache} disabled={!manage} label="Object cache" help="If supported by the host." onChange={(v) => run(`Object cache ${v ? "enabled" : "disabled"}`, { objectCache: v })} />
            <Toggle checked={value.cdn} disabled={!manage} label="CDN" help="If supported by the host." onChange={(v) => run(`CDN ${v ? "enabled" : "disabled"}`, { cdn: v })} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Status" />
          <CardBody>
            <dl className="space-y-2 text-sm">
              {[
                ["Last cleared", fmt(value.lastCleared)],
                ["Last CDN purge", fmt(value.lastCdnPurge)],
                ["Last asset rebuild", fmt(value.lastAssetRebuild)],
                ["Environment", value.environment],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4"><dt className="text-slate-500">{k}</dt><dd className="text-right font-semibold text-ink">{v}</dd></div>
              ))}
            </dl>
          </CardBody>
        </Card>
      </div>
      <Overlay open={status} onClose={() => setStatus(false)} title="Cache status" size="sm">
        <ul className="space-y-2 text-sm">
          <li className="flex justify-between"><span>Page cache</span><Badge tone={value.pageCache ? "green" : "neutral"}>{value.pageCache ? "On" : "Off"}</Badge></li>
          <li className="flex justify-between"><span>Object cache</span><Badge tone={value.objectCache ? "green" : "neutral"}>{value.objectCache ? "On" : "Off"}</Badge></li>
          <li className="flex justify-between"><span>CDN</span><Badge tone={value.cdn ? "green" : "neutral"}>{value.cdn ? "On" : "Off"}</Badge></li>
        </ul>
        <p className="mt-4 text-xs text-slate-500">{value.environment}</p>
      </Overlay>
    </div>
  );
}
