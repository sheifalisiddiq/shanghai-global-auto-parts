import type { Application, Job } from "../types";
import { L, baseFields, seoFrom } from "./util";

/**
 * Snapshot of the 4 openings hard-coded in components/careers/CareersContent.tsx
 * (that array is not exported, so it is copied here as the seed).
 */
interface SiteJob {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  overview: string;
  responsibilities: string[];
  requirements: string[];
}

const JOBS: SiteJob[] = [
  {
    id: "sales-executive",
    title: "Chinese Parts Technical Sales Executive",
    department: "Sales & Support",
    location: "Sharjah HQ / Dubai Branch, UAE",
    type: "Full-Time",
    experience: "3+ Years in Automotive Parts",
    overview:
      "Responsible for handling incoming workshop & trade queries, performing VIN-based catalog lookup for Chinese auto brands (Jetour, Changan, Geely, Chery, Haval, BYD, MG), and issuing accurate quotes.",
    responsibilities: [
      "Interpret customer part requests using EPC software, VIN numbers, and sample photographs.",
      "Issue wholesale and retail quotations with precise availability and delivery timelines.",
      "Maintain active communication with garage networks, fleet managers, and spare part shops.",
      "Collaborate with warehouse staff to ensure correct item picking and fast dispatch.",
    ],
    requirements: [
      "Minimum 3 years experience selling auto spare parts in the GCC region.",
      "Familiarity with Chinese vehicle brands (Jetour, Changan, Geely, Chery, MG, etc.) is a major advantage.",
      "Fluent in English; Arabic or Chinese language skills are highly beneficial.",
      "Strong customer service orientation and speed in technical lookup.",
    ],
  },
  {
    id: "warehouse-supervisor",
    title: "Warehouse & Inventory Controller",
    department: "Warehouse Operations",
    location: "Sharjah Industrial Area 4, UAE",
    type: "Full-Time",
    experience: "2+ Years in Parts Warehouse",
    overview:
      "Manage inbound container shipments, conduct quality audits on arriving original & OEM spare parts, catalog stock with barcode scanners, and coordinate outbound order fulfillment.",
    responsibilities: [
      "Inspect inbound container arrivals from overseas manufacturing partners against packing manifests.",
      "Ensure accurate bin location assignment and update inventory stock in our ERP system.",
      "Execute pre-dispatch quality checks to guarantee correct OEM part numbers and defect-free packaging.",
      "Oversee daily order picking, packing, and dispatch for UAE deliveries and export sea/air freight.",
    ],
    requirements: [
      "Proven track record in automotive parts warehousing and inventory auditing.",
      "Hands-on experience with WMS / ERP barcode inventory software.",
      "Physical stamina and attention to detail for part numbers and fragile components.",
      "Ability to thrive in a high-volume, fast-paced hub environment.",
    ],
  },
  {
    id: "logistics-coordinator",
    title: "GCC Export & Logistics Specialist",
    department: "Logistics & Supply Chain",
    location: "Sharjah / Qatar Operations",
    type: "Full-Time",
    experience: "3+ Years Freight & Customs",
    overview:
      "Coordinate land transport, sea freight containers, and air cargo shipments to branches and wholesale buyers in Saudi Arabia, Qatar, Oman, Kuwait, and global export destinations.",
    responsibilities: [
      "Manage end-to-end export documentation including COO, commercial invoices, and customs clearance paperwork.",
      "Negotiate competitive freight rates with courier partners, land transport carriers, and shipping lines.",
      "Track consignment progress and ensure shipment clearance across GCC border posts.",
      "Provide real-time tracking updates to regional distribution partners.",
    ],
    requirements: [
      "In-depth knowledge of GCC customs regulations, Dubai/Sharjah export procedures, and land border logistics.",
      "Strong relationship with regional freight forwarders and courier services.",
      "Proficient in Microsoft Excel, logistics documentation systems, and cargo tracking tools.",
      "Proactive problem solver with excellent negotiation skills.",
    ],
  },
  {
    id: "sourcing-specialist",
    title: "OEM Parts Sourcing & Procurement Specialist",
    department: "Procurement & Sourcing",
    location: "China Desk / Sharjah HQ",
    type: "Full-Time",
    experience: "4+ Years Auto Parts Sourcing",
    overview:
      "Work closely with tier-1 Chinese auto component factories and original suppliers to procure fast-moving maintenance, engine, brake, and body spare parts at competitive costs.",
    responsibilities: [
      "Analyze fast-moving SKU metrics across GCC markets and place replenishment orders.",
      "Evaluate Chinese supplier quality standards, factory certifications, and lead times.",
      "Resolve catalog discrepancies, updated part number cross-references, and supersessions.",
      "Negotiate bulk volume pricing and secure priority production slots with manufacturers.",
    ],
    requirements: [
      "Direct experience sourcing Chinese automotive parts (OEM/Original) from Tier-1 suppliers.",
      "Mandatory bilingual proficiency (English & Mandarin/Chinese).",
      "Deep understanding of vehicle systems (Engine, Transmission, Suspension, Electronics).",
      "Strong analytical capability for forecasting inventory demand.",
    ],
  },
];

const list = (items: string[]) => items.map((text) => ({ text: L(text) }));

export function seedJobs(): Job[] {
  return JOBS.map((j) => ({
    ...baseFields(j.id),
    title: L(j.title),
    slug: j.id,
    department: j.department,
    location: j.location,
    employmentType: j.type,
    experience: j.experience,
    salaryRange: "",
    showSalary: false,
    summary: L(j.overview),
    responsibilities: list(j.responsibilities),
    requirements: list(j.requirements),
    skills: [],
    benefits: [],
    applicationDeadline: "",
    datePosted: "2026-09-01",
    validThrough: "",
    hiringOrganisation: "Shanghai Global Auto Parts LLC",
    applyUrl: "/careers#apply-form",
    hrEmail: "info@shanghaiglobalauto.com",
    cvUpload: false,
    jobStatus: "open" as const,
    seo: seoFrom(`${j.title} | Careers`, j.overview, { schemaType: "JobPosting" }),
  }));
}

/** SAMPLE rows: the public Careers form is not connected, so there are no real applications. */
export function seedApplications(): Application[] {
  const rows: Omit<Application, keyof ReturnType<typeof baseFields>>[] = [
    { jobId: "sales-executive", name: "Sample Applicant A", email: "applicant.a@example.com", phone: "+971 50 000 0001", appliedAt: "2026-09-14T08:30:00.000Z", cvFile: "sample-cv-a.pdf", experience: "3-5 Years", notes: "Sample application for demonstration.", internalNotes: "", applicationStatus: "new" },
    { jobId: "sales-executive", name: "Sample Applicant B", email: "applicant.b@example.com", phone: "+971 50 000 0002", appliedAt: "2026-09-12T11:10:00.000Z", cvFile: "sample-cv-b.pdf", experience: "5+ Years", notes: "Sample application for demonstration.", internalNotes: "Strong GCC parts background.", applicationStatus: "shortlisted" },
    { jobId: "warehouse-supervisor", name: "Sample Applicant C", email: "applicant.c@example.com", phone: "+971 50 000 0003", appliedAt: "2026-09-10T14:00:00.000Z", cvFile: "sample-cv-c.pdf", experience: "1-3 Years", notes: "Sample application for demonstration.", internalNotes: "", applicationStatus: "under-review" },
    { jobId: "logistics-coordinator", name: "Sample Applicant D", email: "applicant.d@example.com", phone: "+971 50 000 0004", appliedAt: "2026-09-08T09:45:00.000Z", cvFile: "sample-cv-d.pdf", experience: "3-5 Years", notes: "Sample application for demonstration.", internalNotes: "Does not meet customs experience requirement.", applicationStatus: "rejected" },
    { jobId: "sourcing-specialist", name: "Sample Applicant E", email: "applicant.e@example.com", phone: "+971 50 000 0005", appliedAt: "2026-09-02T16:20:00.000Z", cvFile: "sample-cv-e.pdf", experience: "5+ Years", notes: "Sample application for demonstration.", internalNotes: "Offer accepted.", applicationStatus: "hired" },
  ];
  return rows.map((r, i) => ({ ...baseFields(`app-sample-${i + 1}`, "published", true), ...r }));
}
