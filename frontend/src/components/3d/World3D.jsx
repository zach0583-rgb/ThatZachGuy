import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Environment, 
  OrbitControls, 
  Sky, 
  Cloud,
  Text,
  Box,
  Plane,
  Sphere,
  useTexture,
  Float,
  PerspectiveCamera,
  PointerLockControls,
  KeyboardControls,
  ContactShadows
} from '@react-three/drei';
import { Physics, usePlane, useBox } from '@react-three/cannon';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import LogCabin from './LogCabin';
import Forest from './Forest';
import AtmosphericEffects from './AtmosphericEffects';
import FirstPersonController from './FirstPersonController';

const Ground = () => {
  const [ref] = usePlane(() => ({ 
    rotation: [-Math.PI / 2, 0, 0], 
    position: [0, -0.5, 0],
    type: 'Static'
  }));

  return (
    <Plane ref={ref} args={[100, 100]} receiveShadow>
      <meshStandardMaterial 
        color="#2c5530" 
        roughness={0.8}
        metalness={0.1}
      />
    </Plane>
  );
};

const World3D = () => {
  const [enableControls, setEnableControls] = useState(false);

  // Key mapping for WASD movement
  const keyMap = [
    { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
    { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
    { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
    { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
    { name: 'jump', keys: ['Space'] },
    { name: 'run', keys: ['Shift'] },
  ];

  return (
    <div className="h-screen w-full relative">
      {/* Instructions Overlay */}
      <div className="absolute top-4 left-4 z-10 bg-black/70 text-white p-4 rounded-lg backdrop-blur-sm">
        <h3 className="font-bold mb-2">🌲 Pacific Northwest Lodge</h3>
        <p className="text-sm">Click to enter • WASD to move • Mouse to look around • ESC to exit</p>
      </div>

      <KeyboardControls map={keyMap}>
        <Canvas
          shadows
          camera={{ position: [0, 2, 8], fov: 75 }}
          gl={{ 
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 0.8
          }}
        >
          <Suspense fallback={null}>
            <Physics>
              {/* Atmospheric Lighting */}
              <ambientLight intensity={0.1} color="#2c3e50" />
              <directionalLight
                position={[10, 15, 5]}
                intensity={0.3}
                color="#e8dcc0"
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-camera-far={50}
                shadow-camera-left={-20}
                shadow-camera-right={20}
                shadow-camera-top={20}
                shadow-camera-bottom={-20}
              />
              
              {/* Moody point lights */}
              <pointLight position={[0, 3, 0]} intensity={0.5} color="#ff6b35" />
              <pointLight position={[-5, 2, -5]} intensity={0.3} color="#4a90e2" />
              
              {/* Ground Plane */}
              <Ground />

              {/* Log Cabin */}
              <LogCabin position={[0, 0, 0]} />
              
              {/* Surrounding Forest */}
              <Forest />
              
              {/* Atmospheric Effects */}
              <AtmosphericEffects />
              
              {/* First Person Controller */}
              <FirstPersonController />
            </Physics>

            {/* Sky and Environment */}
            <Sky
              distance={450000}
              sunPosition={[0.5, 0.2, 0.1]}
              inclination={0.6}
              azimuth={0.25}
            />
            
            {/* Fog for atmosphere */}
            <fog attach="fog" args={['#2c3e50', 10, 80]} />
            
            {/* Post-processing for that creepy October vibe */}
            <EffectComposer>
              <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={0.5} />
              <Vignette 
                eskil={false}
                offset={0.1}
                darkness={0.3}
              />
              <ChromaticAberration offset={[0.0005, 0.0005]} />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </div>
  );
};

export default World3D;