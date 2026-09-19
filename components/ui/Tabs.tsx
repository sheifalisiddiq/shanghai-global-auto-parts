"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { gsap } from "@/lib/gsap/registerGSAP";

export interface TabItem {
  id: string;
  label: string;
}

const FADE = 32;

export function Tabs({
  items,
  activeId,
  onChange,
  className,
}: {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const mounted = useRef(false);
  const [fade, setFade] = useState({ left: false, right: false });

  const updateFade = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const rtl = getComputedStyle(el).direction === "rtl";
    const left = rtl ? el.scrollLeft > -max + 1 : el.scrollLeft > 1;
    const right = rtl ? el.scrollLeft < -1 : el.scrollLeft < max - 1;
    setFade((prev) => (prev.left === left && prev.right === right ? prev : { left, right }));
  }, []);

  const positionPill = useCallback(
    (animate: boolean) => {
      const scroller = scrollRef.current;
      const pill = pillRef.current;
      const btn = buttonRefs.current.get(activeId);
      if (!scroller || !pill || !btn) return;

      const vars = { x: btn.offsetLeft, width: btn.offsetWidth };
      if (animate) gsap.to(pill, { ...vars, duration: 0.45, ease: "power3.out" });
      else gsap.set(pill, vars);
    },
    [activeId],
  );

  useEffect(() => {
    const scroller = scrollRef.current;
    const btn = buttonRefs.current.get(activeId);
    const animate = mounted.current;
    mounted.current = true;
    positionPill(animate);

    // Keep the active tab in view without scrolling the page itself.
    if (scroller && btn) {
      const s = scroller.getBoundingClientRect();
      const b = btn.getBoundingClientRect();
      const delta = b.left + b.width / 2 - (s.left + s.width / 2);
      if (Math.abs(delta) > 1) scroller.scrollBy({ left: delta, behavior: animate ? "smooth" : "auto" });
    }
    updateFade();
  }, [activeId, items, positionPill, updateFade]);

  useEffect(() => {
    const onResize = () => {
      positionPill(false);
      updateFade();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [positionPill, updateFade]);

  const mask =
    fade.left || fade.right
      ? `linear-gradient(to right, ${fade.left ? "transparent" : "#000"} 0, #000 ${FADE}px, #000 calc(100% - ${FADE}px), ${fade.right ? "transparent" : "#000"} 100%)`
      : undefined;

  return (
    <div className={cn("border-steel-light min-w-0 border-b", className)}>
      <div
        ref={scrollRef}
        onScroll={updateFade}
        style={{ maskImage: mask, WebkitMaskImage: mask }}
        className="relative flex flex-nowrap gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <span
          ref={pillRef}
          className="bg-brand-red absolute bottom-0 left-0 h-[3px] rounded-full"
          aria-hidden
          style={{ width: 0 }}
        />
        {items.map((item) => (
          <button
            key={item.id}
            ref={(el) => {
              if (el) buttonRefs.current.set(item.id, el);
            }}
            type="button"
            onClick={() => onChange(item.id)}
            className={cn(
              "font-ui shrink-0 cursor-pointer px-3 py-3 text-xs tracking-wide whitespace-nowrap uppercase transition-colors duration-200",
              activeId === item.id ? "text-ink" : "text-steel-dark hover:text-ink",
            )}
            aria-pressed={activeId === item.id}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
