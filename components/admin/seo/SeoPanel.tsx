"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { SCHEMA_TYPES, type SeoFields } from "@/lib/admin/data/types";
import type { FieldDef } from "@/lib/admin/forms/types";
import { seoChecklist, validateJsonLd } from "@/lib/admin/seo/checks";
import { Card, CardBody, CardHeader } from "../ui/Card";
import { Collapsible } from "../ui/Collapsible";
import { FormFields } from "../fields/FormFields";
import { SeoPreview } from "./SeoPreview";

type Rec = Record<string, unknown>;

function essentials(hasSlug: boolean, slugFrom: string): FieldDef[] {
  return [
    { type: "text", name: "seo.metaTitle", label: "Meta title", localized: true, max: 60, help: "Shown as the clickable headline in search results." },
    { type: "textarea", name: "seo.metaDescription", label: "Meta description", localized: true, rows: 3, max: 160, help: "The short summary under the headline." },
    { type: "text", name: "seo.focusKeyword", label: "Focus keyword", help: "The main phrase this page should rank for." },
    ...(hasSlug ? ([{ type: "slug", name: "slug", label: "Slug / permalink", from: slugFrom }] as FieldDef[]) : []),
  ];
}

const advanced = (lite: boolean): FieldDef[] => [
  { type: "url", name: "seo.canonicalUrl", label: "Canonical URL", placeholder: "Leave empty to use the page's own URL" },
  {
    type: "group",
    label: "Search visibility",
    fields: [
      { type: "toggle", name: "seo.index", label: "Index (let search engines list this page)", help: "Off = Noindex." },
      ...(lite ? [] : ([{ type: "toggle", name: "seo.follow", label: "Follow (let search engines follow links)", help: "Off = Nofollow." }] as FieldDef[])),
      { type: "toggle", name: "seo.sitemapInclude", label: "Include in sitemap" },
    ],
  },
  ...(lite
    ? []
    : ([
        {
          type: "group",
          label: "Social sharing (Open Graph and X / Twitter)",
          collapsed: true,
          fields: [
            { type: "text", name: "seo.og.title", label: "Open Graph title", localized: true },
            { type: "textarea", name: "seo.og.description", label: "Open Graph description", localized: true, rows: 2 },
            { type: "image", name: "seo.og.image", label: "Open Graph image" },
            {
              type: "select",
              name: "seo.twitter.card",
              label: "X / Twitter card",
              options: [
                { value: "summary_large_image", label: "Large image" },
                { value: "summary", label: "Compact" },
              ],
            },
            { type: "text", name: "seo.twitter.title", label: "X / Twitter title", localized: true },
            { type: "textarea", name: "seo.twitter.description", label: "X / Twitter description", localized: true, rows: 2 },
            { type: "image", name: "seo.twitter.image", label: "X / Twitter image" },
          ],
        },
        {
          type: "group",
          label: "Schema (structured data)",
          collapsed: true,
          fields: [
            {
              type: "select",
              name: "seo.schemaType",
              label: "Schema type",
              allowEmpty: true,
              options: SCHEMA_TYPES.map((t) => ({ value: t, label: t })),
            },
            { type: "textarea", name: "seo.customJsonLd", label: "Custom JSON-LD override", rows: 8, help: "Optional. Replaces the automatic schema for this item. Must be valid JSON." },
          ],
        },
      ] as FieldDef[])),
];

/**
 * The PDF's per-item SEO controls. Rendered by the editor ONLY when the current
 * role has the `seo` action for the resource (see canSeo); this component never
 * looks at role names. Essentials are always visible, the rest sit in a
 * collapsible "Advanced" panel.
 */
export function SeoPanel({
  record,
  onChange,
  readOnly,
  lite = false,
  hasSlug = true,
  slugFrom = "name",
  fallbackTitle,
}: {
  record: Rec;
  onChange: (next: Rec) => void;
  readOnly?: boolean;
  /** Tags: only index / sitemap / canonical. */
  lite?: boolean;
  hasSlug?: boolean;
  slugFrom?: string;
  fallbackTitle: string;
}) {
  const seo = record.seo as SeoFields | undefined;
  const slug = String(record.slug ?? "");
  const [previewLang, setPreviewLang] = useState<"en" | "ar">("en");
  const checks = useMemo(() => (seo && !lite ? seoChecklist(seo, slug) : []), [seo, slug, lite]);
  const jsonLd = seo?.customJsonLd?.trim() ? validateJsonLd(seo.customJsonLd) : null;
  if (!seo) return null;

  return (
    <div className="space-y-4">
      {!lite && (
        <Card>
          <CardHeader title="Search engine essentials" description="What Google shows for this page." />
          <CardBody>
            <FormFields fields={essentials(hasSlug, slugFrom)} value={record} onChange={onChange} readOnly={readOnly} />
          </CardBody>
        </Card>
      )}

      {!lite && (
        <Card>
          <CardHeader
            title="SEO preview"
            actions={
              <div className="inline-flex border border-slate-200 text-[11px] font-bold uppercase">
                {(["en", "ar"] as const).map((l) => (
                  <button key={l} type="button" onClick={() => setPreviewLang(l)} className={previewLang === l ? "bg-ink px-2.5 py-1 text-white" : "px-2.5 py-1 text-slate-500 hover:text-ink"}>
                    {l}
                  </button>
                ))}
              </div>
            }
          />
          <CardBody>
            <SeoPreview seo={seo} slug={slug} fallbackTitle={fallbackTitle} lang={previewLang} />
          </CardBody>
        </Card>
      )}

      {checks.length > 0 && (
        <Card>
          <CardHeader title="Checklist" description="Quick guidance, not a ranking guarantee." />
          <CardBody>
            <ul className="grid gap-2 sm:grid-cols-2">
              {checks.map((c) => (
                <li key={c.label} className="flex items-start gap-2 text-sm">
                  {c.ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> : <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />}
                  <span className={c.ok ? "text-ink" : "text-slate-500"}>{c.label}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}

      <Collapsible title="Advanced SEO" hint="Canonical, indexing, sitemap, social and schema">
        <FormFields fields={advanced(lite)} value={record} onChange={onChange} readOnly={readOnly} />
        {jsonLd && (
          <div className={`mt-4 border-l-2 px-3 py-2 text-xs ${jsonLd.ok ? "border-emerald-500 bg-emerald-50 text-emerald-800" : "border-brand-red bg-brand-red/5 text-brand-red-dark"}`}>
            {jsonLd.ok ? `Valid JSON-LD (${jsonLd.types.join(", ")}).` : jsonLd.errors.map((e) => <p key={e}>{e}</p>)}
            {jsonLd.warnings.map((w) => (
              <p key={w} className="text-amber-700">
                {w}
              </p>
            ))}
          </div>
        )}
      </Collapsible>
    </div>
  );
}
