"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { LogoMark } from "@/components/brand/Logo";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function NotFoundContent() {
  const { t } = useLanguage();
  return (
    <section className="flex min-h-[70vh] items-center bg-white">
      <Container className="text-center">
        <LogoMark className="mx-auto h-14 w-14" />
        <p className="font-display text-ink mt-8 text-8xl font-black tracking-[-0.01em] sm:tracking-[-0.03em]">404</p>
        <h1 className="font-ui text-ink mt-4 text-lg tracking-wide uppercase">
          {t("pg.nf.title")}
        </h1>
        <p className="text-steel-dark mx-auto mt-4 max-w-sm text-sm">{t("pg.nf.text")}</p>
        <Button href="/" className="mt-8 inline-flex">
          {t("pg.nf.home")}
        </Button>
      </Container>
    </section>
  );
}
