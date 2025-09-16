import React, { useState, useRef, useEffect } from 'react';
import { Box, Plane, Text, Sphere, Ring, Cylinder } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import ArtUpload from '../ArtUpload';

const PersonalGallery = ({ artistFriend, position = [0, 0, 0], onUploadSuccess }) => {
  const [selectedArt, setSelectedArt] = useState(0);
  const [realArtwork, setRealArtwork] = useState([]);
  const [loading, setLoading] = useState(true);
  const galleryRef = useRef();
  
  // Fetch real artwork from backend
  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/suites/${artistFriend.id}/artworks`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const artwork = await response.json();
          setRealArtwork(artwork);
        }
      } catch (error) {
        console.error('Failed to fetch artwork:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (artistFriend.id) {
      fetchArtwork();
    }
  }, [artistFriend.id]);
  
  const handleUploadSuccess = (newArtwork) => {
    setRealArtwork(prev => [...prev, newArtwork]);
    if (onUploadSuccess) {
      onUploadSuccess(newArtwork);
    }
  };
  
  // Mock personal art collection for fallback
  const personalArtwork = {
    'suite-1': [ 
      { title: "Sunrise Memories", type: "painting", color: "#FFB6C1", description: "That morning we watched the sunrise together" },
      { title: "Friendship Portrait", type: "painting", color: "#FF69B4", description: "A painting of our group from 2003" },
      { title: "Abstract Dreams", type: "painting", color: "#DDA0DD", description: "Inspired by our late-night conversations" }
    ],
    'suite-2': [ 
      { title: "Old Times Blues", type: "music", color: "#87CEEB", description: "A song about missing the good old days" },
      { title: "Reunion Melody", type: "music", color: "#4169E1", description: "Hopeful tune about reconnecting" },
      { title: "Youth Symphony", type: "music", color: "#1E90FF", description: "Orchestral piece about our adventures" }
    ],
    'suite-3': [ 
      { title: "Street Art Series", type: "photo", color: "#98FB98", description: "Photos from our urban exploration days" },
      { title: "Portrait Collection", type: "photo", color: "#32CD32", description: "Black and white portraits of the group" },
      { title: "Nature Escapes", type: "photo", color: "#00FF7F", description: "Our hiking trips documented" }
    ],
    'suite-4': [ 
      { title: "Friends Forever", type: "writing", color: "#DDA0DD", description: "Short stories based on our experiences" },
      { title: "Memory Lane", type: "writing", color: "#9370DB", description: "Poetry about growing up together" },
      { title: "The Artist Circle", type: "writing", color: "#8A2BE2", description: "Novel inspired by our friendship" }
    ],
    'suite-5': [ 
      { title: "Unity Sculpture", type: "sculpture", color: "#FFA07A", description: "Abstract piece representing our bond" },
      { title: "Memory Vessels", type: "sculpture", color: "#FF6347", description: "Clay pots holding shared memories" },
      { title: "Friendship Totem", type: "sculpture", color: "#CD5C5C", description: "Wooden sculpture of our group" }
    ],
    'suite-6': [ 
      { title: "Digital Nostalgia", type: "digital", color: "#AFEEEE", description: "Pixel art of our favorite hangout spots" },
      { title: "VR Memories", type: "digital", color: "#20B2AA", description: "3D recreation of our old art studio" },
      { title: "Glitch Friends", type: "digital", color: "#48D1CC", description: "Stylized digital portraits of everyone" }
    ]
  };

  // Use real artwork if available, fall back to mock data
  const artwork = realArtwork.length > 0 ? realArtwork.map(art => ({
    title: art.title,
    type: art.type,
    color: getColorForType(art.type),
    description: art.description || 'No description available',
    url: art.file_url,
    likes: art.likes,
    views: art.views
  })) : personalArtwork[artistFriend.id] || [];
  
  const currentPiece = artwork[selectedArt] || {};
  
  function getColorForType(type) {
    const colorMap = {
      painting: '#FF69B4',
      music: '#87CEEB',
      photo: '#98FB98',
      writing: '#DDA0DD',
      sculpture: '#FFA07A'
    };
    return colorMap[type] || '#FFD700';
  }

  useFrame((state) => {
    if (galleryRef.current) {
      galleryRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
    }
  });

  const ArtworkDisplay = ({ piece, index }) => {
    const isSelected = index === selectedArt;
    
    const renderArtContent = () => {
      switch (piece.type) {
        case 'painting':
          return (
            <group>
              <Plane args={[2, 1.5]} position={[0, 0, 0.02]}>
                <meshStandardMaterial 
                  color={piece.color}
                  roughness={0.4}
                  metalness={0.1}
                />
              </Plane>
              {/* Paint texture effect */}
              <Box args={[0.2, 1, 0.01]} position={[-0.6, 0, 0.03]} rotation={[0, 0, 0.2]}>
                <meshStandardMaterial color="#FFD700" transparent opacity={0.8} />
              </Box>
              <Box args={[0.3, 0.7, 0.01]} position={[0.5, -0.1, 0.03]} rotation={[0, 0, -0.3]}>
                <meshStandardMaterial color="#FF6347" transparent opacity={0.6} />
              </Box>
            </group>
          );
        
        case 'music':
          return (
            <group>
              <Plane args={[2, 1.5]} position={[0, 0, 0.02]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.1} />
              </Plane>
              {/* Musical notes effect */}
              <Text position={[-0.5, 0.3, 0.03]} fontSize={0.2} color={piece.color}>♪</Text>
              <Text position={[0, -0.2, 0.03]} fontSize={0.15} color={piece.color}>♫</Text>
              <Text position={[0.4, 0.4, 0.03]} fontSize={0.18} color={piece.color}>♬</Text>
              {/* Waveform */}
              {Array.from({ length: 15 }, (_, i) => (
                <Box 
                  key={i}
                  args={[0.06, Math.random() * 0.8 + 0.2, 0.01]} 
                  position={[-0.6 + i * 0.08, -0.5, 0.03]}
                >
                  <meshStandardMaterial color={piece.color} emissive={piece.color} emissiveIntensity={0.3} />
                </Box>
              ))}
            </group>
          );
        
        case 'photo':
          return (
            <group>
              <Plane args={[2, 1.5]} position={[0, 0, 0.02]}>
                <meshStandardMaterial color="#f8f8f8" roughness={0.2} />
              </Plane>
              {/* Photo frame effect */}
              <Box args={[2.1, 1.6, 0.01]} position={[0, 0, 0.01]}>
                <meshStandardMaterial color="#2c2c2c" />
              </Box>
              {/* Photo content suggestion */}
              <Box args={[1.5, 1, 0.005]} position={[0, 0, 0.025]}>
                <meshStandardMaterial color={piece.color} transparent opacity={0.7} />
              </Box>
            </group>
          );
        
        case 'writing':
          return (
            <group>
              <Plane args={[2, 1.5]} position={[0, 0, 0.02]}>
                <meshStandardMaterial color="#fff8dc" roughness={0.8} />
              </Plane>
              {/* Text lines */}
              {Array.from({ length: 10 }, (_, i) => (
                <Box 
                  key={i}
                  args={[1.6 - (i % 3) * 0.2, 0.03, 0.005]} 
                  position={[0, 0.6 - i * 0.12, 0.025]}
                >
                  <meshStandardMaterial color="#333333" />
                </Box>
              ))}
            </group>
          );
        
        case 'sculpture':
          return (
            <group>
              <Sphere args={[0.3]} position={[0, 0.2, 0.3]}>
                <meshStandardMaterial color={piece.color} roughness={0.3} metalness={0.7} />
              </Sphere>
              <Cylinder args={[0.4, 0.2, 0.3]} position={[0, -0.2, 0.3]}>
                <meshStandardMaterial color={piece.color} roughness={0.4} metalness={0.6} />
              </Cylinder>
            </group>
          );
        
        case 'digital':
          return (
            <group>
              <Plane args={[2, 1.5]} position={[0, 0, 0.02]}>
                <meshStandardMaterial color="#000000" />
              </Plane>
              {/* Pixel grid effect */}
              {Array.from({ length: 64 }, (_, i) => (
                <Box 
                  key={i}
                  args={[0.1, 0.1, 0.01]} 
                  position={[
                    -0.8 + (i % 8) * 0.2,
                    0.6 - Math.floor(i / 8) * 0.15,
                    0.03
                  ]}
                >
                  <meshStandardMaterial 
                    color={Math.random() > 0.7 ? piece.color : '#333333'}
                    emissive={Math.random() > 0.8 ? piece.color : '#000000'}
                    emissiveIntensity={0.5}
                  />
                </Box>
              ))}
            </group>
          );
        
        default:
          return null;
      }
    };

    return (
      <group 
        position={[index * 3 - (artwork.length - 1) * 1.5, 1.5, -2]}
        onClick={() => setSelectedArt(index)}
      >
        {/* Frame */}
        <Box args={[2.3, 1.8, 0.1]} castShadow>
          <meshStandardMaterial 
            color={isSelected ? "#FFD700" : "#8B4513"}
            roughness={0.3} 
            metalness={isSelected ? 0.7 : 0.1}
          />
        </Box>
        
        {/* Artwork Content */}
        {renderArtContent()}
        
        {/* Selection highlight */}
        {isSelected && (
          <Ring args={[1.2, 1.3, 32]} position={[0, 0, 0.15]} rotation={[0, 0, 0]}>
            <meshStandardMaterial 
              color="#FFD700"
              transparent 
              opacity={0.6}
              emissive="#FFD700"
              emissiveIntensity={0.3}
            />
          </Ring>
        )}
        
        {/* Title below artwork */}
        <Text
          position={[0, -1.2, 0]}
          fontSize={0.08}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          {piece.title}
        </Text>
      </group>
    );
  };

  const PersonalSpace = () => (
    <group>
      {/* Personal room walls */}
      <Box args={[8, 4, 8]} position={[0, 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial 
          color={artistFriend.personalColor}
          transparent
          opacity={0.1}
        />
      </Box>
      
      {/* Personal message from friend */}
      <group position={[0, 3.5, 3.8]}>
        <Box args={[6, 1, 0.1]} castShadow>
          <meshStandardMaterial color="#2c2c2c" />
        </Box>
        <Text
          position={[0, 0.2, 0.06]}
          fontSize={0.12}
          color={artistFriend.personalColor}
          anchorX="center"
          anchorY="middle"
        >
          Welcome to {artistFriend.name}'s Space
        </Text>
        <Text
          position={[0, -0.2, 0.06]}
          fontSize={0.08}
          color="#CCCCCC"
          anchorX="center"
          anchorY="middle"
          maxWidth={5}
        >
          "{artistFriend.bio}"
        </Text>
      </group>
      
      {/* Cozy seating area */}
      <Box args={[2, 0.8, 1.5]} position={[3, 0.4, 2]} castShadow>
        <meshStandardMaterial color={artistFriend.doorColor} roughness={0.7} />
      </Box>
      
      {/* Personal work station */}
      <Box args={[2, 0.1, 1]} position={[-3, 0.8, 2]} castShadow>
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </Box>
    </group>
  );

  return (
    <group position={position} ref={galleryRef}>
      {/* Personal Space */}
      <PersonalSpace />
      
      {/* Art Gallery Wall */}
      {artwork.map((piece, index) => (
        <ArtworkDisplay key={index} piece={piece} index={index} />
      ))}
      
      {/* Current Artwork Description */}
      {currentPiece.title && (
        <group position={[0, 0.5, -2]}>
          <Box args={[4, 0.8, 0.1]} castShadow>
            <meshStandardMaterial color="#1a1a1a" transparent opacity={0.8} />
          </Box>
          <Text
            position={[0, 0.15, 0.06]}
            fontSize={0.1}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
          >
            {currentPiece.title}
          </Text>
          <Text
            position={[0, -0.15, 0.06]}
            fontSize={0.06}
            color="#CCCCCC"
            anchorX="center"
            anchorY="middle"
            maxWidth={3.5}
          >
            {currentPiece.description}
          </Text>
        </group>
      )}
      
      {/* Personal lighting */}
      <pointLight 
        position={[0, 3, 0]} 
        intensity={0.6} 
        color={artistFriend.personalColor}
        distance={12}
        decay={2}
      />
      
      {/* Gallery spotlights */}
      {artwork.map((_, index) => (
        <pointLight
          key={index}
          position={[index * 3 - (artwork.length - 1) * 1.5, 2.5, -1]}
          intensity={selectedArt === index ? 0.8 : 0.4}
          color="#FFFFFF"
          distance={6}
          decay={2}
        />
      ))}
    </group>
  );
};

export default PersonalGallery;