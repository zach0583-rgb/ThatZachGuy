import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Sky, 
  Box,
  Plane,
  Float,
  PointerLockControls,
  OrbitControls
} from '@react-three/drei';
import { Physics, usePlane, useBox } from '@react-three/cannon';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import LogCabin from './LogCabin';
import Forest from './Forest';
import AtmosphericEffects from './AtmosphericEffects';
import MobileControls from './MobileControls';
import MobileUI from './MobileUI';

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

const MobileWorld3D = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);
  const [sceneObjects, setSceneObjects] = useState([]);
  const [forestDensity, setForestDensity] = useState(0.8);
  const [lightingMood, setLightingMood] = useState('evening');
  const [weatherEffect, setWeatherEffect] = useState('clear');

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleAddObject = (objectType, position) => {
    const newObject = {
      id: Date.now() + Math.random(),
      type: objectType,
      position,
      rotation: 0,
      scale: 1
    };
    setSceneObjects(prev => [...prev, newObject]);
  };

  const handleObjectUpdate = (objectId, updates) => {
    setSceneObjects(prev => 
      prev.map(obj => obj.id === objectId ? { ...obj, ...updates } : obj)
    );
  };

  const handleDeleteObject = (objectId) => {
    setSceneObjects(prev => prev.filter(obj => obj.id !== objectId));
  };

  const lightingConfigs = {
    morning: { ambient: 0.3, directional: 0.5, color: '#ffd89b' },
    evening: { ambient: 0.1, directional: 0.3, color: '#e8dcc0' },
    night: { ambient: 0.05, directional: 0.1, color: '#4a5568' },
    mystical: { ambient: 0.15, directional: 0.2, color: '#6a5acd' }
  };

  const currentLighting = lightingConfigs[lightingMood];

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Mobile-Optimized UI Overlay */}
      <MobileUI 
        isCustomizing={isCustomizing}
        setIsCustomizing={setIsCustomizing}
        forestDensity={forestDensity}
        setForestDensity={setForestDensity}
        lightingMood={lightingMood}
        setLightingMood={setLightingMood}
        weatherEffect={weatherEffect}
        setWeatherEffect={setWeatherEffect}
        onAddObject={handleAddObject}
        isMobile={isMobile}
      />

      <Canvas
        shadows
        camera={{ 
          position: [0, isMobile ? 1.8 : 2, isMobile ? 6 : 8], 
          fov: isMobile ? 85 : 75 
        }}
        gl={{ 
          antialias: !isMobile, // Disable on mobile for performance
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.8,
          powerPreference: "high-performance"
        }}
        performance={{ min: 0.5 }} // Allow lower framerate on mobile
      >
        <Suspense fallback={null}>
          <Physics gravity={[0, -9.8, 0]}>
            {/* Adaptive Lighting based on settings */}
            <ambientLight intensity={currentLighting.ambient} color={currentLighting.color} />
            <directionalLight
              position={[10, 15, 5]}
              intensity={currentLighting.directional}
              color={currentLighting.color}
              castShadow={!isMobile} // Disable shadows on mobile for performance
              shadow-mapSize={isMobile ? [512, 512] : [2048, 2048]}
              shadow-camera-far={30}
              shadow-camera-left={-15}
              shadow-camera-right={15}
              shadow-camera-top={15}
              shadow-camera-bottom={-15}
            />
            
            {/* Atmospheric point lights */}
            <pointLight position={[0, 3, 0]} intensity={0.4} color="#ff6b35" />
            <pointLight position={[-5, 2, -5]} intensity={0.2} color="#4a90e2" />
            
            {/* Ground */}
            <Ground />

            {/* Log Cabin */}
            <LogCabin position={[0, 0, 0]} />
            
            {/* Adaptive Forest based on density setting */}
            <Forest density={forestDensity} isMobile={isMobile} />
            
            {/* Custom Objects */}
            {sceneObjects.map((obj) => (
              <CustomObject
                key={obj.id}
                object={obj}
                isSelected={selectedObject === obj.id}
                onUpdate={(updates) => handleObjectUpdate(obj.id, updates)}
                onSelect={() => setSelectedObject(obj.id)}
              />
            ))}
            
            {/* Atmospheric Effects - reduced on mobile */}
            <AtmosphericEffects 
              intensity={isMobile ? 0.5 : 1.0} 
              weatherEffect={weatherEffect}
            />
            
            {/* Mobile-optimized controls */}
            <MobileControls 
              isMobile={isMobile}
              isCustomizing={isCustomizing}
            />
          </Physics>

          {/* Sky with time-based effects */}
          <Sky
            distance={450000}
            sunPosition={
              lightingMood === 'morning' ? [0.8, 0.4, 0.2] :
              lightingMood === 'evening' ? [0.2, 0.1, 0.1] :
              lightingMood === 'night' ? [-0.2, -0.1, 0.1] :
              [0.3, 0.2, 0.15] // mystical
            }
            inclination={0.6}
            azimuth={0.25}
          />
          
          {/* Adaptive fog */}
          <fog attach="fog" args={[
            lightingMood === 'night' ? '#1a202c' : '#2c3e50', 
            isMobile ? 15 : 10, 
            isMobile ? 60 : 80
          ]} />
          
          {/* Mobile-optimized post-processing */}
          {!isMobile && (
            <EffectComposer>
              <Bloom 
                luminanceThreshold={0.3} 
                luminanceSmoothing={0.9} 
                intensity={0.3} 
              />
              <Vignette 
                eskil={false}
                offset={0.15}
                darkness={0.2}
              />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};

// Custom Object Component for mobile editing
const CustomObject = ({ object, isSelected, onUpdate, onSelect }) => {
  const meshRef = useRef();
  
  const objectTypes = {
    campfire: () => (
      <group onClick={onSelect}>
        <Cylinder args={[0.3, 0.3, 0.1]} position={[0, 0.05, 0]}>
          <meshStandardMaterial color="#654321" />
        </Cylinder>
        <pointLight position={[0, 1, 0]} intensity={0.5} color="#ff4500" distance={5} />
      </group>
    ),
    boulder: () => (
      <Box args={[1, 0.8, 1.2]} onClick={onSelect}>
        <meshStandardMaterial color="#696969" roughness={0.9} />
      </Box>
    ),
    bench: () => (
      <group onClick={onSelect}>
        <Box args={[2, 0.1, 0.4]} position={[0, 0.5, 0]}>
          <meshStandardMaterial color="#8B4513" />
        </Box>
        <Box args={[0.1, 0.5, 0.1]} position={[-0.8, 0.25, -0.1]}>
          <meshStandardMaterial color="#8B4513" />
        </Box>
        <Box args={[0.1, 0.5, 0.1]} position={[0.8, 0.25, -0.1]}>
          <meshStandardMaterial color="#8B4513" />
        </Box>
      </group>
    )
  };

  const ObjectComponent = objectTypes[object.type];
  if (!ObjectComponent) return null;

  return (
    <group 
      ref={meshRef}
      position={object.position}
      rotation={[0, object.rotation, 0]}
      scale={object.scale}
    >
      <ObjectComponent />
      {isSelected && (
        <Box args={[2, 0.1, 2]} position={[0, -0.05, 0]}>
          <meshStandardMaterial 
            color="#00ff00" 
            transparent 
            opacity={0.3}
            wireframe 
          />
        </Box>
      )}
    </group>
  );
};

export default MobileWorld3D;