import * as THREE from "three";
import { useEffect, useState } from "react";
import { Text, useTexture } from "@react-three/drei"; 
import { useFoodStore } from "../stores/useFoodStore";

const Buildings = () => {
  const { setMarketPosition, setKitchenPosition } = useFoodStore();
  const woodTexture = useTexture("/textures/wood.jpg");
  
  // Set predefined positions for buildings
  const marketPos = [-8, 0, 0];
  const kitchenPos = [8, 0, 0];
  
  useEffect(() => {
    // Register building positions in the store
    setMarketPosition({ x: marketPos[0], y: marketPos[1], z: marketPos[2] });
    setKitchenPosition({ x: kitchenPos[0], y: kitchenPos[1], z: kitchenPos[2] });
    
    // Configure texture
    woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping;
    woodTexture.repeat.set(2, 2);
  }, [setMarketPosition, setKitchenPosition, woodTexture]);
  
  return (
    <group>
      {/* Market Building */}
      <group position={marketPos}>
        {/* Market base/stall */}
        <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
          <boxGeometry args={[5, 3, 4]} />
          <meshStandardMaterial map={woodTexture} color="#CD853F" />
        </mesh>
        
        {/* Market roof */}
        <mesh castShadow position={[0, 3.5, 0]}>
          <boxGeometry args={[6, 1, 5]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        
        {/* Market sign */}
        <Text
          position={[0, 4.2, 0]}
          rotation={[0, 0, 0]}
          fontSize={0.8}
          color="#F5DEB3"
          anchorX="center"
          anchorY="middle"
        >
          MARKET
        </Text>

        {/* Food display area */}
        <mesh position={[0, 1.5, 2.1]} rotation={[0, 0, 0]}>
          <boxGeometry args={[4, 0.2, 0.5]} />
          <meshStandardMaterial color="#A0522D" />
        </mesh>
        
        {/* Stylized food items */}
        <group position={[0, 1.7, 2.1]}>
          {/* Apples */}
          <mesh position={[-1.5, 0, 0]} castShadow>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshStandardMaterial color="red" />
          </mesh>
          
          {/* Bananas */}
          <mesh position={[-1, 0, 0]} castShadow rotation={[0, 0, Math.PI / 4]}>
            <cylinderGeometry args={[0.05, 0.15, 0.6, 8]} />
            <meshStandardMaterial color="yellow" />
          </mesh>
          
          {/* Bread */}
          <mesh position={[0, 0, 0]} castShadow>
            <capsuleGeometry args={[0.15, 0.4, 4, 8]} />
            <meshStandardMaterial color="#D2691E" />
          </mesh>
          
          {/* Carrot */}
          <mesh position={[1, 0, 0]} castShadow rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.1, 0.5, 8]} />
            <meshStandardMaterial color="orange" />
          </mesh>
          
          {/* Broccoli */}
          <mesh position={[1.5, 0, 0]} castShadow>
            <group>
              <mesh position={[0, 0.1, 0]}>
                <cylinderGeometry args={[0.05, 0.1, 0.2, 8]} />
                <meshStandardMaterial color="#8B4513" />
              </mesh>
              <mesh position={[0, 0.3, 0]}>
                <sphereGeometry args={[0.2, 8, 8]} />
                <meshStandardMaterial color="green" />
              </mesh>
            </group>
          </mesh>
        </group>
      </group>
      
      {/* Kitchen Building */}
      <group position={kitchenPos}>
        {/* Kitchen base */}
        <mesh castShadow receiveShadow position={[0, 2, 0]}>
          <boxGeometry args={[6, 4, 5]} />
          <meshStandardMaterial map={woodTexture} color="#F5F5DC" />
        </mesh>
        
        {/* Kitchen roof */}
        <mesh castShadow position={[0, 4.5, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[4, 2, 4]} />
          <meshStandardMaterial color="#8B0000" />
        </mesh>
        
        {/* Kitchen door */}
        <mesh position={[0, 1.5, 2.51]}>
          <boxGeometry args={[1.5, 3, 0.1]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        
        {/* Kitchen window */}
        <mesh position={[2, 2.5, 2.51]}>
          <boxGeometry args={[1.2, 1.2, 0.1]} />
          <meshStandardMaterial color="#ADD8E6" opacity={0.7} transparent />
        </mesh>
        
        <mesh position={[-2, 2.5, 2.51]}>
          <boxGeometry args={[1.2, 1.2, 0.1]} />
          <meshStandardMaterial color="#ADD8E6" opacity={0.7} transparent />
        </mesh>
        
        {/* Kitchen sign */}
        <Text
          position={[0, 5.5, 0]}
          rotation={[0, 0, 0]}
          fontSize={0.8}
          color="#F5DEB3"
          anchorX="center"
          anchorY="middle"
        >
          KITCHEN
        </Text>
      </group>
      
      {/* Interaction hints */}
      <Text
        position={[-8, 5, 0]}
        rotation={[0, 0, 0]}
        fontSize={0.4}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        Press E to interact
      </Text>
      
      <Text
        position={[8, 6, 0]}
        rotation={[0, 0, 0]}
        fontSize={0.4}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        Press E to interact
      </Text>
    </group>
  );
};

export default Buildings;
