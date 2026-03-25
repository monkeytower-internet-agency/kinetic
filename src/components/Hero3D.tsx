import React, { useRef, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, ContactShadows, Environment } from '@react-three/drei';
import { useStore } from '@nanostores/react';
import { isInteractingWithUI } from '../stores/themeStore';
import * as THREE from 'three';

function KineticPod() {
  const meshRef = useRef<THREE.Group>(null);
  const isBlocked = useStore(isInteractingWithUI);

  // Gentle auto-rotation
  useFrame((state) => {
    // Only auto-rotate if menu is closed
    if (meshRef.current && !isBlocked) {
      meshRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={meshRef}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        {/* Main Body - A stylized competition harness pod */}
        <mesh scale={[2.5, 0.7, 0.8]}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial 
            color="#c1121c" 
            metalness={0.9} 
            roughness={0.1}
            emissive="#c1121c"
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Technological accents (Wireframe) */}
        <mesh scale={[2.52, 0.72, 0.82]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial 
            color="#ffffff" 
            wireframe 
            transparent 
            opacity={0.15} 
          />
        </mesh>

        {/* Small "cockpit" or seat detail */}
        <mesh position={[0.4, 0.1, 0]} scale={[1, 0.5, 0.7]}>
          <boxGeometry />
          <meshStandardMaterial color="#111" metalness={0.5} roughness={0.5} />
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
