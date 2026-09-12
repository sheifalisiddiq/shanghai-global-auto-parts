"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils/cn";
import { gsap } from "@/lib/gsap/registerGSAP";

export interface TabItem {
  id: string;
  label: string;
}

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
  const containerRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    const container = containerRef.current;
    const pill = pillRef.current;
    const btn = buttonRefs.current.get(activeId);
    if (!container || !pill || !btn) return;

    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    gsap.to(pill, {
      x: btnRect.left - containerRect.left,
      width: btnRect.width,
      duration: 0.45,
      ease: "power3.out",
    });
  }, [activeId, items]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "border-steel-light relative flex flex-wrap gap-1 overflow-x-auto border-b pb-0",
        className,
      )}
    >
      <span
        ref={pillRef}
        className="bg-brand-red absolute bottom-0 h-[3px]"
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
            "font-ui shrink-0 px-4 py-3 text-xs tracking-wide uppercase transition-colors duration-200",
            activeId === item.id ? "text-ink" : "text-steel-dark hover:text-ink",
          )}
          aria-pressed={activeId === item.id}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
