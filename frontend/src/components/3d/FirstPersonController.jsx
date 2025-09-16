import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useKeyboardControls, PointerLockControls } from '@react-three/drei';
import { RigidBody, useRapier } from '@react-three/cannon';
import * as THREE from 'three';

const FirstPersonController = () => {
  const playerRef = useRef();
  const { camera, gl } = useThree();
  const [, getKeys] = useKeyboardControls();
  
  const velocity = useRef([0, 0, 0]);
  const direction = useRef(new THREE.Vector3());
  const frontVector = useRef(new THREE.Vector3());
  const sideVector = useRef(new THREE.Vector3());
  const speed = useRef(5);
  const isOnGround = useRef(false);

  // Set initial camera position
  useEffect(() => {
    camera.position.set(0, 2, 8);
  }, [camera]);

  useFrame((state, delta) => {
    const { forward, backward, leftward, rightward, jump, run } = getKeys();
    
    // Get current camera direction
    camera.getWorldDirection(direction.current);
    
    // Calculate movement vectors
    frontVector.current.set(0, 0, Number(backward) - Number(forward));
    sideVector.current.set(Number(leftward) - Number(rightward), 0, 0);
    
    // Combine and normalize movement
    direction.current
      .subVectors(frontVector.current, sideVector.current)
      .normalize()
      .multiplyScalar(run ? speed.current * 1.5 : speed.current)
      .applyEuler(camera.rotation);

    // Apply movement to camera
    if (forward || backward || leftward || rightward) {
      camera.position.x += direction.current.x * delta;
      camera.position.z += direction.current.z * delta;
    }

    // Simple gravity and ground collision
    if (camera.position.y > 1.6) {
      camera.position.y -= 9.8 * delta; // Gravity
    } else {
      camera.position.y = 1.6; // Ground level (eye height)
      isOnGround.current = true;
    }

    // Jump
    if (jump && isOnGround.current) {
      camera.position.y += 0.5;
      isOnGround.current = false;
    }

    // Prevent going through cabin walls (simple collision)
    const cabinBounds = {
      minX: -5, maxX: 5,
      minZ: -4, maxZ: 4
    };
    
    if (camera.position.x > cabinBounds.minX && 
        camera.position.x < cabinBounds.maxX &&
        camera.position.z > cabinBounds.minZ && 
        camera.position.z < cabinBounds.maxZ) {
      // Push player out of cabin
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

    // Atmospheric effects based on position
    const distanceFromCabin = Math.sqrt(
      camera.position.x * camera.position.x + 
      camera.position.z * camera.position.z
    );
    
    // Add subtle head bob when walking
    if (forward || backward || leftward || rightward) {
      const bobIntensity = 0.02;
      const bobSpeed = 10;
      camera.position.y += Math.sin(state.clock.elapsedTime * bobSpeed) * bobIntensity;
    }
  });

  return (
    <>
      <PointerLockControls />
    </>
  );
};

export default FirstPersonController;