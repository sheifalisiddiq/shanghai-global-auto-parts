"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGSAP } from "@/lib/gsap/registerGSAP";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ProductCard } from "@/components/products/ProductCard";
import { categories } from "@/lib/data/categories";
import { featuredProducts } from "@/lib/data/products";
import { getPrimaryPartUrl } from "@/lib/data/catalog";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const navButton =
  "flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur transition-all hover:border-brand-red hover:bg-brand-red disabled:opacity-25 disabled:hover:border-white/20 disabled:hover:bg-white/5 cursor-pointer";

export function ProductsCarousel() {
  const { t, isRTL } = useLanguage();
  const [activeId, setActiveId] = useState("all");
  const sectionRef = useRef<HTMLElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const filtered =
    activeId === "all" ? featuredProducts : featuredProducts.filter((p) => p.category === activeId);

  const tabItems = [
    { id: "all", label: t("catalog.all", "All") },
    ...categories.map((c) => ({
      id: c.id,
      label: t(
        `cat.${c.id}` as any,
        t(`cat.${c.id === "body-accessories" ? "body" : c.id}` as any, c.label)
      ),
    })),
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      loop: false,
      direction: isRTL ? "rtl" : "ltr",
    },
    [Autoplay({ delay: 3800, stopOnInteraction: true })]
  );
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- embla's API only exists post-mount; this primes button state before the first select/reInit event fires.
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    emblaApi?.reInit({ direction: isRTL ? "rtl" : "ltr" });
  }, [emblaApi, isRTL, filtered.length]);

  // Oversized outlined word drifts sideways against the scroll, behind the content.
  useGSAP(
    () => {
      registerGSAP();
      if (!wordRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const dir = isRTL ? -1 : 1;
      gsap.fromTo(
        wordRef.current,
        { xPercent: 12 * dir },
        {
          xPercent: -12 * dir,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    },
    { scope: sectionRef, dependencies: [isRTL] },
  );

  // Cards rise in on scroll, and re-stagger whenever the category tab changes.
  useGSAP(
    () => {
      registerGSAP();
      if (!sectionRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", sectionRef.current);
      if (!cards.length) return;
      gsap.fromTo(
        cards,
        { opacity: 0, y: 70, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.09,
          ease: "power3.out",
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: "[data-track]", start: "top 88%", once: true },
        },
      );
    },
    { scope: sectionRef, dependencies: [activeId] },
  );

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-slate-950 py-20 lg:py-28">
      <div
        ref={wordRef}
        aria-hidden
        dir="ltr"
        className="font-display pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 text-[22vw] leading-none font-black whitespace-nowrap text-transparent uppercase select-none [-webkit-text-stroke:1.5px_rgba(255,255,255,0.07)]"
      >
        {isRTL ? "قطع الغيار" : "Parts"}
      </div>

      <Container className="relative">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal variant="mask" y={50}>
            <SectionHeading
              tone="white"
              eyebrow={t("catalog.eyebrow", "Catalog")}
              title={t("catalog.title", "Featured Parts")}
            />
          </Reveal>
          <Reveal delay={0.15} className="flex items-center gap-4 sm:gap-6">
            <Button href="/products" variant="ghost" className="px-0 text-white hover:text-brand-red">
              {t("catalog.viewAll", "View full catalog")}
            </Button>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label={t("misc.carousel.prev")}
                disabled={!canPrev}
                onClick={() => emblaApi?.scrollPrev()}
                className={navButton}
              >
                <ChevronLeft className="size-4 rtl:rotate-180" />
              </button>
              <button
                type="button"
                aria-label={t("misc.carousel.next")}
                disabled={!canNext}
                onClick={() => emblaApi?.scrollNext()}
                className={navButton}
              >
                <ChevronRight className="size-4 rtl:rotate-180" />
              </button>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-10">
          <Tabs tone="dark" items={tabItems} activeId={activeId} onChange={setActiveId} />
        </Reveal>

        <div
          data-track
          className="mt-8 -mx-1 -my-4 overflow-hidden px-1 py-4"
          ref={emblaRef}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className="flex -mx-2 sm:-mx-3">
            {filtered.map((product, i) => (
              <div
                key={product.id}
                data-card
                className="min-w-0 shrink-0 grow-0 basis-[75%] px-2 sm:basis-[45%] md:basis-[32%] lg:basis-1/4 sm:px-3"
              >
                <ProductCard product={product} href={getPrimaryPartUrl(product)} index={i} />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
