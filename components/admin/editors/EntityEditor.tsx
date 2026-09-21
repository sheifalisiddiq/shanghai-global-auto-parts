/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Archive, CalendarClock, Copy, Eye, RotateCcw, Save, Search, Trash2, UploadCloud } from "lucide-react";
import { db } from "@/lib/admin/data";
import { useEntity } from "@/lib/admin/data/hooks";
import type { CollectionKey, SeoFields, Status } from "@/lib/admin/data/types";
import { emptySeo, labelOf, nowIso } from "@/lib/admin/data/defaults";
import { validateFields } from "@/lib/admin/forms/validate";
import type { FieldDef } from "@/lib/admin/forms/types";
import type { Resource } from "@/lib/admin/access/permissions";
import { useCan } from "@/lib/admin/auth/AuthContext";
import { Breadcrumbs, type Crumb } from "../ui/PageHeader";
import { Badge, SampleBadge, StatusBadge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card, CardBody, EmptyState } from "../ui/Card";
import { useFeedback } from "../ui/Feedback";
import { Overlay } from "../ui/Overlay";
import { Tabs } from "../ui/Tabs";
import { FormFields } from "../fields/FormFields";
import { Field, TextInput } from "../fields/inputs";
import { SeoPanel } from "../seo/SeoPanel";
import { SeoPreview } from "../seo/SeoPreview";

type Rec = Record<string, unknown> & { id?: string; status?: Status; isSample?: boolean };

export interface EditorTab {
  id: string;
  label: string;
  fields?: FieldDef[];
  columns?: boolean;
  /** Custom body (relations, hierarchy views ...). */
  render?: (ctx: { record: Rec; setRecord: (next: Rec) => void; readOnly: boolean; errors: Record<string, string> }) => ReactNode;
}

export interface PreviewData {
  title: string;
  image?: string;
  summary?: string;
  html?: string;
  meta?: string[];
}

export interface EntityEditorProps {
  collection: CollectionKey;
  resource: Resource;
  /** undefined = create a new record. */
  id?: string;
  singular: string;
  listHref: string;
  listLabel: string;
  crumbs?: Crumb[];
  tabs: EditorTab[];
  makeNew: () => Rec;
  /** Entity has SEO fields (shows the SEO tab when the role has the `seo` action). */
  seo?: { lite?: boolean; hasSlug?: boolean; slugFrom?: string };
  preview?: (record: Rec) => PreviewData;
  /** Posts: adds a Schedule action. */
  schedule?: boolean;
  /** Adds an Archive action. */
  archivable?: boolean;
  /** Extra buttons in the action bar. */
  extraActions?: (ctx: { record: Rec; readOnly: boolean }) => ReactNode;
}

export function EntityEditor(props: EntityEditorProps) {
  const { entity, ready } = useEntity(props.collection, props.id);
  if (!ready) return <div className="h-64 animate-pulse border border-slate-200 bg-white" aria-label="Loading" />;
  if (props.id && !entity) {
    return (
      <Card>
        <EmptyState
          title={`This ${props.singular} was not found`}
          description="It may have been permanently deleted."
          action={<Button variant="primary" href={props.listHref}>{`Back to ${props.listLabel}`}</Button>}
        />
      </Card>
    );
  }
  return <EditorBody key={entity?.id ?? "new"} {...props} initial={(entity ?? props.makeNew()) as Rec} />;
}

function EditorBody({ initial, ...p }: EntityEditorProps & { initial: Rec }) {
  const router = useRouter();
  const can = useCan();
  const { toast, confirm } = useFeedback();
  const isNew = !p.id;

  const [record, setRecord] = useState<Rec>(initial);
  const [saved, setSaved] = useState<string>(() => JSON.stringify(initial));
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tab, setTab] = useState(p.tabs[0]?.id ?? "content");
  const [drawer, setDrawer] = useState<null | "preview" | "seo">(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleAt, setScheduleAt] = useState("");

  const canEdit = isNew ? can(p.resource, "create") : can(p.resource, "edit");
  const canSeo = !!p.seo && can(p.resource, "seo");
  const canPublish = can(p.resource, "publish");
  const canDelete = can(p.resource, "delete");
  const canCreate = can(p.resource, "create");
  const readOnly = !canEdit;
  const seoOnly = readOnly && canSeo;
  const trashed = record.status === "trash";
  const dirty = JSON.stringify(record) !== saved;
  const title = labelOf(record) || `New ${p.singular}`;

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const allTabs = useMemo(() => [...p.tabs, ...(canSeo ? [{ id: "seo", label: "SEO" } as EditorTab] : [])], [p.tabs, canSeo]);

  const validate = () => {
    const found: Record<string, string> = {};
    for (const t of p.tabs) if (t.fields) Object.assign(found, validateFields(t.fields, record));
    setErrors(found);
    if (Object.keys(found).length) {
      const badTab = p.tabs.find((t) => t.fields && Object.keys(validateFields(t.fields, record)).length);
      if (badTab) setTab(badTab.id);
      toast(`Please fix ${Object.keys(found).length} field(s) before saving.`, "error");
      return false;
    }
    return true;
  };

  async function persist(status: Status | undefined, extra: Rec = {}) {
    // SEO-only users may only change SEO fields (and slug), never content.
    if (!seoOnly && !validate()) return;
    setBusy(true);
    try {
      let patch: Rec = { ...record, ...extra };
      if (seoOnly) {
        const base = JSON.parse(saved) as Rec;
        patch = { ...base, seo: record.seo as SeoFields, slug: record.slug ?? base.slug };
      }
      if (status) patch.status = status;
      if (isNew) {
        const created = await db.create(p.collection, { ...patch, status: status ?? "draft" } as never);
        setSaved(JSON.stringify(record));
        toast(`${cap(p.singular)} created.`);
        router.replace(`${p.listHref}/${(created as { id: string }).id}`);
      } else {
        const { id: _id, ...rest } = patch;
        void _id;
        const updated = await db.update(p.collection, p.id!, rest as never);
        setRecord(updated as unknown as Rec);
        setSaved(JSON.stringify(updated));
        toast(status === "published" ? `${cap(p.singular)} published.` : `${cap(p.singular)} saved.`);
      }
    } catch (e) {
      toast((e as Error).message || "Could not save", "error");
    } finally {
      setBusy(false);
    }
  }

  async function duplicate() {
    const copy = await db.duplicate(p.collection, p.id!);
    toast(`Duplicated as a draft.`);
    router.push(`${p.listHref}/${(copy as { id: string }).id}`);
  }

  async function trash() {
    const ok = await confirm({
      title: `Move this ${p.singular} to Trash?`,
      description: "It will be hidden from lists and the website, and can be restored from the Trash filter at any time.",
      confirmLabel: "Move to Trash",
    });
    if (!ok) return;
    await db.trash(p.collection, p.id!);
    toast(`Moved to Trash.`);
    router.push(p.listHref);
  }

  async function restore() {
    await db.restore(p.collection, p.id!);
    toast("Restored as a draft.");
  }

  async function purge() {
    const ok = await confirm({
      title: `Permanently delete this ${p.singular}?`,
      description: "This cannot be undone.",
      confirmLabel: "Delete permanently",
      requireText: "DELETE",
    });
    if (!ok) return;
    await db.purge(p.collection, p.id!);
    toast("Deleted permanently.");
    router.push(p.listHref);
  }

  const preview = p.preview?.(record);
  const seo = (record.seo as SeoFields | undefined) ?? emptySeo();
  const publishedLabel = record.status === "published" ? "Update" : "Publish";

  return (
    <div className="mx-auto max-w-5xl pb-24">
      <div className="mb-4">
        <Breadcrumbs items={[...(p.crumbs ?? []), { label: p.listLabel, href: p.listHref }, { label: isNew ? `New ${p.singular}` : title }]} />
      </div>

      <div className="sticky top-0 z-20 -mx-4 mb-5 border-b border-slate-200 bg-paper/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-wrap items-center gap-2">
          <div className="min-w-0 flex-1">
            <h2 className="font-display truncate text-xl font-extrabold text-ink sm:text-2xl">{title}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              {record.status && <StatusBadge status={record.status} />}
              {record.isSample && <SampleBadge />}
              {dirty && <Badge tone="amber">Unsaved changes</Badge>}
              {seoOnly && <Badge tone="blue">SEO-only access</Badge>}
              {readOnly && !seoOnly && <Badge>Read only</Badge>}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {preview && (
              <Button icon={<Eye className="h-3.5 w-3.5" />} onClick={() => setDrawer("preview")}>
                Preview
              </Button>
            )}
            {canSeo && (
              <Button icon={<Search className="h-3.5 w-3.5" />} onClick={() => setDrawer("seo")}>
                SEO Preview
              </Button>
            )}
            {p.extraActions?.({ record, readOnly })}
            {!isNew && canCreate && !trashed && (
              <Button icon={<Copy className="h-3.5 w-3.5" />} onClick={duplicate}>
                Duplicate
              </Button>
            )}
            {!isNew && p.archivable && canPublish && !trashed && record.status !== "archived" && (
              <Button icon={<Archive className="h-3.5 w-3.5" />} onClick={() => persist("archived")} disabled={busy}>
                Archive
              </Button>
            )}
            {!isNew && canDelete && !trashed && (
              <Button variant="danger" icon={<Trash2 className="h-3.5 w-3.5" />} onClick={trash}>
                Move to Trash
              </Button>
            )}
            {trashed && canDelete && (
              <>
                <Button icon={<RotateCcw className="h-3.5 w-3.5" />} onClick={restore}>
                  Restore
                </Button>
                <Button variant="danger" icon={<Trash2 className="h-3.5 w-3.5" />} onClick={purge}>
                  Delete permanently
                </Button>
              </>
            )}
            {!trashed && (canEdit || seoOnly) && (
              <>
                {seoOnly ? (
                  <Button variant="dark" icon={<Save className="h-3.5 w-3.5" />} onClick={() => persist(undefined)} disabled={busy || !dirty}>
                    Save SEO changes
                  </Button>
                ) : (
                  <>
                    <Button icon={<Save className="h-3.5 w-3.5" />} onClick={() => persist(canPublish ? "draft" : record.status === "published" ? "published" : "draft")} disabled={busy}>
                      Save Draft
                    </Button>
                    {p.schedule && canPublish && (
                      <Button icon={<CalendarClock className="h-3.5 w-3.5" />} onClick={() => setScheduleOpen(true)} disabled={busy}>
                        Schedule
                      </Button>
                    )}
                    {canPublish && (
                      <Button variant="primary" icon={<UploadCloud className="h-3.5 w-3.5" />} onClick={() => persist("published")} disabled={busy}>
                        {publishedLabel}
                      </Button>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {seoOnly && (
        <p className="mb-4 border-l-2 border-sky-500 bg-sky-50 px-3 py-2 text-sm text-sky-900">
          Your role can edit SEO fields only. Content is shown read-only; open the SEO tab to make changes.
        </p>
      )}
      {readOnly && !seoOnly && <p className="mb-4 border-l-2 border-slate-400 bg-slate-100 px-3 py-2 text-sm text-slate-700">You have view-only access to this item.</p>}

      {allTabs.length > 1 && <Tabs tabs={allTabs.map((t) => ({ id: t.id, label: t.label }))} value={tab} onChange={setTab} className="mb-5" />}

      {allTabs.map((t) =>
        t.id === tab ? (
          <div key={t.id}>
            {t.id === "seo" ? (
              <SeoPanel
                record={record}
                onChange={(next) => setRecord(next as Rec)}
                readOnly={!canSeo}
                lite={p.seo?.lite}
                hasSlug={p.seo?.hasSlug ?? true}
                slugFrom={p.seo?.slugFrom ?? "name"}
                fallbackTitle={title}
              />
            ) : t.render ? (
              t.render({ record, setRecord: (n) => setRecord(n), readOnly, errors })
            ) : (
              <Card>
                <CardBody>
                  <FormFields fields={t.fields ?? []} value={record} onChange={(next) => setRecord(next as Rec)} readOnly={readOnly} errors={errors} columns={t.columns} />
                </CardBody>
              </Card>
            )}
          </div>
        ) : null,
      )}

      <Overlay open={drawer === "preview"} onClose={() => setDrawer(null)} variant="drawer" title="Preview" description="A simplified preview, not the live page.">
        {preview && <PreviewBody data={preview} />}
        {canSeo && (
          <div className="mt-6 border-t border-slate-200 pt-5">
            <SeoPreview seo={seo} slug={String(record.slug ?? "")} fallbackTitle={title} />
          </div>
        )}
      </Overlay>
      <Overlay open={drawer === "seo"} onClose={() => setDrawer(null)} variant="drawer" title="SEO Preview" description="How this item looks in search and when shared.">
        <SeoPreview seo={seo} slug={String(record.slug ?? "")} fallbackTitle={title} />
      </Overlay>

      <Overlay
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        title="Schedule publishing"
        size="sm"
        footer={
          <>
            <Button onClick={() => setScheduleOpen(false)}>Cancel</Button>
            <Button
              variant="primary"
              disabled={!scheduleAt}
              onClick={async () => {
                setScheduleOpen(false);
                await persist("scheduled", { scheduledAt: new Date(scheduleAt).toISOString(), publishDate: new Date(scheduleAt).toISOString() });
              }}
            >
              Schedule
            </Button>
          </>
        }
      >
        <Field label="Publish on" help="The post stays hidden until this date and time.">
          <TextInput type="datetime-local" value={scheduleAt} min={nowIso().slice(0, 16)} onChange={(e) => setScheduleAt(e.target.value)} />
        </Field>
      </Overlay>
    </div>
  );
}

function PreviewBody({ data }: { data: PreviewData }) {
  return (
    <article className="space-y-3">
      {data.image && <img src={data.image} alt="" className="max-h-64 w-full border border-slate-200 object-cover" />}
      {data.meta && data.meta.length > 0 && <p className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">{data.meta.join(" · ")}</p>}
      <h3 className="font-display text-2xl font-extrabold text-ink">{data.title}</h3>
      {data.summary && <p className="text-sm text-slate-600">{data.summary}</p>}
      {data.html && (
        <div
          className="text-sm leading-relaxed text-ink [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-extrabold [&_h3]:mt-3 [&_h3]:font-bold [&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: data.html }}
        />
      )}
    </article>
  );
}

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

