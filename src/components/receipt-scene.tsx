"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox, Text } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function ReceiptCard() {
  const cardRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!cardRef.current) return;
    const t = state.clock.elapsedTime;
    cardRef.current.rotation.y = THREE.MathUtils.lerp(cardRef.current.rotation.y, mouseRef.current.x * 0.4, 0.03);
    cardRef.current.rotation.x = THREE.MathUtils.lerp(cardRef.current.rotation.x, -mouseRef.current.y * 0.25, 0.03);
    cardRef.current.position.y = Math.sin(t * 0.6) * 0.08;
  });

  useMemo(() => {
    if (typeof window === "undefined") return;
    const handler = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <group ref={cardRef}>
      <Float speed={1.5} rotationIntensity={0} floatIntensity={0.2}>
        <RoundedBox args={[3.4, 4.6, 0.12]} radius={0.15} smoothness={4}>
          <meshStandardMaterial color="#18181b" roughness={0.2} metalness={0.1} />
        </RoundedBox>
      </Float>

      {/* Glow edge */}
      <RoundedBox args={[3.42, 4.62, 0.1]} radius={0.15} smoothness={4}>
        <meshStandardMaterial
          color="#2dd4bf"
          transparent
          opacity={0.06}
          roughness={0.05}
          metalness={0.9}
          side={THREE.BackSide}
        />
      </RoundedBox>

      {/* Labels */}
      <Text position={[-1.35, 1.95, 0.08]} fontSize={0.12} color="#71717a" letterSpacing={0.05}>
        CONVERSATION RECEIPT
      </Text>
      <Text position={[1.1, 1.95, 0.08]} fontSize={0.1} color="#3f3f46">
        #MRC-042
      </Text>

      <Text position={[-1.35, 1.35, 0.08]} fontSize={0.1} color="#a1a1aa">Client</Text>
      <Text position={[-1.35, 1.1, 0.08]} fontSize={0.15} color="#e4e4e7" fontWeight="bold">Northstar Creative</Text>

      <Text position={[-1.35, 0.6, 0.08]} fontSize={0.1} color="#a1a1aa">Scope</Text>
      <Text position={[-1.35, 0.3, 0.08]} fontSize={0.13} color="#d4d4d8" maxWidth={3}>
        Q2 brand refresh — logo, guidelines, 12 templates
      </Text>

      {/* Divider */}
      <mesh position={[0, -0.1, 0.08]}>
        <planeGeometry args={[2.8, 0.003]} />
        <meshBasicMaterial color="#27272a" />
      </mesh>

      <Text position={[-1.35, -0.5, 0.08]} fontSize={0.09} color="#71717a">Budget</Text>
      <Text position={[-1.35, -0.7, 0.08]} fontSize={0.15} color="#e4e4e7">$8,500</Text>

      <Text position={[0.1, -0.5, 0.08]} fontSize={0.09} color="#71717a">Due</Text>
      <Text position={[0.1, -0.7, 0.08]} fontSize={0.15} color="#e4e4e7">Jun 15</Text>

      {/* OTP badge */}
      <Text position={[-1.35, -1.15, 0.08]} fontSize={0.09} color="#71717a">Client sign-off</Text>
      <RoundedBox position={[1.0, -1.15, 0.1]} args={[0.9, 0.4, 0.05]} radius={0.05}>
        <meshStandardMaterial color="#2dd4bf" emissive="#2dd4bf" emissiveIntensity={0.4} />
      </RoundedBox>
      <Text position={[1.0, -1.15, 0.16]} fontSize={0.16} color="#09090b" fontWeight="bold" letterSpacing={0.12}>
        8392
      </Text>

      <Text position={[-1.35, -1.75, 0.08]} fontSize={0.08} color="#52525b">Signed by</Text>
      <Text position={[-1.35, -1.95, 0.08]} fontSize={0.1} color="#52525b">
        dana.h@northstar.co · 2min ago
      </Text>
    </group>
  );
}

export default function ReceiptScene() {
  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[480px]">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.4} />
        <pointLight position={[-3, 2, 4]} intensity={1.0} color="#2dd4bf" />
        <pointLight position={[3, -2, 3]} intensity={0.4} color="#5eead4" />
        <ReceiptCard />
      </Canvas>
    </div>
  );
}
