"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { PartModel } from "./PartModel";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

export default function HeroCanvas() {
  const reducedMotion = useReducedMotion();

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 4.6], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-3, -2, -2]} intensity={0.7} color="#EF0606" />
      <Suspense fallback={null}>
        <PartModel reducedMotion={reducedMotion} />
        <Environment preset="warehouse" />
      </Suspense>
    </Canvas>
  );
}
