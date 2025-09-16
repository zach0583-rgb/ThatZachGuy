import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cloud, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const AtmosphericEffects = ({ intensity = 1.0, weatherEffect = 'clear' }) => {
  const mistRef = useRef();
  const particlesRef = useRef();
  
  // Create floating particles for atmosphere (reduced for mobile)
  const particleCount = Math.floor(200 * intensity);
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = Math.random() * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return positions;
  }, [particleCount]);

  // Animate particles
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001;
    }
    
    if (mistRef.current) {
      mistRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <group>
      {/* Atmospheric mist/fog clouds */}
      <group ref={mistRef}>
        <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.5}>
          <Cloud
            position={[-20, 3, -10]}
            speed={0.1}
            opacity={0.15}
            color="#e6f3ff"
            width={15}
            depth={8}
            segments={20}
          />
        </Float>
        
        <Float speed={0.3} rotationIntensity={0.1} floatIntensity={0.3}>
          <Cloud
            position={[25, 4, -15]}
            speed={0.1}
            opacity={0.1}
            color="#f0f8ff"
            width={20}
            depth={10}
            segments={20}
          />
        </Float>
        
        <Float speed={0.4} rotationIntensity={0.1} floatIntensity={0.4}>
          <Cloud
            position={[0, 8, -30]}
            speed={0.1}
            opacity={0.08}
            color="#e6f3ff"
            width={30}
            depth={15}
            segments={25}
          />
        </Float>
      </group>

      {/* Mystical sparkles in the forest */}
      <Sparkles
        count={50}
        scale={[40, 10, 40]}
        size={2}
        speed={0.2}
        opacity={0.3}
        color="#4a90e2"
      />
      
      {/* Floating dust particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={particlePositions}
            count={200}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color="#b0c4de"
          transparent
          opacity={0.3}
          sizeAttenuation
        />
      </points>
      
      {/* Subtle wind effect with moving grass-like elements */}
      <group>
        {Array.from({ length: 30 }, (_, i) => (
          <Float
            key={`grass-${i}`}
            speed={1 + Math.random()}
            rotationIntensity={0.5}
            floatIntensity={0.2}
          >
            <mesh
              position={[
                (Math.random() - 0.5) * 30,
                0.5,
                (Math.random() - 0.5) * 30
              ]}
              rotation={[0, Math.random() * Math.PI * 2, 0]}
            >
              <cylinderGeometry args={[0.01, 0.01, 1]} />
              <meshStandardMaterial 
                color="#2d4a2f" 
                transparent 
                opacity={0.6}
              />
            </mesh>
          </Float>
        ))}
      </group>
      
      {/* Moody lighting effects */}
      <group>
        <pointLight
          position={[0, 15, 0]}
          intensity={0.1}
          color="#4a90e2"
          distance={50}
          decay={2}
        />
        
        {/* Flickering lights for mystery */}
        <pointLight
          position={[-10, 2, -20]}
          intensity={0.05 + Math.sin(Date.now() * 0.001) * 0.02}
          color="#ff6b35"
          distance={15}
          decay={2}
        />
        
        <pointLight
          position={[15, 3, -25]}
          intensity={0.03 + Math.cos(Date.now() * 0.0008) * 0.02}
          color="#9370db"
          distance={12}
          decay={2}
        />
      </group>
    </group>
  );
};

export default AtmosphericEffects;