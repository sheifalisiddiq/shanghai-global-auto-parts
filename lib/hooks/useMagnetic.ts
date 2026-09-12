import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap/registerGSAP";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

const STRENGTH = 0.35;

export function useMagnetic<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const setX = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const setY = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

    function onMouseMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      const offsetX = e.clientX - (rect.left + rect.width / 2);
      const offsetY = e.clientY - (rect.top + rect.height / 2);
      setX(offsetX * STRENGTH);
      setY(offsetY * STRENGTH);
    }

    function onMouseLeave() {
      setX(0);
      setY(0);
    }

    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);

    return () => {
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [reducedMotion]);

  return ref;
}
