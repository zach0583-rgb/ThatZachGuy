import React, { useState, useRef } from 'react';
import { Box, Plane, Text, Sphere, Ring } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ArtSharingSystem = ({ position = [0, 0, 0] }) => {
  const [activeArtwork, setActiveArtwork] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const displayRef = useRef();
  const audioVisualizerRef = useRef();

  // Mock art data
  const artworks = [
    { 
      id: 1, 
      title: "Pacific Dreams", 
      artist: "River Artist", 
      type: "painting",
      color: "#4A90E2",
      likes: 12,
      comments: 3
    },
    { 
      id: 2, 
      title: "Forest Symphony", 
      artist: "Nature Composer", 
      type: "music",
      color: "#32CD32",
      duration: "3:45",
      likes: 8,
      comments: 5
    },
    { 
      id: 3, 
      title: "Twin Peaks Story", 
      artist: "Mystery Writer", 
      type: "writing",
      color: "#9370DB",
      wordCount: 2847,
      likes: 15,
      comments: 7
    },
    { 
      id: 4, 
      title: "Digital Sculpture", 
      artist: "3D Creator", 
      type: "sculpture",
      color: "#FF6B35",
      polygons: 15420,
      likes: 20,
      comments: 4
    }
  ];

  const currentArt = artworks[activeArtwork];

  useFrame((state) => {
    if (displayRef.current) {
      displayRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
    
    if (audioVisualizerRef.current && isPlaying) {
      audioVisualizerRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.3;
    }
  });

  const ArtworkDisplay = ({ artwork }) => {
    const renderArtworkContent = () => {
      switch (artwork.type) {
        case 'painting':
          return (
            <group>
              <Plane args={[2, 1.5]} position={[0, 0, 0.02]}>
                <meshStandardMaterial 
                  color={artwork.color}
                  roughness={0.3}
                  metalness={0.1}
                />
              </Plane>
              {/* Paint brush strokes effect */}
              <Box args={[0.3, 1.2, 0.01]} position={[-0.5, 0, 0.03]} rotation={[0, 0, 0.3]}>
                <meshStandardMaterial color="#FFD700" transparent opacity={0.7} />
              </Box>
              <Box args={[0.2, 0.8, 0.01]} position={[0.4, -0.2, 0.03]} rotation={[0, 0, -0.2]}>
                <meshStandardMaterial color="#FF6B35" transparent opacity={0.7} />
              </Box>
            </group>
          );
        
        case 'music':
          return (
            <group ref={audioVisualizerRef}>
              <Plane args={[2, 1.5]} position={[0, 0, 0.02]}>
                <meshStandardMaterial 
                  color="#1a1a1a"
                  roughness={0.1}
                />
              </Plane>
              {/* Audio waveform visualization */}
              {Array.from({ length: 20 }, (_, i) => (
                <Box 
                  key={i}
                  args={[0.08, Math.random() * 1 + 0.2, 0.01]} 
                  position={[-0.8 + i * 0.08, 0, 0.03]}
                >
                  <meshStandardMaterial 
                    color={artwork.color}
                    emissive={artwork.color}
                    emissiveIntensity={0.5}
                  />
                </Box>
              ))}
            </group>
          );
        
        case 'writing':
          return (
            <group>
              <Plane args={[2, 1.5]} position={[0, 0, 0.02]}>
                <meshStandardMaterial 
                  color="#f8f8f8"
                  roughness={0.8}
                />
              </Plane>
              {/* Text lines effect */}
              {Array.from({ length: 8 }, (_, i) => (
                <Box 
                  key={i}
                  args={[1.6, 0.05, 0.005]} 
                  position={[0, 0.5 - i * 0.15, 0.03]}
                >
                  <meshStandardMaterial color="#333333" />
                </Box>
              ))}
            </group>
          );
        
        case 'sculpture':
          return (
            <group>
              <Sphere args={[0.4]} position={[0, 0.2, 0.3]}>
                <meshStandardMaterial 
                  color={artwork.color}
                  roughness={0.2}
                  metalness={0.8}
                />
              </Sphere>
              <Box args={[0.6, 0.3, 0.6]} position={[0, -0.3, 0.3]}>
                <meshStandardMaterial 
                  color={artwork.color}
                  roughness={0.3}
                  metalness={0.7}
                />
              </Box>
            </group>
          );
        
        default:
          return null;
      }
    };

    return (
      <group ref={displayRef}>
        {/* Display Frame */}
        <Box args={[2.5, 2, 0.1]} position={[0, 0, 0]} castShadow>
          <meshStandardMaterial color="#2c2c2c" roughness={0.3} metalness={0.7} />
        </Box>
        
        {/* Artwork Content */}
        {renderArtworkContent()}
        
        {/* Interaction glow */}
        <Ring args={[1.3, 1.4, 32]} position={[0, 0, -0.05]} rotation={[0, 0, 0]}>
          <meshStandardMaterial 
            color={artwork.color}
            transparent 
            opacity={0.3}
            emissive={artwork.color}
            emissiveIntensity={0.2}
          />
        </Ring>
      </group>
    );
  };

  const InfoPanel = ({ artwork }) => (
    <group position={[0, -1.5, 0]}>
      <Box args={[3, 0.8, 0.05]} castShadow>
        <meshStandardMaterial color="#1a1a1a" transparent opacity={0.8} />
      </Box>
      
      <Text
        position={[0, 0.2, 0.03]}
        fontSize={0.12}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        {artwork.title}
      </Text>
      
      <Text
        position={[0, 0, 0.03]}
        fontSize={0.08}
        color="#CCCCCC"
        anchorX="center"
        anchorY="middle"
      >
        by {artwork.artist}
      </Text>
      
      <Text
        position={[0, -0.2, 0.03]}
        fontSize={0.06}
        color="#999999"
        anchorX="center"
        anchorY="middle"
      >
        ❤️ {artwork.likes} 💬 {artwork.comments} 
        {artwork.type === 'music' && ` | ⏱️ ${artwork.duration}`}
        {artwork.type === 'writing' && ` | 📝 ${artwork.wordCount} words`}
        {artwork.type === 'sculpture' && ` | 🔺 ${artwork.polygons} polygons`}
      </Text>
    </group>
  );

  const NavigationControls = () => (
    <group position={[0, -2.5, 0]}>
      {/* Previous Button */}
      <Box 
        args={[0.5, 0.3, 0.1]} 
        position={[-1, 0, 0]} 
        castShadow
        onClick={() => setActiveArtwork((prev) => (prev - 1 + artworks.length) % artworks.length)}
      >
        <meshStandardMaterial color="#4A90E2" />
      </Box>
      <Text
        position={[-1, 0, 0.06]}
        fontSize={0.08}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        ◀
      </Text>
      
      {/* Play/Pause Button (for music) */}
      {currentArt.type === 'music' && (
        <Box 
          args={[0.5, 0.3, 0.1]} 
          position={[0, 0, 0]} 
          castShadow
          onClick={() => setIsPlaying(!isPlaying)}
        >
          <meshStandardMaterial color="#32CD32" />
        </Box>
      )}
      <Text
        position={[0, 0, 0.06]}
        fontSize={0.08}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        {currentArt.type === 'music' ? (isPlaying ? '⏸️' : '▶️') : '👁️'}
      </Text>
      
      {/* Next Button */}
      <Box 
        args={[0.5, 0.3, 0.1]} 
        position={[1, 0, 0]} 
        castShadow
        onClick={() => setActiveArtwork((prev) => (prev + 1) % artworks.length)}
      >
        <meshStandardMaterial color="#4A90E2" />
      </Box>
      <Text
        position={[1, 0, 0.06]}
        fontSize={0.08}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        ▶
      </Text>
    </group>
  );

  return (
    <group position={position}>
      {/* Main Display System */}
      <ArtworkDisplay artwork={currentArt} />
      
      {/* Info Panel */}
      <InfoPanel artwork={currentArt} />
      
      {/* Navigation Controls */}
      <NavigationControls />
      
      {/* Gallery Lighting */}
      <pointLight 
        position={[0, 2, 2]} 
        intensity={0.8} 
        color="#FFFFFF"
        distance={8}
        decay={2}
      />
      <pointLight 
        position={[2, 1, 1]} 
        intensity={0.3} 
        color={currentArt.color}
        distance={6}
        decay={2}
      />
      
      {/* Type indicator lights */}
      <group position={[0, 2.5, 0]}>
        <Sphere args={[0.1]} position={[-1, 0, 0]}>
          <meshStandardMaterial 
            color={currentArt.type === 'painting' ? '#4A90E2' : '#666666'}
            emissive={currentArt.type === 'painting' ? '#4A90E2' : '#000000'}
            emissiveIntensity={currentArt.type === 'painting' ? 0.5 : 0}
          />
        </Sphere>
        <Sphere args={[0.1]} position={[-0.3, 0, 0]}>
          <meshStandardMaterial 
            color={currentArt.type === 'music' ? '#32CD32' : '#666666'}
            emissive={currentArt.type === 'music' ? '#32CD32' : '#000000'}
            emissiveIntensity={currentArt.type === 'music' ? 0.5 : 0}
          />
        </Sphere>
        <Sphere args={[0.1]} position={[0.3, 0, 0]}>
          <meshStandardMaterial 
            color={currentArt.type === 'writing' ? '#9370DB' : '#666666'}
            emissive={currentArt.type === 'writing' ? '#9370DB' : '#000000'}
            emissiveIntensity={currentArt.type === 'writing' ? 0.5 : 0}
          />
        </Sphere>
        <Sphere args={[0.1]} position={[1, 0, 0]}>
          <meshStandardMaterial 
            color={currentArt.type === 'sculpture' ? '#FF6B35' : '#666666'}
            emissive={currentArt.type === 'sculpture' ? '#FF6B35' : '#000000'}
            emissiveIntensity={currentArt.type === 'sculpture' ? 0.5 : 0}
          />
        </Sphere>
      </group>
    </group>
  );
};

export default ArtSharingSystem;