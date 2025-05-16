import * as THREE from "three";
import { useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber"; 
import { OrbitControls, Sky } from "@react-three/drei";
import { useGameStateStore } from "../stores/useGameStateStore";
import { usePlayerStore } from "../stores/usePlayerStore";

import Environment from "./Environment";
import Player from "./Player";
import Buildings from "./Buildings";
import GameUI from "./GameUI";

const Game = () => {
  const { gameState, setGameState, enterBuilding, exitBuilding } = useGameStateStore();
  const { playerPosition } = usePlayerStore();
  const { camera } = useThree();
  const [isInitialized, setIsInitialized] = useState(false);

  // Set up the game when component mounts
  useEffect(() => {
    if (!isInitialized) {
      console.log("Game initialized");
      setGameState("playing");
      setIsInitialized(true);
    }
    
    // Clean up function
    return () => {
      console.log("Game cleanup");
    };
  }, [setGameState, isInitialized]);

  // Camera follows player
  useFrame(() => {
    if (gameState === "playing") {
      // Only update camera in playing state (when outside buildings)
      const targetPosition = new THREE.Vector3(
        playerPosition.x,
        camera.position.y, // Keep the same height
        playerPosition.z + 8 // Position camera behind player
      );
      
      // Smoothly move the camera
      camera.position.lerp(targetPosition, 0.1);
      camera.lookAt(playerPosition.x, playerPosition.y + 1, playerPosition.z);
    }
  });

  return (
    <>
      {/* Only enable orbit controls for debugging */}
      {/* <OrbitControls /> */}
      
      {/* Sky background */}
      <Sky sunPosition={[100, 10, 100]} />
      
      {/* Ambient and directional light */}
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize={1024} 
      />
      
      {/* Game environment, player, and buildings */}
      <Environment />
      
      {gameState === "playing" && (
        <>
          <Player />
          <Buildings />
        </>
      )}
      
      {/* GameUI removed from 3D context - it's rendered through a portal */}
    </>
  );
};

export default Game;
