"use client";

import { useMemo, useState } from "react";
import { Pencil } from "lucide-react";
import { db } from "@/lib/admin/data";
import { useActiveRows } from "@/lib/admin/data/hooks";
import { textOf } from "@/lib/admin/data/defaults";
import { newProduct } from "@/lib/admin/data/factories";
import type { Product } from "@/lib/admin/data/types";
import type { FieldDef } from "@/lib/admin/forms/types";
import { useCan } from "@/lib/admin/auth/AuthContext";
import { CollectionList } from "../../editors/CollectionList";
import { EntityEditor } from "../../editors/EntityEditor";
import { BulkEditDialog, HierarchyTrail } from "../../editors/helpers";
import { FormFields, useOptionList } from "../../fields/FormFields";
import { ImageThumb } from "../../fields/MediaPicker";
import { StatusBadge, YesNo } from "../../ui/Badge";
import { Card, CardBody } from "../../ui/Card";

const T = (name: string, label: string, extra: Partial<{ required: boolean; max: number; help: string; placeholder: string }> = {}): FieldDef => ({ type: "text", name, label, localized: true, ...extra });
const TA = (name: string, label: string, rows = 3): FieldDef => ({ type: "textarea", name, label, localized: true, rows });

const BASIC: FieldDef[] = [
  T("name", "Product name", { required: true }),
  { type: "slug", name: "slug", label: "Slug / permalink", from: "name" },
  { type: "text", name: "sku", label: "Product code / SKU", required: true },
  { type: "strings", name: "oemNumbers", label: "OE / OEM numbers", placeholder: "Add an OE number and press Enter" },
  { type: "select", name: "brandId", label: "Brand", optionsFrom: "brands", required: true },
  { type: "select", name: "modelId", label: "Model", optionsFrom: "models", help: "Primary model. Add more vehicles under Compatibility." },
  { type: "select", name: "categoryId", label: "Product category", optionsFrom: "categories", required: true },
  { type: "multiselect", name: "countryIds", label: "Country taxonomy", optionsFrom: "countries" },
  { type: "strings", name: "tags", label: "Tags" },
  { type: "toggle", name: "featured", label: "Featured product" },
];

const COMPAT: FieldDef[] = [
  { type: "text", name: "yearGeneration", label: "Vehicle year / generation / variant", placeholder: "e.g. 2022+ (T1E)" },
  {
    type: "repeater",
    name: "fitment",
    label: "Compatible models (confirmed fitment)",
    addLabel: "Add compatible vehicle",
    titleKey: "years",
    item: [
      { type: "select", name: "brandId", label: "Brand", optionsFrom: "brands" },
      { type: "select", name: "modelId", label: "Model", optionsFrom: "models", allowEmpty: true },
      { type: "text", name: "years", label: "Years / generation" },
    ],
  },
  { type: "strings", name: "crossReferences", label: "Alternate / cross-reference numbers" },
];

const CONTENT: FieldDef[] = [
  TA("shortDescription", "Short description", 2),
  { type: "richtext", name: "fullDescription", label: "Full description", localized: true },
  { type: "repeater", name: "features", label: "Features", titleKey: "text", addLabel: "Add feature", item: [T("text", "Feature")] },
  {
    type: "repeater",
    name: "specifications",
    label: "Specifications",
    titleKey: "label",
    addLabel: "Add specification",
    item: [T("label", "Label"), T("value", "Value")],
  },
  TA("fittingNotes", "Fitting / application notes"),
  {
    type: "repeater",
    name: "faq",
    label: "FAQ",
    titleKey: "question",
    addLabel: "Add question",
    item: [T("question", "Question"), TA("answer", "Answer")],
  },
];

const MEDIA: FieldDef[] = [
  { type: "image", name: "mainImage", label: "Main image" },
  T("imageAlt", "Image ALT text"),
  { type: "gallery", name: "gallery", label: "Gallery" },
  { type: "url", name: "catalogPdf", label: "PDF / catalogue attachment (URL)", placeholder: "Optional" },
];

const COMMERCIAL: FieldDef[] = [
  { type: "toggle", name: "commercial.enquiryCta", label: "Show enquiry button" },
  { type: "toggle", name: "commercial.whatsappCta", label: "Show WhatsApp button" },
  {
    type: "select",
    name: "commercial.availability",
    label: "Availability / status",
    options: [
      { value: "in-stock", label: "In stock" },
      { value: "on-request", label: "Available on request" },
      { value: "out-of-stock", label: "Out of stock" },
    ],
  },
  { type: "toggle", name: "commercial.showPrice", label: "Show a price", help: "Only enable if the site uses pricing." },
  { type: "text", name: "commercial.price", label: "Price", when: (r) => !!(r.commercial as { showPrice?: boolean } | undefined)?.showPrice },
];

type Rec = Record<string, unknown>;

export function ProductsList() {
  const brands = useActiveRows("brands");
  const models = useActiveRows("models");
  const categories = useActiveRows("categories");
  const countries = useActiveRows("countries");
  const can = useCan();
  const [bulkIds, setBulkIds] = useState<string[] | null>(null);

  const brandName = useMemo(() => new Map(brands.map((b) => [b.id, textOf(b.name)])), [brands]);
  const modelName = useMemo(() => new Map(models.map((m) => [m.id, textOf(m.name)])), [models]);
  const catName = useMemo(() => new Map(categories.map((c) => [c.id, textOf(c.name)])), [categories]);
  const brandOptions = useOptionList("brands");
  const categoryOptions = useOptionList("categories");
  const modelOptions = useOptionList("models");

  return (
    <>
      <CollectionList
        collection="products"
        resource="products"
        title="All Products"
        description="Products > Brand > Model > Product. Every product belongs to a brand and (optionally) a model."
        singular="product"
        editBase="/admin/products/all"
        archivable
        exportName="products"
        searchText={(r) => `${textOf(r.name)} ${r.sku} ${r.oemNumbers.join(" ")}`}
        columns={[
          {
            key: "name",
            header: "Product",
            value: (r) => textOf(r.name),
            render: (r) => (
              <span className="flex items-center gap-3">
                <ImageThumb url={r.mainImage} className="h-9 w-9 shrink-0 border border-slate-200" />
                <span className="font-semibold text-ink">{textOf(r.name)}</span>
              </span>
            ),
          },
          { key: "sku", header: "SKU", value: (r) => r.sku },
          { key: "brand", header: "Brand", value: (r) => brandName.get(r.brandId) ?? "" },
          { key: "model", header: "Model", value: (r) => modelName.get(r.modelId) ?? "" },
          { key: "category", header: "Category", value: (r) => catName.get(r.categoryId) ?? "" },
          { key: "featured", header: "Featured", value: (r) => r.featured, render: (r) => <YesNo value={r.featured} /> },
          { key: "status", header: "Status", value: (r) => r.status, render: (r) => <StatusBadge status={r.status} /> },
        ]}
        filters={[
          { key: "brand", label: "Brand", options: brandOptions, match: (r, v) => r.brandId === v || r.fitment.some((f) => f.brandId === v) },
          { key: "model", label: "Model", options: modelOptions, match: (r, v) => r.modelId === v || r.fitment.some((f) => f.modelId === v) },
          { key: "category", label: "Category", options: categoryOptions, match: (r, v) => r.categoryId === v },
          { key: "country", label: "Country", options: countries.map((c) => ({ value: c.id, label: textOf(c.name) })), match: (r, v) => r.countryIds.includes(v) },
          { key: "featured", label: "Featured", options: [{ value: "yes", label: "Featured" }, { value: "no", label: "Not featured" }], match: (r, v) => r.featured === (v === "yes") },
        ]}
        extraBulkActions={can("products", "edit") ? [{ label: "Bulk edit", icon: <Pencil className="h-3.5 w-3.5" />, onRun: (ids) => setBulkIds(ids) }] : []}
      />
      <BulkEditDialog
        key={bulkIds?.join(",") ?? "none"}
        open={!!bulkIds}
        onClose={() => setBulkIds(null)}
        count={bulkIds?.length ?? 0}
        fields={[
          { name: "categoryId", label: "Product category", kind: "select", options: categoryOptions },
          { name: "brandId", label: "Brand", kind: "select", options: brandOptions },
          { name: "featured", label: "Featured", kind: "toggle" },
        ]}
        onApply={async (patch) => {
          await db.bulkUpdate("products", bulkIds ?? [], patch as Partial<Product>);
        }}
      />
    </>
  );
}

export function ProductEditor({ id }: { id?: string }) {
  const brands = useActiveRows("brands");
  const models = useActiveRows("models");
  const brandName = (bid: unknown) => textOf(brands.find((b) => b.id === bid)?.name);
  const modelName = (mid: unknown) => textOf(models.find((m) => m.id === mid)?.name);

  return (
    <EntityEditor
      collection="products"
      resource="products"
      id={id}
      singular="product"
      listHref="/admin/products/all"
      listLabel="All Products"
      crumbs={[{ label: "Products" }]}
      makeNew={() => newProduct() as unknown as Rec}
      archivable
      seo={{ slugFrom: "name" }}
      preview={(r) => {
        const p = r as unknown as Product;
        return {
          title: textOf(p.name) || "Untitled product",
          image: p.mainImage,
          summary: textOf(p.shortDescription),
          html: p.fullDescription?.en,
          meta: [p.sku, brandName(p.brandId), modelName(p.modelId)].filter(Boolean),
        };
      }}
      tabs={[
        {
          id: "basic",
          label: "Basic",
          fields: BASIC,
          render: ({ record, setRecord, readOnly, errors }) => (
            <div className="space-y-4">
              <Card>
                <CardBody>
                  <HierarchyTrail brand={brandName(record.brandId)} model={modelName(record.modelId)} product={textOf(record.name)} />
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <FormFields fields={BASIC} value={record} onChange={(n) => setRecord(n)} readOnly={readOnly} errors={errors} columns />
                </CardBody>
              </Card>
            </div>
          ),
        },
        { id: "compat", label: "Compatibility", fields: COMPAT },
        { id: "content", label: "Content", fields: CONTENT },
        { id: "media", label: "Media", fields: MEDIA },
        { id: "commercial", label: "Commercial", fields: COMMERCIAL },
      ]}
    />
  );
}
