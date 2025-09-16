import React, { useState, useRef } from 'react';
import { Box, Cylinder, Plane, Text, Sphere, Ring } from '@react-three/drei';
import { useBox } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import PersonalGallery from './PersonalGallery';

const ArtistSuites = ({ position = [0, 5, 0] }) => {
  const [activeSuite, setActiveSuite] = useState(null);
  
  // Personal artist friends data - this would come from your database
  const artistFriends = [
    {
      id: 'suite-1',
      name: 'Sarah Mitchell',
      medium: 'Painter',
      roomKey: 'PAINT-DREAMS-2024',
      doorColor: '#FF69B4',
      personalColor: '#FFB6C1',
      lastSeen: '3 days ago',
      artCount: 12,
      bio: 'Remember our late-night painting sessions?',
      isOnline: false
    },
    {
      id: 'suite-2', 
      name: 'Marcus Rodriguez',
      medium: 'Musician',
      roomKey: 'GUITAR-HERO-2024',
      doorColor: '#4169E1',
      personalColor: '#87CEEB',
      lastSeen: '1 week ago',
      artCount: 8,
      bio: 'Still writing songs about our adventures',
      isOnline: true
    },
    {
      id: 'suite-3',
      name: 'Elena Kowalski', 
      medium: 'Photographer',
      roomKey: 'LENS-MAGIC-2024',
      doorColor: '#32CD32',
      personalColor: '#98FB98',
      lastSeen: 'online now',
      artCount: 24,
      bio: 'Capturing moments like we used to',
      isOnline: true
    },
    {
      id: 'suite-4',
      name: 'David Chen',
      medium: 'Writer',
      roomKey: 'STORY-TELLER-2024', 
      doorColor: '#9370DB',
      personalColor: '#DDA0DD',
      lastSeen: '2 days ago',
      artCount: 6,
      bio: 'Our stories live on in my words',
      isOnline: false
    },
    {
      id: 'suite-5',
      name: 'Isabella Romano',
      medium: 'Sculptor',
      roomKey: 'CLAY-DREAMS-2024',
      doorColor: '#FF6347',
      personalColor: '#FFA07A',
      lastSeen: '5 days ago', 
      artCount: 15,
      bio: 'Shaping memories into art',
      isOnline: false
    },
    {
      id: 'suite-6',
      name: 'James Thompson',
      medium: 'Digital Artist',
      roomKey: 'PIXEL-ARTIST-2024',
      doorColor: '#20B2AA',
      personalColor: '#AFEEEE',
      lastSeen: 'yesterday',
      artCount: 31,
      bio: 'Digital worlds, real friendships',
      isOnline: false
    }
  ];

  const SecondFloor = () => {
    const [floorRef] = useBox(() => ({ 
      args: [20, 0.5, 15], 
      position: [position[0], position[1], position[2]],
      type: 'Static'
    }));

    return (
      <group>
        {/* Second Floor Platform */}
        <Box ref={floorRef} args={[20, 0.5, 15]} position={[0, 0, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#8B4513" roughness={0.7} />
        </Box>
        
        {/* Floor Railings */}
        <Box args={[20, 0.8, 0.2]} position={[0, 0.6, 7.4]} castShadow>
          <meshStandardMaterial color="#654321" />
        </Box>
        <Box args={[20, 0.8, 0.2]} position={[0, 0.6, -7.4]} castShadow>
          <meshStandardMaterial color="#654321" />
        </Box>
        <Box args={[0.2, 0.8, 15]} position={[9.9, 0.6, 0]} castShadow>
          <meshStandardMaterial color="#654321" />
        </Box>
        <Box args={[0.2, 0.8, 15]} position={[-9.9, 0.6, 0]} castShadow>
          <meshStandardMaterial color="#654321" />
        </Box>
        
        {/* Central Welcome Area */}
        <group position={[0, 1.5, 0]}>
          <Text
            position={[0, 2, 0]}
            fontSize={0.4}
            color="#FFD700"
            anchorX="center"
            anchorY="middle"
          >
            💕 Artist Friends Reunion 💕
          </Text>
          <Text
            position={[0, 1.4, 0]}
            fontSize={0.25}
            color="#E0E0E0"
            anchorX="center"
            anchorY="middle"
          >
            "Where old friends create new memories"
          </Text>
        </group>
      </group>
    );
  };

  const ArtistSuite = ({ friend, position: suitePosition, index }) => {
    const [suiteRef] = useBox(() => ({ 
      args: [5, 3, 6], 
      position: [suitePosition[0], suitePosition[1] + 1.5, suitePosition[2]],
      type: 'Static'
    }));

    const doorRef = useRef();
    const nameSignRef = useRef();

    useFrame((state) => {
      if (doorRef.current && friend.isOnline) {
        doorRef.current.material.emissiveIntensity = 0.2 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      }
      if (nameSignRef.current) {
        nameSignRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
      }
    });

    return (
      <group position={suitePosition}>
        {/* Suite Walls */}
        <Box ref={suiteRef} args={[5, 3, 6]} position={[0, 1.5, 0]} castShadow receiveShadow>
          <meshStandardMaterial 
            color="#F5F5DC" 
            roughness={0.8}
            metalness={0.1}
          />
        </Box>
        
        {/* Personal Door with friend's color */}
        <Box 
          ref={doorRef}
          args={[1.5, 2.5, 0.2]} 
          position={[0, 1.25, 3.1]} 
          castShadow
          onClick={() => setActiveSuite(friend.id)}
        >
          <meshStandardMaterial 
            color={friend.doorColor}
            roughness={0.3}
            metalness={0.2}
            emissive={friend.isOnline ? friend.doorColor : '#000000'}
            emissiveIntensity={friend.isOnline ? 0.2 : 0}
          />
        </Box>
        
        {/* Door Handle */}
        <Cylinder args={[0.05, 0.05, 0.2]} position={[0.5, 1.25, 3.2]} rotation={[0, 0, Math.PI/2]} castShadow>
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </Cylinder>
        
        {/* Personal Name Sign */}
        <group ref={nameSignRef} position={[0, 2.8, 3.3]}>
          <Box args={[3, 0.6, 0.1]} castShadow>
            <meshStandardMaterial color="#2C2C2C" />
          </Box>
          <Text
            position={[0, 0.1, 0.06]}
            fontSize={0.15}
            color={friend.personalColor}
            anchorX="center"
            anchorY="middle"
          >
            {friend.name}
          </Text>
          <Text
            position={[0, -0.15, 0.06]}
            fontSize={0.1}
            color="#CCCCCC"
            anchorX="center"
            anchorY="middle"
          >
            {friend.medium} • {friend.artCount} works
          </Text>
        </group>
        
        {/* Room Key Display */}
        <group position={[0, 0.3, 3.5]}>
          <Box args={[2, 0.3, 0.05]} castShadow>
            <meshStandardMaterial color="#1a1a1a" />
          </Box>
          <Text
            position={[0, 0, 0.03]}
            fontSize={0.08}
            color="#FFD700"
            anchorX="center"
            anchorY="middle"
          >
            🗝️ Key: {friend.roomKey}
          </Text>
        </group>
        
        {/* Window with warm glow */}
        <Box args={[2, 1.5, 0.1]} position={[2.55, 2, 0]} castShadow>
          <meshStandardMaterial 
            color={friend.personalColor}
            transparent 
            opacity={0.6}
            emissive={friend.personalColor}
            emissiveIntensity={0.3}
          />
        </Box>
        
        {/* Personal Room Lighting */}
        <pointLight 
          position={[0, 2.5, 0]} 
          intensity={0.5} 
          color={friend.personalColor}
          distance={8}
          decay={2}
        />
        
        {/* Online Status Indicator */}
        {friend.isOnline && (
          <Sphere args={[0.1]} position={[1.2, 3.5, 3.2]}>
            <meshStandardMaterial 
              color="#00FF00"
              emissive="#00FF00"
              emissiveIntensity={0.5}
            />
          </Sphere>
        )}
        
        {/* Last Seen Indicator */}
        <Text
          position={[0, 0.8, 3.3]}
          fontSize={0.06}
          color={friend.isOnline ? "#00FF00" : "#999999"}
          anchorX="center"
          anchorY="middle"
        >
          {friend.isOnline ? "🟢 Online Now" : `💤 ${friend.lastSeen}`}
        </Text>
        
        {/* Personal Bio Quote */}
        <Text
          position={[0, -0.2, 3.3]}
          fontSize={0.05}
          color="#666666"
          anchorX="center"
          anchorY="middle"
          maxWidth={4}
        >
          "{friend.bio}"
        </Text>
      </group>
    );
  };

  const Staircase = () => {
    return (
      <group position={[12, 0, 0]}>
        {/* Staircase structure */}
        {Array.from({ length: 10 }, (_, i) => (
          <Box 
            key={i}
            args={[2, 0.2, 0.8]} 
            position={[0, i * 0.5, -i * 0.3]} 
            castShadow
          >
            <meshStandardMaterial color="#8B4513" roughness={0.8} />
          </Box>
        ))}
        
        {/* Handrail */}
        <Cylinder args={[0.05, 0.05, 6]} position={[0.8, 2.5, -1.5]} rotation={[0.5, 0, 0]} castShadow>
          <meshStandardMaterial color="#654321" />
        </Cylinder>
        
        {/* Staircase Sign */}
        <Text
          position={[0, 3, -3]}
          fontSize={0.2}
          color="#FFD700"
          anchorX="center"
          anchorY="middle"
        >
          🏠 Artist Suites
        </Text>
      </group>
    );
  };

  // Arrange suites in a hotel-like layout
  const suitePositions = [
    [-6, 0, -4],   // Suite 1 - Sarah (Painter)
    [-6, 0, 2],    // Suite 2 - Marcus (Musician) 
    [0, 0, -4],    // Suite 3 - Elena (Photographer)
    [0, 0, 2],     // Suite 4 - David (Writer)
    [6, 0, -4],    // Suite 5 - Isabella (Sculptor)
    [6, 0, 2]      // Suite 6 - James (Digital Artist)
  ];

  return (
    <group position={position}>
      {/* Second Floor Base */}
      <SecondFloor />
      
      {/* Individual Artist Suites */}
      {artistFriends.map((friend, index) => (
        <ArtistSuite
          key={friend.id}
          friend={friend}
          position={suitePositions[index]}
          index={index}
        />
      ))}
      
      {/* Staircase to Second Floor */}
      <Staircase />
      
      {/* Reunion Atmosphere Lighting */}
      <pointLight 
        position={[0, 3, 0]} 
        intensity={0.4} 
        color="#FFD700"
        distance={15}
        decay={2}
      />
      
      {/* Memory Lane Lighting */}
      <pointLight 
        position={[-6, 2, 0]} 
        intensity={0.3} 
        color="#FF69B4"
        distance={10}
        decay={2}
      />
      <pointLight 
        position={[6, 2, 0]} 
        intensity={0.3} 
        color="#4169E1"
        distance={10}
        decay={2}
      />
      
      {/* Floating Memory Orbs */}
      {Array.from({ length: 8 }, (_, i) => (
        <Sphere 
          key={i}
          args={[0.05]} 
          position={[
            (Math.random() - 0.5) * 15,
            2 + Math.random(),
            (Math.random() - 0.5) * 10
          ]}
        >
          <meshStandardMaterial 
            color={artistFriends[i % artistFriends.length]?.personalColor || '#FFD700'}
            transparent 
            opacity={0.7}
            emissive={artistFriends[i % artistFriends.length]?.personalColor || '#FFD700'}
            emissiveIntensity={0.4}
          />
        </Sphere>
      ))}
    </group>
  );
};

export default ArtistSuites;