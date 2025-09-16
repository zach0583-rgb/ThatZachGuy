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
import ArtistColony from './ArtistColony';
import CreativeMeetingRoom from './CreativeMeetingRoom';
import ArtSharingSystem from './ArtSharingSystem';

const Ground = () => {
  const [ref] = usePlane(() => ({ 
    rotation: [-Math.PI / 2, 0, 0], 
    position: [0, -0.5, 0],
    type: 'Static'
  }));

  return (
    <Plane ref={ref} args={[200, 200]} receiveShadow>
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
  const [showArtistColony, setShowArtistColony] = useState(true);

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
        <h3 className="font-bold mb-2">🎨 Artist Colony & Lodge 🎵</h3>
        <p className="text-sm">Click to enter • WASD to move • Mouse to look around • ESC to exit</p>
        <p className="text-xs mt-2">🏔️ Main Lodge | 🎨 Artist Colony | 🎭 Performance Stage</p>
      </div>

      {/* Artist Colony Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={() => setShowArtistColony(!showArtistColony)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          {showArtistColony ? '🏔️ Lodge Only' : '🎨 Show Artist Colony'}
        </button>
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
              {/* Enhanced Atmospheric Lighting for Artist Colony */}
              <ambientLight intensity={0.15} color="#2c3e50" />
              <directionalLight
                position={[10, 15, 5]}
                intensity={0.4}
                color="#e8dcc0"
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-camera-far={80}
                shadow-camera-left={-40}
                shadow-camera-right={40}
                shadow-camera-top={40}
                shadow-camera-bottom={-40}
              />
              
              {/* Creative atmosphere lights */}
              <pointLight position={[0, 3, 0]} intensity={0.5} color="#ff6b35" />
              <pointLight position={[-5, 2, -5]} intensity={0.3} color="#4a90e2" />
              <pointLight position={[15, 5, 0]} intensity={0.4} color="#9370db" />
              <pointLight position={[-10, 4, -15]} intensity={0.3} color="#32cd32" />
              
              {/* Extended Ground Plane for Artist Colony */}
              <Ground />

              {/* Original Twin Peaks Lodge */}
              <LogCabin position={[0, 0, 0]} />
              
              {/* Artist Colony Complex */}
              {showArtistColony && (
                <ArtistColony position={[0, 0, 0]} />
              )}
              
              {/* Creative Meeting Room inside main lodge */}
              <group position={[0, 1, 0]}>
                <CreativeMeetingRoom position={[0, 0, 0]} isActive={true} />
              </group>
              
              {/* Art Sharing Systems in various locations */}
              <ArtSharingSystem position={[20, 1, -5]} />
              <ArtSharingSystem position={[-15, 1, 12]} />
              
              {/* Surrounding Forest (adapted for larger space) */}
              <Forest density={0.7} />
              
              {/* Enhanced Atmospheric Effects */}
              <AtmosphericEffects intensity={1.2} />
              
              {/* First Person Controller */}
              <FirstPersonController />
            </Physics>

            {/* Dynamic Sky for Artist Colony */}
            <Sky
              distance={450000}
              sunPosition={[0.5, 0.3, 0.1]}
              inclination={0.5}
              azimuth={0.25}
            />
            
            {/* Creative fog atmosphere */}
            <fog attach="fog" args={['#2c3e50', 15, 120]} />
            
            {/* Enhanced post-processing for artistic atmosphere */}
            <EffectComposer>
              <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={0.6} />
              <Vignette 
                eskil={false}
                offset={0.1}
                darkness={0.2}
              />
              <ChromaticAberration offset={[0.0003, 0.0003]} />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </div>
  );
};

export default World3D;