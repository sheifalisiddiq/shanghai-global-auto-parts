"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Group } from "three";
import type { MutableRefObject } from "react";

// Blueprint schematic colors
const LINE_COLOR = "#2a3648";
const ACCENT_COLOR = "#cc0000";
const BODY_COLOR = "#f8fafc";
const BODY_OPACITY = 0.12;

// Reusable technical line box with subtle solid backing for 3D occlusion
function BlueprintBox({
  args,
  position,
  rotation,
  accent = false,
}: {
  args: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  accent?: boolean;
}) {
  const { edges, geometry } = useMemo(() => {
    const geo = new THREE.BoxGeometry(...args);
    const edg = new THREE.EdgesGeometry(geo);
    return { edges: edg, geometry: geo };
  }, [args]);

  return (
    <group position={position} rotation={rotation}>
      {/* Semi-transparent solid face to give hidden-line depth */}
      <mesh geometry={geometry}>
        <meshBasicMaterial
          color={BODY_COLOR}
          transparent
          opacity={BODY_OPACITY}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Crisp technical blueprint wireframe */}
      <lineSegments geometry={edges}>
        <lineBasicMaterial
          color={accent ? ACCENT_COLOR : LINE_COLOR}
          linewidth={1}
          transparent
          opacity={accent ? 0.95 : 0.85}
        />
      </lineSegments>
    </group>
  );
}

// Reusable technical line cylinder
function BlueprintCylinder({
  radiusTop,
  radiusBottom,
  height,
  radialSegments = 24,
  position,
  rotation,
  accent = false,
}: {
  radiusTop: number;
  radiusBottom: number;
  height: number;
  radialSegments?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  accent?: boolean;
}) {
  const { edges, geometry } = useMemo(() => {
    const geo = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
    const edg = new THREE.EdgesGeometry(geo, 20);
    return { edges: edg, geometry: geo };
  }, [radiusTop, radiusBottom, height, radialSegments]);

  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geometry}>
        <meshBasicMaterial
          color={BODY_COLOR}
          transparent
          opacity={BODY_OPACITY}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial
          color={accent ? ACCENT_COLOR : LINE_COLOR}
          linewidth={1}
          transparent
          opacity={accent ? 0.95 : 0.85}
        />
      </lineSegments>
    </group>
  );
}

// Reusable technical callout label with leader line anchored to its component
function BlueprintCallout({
  number,
  name,
  offset = [1.2, 0.4, 0.4],
}: {
  number: string;
  name: string;
  offset?: [number, number, number];
}) {
  const lineObj = useMemo(() => {
    const points = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(offset[0] * 0.4, offset[1], 0),
      new THREE.Vector3(...offset),
    ];
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color: "#94a3b8",
      transparent: true,
      opacity: 0.65,
    });
    return new THREE.Line(geo, mat);
  }, [offset]);

  return (
    <group>
      <primitive object={lineObj} />
      <Html position={offset} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className="flex items-center gap-1.5 rounded border border-slate-300/80 bg-white/95 px-1.5 py-0.5 shadow-sm backdrop-blur-xs whitespace-nowrap">
          <span className="font-mono text-[10px] font-bold text-red-600">{number}</span>
          <span className="font-mono text-[9px] font-medium tracking-tight text-slate-700 uppercase">
            {name}
          </span>
        </div>
      </Html>
    </group>
  );
}

export function EngineAssemblyModel({
  reducedMotion,
  explodeProgress,
}: {
  reducedMotion: boolean;
  explodeProgress: MutableRefObject<number>;
}) {
  const rootGroup = useRef<Group>(null);

  // Discrete component groups for exploded motion
  const valveCoverRef = useRef<Group>(null);
  const headGasketRef = useRef<Group>(null);
  const cylinderHeadRef = useRef<Group>(null);
  const engineBlockRef = useRef<Group>(null);
  const camshaftRef = useRef<Group>(null);
  const pistonsRef = useRef<Group>(null);
  const crankshaftRef = useRef<Group>(null);
  const flywheelRef = useRef<Group>(null);
  const timingGroupRef = useRef<Group>(null);
  const oilPanRef = useRef<Group>(null);

  const currentExpVal = useRef(0);

  // Cylinder pitch & positions for 4-cylinder engine
  const cylinderXs = useMemo(() => [-1.05, -0.35, 0.35, 1.05], []);

  // Crankshaft throws
  const crankThrows = useMemo(
    () => [
      { x: -1.05, angle: 0 },
      { x: -0.35, angle: Math.PI },
      { x: 0.35, angle: Math.PI },
      { x: 1.05, angle: 0 },
    ],
    [],
  );

  // Flywheel starter teeth ring
  const flywheelTeeth = useMemo(() => {
    const teethCount = 36;
    return Array.from({ length: teethCount }).map((_, i) => {
      const a = (i / teethCount) * Math.PI * 2;
      return {
        key: i,
        pos: [Math.cos(a) * 1.18, Math.sin(a) * 1.18, 0] as [number, number, number],
        rot: [0, 0, a] as [number, number, number],
      };
    });
  }, []);

  useFrame((state, delta) => {
    const root = rootGroup.current;
    if (root && !reducedMotion) {
      // Subtle isometric idle tilt and pointer responsiveness
      const targetRotY = state.pointer.x * 0.45 - 0.45; // slightly angled isometric view
      const targetRotX = -state.pointer.y * 0.25 + 0.3; // top-down engineering angle
      root.rotation.y += (targetRotY - root.rotation.y) * 0.05;
      root.rotation.x += (targetRotX - root.rotation.x) * 0.05;
    }

    // Determine explosion factor:
    // If user is scrolling through hero, scrollProgress can override;
    // Otherwise, a smooth mechanical expand-and-reassemble harmonic cycle runs.
    const scrollP = explodeProgress.current;
    let targetP = 0;

    if (scrollP > 0.03) {
      targetP = Math.min(1, scrollP * 1.8);
    } else if (reducedMotion) {
      targetP = 0;
    } else {
      // Smooth oscillating cycle: ~7s loop
      // Eases out at assembled (t=0) and at exploded (t=1)
      const time = state.clock.getElapsedTime();
      const wave = Math.sin(time * 0.95);
      // Remap [-1, 1] with plateau at 0 (assembled) and 1 (exploded)
      const normalized = (wave + 1) / 2;
      // Smoothstep curve for crisp mechanical pauses at both ends
      targetP = normalized * normalized * (3 - 2 * normalized);
    }

    // Smooth dampening
    currentExpVal.current += (targetP - currentExpVal.current) * (delta * 5);
    const t = currentExpVal.current;

    // --- APPLY EXPLODED PROJECTIONS (Along exact schematic disassembly axes) ---

    // 1. Valve Cover & Oil Filler Cap (#8, #21) -> Expands HIGH UP (+Y)
    if (valveCoverRef.current) {
      valveCoverRef.current.position.y = 1.05 + t * 1.5;
    }

    // 2. Head Gasket (#11) -> Expands UP (+Y)
    if (headGasketRef.current) {
      headGasketRef.current.position.y = 0.85 + t * 0.95;
    }

    // 3. Cylinder Head (#16) -> Expands UP (+Y)
    if (cylinderHeadRef.current) {
      cylinderHeadRef.current.position.y = 0.55 + t * 0.65;
    }

    // 4. Camshaft & Timing Sprockets (#60, #65) -> Slides UP & OUT (+Y, +Z)
    if (camshaftRef.current) {
      camshaftRef.current.position.y = 0.55 + t * 0.9;
      camshaftRef.current.position.z = -0.15 - t * 0.6;
    }

    // 5. Engine Block (#15) -> Center base reference
    if (engineBlockRef.current) {
      engineBlockRef.current.position.y = 0.05 + t * 0.05;
    }

    // 6. Pistons & Connecting Rods (#120, #123) -> Emerge upward and stagger
    if (pistonsRef.current) {
      pistonsRef.current.position.y = 0.05 + t * 0.7;
    }

    // 7. Crankshaft (#85) -> Lowers downward (-Y)
    if (crankshaftRef.current) {
      crankshaftRef.current.position.y = -0.55 - t * 0.8;
    }

    // 8. Flywheel (#91) -> Pushes rearward (+X in local engine space)
    if (flywheelRef.current) {
      flywheelRef.current.position.y = -0.55 - t * 0.8;
      flywheelRef.current.position.x = 1.6 + t * 0.85;
    }

    // 9. Timing Chain / Cover (#48, #67) -> Pushes forward (-X)
    if (timingGroupRef.current) {
      timingGroupRef.current.position.x = -1.6 - t * 0.95;
      timingGroupRef.current.position.y = -0.1 - t * 0.3;
    }

    // 10. Oil Pan / Sump (#102, #109) -> Drops down to bottom (-Y)
    if (oilPanRef.current) {
      oilPanRef.current.position.y = -0.85 - t * 1.55;
    }
  });

  return (
    <group ref={rootGroup} position={[0, 0.1, 0]} scale={1.05}>
      {/* ============================================================ */}
      {/* 1. VALVE COVER / ROCKER COVER (#8)                           */}
      {/* ============================================================ */}
      <group ref={valveCoverRef} position={[0, 1.05, 0]}>
        {/* Main cover box */}
        <BlueprintBox args={[2.7, 0.28, 1.2]} position={[0, 0, 0]} />
        {/* Top ridges */}
        <BlueprintBox args={[2.5, 0.06, 0.9]} position={[0, 0.16, 0]} />
        {/* Oil Filler Neck (#21, #5) */}
        <BlueprintCylinder
          radiusTop={0.16}
          radiusBottom={0.18}
          height={0.22}
          position={[-0.8, 0.26, 0.2]}
        />
        <BlueprintCylinder
          radiusTop={0.22}
          radiusBottom={0.22}
          height={0.08}
          position={[-0.8, 0.38, 0.2]}
          accent
        />
        {/* Breather elbow (#150) */}
        <BlueprintCylinder
          radiusTop={0.07}
          radiusBottom={0.07}
          height={0.25}
          position={[0.75, 0.24, -0.25]}
        />
        <BlueprintCallout number="08" name="Valve Cover" offset={[-1.2, 0.4, 0.8]} />
      </group>

      {/* ============================================================ */}
      {/* 2. HEAD GASKET (#11)                                         */}
      {/* ============================================================ */}
      <group ref={headGasketRef} position={[0, 0.85, 0]}>
        <BlueprintBox args={[2.75, 0.04, 1.25]} position={[0, 0, 0]} accent />
        {cylinderXs.map((cx, i) => (
          <BlueprintCylinder
            key={`hg-bore-${i}`}
            radiusTop={0.26}
            radiusBottom={0.26}
            height={0.05}
            position={[cx, 0, 0]}
          />
        ))}
      </group>

      {/* ============================================================ */}
      {/* 3. CYLINDER HEAD (#16)                                       */}
      {/* ============================================================ */}
      <group ref={cylinderHeadRef} position={[0, 0.55, 0]}>
        <BlueprintBox args={[2.7, 0.38, 1.2]} position={[0, 0, 0]} />
        {/* Spark plug wells */}
        {cylinderXs.map((cx, i) => (
          <BlueprintCylinder
            key={`plug-${i}`}
            radiusTop={0.1}
            radiusBottom={0.1}
            height={0.42}
            position={[cx, 0.1, 0.15]}
          />
        ))}
        {/* Exhaust ports on front side */}
        {cylinderXs.map((cx, i) => (
          <BlueprintCylinder
            key={`exh-${i}`}
            radiusTop={0.12}
            radiusBottom={0.12}
            height={0.22}
            rotation={[Math.PI / 2, 0, 0]}
            position={[cx, -0.05, 0.65]}
          />
        ))}
        {/* Intake flange on rear side */}
        <BlueprintBox args={[2.4, 0.16, 0.18]} position={[0, 0.05, -0.66]} />
        <BlueprintCallout number="16" name="Cyl Head" offset={[-1.3, 0.35, 0.7]} />
      </group>

      {/* ============================================================ */}
      {/* 4. CAMSHAFT (#60, #65)                                       */}
      {/* ============================================================ */}
      <group ref={camshaftRef} position={[0, 0.55, -0.15]}>
        {/* Camshaft main shaft */}
        <BlueprintCylinder
          radiusTop={0.07}
          radiusBottom={0.07}
          height={2.7}
          rotation={[0, 0, Math.PI / 2]}
          position={[0, 0, 0]}
        />
        {/* Cam Lobes (eccentric cylinders) */}
        {cylinderXs.map((cx, i) => (
          <group key={`cam-lobe-pair-${i}`} position={[cx, 0, 0]}>
            <BlueprintCylinder
              radiusTop={0.12}
              radiusBottom={0.12}
              height={0.1}
              rotation={[0, 0, Math.PI / 2]}
              position={[-0.08, 0.04 * (i % 2 === 0 ? 1 : -1), 0]}
            />
            <BlueprintCylinder
              radiusTop={0.12}
              radiusBottom={0.12}
              height={0.1}
              rotation={[0, 0, Math.PI / 2]}
              position={[0.08, -0.04 * (i % 2 === 0 ? 1 : -1), 0]}
            />
          </group>
        ))}
        {/* Front Cam Sprocket Gear */}
        <BlueprintCylinder
          radiusTop={0.42}
          radiusBottom={0.42}
          height={0.08}
          rotation={[0, 0, Math.PI / 2]}
          position={[-1.38, 0, 0]}
          radialSegments={28}
          accent
        />
        <BlueprintCallout number="60" name="Camshaft" offset={[0, 0.4, -0.6]} />
      </group>

      {/* ============================================================ */}
      {/* 5. ENGINE BLOCK (#15)                                        */}
      {/* ============================================================ */}
      <group ref={engineBlockRef} position={[0, 0.05, 0]}>
        {/* Main cast iron / aluminum block body */}
        <BlueprintBox args={[2.68, 0.75, 1.2]} position={[0, 0, 0]} />
        {/* 4 Cylinder Bores visible from top */}
        {cylinderXs.map((cx, i) => (
          <BlueprintCylinder
            key={`bore-${i}`}
            radiusTop={0.28}
            radiusBottom={0.28}
            height={0.78}
            position={[cx, 0, 0]}
          />
        ))}
        {/* Side mounting brackets / ribs */}
        <BlueprintBox args={[0.2, 0.35, 0.3]} position={[-0.7, -0.15, 0.65]} />
        <BlueprintBox args={[0.2, 0.35, 0.3]} position={[0.7, -0.15, 0.65]} />
        {/* Starter motor pocket */}
        <BlueprintCylinder
          radiusTop={0.22}
          radiusBottom={0.22}
          height={0.48}
          rotation={[0, 0, Math.PI / 2]}
          position={[0.8, -0.2, -0.65]}
        />
        <BlueprintCallout number="15" name="Engine Block" offset={[1.4, 0.15, 0.7]} />
      </group>

      {/* ============================================================ */}
      {/* 6. PISTONS & CONNECTING RODS (#120, #123)                     */}
      {/* ============================================================ */}
      <group ref={pistonsRef} position={[0, 0.05, 0]}>
        {cylinderXs.map((cx, i) => {
          const strokeY = i === 0 || i === 3 ? 0.15 : -0.15;
          return (
            <group key={`piston-assembly-${i}`} position={[cx, strokeY, 0]}>
              {/* Piston crown & skirt (#120) */}
              <BlueprintCylinder
                radiusTop={0.26}
                radiusBottom={0.26}
                height={0.32}
                position={[0, 0.28, 0]}
              />
              {/* Piston compression rings (#117, #118) */}
              <BlueprintCylinder
                radiusTop={0.27}
                radiusBottom={0.27}
                height={0.02}
                position={[0, 0.38, 0]}
                accent
              />
              <BlueprintCylinder
                radiusTop={0.27}
                radiusBottom={0.27}
                height={0.02}
                position={[0, 0.34, 0]}
              />
              {/* Wrist / Gudgeon Pin (#121) */}
              <BlueprintCylinder
                radiusTop={0.06}
                radiusBottom={0.06}
                height={0.32}
                rotation={[Math.PI / 2, 0, 0]}
                position={[0, 0.25, 0]}
              />
              {/* Connecting Rod beam (#123) */}
              <BlueprintBox args={[0.07, 0.44, 0.09]} position={[0, -0.05, 0]} />
              {/* Rod big-end journal / cap (#166) */}
              <BlueprintCylinder
                radiusTop={0.14}
                radiusBottom={0.14}
                height={0.12}
                rotation={[0, 0, Math.PI / 2]}
                position={[0, -0.28, 0]}
              />
            </group>
          );
        })}
        <BlueprintCallout number="120" name="Piston & Rod" offset={[-1.2, 0.45, 0.4]} />
      </group>

      {/* ============================================================ */}
      {/* 7. CRANKSHAFT (#85)                                          */}
      {/* ============================================================ */}
      <group ref={crankshaftRef} position={[0, -0.55, 0]}>
        {/* Main crankshaft center spine */}
        <BlueprintCylinder
          radiusTop={0.09}
          radiusBottom={0.09}
          height={2.75}
          rotation={[0, 0, Math.PI / 2]}
          position={[0, 0, 0]}
        />
        {/* Counterweights & crank pins */}
        {crankThrows.map((ct, i) => (
          <group key={`crank-throw-${i}`} position={[ct.x, 0, 0]}>
            {/* Counterweight paddle web */}
            <BlueprintBox
              args={[0.1, 0.38, 0.24]}
              position={[
                0,
                Math.sin(ct.angle) * 0.12,
                Math.cos(ct.angle) * 0.12,
              ]}
            />
            {/* Rod journal pin */}
            <BlueprintCylinder
              radiusTop={0.08}
              radiusBottom={0.08}
              height={0.15}
              rotation={[0, 0, Math.PI / 2]}
              position={[
                0,
                -Math.sin(ct.angle) * 0.16,
                -Math.cos(ct.angle) * 0.16,
              ]}
              accent
            />
          </group>
        ))}
        {/* Front Crankshaft Timing Gear (#95) */}
        <BlueprintCylinder
          radiusTop={0.24}
          radiusBottom={0.24}
          height={0.12}
          rotation={[0, 0, Math.PI / 2]}
          position={[-1.4, 0, 0]}
          radialSegments={20}
        />
        {/* Crank Pulley (#72) */}
        <BlueprintCylinder
          radiusTop={0.38}
          radiusBottom={0.38}
          height={0.08}
          rotation={[0, 0, Math.PI / 2]}
          position={[-1.5, 0, 0]}
        />
        <BlueprintCallout number="85" name="Crankshaft" offset={[-1.2, -0.35, 0.6]} />
      </group>

      {/* ============================================================ */}
      {/* 8. FLYWHEEL WITH STARTER GEAR (#91, #92)                     */}
      {/* ============================================================ */}
      <group ref={flywheelRef} position={[1.6, -0.55, 0]}>
        {/* Flywheel main disc */}
        <BlueprintCylinder
          radiusTop={1.12}
          radiusBottom={1.12}
          height={0.14}
          rotation={[0, 0, Math.PI / 2]}
          position={[0, 0, 0]}
          radialSegments={36}
        />
        {/* Recessed clutch friction plate face */}
        <BlueprintCylinder
          radiusTop={0.75}
          radiusBottom={0.75}
          height={0.16}
          rotation={[0, 0, Math.PI / 2]}
          position={[0.02, 0, 0]}
          radialSegments={32}
        />
        {/* Starter ring gear teeth around circumference (#60) */}
        <group position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          {flywheelTeeth.map((tooth) => (
            <BlueprintBox
              key={tooth.key}
              args={[0.06, 0.08, 0.12]}
              position={tooth.pos}
              rotation={tooth.rot}
            />
          ))}
        </group>
        <BlueprintCallout number="91" name="Flywheel" offset={[0.8, -0.25, 0.5]} />
      </group>

      {/* ============================================================ */}
      {/* 9. TIMING COVER & SPROCKETS (#47, #48, #67)                  */}
      {/* ============================================================ */}
      <group ref={timingGroupRef} position={[-1.6, -0.1, 0]}>
        {/* Timing belt cover casing shape */}
        <BlueprintBox args={[0.16, 1.25, 0.85]} position={[0, 0.15, 0]} />
        {/* Front water pump housing */}
        <BlueprintCylinder
          radiusTop={0.22}
          radiusBottom={0.24}
          height={0.32}
          rotation={[0, 0, Math.PI / 2]}
          position={[-0.15, 0.1, 0.15]}
        />
        <BlueprintCallout number="48" name="Timing Assembly" offset={[-0.8, 0.4, 0.4]} />
      </group>

      {/* ============================================================ */}
      {/* 10. OIL PAN / SUMP (#102, #109)                              */}
      {/* ============================================================ */}
      <group ref={oilPanRef} position={[0, -0.85, 0]}>
        {/* Top sealing flange with bolt lip */}
        <BlueprintBox args={[2.72, 0.05, 1.24]} position={[0, 0.02, 0]} accent />
        {/* Upper shallow pan slope */}
        <BlueprintBox args={[2.58, 0.25, 1.1]} position={[0, -0.12, 0]} />
        {/* Deep oil reservoir sump well (rear biased) */}
        <BlueprintBox args={[1.3, 0.35, 0.95]} position={[0.5, -0.38, 0]} />
        {/* Drain plug bolt (#109) */}
        <BlueprintCylinder
          radiusTop={0.08}
          radiusBottom={0.08}
          height={0.12}
          position={[0.95, -0.5, 0]}
        />
        {/* Oil pickup tube & strainer mesh (#112) */}
        <BlueprintCylinder
          radiusTop={0.06}
          radiusBottom={0.06}
          height={0.4}
          position={[0.45, -0.2, 0]}
        />
        <BlueprintCylinder
          radiusTop={0.18}
          radiusBottom={0.22}
          height={0.12}
          position={[0.45, -0.42, 0]}
          accent
        />
        <BlueprintCallout number="102" name="Oil Pan" offset={[1.2, -0.5, 0.6]} />
      </group>
    </group>
  );
}
