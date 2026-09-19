"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/products/ProductCard";
import { categories } from "@/lib/data/categories";
import { featuredProducts } from "@/lib/data/products";
import { getPrimaryPartUrl } from "@/lib/data/catalog";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function ProductsCarousel() {
  const { t, isRTL } = useLanguage();
  const [activeId, setActiveId] = useState("all");
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

  return (
    <section className="bg-white py-16 lg:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={t("catalog.eyebrow", "Catalog")} title={t("catalog.title", "Featured Parts")} />
          <div className="flex items-center gap-4 sm:gap-6">
            <Button href="/products" variant="ghost" className="px-0">
              {t("catalog.viewAll", "View full catalog")}
            </Button>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous products"
                disabled={!canPrev}
                onClick={() => emblaApi?.scrollPrev()}
                className="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:bg-white disabled:hover:text-slate-700 cursor-pointer"
              >
                <ChevronLeft className="size-4 rtl:rotate-180" />
              </button>
              <button
                type="button"
                aria-label="Next products"
                disabled={!canNext}
                onClick={() => emblaApi?.scrollNext()}
                className="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:bg-white disabled:hover:text-slate-700 cursor-pointer"
              >
                <ChevronRight className="size-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Tabs items={tabItems} activeId={activeId} onChange={setActiveId} />
        </div>

        <div className="mt-6 overflow-hidden px-1 -mx-1 py-4 -my-4" ref={emblaRef} dir={isRTL ? "rtl" : "ltr"}>
          <div className="flex -mx-2 sm:-mx-3">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="min-w-0 shrink-0 grow-0 basis-[75%] px-2 sm:basis-[45%] md:basis-[32%] lg:basis-1/4 sm:px-3"
              >
                <ProductCard product={product} href={getPrimaryPartUrl(product)} />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
