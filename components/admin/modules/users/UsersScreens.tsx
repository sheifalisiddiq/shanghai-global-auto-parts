"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Power, RotateCcw, ShieldCheck } from "lucide-react";
import { db } from "@/lib/admin/data";
import { useCollection, useDataReady, useSingleton } from "@/lib/admin/data/hooks";
import type { AuditEntry } from "@/lib/admin/data/types";
import { ACTIONS, ACTION_LABELS, RESOURCES, RESOURCE_LABELS, type Action, type Grants, type Resource } from "@/lib/admin/access/permissions";
import { ROLES, ROLE_IDS, adminIsSuperset, type RoleId } from "@/lib/admin/access/roles";
import { canByDefault, effectiveGrants, getRoleOverrides } from "@/lib/admin/access/access";
import { useCan } from "@/lib/admin/auth/AuthContext";
import { cn } from "@/lib/utils/cn";
import { CollectionList } from "../../editors/CollectionList";
import { Field, Select, TextInput, Toggle } from "../../fields/inputs";
import { Badge, SampleBadge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import { Card, CardBody } from "../../ui/Card";
import { DataTable } from "../../ui/DataTable";
import { useFeedback } from "../../ui/Feedback";
import { Overlay } from "../../ui/Overlay";
import { PageHeader } from "../../ui/PageHeader";
import { Tabs } from "../../ui/Tabs";

const fmt = (iso: string) => (iso ? new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "Never");

/* ---------------------------------- Users ---------------------------------- */

interface UserDraft {
  id?: string;
  name: string;
  email: string;
  roleId: RoleId;
  active: boolean;
}

export function UsersScreen() {
  const can = useCan();
  const router = useRouter();
  const { toast, confirm } = useFeedback();
  const [draft, setDraft] = useState<UserDraft | null>(null);
  const canEdit = can("users", "edit");

  async function save() {
    if (!draft) return;
    if (!draft.name.trim() || !/^\S+@\S+\.\S+$/.test(draft.email)) return toast("Enter a name and a valid email.", "error");
    const patch = { name: draft.name.trim(), email: draft.email.trim().toLowerCase(), roleId: draft.roleId, active: draft.active };
    if (draft.id) await db.update("users", draft.id, patch);
    else await db.create("users", { ...patch, status: "published", lastLogin: "" });
    toast("User saved.");
    setDraft(null);
  }

  return (
    <>
      <CollectionList
        collection="users"
        resource="users"
        title="Users"
        description="Team members and their roles. In this demo only the five built-in demo accounts can log in."
        singular="user"
        crumbs={[{ label: "Users & Roles" }]}
        hardDelete
        newLabel="Create User"
        onNew={() => setDraft({ name: "", email: "", roleId: "content-editor", active: true })}
        onEdit={(r) => setDraft({ id: r.id, name: r.name, email: r.email, roleId: r.roleId, active: r.active })}
        exportName="users"
        searchText={(r) => `${r.name} ${r.email} ${ROLES[r.roleId].label}`}
        columns={[
          { key: "name", header: "Name", value: (r) => r.name, render: (r) => <span className="font-semibold text-ink">{r.name}</span> },
          { key: "email", header: "Email", value: (r) => r.email },
          { key: "role", header: "Role", value: (r) => ROLES[r.roleId].label },
          { key: "on", header: "Status", value: (r) => r.active, render: (r) => <Badge tone={r.active ? "green" : "neutral"}>{r.active ? "Active" : "Disabled"}</Badge> },
          { key: "last", header: "Last login", value: (r) => r.lastLogin, render: (r) => fmt(r.lastLogin), csv: (r) => r.lastLogin },
        ]}
        filters={[{ key: "role", label: "Role", options: ROLE_IDS.map((id) => ({ value: id, label: ROLES[id].label })), match: (r, v) => r.roleId === v }]}
        extraRowActions={(row) =>
          canEdit
            ? [
                { label: row.active ? "Disable user" : "Enable user", icon: <Power className="h-3.5 w-3.5" />, onRun: async (r) => { await db.update("users", r.id, { active: !r.active }); } },
                {
                  label: "Reset access",
                  icon: <KeyRound className="h-3.5 w-3.5" />,
                  onRun: async (r) => {
                    const ok = await confirm({ title: `Reset access for ${r.name}?`, description: "In a real system this signs the user out everywhere and sends a password-reset link. Demo: recorded in the audit log only.", confirmLabel: "Reset access" });
                    if (ok) {
                      await db.logAction("reset-access", "users", `Reset access for ${r.name}`, r.id);
                      toast("Access reset (demo).");
                    }
                  },
                },
                { label: "Set permissions", icon: <ShieldCheck className="h-3.5 w-3.5" />, onRun: () => router.push("/admin/users/roles") },
              ]
            : []
        }
      />
      <Overlay
        open={!!draft}
        onClose={() => setDraft(null)}
        title={draft?.id ? "Edit user / role" : "Create user"}
        size="sm"
        footer={<><Button onClick={() => setDraft(null)}>Cancel</Button><Button variant="primary" onClick={save}>Save</Button></>}
      >
        {draft && (
          <div className="space-y-4">
            <Field label="Name" required><TextInput value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
            <Field label="Email" required><TextInput type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /></Field>
            <Field label="Role" help={ROLES[draft.roleId].description}>
              <Select value={draft.roleId} onChange={(e) => setDraft({ ...draft, roleId: e.target.value as RoleId })}>
                {ROLE_IDS.map((id) => (
                  <option key={id} value={id}>{ROLES[id].label}</option>
                ))}
              </Select>
            </Field>
            <Toggle checked={draft.active} onChange={(v) => setDraft({ ...draft, active: v })} label="Active" help="Disabled users cannot sign in." />
          </div>
        )}
      </Overlay>
    </>
  );
}

/* ------------------------------ Roles & permissions ------------------------------ */

export function RolesScreen() {
  const ready = useDataReady();
  const can = useCan();
  const { toast, confirm } = useFeedback();
  const { value: stored } = useSingleton("roleOverrides");
  const [roleId, setRoleId] = useState<RoleId>("seo-manager");
  const canEdit = can("roles", "edit");
  const locked = roleId === "administrator";
  const grants = effectiveGrants(roleId);
  const overridden = !!(stored ?? getRoleOverrides())[roleId];

  async function write(next: Grants) {
    const overrides = { ...(stored ?? {}), [roleId]: next };
    await db.saveSingleton("roleOverrides", overrides, `Set permissions for ${ROLES[roleId].label}`);
  }

  async function toggle(resource: Resource, action: Action, on: boolean) {
    const current = (grants[resource] ?? []) as readonly Action[];
    let acts = on ? Array.from(new Set([...current, action])) : current.filter((a) => a !== action);
    // Turning View off removes every other action on that resource (nothing works without View).
    if (action === "view" && !on) acts = [];
    await write({ ...grants, [resource]: acts });
  }

  async function reset() {
    const ok = await confirm({ title: `Reset ${ROLES[roleId].label} to defaults?`, confirmLabel: "Reset" });
    if (!ok) return;
    const next = { ...(stored ?? {}) };
    delete next[roleId];
    await db.saveSingleton("roleOverrides", next, `Reset permissions for ${ROLES[roleId].label}`);
    toast("Reset to defaults.");
  }

  if (!ready) return <div className="h-64 animate-pulse border border-slate-200 bg-white" />;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Roles & Permissions"
        description="What each role can do. Users only see the screens and buttons their role allows."
        crumbs={[{ label: "Users & Roles" }]}
        actions={
          canEdit && !locked && overridden ? (
            <Button icon={<RotateCcw className="h-3.5 w-3.5" />} onClick={reset}>
              Reset role to defaults
            </Button>
          ) : undefined
        }
      />
      <Tabs className="mb-4" value={roleId} onChange={(v) => setRoleId(v as RoleId)} tabs={ROLE_IDS.map((id) => ({ id, label: ROLES[id].label }))} />
      <Card className="mb-4">
        <CardBody className="space-y-2 text-sm">
          <p className="text-slate-600">{ROLES[roleId].description}</p>
          {locked ? (
            <p className="font-semibold text-emerald-700">
              The Administrator always has every action on every resource and cannot be restricted{adminIsSuperset() ? " (verified: it includes every permission of every other role)" : ""}.
            </p>
          ) : (
            <p className="text-xs text-slate-500">
              Demo note: changes here apply in this browser. You can turn actions on or off for areas the role already reaches (for example the SEO panel via &quot;SEO&quot;), and remove access completely. Granting access to a whole area the role does not have by default needs the database-backed roles, because the server gate uses the built-in defaults.
            </p>
          )}
        </CardBody>
      </Card>
      <div className="overflow-x-auto border border-slate-200 bg-white">
        <table className="w-full min-w-[44rem] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] tracking-[0.1em] text-slate-500 uppercase">
              <th className="px-3 py-2.5">Area</th>
              {ACTIONS.map((a) => (
                <th key={a} className="px-2 py-2.5 text-center">{ACTION_LABELS[a]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RESOURCES.map((res) => {
              const reachable = canByDefault(roleId, res, "view");
              const has = (a: Action) => !!grants[res]?.includes(a);
              return (
                <tr key={res} className="border-b border-slate-100 last:border-0">
                  <td className="px-3 py-2 font-semibold text-ink">{RESOURCE_LABELS[res]}</td>
                  {ACTIONS.map((a) => {
                    const disabled = locked || !canEdit || !reachable || (a !== "view" && !has("view"));
                    return (
                      <td key={a} className="px-2 py-2 text-center">
                        <input
                          type="checkbox"
                          aria-label={`${RESOURCE_LABELS[res]}: ${ACTION_LABELS[a]}`}
                          checked={has(a)}
                          disabled={disabled}
                          onChange={(e) => toggle(res, a, e.target.checked)}
                          className={cn("h-4 w-4 accent-[#ef0606]", disabled && "opacity-40")}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-slate-500">
        &quot;Manage&quot; covers special operations: generate sitemap, upload plugin, edit code, restore backup, purge cache, reset access. &quot;SEO&quot; shows the SEO panel on editors.
      </p>
    </div>
  );
}

/* ---------------------------------- Audit ---------------------------------- */

export function AuditScreen() {
  const rows = useCollection("audit");
  const [openId, setOpenId] = useState<string | null>(null);
  const open = rows.find((r) => r.id === openId);
  const actors = useMemo(() => Array.from(new Set(rows.map((r) => r.actor))).sort(), [rows]);
  const actions = useMemo(() => Array.from(new Set(rows.map((r) => r.action.split(":")[0]))).sort(), [rows]);
  return (
    <>
      <PageHeader
        title="Audit Log"
        description="Who changed what, and when. Every action in this demo is recorded here automatically."
        crumbs={[{ label: "Users & Roles" }]}
      />
      <DataTable<AuditEntry>
        rows={rows}
        withStatus={false}
        pageSize={20}
        exportName="audit-log"
        defaultSort={{ key: "at", dir: "desc" }}
        onRowClick={(r) => setOpenId(r.id)}
        searchText={(r) => `${r.actor} ${r.action} ${r.collection} ${r.summary}`}
        filters={[
          { key: "actor", label: "Who", options: actors.map((a) => ({ value: a, label: a })), match: (r, v) => r.actor === v },
          { key: "action", label: "Action", options: actions.map((a) => ({ value: a, label: a })), match: (r, v) => r.action.split(":")[0] === v },
        ]}
        columns={[
          { key: "at", header: "When", value: (r) => r.at, render: (r) => fmt(r.at), csv: (r) => r.at },
          { key: "actor", header: "Who", value: (r) => r.actor, render: (r) => <span className="font-semibold text-ink">{r.actor}</span> },
          { key: "role", header: "Role", value: (r) => r.actorRole },
          { key: "action", header: "Action", value: (r) => r.action, render: (r) => <Badge>{r.action}</Badge> },
          { key: "area", header: "Area", value: (r) => r.collection },
          { key: "summary", header: "What", value: (r) => r.summary },
          { key: "ref", header: "Reference", value: (r) => r.entityId },
        ]}
        emptyTitle="Nothing recorded yet"
      />
      {open && (
        <Overlay open onClose={() => setOpenId(null)} variant="drawer" title={open.summary} description={<span className="flex items-center gap-2">{open.isSample && <SampleBadge />}{fmt(open.at)}</span>}>
          <dl className="grid gap-3 sm:grid-cols-2 text-sm">
            <div><dt className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">Who</dt><dd>{open.actor} ({open.actorRole || "system"})</dd></div>
            <div><dt className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">Action</dt><dd>{open.action}</dd></div>
            <div><dt className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">Area</dt><dd>{open.collection}</dd></div>
            <div><dt className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">Reference</dt><dd className="break-all">{open.entityId || "-"}</dd></div>
          </dl>
          <div className="mt-5 grid gap-4">
            <div><p className="mb-1 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">Before</p><pre className="max-h-48 overflow-auto bg-slate-50 p-3 text-xs whitespace-pre-wrap">{open.before || "-"}</pre></div>
            <div><p className="mb-1 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">After</p><pre className="max-h-48 overflow-auto bg-slate-50 p-3 text-xs whitespace-pre-wrap">{open.after || "-"}</pre></div>
          </div>
        </Overlay>
      )}
    </>
  );
}

