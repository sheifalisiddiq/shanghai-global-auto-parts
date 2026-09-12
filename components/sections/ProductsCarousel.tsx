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

const tabItems = [{ id: "all", label: "All" }, ...categories.map((c) => ({ id: c.id, label: c.label }))];

export function ProductsCarousel() {
  const [activeId, setActiveId] = useState("all");
  const filtered =
    activeId === "all" ? featuredProducts : featuredProducts.filter((p) => p.category === activeId);

  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: false }, [
    Autoplay({ delay: 3800, stopOnInteraction: true }),
  ]);
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
    emblaApi?.reInit();
  }, [emblaApi, filtered.length]);

  return (
    <section className="bg-white py-16 lg:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Catalog" title="Featured Parts" />
          <Button href="/products" variant="ghost" className="px-0">
            View full catalog
          </Button>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <Tabs items={tabItems} activeId={activeId} onChange={setActiveId} />
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous products"
              disabled={!canPrev}
              onClick={() => emblaApi?.scrollPrev()}
              className="border-steel-light hover:border-ink disabled:opacity-30 flex size-10 items-center justify-center border transition-colors"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Next products"
              disabled={!canNext}
              onClick={() => emblaApi?.scrollNext()}
              className="border-steel-light hover:border-ink disabled:opacity-30 flex size-10 items-center justify-center border transition-colors"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-hidden" ref={emblaRef}>
          <div className="-ml-4 flex">
            {filtered.map((product) => (
              <div key={product.id} className="min-w-0 shrink-0 grow-0 basis-[80%] pl-4 sm:basis-[45%] lg:basis-[27%]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
