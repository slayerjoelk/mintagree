"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useRef, useEffect } from "react";
import * as THREE from "three";

function ReceiptCard() {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const targetY = mouse.current.x * 0.4;
    const targetX = -mouse.current.y * 0.25;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetY,
      0.03
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetX,
      0.03
    );
    groupRef.current.position.y = Math.sin(t * 0.6) * 0.08;
  });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <group ref={groupRef}>
      {/* Main card body */}
      <mesh>
        <boxGeometry args={[3.8, 5.2, 0.15]} />
        <meshStandardMaterial color="#18181b" roughness={0.2} metalness={0.1} />
      </mesh>

      {/* Glow edge */}
      <mesh scale={[1.005, 1.005, 0.8]}>
        <boxGeometry args={[3.8, 5.2, 0.15]} />
        <meshStandardMaterial
          color="#2dd4bf"
          transparent
          opacity={0.08}
          roughness={0.05}
          metalness={0.9}
          side={THREE.BackSide}
        />
      </mesh>

      {/* HTML overlay for all text — avoids Drei Text font loading */}
      <Html position={[-1.7, 2.1, 0.08]} transform distanceFactor={4}>
        <div className="whitespace-nowrap text-[10px] text-zinc-400 tracking-widest font-mono">
          CONVERSATION RECEIPT
        </div>
      </Html>

      <Html position={[0.8, 2.1, 0.08]} transform distanceFactor={4}>
        <div className="whitespace-nowrap text-[9px] text-zinc-600 font-mono">
          #MRC-042
        </div>
      </Html>

      <Html position={[-1.7, 1.45, 0.08]} transform distanceFactor={4}>
        <div className="whitespace-nowrap text-[9px] text-zinc-500">Client</div>
        <div className="whitespace-nowrap text-[13px] text-zinc-200 font-semibold">
          Northstar Creative
        </div>
      </Html>

      <Html position={[-1.7, 0.55, 0.08]} transform distanceFactor={4}>
        <div className="whitespace-nowrap text-[9px] text-zinc-500">Scope</div>
        <div className="text-[11px] text-zinc-300 w-[180px] leading-snug">
          Q2 brand refresh — logo, guidelines, 12 templates
        </div>
      </Html>

      {/* Divider */}
      <mesh position={[0, -0.2, 0.08]}>
        <planeGeometry args={[3.2, 0.004]} />
        <meshBasicMaterial color="#27272a" />
      </mesh>

      <Html position={[-1.7, -0.65, 0.08]} transform distanceFactor={4}>
        <div className="whitespace-nowrap text-[8px] text-zinc-400">Budget</div>
        <div className="whitespace-nowrap text-[14px] text-zinc-200 font-semibold">$8,500</div>
      </Html>

      <Html position={[0.1, -0.65, 0.08]} transform distanceFactor={4}>
        <div className="whitespace-nowrap text-[8px] text-zinc-400">Due</div>
        <div className="whitespace-nowrap text-[14px] text-zinc-200 font-semibold">Jun 15</div>
      </Html>

      {/* OTP badge */}
      <mesh position={[1.1, -1.45, 0.1]}>
        <planeGeometry args={[1.0, 0.45]} />
        <meshStandardMaterial color="#2dd4bf" emissive="#2dd4bf" emissiveIntensity={0.4} />
      </mesh>

      <Html position={[1.1, -1.45, 0.15]} transform distanceFactor={4}>
        <div className="whitespace-nowrap text-[14px] text-zinc-950 font-bold tracking-widest">8392</div>
      </Html>

      <Html position={[-1.7, -1.35, 0.08]} transform distanceFactor={4}>
        <div className="whitespace-nowrap text-[8px] text-zinc-400">Client sign-off</div>
      </Html>

      <Html position={[-1.7, -2.0, 0.08]} transform distanceFactor={4}>
        <div className="whitespace-nowrap text-[7px] text-zinc-500">Signed by</div>
        <div className="whitespace-nowrap text-[9px] text-zinc-400">
          dana.h@northstar.co · 2min ago
        </div>
      </Html>
    </group>
  );
}

export default function ReceiptScene() {
  return (
    <div className="w-full h-full min-h-[420px] md:min-h-[520px] rounded-2xl bg-zinc-900/60 border border-zinc-800/50 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true }}
        dpr={[1, 2]}
        frameloop="always"
      >
        <color attach="background" args={["#18181b"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.4} />
        <pointLight position={[-3, 2, 4]} intensity={1.0} color="#2dd4bf" />
        <pointLight position={[3, -2, 3]} intensity={0.4} color="#5eead4" />
        <ReceiptCard />
      </Canvas>
    </div>
  );
}
