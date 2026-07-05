'use client';

import { Canvas } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 6, 5]} intensity={2.2} color="#f4f4f0" />
      <directionalLight position={[-4, -2, 2]} intensity={1.2} color="#b7bcf8" />
      <pointLight position={[0, 0, 4]} intensity={1.4} color="#498073" />

      <Float speed={1.25} rotationIntensity={0.55} floatIntensity={0.85}>
        <group rotation={[0.25, -0.45, -0.08]}>
          <mesh position={[-1.95, 0.8, 0.2]}>
            <sphereGeometry args={[0.42, 32, 32]} />
            <meshStandardMaterial color="#b7bcf8" metalness={0.65} roughness={0.22} />
          </mesh>

          <mesh position={[1.65, -0.7, -0.35]}>
            <icosahedronGeometry args={[0.54, 0]} />
            <meshStandardMaterial color="#498073" metalness={0.5} roughness={0.34} />
          </mesh>

          <RoundedBox args={[2.6, 1.55, 0.42]} radius={0.16} smoothness={4}>
            <meshStandardMaterial color="#1c2623" metalness={0.2} roughness={0.38} />
          </RoundedBox>

          <mesh position={[0, 0, 0.28]}>
            <torusGeometry args={[0.95, 0.12, 16, 64]} />
            <meshStandardMaterial color="#f4f4f0" metalness={0.3} roughness={0.3} />
          </mesh>

          <mesh position={[0, 0, 0.35]} rotation={[1.55, 0, 0]}>
            <ringGeometry args={[0.34, 0.68, 48]} />
            <meshStandardMaterial color="#498073" metalness={0.28} roughness={0.26} />
          </mesh>
        </group>
      </Float>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.9, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#0a0a0a" roughness={1} />
      </mesh>
    </Canvas>
  );
}
