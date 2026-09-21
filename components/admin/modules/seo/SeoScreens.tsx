"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Eye, FileCode, PlayCircle, Power, RefreshCw, Save, ShieldCheck, Trash2, Wand2 } from "lucide-react";
import { db } from "@/lib/admin/data";
import { useActiveRows, useCollection, useSingleton } from "@/lib/admin/data/hooks";
import { nowIso } from "@/lib/admin/data/defaults";
import type { Log404, PageDoc, Redirect, RobotsConfig, SchemaEntry, SchemaType, SitemapSettings } from "@/lib/admin/data/types";
import { SCHEMA_TYPES } from "@/lib/admin/data/types";
import type { FieldDef } from "@/lib/admin/forms/types";
import { redirectIssues, validateJsonLd, validateRobots } from "@/lib/admin/seo/checks";
import { buildSitemap, sitemapXml } from "@/lib/admin/seo/sitemap";
import { siteConfig } from "@/lib/seo/site";
import { useCan } from "@/lib/admin/auth/AuthContext";
import { cn } from "@/lib/utils/cn";
import { CollectionList } from "../../editors/CollectionList";
import { CsvImportButton } from "../../editors/helpers";
import { SingletonForm } from "../../editors/SingletonForm";
import { Field, Select, TextArea, TextInput, Toggle } from "../../fields/inputs";
import { Badge, YesNo } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import { Card, CardBody, CardHeader } from "../../ui/Card";
import { DataTable } from "../../ui/DataTable";
import { useFeedback } from "../../ui/Feedback";
import { Overlay } from "../../ui/Overlay";
import { PageHeader } from "../../ui/PageHeader";
import { Tabs } from "../../ui/Tabs";

const fmt = (iso: string) => (iso ? new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "Never");

/* ---------------------------- Global settings ---------------------------- */

const T = (name: string, label: string, extra: { help?: string; placeholder?: string } = {}): FieldDef => ({ type: "text", name, label, ...extra });

const GLOBAL_FIELDS: FieldDef[] = [
  {
    type: "group",
    label: "Defaults",
    fields: [
      T("defaultTitlePattern", "Default meta title pattern", { help: "Use %s where the page title goes, e.g. %s | Shanghai Global Auto Parts" }),
      { type: "textarea", name: "defaultDescription", label: "Default meta description", localized: true, rows: 3, max: 160 },
      { type: "image", name: "defaultSocialImage", label: "Default social image" },
    ],
  },
  {
    type: "group",
    label: "Branding and organisation",
    fields: [
      T("siteName", "Site name"),
      T("organisationName", "Organisation name"),
      { type: "image", name: "organisationLogo", label: "Organisation logo" },
      { type: "repeater", name: "socialProfiles", label: "Social profiles", titleKey: "network", addLabel: "Add profile", item: [T("network", "Network (e.g. Instagram)"), { type: "url", name: "url", label: "Profile URL" }] },
    ],
  },
  {
    type: "group",
    label: "SEO templates",
    fields: [
      { type: "info", text: "Variables: %product%, %brand%, %model%, %category%, %title%, %country%, %site%." },
      T("templates.product", "Product title template"),
      T("templates.brand", "Brand title template"),
      T("templates.model", "Model title template"),
      T("templates.category", "Category title template"),
      T("templates.blog", "Blog title template"),
      T("templates.country", "Country taxonomy title template"),
    ],
  },
  {
    type: "group",
    label: "Global indexing rules",
    fields: [
      { type: "toggle", name: "indexing.archives", label: "Index archive pages (categories, tags, countries)" },
      { type: "toggle", name: "indexing.search", label: "Index internal search result pages" },
      { type: "toggle", name: "indexing.filters", label: "Index filtered product pages" },
    ],
  },
];

const SAMPLE_VARS: Record<string, string> = { "%product%": "Ceramic Front Brake Pad Set", "%brand%": "Chery", "%model%": "Tiggo 7 Pro", "%category%": "Brakes", "%title%": "VIN identification guide", "%country%": "United Arab Emirates", "%site%": siteConfig.name };

export function SeoGlobalScreen() {
  const [preview, setPreview] = useState(false);
  return (
    <SingletonForm
      storeKey="seoGlobal"
      resource="seoGlobal"
      title="Global SEO Settings"
      description="Site-wide defaults used when a page has no SEO of its own."
      crumbs={[{ label: "SEO" }]}
      fields={GLOBAL_FIELDS}
      loadDefault={async () => (await import("@/lib/admin/data/seed/seo")).seedSeoGlobal()}
      extraActions={({ value }) => (
        <>
          <Button icon={<Eye className="h-3.5 w-3.5" />} onClick={() => setPreview(true)}>
            Preview Templates
          </Button>
          <Overlay open={preview} onClose={() => setPreview(false)} title="Template preview" description="Each template with sample values.">
            <ul className="space-y-3">
              {Object.entries((value.templates ?? {}) as Record<string, string>).map(([k, tpl]) => (
                <li key={k} className="border border-slate-200 p-3">
                  <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">{k}</p>
                  <p className="mt-1 text-sm text-[#1a0dab]">{Object.entries(SAMPLE_VARS).reduce((s, [v, r]) => s.replaceAll(v, r), tpl)}</p>
                </li>
              ))}
            </ul>
          </Overlay>
        </>
      )}
    />
  );
}

/* -------------------------------- Redirects -------------------------------- */

interface RedirectDraft {
  id?: string;
  oldUrl: string;
  newUrl: string;
  type: 301 | 302;
  enabled: boolean;
  notes: string;
}

export function RedirectsScreen() {
  const can = useCan();
  const { toast, confirm } = useFeedback();
  const redirects = useActiveRows("redirects");
  const [tab, setTab] = useState<"redirects" | "log">("redirects");
  const [draft, setDraft] = useState<RedirectDraft | null>(null);
  const issues = useMemo(() => redirectIssues(redirects), [redirects]);
  const issueBy = useMemo(() => {
    const m = new Map<string, string[]>();
    issues.forEach((i) => m.set(i.id, [...(m.get(i.id) ?? []), i.message]));
    return m;
  }, [issues]);

  const canEdit = can("redirects", "edit");
  const blank: RedirectDraft = { oldUrl: "", newUrl: "", type: 301, enabled: true, notes: "" };

  async function saveDraft() {
    if (!draft) return;
    const oldUrl = draft.oldUrl.trim();
    const newUrl = draft.newUrl.trim();
    if (!oldUrl.startsWith("/") || !newUrl) return toast("Old URL must start with / and the new URL is required.", "error");
    const patch = { oldUrl, newUrl, type: draft.type, enabled: draft.enabled, notes: draft.notes };
    if (draft.id) await db.update("redirects", draft.id, patch);
    else await db.create("redirects", { ...patch, status: "published", hits: 0, lastHit: "" });
    toast("Redirect saved.");
    setDraft(null);
  }

  return (
    <>
      <PageHeader
        title="Redirects"
        description="Send old URLs to new ones (301 permanent, 302 temporary) and watch broken links in the 404 log."
        crumbs={[{ label: "SEO" }]}
      />
      <Tabs className="mb-5" value={tab} onChange={(t) => setTab(t as "redirects" | "log")} tabs={[{ id: "redirects", label: "Redirects", badge: <Badge>{redirects.length}</Badge> }, { id: "log", label: "404 Log" }]} />
      {tab === "redirects" ? (
        <>
          <CollectionList
            collection="redirects"
            resource="redirects"
            title="Redirect rules"
            singular="redirect"
            hardDelete
            newLabel="Create Redirect"
            onNew={() => setDraft(blank)}
            onEdit={(r) => setDraft({ id: r.id, oldUrl: r.oldUrl, newUrl: r.newUrl, type: r.type, enabled: r.enabled, notes: r.notes })}
            exportName="redirects"
            searchText={(r) => `${r.oldUrl} ${r.newUrl} ${r.notes}`}
            headerActions={
              can("redirects", "export") ? (
                <CsvImportButton
                  label="Bulk Import"
                  hint="CSV columns: old url, new url, type (301/302), notes"
                  onRows={async (rows) => {
                    const made = await db.createMany(
                      "redirects",
                      rows
                        .filter((r) => r["old url"] && r["new url"])
                        .map((r) => ({ status: "published", oldUrl: r["old url"], newUrl: r["new url"], type: r.type === "302" ? 302 : 301, enabled: true, notes: r.notes ?? "", hits: 0, lastHit: "" })) as never,
                    );
                    return made.length;
                  }}
                />
              ) : undefined
            }
            aboveTable={
              issues.length > 0 && (
                <div className="mb-4 border-l-2 border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="status">
                  <p className="flex items-center gap-2 font-bold">
                    <AlertTriangle className="h-4 w-4" /> {issues.length} issue{issues.length === 1 ? "" : "s"} found
                  </p>
                  <ul className="mt-1 list-disc pl-5">
                    {issues.map((i, idx) => (
                      <li key={idx}>
                        <code>{redirects.find((r) => r.id === i.id)?.oldUrl}</code>: {i.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            }
            columns={[
              { key: "old", header: "Old URL", value: (r) => r.oldUrl, render: (r) => <code className="text-[13px] text-ink">{r.oldUrl}</code> },
              { key: "new", header: "New URL", value: (r) => r.newUrl, render: (r) => <code className="text-[13px] text-ink">{r.newUrl}</code> },
              { key: "type", header: "Type", value: (r) => r.type },
              { key: "on", header: "Status", value: (r) => r.enabled, render: (r) => <Badge tone={r.enabled ? "green" : "neutral"}>{r.enabled ? "Enabled" : "Disabled"}</Badge> },
              { key: "hits", header: "Hits", value: (r) => r.hits },
              { key: "last", header: "Last hit", value: (r) => r.lastHit, render: (r) => (r.lastHit ? fmt(r.lastHit) : "-"), csv: (r) => r.lastHit },
              { key: "warn", header: "Warnings", noCsv: true, render: (r) => (issueBy.get(r.id)?.length ? <Badge tone="amber">{issueBy.get(r.id)!.length} issue(s)</Badge> : <span className="text-slate-300">-</span>) },
            ]}
            extraRowActions={(row) =>
              canEdit
                ? [{ label: row.enabled ? "Disable" : "Enable", icon: <Power className="h-3.5 w-3.5" />, onRun: async (r) => { await db.update("redirects", r.id, { enabled: !r.enabled }); } }]
                : []
            }
            extraBulkActions={
              canEdit
                ? [
                    { label: "Enable", icon: <Power className="h-3.5 w-3.5" />, onRun: async (ids) => { await db.bulkUpdate("redirects", ids, { enabled: true } as Partial<Redirect>); } },
                    { label: "Disable", icon: <Power className="h-3.5 w-3.5" />, onRun: async (ids) => { await db.bulkUpdate("redirects", ids, { enabled: false } as Partial<Redirect>); } },
                  ]
                : []
            }
          />
          <Overlay
            open={!!draft}
            onClose={() => setDraft(null)}
            title={draft?.id ? "Edit redirect" : "Create redirect"}
            size="md"
            footer={
              <>
                <Button onClick={() => setDraft(null)}>Cancel</Button>
                {canEdit || !draft?.id ? (
                  <Button variant="primary" icon={<Save className="h-3.5 w-3.5" />} onClick={saveDraft}>
                    Save
                  </Button>
                ) : null}
              </>
            }
          >
            {draft && (
              <div className="space-y-4">
                <Field label="Old URL" required help="The path that should redirect, e.g. /old-page">
                  <TextInput value={draft.oldUrl} onChange={(e) => setDraft({ ...draft, oldUrl: e.target.value })} placeholder="/old-page" />
                </Field>
                <Field label="New URL" required help="A path (/new-page) or a full https:// address.">
                  <TextInput value={draft.newUrl} onChange={(e) => setDraft({ ...draft, newUrl: e.target.value })} placeholder="/new-page" />
                </Field>
                <Field label="Redirect type">
                  <Select value={String(draft.type)} onChange={(e) => setDraft({ ...draft, type: Number(e.target.value) as 301 | 302 })}>
                    <option value="301">301: permanent (recommended)</option>
                    <option value="302">302: temporary</option>
                  </Select>
                </Field>
                <Toggle checked={draft.enabled} onChange={(v) => setDraft({ ...draft, enabled: v })} label="Enabled" />
                <Field label="Notes">
                  <TextArea rows={2} value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} />
                </Field>
              </div>
            )}
          </Overlay>
        </>
      ) : (
        <Log404Tab
          onCreate={(l) => {
            setTab("redirects");
            setDraft({ ...blank, oldUrl: l.url });
          }}
          confirmClear={async () => {
            const ok = await confirm({ title: "Clear the 404 log?", description: "All logged 404 entries are removed.", confirmLabel: "Clear log" });
            if (ok) {
              await db.clear("log404");
              toast("404 log cleared.");
            }
          }}
        />
      )}
    </>
  );
}

function Log404Tab({ onCreate, confirmClear }: { onCreate: (l: Log404) => void; confirmClear: () => void }) {
  const rows = useCollection("log404");
  const can = useCan();
  return (
    <DataTable<Log404>
      rows={rows}
      withStatus={false}
      exportName="404-log"
      searchText={(r) => `${r.url} ${r.referrer}`}
      defaultSort={{ key: "hits", dir: "desc" }}
      toolbar={can("redirects", "delete") && rows.length > 0 ? (
        <Button variant="danger" size="sm" icon={<Trash2 className="h-3.5 w-3.5" />} onClick={confirmClear}>
          Clear 404 Log
        </Button>
      ) : undefined}
      columns={[
        { key: "url", header: "URL", value: (r) => r.url, render: (r) => <code className="text-[13px] text-ink">{r.url}</code> },
        { key: "hits", header: "Hits", value: (r) => r.hits },
        { key: "last", header: "Last hit", value: (r) => r.lastHit, render: (r) => fmt(r.lastHit), csv: (r) => r.lastHit },
        { key: "ref", header: "Referrer", value: (r) => r.referrer || "-" },
      ]}
      rowActions={(r) => (can("redirects", "create") ? [{ label: "Create redirect", icon: <Wand2 className="h-3.5 w-3.5" />, onRun: () => onCreate(r) }] : [])}
      emptyTitle="No 404 errors logged"
      emptyDescription="Broken URLs visitors hit will be listed here once the live site logs them."
    />
  );
}

/* -------------------------------- Sitemap -------------------------------- */

const INCLUDE_LABELS: [keyof SitemapSettings["include"], string][] = [
  ["pages", "Pages"],
  ["products", "Products"],
  ["brands", "Brands"],
  ["models", "Models"],
  ["categories", "Product categories"],
  ["blogs", "Blog posts"],
  ["tags", "Blog tags"],
  ["countries", "Country archives"],
  ["jobs", "Job openings"],
];

export function SitemapScreen() {
  const can = useCan();
  const { toast } = useFeedback();
  const { value: settings, ready } = useSingleton("sitemap");
  const home = useSingleton("page_home").value;
  const about = useSingleton("page_about").value;
  const prods = useSingleton("page_products").value;
  const blogsPage = useSingleton("page_blogs").value;
  const careers = useSingleton("page_careers").value;
  const contact = useSingleton("page_contact").value;
  const products = useActiveRows("products");
  const brands = useActiveRows("brands");
  const models = useActiveRows("models");
  const categories = useActiveRows("categories");
  const posts = useActiveRows("posts");
  const tags = useActiveRows("tags");
  const countries = useActiveRows("countries");
  const jobs = useActiveRows("jobs");
  const [view, setView] = useState(false);
  const canEdit = can("sitemap", "edit");
  const canManage = can("sitemap", "manage");

  const entries = useMemo(() => {
    if (!settings) return [];
    const pages = ([["home", home], ["about", about], ["products", prods], ["blogs", blogsPage], ["careers", careers], ["contact", contact]] as [string, PageDoc | undefined][])
      .filter((p): p is [string, PageDoc] => !!p[1])
      .map(([key, doc]) => ({ key, doc }));
    return buildSitemap(settings, { pages, products, brands, models, categories, posts, tags, countries, jobs });
  }, [settings, home, about, prods, blogsPage, careers, contact, products, brands, models, categories, posts, tags, countries, jobs]);
  const xml = useMemo(() => sitemapXml(entries), [entries]);
  const groups = useMemo(() => entries.reduce<Record<string, number>>((a, e) => ({ ...a, [e.group]: (a[e.group] ?? 0) + 1 }), {}), [entries]);

  if (!ready || !settings) return <div className="h-64 animate-pulse border border-slate-200 bg-white" />;

  async function generate(label: string) {
    await db.saveSingleton("sitemap", { ...settings!, lastGeneratedAt: nowIso(), entryCount: entries.length }, `${label} sitemap (${entries.length} URLs)`);
    toast(`Sitemap ${label.toLowerCase()}: ${entries.length} URLs.`);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Sitemap"
        description="Choose what goes in sitemap.xml. In this demo the sitemap is built from the demo data and is not connected to the live site."
        crumbs={[{ label: "SEO" }]}
        actions={
          <>
            <Button icon={<Eye className="h-3.5 w-3.5" />} onClick={() => setView(true)}>
              View Sitemap
            </Button>
            {canManage && (
              <>
                <Button icon={<RefreshCw className="h-3.5 w-3.5" />} onClick={() => generate("Refreshed")}>
                  Refresh
                </Button>
                <Button variant="primary" icon={<PlayCircle className="h-3.5 w-3.5" />} onClick={() => generate("Generated")}>
                  Generate Sitemap
                </Button>
              </>
            )}
            <Button disabled title="Not available in the demo: needs the live site connected">
              Submit / Ping
            </Button>
          </>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardBody><p className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">Last generated</p><p className="font-display mt-2 text-lg font-extrabold text-ink">{fmt(settings.lastGeneratedAt)}</p></CardBody></Card>
        <Card><CardBody><p className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">URLs in sitemap now</p><p className="font-display mt-2 text-lg font-extrabold text-ink">{entries.length}</p></CardBody></Card>
        <Card><CardBody><p className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">At last generation</p><p className="font-display mt-2 text-lg font-extrabold text-ink">{settings.entryCount || "-"}</p></CardBody></Card>
      </div>
      <Card className="mt-4">
        <CardHeader title="Include / exclude" description="Only published items marked 'Include in sitemap' and 'Index' appear." />
        <CardBody className="grid gap-4 sm:grid-cols-2">
          {INCLUDE_LABELS.map(([k, label]) => (
            <Toggle
              key={k}
              checked={settings.include[k]}
              disabled={!canEdit}
              label={`${label} (${groups[label === "Pages" ? "Pages" : label === "Product categories" ? "Categories" : label === "Blog posts" ? "Blogs" : label === "Blog tags" ? "Tags" : label === "Country archives" ? "Countries" : label === "Job openings" ? "Jobs" : label] ?? 0})`}
              onChange={async (v) => { await db.saveSingleton("sitemap", { ...settings, include: { ...settings.include, [k]: v } }, `Sitemap: ${label} ${v ? "included" : "excluded"}`); }}
            />
          ))}
        </CardBody>
      </Card>
      <Card className="mt-4">
        <CardHeader title="Files" />
        <CardBody className="space-y-3 text-sm">
          <p className="flex items-center gap-2"><FileCode className="h-4 w-4 text-slate-400" /><code>{siteConfig.url}/sitemap.xml</code> <Badge tone="green">XML sitemap</Badge></p>
          <Toggle checked={settings.imageSitemap} disabled={!canEdit} label="Image sitemap (if required)" onChange={async (v) => { await db.saveSingleton("sitemap", { ...settings, imageSitemap: v }, `Image sitemap ${v ? "enabled" : "disabled"}`); }} />
          {settings.imageSitemap && <p className="flex items-center gap-2"><FileCode className="h-4 w-4 text-slate-400" /><code>{siteConfig.url}/sitemap-images.xml</code> <Badge tone="blue">Image sitemap</Badge></p>}
        </CardBody>
      </Card>
      <Overlay open={view} onClose={() => setView(false)} variant="drawer" title="sitemap.xml" description={`${entries.length} URLs`}>
        <pre className="max-h-[70vh] overflow-auto bg-ink p-4 text-[12px] leading-relaxed text-white/90">{xml}</pre>
      </Overlay>
    </div>
  );
}

/* --------------------------------- Robots --------------------------------- */

const SNIPPETS: { label: string; text: string }[] = [
  { label: "Allow everything", text: "User-agent: *\nAllow: /" },
  { label: "Block admin", text: "Disallow: /admin" },
  { label: "Block internal search", text: "Disallow: /*?q=" },
  { label: "Block API", text: "Disallow: /api/" },
  { label: "Sitemap line", text: `Sitemap: ${siteConfig.url}/sitemap.xml` },
];

export function RobotsScreen() {
  const can = useCan();
  const { toast, confirm } = useFeedback();
  const { value, ready } = useSingleton("robots");
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const [result, setResult] = useState<ReturnType<typeof validateRobots> | null>(null);
  if (!ready || !value) return <div className="h-64 animate-pulse border border-slate-200 bg-white" />;
  const current = text ?? value.rules;
  const canEdit = can("robots", "edit");
  const dirty = current !== value.rules;

  const validate = () => {
    const r = validateRobots(current);
    setResult(r);
    return r;
  };

  async function save() {
    const r = validate();
    if (!r.ok) return toast("Fix the errors before saving.", "error");
    const next: RobotsConfig = { rules: current, updatedAt: nowIso() };
    await db.saveSingleton("robots", next, "Updated robots.txt");
    setText(null);
    setEditing(false);
    toast("robots.txt saved.");
  }

  async function restore() {
    const ok = await confirm({ title: "Restore the default robots.txt?", description: "Your rules are replaced by the built-in default.", confirmLabel: "Restore default" });
    if (!ok) return;
    const { seedRobots } = await import("@/lib/admin/data/seed/seo");
    await db.saveSingleton("robots", seedRobots(), "Restored default robots.txt");
    setText(null);
    setResult(null);
    toast("Default restored.");
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Robots.txt"
        description="Tell search engines which parts of the site they may visit. Rules are validated before they can be saved."
        crumbs={[{ label: "SEO" }]}
        actions={
          <>
            {canEdit && !editing && <Button onClick={() => setEditing(true)}>Edit</Button>}
            <Button icon={<ShieldCheck className="h-3.5 w-3.5" />} onClick={validate}>
              Validate
            </Button>
            {canEdit && (
              <>
                <Button icon={<Wand2 className="h-3.5 w-3.5" />} onClick={restore}>
                  Restore Default
                </Button>
                <Button variant="primary" icon={<Save className="h-3.5 w-3.5" />} disabled={!editing || !dirty} onClick={save}>
                  Save
                </Button>
              </>
            )}
          </>
        }
      />
      <Card>
        <CardHeader title="robots.txt" description={`Last saved: ${fmt(value.updatedAt)}${dirty ? " (unsaved changes)" : ""}`} />
        <CardBody>
          <TextArea
            aria-label="robots.txt rules"
            rows={12}
            spellCheck={false}
            readOnly={!editing}
            value={current}
            onChange={(e) => { setText(e.target.value); setResult(null); }}
            className="font-mono text-[13px]"
          />
          {result && (
            <div className={cn("mt-3 border-l-2 px-3 py-2 text-sm", result.ok ? "border-emerald-500 bg-emerald-50 text-emerald-800" : "border-brand-red bg-brand-red/5 text-brand-red-dark")}>
              {result.ok ? "robots.txt looks valid." : result.errors.map((e) => <p key={e}>{e}</p>)}
              {result.warnings.map((w) => (
                <p key={w} className="text-amber-700">{w}</p>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
      <Card className="mt-4">
        <CardHeader title="Reference" description="Current sitemap URL and common rules. Click a rule to add it (while editing)." />
        <CardBody className="space-y-3">
          <p className="text-sm">
            Sitemap URL: <code>{siteConfig.url}/sitemap.xml</code>
          </p>
          <div className="flex flex-wrap gap-2">
            {SNIPPETS.map((s) => (
              <Button key={s.label} size="sm" disabled={!editing} onClick={() => { setText(`${current.replace(/\s*$/, "")}\n${s.text}\n`); setResult(null); }}>
                {s.label}
              </Button>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

/* --------------------------------- Schema --------------------------------- */

const SCOPES = ["global", "page", "product", "blog", "job", "location"];

export function SchemaScreen() {
  const can = useCan();
  const { toast } = useFeedback();
  const [draft, setDraft] = useState<(Partial<SchemaEntry> & { jsonLd: string; schemaType: SchemaType }) | null>(null);
  const [previewOf, setPreviewOf] = useState<SchemaEntry | null>(null);
  const canEdit = can("schema", "edit");
  const result = draft ? validateJsonLd(draft.jsonLd, draft.schemaType) : null;

  async function save() {
    if (!draft) return;
    if (!draft.name?.trim()) return toast("Give the schema a name.", "error");
    const v = validateJsonLd(draft.jsonLd, draft.schemaType);
    if (!v.ok) return toast("Fix the JSON-LD errors first.", "error");
    const patch = { schemaType: draft.schemaType, name: draft.name, scope: draft.scope ?? "global", jsonLd: draft.jsonLd, enabled: draft.enabled ?? true };
    if (draft.id) await db.update("schemas", draft.id, patch);
    else await db.create("schemas", { ...patch, status: "published" });
    toast("Schema saved.");
    setDraft(null);
  }

  return (
    <>
      <CollectionList
        collection="schemas"
        resource="schema"
        title="Schema (structured data)"
        description="Global: Organisation, Website, WebPage, Breadcrumb. Content: Product, Article, JobPosting, FAQ, LocalBusiness."
        singular="schema"
        crumbs={[{ label: "SEO" }]}
        hardDelete
        newLabel="Create Schema"
        onNew={() => setDraft({ schemaType: "Organization", name: "", scope: "global", enabled: true, jsonLd: JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: "" }, null, 2) })}
        onEdit={(r) => setDraft({ ...r })}
        exportName="schemas"
        searchText={(r) => `${r.name} ${r.schemaType} ${r.scope}`}
        columns={[
          { key: "name", header: "Schema", value: (r) => r.name, render: (r) => <span className="font-semibold text-ink">{r.name}</span> },
          { key: "type", header: "Type", value: (r) => r.schemaType },
          { key: "scope", header: "Scope", value: (r) => r.scope },
          { key: "valid", header: "Valid", value: (r) => validateJsonLd(r.jsonLd).ok, render: (r) => <YesNo value={validateJsonLd(r.jsonLd).ok} /> },
          { key: "on", header: "Status", value: (r) => r.enabled, render: (r) => <Badge tone={r.enabled ? "green" : "neutral"}>{r.enabled ? "Enabled" : "Disabled"}</Badge> },
        ]}
        filters={[{ key: "type", label: "Type", options: SCHEMA_TYPES.map((t) => ({ value: t, label: t })), match: (r, v) => r.schemaType === v }]}
        extraRowActions={(row) => [
          { label: "Preview", icon: <Eye className="h-3.5 w-3.5" />, onRun: () => setPreviewOf(row) },
          { label: "Validate", icon: <ShieldCheck className="h-3.5 w-3.5" />, onRun: () => { const v = validateJsonLd(row.jsonLd, row.schemaType); toast(v.ok ? "Valid JSON-LD." : v.errors[0], v.ok ? "success" : "error"); } },
          ...(canEdit ? [{ label: row.enabled ? "Disable" : "Enable", icon: <Power className="h-3.5 w-3.5" />, onRun: async (r: SchemaEntry) => { await db.update("schemas", r.id, { enabled: !r.enabled }); } }] : []),
        ]}
      />
      <Overlay
        open={!!draft}
        onClose={() => setDraft(null)}
        variant="drawer"
        title={draft?.id ? "Edit schema" : "Create schema"}
        footer={
          <>
            <Button onClick={() => setDraft(null)}>Cancel</Button>
            <Button variant="primary" icon={<Save className="h-3.5 w-3.5" />} onClick={save} disabled={!canEdit && !!draft?.id}>
              Save
            </Button>
          </>
        }
      >
        {draft && (
          <div className="space-y-4">
            <Field label="Name" required>
              <TextInput value={draft.name ?? ""} readOnly={!canEdit && !!draft.id} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Schema type">
                <Select value={draft.schemaType} onChange={(e) => setDraft({ ...draft, schemaType: e.target.value as SchemaType })}>
                  {SCHEMA_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Applies to">
                <Select value={draft.scope ?? "global"} onChange={(e) => setDraft({ ...draft, scope: e.target.value })}>
                  {SCOPES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Select>
              </Field>
            </div>
            <Toggle checked={draft.enabled ?? true} onChange={(v) => setDraft({ ...draft, enabled: v })} label="Enabled" />
            <Field label="JSON-LD" help="Use %title%, %url%, %image% ... as placeholders for values filled in per page.">
              <TextArea rows={14} spellCheck={false} className="font-mono text-[12.5px]" value={draft.jsonLd} onChange={(e) => setDraft({ ...draft, jsonLd: e.target.value })} />
            </Field>
            {result && (
              <div className={cn("border-l-2 px-3 py-2 text-sm", result.ok ? "border-emerald-500 bg-emerald-50 text-emerald-800" : "border-brand-red bg-brand-red/5 text-brand-red-dark")}>
                {result.ok ? `Valid (${result.types.join(", ")}).` : result.errors.map((e) => <p key={e}>{e}</p>)}
                {result.warnings.map((w) => (
                  <p key={w} className="text-amber-700">{w}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </Overlay>
      <Overlay open={!!previewOf} onClose={() => setPreviewOf(null)} variant="drawer" title={previewOf?.name ?? ""} description="How it appears in the page's <head>">
        <pre className="max-h-[70vh] overflow-auto bg-ink p-4 text-[12px] leading-relaxed text-white/90">{`<script type="application/ld+json">\n${previewOf?.jsonLd ?? ""}\n</script>`}</pre>
      </Overlay>
    </>
  );
}

