import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const MobileControls = ({ isMobile, isCustomizing }) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef();
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });
  const [isJoystickActive, setIsJoystickActive] = useState(false);
  const moveSpeed = useRef(3);
  const velocity = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (isMobile && !isCustomizing) {
      // Set up mobile-specific camera behavior
      camera.position.set(0, 1.8, 6);
      
      // Add touch event listeners for joystick
      const handleTouchStart = (e) => {
        if (e.touches.length === 1) {
          const touch = e.touches[0];
          const rect = gl.domElement.getBoundingClientRect();
          const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
          const y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
          
          // Check if touch is in joystick area (bottom-left)
          if (x < -0.3 && y < -0.3) {
            setIsJoystickActive(true);
            setJoystickPosition({ x: x + 0.6, y: y + 0.6 });
          }
        }
      };

      const handleTouchMove = (e) => {
        if (isJoystickActive && e.touches.length === 1) {
          const touch = e.touches[0];
          const rect = gl.domElement.getBoundingClientRect();
          const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
          const y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
          
          // Constrain to joystick area
          const clampedX = Math.max(-0.3, Math.min(0.3, x + 0.6));
          const clampedY = Math.max(-0.3, Math.min(0.3, y + 0.6));
          
          setJoystickPosition({ x: clampedX, y: clampedY });
        }
      };

      const handleTouchEnd = () => {
        setIsJoystickActive(false);
        setJoystickPosition({ x: 0, y: 0 });
      };

      gl.domElement.addEventListener('touchstart', handleTouchStart);
      gl.domElement.addEventListener('touchmove', handleTouchMove);
      gl.domElement.addEventListener('touchend', handleTouchEnd);

      return () => {
        gl.domElement.removeEventListener('touchstart', handleTouchStart);
        gl.domElement.removeEventListener('touchmove', handleTouchMove);
        gl.domElement.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isMobile, isCustomizing, gl.domElement, camera, isJoystickActive]);

  useFrame((state, delta) => {
    if (isMobile && !isCustomizing) {
      // Apply joystick movement
      if (isJoystickActive) {
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
        
        forward.y = 0;
        right.y = 0;
        forward.normalize();
        right.normalize();
        
        const moveVector = new THREE.Vector3();
        moveVector.addScaledVector(forward, -joystickPosition.y * moveSpeed.current * delta);
        moveVector.addScaledVector(right, joystickPosition.x * moveSpeed.current * delta);
        
        camera.position.add(moveVector);
        
        // Keep camera at reasonable height
        camera.position.y = Math.max(1.6, camera.position.y);
        
        // Simple collision with cabin
        const cabinBounds = { minX: -5, maxX: 5, minZ: -4, maxZ: 4 };
        if (camera.position.x > cabinBounds.minX && 
            camera.position.x < cabinBounds.maxX &&
            camera.position.z > cabinBounds.minZ && 
            camera.position.z < cabinBounds.maxZ) {
          // Push out of cabin
          const centerX = (cabinBounds.minX + cabinBounds.maxX) / 2;
          const centerZ = (cabinBounds.minZ + cabinBounds.maxZ) / 2;
          const dirX = camera.position.x - centerX;
          const dirZ = camera.position.z - centerZ;
          
          if (Math.abs(dirX) > Math.abs(dirZ)) {
            camera.position.x = dirX > 0 ? cabinBounds.maxX + 1 : cabinBounds.minX - 1;
          } else {
            camera.position.z = dirZ > 0 ? cabinBounds.maxZ + 1 : cabinBounds.minZ - 1;
          }
        }
      }
    }
  });

  if (isMobile && isCustomizing) {
    // Orbit controls for customization mode
    return (
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2}
        target={[0, 0, 0]}
      />
    );
  }

  if (isMobile && !isCustomizing) {
    // First-person touch controls for exploration
    return (
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={false}
        enableRotate={true}
        rotateSpeed={0.5}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI - Math.PI / 6}
        target={[camera.position.x, camera.position.y, camera.position.z - 1]}
      />
    );
  }

  // Desktop controls
  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={2}
      maxDistance={15}
      maxPolarAngle={Math.PI / 2}
    />
  );
};

export default MobileControls;