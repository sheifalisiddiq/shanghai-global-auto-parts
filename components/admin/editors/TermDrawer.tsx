"use client";

import { useState, type ReactNode } from "react";
import { Copy, RotateCcw, Save, Trash2, UploadCloud } from "lucide-react";
import { db } from "@/lib/admin/data";
import { useEntity } from "@/lib/admin/data/hooks";
import { labelOf } from "@/lib/admin/data/defaults";
import type { CollectionKey, Status } from "@/lib/admin/data/types";
import type { FieldDef } from "@/lib/admin/forms/types";
import { validateFields } from "@/lib/admin/forms/validate";
import type { Resource } from "@/lib/admin/access/permissions";
import { useCan } from "@/lib/admin/auth/AuthContext";
import { Badge, SampleBadge, StatusBadge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useFeedback } from "../ui/Feedback";
import { Overlay } from "../ui/Overlay";
import { Tabs } from "../ui/Tabs";
import { FormFields } from "../fields/FormFields";
import { SeoPanel } from "../seo/SeoPanel";

type Rec = Record<string, unknown> & { id?: string; status?: Status; isSample?: boolean };

interface TermDrawerProps {
  collection: CollectionKey;
  resource: Resource;
  singular: string;
  /** null = closed; {} = new; {id} = edit */
  target: { id?: string } | null;
  onClose: () => void;
  fields: FieldDef[];
  makeNew: () => Rec;
  seo?: { lite?: boolean; slugFrom?: string; hasSlug?: boolean };
  /** Extra body (e.g. "Assign products") below the fields. */
  extra?: (ctx: { record: Rec; setRecord: (n: Rec) => void; readOnly: boolean }) => ReactNode;
}

/** Side-drawer editor for taxonomy terms (categories, countries, blog categories, tags). */
export function TermDrawer(props: TermDrawerProps) {
  const { entity } = useEntity(props.collection, props.target?.id);
  if (!props.target) return null;
  const initial = (entity ?? props.makeNew()) as Rec;
  return <DrawerBody key={props.target.id ?? "new"} {...props} initial={initial} />;
}

function DrawerBody({ initial, target, onClose, collection, resource, singular, fields, seo, extra }: TermDrawerProps & { initial: Rec }) {
  const can = useCan();
  const { toast, confirm } = useFeedback();
  const isNew = !target?.id;
  const [record, setRecord] = useState<Rec>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tab, setTab] = useState("details");
  const [busy, setBusy] = useState(false);

  const canEdit = isNew ? can(resource, "create") : can(resource, "edit");
  const canSeo = !!seo && can(resource, "seo");
  const canPublish = can(resource, "publish");
  const canDelete = can(resource, "delete");
  const canCreate = can(resource, "create");
  const seoOnly = !canEdit && canSeo;
  const trashed = record.status === "trash";
  const title = labelOf(record) || `New ${singular}`;

  async function save(status?: Status) {
    if (!seoOnly) {
      const found = validateFields(fields, record);
      setErrors(found);
      if (Object.keys(found).length) {
        setTab("details");
        toast(`Please fix ${Object.keys(found).length} field(s).`, "error");
        return;
      }
    }
    setBusy(true);
    try {
      const patch = seoOnly ? { seo: record.seo, slug: record.slug } : { ...record };
      if (status) (patch as Rec).status = status;
      if (isNew) await db.create(collection, { ...patch, status: status ?? "draft" } as never);
      else {
        const { id: _id, ...rest } = patch as Rec;
        void _id;
        await db.update(collection, target!.id!, rest as never);
      }
      toast(`${singular[0].toUpperCase()}${singular.slice(1)} saved.`);
      onClose();
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setBusy(false);
    }
  }

  async function trash() {
    const ok = await confirm({ title: `Move this ${singular} to Trash?`, description: "It can be restored later.", confirmLabel: "Move to Trash" });
    if (!ok) return;
    await db.trash(collection, target!.id!);
    toast("Moved to Trash.");
    onClose();
  }

  return (
    <Overlay
      open
      onClose={onClose}
      variant="drawer"
      title={title}
      description={
        <span className="flex flex-wrap items-center gap-2">
          {record.status && <StatusBadge status={record.status} />}
          {record.isSample && <SampleBadge />}
          {seoOnly && <Badge tone="blue">SEO-only access</Badge>}
        </span>
      }
      footer={
        <>
          {!isNew && canCreate && !trashed && (
            <Button icon={<Copy className="h-3.5 w-3.5" />} onClick={async () => { await db.duplicate(collection, target!.id!); toast("Duplicated as a draft."); onClose(); }}>
              Duplicate
            </Button>
          )}
          {!isNew && canDelete && !trashed && (
            <Button variant="danger" icon={<Trash2 className="h-3.5 w-3.5" />} onClick={trash}>
              Trash
            </Button>
          )}
          {trashed && canDelete && (
            <Button icon={<RotateCcw className="h-3.5 w-3.5" />} onClick={async () => { await db.restore(collection, target!.id!); toast("Restored."); onClose(); }}>
              Restore
            </Button>
          )}
          <span className="flex-1" />
          <Button onClick={onClose}>Close</Button>
          {!trashed && (canEdit || seoOnly) && (
            <>
              <Button icon={<Save className="h-3.5 w-3.5" />} variant={seoOnly || !canPublish ? "primary" : "subtle"} onClick={() => save(seoOnly ? undefined : canPublish ? "draft" : undefined)} disabled={busy}>
                {seoOnly ? "Save SEO changes" : canPublish ? "Save Draft" : "Save"}
              </Button>
              {canPublish && !seoOnly && (
                <Button variant="primary" icon={<UploadCloud className="h-3.5 w-3.5" />} onClick={() => save("published")} disabled={busy}>
                  {record.status === "published" ? "Update" : "Publish"}
                </Button>
              )}
            </>
          )}
        </>
      }
    >
      {canSeo && <Tabs className="mb-5" tabs={[{ id: "details", label: "Details" }, { id: "seo", label: "SEO" }]} value={tab} onChange={setTab} />}
      {tab === "seo" && canSeo ? (
        <SeoPanel record={record} onChange={(n) => setRecord(n as Rec)} readOnly={!canSeo} lite={seo?.lite} hasSlug={false} fallbackTitle={title} />
      ) : (
        <div className="space-y-5">
          <FormFields fields={fields} value={record} onChange={(n) => setRecord(n as Rec)} readOnly={!canEdit} errors={errors} />
          {extra?.({ record, setRecord: (n) => setRecord(n), readOnly: !canEdit })}
        </div>
      )}
    </Overlay>
  );
}
