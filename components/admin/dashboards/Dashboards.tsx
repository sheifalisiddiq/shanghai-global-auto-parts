"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { ArrowUpRight, Briefcase, FileText, ImageIcon, Inbox, Newspaper, Package, Search } from "lucide-react";
import { useActiveRows, useCollection, useDataReady, useSingleton } from "@/lib/admin/data/hooks";
import { textOf } from "@/lib/admin/data/defaults";
import type { SeoFields } from "@/lib/admin/data/types";
import type { Action, Resource } from "@/lib/admin/access/permissions";
import { ROLES, type DashboardVariant } from "@/lib/admin/access/roles";
import { useAuth, useCan } from "@/lib/admin/auth/AuthContext";
import { validateRobots } from "@/lib/admin/seo/checks";
import { Badge, SampleBadge } from "../ui/Badge";
import { Bars, Card, CardBody, CardHeader, StatCard } from "../ui/Card";
import { PageHeader } from "../ui/PageHeader";
import { Select } from "../fields/inputs";

/**
 * DASHBOARDS ARE A UI CONVENIENCE, NOT A PDF REQUIREMENT.
 * The PDF defines the modules, fields and buttons; it does not define dashboards.
 * Everything here is derived from the demo store, can be changed or removed
 * without touching any PDF-defined module, and counts that include Sample rows say so.
 */

const fmtDay = (iso: string) => (iso ? new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) : "-");
const fmtDateTime = (iso: string) => (iso ? new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "Never");

function withSample(rows: readonly { isSample?: boolean }[]) {
  const s = rows.filter((r) => r.isSample).length;
  return s ? `${rows.length} (${s} sample)` : String(rows.length);
}
const sampleHint = (rows: readonly { isSample?: boolean }[]) => (rows.some((r) => r.isSample) ? `Includes ${rows.filter((r) => r.isSample).length} sample row(s)` : undefined);

interface QuickAction {
  label: string;
  href: string;
  resource: Resource;
  action: Action;
}

function QuickActions({ actions }: { actions: QuickAction[] }) {
  const can = useCan();
  const shown = actions.filter((a) => can(a.resource, a.action));
  if (!shown.length) return null;
  return (
    <Card>
      <CardHeader title="Quick actions" />
      <CardBody className="grid gap-2 sm:grid-cols-2">
        {shown.map((a) => (
          <Link key={a.href + a.label} href={a.href} className="group flex items-center justify-between border border-slate-200 px-4 py-3 text-sm font-semibold text-ink transition-colors hover:border-brand-red hover:text-brand-red">
            {a.label}
            <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-brand-red" />
          </Link>
        ))}
      </CardBody>
    </Card>
  );
}

function List({ items, empty }: { items: { key: string; primary: ReactNode; secondary?: ReactNode; right?: ReactNode }[]; empty: string }) {
  if (!items.length) return <p className="text-sm text-slate-500">{empty}</p>;
  return (
    <ul className="divide-y divide-slate-100">
      {items.map((i) => (
        <li key={i.key} className="flex items-center gap-3 py-2.5 text-sm">
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-ink">{i.primary}</p>
            {i.secondary && <p className="truncate text-xs text-slate-500">{i.secondary}</p>}
          </div>
          {i.right}
        </li>
      ))}
    </ul>
  );
}

/* ---------------------------- Administrator ---------------------------- */

function AdminDashboard() {
  const products = useActiveRows("products");
  const posts = useActiveRows("posts");
  const jobs = useActiveRows("jobs");
  const enquiries = useActiveRows("enquiries");
  const applications = useActiveRows("applications");
  const media = useActiveRows("media");
  const audit = useCollection("audit");
  const log404 = useCollection("log404");
  const cache = useSingleton("cache").value;
  const sitemap = useSingleton("sitemap").value;
  const robots = useSingleton("robots").value;

  const newEnq = enquiries.filter((e) => e.enquiryStatus === "new");
  const newApps = applications.filter((a) => a.applicationStatus === "new");
  const openJobs = jobs.filter((j) => j.jobStatus === "open" && j.status === "published");
  const drafts = [...products, ...posts].filter((r) => r.status === "draft").length;
  const scheduled = posts.filter((p) => p.status === "scheduled").length;
  const top404 = [...log404].sort((a, b) => b.hits - a.hits).slice(0, 3);
  const robotsOk = robots ? validateRobots(robots.rules).ok : false;

  return (
    <div className="space-y-6">
      <section aria-label="Overview" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Products" value={products.length} hint="In the catalogue" icon={<Package className="h-5 w-5" />} />
        <StatCard label="Blog posts" value={posts.length} hint={`${posts.filter((p) => p.status === "published").length} published`} icon={<Newspaper className="h-5 w-5" />} />
        <StatCard label="Open jobs" value={openJobs.length} hint="Published and open" icon={<Briefcase className="h-5 w-5" />} />
        <StatCard label="New enquiries" value={newEnq.length} hint={sampleHint(newEnq) ?? "Awaiting reply"} icon={<Inbox className="h-5 w-5" />} />
        <StatCard label="New applications" value={newApps.length} hint={sampleHint(newApps) ?? "Awaiting review"} icon={<FileText className="h-5 w-5" />} />
        <StatCard label="Media items" value={media.length} hint="In the library" icon={<ImageIcon className="h-5 w-5" />} />
      </section>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Needs attention" />
          <CardBody>
            <List
              empty="Nothing needs attention."
              items={[
                { key: "d", primary: `${drafts} draft product/post(s)`, secondary: "Not published yet" },
                { key: "s", primary: `${scheduled} scheduled post(s)`, secondary: "Waiting for their publish date" },
                { key: "e", primary: `${newEnq.length} unread enquiries`, secondary: sampleHint(newEnq) },
                ...top404.map((l) => ({ key: l.id, primary: `404: ${l.url}`, secondary: `${l.hits} hits`, right: l.isSample ? <SampleBadge /> : undefined })),
              ]}
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Site health" />
          <CardBody>
            <List
              empty=""
              items={[
                { key: "sm", primary: "Sitemap", secondary: `Last generated: ${sitemap ? fmtDateTime(sitemap.lastGeneratedAt) : "-"}` },
                { key: "rb", primary: "robots.txt", right: <Badge tone={robotsOk ? "green" : "red"}>{robotsOk ? "Valid" : "Needs attention"}</Badge> },
                { key: "ch", primary: "Cache", secondary: `Last cleared: ${cache ? fmtDateTime(cache.lastCleared) : "-"}` },
              ]}
            />
          </CardBody>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader title="Recent activity" description="From the audit log" />
          <CardBody>
            <List
              empty="No activity yet."
              items={audit.slice(0, 6).map((a) => ({
                key: a.id,
                primary: a.summary,
                secondary: `${a.actor} · ${fmtDateTime(a.at)}`,
                right: a.isSample ? <SampleBadge /> : undefined,
              }))}
            />
          </CardBody>
        </Card>
      </div>
      <QuickActions
        actions={[
          { label: "New blog post", href: "/admin/blogs/posts/new", resource: "posts", action: "create" },
          { label: "New product", href: "/admin/products/all/new", resource: "products", action: "create" },
          { label: "New job opening", href: "/admin/careers/openings/new", resource: "jobs", action: "create" },
          { label: "Edit the Home page", href: "/admin/pages/home", resource: "pages", action: "view" },
        ]}
      />
    </div>
  );
}

/* ------------------------------ SEO Manager ------------------------------ */

function SeoDashboard() {
  const pages = [
    useSingleton("page_home").value, useSingleton("page_about").value, useSingleton("page_products").value,
    useSingleton("page_blogs").value, useSingleton("page_careers").value, useSingleton("page_contact").value,
  ];
  const seoRows: { seo: SeoFields }[] = [
    ...pages.filter(Boolean).map((p) => ({ seo: p!.seo })),
    ...useActiveRows("products"), ...useActiveRows("brands"), ...useActiveRows("models"), ...useActiveRows("categories"),
    ...useActiveRows("posts"), ...useActiveRows("testimonials"), ...useActiveRows("jobs"),
  ];
  const redirects = useActiveRows("redirects");
  const log404 = useCollection("log404");
  const schemas = useActiveRows("schemas");
  const sitemap = useSingleton("sitemap").value;

  const stats = {
    noTitle: seoRows.filter((r) => !r.seo.metaTitle.en.trim()).length,
    noDesc: seoRows.filter((r) => !r.seo.metaDescription.en.trim()).length,
    noindex: seoRows.filter((r) => !r.seo.index).length,
  };
  const activeRedirects = redirects.filter((r) => r.enabled);
  const enabledTypes = Array.from(new Set(schemas.filter((s) => s.enabled).map((s) => s.schemaType)));
  const top404 = [...log404].sort((a, b) => b.hits - a.hits).slice(0, 4);

  return (
    <div className="space-y-6">
      <section aria-label="SEO health" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Missing meta title" value={stats.noTitle} hint={`of ${seoRows.length} items`} icon={<Search className="h-5 w-5" />} />
        <StatCard label="Missing meta description" value={stats.noDesc} hint={`of ${seoRows.length} items`} icon={<Search className="h-5 w-5" />} />
        <StatCard label="Noindex items" value={stats.noindex} hint="Hidden from search engines" icon={<Search className="h-5 w-5" />} />
        <StatCard label="Sitemap URLs" value={sitemap?.entryCount || "-"} hint={`Last generated: ${sitemap ? fmtDateTime(sitemap.lastGeneratedAt) : "-"}`} icon={<FileText className="h-5 w-5" />} />
        <StatCard label="Active redirects" value={activeRedirects.length} hint={sampleHint(activeRedirects)} icon={<ArrowUpRight className="h-5 w-5" />} />
        <StatCard label="Schema types on" value={enabledTypes.length} hint={enabledTypes.join(", ") || "None"} icon={<FileText className="h-5 w-5" />} />
      </section>
      <Card>
        <CardHeader title="Top 404 errors" description="Broken links visitors hit most" />
        <CardBody>
          <List empty="No 404 errors logged." items={top404.map((l) => ({ key: l.id, primary: l.url, secondary: `Last: ${fmtDateTime(l.lastHit)}`, right: <span className="flex items-center gap-2 text-sm font-bold">{l.hits}{l.isSample && <SampleBadge />}</span> }))} />
        </CardBody>
      </Card>
      <QuickActions
        actions={[
          { label: "Global Settings", href: "/admin/seo/global", resource: "seoGlobal", action: "view" },
          { label: "Redirects", href: "/admin/seo/redirects", resource: "redirects", action: "view" },
          { label: "Sitemap", href: "/admin/seo/sitemap", resource: "sitemap", action: "view" },
          { label: "Robots.txt", href: "/admin/seo/robots", resource: "robots", action: "view" },
          { label: "Schema", href: "/admin/seo/schema", resource: "schema", action: "view" },
          { label: "Review page SEO", href: "/admin/pages/home", resource: "pages", action: "view" },
        ]}
      />
    </div>
  );
}

/* ----------------------------- Content Editor ----------------------------- */

function ContentDashboard() {
  const posts = useActiveRows("posts");
  const testimonials = useActiveRows("testimonials");
  const pageDocs = [
    ["Home", "/admin/pages/home", useSingleton("page_home").value],
    ["About Us", "/admin/pages/about", useSingleton("page_about").value],
    ["Products", "/admin/pages/products", useSingleton("page_products").value],
    ["Blogs", "/admin/pages/blogs", useSingleton("page_blogs").value],
    ["Careers", "/admin/pages/careers", useSingleton("page_careers").value],
    ["Contact Us", "/admin/pages/contact", useSingleton("page_contact").value],
  ] as const;
  const drafts = posts.filter((p) => p.status === "draft");
  const scheduled = posts.filter((p) => p.status === "scheduled");
  const draftPages = pageDocs.filter(([, , d]) => d?.status === "draft");
  const recent = [
    ...posts.map((p) => ({ key: p.id, label: textOf(p.title), href: `/admin/blogs/posts/${p.id}`, at: p.updatedAt, kind: "Post" })),
    ...testimonials.map((t) => ({ key: t.id, label: t.name, href: `/admin/blogs/testimonials/${t.id}`, at: t.updatedAt, kind: "Testimonial" })),
    ...pageDocs.filter(([, , d]) => d).map(([name, href, d]) => ({ key: href, label: `${name} page`, href, at: d!.updatedAt, kind: "Page" })),
  ].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 6);

  return (
    <div className="space-y-6">
      <section aria-label="Content" className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Draft posts" value={drafts.length} hint={draftPages.length ? `+ ${draftPages.length} draft page(s)` : "Waiting to be published"} icon={<Newspaper className="h-5 w-5" />} />
        <StatCard label="Scheduled posts" value={scheduled.length} hint="Will publish automatically" icon={<Newspaper className="h-5 w-5" />} />
        <StatCard label="Published posts" value={posts.filter((p) => p.status === "published").length} hint="Live on the blog" icon={<Newspaper className="h-5 w-5" />} />
      </section>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Your drafts" />
          <CardBody>
            <List empty="No drafts. Nice and tidy." items={drafts.slice(0, 5).map((p) => ({ key: p.id, primary: <Link href={`/admin/blogs/posts/${p.id}`} className="hover:text-brand-red">{textOf(p.title) || "Untitled"}</Link>, secondary: `Edited ${fmtDay(p.updatedAt)}` }))} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Recently edited" />
          <CardBody>
            <List empty="Nothing edited yet." items={recent.map((r) => ({ key: r.key, primary: <Link href={r.href} className="hover:text-brand-red">{r.label}</Link>, secondary: `${r.kind} · ${fmtDay(r.at)}` }))} />
          </CardBody>
        </Card>
      </div>
      <QuickActions
        actions={[
          { label: "New blog post", href: "/admin/blogs/posts/new", resource: "posts", action: "create" },
          { label: "Edit the Home page", href: "/admin/pages/home", resource: "pages", action: "view" },
          { label: "Add a testimonial", href: "/admin/blogs/testimonials/new", resource: "testimonials", action: "create" },
          { label: "Open the Media library", href: "/admin/media", resource: "media", action: "view" },
        ]}
      />
    </div>
  );
}

/* ---------------------------- Product Manager ---------------------------- */

function ProductDashboard() {
  const brands = useActiveRows("brands");
  const models = useActiveRows("models");
  const products = useActiveRows("products");
  const categories = useActiveRows("categories");
  const countries = useActiveRows("countries");
  const noImage = products.filter((p) => !p.mainImage).length;
  const noCategory = products.filter((p) => !p.categoryId).length;
  const drafts = products.filter((p) => p.status === "draft").length;
  const archived = products.filter((p) => p.status === "archived").length;
  const byBrand = useMemo(
    () =>
      brands
        .map((b) => ({ label: textOf(b.name), value: products.filter((p) => p.brandId === b.id).length, models: models.filter((m) => m.brandId === b.id).length }))
        .sort((a, b) => b.value - a.value || b.models - a.models)
        .slice(0, 6),
    [brands, models, products],
  );
  return (
    <div className="space-y-6">
      <section aria-label="Catalogue" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Brands" value={brands.length} icon={<Package className="h-5 w-5" />} />
        <StatCard label="Models" value={models.length} icon={<Package className="h-5 w-5" />} />
        <StatCard label="Products" value={products.length} icon={<Package className="h-5 w-5" />} />
        <StatCard label="Categories" value={categories.length} icon={<Package className="h-5 w-5" />} />
        <StatCard label="Countries" value={countries.length} icon={<Package className="h-5 w-5" />} />
      </section>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Needs attention" />
          <CardBody>
            <List empty="" items={[
              { key: "i", primary: `${noImage} product(s) without an image` },
              { key: "c", primary: `${noCategory} product(s) without a category` },
              { key: "d", primary: `${drafts} draft product(s)` },
              { key: "a", primary: `${archived} archived product(s)` },
            ]} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Brand > Model > Product" description="Products per brand (top 6)" />
          <CardBody>
            <Bars items={byBrand.map((b) => ({ label: `${b.label} (${b.models} models)`, value: b.value, tone: "dark" as const }))} />
          </CardBody>
        </Card>
      </div>
      <QuickActions
        actions={[
          { label: "New product", href: "/admin/products/all/new", resource: "products", action: "create" },
          { label: "New brand", href: "/admin/products/brands/new", resource: "brands", action: "create" },
          { label: "New model", href: "/admin/products/models/new", resource: "models", action: "create" },
          { label: "Categories", href: "/admin/products/categories", resource: "categories", action: "view" },
          { label: "Countries", href: "/admin/products/countries", resource: "countries", action: "view" },
          { label: "Media library", href: "/admin/media", resource: "media", action: "view" },
        ]}
      />
    </div>
  );
}

/* ---------------------------------- HR ---------------------------------- */

function HrDashboard() {
  const jobs = useActiveRows("jobs");
  const apps = useActiveRows("applications");
  const [now] = useState(() => Date.now());
  const jobName = new Map(jobs.map((j) => [j.id, textOf(j.title)]));
  const open = jobs.filter((j) => j.jobStatus === "open" && j.status === "published");
  const statuses = [
    { key: "new", label: "New", tone: "red" as const },
    { key: "under-review", label: "Under Review", tone: "amber" as const },
    { key: "shortlisted", label: "Shortlisted", tone: "green" as const },
    { key: "rejected", label: "Rejected", tone: "dark" as const },
    { key: "hired", label: "Hired", tone: "green" as const },
  ];
  const soon = jobs.filter((j) => j.applicationDeadline && j.jobStatus === "open" && new Date(j.applicationDeadline).getTime() - now < 30 * 86400000);
  const latest = [...apps].sort((a, b) => b.appliedAt.localeCompare(a.appliedAt)).slice(0, 5);
  return (
    <div className="space-y-6">
      <section aria-label="Recruitment" className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Open jobs" value={open.length} hint="Published and open" icon={<Briefcase className="h-5 w-5" />} />
        <StatCard label="Applications" value={apps.length} hint={sampleHint(apps)} icon={<FileText className="h-5 w-5" />} />
        <StatCard label="New applications" value={apps.filter((a) => a.applicationStatus === "new").length} hint="Awaiting review" icon={<Inbox className="h-5 w-5" />} />
      </section>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Applications by status" description={withSample(apps)} />
          <CardBody>
            <Bars items={statuses.map((s) => ({ label: s.label, value: apps.filter((a) => a.applicationStatus === s.key).length, tone: s.tone }))} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Latest applications" />
          <CardBody>
            <List empty="No applications yet." items={latest.map((a) => ({ key: a.id, primary: a.name, secondary: `${jobName.get(a.jobId) ?? a.jobId} · ${fmtDay(a.appliedAt)}`, right: a.isSample ? <SampleBadge /> : undefined }))} />
          </CardBody>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader title="Jobs closing soon" description="Application deadline within 30 days" />
          <CardBody>
            <List empty="No jobs with an upcoming deadline." items={soon.map((j) => ({ key: j.id, primary: textOf(j.title), secondary: `Deadline ${fmtDay(j.applicationDeadline)}` }))} />
          </CardBody>
        </Card>
      </div>
      <QuickActions
        actions={[
          { label: "Create a job opening", href: "/admin/careers/openings/new", resource: "jobs", action: "create" },
          { label: "Review applications", href: "/admin/careers/applications", resource: "applications", action: "view" },
          { label: "All job openings", href: "/admin/careers/openings", resource: "jobs", action: "view" },
        ]}
      />
    </div>
  );
}

/* ---------------------------------- Root ---------------------------------- */

const VARIANTS: { id: DashboardVariant; label: string }[] = [
  { id: "admin", label: ROLES.administrator.label },
  { id: "seo", label: ROLES["seo-manager"].label },
  { id: "content", label: ROLES["content-editor"].label },
  { id: "product", label: ROLES["product-manager"].label },
  { id: "hr", label: ROLES.hr.label },
];

export function Dashboard() {
  const { role, session } = useAuth();
  const ready = useDataReady();
  const [viewAs, setViewAs] = useState<DashboardVariant | null>(null);
  if (!role) return null;
  // The switcher is a permission-based convenience: only roles that can see every area get it.
  const isSuper = role.dashboard === "admin";
  const variant = isSuper && viewAs ? viewAs : role.dashboard;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title={`Welcome, ${session?.name.replace("Demo ", "") ?? ""}`}
        description={`${role.label} dashboard. ${role.description}`}
        actions={
          isSuper && (
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              View dashboard as
              <Select aria-label="View dashboard as" value={variant} onChange={(e) => setViewAs(e.target.value as DashboardVariant)} className="h-9 w-44">
                {VARIANTS.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </Select>
            </label>
          )
        }
      />
      {!ready ? (
        <div className="h-64 animate-pulse border border-slate-200 bg-white" aria-label="Loading" />
      ) : (
        <>
          {variant === "admin" && <AdminDashboard />}
          {variant === "seo" && <SeoDashboard />}
          {variant === "content" && <ContentDashboard />}
          {variant === "product" && <ProductDashboard />}
          {variant === "hr" && <HrDashboard />}
          <p className="mt-8 text-[11px] text-slate-400">Dashboard widgets are a convenience layout chosen by the design team, not a client requirement.</p>
        </>
      )}
    </div>
  );
}
