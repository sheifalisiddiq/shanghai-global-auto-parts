"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  Disc3,
  Filter,
  Cog,
  Waypoints,
  Zap,
  CarFront,
  Settings2,
  Thermometer,
  type LucideIcon,
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap/registerGSAP";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { categories } from "@/lib/data/categories";
import { categoryKey } from "@/lib/data/catalog";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { cn } from "@/lib/utils/cn";

const iconMap: Record<string, LucideIcon> = {
  Disc3,
  Filter,
  Cog,
  Waypoints,
  Zap,
  CarFront,
  Settings2,
  Thermometer,
};

function CategoryTile({
  category,
  active,
  onSelect,
}: {
  category: (typeof categories)[number];
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const Icon = iconMap[category.icon];
  const { t } = useLanguage();
  return (
    <button
      type="button"
      onClick={() => onSelect(active ? "all" : category.id)}
      aria-pressed={active}
      className={cn(
        "group relative aspect-square shrink-0 overflow-hidden text-start",
        "w-[45vw] sm:w-[22vw] lg:w-[180px]",
        active ? "ring-brand-red ring-2" : "ring-1 ring-transparent",
      )}
    >
      <Image
        src={category.image.src}
        alt={category.image.alt}
        fill
        sizes="(min-width: 640px) 22vw, 45vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="from-ink/90 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
      {Icon && <Icon className="text-brand-red absolute top-3 start-3 size-5" aria-hidden />}
      <span className="font-ui absolute bottom-3 start-3 text-xs tracking-wide text-white uppercase">
        {t(categoryKey(category.id), category.label)}
      </span>
    </button>
  );
}

export function CategoryGrid({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { isRTL } = useLanguage();
  // The scrolling marquee assumes left-to-right flow, so RTL uses the static grid.
  const staticGrid = reducedMotion || isRTL;

  useGSAP(
    () => {
      if (staticGrid || !trackRef.current) return;

      const tween = gsap.to(trackRef.current, {
        xPercent: -50,
        duration: 26,
        ease: "none",
        repeat: -1,
      });

      const node = trackRef.current;
      const pause = () => tween.pause();
      const resume = () => tween.play();
      node.addEventListener("mouseenter", pause);
      node.addEventListener("mouseleave", resume);

      return () => {
        node.removeEventListener("mouseenter", pause);
        node.removeEventListener("mouseleave", resume);
        tween.kill();
      };
    },
    { dependencies: [staticGrid] },
  );

  if (staticGrid) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {categories.map((category) => (
          <CategoryTile
            key={category.id}
            category={category}
            active={activeId === category.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div ref={trackRef} className="flex w-max gap-3">
        {[...categories, ...categories].map((category, i) => (
          <CategoryTile
            key={`${category.id}-${i}`}
            category={category}
            active={activeId === category.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
