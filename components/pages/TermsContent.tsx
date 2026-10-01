"use client";

import { Container } from "@/components/ui/Container";
import { contact } from "@/lib/data/company";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function TermsContent() {
  const { t } = useLanguage();
  return (
    <section className="bg-white py-16 lg:py-24">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="h1-page text-ink">{t("pg.terms.title")}</h1>
          <p className="mt-4 text-sm text-slate-500">{t("pg.updated")}</p>

          <div className="prose prose-slate mt-10 max-w-none">
            <p>{t("pg.terms.intro")}</p>

            <h2>{t("pg.terms.h1")}</h2>
            <p>{t("pg.terms.p1")}</p>

            <h2>{t("pg.terms.h2")}</h2>
            <p>{t("pg.terms.p2")}</p>

            <h2>{t("pg.terms.h3")}</h2>
            <p>
              {t("pg.terms.p3")} {t("pg.brands.disclaimer")}
            </p>

            <h2>{t("pg.terms.h4")}</h2>
            <p>{t("pg.terms.p4")}</p>

            <h2>{t("pg.terms.h5")}</h2>
            <p>{t("pg.terms.p5")}</p>

            <h2>{t("pg.terms.h6")}</h2>
            <p>{t("pg.terms.p6")}</p>

            <h2>{t("pg.terms.h7")}</h2>
            <p>{t("pg.terms.p7")}</p>

            <h2>{t("pg.terms.h8")}</h2>
            <p>{t("pg.terms.p8")}</p>

            <h2>{t("pg.terms.h9")}</h2>
            <p>
              {t("pg.terms.p9")}{" "}
              <a href={`mailto:${contact.emails.primary}`} className="text-brand-red" dir="ltr">
                {contact.emails.primary}
              </a>
              .
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
