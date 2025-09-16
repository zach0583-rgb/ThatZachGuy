import React, { useState, useRef } from 'react';
import { Box, Cylinder, Plane, Text, Ring, Sphere } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CreativeMeetingRoom = ({ position = [0, 0, 0], isActive = false }) => {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const tableRef = useRef();
  const chairRefs = useRef([]);
  const artDisplayRef = useRef();

  // Animate the table with a subtle glow
  useFrame((state) => {
    if (tableRef.current && isActive) {
      tableRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
    if (artDisplayRef.current) {
      artDisplayRef.current.rotation.y += 0.005;
    }
  });

  // Round Table Configuration
  const tableRadius = 2.5;
  const chairPositions = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    return {
      x: Math.cos(angle) * (tableRadius + 1.2),
      z: Math.sin(angle) * (tableRadius + 1.2),
      rotation: angle + Math.PI
    };
  });

  const Chair = ({ position, rotation, index, isOccupied = false }) => (
    <group 
      position={[position.x, 0, position.z]} 
      rotation={[0, rotation, 0]}
      onClick={() => setSelectedSeat(index)}
    >
      {/* Chair Base */}
      <Box args={[0.6, 0.1, 0.6]} position={[0, 0.4, 0]} castShadow>
        <meshStandardMaterial 
          color={selectedSeat === index ? "#4A90E2" : "#8B4513"} 
          roughness={0.8} 
        />
      </Box>
      
      {/* Chair Back */}
      <Box args={[0.6, 0.8, 0.1]} position={[0, 0.8, -0.25]} castShadow>
        <meshStandardMaterial 
          color={selectedSeat === index ? "#4A90E2" : "#8B4513"} 
          roughness={0.8} 
        />
      </Box>
      
      {/* Chair Legs */}
      {[[-0.25, -0.25], [0.25, -0.25], [-0.25, 0.25], [0.25, 0.25]].map(([x, z], i) => (
        <Cylinder key={i} args={[0.05, 0.05, 0.8]} position={[x, 0, z]} castShadow>
          <meshStandardMaterial color="#654321" />
        </Cylinder>
      ))}
      
      {/* Occupied indicator */}
      {isOccupied && (
        <Sphere args={[0.3]} position={[0, 1.2, 0]}>
          <meshStandardMaterial 
            color="#FF6B35" 
            transparent 
            opacity={0.7}
            emissive="#FF6B35"
            emissiveIntensity={0.3}
          />
        </Sphere>
      )}
      
      {/* Name plate */}
      <Text
        position={[0, 0.2, 0.4]}
        fontSize={0.08}
        color="#333333"
        anchorX="center"
        anchorY="middle"
      >
        Artist {index + 1}
      </Text>
    </group>
  );

  return (
    <group position={position}>
      {/* Room Floor */}
      <Plane args={[15, 15]} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <meshStandardMaterial 
          color="#8B7355" 
          roughness={0.9}
          metalness={0.1}
        />
      </Plane>
      
      {/* Central Round Table */}
      <group ref={tableRef}>
        <Cylinder args={[tableRadius, tableRadius, 0.15]} position={[0, 0.75, 0]} castShadow receiveShadow>
          <meshStandardMaterial 
            color="#D2691E" 
            roughness={0.3}
            metalness={0.1}
          />
        </Cylinder>
        
        {/* Table Base */}
        <Cylinder args={[0.4, 0.4, 0.7]} position={[0, 0.35, 0]} castShadow>
          <meshStandardMaterial color="#8B4513" roughness={0.8} />
        </Cylinder>
        
        {/* Creative collaboration surface glow */}
        <Ring args={[tableRadius - 0.1, tableRadius + 0.1, 32]} position={[0, 0.76, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshStandardMaterial 
            color="#9370DB" 
            transparent 
            opacity={0.3}
            emissive="#9370DB"
            emissiveIntensity={0.2}
          />
        </Ring>
      </group>
      
      {/* Artist Chairs around the table */}
      {chairPositions.map((pos, index) => (
        <Chair
          key={index}
          position={pos}
          rotation={pos.rotation}
          index={index}
          isOccupied={index < 3} // Mock some occupied seats
        />
      ))}
      
      {/* Central Art Display Hologram */}
      <group ref={artDisplayRef} position={[0, 2, 0]}>
        <Box args={[1, 1.5, 0.1]} castShadow>
          <meshStandardMaterial 
            color="#000000" 
            transparent 
            opacity={0.8}
          />
        </Box>
        <Plane args={[0.9, 1.4]} position={[0, 0, 0.06]}>
          <meshStandardMaterial 
            color="#4A90E2" 
            transparent 
            opacity={0.7}
            emissive="#4A90E2"
            emissiveIntensity={0.4}
          />
        </Plane>
        <Text
          position={[0, 0, 0.1]}
          fontSize={0.1}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          🎨 Shared Canvas 🎨
        </Text>
      </group>
      
      {/* Wall-mounted collaboration boards */}
      <group position={[0, 2, -7]}>
        <Box args={[8, 4, 0.2]} castShadow>
          <meshStandardMaterial color="#FFFFFF" roughness={0.1} />
        </Box>
        <Text
          position={[0, 1.5, 0.15]}
          fontSize={0.3}
          color="#333333"
          anchorX="center"
          anchorY="middle"
        >
          🎭 Creative Board 🎪
        </Text>
        
        {/* Mock collaborative sticky notes */}
        {[-2, 0, 2].map((x, i) => (
          <Box key={i} args={[1, 1, 0.05]} position={[x, 0, 0.2]} castShadow>
            <meshStandardMaterial 
              color={['#FFD700', '#FF6B35', '#4A90E2'][i]} 
              roughness={0.3}
            />
          </Box>
        ))}
      </group>
      
      {/* Side collaboration zones */}
      <group position={[6, 0, 0]}>
        {/* Casual seating area */}
        <Box args={[2, 0.8, 1]} position={[0, 0.4, 0]} castShadow>
          <meshStandardMaterial color="#9370DB" roughness={0.7} />
        </Box>
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.15}
          color="#9370DB"
          anchorX="center"
          anchorY="middle"
        >
          Brainstorm Zone
        </Text>
      </group>
      
      <group position={[-6, 0, 0]}>
        {/* Material station */}
        <Box args={[1.5, 1, 2]} position={[0, 0.5, 0]} castShadow>
          <meshStandardMaterial color="#8B4513" roughness={0.8} />
        </Box>
        <Text
          position={[0, 1.8, 0]}
          fontSize={0.15}
          color="#8B4513"
          anchorX="center"
          anchorY="middle"
        >
          Supply Station
        </Text>
      </group>
      
      {/* Ambient creative lighting */}
      <pointLight 
        position={[0, 4, 0]} 
        intensity={0.6} 
        color="#FFFFFF"
        distance={12}
        decay={2}
      />
      <pointLight 
        position={[4, 3, 4]} 
        intensity={0.3} 
        color="#9370DB"
        distance={8}
        decay={2}
      />
      <pointLight 
        position={[-4, 3, -4]} 
        intensity={0.3} 
        color="#FF6B35"
        distance={8}
        decay={2}
      />
      
      {/* Inspirational floating elements */}
      {Array.from({ length: 5 }, (_, i) => (
        <Sphere 
          key={i}
          args={[0.1]} 
          position={[
            (Math.random() - 0.5) * 8,
            2 + Math.random() * 2,
            (Math.random() - 0.5) * 8
          ]}
        >
          <meshStandardMaterial 
            color={['#FFD700', '#FF6B35', '#4A90E2', '#9370DB', '#32CD32'][i]} 
            transparent 
            opacity={0.6}
            emissive={['#FFD700', '#FF6B35', '#4A90E2', '#9370DB', '#32CD32'][i]}
            emissiveIntensity={0.3}
          />
        </Sphere>
      ))}
    </group>
  );
};

export default CreativeMeetingRoom;