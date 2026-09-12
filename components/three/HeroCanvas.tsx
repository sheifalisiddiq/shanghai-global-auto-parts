"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { PartModel } from "./PartModel";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

export default function HeroCanvas({ active = true }: { active?: boolean }) {
  const reducedMotion = useReducedMotion();

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 4.6], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      frameloop={active ? "always" : "never"}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} color="#ffffff" />
      <directionalLight position={[-4, -2, 3]} intensity={0.5} color="#ffffff" />
      <pointLight position={[-3, -2, -2]} intensity={0.8} color="#EF0606" />
      <Suspense fallback={null}>
        <PartModel reducedMotion={reducedMotion} />
      </Suspense>
    </Canvas>
  );
}
