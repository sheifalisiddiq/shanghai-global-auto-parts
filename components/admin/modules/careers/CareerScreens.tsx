"use client";

import { useMemo, useState } from "react";
import { Lock, LockOpen } from "lucide-react";
import { db } from "@/lib/admin/data";
import { useActiveRows, useEntity } from "@/lib/admin/data/hooks";
import { textOf } from "@/lib/admin/data/defaults";
import { newJob } from "@/lib/admin/data/factories";
import type { Application, ApplicationStatus, Enquiry, EnquiryStatus, Job } from "@/lib/admin/data/types";
import type { FieldDef } from "@/lib/admin/forms/types";
import { useCan } from "@/lib/admin/auth/AuthContext";
import { CollectionList } from "../../editors/CollectionList";
import { EntityEditor } from "../../editors/EntityEditor";
import { Field, Select, TextArea } from "../../fields/inputs";
import { Badge, SampleBadge, StatusBadge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import { useFeedback } from "../../ui/Feedback";
import { Overlay } from "../../ui/Overlay";

type Rec = Record<string, unknown>;
const T = (name: string, label: string, required = false): FieldDef => ({ type: "text", name, label, localized: true, required });
const TA = (name: string, label: string, rows = 3): FieldDef => ({ type: "textarea", name, label, localized: true, rows });
const fmt = (iso: string) => (iso ? new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "");
const fmtDay = (iso: string) => (iso ? new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "");

/* --------------------------------- Jobs --------------------------------- */

const item = (name: string, label: string, add: string): FieldDef => ({ type: "repeater", name, label, titleKey: "text", addLabel: add, item: [T("text", "Text")] });

const JOB_BASIC: FieldDef[] = [
  T("title", "Job title", true),
  { type: "slug", name: "slug", label: "Slug / permalink", from: "title" },
  { type: "text", name: "department", label: "Department", required: true },
  { type: "text", name: "location", label: "Location / country", required: true },
  { type: "select", name: "employmentType", label: "Employment type", options: ["Full-Time", "Part-Time", "Contract", "Internship"].map((v) => ({ value: v, label: v })) },
  { type: "text", name: "experience", label: "Experience required" },
  { type: "text", name: "salaryRange", label: "Salary range (optional)" },
  { type: "toggle", name: "showSalary", label: "Display the salary range on the job page" },
  { type: "select", name: "jobStatus", label: "Job status", options: [{ value: "open", label: "Open" }, { value: "closed", label: "Closed" }] },
];
const JOB_CONTENT: FieldDef[] = [
  TA("summary", "Summary", 4),
  item("responsibilities", "Responsibilities", "Add responsibility"),
  item("requirements", "Requirements", "Add requirement"),
  item("skills", "Skills", "Add skill"),
  item("benefits", "Benefits", "Add benefit"),
  { type: "date", name: "applicationDeadline", label: "Application deadline" },
];
const JOB_APPLICATION: FieldDef[] = [
  { type: "url", name: "applyUrl", label: "Apply URL / form", placeholder: "/careers#apply-form" },
  { type: "email", name: "hrEmail", label: "HR email routing" },
  { type: "toggle", name: "cvUpload", label: "Allow CV upload" },
];
const JOB_POSTING: FieldDef[] = [
  { type: "info", text: "JobPosting schema fields. These feed the structured data Google uses for job listings." },
  { type: "date", name: "datePosted", label: "Date posted" },
  { type: "date", name: "validThrough", label: "Valid through" },
  { type: "text", name: "hiringOrganisation", label: "Hiring organisation" },
];

export function JobsList() {
  const apps = useActiveRows("applications");
  const can = useCan();
  return (
    <CollectionList
      collection="jobs"
      resource="jobs"
      title="Job Openings"
      description="Careers > Job Opening. Published open jobs appear on the Careers page."
      singular="job"
      editBase="/admin/careers/openings"
      exportName="job-openings"
      searchText={(r) => `${textOf(r.title)} ${r.department} ${r.location}`}
      columns={[
        { key: "title", header: "Job", value: (r) => textOf(r.title), render: (r) => <span className="font-semibold text-ink">{textOf(r.title)}</span> },
        { key: "dept", header: "Department", value: (r) => r.department },
        { key: "loc", header: "Location", value: (r) => r.location },
        { key: "apps", header: "Applications", value: (r) => apps.filter((a) => a.jobId === r.id).length },
        { key: "job", header: "Open / closed", value: (r) => r.jobStatus, render: (r) => <Badge tone={r.jobStatus === "open" ? "green" : "neutral"}>{r.jobStatus}</Badge> },
        { key: "status", header: "Status", value: (r) => r.status, render: (r) => <StatusBadge status={r.status} /> },
      ]}
      filters={[{ key: "job", label: "Open / closed", options: [{ value: "open", label: "Open" }, { value: "closed", label: "Closed" }], match: (r, v) => r.jobStatus === v }]}
      extraRowActions={(row) =>
        can("jobs", "edit")
          ? [{ label: row.jobStatus === "open" ? "Close job" : "Reopen job", icon: row.jobStatus === "open" ? <Lock className="h-3.5 w-3.5" /> : <LockOpen className="h-3.5 w-3.5" />, onRun: async (r) => { await db.update("jobs", r.id, { jobStatus: r.jobStatus === "open" ? "closed" : "open" }); } }]
          : []
      }
    />
  );
}

export function JobEditor({ id }: { id?: string }) {
  const can = useCan();
  return (
    <EntityEditor
      collection="jobs"
      resource="jobs"
      id={id}
      singular="job"
      listHref="/admin/careers/openings"
      listLabel="Job Openings"
      crumbs={[{ label: "Careers" }]}
      makeNew={() => newJob() as unknown as Rec}
      seo={{ slugFrom: "title" }}
      preview={(r) => {
        const j = r as unknown as Job;
        return { title: textOf(j.title) || "Untitled job", summary: textOf(j.summary), meta: [j.department, j.location, j.employmentType, j.jobStatus === "closed" ? "Closed" : "Open"].filter(Boolean) };
      }}
      extraActions={({ record }) =>
        id && can("jobs", "edit") ? (
          <Button
            icon={record.jobStatus === "open" ? <Lock className="h-3.5 w-3.5" /> : <LockOpen className="h-3.5 w-3.5" />}
            onClick={async () => { await db.update("jobs", id, { jobStatus: record.jobStatus === "open" ? "closed" : "open" }); }}
          >
            {record.jobStatus === "open" ? "Close Job" : "Reopen Job"}
          </Button>
        ) : null
      }
      tabs={[
        { id: "basic", label: "Job", fields: JOB_BASIC, columns: true },
        { id: "content", label: "Content", fields: JOB_CONTENT },
        { id: "application", label: "Application", fields: JOB_APPLICATION },
        { id: "posting", label: "JobPosting schema", fields: JOB_POSTING, columns: true },
      ]}
    />
  );
}

/* ------------------------------ Applications ------------------------------ */

const APP_STATUS: { value: ApplicationStatus; label: string; tone: "neutral" | "blue" | "amber" | "red" | "green" }[] = [
  { value: "new", label: "New", tone: "blue" },
  { value: "under-review", label: "Under Review", tone: "amber" },
  { value: "shortlisted", label: "Shortlisted", tone: "green" },
  { value: "rejected", label: "Rejected", tone: "red" },
  { value: "hired", label: "Hired", tone: "green" },
];
const appTone = (s: ApplicationStatus) => APP_STATUS.find((x) => x.value === s)?.tone ?? "neutral";
const appLabel = (s: ApplicationStatus) => APP_STATUS.find((x) => x.value === s)?.label ?? s;

export function ApplicationsList() {
  const jobs = useActiveRows("jobs");
  const jobName = useMemo(() => new Map(jobs.map((j) => [j.id, textOf(j.title)])), [jobs]);
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <>
      <CollectionList
        collection="applications"
        resource="applications"
        title="Applications"
        description="Applications submitted through the Careers page will appear here. The public form is not connected yet, so these are Sample rows."
        singular="application"
        crumbs={[{ label: "Careers" }]}
        hardDelete
        onEdit={(r) => setOpenId(r.id)}
        exportName="applications"
        defaultSort={{ key: "date", dir: "desc" }}
        searchText={(r) => `${r.name} ${r.email} ${jobName.get(r.jobId) ?? ""}`}
        columns={[
          { key: "name", header: "Applicant", value: (r) => r.name, render: (r) => <span className="font-semibold text-ink">{r.name}</span> },
          { key: "job", header: "Job", value: (r) => jobName.get(r.jobId) ?? r.jobId },
          { key: "email", header: "Email", value: (r) => r.email },
          { key: "phone", header: "Phone", value: (r) => r.phone },
          { key: "date", header: "Applied", value: (r) => r.appliedAt, render: (r) => fmtDay(r.appliedAt), csv: (r) => r.appliedAt },
          { key: "cv", header: "CV", value: (r) => r.cvFile },
          { key: "st", header: "Status", value: (r) => r.applicationStatus, render: (r) => <Badge tone={appTone(r.applicationStatus)}>{appLabel(r.applicationStatus)}</Badge> },
        ]}
        filters={[
          { key: "st", label: "Status", options: APP_STATUS.map((s) => ({ value: s.value, label: s.label })), match: (r, v) => r.applicationStatus === v },
          { key: "job", label: "Job", options: jobs.map((j) => ({ value: j.id, label: textOf(j.title) })), match: (r, v) => r.jobId === v },
        ]}
        extraBulkActions={[
          ...APP_STATUS.map((s) => ({ label: `Mark ${s.label}`, onRun: async (ids: string[]) => { await db.bulkUpdate("applications", ids, { applicationStatus: s.value } as Partial<Application>); } })),
        ]}
      />
      <ApplicationDrawer id={openId} onClose={() => setOpenId(null)} jobName={jobName} />
    </>
  );
}

function ApplicationDrawer({ id, onClose, jobName }: { id: string | null; onClose: () => void; jobName: Map<string, string> }) {
  const { entity } = useEntity("applications", id ?? undefined);
  if (!id || !entity) return null;
  return <ApplicationBody key={id} app={entity} onClose={onClose} jobName={jobName} />;
}

function ApplicationBody({ app, onClose, jobName }: { app: Application; onClose: () => void; jobName: Map<string, string> }) {
  const can = useCan();
  const { toast } = useFeedback();
  const canEdit = can("applications", "edit");
  const [status, setStatus] = useState<ApplicationStatus>(app.applicationStatus);
  const [notes, setNotes] = useState(app.internalNotes);
  const rows: [string, string][] = [
    ["Job", jobName.get(app.jobId) ?? app.jobId],
    ["Email", app.email],
    ["Phone", app.phone],
    ["Applied", fmt(app.appliedAt)],
    ["Experience", app.experience],
    ["CV", app.cvFile],
  ];
  return (
    <Overlay
      open
      onClose={onClose}
      variant="drawer"
      title={app.name}
      description={<span className="flex items-center gap-2">{app.isSample && <SampleBadge />}<Badge tone={appTone(app.applicationStatus)}>{appLabel(app.applicationStatus)}</Badge></span>}
      footer={
        <>
          <Button onClick={onClose}>Close</Button>
          {canEdit && (
            <Button
              variant="primary"
              onClick={async () => {
                await db.update("applications", app.id, { applicationStatus: status, internalNotes: notes });
                toast("Application updated.");
                onClose();
              }}
            >
              Save
            </Button>
          )}
        </>
      }
    >
      <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">{k}</dt>
            <dd className="mt-0.5 text-sm text-ink">{v || "-"}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-5">
        <p className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">Applicant notes</p>
        <p className="mt-1 text-sm whitespace-pre-wrap text-slate-700">{app.notes || "-"}</p>
      </div>
      <div className="mt-6 space-y-4 border-t border-slate-200 pt-5">
        <Field label="Status">
          <Select value={status} disabled={!canEdit} onChange={(e) => setStatus(e.target.value as ApplicationStatus)}>
            {APP_STATUS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Internal notes (not visible to the applicant)">
          <TextArea rows={4} value={notes} readOnly={!canEdit} onChange={(e) => setNotes(e.target.value)} />
        </Field>
      </div>
    </Overlay>
  );
}

/* ------------------------------- Enquiries ------------------------------- */

const ENQ_STATUS: { value: EnquiryStatus; label: string; tone: "blue" | "amber" | "neutral" }[] = [
  { value: "new", label: "New", tone: "blue" },
  { value: "in-progress", label: "In progress", tone: "amber" },
  { value: "closed", label: "Closed", tone: "neutral" },
];
const enqTone = (s: EnquiryStatus) => ENQ_STATUS.find((x) => x.value === s)?.tone ?? "neutral";
const enqLabel = (s: EnquiryStatus) => ENQ_STATUS.find((x) => x.value === s)?.label ?? s;

export function EnquiriesList({ source }: { source: "contact" | "product" }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const isContact = source === "contact";
  return (
    <>
      <CollectionList
        collection="enquiries"
        resource="enquiries"
        title={isContact ? "Contact Enquiries" : "Product Enquiries"}
        description={
          isContact
            ? "Messages sent through the Contact Us form. Today the live form only emails the business and stores nothing, so these are Sample rows."
            : "Enquiries sent from the Products pages. Today they are only emailed, so these are Sample rows."
        }
        singular="enquiry"
        crumbs={[{ label: "Enquiries" }]}
        hardDelete
        rowFilter={(r) => r.source === source}
        onEdit={(r) => setOpenId(r.id)}
        exportName={`${source}-enquiries`}
        defaultSort={{ key: "date", dir: "desc" }}
        searchText={(r) => `${r.name} ${r.email} ${r.subject} ${r.message}`}
        columns={[
          { key: "name", header: "Name", value: (r) => r.name, render: (r) => <span className="font-semibold text-ink">{r.name}</span> },
          { key: "email", header: "Email", value: (r) => r.email },
          { key: "phone", header: "Phone", value: (r) => r.phone },
          { key: "country", header: "Country", value: (r) => r.country },
          { key: "subject", header: isContact ? "Subject" : "Interest", value: (r) => r.subject },
          { key: "date", header: "Received", value: (r) => r.receivedAt, render: (r) => fmtDay(r.receivedAt), csv: (r) => r.receivedAt },
          { key: "st", header: "Status", value: (r) => r.enquiryStatus, render: (r) => <Badge tone={enqTone(r.enquiryStatus)}>{enqLabel(r.enquiryStatus)}</Badge> },
        ]}
        filters={[{ key: "st", label: "Status", options: ENQ_STATUS.map((s) => ({ value: s.value, label: s.label })), match: (r, v) => r.enquiryStatus === v }]}
        extraBulkActions={ENQ_STATUS.map((s) => ({ label: `Mark ${s.label}`, onRun: async (ids: string[]) => { await db.bulkUpdate("enquiries", ids, { enquiryStatus: s.value } as Partial<Enquiry>); } }))}
      />
      <EnquiryDrawer id={openId} onClose={() => setOpenId(null)} />
    </>
  );
}

function EnquiryDrawer({ id, onClose }: { id: string | null; onClose: () => void }) {
  const { entity } = useEntity("enquiries", id ?? undefined);
  if (!id || !entity) return null;
  return <EnquiryBody key={id} enquiry={entity} onClose={onClose} />;
}

function EnquiryBody({ enquiry: e, onClose }: { enquiry: Enquiry; onClose: () => void }) {
  const can = useCan();
  const { toast } = useFeedback();
  const canEdit = can("enquiries", "edit");
  const [status, setStatus] = useState<EnquiryStatus>(e.enquiryStatus);
  const rows: [string, string][] = [
    ["Email", e.email],
    ["Phone", e.phone],
    ["Country", e.country],
    [e.source === "contact" ? "Subject" : "Interest", e.subject],
    ["Received", fmt(e.receivedAt)],
    ["Consent given", e.consent ? "Yes" : "No"],
  ];
  return (
    <Overlay
      open
      onClose={onClose}
      variant="drawer"
      title={e.name}
      description={<span className="flex items-center gap-2">{e.isSample && <SampleBadge />}<Badge tone={enqTone(e.enquiryStatus)}>{enqLabel(e.enquiryStatus)}</Badge></span>}
      footer={
        <>
          <Button onClick={onClose}>Close</Button>
          {canEdit && (
            <Button variant="primary" onClick={async () => { await db.update("enquiries", e.id, { enquiryStatus: status }); toast("Enquiry updated."); onClose(); }}>
              Save
            </Button>
          )}
        </>
      }
    >
      <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">{k}</dt>
            <dd className="mt-0.5 text-sm text-ink">{v || "-"}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-5">
        <p className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">Message</p>
        <p className="mt-1 text-sm whitespace-pre-wrap text-slate-700">{e.message}</p>
      </div>
      <div className="mt-6 border-t border-slate-200 pt-5">
        <Field label="Status">
          <Select value={status} disabled={!canEdit} onChange={(ev) => setStatus(ev.target.value as EnquiryStatus)}>
            {ENQ_STATUS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>
    </Overlay>
  );
}
