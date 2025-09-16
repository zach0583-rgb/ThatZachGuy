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
import ArtistSuites from './ArtistSuites';
import RoomKeySystem from './RoomKeySystem';
import PersonalGallery from './PersonalGallery';
import ArtUpload from '../ArtUpload';

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
  const [accessedSuite, setAccessedSuite] = useState(null);
  const [suiteData, setSuiteData] = useState(null);

  // Key mapping for WASD movement
  const keyMap = [
    { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
    { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
    { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
    { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
    { name: 'jump', keys: ['Space'] },
    { name: 'run', keys: ['Shift'] },
  ];

  const handleRoomAccess = (suiteId, keyData) => {
    setAccessedSuite(suiteId);
    setSuiteData(keyData);
  };

  const handleExitSuite = () => {
    setAccessedSuite(null);
    setSuiteData(null);
  };

  const handleUploadSuccess = (newArtwork) => {
    // Artwork uploaded successfully - could show notification or refresh data
    console.log('New artwork uploaded:', newArtwork);
  };

  return (
    <div className="h-screen w-full relative">
      {/* Instructions Overlay */}
      <div className="absolute top-4 left-4 z-10 bg-black/70 text-white p-4 rounded-lg backdrop-blur-sm">
        <h3 className="font-bold mb-2">
          {accessedSuite ? `💕 ${suiteData?.artistName}'s Suite` : '🎨 Artist Colony & Lodge 🎵'}
        </h3>
        <p className="text-sm">
          {accessedSuite ? 
            'Welcome to your friend\'s personal art space!' :
            'Click to enter • WASD to move • Mouse to look around • ESC to exit'
          }
        </p>
        {!accessedSuite && (
          <p className="text-xs mt-2">🏔️ Main Lodge | 🎨 Artist Colony | 🏠 Artist Suites (2nd Floor)</p>
        )}
        {accessedSuite && (
          <button 
            onClick={handleExitSuite}
            className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
          >
            🚪 Exit Suite
          </button>
        )}
      </div>

      {/* Room Key System - only show if not in a suite */}
      {!accessedSuite && <RoomKeySystem onRoomAccess={handleRoomAccess} />}

      {/* Artist Colony Toggle */}
      {!accessedSuite && (
        <div className="absolute bottom-4 right-4 z-10">
          <button 
            onClick={() => setShowArtistColony(!showArtistColony)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            {showArtistColony ? '🏔️ Lodge Only' : '🎨 Show Artist Colony'}
          </button>
        </div>
      )}

      <KeyboardControls map={keyMap}>
        <Canvas
          shadows
          camera={{ position: accessedSuite ? [0, 2, 5] : [0, 2, 8], fov: 75 }}
          gl={{ 
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 0.8
          }}
        >
          <Suspense fallback={null}>
            <Physics>
              {/* Enhanced Atmospheric Lighting */}
              <ambientLight intensity={accessedSuite ? 0.3 : 0.15} color="#2c3e50" />
              <directionalLight
                position={[10, 15, 5]}
                intensity={accessedSuite ? 0.6 : 0.4}
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
              
              {/* Ground Plane */}
              <Ground />

              {/* Conditional Rendering based on suite access */}
              {accessedSuite ? (
                // Personal Suite View
                <PersonalGallery 
                  artistFriend={{ 
                    id: accessedSuite,
                    ...suiteData,
                    personalColor: '#FF69B4' // You could map this from suite data
                  }} 
                  position={[0, 0, 0]} 
                />
              ) : (
                // Main World View
                <group>
                  {/* Original Twin Peaks Lodge */}
                  <LogCabin position={[0, 0, 0]} />
                  
                  {/* Artist Colony Complex */}
                  {showArtistColony && (
                    <ArtistColony position={[0, 0, 0]} />
                  )}
                  
                  {/* Artist Suites on Second Floor */}
                  <ArtistSuites position={[0, 5, 0]} />
                  
                  {/* Creative Meeting Room inside main lodge */}
                  <group position={[0, 1, 0]}>
                    <CreativeMeetingRoom position={[0, 0, 0]} isActive={true} />
                  </group>
                  
                  {/* Art Sharing Systems in various locations */}
                  <ArtSharingSystem position={[20, 1, -5]} />
                  <ArtSharingSystem position={[-15, 1, 12]} />
                  
                  {/* Surrounding Forest */}
                  <Forest density={0.7} />
                  
                  {/* First Person Controller */}
                  <FirstPersonController />
                </group>
              )}
              
              {/* Enhanced Atmospheric Effects */}
              <AtmosphericEffects intensity={accessedSuite ? 0.5 : 1.2} />
            </Physics>

            {/* Dynamic Sky */}
            <Sky
              distance={450000}
              sunPosition={accessedSuite ? [0.8, 0.4, 0.2] : [0.5, 0.3, 0.1]}
              inclination={0.5}
              azimuth={0.25}
            />
            
            {/* Adaptive fog */}
            <fog attach="fog" args={[accessedSuite ? '#f0f8ff' : '#2c3e50', accessedSuite ? 5 : 15, accessedSuite ? 30 : 120]} />
            
            {/* Enhanced post-processing */}
            <EffectComposer>
              <Bloom 
                luminanceThreshold={0.2} 
                luminanceSmoothing={0.9} 
                intensity={accessedSuite ? 0.8 : 0.6} 
              />
              <Vignette 
                eskil={false}
                offset={accessedSuite ? 0.05 : 0.1}
                darkness={accessedSuite ? 0.1 : 0.2}
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