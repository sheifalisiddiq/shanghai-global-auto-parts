"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import type { MutableRefObject } from "react";
import { Play, Pause } from "lucide-react";

interface ExplodedEngineViewerProps {
  explodeProgress?: MutableRefObject<number>;
}

export function ExplodedEngineViewer({ explodeProgress }: ExplodedEngineViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0.85); // 0 = assembled, 1 = exploded
  const [isAutoCycle, setIsAutoCycle] = useState(true);
  const [tilt, setTilt] = useState({ x: 12, y: -14 });
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  const animRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  const manualScrub = useRef(false);

  // Smooth animation loop for auto-breathing expand & assemble cycle
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      // If user is scrolling, allow scroll to drive progress
      if (explodeProgress && explodeProgress.current > 0.05) {
        setProgress(Math.min(1, explodeProgress.current * 1.6));
      } else if (isAutoCycle && !manualScrub.current) {
        timeRef.current += delta * 0.75; // ~8.4s full cycle
        // Sinusoidal wave between 0 (assembled) and 1 (exploded)
        const wave = Math.sin(timeRef.current);
        const norm = (wave + 1) / 2;
        // Smoothstep curve for mechanical hold at peak assembled and peak exploded
        const eased = norm * norm * (3 - 2 * norm);
        setProgress(eased);
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isAutoCycle, explodeProgress]);

  // Mouse move parallax tilt
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: 12 - ny * 16,
      y: -14 + nx * 24,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 12, y: -14 });
    setHoveredPart(null);
  }, []);

  const toggleAutoCycle = () => {
    setIsAutoCycle((prev) => !prev);
    manualScrub.current = false;
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    manualScrub.current = true;
    setIsAutoCycle(false);
    setProgress(parseFloat(e.target.value));
  };

  const toggleAssembleExplode = () => {
    setIsAutoCycle(false);
    manualScrub.current = false;
    setProgress((p) => (p > 0.5 ? 0 : 1));
  };

  // Interpolation helper: moves from assembled (offset0) to exploded (0px)
  // When t = 1 (exploded), offset is 0.
  // When t = 0 (assembled), offset is fully applied to lock into position.
  const t = progress;
  const assembleFactor = 1 - t;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex h-full w-full select-none flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-b from-slate-50/90 to-white shadow-xl shadow-slate-200/50 backdrop-blur-xs"
    >
      {/* Blueprint Grid Background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(#94a3b8 1px, transparent 1px), linear-gradient(to right, #f1f5f9 1px, transparent 1px), linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)",
          backgroundSize: "24px 24px, 12px 12px, 12px 12px",
        }}
      />

      {/* Top Engineering Control Bar */}
      <div className="absolute top-3 right-3 left-3 z-30 flex items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
        {/* Schematic FIG Label */}
        <div className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-red opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-brand-red" />
          </span>
          <span className="font-mono text-[11px] font-bold tracking-wider text-slate-800 uppercase">
            FIG. 01 // EXPLODED ENGINE SCHEMATIC
          </span>
          <span className="hidden rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-slate-500 sm:inline-block">
            {t < 0.15 ? "STRUCTURE: ASSEMBLED" : t > 0.85 ? "STRUCTURE: EXPLODED" : "STRUCTURE: EXPANDING"}
          </span>
        </div>

        {/* Live Interactive Status Badge */}
        <div className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white/90 px-2 py-0.5 shadow-2xs font-mono text-[10px] font-semibold text-slate-600">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          INTERACTIVE 3D
        </div>
      </div>

      {/* Main 3D Engine Display Canvas */}
      <div
        className="relative flex h-[340px] w-[340px] items-center justify-center transition-transform duration-150 ease-out sm:h-[440px] sm:w-[440px] lg:h-[500px] lg:w-[500px]"
        style={{
          perspective: "1200px",
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="relative h-full w-full">
            {/* 1. Engine Block (Center Anchor) */}
            <div
              className="absolute transition-transform duration-300 ease-out"
              style={{
                top: "36%",
                left: "32%",
                width: "36%",
                height: "28%",
                transform: `translate3d(0px, 0px, 0px)`,
                zIndex: 10,
              }}
              onMouseEnter={() => setHoveredPart("Engine Block with 4 Cylinders")}
            >
              <Image
                src="/images/engine_schematic/cad_parts/engine_block.png"
                alt="Engine Block"
                fill
                sizes="500px"
                className="object-contain drop-shadow-md"
                priority
              />
            </div>

            {/* 2. Cylinder Head (Moves down to seal onto block when assembling) */}
            <div
              className="absolute transition-transform duration-300 ease-out"
              style={{
                top: "19.5%",
                left: "33%",
                width: "32%",
                height: "21.5%",
                transform: `translate3d(0px, ${assembleFactor * 78}px, ${t * 15}px)`,
                zIndex: 12,
              }}
              onMouseEnter={() => setHoveredPart("DOHC Cylinder Head & Valve Springs")}
            >
              <Image
                src="/images/engine_schematic/cad_parts/cylinder_head.png"
                alt="Cylinder Head"
                fill
                sizes="500px"
                className="object-contain drop-shadow-md"
                priority
              />
            </div>

            {/* 3. DOHC Camshafts (Moves down into head) */}
            <div
              className="absolute transition-transform duration-300 ease-out"
              style={{
                top: "13%",
                left: "34.5%",
                width: "31.5%",
                height: "14%",
                transform: `translate3d(0px, ${assembleFactor * 115}px, ${t * 25}px)`,
                zIndex: 14,
              }}
              onMouseEnter={() => setHoveredPart("Dual Overhead Camshafts (DOHC)")}
            >
              <Image
                src="/images/engine_schematic/cad_parts/camshafts.png"
                alt="Camshafts"
                fill
                sizes="500px"
                className="object-contain drop-shadow-sm"
                priority
              />
            </div>

            {/* 4. Cast Valve Cover (Top: moves down to enclose engine) */}
            <div
              className="absolute transition-transform duration-300 ease-out"
              style={{
                top: "3%",
                left: "33%",
                width: "34%",
                height: "16%",
                transform: `translate3d(0px, ${assembleFactor * 175}px, ${t * 35}px)`,
                zIndex: 16,
              }}
              onMouseEnter={() => setHoveredPart("Cast Aluminum Valve Cover")}
            >
              <Image
                src="/images/engine_schematic/cad_parts/valve_cover.png"
                alt="Valve Cover"
                fill
                sizes="500px"
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>

            {/* 5. Forged Crankshaft (Moves UP into engine block bed) */}
            <div
              className="absolute transition-transform duration-300 ease-out"
              style={{
                top: "59%",
                left: "36%",
                width: "29%",
                height: "19%",
                transform: `translate3d(0px, ${-assembleFactor * 85}px, ${t * -10}px)`,
                zIndex: 8,
              }}
              onMouseEnter={() => setHoveredPart("Forged Steel Crankshaft & Counterweights")}
            >
              <Image
                src="/images/engine_schematic/cad_parts/crankshaft.png"
                alt="Crankshaft"
                fill
                sizes="500px"
                className="object-contain drop-shadow-md"
                priority
              />
            </div>

            {/* 6. Pistons & Connecting Rods (Move RIGHT & UP into cylinder bores) */}
            <div
              className="absolute transition-transform duration-300 ease-out"
              style={{
                top: "45.5%",
                left: "4%",
                width: "32%",
                height: "29%",
                transform: `translate3d(${assembleFactor * 125}px, ${-assembleFactor * 30}px, ${t * 20}px)`,
                zIndex: 9,
              }}
              onMouseEnter={() => setHoveredPart("Pistons, Wrist Pins & Forged Connecting Rods")}
            >
              <Image
                src="/images/engine_schematic/cad_parts/pistons.png"
                alt="Pistons and Rods"
                fill
                sizes="500px"
                className="object-contain drop-shadow-md"
                priority
              />
            </div>

            {/* 7. Timing Chain Assembly (Moves LEFT into front of engine) */}
            <div
              className="absolute transition-transform duration-300 ease-out"
              style={{
                top: "25%",
                left: "67%",
                width: "26%",
                height: "39%",
                transform: `translate3d(${-assembleFactor * 120}px, 0px, ${t * 15}px)`,
                zIndex: 11,
              }}
              onMouseEnter={() => setHoveredPart("Timing Chain, Guides & Sprockets")}
            >
              <Image
                src="/images/engine_schematic/cad_parts/timing_chain.png"
                alt="Timing Chain Assembly"
                fill
                sizes="500px"
                className="object-contain drop-shadow-md"
                priority
              />
            </div>

            {/* 8. Stamped Steel Oil Sump (Moves UP to seal bottom of engine) */}
            <div
              className="absolute transition-transform duration-300 ease-out"
              style={{
                top: "70.5%",
                left: "35%",
                width: "32%",
                height: "24.5%",
                transform: `translate3d(0px, ${-assembleFactor * 165}px, ${t * -25}px)`,
                zIndex: 7,
              }}
              onMouseEnter={() => setHoveredPart("Stamped Steel Oil Sump & Pickup Tube")}
            >
              <Image
                src="/images/engine_schematic/cad_parts/oil_sump.png"
                alt="Oil Sump"
                fill
                sizes="500px"
                className="object-contain drop-shadow-md"
                priority
              />
            </div>
          </div>
      </div>

      {/* Hovered Part Spec Banner */}
      <div className="pointer-events-none absolute bottom-14 left-4 right-4 z-20 flex justify-center">
        {hoveredPart ? (
          <div className="animate-fade-in flex items-center gap-2 rounded-full border border-brand-red/30 bg-white/95 px-3 py-1 shadow-md backdrop-blur-xs">
            <span className="size-2 rounded-full bg-brand-red animate-ping" />
            <span className="font-mono text-xs font-bold text-slate-800 uppercase tracking-wide">
              {hoveredPart}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
            <span>Hover parts to inspect</span>
            <span>•</span>
            <span>Drag slider below to expand/assemble</span>
          </div>
        )}
      </div>

      {/* Interactive Bottom Control Toolbar */}
      <div className="absolute bottom-3 right-3 left-3 z-30 flex items-center justify-between gap-3 rounded-xl border border-slate-200/90 bg-white/95 px-3 py-2 shadow-sm backdrop-blur-xs">
        {/* Play/Pause Auto-Cycle Button */}
        <button
          type="button"
          onClick={toggleAutoCycle}
          title={isAutoCycle ? "Pause Animation Cycle" : "Play Animation Cycle"}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-xs font-semibold transition-colors ${
            isAutoCycle
              ? "bg-brand-red/10 text-brand-red hover:bg-brand-red/20"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {isAutoCycle ? (
            <>
              <Pause className="size-3.5" />
              <span>PAUSE</span>
            </>
          ) : (
            <>
              <Play className="size-3.5" />
              <span>AUTO</span>
            </>
          )}
        </button>

        {/* Manual Progress Slider */}
        <div className="flex flex-1 items-center gap-2">
          <span className="font-mono text-[9px] font-bold text-slate-400 uppercase">Fixed</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={progress}
            onChange={handleSliderChange}
            aria-label="Explode progress slider"
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-brand-red"
          />
          <span className="font-mono text-[9px] font-bold text-slate-400 uppercase">Exploded</span>
        </div>

        {/* Quick Toggle Action Button */}
        <button
          type="button"
          onClick={toggleAssembleExplode}
          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs font-bold text-slate-800 transition-colors hover:bg-brand-red hover:text-white"
        >
          {t > 0.5 ? "ASSEMBLE" : "EXPLODE"}
        </button>
      </div>
    </div>
  );
}
