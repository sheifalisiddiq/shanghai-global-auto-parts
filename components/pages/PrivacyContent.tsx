"use client";

import { Container } from "@/components/ui/Container";
import { contact } from "@/lib/data/company";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function PrivacyContent() {
  const { t } = useLanguage();
  return (
    <section className="bg-white py-16 lg:py-24">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="h1-page text-ink">{t("pg.privacy.title")}</h1>
          <p className="mt-4 text-sm text-slate-500">{t("pg.updated")}</p>

          <div className="prose prose-slate mt-10 max-w-none">
            <p>{t("pg.privacy.intro")}</p>

            <h2>{t("pg.privacy.h1")}</h2>
            <p>{t("pg.privacy.p1")}</p>
            <ul>
              <li>{t("pg.privacy.l1a")}</li>
              <li>{t("pg.privacy.l1b")}</li>
              <li>{t("pg.privacy.l1c")}</li>
            </ul>

            <h2>{t("pg.privacy.h2")}</h2>
            <p>{t("pg.privacy.p2")}</p>
            <ul>
              <li>{t("pg.privacy.l2a")}</li>
              <li>{t("pg.privacy.l2b")}</li>
              <li>{t("pg.privacy.l2c")}</li>
              <li>{t("pg.privacy.l2d")}</li>
              <li>{t("pg.privacy.l2e")}</li>
            </ul>

            <h2>{t("pg.privacy.h3")}</h2>
            <p>{t("pg.privacy.p3")}</p>

            <h2>{t("pg.privacy.h4")}</h2>
            <p>{t("pg.privacy.p4")}</p>

            <h2>{t("pg.privacy.h5")}</h2>
            <p>{t("pg.privacy.p5")}</p>

            <h2>{t("pg.privacy.h6")}</h2>
            <p>{t("pg.privacy.p6")}</p>

            <h2>{t("pg.privacy.h7")}</h2>
            <p>{t("pg.privacy.p7")}</p>

            <h2>{t("pg.privacy.h8")}</h2>
            <p>
              {t("pg.privacy.p8")}{" "}
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
