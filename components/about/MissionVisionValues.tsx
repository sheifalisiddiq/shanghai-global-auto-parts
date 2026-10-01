"use client";

import { Target, Eye, Gem, ShieldCheck, Handshake, Search, Headset } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function MissionVisionValues() {
  const { t } = useLanguage();

  const values = [
    { icon: Gem, label: t("about.values.v1", "Quality first") },
    { icon: ShieldCheck, label: t("about.values.v2", "Reliability") },
    { icon: Search, label: t("about.values.v3", "Transparency") },
    { icon: Headset, label: t("about.values.v4", "Customer service") },
  ];

  const cards = [
    {
      n: "01",
      icon: Target,
      title: t("about.mission.title", "Mission"),
      copy: t(
        "about.mission.copy",
        "Supply original, OEM and reliable auto parts that meet strict quality standards, with simple ordering and dependable support.",
      ),
    },
    {
      n: "02",
      icon: Eye,
      title: t("about.vision.title", "Vision"),
      copy: t(
        "about.vision.copy",
        "Be the most trusted source of Chinese automotive parts for workshops and distributors worldwide.",
      ),
    },
  ];

  return (
    <section className="relative overflow-hidden bg-paper py-20 lg:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(0,0,0,0.07)_1px,transparent_1px)] [background-size:26px_26px] [mask-image:radial-gradient(60%_60%_at_50%_30%,#000,transparent)]"
      />
      <Container className="relative">
        <Reveal variant="mask" y={50}>
          <SectionHeading
            eyebrow={t("about.mvv.eyebrow", "Our Foundation")}
            title={t("about.mvv.title", "Mission, Vision & Values")}
          />
        </Reveal>

        <RevealGroup
          className="mt-12 grid gap-5 lg:grid-cols-3"
          itemSelector=":scope > div"
          variant="scale"
          stagger={0.15}
        >
          {cards.map(({ n, icon: Icon, title, copy }) => (
            <div
              key={n}
              className="group relative flex min-h-[320px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow duration-500 hover:shadow-2xl"
            >
              {/* Dark fill that rises on hover */}
              <span
                aria-hidden
                className="bg-ink absolute inset-0 translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0"
              />
              {/* Ghost numeral */}
              <span
                aria-hidden
                dir="ltr"
                className="font-display absolute -bottom-6 end-4 text-[9rem] leading-none font-black text-transparent transition-all duration-500 [-webkit-text-stroke:1.5px_rgba(0,0,0,0.10)] group-hover:-translate-y-2 group-hover:[-webkit-text-stroke:1.5px_rgba(255,255,255,0.18)]"
              >
                {n}
              </span>

              <span className="bg-brand-red relative flex size-14 items-center justify-center rounded-xl text-white shadow-lg shadow-red-500/30 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                <Icon className="size-6" />
              </span>
              <h3 className="font-display text-ink relative mt-8 text-3xl font-black uppercase tracking-[-0.005em] transition-colors duration-500 group-hover:text-white sm:tracking-[-0.02em]">
                {title}
              </h3>
              <span
                aria-hidden
                className="bg-brand-red relative mt-4 h-0.5 w-10 transition-all duration-500 group-hover:w-24"
              />
              <p className="text-slate-600 relative mt-5 max-w-sm text-base leading-relaxed transition-colors duration-500 group-hover:text-white/80">
                {copy}
              </p>
            </div>
          ))}

          {/* Values */}
          <div className="bg-ink relative flex min-h-[320px] flex-col overflow-hidden rounded-2xl border border-white/10 p-8 shadow-sm">
            <span className="relative flex size-14 items-center justify-center rounded-xl border border-white/20 text-white">
              <Handshake className="size-6" />
            </span>
            <h3 className="font-display relative mt-8 text-3xl font-black text-white uppercase tracking-[-0.005em] sm:tracking-[-0.02em]">
              {t("about.values.title", "Values")}
            </h3>
            <ul className="relative mt-6 space-y-2.5">
              {values.map(({ icon: Icon, label }, i) => (
                <li
                  key={label}
                  className="group/v flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-base font-semibold text-white transition-all duration-300 hover:border-brand-red hover:bg-brand-red/15 hover:ps-5"
                >
                  <Icon className="text-brand-red size-4 shrink-0" />
                  <span className="flex-1">{label}</span>
                  <span dir="ltr" className="font-ui text-[10px] tracking-widest text-white/35">
                    0{i + 1}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </RevealGroup>
      </Container>
    </section>
  );
}
