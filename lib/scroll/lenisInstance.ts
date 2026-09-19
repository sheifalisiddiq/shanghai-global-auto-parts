import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}

/**
 * Smooth-scroll to a y offset or element. Routes through Lenis when active so the
 * native smooth scroll never fights Lenis' own animation (which makes scroll stall).
 */
export function scrollToTarget(target: number | HTMLElement | null | undefined, offset = 0) {
  if (target === null || target === undefined) return;
  if (instance) {
    instance.scrollTo(target, { offset });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target + offset, behavior: "smooth" });
  } else {
    const top = target.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: "smooth" });
  }
}
