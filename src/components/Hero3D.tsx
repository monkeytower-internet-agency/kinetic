import React, { useRef, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, ContactShadows, Environment } from '@react-three/drei';
import { useStore } from '@nanostores/react';
import { isInteractingWithUI } from '../stores/themeStore';
import * as THREE from 'three';

function KineticPod() {
  const meshRef = useRef<THREE.Group>(null);
  const isBlocked = useStore(isInteractingWithUI);

  // Scroll-based rotation & tilt
  useFrame((state) => {
    if (meshRef.current && !isBlocked) {
      // Base auto-rotation
      meshRef.current.rotation.y += 0.003;
      
      // Reactive scroll rotation (Slow turn as you scroll)
      const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
      const targetScrollRot = (scrollY * 0.005);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetScrollRot, 0.05);

      // Reactive scroll tilt (Banking effect)
      const targetTilt = (scrollY * 0.002);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, -targetTilt, 0.05);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetTilt * 0.5, 0.05);
    }
  });

  const bodyColor = "#383e42"; // Anthrazit/Metal
  const seatColor = "#c1121c"; // ProFly Red (Inner Core)
  const accentColor = "#ffffff";

  return (
    <group ref={meshRef}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        
        {/* 1. SEAT & COCKPIT (Inner Core - Now Red) */}
        <mesh position={[0.2, 0.15, 0]} rotation={[0, 0, Math.PI / 8]}>
          <boxGeometry args={[1.2, 0.8, 0.9]} />
          <meshStandardMaterial color={seatColor} metalness={0.8} roughness={0.2} emissive={seatColor} emissiveIntensity={0.2} />
        </mesh>

        {/* 2. MAIN POD BODY (Central Section - Dark Metallic) */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.55, 0.55, 2.2, 64]} />
          <meshStandardMaterial color={bodyColor} metalness={0.9} roughness={0.15} />
        </mesh>

        {/* 3. AERO NOSE (Tapered Front) */}
        <mesh position={[1.5, 0.1, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.55, 1.2, 64]} />
          <meshStandardMaterial color={bodyColor} metalness={0.9} roughness={0.15} />
        </mesh>

        {/* 4. TAIL FAIRING (Inflatable Tail) */}
        <mesh position={[-1.8, 0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.55, 1.8, 64]} />
          <meshStandardMaterial color={bodyColor} metalness={0.9} roughness={0.15} />
        </mesh>


        {/* 5. TECHNOLOGY LAYER (Wireframe Highlights) */}
        <group scale={[1.02, 1.02, 1.02]}>
           {/* Body Wire */}
           <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
             <cylinderGeometry args={[0.57, 0.57, 2.3, 32]} />
             <meshBasicMaterial color={accentColor} wireframe transparent opacity={0.1} />
           </mesh>
           {/* Tail Wire */}
           <mesh position={[-1.8, 0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
             <cylinderGeometry args={[0.07, 0.57, 1.9, 16]} />
             <meshBasicMaterial color={accentColor} wireframe transparent opacity={0.1} />
           </mesh>
        </group>

        {/* 6. STRUCTURAL STRAPS (Visual Accents) */}
        <mesh position={[0.4, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
           <torusGeometry args={[0.45, 0.02, 16, 100]} />
           <meshBasicMaterial color={accentColor} transparent opacity={0.3} />
        </mesh>

      </Float>
    </group>
  );
}


const Hero3D: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const isBlocked = useStore(isInteractingWithUI);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div 
      style={{ 
        width: '100%', 
        height: '100%', 
        position: 'absolute', 
        inset: 0,
        overflow: 'hidden',
        pointerEvents: isBlocked ? 'none' : 'auto' // Prevent interaction when menu is open
      }}

    >
      <Canvas 
        shadows 
        dpr={[1, 2]} 
        camera={{ position: [0, 0, 5], fov: 40 }}
        style={{ touchAction: isBlocked ? 'auto' : 'none' }} // Allow scrolling when blocked
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <Suspense fallback={null}>
          <group position={[0, 0.8, 0]}>
            <KineticPod />
          </group>

          <ContactShadows 
            position={[0, -2.2, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={2.5} 
            far={4} 
          />
          <Environment preset="city" />
        </Suspense>


        <OrbitControls 
          enabled={!isBlocked} // Completely disable controls when menu is open
          enablePan={false}
          enableZoom={isMobile}
          enableDamping={true}
          dampingFactor={0.05}
          rotateSpeed={0.8}
          minDistance={3}
          maxDistance={8}
        />
      </Canvas>
    </div>
  );
};

export default Hero3D;
