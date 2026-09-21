"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Copy, Eye, EyeOff, Plus, Save, Search, Trash2, UploadCloud } from "lucide-react";
import { db } from "@/lib/admin/data";
import { useSingleton } from "@/lib/admin/data/hooks";
import { emptySeo, newId, nowIso, textOf } from "@/lib/admin/data/defaults";
import type { PageDoc, PageKey, PageSection, SeoFields, SingletonKey, Status } from "@/lib/admin/data/types";
import { PAGE_SCHEMAS } from "@/lib/admin/pages/schemas";
import type { FieldDef } from "@/lib/admin/forms/types";
import { validateFields } from "@/lib/admin/forms/validate";
import type { Resource } from "@/lib/admin/access/permissions";
import { useCan } from "@/lib/admin/auth/AuthContext";
import { cn } from "@/lib/utils/cn";
import { Badge, StatusBadge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import { Card, CardBody, CardHeader } from "../../ui/Card";
import { useFeedback } from "../../ui/Feedback";
import { Overlay } from "../../ui/Overlay";
import { Breadcrumbs } from "../../ui/PageHeader";
import { Tabs } from "../../ui/Tabs";
import { FormFields } from "../../fields/FormFields";
import { Field, Select } from "../../fields/inputs";
import { SortableList } from "../../fields/Sortable";
import { SeoPanel } from "../../seo/SeoPanel";
import { SeoPreview } from "../../seo/SeoPreview";

type Rec = Record<string, unknown>;

interface PageAction {
  label: string;
  /** Link target (needs `resource` view permission), or a section to open. */
  href?: string;
  resource?: Resource;
  section?: string;
  test?: boolean;
}

/** Page-specific buttons from the PDF's "Needed Buttons" column. */
const PAGE_ACTIONS: Record<PageKey, PageAction[]> = {
  home: [{ label: "Select featured items", section: "featuredProducts" }],
  about: [{ label: "Manage gallery", section: "offices" }],
  products: [
    { label: "Manage filters", section: "explorer" },
    { label: "Select featured products", section: "featuredGroups" },
  ],
  blogs: [
    { label: "Manage categories", href: "/admin/blogs/categories", resource: "blogCategories" },
    { label: "Select featured posts", section: "featured" },
  ],
  careers: [
    { label: "Create job", href: "/admin/careers/openings/new", resource: "jobs" },
    { label: "Manage applications", href: "/admin/careers/applications", resource: "applications" },
    { label: "Export applications", href: "/admin/careers/applications", resource: "applications" },
  ],
  contact: [
    { label: "Manage enquiries", href: "/admin/enquiries/contact", resource: "enquiries" },
    { label: "Export enquiries", href: "/admin/enquiries/contact", resource: "enquiries" },
    { label: "Test form", test: true },
  ],
};

export function PageEditor({ pageKey }: { pageKey: PageKey }) {
  const key = `page_${pageKey}` as SingletonKey;
  const { value, ready } = useSingleton(key);
  if (!ready || !value) return <div className="h-64 animate-pulse border border-slate-200 bg-white" aria-label="Loading" />;
  return <PageBody key={pageKey} pageKey={pageKey} initial={value as PageDoc} />;
}

function PageBody({ pageKey, initial }: { pageKey: PageKey; initial: PageDoc }) {
  const schema = PAGE_SCHEMAS[pageKey];
  const key = `page_${pageKey}` as SingletonKey;
  const can = useCan();
  const { toast, confirm } = useFeedback();

  const [doc, setDoc] = useState<PageDoc>(initial);
  const [saved, setSaved] = useState(() => JSON.stringify(initial));
  const [tab, setTab] = useState("sections");
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);
  const [drawer, setDrawer] = useState<null | "preview" | "seo">(null);
  const [addType, setAddType] = useState("");
  const [info, setInfo] = useState<null | "duplicate" | "trash">(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  const canEdit = can("pages", "edit");
  const canSeo = can("pages", "seo");
  const canPublish = can("pages", "publish");
  const canCreate = can("pages", "create");
  const canDelete = can("pages", "delete");
  const readOnly = !canEdit;
  const seoOnly = readOnly && canSeo;
  const dirty = JSON.stringify(doc) !== saved;

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  // The form engine works on one record: { sections: [...], settings: {...}, seo, slug }.
  const record = doc as unknown as Rec;
  const setRecord = (next: Rec) => setDoc(next as unknown as PageDoc);

  const sectionFields = (section: PageSection): FieldDef[] => schema.sectionTypes[section.type]?.fields ?? [];
  const missingTypes = Object.keys(schema.sectionTypes).filter((t) => !doc.sections.some((s) => s.type === t));

  function focusSection(type: string) {
    setTab("sections");
    const sec = doc.sections.find((s) => s.type === type);
    if (!sec) return toast("That section is not on the page. Add it first.", "info");
    setOpen((o) => ({ ...o, [sec.id]: true }));
    setTimeout(() => refs.current[sec.id]?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  async function save(status?: Status) {
    if (!seoOnly) {
      const found: Record<string, string> = {};
      doc.sections.forEach((s, i) => {
        const errs = validateFields(sectionFields(s), doc, `sections.${i}.data`);
        Object.assign(found, errs);
      });
      setErrors(found);
      if (Object.keys(found).length) {
        toast(`Please fix ${Object.keys(found).length} field(s).`, "error");
        return;
      }
    }
    setBusy(true);
    try {
      const base = JSON.parse(saved) as PageDoc;
      const next: PageDoc = seoOnly ? { ...base, seo: doc.seo, slug: doc.slug } : { ...doc };
      if (status) next.status = status;
      next.updatedAt = nowIso();
      await db.saveSingleton(key, next, `Updated page "${textOf(next.title)}"${status ? ` (${status})` : ""}`);
      setDoc(next);
      setSaved(JSON.stringify(next));
      toast(status === "published" ? "Page published." : "Page saved.");
    } finally {
      setBusy(false);
    }
  }

  async function testForm() {
    await db.create("enquiries", {
      status: "published",
      source: "contact",
      name: "Test form submission",
      email: "test@example.com",
      phone: "",
      country: "",
      subject: "Test",
      message: "[Test] Created with the Contact page's Test Form button.",
      consent: true,
      receivedAt: nowIso(),
      enquiryStatus: "new",
    } as never);
    toast("Test enquiry added to Contact Enquiries.");
  }

  const actions = PAGE_ACTIONS[pageKey].filter((a) => !a.resource || can(a.resource, "view"));
  const title = textOf(doc.title);

  return (
    <div className="mx-auto max-w-5xl pb-24">
      <div className="mb-4">
        <Breadcrumbs items={[{ label: "Pages" }, { label: title }]} />
      </div>

      <div className="sticky top-0 z-20 -mx-4 mb-5 border-b border-slate-200 bg-paper/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-wrap items-center gap-2">
          <div className="min-w-0 flex-1">
            <h2 className="font-display truncate text-xl font-extrabold text-ink sm:text-2xl">{title} page</h2>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <StatusBadge status={doc.status} />
              {dirty && <Badge tone="amber">Unsaved changes</Badge>}
              {seoOnly && <Badge tone="blue">SEO-only access</Badge>}
              {readOnly && !seoOnly && <Badge>Read only</Badge>}
              <span className="text-xs text-slate-500">Live path: {schema.path}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button icon={<Eye className="h-3.5 w-3.5" />} onClick={() => setDrawer("preview")}>
              Preview
            </Button>
            {canSeo && (
              <Button icon={<Search className="h-3.5 w-3.5" />} onClick={() => setDrawer("seo")}>
                SEO Preview
              </Button>
            )}
            {canCreate && (
              <Button icon={<Copy className="h-3.5 w-3.5" />} onClick={() => setInfo("duplicate")}>
                Duplicate
              </Button>
            )}
            {canDelete && (
              <Button variant="danger" icon={<Trash2 className="h-3.5 w-3.5" />} onClick={() => setInfo("trash")}>
                Move to Trash
              </Button>
            )}
            {(canEdit || seoOnly) &&
              (seoOnly ? (
                <Button variant="dark" icon={<Save className="h-3.5 w-3.5" />} disabled={busy || !dirty} onClick={() => save()}>
                  Save SEO changes
                </Button>
              ) : (
                <>
                  <Button icon={<Save className="h-3.5 w-3.5" />} disabled={busy} onClick={() => save(canPublish ? "draft" : doc.status)}>
                    Save Draft
                  </Button>
                  {canPublish && (
                    <Button variant="primary" icon={<UploadCloud className="h-3.5 w-3.5" />} disabled={busy} onClick={() => save("published")}>
                      {doc.status === "published" ? "Update" : "Publish"}
                    </Button>
                  )}
                </>
              ))}
          </div>
        </div>
        {actions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {actions.map((a) => (
              <Button key={a.label} size="sm" variant="subtle" href={a.href} onClick={a.section ? () => focusSection(a.section!) : a.test ? testForm : undefined}>
                {a.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {schema.note && <p className="mb-4 text-sm text-slate-500">{schema.note}</p>}
      {seoOnly && <p className="mb-4 border-l-2 border-sky-500 bg-sky-50 px-3 py-2 text-sm text-sky-900">Your role can edit SEO fields only. Page content is read-only.</p>}

      <Tabs
        className="mb-5"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "sections", label: "Content sections", badge: <Badge>{doc.sections.length}</Badge> },
          ...(schema.settingsFields.length ? [{ id: "settings", label: "Navigation & settings" }] : []),
          ...(canSeo ? [{ id: "seo", label: "SEO" }] : []),
        ]}
      />

      {tab === "sections" && (
        <div className="space-y-3">
          <SortableList
            items={doc.sections}
            disabled={readOnly}
            onChange={(sections) => setRecord({ ...record, sections })}
            renderRow={(section, i, controls) => {
              const def = schema.sectionTypes[section.type];
              const expanded = open[section.id] ?? i === 0;
              return (
                <div ref={(el) => { refs.current[section.id] = el; }} className={cn("border bg-white", section.visible ? "border-slate-200" : "border-dashed border-slate-300 opacity-70")}>
                  <div className="flex items-center gap-1 pr-2">
                    {controls}
                    <button type="button" aria-expanded={expanded} onClick={() => setOpen((o) => ({ ...o, [section.id]: !expanded }))} className="flex min-w-0 flex-1 items-center gap-3 py-3 pl-1 text-left">
                      <span className="text-[11px] font-bold text-slate-400">{i + 1}</span>
                      <span className="truncate text-sm font-bold text-ink">{def?.label ?? section.type}</span>
                      {!section.visible && <Badge>Hidden</Badge>}
                      <ChevronDown className={cn("ml-auto h-4 w-4 shrink-0 text-slate-400 transition-transform", expanded && "rotate-180")} />
                    </button>
                    {!readOnly && (
                      <>
                        <button type="button" aria-label={section.visible ? "Hide section" : "Show section"} title={section.visible ? "Hide on the page" : "Show on the page"} onClick={() => setRecord({ ...record, sections: doc.sections.map((s, j) => (j === i ? { ...s, visible: !s.visible } : s)) })} className="flex h-8 w-8 items-center justify-center text-slate-400 hover:text-ink">
                          {section.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                        <button
                          type="button"
                          aria-label="Remove section"
                          onClick={async () => {
                            const ok = await confirm({ title: `Remove "${def?.label ?? section.type}"?`, description: "You can add it back later from 'Add section'.", confirmLabel: "Remove" });
                            if (ok) setRecord({ ...record, sections: doc.sections.filter((_, j) => j !== i) });
                          }}
                          className="flex h-8 w-8 items-center justify-center text-slate-400 hover:text-brand-red"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                  {expanded && (
                    <div className="border-t border-slate-100 p-4 sm:p-5">
                      {def?.description && <p className="mb-3 text-xs text-slate-500">{def.description}</p>}
                      <FormFields fields={sectionFields(section)} value={record} onChange={setRecord} readOnly={readOnly} errors={errors} basePath={`sections.${i}.data`} />
                    </div>
                  )}
                </div>
              );
            }}
          />
          {!readOnly && missingTypes.length > 0 && (
            <Card>
              <CardBody className="flex flex-wrap items-end gap-3">
                <Field label="Add section" className="min-w-[14rem] flex-1">
                  <Select value={addType} onChange={(e) => setAddType(e.target.value)}>
                    <option value="">Choose a section...</option>
                    {missingTypes.map((t) => (
                      <option key={t} value={t}>
                        {schema.sectionTypes[t].label}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Button
                  icon={<Plus className="h-3.5 w-3.5" />}
                  disabled={!addType}
                  onClick={() => {
                    setRecord({ ...record, sections: [...doc.sections, { id: newId("sec"), type: addType, visible: true, data: {} }] });
                    setAddType("");
                  }}
                >
                  Add section
                </Button>
              </CardBody>
            </Card>
          )}
        </div>
      )}

      {tab === "settings" && (
        <Card>
          <CardBody>
            <FormFields fields={schema.settingsFields.map((f) => prefix(f, "settings"))} value={record} onChange={setRecord} readOnly={readOnly} />
          </CardBody>
        </Card>
      )}

      {tab === "seo" && canSeo && (
        <div className="space-y-4">
          <Card>
            <CardHeader title="Page title" description="Used in the admin and as the fallback title." />
            <CardBody>
              <FormFields fields={[{ type: "text", name: "title", label: "Page title", localized: true }]} value={record} onChange={setRecord} readOnly={readOnly} />
            </CardBody>
          </Card>
          <SeoPanel record={record} onChange={setRecord} readOnly={!canSeo} hasSlug slugFrom="title" fallbackTitle={title} />
        </div>
      )}

      <Overlay open={drawer === "preview"} onClose={() => setDrawer(null)} variant="drawer" title={`Preview: ${title}`} description="Simplified outline of the sections, in order. Not the live page.">
        <ol className="space-y-3">
          {doc.sections.map((s, i) => (
            <li key={s.id} className={cn("border border-slate-200 p-4", !s.visible && "opacity-50")}>
              <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                {i + 1}. {schema.sectionTypes[s.type]?.label ?? s.type}
                {!s.visible && " (hidden)"}
              </p>
              <p className="font-display mt-1 text-lg font-extrabold text-ink">{sectionHeadline(s)}</p>
              {sectionSummary(s) && <p className="mt-1 text-sm text-slate-600">{sectionSummary(s)}</p>}
            </li>
          ))}
        </ol>
        {canSeo && (
          <div className="mt-6 border-t border-slate-200 pt-5">
            <SeoPreview seo={(doc.seo ?? emptySeo()) as SeoFields} slug={doc.slug} fallbackTitle={title} />
          </div>
        )}
      </Overlay>
      <Overlay open={drawer === "seo"} onClose={() => setDrawer(null)} variant="drawer" title="SEO Preview">
        <SeoPreview seo={(doc.seo ?? emptySeo()) as SeoFields} slug={doc.slug} fallbackTitle={title} />
      </Overlay>

      <Overlay
        open={info !== null}
        onClose={() => setInfo(null)}
        size="sm"
        title={info === "duplicate" ? "Duplicate this page?" : "Move this page to Trash?"}
        footer={<Button variant="primary" onClick={() => setInfo(null)}>Understood</Button>}
      >
        <p className="text-sm leading-relaxed text-slate-600">
          {info === "duplicate"
            ? `"${title}" is a core page of the website structure, so it cannot be duplicated as a new page. To reuse its content, copy the sections you need into another page.`
            : `"${title}" is a core page of the website (${schema.path}). Core pages cannot be trashed or deleted, because the site's menu and links depend on them. To take content offline, hide individual sections or set the page to Draft.`}
        </p>
      </Overlay>
    </div>
  );
}

function prefix(f: FieldDef, base: string): FieldDef {
  if (f.type === "group") return { ...f, fields: f.fields.map((x) => prefix(x, base)) };
  if (f.type === "info" || !("name" in f)) return f;
  return { ...f, name: `${base}.${f.name}` } as FieldDef;
}

function pickText(data: Rec, keys: string[]): string {
  for (const k of keys) {
    const t = textOf(data[k]);
    if (t) return t;
  }
  return "";
}

function sectionHeadline(s: PageSection): string {
  return pickText(s.data, ["headline1", "title", "headline", "pill", "eyebrow", "missionTitle"]) || "(no heading yet)";
}
function sectionSummary(s: PageSection): string {
  return pickText(s.data, ["subtitle", "copy", "description", "intro", "paragraph", "body", "missionCopy"]);
}
