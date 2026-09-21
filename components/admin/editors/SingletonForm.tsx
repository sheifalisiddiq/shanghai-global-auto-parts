"use client";

import { useState, type ReactNode } from "react";
import { RotateCcw, Save } from "lucide-react";
import { db } from "@/lib/admin/data";
import { useSingleton } from "@/lib/admin/data/hooks";
import type { SingletonKey, SingletonMap } from "@/lib/admin/data/types";
import type { FieldDef } from "@/lib/admin/forms/types";
import { validateFields } from "@/lib/admin/forms/validate";
import type { Resource } from "@/lib/admin/access/permissions";
import { useCan } from "@/lib/admin/auth/AuthContext";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card, CardBody } from "../ui/Card";
import { useFeedback } from "../ui/Feedback";
import { PageHeader, type Crumb } from "../ui/PageHeader";
import { FormFields } from "../fields/FormFields";

type Rec = Record<string, unknown>;

/** Settings-style screen for a single stored object (SEO global, Settings ...). */
export function SingletonForm<K extends SingletonKey>({
  storeKey,
  resource,
  title,
  description,
  crumbs,
  fields,
  columns,
  loadDefault,
  extraActions,
  below,
  summary,
}: {
  storeKey: K;
  resource: Resource;
  title: string;
  description?: string;
  crumbs?: Crumb[];
  fields: FieldDef[];
  columns?: boolean;
  /** "Reset to Default": returns the built-in default value. */
  loadDefault?: () => Promise<SingletonMap[K]>;
  extraActions?: (ctx: { value: Rec }) => ReactNode;
  below?: (ctx: { value: Rec }) => ReactNode;
  summary?: string;
}) {
  const { value, ready } = useSingleton(storeKey);
  if (!ready || !value) return <div className="h-64 animate-pulse border border-slate-200 bg-white" aria-label="Loading" />;
  return (
    <Body
      key={JSON.stringify((value as Rec).updatedAt ?? "x")}
      initial={value as unknown as Rec}
      storeKey={storeKey}
      resource={resource}
      title={title}
      description={description}
      crumbs={crumbs}
      fields={fields}
      columns={columns}
      loadDefault={loadDefault as (() => Promise<unknown>) | undefined}
      extraActions={extraActions}
      below={below}
      summary={summary}
    />
  );
}

function Body({
  initial,
  storeKey,
  resource,
  title,
  description,
  crumbs,
  fields,
  columns,
  loadDefault,
  extraActions,
  below,
  summary,
}: {
  initial: Rec;
  storeKey: SingletonKey;
  resource: Resource;
  title: string;
  description?: string;
  crumbs?: Crumb[];
  fields: FieldDef[];
  columns?: boolean;
  loadDefault?: () => Promise<unknown>;
  extraActions?: (ctx: { value: Rec }) => ReactNode;
  below?: (ctx: { value: Rec }) => ReactNode;
  summary?: string;
}) {
  const can = useCan();
  const { toast, confirm } = useFeedback();
  const canEdit = can(resource, "edit");
  const [value, setValue] = useState<Rec>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(JSON.stringify(initial));
  const dirty = JSON.stringify(value) !== saved;

  async function save() {
    const found = validateFields(fields, value);
    setErrors(found);
    if (Object.keys(found).length) return toast(`Please fix ${Object.keys(found).length} field(s).`, "error");
    const next = { ...value, updatedAt: new Date().toISOString() };
    await db.saveSingleton(storeKey, next as never, summary ?? `Updated ${title}`);
    setValue(next);
    setSaved(JSON.stringify(next));
    toast(`${title} saved.`);
  }

  async function reset() {
    if (!loadDefault) return;
    const ok = await confirm({ title: "Reset to default?", description: "Your changes on this screen are replaced by the built-in defaults.", confirmLabel: "Reset to default" });
    if (!ok) return;
    const def = (await loadDefault()) as Rec;
    await db.saveSingleton(storeKey, def as never, `Reset ${title} to default`);
    setValue(def);
    setSaved(JSON.stringify(def));
    toast("Reset to default.");
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title={title}
        description={description}
        crumbs={crumbs}
        actions={
          <>
            {dirty && <Badge tone="amber">Unsaved changes</Badge>}
            {!canEdit && <Badge>Read only</Badge>}
            {extraActions?.({ value })}
            {canEdit && loadDefault && (
              <Button icon={<RotateCcw className="h-3.5 w-3.5" />} onClick={reset}>
                Reset to Default
              </Button>
            )}
            {canEdit && (
              <Button variant="primary" icon={<Save className="h-3.5 w-3.5" />} onClick={save} disabled={!dirty}>
                Save
              </Button>
            )}
          </>
        }
      />
      <Card>
        <CardBody>
          <FormFields fields={fields} value={value} onChange={setValue} readOnly={!canEdit} errors={errors} columns={columns} />
        </CardBody>
      </Card>
      {below?.({ value })}
    </div>
  );
}
