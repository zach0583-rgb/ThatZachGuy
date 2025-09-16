import React, { useRef, useState } from 'react';
import { Box, Cylinder, Plane, Text, Ring, Sphere } from '@react-three/drei';
import { useBox } from '@react-three/cannon';
import * as THREE from 'three';
import ArtGallery from './ArtGallery';
import MusicStudio from './MusicStudio';
import CreativeMeetingRoom from './CreativeMeetingRoom';
import WritersNook from './WritersNook';

const ArtistColony = ({ position = [15, 0, 0] }) => {
  const [activeBuilding, setActiveBuilding] = useState(null);

  // Main Artist Hub Building
  const MainHub = () => {
    const [hubRef] = useBox(() => ({ 
      args: [12, 5, 10], 
      position: [position[0], position[1] + 2.5, position[2]],
      type: 'Static'
    }));

    return (
      <group>
        {/* Main Creative Hub Building */}
        <Box ref={hubRef} args={[12, 5, 10]} position={[0, 2.5, 0]} castShadow receiveShadow>
          <meshStandardMaterial 
            color="#8B4513" 
            roughness={0.8}
            metalness={0.1}
          />
        </Box>
        
        {/* Roof with skylights */}
        <Box args={[14, 0.5, 12]} position={[0, 5.2, 0]} castShadow>
          <meshStandardMaterial color="#2F4F2F" roughness={0.9} />
        </Box>
        
        {/* Skylights for natural artist lighting */}
        <Box args={[2, 0.1, 2]} position={[-3, 5.3, -2]} castShadow>
          <meshStandardMaterial 
            color="#E0F6FF" 
            transparent 
            opacity={0.7}
            emissive="#E0F6FF"
            emissiveIntensity={0.3}
          />
        </Box>
        <Box args={[2, 0.1, 2]} position={[3, 5.3, 2]} castShadow>
          <meshStandardMaterial 
            color="#E0F6FF" 
            transparent 
            opacity={0.7}
            emissive="#E0F6FF"
            emissiveIntensity={0.3}
          />
        </Box>
        
        {/* Large Artist Windows */}
        <Box args={[3, 3, 0.1]} position={[-6.1, 2.5, 0]} castShadow>
          <meshStandardMaterial 
            color="#FFD700" 
            transparent 
            opacity={0.4}
            emissive="#FFD700"
            emissiveIntensity={0.2}
          />
        </Box>
        <Box args={[3, 3, 0.1]} position={[6.1, 2.5, 0]} castShadow>
          <meshStandardMaterial 
            color="#FFD700" 
            transparent 
            opacity={0.4}
            emissive="#FFD700"
            emissiveIntensity={0.2}
          />
        </Box>
        
        {/* Creative Entrance Door */}
        <Box args={[2, 4, 0.2]} position={[0, 2, 5.1]} castShadow>
          <meshStandardMaterial color="#654321" />
        </Box>
        
        {/* Artist Colony Sign */}
        <group position={[0, 6.5, 0]}>
          <Box args={[8, 1.5, 0.3]} castShadow>
            <meshStandardMaterial color="#654321" />
          </Box>
          <Text
            position={[0, 0, 0.2]}
            fontSize={0.4}
            color="#FFD700"
            anchorX="center"
            anchorY="middle"
          >
            🎨 Artist Colony 🎵
          </Text>
          <Text
            position={[0, -0.5, 0.2]}
            fontSize={0.25}
            color="#E0E0E0"
            anchorX="center"
            anchorY="middle"
          >
            Creative Collaboration Hub
          </Text>
        </group>
        
        {/* Interior lighting for cozy artist atmosphere */}
        <pointLight 
          position={[-3, 3, -2]} 
          intensity={0.4} 
          color="#FF6B35"
          distance={10}
          decay={2}
        />
        <pointLight 
          position={[3, 3, 2]} 
          intensity={0.4} 
          color="#4A90E2"
          distance={10}
          decay={2}
        />
        <pointLight 
          position={[0, 4, 0]} 
          intensity={0.3} 
          color="#9370DB"
          distance={12}
          decay={2}
        />
      </group>
    );
  };

  // Music Studio Building
  const MusicStudioBuilding = () => {
    const [studioRef] = useBox(() => ({ 
      args: [8, 4, 8], 
      position: [position[0] - 15, position[1] + 2, position[2] + 10],
      type: 'Static'
    }));

    return (
      <group position={[-15, 0, 10]}>
        <Box ref={studioRef} args={[8, 4, 8]} position={[0, 2, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#4A4A4A" roughness={0.7} metalness={0.3} />
        </Box>
        
        {/* Soundproof padding visual */}
        <Box args={[7.8, 3.8, 7.8]} position={[0, 2, 0]}>
          <meshStandardMaterial color="#2C2C2C" roughness={0.9} />
        </Box>
        
        {/* Music Studio Sign */}
        <Text
          position={[0, 4.5, 4.2]}
          fontSize={0.3}
          color="#FFD700"
          anchorX="center"
          anchorY="middle"
        >
          🎵 Music Studio 🎧
        </Text>
        
        {/* Sound waves effect */}
        <Ring args={[3, 3.2, 16]} position={[0, 3, 4.1]} rotation={[0, 0, 0]}>
          <meshStandardMaterial 
            color="#4A90E2" 
            transparent 
            opacity={0.3}
            wireframe
          />
        </Ring>
        <Ring args={[4, 4.2, 16]} position={[0, 3, 4.1]} rotation={[0, 0, 0]}>
          <meshStandardMaterial 
            color="#9370DB" 
            transparent 
            opacity={0.2}
            wireframe
          />
        </Ring>
        
        {/* Studio lighting */}
        <pointLight 
          position={[0, 3, 0]} 
          intensity={0.5} 
          color="#9370DB"
          distance={8}
          decay={2}
        />
      </group>
    );
  };

  // Art Gallery Building
  const ArtGalleryBuilding = () => {
    const [galleryRef] = useBox(() => ({ 
      args: [10, 5, 6], 
      position: [position[0] + 15, position[1] + 2.5, position[2] - 8],
      type: 'Static'
    }));

    return (
      <group position={[15, 0, -8]}>
        <Box ref={galleryRef} args={[10, 5, 6]} position={[0, 2.5, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#F5F5F5" roughness={0.3} metalness={0.1} />
        </Box>
        
        {/* Gallery roof */}
        <Box args={[12, 0.5, 8]} position={[0, 5.2, 0]} castShadow>
          <meshStandardMaterial color="#2F4F2F" roughness={0.9} />
        </Box>
        
        {/* Large gallery windows */}
        <Box args={[8, 3, 0.1]} position={[0, 2.5, 3.1]} castShadow>
          <meshStandardMaterial 
            color="#FFFFFF" 
            transparent 
            opacity={0.8}
          />
        </Box>
        
        {/* Gallery Sign */}
        <Text
          position={[0, 5.8, 0]}
          fontSize={0.35}
          color="#333333"
          anchorX="center"
          anchorY="middle"
        >
          🖼️ Art Gallery 🎨
        </Text>
        
        {/* Gallery spotlights */}
        <pointLight 
          position={[-3, 4, 0]} 
          intensity={0.6} 
          color="#FFFFFF"
          distance={8}
          decay={2}
        />
        <pointLight 
          position={[3, 4, 0]} 
          intensity={0.6} 
          color="#FFFFFF"
          distance={8}
          decay={2}
        />
      </group>
    );
  };

  // Writer's Retreat Cabin
  const WritersRetreat = () => {
    const [writerRef] = useBox(() => ({ 
      args: [6, 3, 6], 
      position: [position[0] - 10, position[1] + 1.5, position[2] - 15],
      type: 'Static'
    }));

    return (
      <group position={[-10, 0, -15]}>
        <Box ref={writerRef} args={[6, 3, 6]} position={[0, 1.5, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#8B4513" roughness={0.8} />
        </Box>
        
        {/* Cozy cabin roof */}
        <Box args={[7, 0.4, 7]} position={[0, 3.2, 0]} castShadow>
          <meshStandardMaterial color="#654321" roughness={0.9} />
        </Box>
        
        {/* Writer's window */}
        <Box args={[2, 2, 0.1]} position={[0, 2, 3.1]} castShadow>
          <meshStandardMaterial 
            color="#FFE4B5" 
            transparent 
            opacity={0.6}
            emissive="#FFE4B5"
            emissiveIntensity={0.2}
          />
        </Box>
        
        {/* Writer's sign */}
        <Text
          position={[0, 4, 0]}
          fontSize={0.25}
          color="#8B4513"
          anchorX="center"
          anchorY="middle"
        >
          ✍️ Writer's Retreat 📚
        </Text>
        
        {/* Cozy reading light */}
        <pointLight 
          position={[0, 2.5, 0]} 
          intensity={0.4} 
          color="#FFE4B5"
          distance={6}
          decay={2}
        />
      </group>
    );
  };

  // Outdoor Amphitheater
  const Amphitheater = () => {
    return (
      <group position={[0, 0, -25]}>
        {/* Stage platform */}
        <Cylinder args={[6, 6, 0.5]} position={[0, 0.25, 0]} receiveShadow>
          <meshStandardMaterial color="#8B4513" roughness={0.8} />
        </Cylinder>
        
        {/* Amphitheater seating rings */}
        {[1, 2, 3].map((ring) => (
          <Ring 
            key={ring}
            args={[6 + ring * 2, 6.5 + ring * 2, 8]} 
            position={[0, 0.1, ring * 2]} 
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <meshStandardMaterial color="#654321" roughness={0.9} />
          </Ring>
        ))}
        
        {/* Performance lighting */}
        <pointLight 
          position={[0, 8, 0]} 
          intensity={0.8} 
          color="#FFFFFF"
          distance={20}
          decay={2}
        />
        <pointLight 
          position={[-5, 6, -5]} 
          intensity={0.4} 
          color="#FF6B35"
          distance={15}
          decay={2}
        />
        <pointLight 
          position={[5, 6, -5]} 
          intensity={0.4} 
          color="#4A90E2"
          distance={15}
          decay={2}
        />
        
        {/* Stage sign */}
        <Text
          position={[0, 3, -8]}
          fontSize={0.4}
          color="#FFD700"
          anchorX="center"
          anchorY="middle"
        >
          🎭 Performance Stage 🎪
        </Text>
      </group>
    );
  };

  return (
    <group position={position}>
      {/* Main Creative Hub */}
      <MainHub />
      
      {/* Specialized Buildings */}
      <MusicStudioBuilding />
      <ArtGalleryBuilding />
      <WritersRetreat />
      
      {/* Outdoor Performance Space */}
      <Amphitheater />
      
      {/* Connecting Pathways */}
      <Plane args={[50, 2]} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <meshStandardMaterial color="#8B7355" roughness={0.9} />
      </Plane>
      <Plane args={[2, 30]} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <meshStandardMaterial color="#8B7355" roughness={0.9} />
      </Plane>
      
      {/* Welcome Sculpture in the center */}
      <group position={[0, 0, 5]}>
        <Cylinder args={[0.3, 0.3, 3]} position={[0, 1.5, 0]} castShadow>
          <meshStandardMaterial color="#654321" />
        </Cylinder>
        <Sphere args={[1]} position={[0, 3.5, 0]} castShadow>
          <meshStandardMaterial 
            color="#9370DB" 
            roughness={0.3}
            metalness={0.7}
          />
        </Sphere>
        <Text
          position={[0, 5, 0]}
          fontSize={0.3}
          color="#FFD700"
          anchorX="center"
          anchorY="middle"
        >
          ✨ Creative Unity ✨
        </Text>
      </group>
      
      {/* Ambient artist colony lighting */}
      <pointLight 
        position={[0, 10, 0]} 
        intensity={0.3} 
        color="#9370DB"
        distance={30}
        decay={2}
      />
    </group>
  );
};

export default ArtistColony;