"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Icosahedron } from "@react-three/drei";
import * as THREE from "three";

function FloatingShape() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const { x, y } = state.pointer;

    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.12 + y * 0.15;
      meshRef.current.rotation.y = t * 0.15 + x * 0.2;
    }

    if (wireframeRef.current) {
      wireframeRef.current.rotation.x = -t * 0.08 - y * 0.1;
      wireframeRef.current.rotation.y = -t * 0.1 - x * 0.15;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
        {/* Inner geometric structure */}
        <Icosahedron ref={meshRef} args={[1.3, 0]}>
          <meshStandardMaterial
            color="#141824"
            roughness={0.4}
            metalness={0.8}
          />
        </Icosahedron>

        {/* Outer subtle wireframe overlay */}
        <Icosahedron ref={wireframeRef} args={[1.6, 1]}>
          <meshBasicMaterial
            color="#3b82f6"
            wireframe
            transparent
            opacity={0.35}
          />
        </Icosahedron>
      </Float>
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="w-full h-[320px] sm:h-[400px] relative pointer-events-auto flex items-center justify-center">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 8, 4]} intensity={1.5} color="#e2e8f0" />
        <directionalLight position={[-5, -4, -2]} intensity={0.6} color="#3b82f6" />
        <FloatingShape />
      </Canvas>
    </div>
  );
}
