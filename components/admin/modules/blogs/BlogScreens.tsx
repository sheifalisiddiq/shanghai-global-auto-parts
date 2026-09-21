"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FilePlus2, Merge, Star, StarOff } from "lucide-react";
import { db } from "@/lib/admin/data";
import { useActiveRows } from "@/lib/admin/data/hooks";
import { textOf } from "@/lib/admin/data/defaults";
import { newBlogCategory, newPost, newTag, newTestimonial } from "@/lib/admin/data/factories";
import type { BlogPost, Testimonial } from "@/lib/admin/data/types";
import type { FieldDef } from "@/lib/admin/forms/types";
import { useCan } from "@/lib/admin/auth/AuthContext";
import { CollectionList } from "../../editors/CollectionList";
import { EntityEditor } from "../../editors/EntityEditor";
import { AssignPanel, MergeDialog } from "../../editors/helpers";
import { TermDrawer } from "../../editors/TermDrawer";
import { useOptionList } from "../../fields/FormFields";
import { ImageThumb } from "../../fields/MediaPicker";
import { StatusBadge, YesNo } from "../../ui/Badge";

type Rec = Record<string, unknown>;
const T = (name: string, label: string, required = false): FieldDef => ({ type: "text", name, label, localized: true, required });
const TA = (name: string, label: string, rows = 3): FieldDef => ({ type: "textarea", name, label, localized: true, rows });

const fmtDate = (iso: string) => (iso ? new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "");

/* ---------------------------------- Posts ---------------------------------- */

const POST_CONTENT: FieldDef[] = [
  T("title", "Post title", true),
  { type: "slug", name: "slug", label: "Slug / permalink", from: "title" },
  TA("excerpt", "Excerpt", 2),
  { type: "richtext", name: "content", label: "Full content", localized: true },
  { type: "text", name: "authorName", label: "Author" },
  { type: "text", name: "authorRole", label: "Author role" },
  { type: "datetime", name: "publishDate", label: "Publish date" },
  { type: "text", name: "readTime", label: "Reading time", placeholder: "e.g. 5 min read" },
  { type: "toggle", name: "featured", label: "Featured post" },
];
const POST_MEDIA: FieldDef[] = [
  { type: "image", name: "featuredImage", label: "Featured image" },
  T("imageAlt", "Image ALT text"),
];
const POST_ORG: FieldDef[] = [
  { type: "select", name: "categoryId", label: "Blog category", optionsFrom: "blogCategories", required: true },
  { type: "multiselect", name: "tagIds", label: "Tags", optionsFrom: "tags" },
  { type: "multiselect", name: "countryIds", label: "Country taxonomy (where relevant)", optionsFrom: "countries" },
];
const POST_LINKS: FieldDef[] = [
  { type: "multiselect", name: "relatedPostIds", label: "Related posts", optionsFrom: "posts" },
  { type: "multiselect", name: "relatedProductIds", label: "Related products", optionsFrom: "products" },
  { type: "multiselect", name: "relatedBrandIds", label: "Related brands", optionsFrom: "brands" },
  { type: "multiselect", name: "relatedModelIds", label: "Related models", optionsFrom: "models" },
  {
    type: "repeater",
    name: "internalLinks",
    label: "Internal links",
    titleKey: "label",
    addLabel: "Add link",
    item: [
      { type: "text", name: "label", label: "Link text" },
      { type: "url", name: "url", label: "URL", placeholder: "/products" },
    ],
  },
  { type: "group", label: "Call to action (CTA)", fields: [T("cta.label", "Button text"), { type: "url", name: "cta.url", label: "Button link" }] },
];

export function PostsList() {
  const cats = useActiveRows("blogCategories");
  const catOptions = useOptionList("blogCategories");
  const catName = useMemo(() => new Map(cats.map((c) => [c.id, textOf(c.name)])), [cats]);
  const can = useCan();
  return (
    <CollectionList
      collection="posts"
      resource="posts"
      title="All Posts"
      description="Blogs > Blog Post. Create, schedule and publish articles."
      singular="post"
      editBase="/admin/blogs/posts"
      archivable
      exportName="blog-posts"
      defaultSort={{ key: "date", dir: "desc" }}
      searchText={(r) => `${textOf(r.title)} ${r.authorName}`}
      columns={[
        { key: "title", header: "Post", value: (r) => textOf(r.title), render: (r) => (<span className="flex items-center gap-3"><ImageThumb url={r.featuredImage} className="h-9 w-12 shrink-0 border border-slate-200" /><span className="font-semibold text-ink">{textOf(r.title)}</span></span>) },
        { key: "cat", header: "Category", value: (r) => catName.get(r.categoryId) ?? "" },
        { key: "author", header: "Author", value: (r) => r.authorName },
        { key: "date", header: "Date", value: (r) => r.publishDate, render: (r) => fmtDate(r.status === "scheduled" ? r.scheduledAt : r.publishDate), csv: (r) => r.publishDate },
        { key: "featured", header: "Featured", value: (r) => r.featured, render: (r) => <YesNo value={r.featured} /> },
        { key: "status", header: "Status", value: (r) => r.status, render: (r) => <StatusBadge status={r.status} /> },
      ]}
      filters={[{ key: "cat", label: "Category", options: catOptions, match: (r, v) => r.categoryId === v }]}
      extraRowActions={(row) =>
        can("posts", "edit")
          ? [{ label: row.featured ? "Unfeature" : "Feature", icon: row.featured ? <StarOff className="h-3.5 w-3.5" /> : <Star className="h-3.5 w-3.5" />, onRun: async (r) => { await db.update("posts", r.id, { featured: !r.featured }); } }]
          : []
      }
    />
  );
}

export function PostEditor({ id }: { id?: string }) {
  const params = useSearchParams();
  const presetCategory = params.get("category") ?? "";
  const cats = useActiveRows("blogCategories");
  return (
    <EntityEditor
      collection="posts"
      resource="posts"
      id={id}
      singular="post"
      listHref="/admin/blogs/posts"
      listLabel="All Posts"
      crumbs={[{ label: "Blogs" }]}
      makeNew={() => ({ ...newPost(), categoryId: presetCategory }) as unknown as Rec}
      archivable
      schedule
      seo={{ slugFrom: "title" }}
      preview={(r) => {
        const p = r as unknown as BlogPost;
        return { title: textOf(p.title) || "Untitled post", image: p.featuredImage, summary: textOf(p.excerpt), html: p.content?.en, meta: [textOf(cats.find((c) => c.id === p.categoryId)?.name), p.authorName, p.readTime].filter(Boolean) };
      }}
      tabs={[
        { id: "content", label: "Content", fields: POST_CONTENT },
        { id: "media", label: "Media", fields: POST_MEDIA },
        { id: "org", label: "Organisation", fields: POST_ORG },
        { id: "links", label: "Links", fields: POST_LINKS },
      ]}
    />
  );
}

/* ------------------------------- Blog categories ------------------------------- */

const BCAT_FIELDS: FieldDef[] = [
  T("name", "Category name", true),
  { type: "slug", name: "slug", label: "Slug", from: "name" },
  TA("description", "Description", 2),
  TA("purpose", "Purpose", 2),
  { type: "image", name: "banner", label: "Banner" },
  { type: "image", name: "thumbnail", label: "Thumbnail" },
  { type: "number", name: "sortOrder", label: "Sort order" },
];

export function BlogCategoriesManager() {
  const posts = useActiveRows("posts");
  const router = useRouter();
  const can = useCan();
  const [target, setTarget] = useState<{ id?: string } | null>(null);
  return (
    <>
      <CollectionList
        collection="blogCategories"
        resource="blogCategories"
        title="Blog Categories"
        description="Latest Updates, Product Guides, Testimonials, Company News, Automotive Tips and your own."
        singular="category"
        crumbs={[{ label: "Blogs" }]}
        archivable
        onEdit={(r) => setTarget({ id: r.id })}
        onNew={() => setTarget({})}
        exportName="blog-categories"
        defaultSort={{ key: "order", dir: "asc" }}
        searchText={(r) => textOf(r.name)}
        columns={[
          { key: "name", header: "Category", value: (r) => textOf(r.name), render: (r) => <span className="font-semibold text-ink">{textOf(r.name)}</span> },
          { key: "posts", header: "Posts", value: (r) => posts.filter((p) => p.categoryId === r.id).length },
          { key: "order", header: "Order", value: (r) => r.sortOrder },
          { key: "status", header: "Status", value: (r) => r.status, render: (r) => <StatusBadge status={r.status} /> },
        ]}
        extraRowActions={() =>
          can("posts", "create")
            ? [{ label: "Create post", icon: <FilePlus2 className="h-3.5 w-3.5" />, onRun: (r) => router.push(`/admin/blogs/posts/new?category=${r.id}`) }]
            : []
        }
      />
      <TermDrawer collection="blogCategories" resource="blogCategories" singular="category" target={target} onClose={() => setTarget(null)} fields={BCAT_FIELDS} makeNew={() => newBlogCategory() as unknown as Rec} seo={{}} />
    </>
  );
}

/* ---------------------------------- Tags ---------------------------------- */

const TAG_FIELDS: FieldDef[] = [
  T("name", "Tag name", true),
  { type: "slug", name: "slug", label: "Slug", from: "name" },
  TA("description", "Description (optional)", 2),
];

export function TagsManager() {
  const posts = useActiveRows("posts");
  const can = useCan();
  const [target, setTarget] = useState<{ id?: string } | null>(null);
  const [merge, setMerge] = useState<string[] | null>(null);
  return (
    <>
      <CollectionList
        collection="tags"
        resource="tags"
        title="Blog Tags"
        description="Reusable tags assigned to one or many posts."
        singular="tag"
        crumbs={[{ label: "Blogs" }]}
        noPublish
        onEdit={(r) => setTarget({ id: r.id })}
        onNew={() => setTarget({})}
        exportName="blog-tags"
        searchText={(r) => textOf(r.name)}
        columns={[
          { key: "name", header: "Tag", value: (r) => textOf(r.name), render: (r) => <span className="font-semibold text-ink">{textOf(r.name)}</span> },
          { key: "slug", header: "Slug", value: (r) => r.slug },
          { key: "posts", header: "Posts", value: (r) => posts.filter((p) => p.tagIds.includes(r.id)).length },
        ]}
        extraBulkActions={can("tags", "edit") ? [{ label: "Merge", icon: <Merge className="h-3.5 w-3.5" />, onRun: (ids) => setMerge(ids) }] : []}
      />
      <TermDrawer
        collection="tags"
        resource="tags"
        singular="tag"
        target={target}
        onClose={() => setTarget(null)}
        fields={TAG_FIELDS}
        makeNew={() => newTag() as unknown as Rec}
        seo={{ lite: true }}
        extra={({ record }) => <AssignPanel title="Posts with this tag" description="Bulk Assign: add this tag to posts." target="posts" field="tagIds" multi currentId={record.id as string | undefined} singular="post" />}
      />
      <MergeDialog key={merge?.join(",") ?? "x"} open={!!merge} onClose={() => setMerge(null)} collection="tags" ids={merge ?? []} singular="tag" />
    </>
  );
}

/* ------------------------------- Testimonials ------------------------------- */

const TESTI_CONTENT: FieldDef[] = [
  { type: "text", name: "name", label: "Customer / company name", required: true },
  { type: "slug", name: "slug", label: "Slug", from: "name" },
  T("meta", "Role / label (e.g. Local Guide)"),
  { type: "select", name: "country", label: "Country", optionsFrom: "countries", allowEmpty: true },
  TA("text", "Testimonial text", 4),
  { type: "url", name: "videoUrl", label: "Testimonial video URL (optional)" },
  { type: "number", name: "rating", label: "Rating (1 to 5)" },
  { type: "select", name: "relatedProductId", label: "Related product", optionsFrom: "products", allowEmpty: true },
  { type: "select", name: "relatedBrandId", label: "Related brand", optionsFrom: "brands", allowEmpty: true },
  { type: "toggle", name: "featured", label: "Featured testimonial" },
];
const TESTI_MEDIA: FieldDef[] = [
  { type: "image", name: "image", label: "Customer / company image or logo" },
  { type: "image", name: "thumbnail", label: "Thumbnail" },
  T("imageAlt", "Image ALT text"),
];

export function TestimonialsList() {
  const can = useCan();
  return (
    <CollectionList
      collection="testimonials"
      resource="testimonials"
      title="Testimonials"
      description="Customer and company testimonials shown on the site."
      singular="testimonial"
      crumbs={[{ label: "Blogs" }]}
      editBase="/admin/blogs/testimonials"
      archivable
      exportName="testimonials"
      searchText={(r) => `${r.name} ${textOf(r.text)}`}
      columns={[
        { key: "name", header: "Customer", value: (r) => r.name, render: (r) => <span className="font-semibold text-ink">{r.name}</span> },
        { key: "text", header: "Testimonial", value: (r) => textOf(r.text), render: (r) => <span className="line-clamp-1 max-w-xs text-slate-600">{textOf(r.text)}</span> },
        { key: "rating", header: "Rating", value: (r) => r.rating },
        { key: "featured", header: "Featured", value: (r) => r.featured, render: (r) => <YesNo value={r.featured} /> },
        { key: "status", header: "Status", value: (r) => r.status, render: (r) => <StatusBadge status={r.status} /> },
      ]}
      extraRowActions={(row) =>
        can("testimonials", "edit")
          ? [{ label: row.featured ? "Unfeature" : "Feature", icon: row.featured ? <StarOff className="h-3.5 w-3.5" /> : <Star className="h-3.5 w-3.5" />, onRun: async (r) => { await db.update("testimonials", r.id, { featured: !r.featured }); } }]
          : []
      }
    />
  );
}

export function TestimonialEditor({ id }: { id?: string }) {
  return (
    <EntityEditor
      collection="testimonials"
      resource="testimonials"
      id={id}
      singular="testimonial"
      listHref="/admin/blogs/testimonials"
      listLabel="Testimonials"
      crumbs={[{ label: "Blogs" }]}
      makeNew={() => newTestimonial() as unknown as Rec}
      archivable
      seo={{ slugFrom: "name" }}
      preview={(r) => { const t = r as unknown as Testimonial; return { title: t.name || "Testimonial", image: t.image, summary: textOf(t.text), meta: [textOf(t.meta), `${t.rating} / 5`].filter(Boolean) }; }}
      tabs={[
        { id: "content", label: "Content", fields: TESTI_CONTENT },
        { id: "media", label: "Media", fields: TESTI_MEDIA },
      ]}
    />
  );
}
