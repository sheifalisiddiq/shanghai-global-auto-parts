"use client";

import { useMemo, useState } from "react";
import { Merge, Pencil } from "lucide-react";
import { db } from "@/lib/admin/data";
import { useActiveRows } from "@/lib/admin/data/hooks";
import { textOf } from "@/lib/admin/data/defaults";
import { newBrand, newCategory, newCountry, newModel } from "@/lib/admin/data/factories";
import type { Brand, Model } from "@/lib/admin/data/types";
import type { FieldDef } from "@/lib/admin/forms/types";
import { useCan } from "@/lib/admin/auth/AuthContext";
import { CollectionList } from "../../editors/CollectionList";
import { EntityEditor } from "../../editors/EntityEditor";
import { AssignPanel, BulkEditDialog, CsvImportButton, MergeDialog } from "../../editors/helpers";
import { TermDrawer } from "../../editors/TermDrawer";
import { useOptionList } from "../../fields/FormFields";
import { ImageThumb } from "../../fields/MediaPicker";
import { StatusBadge, YesNo } from "../../ui/Badge";

type Rec = Record<string, unknown>;
const T = (name: string, label: string, required = false): FieldDef => ({ type: "text", name, label, localized: true, required });
const TA = (name: string, label: string, rows = 3): FieldDef => ({ type: "textarea", name, label, localized: true, rows });

/* --------------------------------- Brands --------------------------------- */

const BRAND_BASIC: FieldDef[] = [
  T("name", "Brand name", true),
  { type: "slug", name: "slug", label: "Brand slug / URL", from: "name" },
  T("category", "Tagline (e.g. SUV & Crossover)"),
  { type: "text", name: "badge", label: "Badge (e.g. Top Seller)" },
  { type: "image", name: "logo", label: "Brand logo" },
  TA("shortDescription", "Short description", 2),
  { type: "richtext", name: "longDescription", label: "Long description", localized: true },
  { type: "strings", name: "keyComponents", label: "Key components" },
];
const BRAND_DISPLAY: FieldDef[] = [
  { type: "image", name: "banner", label: "Brand banner" },
  { type: "image", name: "thumbnail", label: "Thumbnail" },
  { type: "number", name: "sortOrder", label: "Sort order" },
  { type: "toggle", name: "featured", label: "Featured brand" },
];

export function BrandsList() {
  const models = useActiveRows("models");
  const products = useActiveRows("products");
  const can = useCan();
  const [merge, setMerge] = useState<string[] | null>(null);
  return (
    <>
      <CollectionList
        collection="brands"
        resource="brands"
        title="Brands"
        description="Products > Brand. Each brand has its own models and products."
        singular="brand"
        editBase="/admin/products/brands"
        exportName="brands"
        defaultSort={{ key: "order", dir: "asc" }}
        searchText={(r) => textOf(r.name)}
        columns={[
          { key: "name", header: "Brand", value: (r) => textOf(r.name), render: (r) => (<span className="flex items-center gap-3"><ImageThumb url={r.logo} className="h-8 w-8 shrink-0 border border-slate-200 bg-white p-0.5" /><span className="font-semibold text-ink">{textOf(r.name)}</span></span>) },
          { key: "models", header: "Models", value: (r) => models.filter((m) => m.brandId === r.id && m.status !== "trash").length },
          { key: "products", header: "Products", value: (r) => products.filter((p) => p.brandId === r.id && p.status !== "trash").length },
          { key: "order", header: "Order", value: (r) => r.sortOrder },
          { key: "featured", header: "Featured", value: (r) => r.featured, render: (r) => <YesNo value={r.featured} /> },
          { key: "status", header: "Status", value: (r) => r.status, render: (r) => <StatusBadge status={r.status} /> },
        ]}
        extraBulkActions={can("brands", "edit") ? [{ label: "Merge", icon: <Merge className="h-3.5 w-3.5" />, onRun: (ids) => setMerge(ids) }] : []}
      />
      <MergeDialog key={merge?.join(",") ?? "x"} open={!!merge} onClose={() => setMerge(null)} collection="brands" ids={merge ?? []} singular="brand" />
    </>
  );
}

export function BrandEditor({ id }: { id?: string }) {
  return (
    <EntityEditor
      collection="brands"
      resource="brands"
      id={id}
      singular="brand"
      listHref="/admin/products/brands"
      listLabel="Brands"
      crumbs={[{ label: "Products" }]}
      makeNew={() => newBrand() as unknown as Rec}
      seo={{ slugFrom: "name" }}
      preview={(r) => { const b = r as unknown as Brand; return { title: textOf(b.name) || "Brand", image: b.banner || b.logo, summary: textOf(b.shortDescription), html: b.longDescription?.en, meta: [textOf(b.category)].filter(Boolean) }; }}
      tabs={[
        { id: "basic", label: "Basic", fields: BRAND_BASIC },
        { id: "display", label: "Display", fields: BRAND_DISPLAY, columns: true },
        {
          id: "relations",
          label: "Relations",
          render: ({ record }) => (
            <div className="space-y-4">
              <AssignPanel title="Models belonging to this brand" description="Assign Models: moves the selected model under this brand." target="models" field="brandId" currentId={record.id as string | undefined} singular="model" />
              <AssignPanel title="Products belonging to this brand" description="Bulk Assign Products: sets this brand as the product's primary brand." target="products" field="brandId" currentId={record.id as string | undefined} singular="product" />
            </div>
          ),
        },
      ]}
    />
  );
}

/* --------------------------------- Models --------------------------------- */

const MODEL_BASIC: FieldDef[] = [
  T("name", "Model name", true),
  { type: "slug", name: "slug", label: "Model slug / URL", from: "name" },
  { type: "select", name: "brandId", label: "Parent brand", optionsFrom: "brands", required: true },
  { type: "image", name: "image", label: "Model image" },
  TA("description", "Description"),
  { type: "text", name: "generation", label: "Year / generation / variant" },
  { type: "multiselect", name: "categoryIds", label: "Product categories used for this model", optionsFrom: "categories" },
  { type: "toggle", name: "featured", label: "Featured model" },
  { type: "number", name: "sortOrder", label: "Sort order" },
];

export function ModelsList() {
  const brands = useActiveRows("brands");
  const products = useActiveRows("products");
  const can = useCan();
  const brandName = useMemo(() => new Map(brands.map((b) => [b.id, textOf(b.name)])), [brands]);
  const brandOptions = useOptionList("brands");
  const [bulk, setBulk] = useState<string[] | null>(null);
  return (
    <>
      <CollectionList
        collection="models"
        resource="models"
        title="Models"
        description="Products > Brand > Model. Each model belongs to one brand."
        singular="model"
        editBase="/admin/products/models"
        exportName="models"
        searchText={(r) => `${textOf(r.name)} ${brandName.get(r.brandId) ?? ""}`}
        columns={[
          { key: "name", header: "Model", value: (r) => textOf(r.name), render: (r) => <span className="font-semibold text-ink">{textOf(r.name)}</span> },
          { key: "brand", header: "Brand", value: (r) => brandName.get(r.brandId) ?? "" },
          { key: "gen", header: "Year / generation", value: (r) => r.generation },
          { key: "products", header: "Products", value: (r) => products.filter((p) => (p.modelId === r.id || p.fitment.some((f) => f.modelId === r.id)) && p.status !== "trash").length },
          { key: "featured", header: "Featured", value: (r) => r.featured, render: (r) => <YesNo value={r.featured} /> },
          { key: "status", header: "Status", value: (r) => r.status, render: (r) => <StatusBadge status={r.status} /> },
        ]}
        filters={[{ key: "brand", label: "Brand", options: brandOptions, match: (r, v) => r.brandId === v }]}
        extraBulkActions={can("models", "edit") ? [{ label: "Bulk edit", icon: <Pencil className="h-3.5 w-3.5" />, onRun: (ids) => setBulk(ids) }] : []}
      />
      <BulkEditDialog
        key={bulk?.join(",") ?? "x"}
        open={!!bulk}
        onClose={() => setBulk(null)}
        count={bulk?.length ?? 0}
        fields={[
          { name: "brandId", label: "Parent brand", kind: "select", options: brandOptions },
          { name: "featured", label: "Featured", kind: "toggle" },
        ]}
        onApply={async (patch) => { await db.bulkUpdate("models", bulk ?? [], patch as Partial<Model>); }}
      />
    </>
  );
}

export function ModelEditor({ id }: { id?: string }) {
  const brands = useActiveRows("brands");
  return (
    <EntityEditor
      collection="models"
      resource="models"
      id={id}
      singular="model"
      listHref="/admin/products/models"
      listLabel="Models"
      crumbs={[{ label: "Products" }]}
      makeNew={() => newModel() as unknown as Rec}
      seo={{ slugFrom: "name" }}
      preview={(r) => { const m = r as unknown as Model; return { title: textOf(m.name) || "Model", image: m.image, summary: textOf(m.description), meta: [textOf(brands.find((b) => b.id === m.brandId)?.name), m.generation].filter(Boolean) }; }}
      tabs={[
        { id: "basic", label: "Basic", fields: MODEL_BASIC, columns: true },
        {
          id: "relations",
          label: "Relations",
          render: ({ record }) => (
            <AssignPanel title="Products belonging to this model" description="Assign Products: sets this model as the product's primary model." target="products" field="modelId" currentId={record.id as string | undefined} singular="product" />
          ),
        },
      ]}
    />
  );
}

/* ------------------------------- Categories ------------------------------- */

const CATEGORY_FIELDS: FieldDef[] = [
  T("name", "Category name", true),
  { type: "slug", name: "slug", label: "Slug", from: "name" },
  { type: "select", name: "parentId", label: "Parent category", optionsFrom: "categories", allowEmpty: true, help: "Leave empty for a top-level category." },
  TA("description", "Description", 2),
  { type: "image", name: "image", label: "Image" },
  { type: "text", name: "icon", label: "Icon name (optional)" },
];

export function CategoriesManager() {
  const products = useActiveRows("products");
  const categories = useActiveRows("categories");
  const can = useCan();
  const [target, setTarget] = useState<{ id?: string } | null>(null);
  const [merge, setMerge] = useState<string[] | null>(null);
  const name = useMemo(() => new Map(categories.map((c) => [c.id, textOf(c.name)])), [categories]);
  return (
    <>
      <CollectionList
        collection="categories"
        resource="categories"
        title="Product Categories"
        description="Reusable taxonomy. Editing a category updates every product assigned to it."
        singular="category"
        crumbs={[{ label: "Products" }]}
        onEdit={(r) => setTarget({ id: r.id })}
        onNew={() => setTarget({})}
        exportName="categories"
        searchText={(r) => textOf(r.name)}
        columns={[
          { key: "name", header: "Category", value: (r) => textOf(r.name), render: (r) => (<span className="flex items-center gap-3"><ImageThumb url={r.image} className="h-9 w-9 shrink-0 border border-slate-200" /><span className="font-semibold text-ink">{textOf(r.name)}</span></span>) },
          { key: "parent", header: "Parent", value: (r) => name.get(r.parentId) ?? "" },
          { key: "products", header: "Products", value: (r) => products.filter((p) => p.categoryId === r.id).length },
          { key: "status", header: "Status", value: (r) => r.status, render: (r) => <StatusBadge status={r.status} /> },
        ]}
        extraBulkActions={can("categories", "edit") ? [{ label: "Merge", icon: <Merge className="h-3.5 w-3.5" />, onRun: (ids) => setMerge(ids) }] : []}
      />
      <TermDrawer
        collection="categories"
        resource="categories"
        singular="category"
        target={target}
        onClose={() => setTarget(null)}
        fields={CATEGORY_FIELDS}
        makeNew={() => newCategory() as unknown as Rec}
        seo={{}}
        extra={({ record }) => (
          <AssignPanel title="Products in this category" description="Assign Products: sets this as the product's category." target="products" field="categoryId" currentId={record.id as string | undefined} singular="product" />
        )}
      />
      <MergeDialog key={merge?.join(",") ?? "x"} open={!!merge} onClose={() => setMerge(null)} collection="categories" ids={merge ?? []} singular="category" />
    </>
  );
}

/* -------------------------------- Countries -------------------------------- */

const COUNTRY_FIELDS: FieldDef[] = [
  T("name", "Country name", true),
  { type: "slug", name: "slug", label: "Slug", from: "name" },
  { type: "text", name: "code", label: "Country code (e.g. AE)", required: true },
  { type: "image", name: "flag", label: "Flag / image" },
  TA("shortDescription", "Short description", 2),
  { type: "richtext", name: "longDescription", label: "Long description", localized: true },
  { type: "toggle", name: "archiveEnabled", label: "SEO landing / archive page", help: "Optional archive page for this country term." },
  { type: "toggle", name: "featured", label: "Featured country" },
  { type: "number", name: "sortOrder", label: "Sort order" },
  { type: "image", name: "banner", label: "Custom banner" },
];

export function CountriesManager() {
  const products = useActiveRows("products");
  const posts = useActiveRows("posts");
  const can = useCan();
  const [target, setTarget] = useState<{ id?: string } | null>(null);
  const [merge, setMerge] = useState<string[] | null>(null);
  return (
    <>
      <CollectionList
        collection="countries"
        resource="countries"
        title="Countries"
        description="Reusable taxonomy assigned to products and blog posts. A country is a taxonomy term, not a page type."
        singular="country"
        crumbs={[{ label: "Products" }]}
        onEdit={(r) => setTarget({ id: r.id })}
        onNew={() => setTarget({})}
        exportName="countries"
        searchText={(r) => `${textOf(r.name)} ${r.code}`}
        headerActions={
          can("countries", "export") ? (
            <CsvImportButton
              hint="CSV columns: name, code, slug"
              onRows={async (rows) => {
                const made = await db.createMany(
                  "countries",
                  rows.filter((r) => r.name).map((r) => ({ ...newCountry(), name: { en: r.name, ar: r["name (ar)"] ?? "" }, code: (r.code ?? "").toUpperCase(), slug: r.slug || r.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") })) as never,
                );
                return made.length;
              }}
            />
          ) : undefined
        }
        columns={[
          { key: "name", header: "Country", value: (r) => textOf(r.name), render: (r) => <span className="font-semibold text-ink">{textOf(r.name)}</span> },
          { key: "code", header: "Code", value: (r) => r.code },
          { key: "products", header: "Products", value: (r) => products.filter((p) => p.countryIds.includes(r.id)).length },
          { key: "posts", header: "Posts", value: (r) => posts.filter((p) => p.countryIds.includes(r.id)).length },
          { key: "featured", header: "Featured", value: (r) => r.featured, render: (r) => <YesNo value={r.featured} /> },
          { key: "status", header: "Status", value: (r) => r.status, render: (r) => <StatusBadge status={r.status} /> },
        ]}
        extraBulkActions={can("countries", "edit") ? [{ label: "Merge", icon: <Merge className="h-3.5 w-3.5" />, onRun: (ids) => setMerge(ids) }] : []}
      />
      <TermDrawer
        collection="countries"
        resource="countries"
        singular="country"
        target={target}
        onClose={() => setTarget(null)}
        fields={COUNTRY_FIELDS}
        makeNew={() => newCountry() as unknown as Rec}
        seo={{}}
        extra={({ record }) => (
          <div className="space-y-4">
            <AssignPanel title="Products in this country" description="Assign Content: adds this country term to products." target="products" field="countryIds" multi currentId={record.id as string | undefined} singular="product" />
            <AssignPanel title="Blog posts in this country" target="posts" field="countryIds" multi currentId={record.id as string | undefined} singular="post" />
          </div>
        )}
      />
      <MergeDialog key={merge?.join(",") ?? "x"} open={!!merge} onClose={() => setMerge(null)} collection="countries" ids={merge ?? []} singular="country" />
    </>
  );
}

