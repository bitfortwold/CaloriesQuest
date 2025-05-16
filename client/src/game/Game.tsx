import * as THREE from "three";
import { useEffect, useState, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber"; 
import { OrbitControls, Sky, PerspectiveCamera, Html } from "@react-three/drei";
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
  const [cameraMode, setCameraMode] = useState<"follow" | "free">("follow");
  const orbitControlsRef = useRef<any>(null);
  
  // Set up the game when component mounts
  useEffect(() => {
    if (!isInitialized) {
      console.log("Game initialized");
      setGameState("playing");
      setIsInitialized(true);
      
      // Configurar tecla para cambiar modo de cámara (tecla 'C')
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'KeyC') {
          setCameraMode(prev => prev === "follow" ? "free" : "follow");
          
          // Si cambiamos a modo libre, configurar la posición inicial de la cámara libre
          if (cameraMode === "follow" && orbitControlsRef.current) {
            orbitControlsRef.current.target.set(
              playerPosition.x,
              playerPosition.y,
              playerPosition.z
            );
          }
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
    
    // Clean up function
    return () => {
      console.log("Game cleanup");
    };
  }, [setGameState, isInitialized, cameraMode, playerPosition]);

  // Camera follows player in follow mode
  useFrame(() => {
    if (gameState === "playing" && cameraMode === "follow") {
      // Only update camera in playing state (when outside buildings) and follow mode
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
      {/* Enable orbit controls in free camera mode */}
      {cameraMode === "free" && gameState === "playing" && (
        <OrbitControls 
          ref={orbitControlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={50}
          minPolarAngle={Math.PI / 6} // Limitar rotación hacia abajo
          maxPolarAngle={Math.PI / 2} // Limitar rotación hacia arriba
        />
      )}
      
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
      
      {/* Instrucción de cámara mostrada en el UI en lugar de en 3D */}
      
      {/* GameUI removed from 3D context - it's rendered through a portal */}
    </>
  );
};

export default Game;
