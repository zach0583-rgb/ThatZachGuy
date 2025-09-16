import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Plane, Text } from '@react-three/drei';
import { useBox, useCylinder } from '@react-three/cannon';
import * as THREE from 'three';

const LogCabin = ({ position = [0, 0, 0] }) => {
  const cabinRef = useRef();
  
  // Wood materials with Twin Peaks aesthetic
  const logMaterial = new THREE.MeshStandardMaterial({
    color: '#8B4513',
    roughness: 0.8,
    metalness: 0.1,
    bumpScale: 0.1
  });

  const roofMaterial = new THREE.MeshStandardMaterial({
    color: '#2F4F2F',
    roughness: 0.9,
    metalness: 0.0
  });

  const windowMaterial = new THREE.MeshStandardMaterial({
    color: '#FFD700',
    transparent: true,
    opacity: 0.3,
    emissive: '#FFD700',
    emissiveIntensity: 0.2
  });

  // Physics bodies
  const [mainWallRef] = useBox(() => ({ 
    args: [8, 4, 6], 
    position: [position[0], position[1] + 2, position[2]],
    type: 'Static'
  }));

  const [porch] = useBox(() => ({ 
    args: [10, 0.3, 3], 
    position: [position[0], position[1] + 0.15, position[2] + 4.5],
    type: 'Static'
  }));

  return (
    <group position={position} ref={cabinRef}>
      {/* Main Cabin Structure */}
      <Box ref={mainWallRef} args={[8, 4, 6]} position={[0, 2, 0]} castShadow receiveShadow>
        <primitive object={logMaterial} attach="material" />
      </Box>
      
      {/* Roof */}
      <Box args={[10, 0.5, 8]} position={[0, 4.5, 0]} castShadow>
        <primitive object={roofMaterial} attach="material" />
      </Box>
      
      {/* Door Frame */}
      <Box args={[1.5, 3, 0.2]} position={[0, 1.5, 3.1]} castShadow>
        <meshStandardMaterial color="#654321" />
      </Box>
      
      {/* Windows with warm glow */}
      <Box args={[1.5, 1.5, 0.1]} position={[-2.5, 2, 3.1]} castShadow>
        <primitive object={windowMaterial} attach="material" />
      </Box>
      <Box args={[1.5, 1.5, 0.1]} position={[2.5, 2, 3.1]} castShadow>
        <primitive object={windowMaterial} attach="material" />
      </Box>
      
      {/* Side Windows */}
      <Box args={[0.1, 1.5, 1.5]} position={[-4.1, 2, 0]} castShadow>
        <primitive object={windowMaterial} attach="material" />
      </Box>
      <Box args={[0.1, 1.5, 1.5]} position={[4.1, 2, 0]} castShadow>
        <primitive object={windowMaterial} attach="material" />
      </Box>
      
      {/* Porch */}
      <Box ref={porch} args={[10, 0.3, 3]} position={[0, 0.15, 4.5]} receiveShadow>
        <meshStandardMaterial color="#8B7355" roughness={0.9} />
      </Box>
      
      {/* Porch Pillars */}
      <Cylinder args={[0.2, 0.2, 3]} position={[-3, 1.5, 4.5]} castShadow>
        <primitive object={logMaterial} attach="material" />
      </Cylinder>
      <Cylinder args={[0.2, 0.2, 3]} position={[3, 1.5, 4.5]} castShadow>
        <primitive object={logMaterial} attach="material" />
      </Cylinder>
      
      {/* Chimney */}
      <Box args={[1, 6, 1]} position={[3, 3, -2]} castShadow>
        <meshStandardMaterial color="#696969" roughness={0.8} />
      </Box>
      
      {/* Chimney smoke effect */}
      <pointLight 
        position={[3, 6.5, -2]} 
        intensity={0.1} 
        color="#ff4500"
        distance={5}
        decay={2}
      />
      
      {/* Lodge Sign */}
      <group position={[0, 5.5, 6]}>
        <Box args={[4, 1, 0.2]} castShadow>
          <meshStandardMaterial color="#654321" />
        </Box>
        <Text
          position={[0, 0, 0.2]}
          fontSize={0.3}
          color="#FFD700"
          anchorX="center"
          anchorY="middle"
        >
          Twin Peaks Lodge
        </Text>
        
        {/* Sign posts */}
        <Cylinder args={[0.1, 0.1, 2]} position={[-1.5, -1, 0]} castShadow>
          <primitive object={logMaterial} attach="material" />
        </Cylinder>
        <Cylinder args={[0.1, 0.1, 2]} position={[1.5, -1, 0]} castShadow>
          <primitive object={logMaterial} attach="material" />
        </Cylinder>
      </group>
      
      {/* Atmospheric lighting from windows */}
      <pointLight 
        position={[-2.5, 2, 3.5]} 
        intensity={0.3} 
        color="#FFD700"
        distance={8}
        decay={2}
      />
      <pointLight 
        position={[2.5, 2, 3.5]} 
        intensity={0.3} 
        color="#FFD700"
        distance={8}
        decay={2}
      />
    </group>
  );
};

export default LogCabin;