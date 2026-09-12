import type { RefObject } from "react";
import { LOGO_MARK_PATH } from "@/lib/brand/logoMark";

export function PreloaderMark({
  pathRef,
  wordRef,
  gaugeRef,
  ticksRef,
}: {
  pathRef: RefObject<SVGPathElement | null>;
  wordRef: RefObject<HTMLSpanElement | null>;
  gaugeRef: RefObject<HTMLSpanElement | null>;
  ticksRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="flex flex-col items-center gap-8">
      <svg viewBox="0 0 100 100" className="h-20 w-20" fill="none" aria-hidden>
        <path ref={pathRef} d={LOGO_MARK_PATH} fill="#EF0606" />
      </svg>

      <span ref={wordRef} className="font-ui text-sm tracking-[0.4em] text-white uppercase opacity-0">
        Shanghai Global
      </span>

      <div className="flex w-56 flex-col gap-2">
        <div ref={ticksRef} className="flex justify-between">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="h-2 w-px bg-white/20" />
          ))}
        </div>
        <div className="h-[3px] w-full overflow-hidden bg-white/15">
          <span ref={gaugeRef} className="bg-brand-red block h-full w-0" />
        </div>
      </div>
    </div>
  );
}
