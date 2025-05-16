import * as THREE from "three";
import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useGameStateStore } from "../stores/useGameStateStore";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useFoodStore } from "../stores/useFoodStore";

const PLAYER_SPEED = 0.1;
const INTERACTION_DISTANCE = 3;

const Player = () => {
  const playerRef = useRef<THREE.Group>(null);
  const { gameState, enterBuilding } = useGameStateStore();
  const { 
    playerPosition, 
    setPlayerPosition, 
    playerData,
    increaseCaloriesBurned
  } = usePlayerStore();
  const { marketPosition, kitchenPosition } = useFoodStore();
  
  // Subscribe to keyboard controls
  const [, getKeys] = useKeyboardControls();
  
  // Reference direction for smooth movement
  const [moveDir] = useState(new THREE.Vector3());
  
  // Character's facing direction
  const [rotationY, setRotationY] = useState(0);

  // Handle movement and interactions in each frame
  useFrame(() => {
    if (gameState !== "playing" || !playerRef.current) return;
    
    const { forward, backward, leftward, rightward, interact } = getKeys();
    
    // Calculate movement direction
    moveDir.set(0, 0, 0);
    if (forward) moveDir.z -= 1;
    if (backward) moveDir.z += 1;
    if (leftward) moveDir.x -= 1;
    if (rightward) moveDir.x += 1;
    
    // Normalize movement direction
    if (moveDir.length() > 0) {
      moveDir.normalize();
      
      // Update rotation based on movement direction
      const targetRotation = Math.atan2(moveDir.x, moveDir.z);
      setRotationY(targetRotation);
      
      // Update position
      const newPosition = {
        x: playerPosition.x + moveDir.x * PLAYER_SPEED,
        y: playerPosition.y,
        z: playerPosition.z + moveDir.z * PLAYER_SPEED
      };
      
      // Apply the new position
      setPlayerPosition(newPosition);
      
      // Burn a small amount of calories when moving
      increaseCaloriesBurned(0.01);
    }
    
    // Handle interaction
    if (interact) {
      handleInteraction();
    }
  });
  
  // Handle interactions with buildings
  const handleInteraction = () => {
    // Calculate distance to market
    const distToMarket = new THREE.Vector3(
      playerPosition.x - marketPosition.x,
      0,
      playerPosition.z - marketPosition.z
    ).length();
    
    // Calculate distance to kitchen
    const distToKitchen = new THREE.Vector3(
      playerPosition.x - kitchenPosition.x,
      0, 
      playerPosition.z - kitchenPosition.z
    ).length();
    
    // Enter market if close enough
    if (distToMarket < INTERACTION_DISTANCE) {
      console.log("Entering market");
      enterBuilding("market");
      return;
    }
    
    // Enter kitchen if close enough
    if (distToKitchen < INTERACTION_DISTANCE) {
      console.log("Entering kitchen");
      enterBuilding("kitchen");
      return;
    }
  };
  
  // Update player reference position when playerPosition changes
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.position.x = playerPosition.x;
      playerRef.current.position.y = playerPosition.y;
      playerRef.current.position.z = playerPosition.z;
      playerRef.current.rotation.y = rotationY;
    }
  }, [playerPosition, rotationY]);
  
  return (
    <group ref={playerRef} position={[playerPosition.x, playerPosition.y, playerPosition.z]}>
      {/* Character body */}
      <mesh castShadow position={[0, 1, 0]}>
        <capsuleGeometry args={[0.5, 1, 4, 8]} />
        <meshStandardMaterial color={playerData?.gender === 'female' ? '#E38AAE' : '#6495ED'} />
      </mesh>
      
      {/* Character head */}
      <mesh castShadow position={[0, 2.1, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#F5DEB3" />
      </mesh>
      
      {/* Character eyes */}
      <mesh position={[0.15, 2.2, 0.3]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="black" />
      </mesh>
      
      <mesh position={[-0.15, 2.2, 0.3]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="black" />
      </mesh>
      
      {/* Character arms */}
      <mesh castShadow position={[0.6, 1, 0]}>
        <capsuleGeometry args={[0.2, 1, 4, 8]} />
        <meshStandardMaterial color={playerData?.gender === 'female' ? '#E38AAE' : '#6495ED'} />
      </mesh>
      
      <mesh castShadow position={[-0.6, 1, 0]}>
        <capsuleGeometry args={[0.2, 1, 4, 8]} />
        <meshStandardMaterial color={playerData?.gender === 'female' ? '#E38AAE' : '#6495ED'} />
      </mesh>
      
      {/* Character legs */}
      <mesh castShadow position={[0.3, 0, 0]}>
        <capsuleGeometry args={[0.25, 0.8, 4, 8]} />
        <meshStandardMaterial color="#4169E1" />
      </mesh>
      
      <mesh castShadow position={[-0.3, 0, 0]}>
        <capsuleGeometry args={[0.25, 0.8, 4, 8]} />
        <meshStandardMaterial color="#4169E1" />
      </mesh>
    </group>
  );
};

export default Player;
