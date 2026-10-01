"use client";

import Image from "next/image";
import { useState } from "react";
import {
  CheckCircle2,
  ArrowRight,
  Send,
  Sparkles,
  Users,
  Award,
  Globe2,
  Clock,
  MapPin,
  MessageCircle,
  Mail,
  ShieldCheck,
  Paperclip,
  X,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/translations";

interface JobPosition {
  id: string;
  title: string;
  department: "sales" | "warehouse" | "logistics" | "procurement";
  departmentLabel: string;
  location: string;
  type: string;
  experience: string;
  overview: string;
  responsibilities: string[];
  requirements: string[];
}

const jobPositions: JobPosition[] = [
  {
    id: "sales-executive",
    title: "Chinese Parts Technical Sales Executive",
    department: "sales",
    departmentLabel: "Sales & Support",
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
    department: "warehouse",
    departmentLabel: "Warehouse Operations",
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
    department: "logistics",
    departmentLabel: "Logistics & Supply Chain",
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
    department: "procurement",
    departmentLabel: "Procurement & Sourcing",
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

const perks = [
  {
    icon: Award,
    id: "leader",
  },
  {
    icon: Globe2,
    id: "reach",
  },
  {
    icon: Users,
    id: "growth",
  },
  {
    icon: ShieldCheck,
    id: "benefits",
  },
];

export function CareersContent() {
  const { t: rawT } = useLanguage();
  const t = (key: string) => rawT(key as TranslationKey);
  const jt = (job: JobPosition, f: string) => t(`career.job.${job.id}.${f}`);
  const expLabels: Record<string, string> = {
    "Less than 1 Year": t("career.form.exp.lt1"),
    "1-3 Years": t("career.form.exp.1to3"),
    "3-5 Years": t("career.form.exp.3to5"),
    "5+ Years": t("career.form.exp.5plus"),
  };
  const positionLabel = (value: string) => {
    const job = jobPositions.find((j) => j.title === value);
    return job ? jt(job, "title") : t("career.form.general");
  };
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedJob, setSelectedJob] = useState<JobPosition | null>(null);

  // Application Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "Chinese Parts Technical Sales Executive",
    experience: "1-3 Years",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState("");

  const filteredJobs =
    activeTab === "all"
      ? jobPositions
      : jobPositions.filter((job) => job.department === activeTab);

  const MAX_RESUME_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_RESUME_EXTENSIONS = [".pdf", ".doc", ".docx"];

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setResumeFile(null);
      setResumeError("");
      return;
    }
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!ALLOWED_RESUME_EXTENSIONS.includes(ext)) {
      setResumeFile(null);
      setResumeError(t("career.err.type"));
      e.target.value = "";
      return;
    }
    if (file.size > MAX_RESUME_SIZE) {
      setResumeFile(null);
      setResumeError(t("career.err.size"));
      e.target.value = "";
      return;
    }
    setResumeFile(file);
    setResumeError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) {
      setResumeError(t("career.err.missing"));
      return;
    }
    setSubmitted(true);
  };

  return (
    <>
      {/* 1. Hero Section */}
      <section className="relative flex min-h-[620px] items-center overflow-hidden bg-slate-950 py-16 text-white sm:py-24 lg:min-h-[680px] lg:py-28">
        <Image
          src="/images/careers/automotive-engineer-hero.png"
          alt={t("career.heroAlt")}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_center]"
        />
        <div className="pointer-events-none absolute inset-0 bg-slate-950/35" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/10" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-slate-950/25" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-brand-red/20 via-transparent to-transparent opacity-70" />

        <Container className="relative z-10 w-full">
          <div className="max-w-3xl">
            <span className="font-ui mb-4 inline-flex items-center gap-2 rounded-full border border-brand-red/30 bg-brand-red/10 px-3.5 py-1 text-xs tracking-widest text-brand-red uppercase backdrop-blur-sm">
              <Sparkles className="size-3.5 text-brand-red" />
              <span>{t("career.hiring")}</span>
            </span>
            <h1 className="h1-hero drop-shadow-lg">
              {t("careers.title")}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-200 drop-shadow-md sm:text-lg">
              {t("careers.subtitle")}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#openings"
                className="font-ui inline-flex items-center gap-2 rounded-lg bg-brand-red px-6 py-3.5 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-white hover:text-ink"
              >
                <span>{t("careers.browseOpenings")}</span>
                <ArrowRight className="size-4 rtl:rotate-180" />
              </a>

              <a
                href="#apply-form"
                className="font-ui inline-flex items-center gap-2 rounded-lg border border-white/25 bg-slate-950/30 px-6 py-3.5 text-xs font-bold tracking-wider text-white uppercase backdrop-blur-sm transition-colors hover:bg-white hover:text-ink"
              >
                <span>{t("careers.submitCv")}</span>
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Why Join Us (Perks) */}
      <section className="bg-white py-16 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow={t("career.perks.eyebrow")}
            title={t("career.perks.title")}
            description={t("career.perks.desc")}
            className="max-w-3xl"
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map((perk) => {
              const Icon = perk.icon;
              return (
                <div
                  key={perk.id}
                  className="group rounded-2xl border border-slate-200 bg-slate-50/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-red/30 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red group-hover:bg-brand-red group-hover:text-white transition-colors">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="font-ui mt-6 text-lg font-bold text-ink uppercase tracking-wide">
                    {t(`career.perk.${perk.id}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-steel-dark">{t(`career.perk.${perk.id}.desc`)}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 3. Open Positions */}
      <section id="openings" className="scroll-mt-20 bg-paper py-16 lg:py-24">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow={t("career.open.eyebrow")}
              title={t("career.open.title")}
              description={t("career.open.desc")}
            />

            {/* Department Filter Tabs */}
            <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
              {[
                { id: "all", label: t("career.tab.all") },
                { id: "sales", label: t("career.tab.sales") },
                { id: "warehouse", label: t("career.tab.warehouse") },
                { id: "logistics", label: t("career.tab.logistics") },
                { id: "procurement", label: t("career.tab.procurement") },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-brand-red text-white"
                      : "text-slate-600 hover:text-ink hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-brand-red/40 hover:shadow-md"
              >
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-ui rounded-md bg-brand-red/10 px-2.5 py-1 text-[11px] font-bold tracking-wider text-brand-red uppercase">
                          {jt(job, "dept")}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <MapPin className="size-3.5 text-slate-400" />
                          <span>{jt(job, "loc")}</span>
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="size-3.5 text-slate-400" />
                          <span>{jt(job, "type")}</span>
                        </span>
                      </div>
                      <h3 className="font-display mt-3 text-2xl font-black text-ink uppercase tracking-[-0.005em] sm:tracking-[-0.02em] sm:text-3xl">
                        {jt(job, "title")}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-steel-dark max-w-3xl">
                        {jt(job, "overview")}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 pt-2 lg:pt-0">
                      <button
                        type="button"
                        onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                        className="font-ui inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-5 py-3 text-xs font-bold text-ink uppercase transition-colors hover:border-ink hover:bg-white cursor-pointer"
                      >
                        <span>{selectedJob?.id === job.id ? t("career.hideDetails") : t("career.viewDetails")}</span>
                        <ArrowRight
                          className={`size-4 transition-transform duration-200 rtl:rotate-180 ${
                            selectedJob?.id === job.id ? "rotate-90 rtl:rotate-90" : ""
                          }`}
                        />
                      </button>

                      <a
                        href="#apply-form"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, position: job.title }))
                        }
                        className="font-ui inline-flex items-center gap-2 rounded-xl bg-brand-red px-5 py-3 text-xs font-bold text-white uppercase transition-colors hover:bg-ink cursor-pointer"
                      >
                        <span>{t("career.applyNow")}</span>
                      </a>
                    </div>
                  </div>

                  {/* Expanded Position Details */}
                  {selectedJob?.id === job.id && (
                    <div className="mt-6 border-t border-slate-200 pt-6 animate-in fade-in duration-200">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div>
                          <h4 className="font-ui text-xs font-bold uppercase tracking-wider text-brand-red mb-3">
                            {t("career.responsibilities")}
                          </h4>
                          <ul className="space-y-2">
                            {job.responsibilities.map((_, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-steel-dark">
                                <CheckCircle2 className="size-4 shrink-0 text-brand-red mt-0.5" />
                                <span>{jt(job, `r${i + 1}`)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-ui text-xs font-bold uppercase tracking-wider text-brand-red mb-3">
                            {t("career.requirements")}
                          </h4>
                          <ul className="space-y-2">
                            {job.requirements.map((_, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-steel-dark">
                                <CheckCircle2 className="size-4 shrink-0 text-brand-red mt-0.5" />
                                <span>{jt(job, `q${i + 1}`)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-slate-50 p-4">
                        <div className="text-xs text-slate-600">
                          <span className="font-bold text-ink">{t("career.requiredExp")}</span> {jt(job, "exp")}
                        </div>
                        <a
                          href={`mailto:info@shanghaiglobalauto.com?subject=${encodeURIComponent(
                            `${t("career.mailSubject")} ${jt(job, "title")}`,
                          )}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-red hover:text-ink"
                        >
                          <Mail className="size-4" />
                          <span>{t("career.directEmail")} {jt(job, "title")}</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. Interactive Quick Application Form */}
      <section id="apply-form" className="scroll-mt-20 bg-white py-16 lg:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <span className="font-ui mb-3 block text-xs tracking-[0.3em] text-brand-red uppercase font-bold">
                {t("career.apply.eyebrow")}
              </span>
              <h2 className="font-display text-3xl font-black uppercase text-ink tracking-[-0.005em] sm:tracking-[-0.02em] sm:text-4xl lg:text-5xl">
                {t("career.apply.title")}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-steel-dark">
                {t("career.apply.desc")}
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <MessageCircle className="size-5" />
                  </div>
                  <div>
                    <div className="font-bold text-ink text-sm">{t("career.wa.title")}</div>
                    <p className="text-xs text-slate-600 mt-0.5">{t("career.wa.desc")}</p>
                    <a
                      href={`https://wa.me/97165335866?text=${encodeURIComponent(t("career.wa.text"))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline"
                    >
                      <span>{t("career.wa.cta")}</span>
                      <ArrowRight className="size-3.5 rtl:rotate-180" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red">
                    <Mail className="size-5" />
                  </div>
                  <div>
                    <div className="font-bold text-ink text-sm">{t("career.hr.title")}</div>
                    <p className="text-xs text-slate-600 mt-0.5">info@shanghaiglobalauto.com</p>
                    <a
                      href={`mailto:info@shanghaiglobalauto.com?subject=${encodeURIComponent(t("career.hr.subject"))}`}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-brand-red hover:underline"
                    >
                      <span>{t("career.hr.cta")}</span>
                      <ArrowRight className="size-3.5 rtl:rotate-180" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6 sm:p-10 shadow-lg">
                {submitted ? (
                  <div className="py-12 text-center animate-in zoom-in-95 duration-300">
                    <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <CheckCircle2 className="size-10" />
                    </div>
                    <h3 className="font-display mt-6 text-2xl font-black text-ink uppercase tracking-[-0.005em] sm:tracking-[-0.02em]">
                      {t("career.success.title")}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600 max-w-md mx-auto">
                      {t("career.success.a")} <strong className="text-ink">{formData.name}</strong>. {t("career.success.b")} <strong className="text-ink">{positionLabel(formData.position)}</strong> {t("career.success.c")}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setResumeFile(null);
                        setResumeError("");
                      }}
                      className="font-ui mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-red px-6 py-3 text-xs font-bold text-white uppercase cursor-pointer hover:bg-ink transition-colors"
                    >
                      {t("career.success.again")}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="font-ui text-lg font-bold text-ink uppercase tracking-wide mb-2">
                      {t("career.form.title")}
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                          {t("career.form.name")}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder={t("career.form.namePh")}
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-brand-red"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                          {t("career.form.email")}
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@example.com"
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-brand-red"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                          {t("career.form.phone")}
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+971 50 123 4567"
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-brand-red"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                          {t("career.form.exp")}
                        </label>
                        <select
                          value={formData.experience}
                          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-brand-red"
                        >
                          <option value="Less than 1 Year">{expLabels["Less than 1 Year"]}</option>
                          <option value="1-3 Years">{expLabels["1-3 Years"]}</option>
                          <option value="3-5 Years">{expLabels["3-5 Years"]}</option>
                          <option value="5+ Years">{expLabels["5+ Years"]}</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                        {t("career.form.position")}
                      </label>
                      <select
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-brand-red"
                      >
                        {jobPositions.map((job) => (
                          <option key={job.id} value={job.title}>
                            {jt(job, "title")} ({jt(job, "dept")})
                          </option>
                        ))}
                        <option value="General Open Application">{t("career.form.general")}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                        {t("career.form.resume")}
                      </label>
                      {resumeFile ? (
                        <div className="flex items-center justify-between rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-ink">
                          <span className="flex items-center gap-2 truncate">
                            <Paperclip className="size-4 shrink-0 text-brand-red" />
                            <span className="truncate">{resumeFile.name}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setResumeFile(null)}
                            aria-label={t("career.form.removeResume")}
                            className="ml-2 flex size-6 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-ink cursor-pointer"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex w-full cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-500 transition-colors hover:border-brand-red hover:text-brand-red">
                          <Paperclip className="size-4 shrink-0" />
                          <span>{t("career.form.choose")}</span>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleResumeChange}
                            className="sr-only"
                          />
                        </label>
                      )}
                      {resumeError && (
                        <p className="mt-1.5 text-xs font-semibold text-brand-red">{resumeError}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                        {t("career.form.notes")}
                      </label>
                      <textarea
                        rows={4}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder={t("career.form.notesPh")}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-brand-red"
                      />
                    </div>

                    <button
                      type="submit"
                      className="font-ui flex w-full items-center justify-center gap-2 rounded-xl bg-brand-red py-4 text-xs font-bold text-white uppercase tracking-wider transition-colors hover:bg-ink cursor-pointer"
                    >
                      <Send className="size-4" />
                      <span>{t("career.form.submit")}</span>
                    </button>

                    <p className="text-[11px] text-slate-500 text-center mt-2">
                      {t("career.form.consent")}
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. Bottom CTA */}
      <section className="bg-ink py-14 text-white">
        <Container className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <span className="font-ui text-xs tracking-[0.25em] text-brand-red uppercase font-bold">
              {t("career.cta.eyebrow")}
            </span>
            <h2 className="font-display mt-3 text-3xl font-black uppercase tracking-[-0.005em] sm:tracking-[-0.02em] sm:text-4xl">
              {t("career.cta.title")}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              {t("career.cta.desc")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="mailto:info@shanghaiglobalauto.com" className="bg-brand-red hover:bg-white hover:text-ink">
              {t("career.cta.email")}
            </Button>
            <Button href="/contact" variant="outline" className="border-white text-white hover:bg-white hover:text-ink">
              {t("career.cta.locations")}
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
