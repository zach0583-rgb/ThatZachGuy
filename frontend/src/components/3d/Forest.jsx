import React, { useMemo } from 'react';
import { Cylinder, Sphere, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

const Tree = ({ position, scale = 1 }) => {
  const trunkHeight = 3 + Math.random() * 4;
  const foliageSize = 1.5 + Math.random() * 2;
  
  // Pacific Northwest tree colors
  const trunkColor = '#4A4A4A';
  const foliageColors = ['#1a3d2e', '#2d5a3d', '#1f4a2f', '#264d35'];
  const foliageColor = foliageColors[Math.floor(Math.random() * foliageColors.length)];
  
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <Cylinder 
        args={[0.2, 0.3, trunkHeight]} 
        position={[0, trunkHeight / 2, 0]} 
        castShadow
      >
        <meshStandardMaterial 
          color={trunkColor} 
          roughness={0.9}
          bumpScale={0.1} 
        />
      </Cylinder>
      
      {/* Foliage layers for depth */}
      <Icosahedron 
        args={[foliageSize]} 
        position={[0, trunkHeight + foliageSize * 0.5, 0]} 
        castShadow
      >
        <meshStandardMaterial 
          color={foliageColor} 
          roughness={0.8}
          transparent={true}
          opacity={0.9}
        />
      </Icosahedron>
      
      <Icosahedron 
        args={[foliageSize * 0.7]} 
        position={[0, trunkHeight + foliageSize * 1.2, 0]} 
        castShadow
      >
        <meshStandardMaterial 
          color={foliageColor} 
          roughness={0.8}
          transparent={true}
          opacity={0.8}
        />
      </Icosahedron>
      
      <Icosahedron 
        args={[foliageSize * 0.4]} 
        position={[0, trunkHeight + foliageSize * 1.8, 0]} 
        castShadow
      >
        <meshStandardMaterial 
          color={foliageColor} 
          roughness={0.8}
          transparent={true}
          opacity={0.9}
        />
      </Icosahedron>
    </group>
  );
};

const Bush = ({ position, scale = 1 }) => {
  const bushSize = 0.5 + Math.random() * 0.8;
  
  return (
    <group position={position} scale={scale}>
      <Sphere args={[bushSize]} castShadow>
        <meshStandardMaterial 
          color="#2d4a2f" 
          roughness={0.9}
          transparent={true}
          opacity={0.8}
        />
      </Sphere>
    </group>
  );
};

const Forest = () => {
  // Generate forest positions in a realistic pattern
  const forestElements = useMemo(() => {
    const elements = [];
    
    // Dense forest ring around the cabin
    for (let i = 0; i < 150; i++) {
      const angle = (i / 150) * Math.PI * 2;
      const distance = 15 + Math.random() * 25; // Start forest at distance from cabin
      const x = Math.cos(angle) * distance + (Math.random() - 0.5) * 10;
      const z = Math.sin(angle) * distance + (Math.random() - 0.5) * 10;
      
      // Vary tree sizes and positions for natural look
      const scale = 0.7 + Math.random() * 0.6;
      
      elements.push({
        type: 'tree',
        position: [x, 0, z],
        scale: scale,
        key: `tree-${i}`
      });
    }
    
    // Add undergrowth bushes
    for (let i = 0; i < 100; i++) {
      const angle = (i / 100) * Math.PI * 2;
      const distance = 12 + Math.random() * 30;
      const x = Math.cos(angle) * distance + (Math.random() - 0.5) * 8;
      const z = Math.sin(angle) * distance + (Math.random() - 0.5) * 8;
      
      elements.push({
        type: 'bush',
        position: [x, 0.3, z],
        scale: 0.8 + Math.random() * 0.4,
        key: `bush-${i}`
      });
    }
    
    // Coastal elements - add some closer to water
    for (let i = 0; i < 30; i++) {
      const x = -40 + Math.random() * 80;
      const z = -35 - Math.random() * 15; // Behind the forest
      
      elements.push({
        type: 'tree',
        position: [x, 0, z],
        scale: 1 + Math.random() * 0.5,
        key: `coastal-tree-${i}`
      });
    }
    
    return elements;
  }, []);

  return (
    <group>
      {forestElements.map((element) => {
        if (element.type === 'tree') {
          return (
            <Tree
              key={element.key}
              position={element.position}
              scale={element.scale}
            />
          );
        } else if (element.type === 'bush') {
          return (
            <Bush
              key={element.key}
              position={element.position}
              scale={element.scale}
            />
          );
        }
        return null;
      })}
      
      {/* Add some atmospheric fog/mist between trees */}
      <group>
        {Array.from({ length: 20 }, (_, i) => (
          <pointLight
            key={`mist-${i}`}
            position={[
              (Math.random() - 0.5) * 60,
              1 + Math.random() * 2,
              -20 + (Math.random() - 0.5) * 40
            ]}
            intensity={0.05}
            color="#b0c4de"
            distance={8}
            decay={2}
          />
        ))}
      </group>
    </group>
  );
};

export default Forest;