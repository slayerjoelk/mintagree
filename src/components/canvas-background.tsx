"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";

function MintParticles({ count = 300 }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
      vel[i * 3] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.001;
    }
    return { positions: pos, velocities: vel };
  }, [count]);

  useEffect(() => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  }, [positions]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;
    const posArray = posAttr.array as Float32Array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      posArray[i3] += velocities[i3] + Math.sin(time * 0.3 + i) * 0.0003;
      posArray[i3 + 1] += velocities[i3 + 1] + Math.cos(time * 0.2 + i) * 0.0003;
      posArray[i3 + 2] += velocities[i3 + 2];

      // wrap around
      if (posArray[i3] > 15) posArray[i3] = -15;
      if (posArray[i3] < -15) posArray[i3] = 15;
      if (posArray[i3 + 1] > 10) posArray[i3 + 1] = -10;
      if (posArray[i3 + 1] < -10) posArray[i3 + 1] = 10;
    }
    posAttr.needsUpdate = true;

    pointsRef.current.rotation.y = time * 0.01;
    pointsRef.current.rotation.x = Math.sin(time * 0.05) * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry />
      <pointsMaterial
        size={0.04}
        color="#2dd4bf"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function FloatingSpheres() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      mesh.position.y += Math.sin(t * 0.5 + i * 2) * 0.002;
      mesh.rotation.x = t * 0.1 + i;
      mesh.rotation.y = t * 0.15 + i * 0.5;
    });
  });

  const spheres = [
    { pos: [4, 2, -3] as [number, number, number], size: 0.8, color: "#2dd4bf", opacity: 0.08 },
    { pos: [-5, -1, -2] as [number, number, number], size: 1.2, color: "#5eead4", opacity: 0.05 },
    { pos: [2, -3, -4] as [number, number, number], size: 0.5, color: "#14b8a6", opacity: 0.1 },
    { pos: [-3, 3, -5] as [number, number, number], size: 1.5, color: "#2dd4bf", opacity: 0.04 },
  ];

  return (
    <group ref={groupRef}>
      {spheres.map((s, i) => (
        <mesh key={i} position={s.pos}>
          <sphereGeometry args={[s.size, 32, 32]} />
          <meshStandardMaterial
            color={s.color}
            transparent
            opacity={s.opacity}
            roughness={0.4}
            metalness={0.6}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function CanvasBackground() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#2dd4bf" />
        <MintParticles />
        <FloatingSpheres />
      </Canvas>
    </div>
  );
}
