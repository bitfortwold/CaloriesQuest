import * as THREE from "three";
import { useEffect, useState, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber"; 
import { Sky, PerspectiveCamera } from "@react-three/drei";
import { useGameStateStore } from "../stores/useGameStateStore";
import { usePlayerStore } from "../stores/usePlayerStore";

import Environment from "./Environment";
import Player from "./Player";
import Buildings from "./Buildings";
import GameUI from "./GameUI";
import Garden from "./Garden";
import MacMouseControls from "./MacMouseControls";
import MouseInteraction from "./MouseInteraction";

const Game = () => {
  const { gameState, setGameState, enterBuilding, exitBuilding } = useGameStateStore();
  const { playerPosition } = usePlayerStore();
  const { camera } = useThree();
  const [isInitialized, setIsInitialized] = useState(false);
  const orbitControlsRef = useRef<any>(null);
  
  // Camera offset for orbit controls
  const cameraTarget = useRef(new THREE.Vector3());
  
  // Set up the game when component mounts
  useEffect(() => {
    if (!isInitialized) {
      console.log("Game initialized");
      
      // Importamos la posición central y la establecemos como punto de spawn
      import("./Buildings").then(({ CENTRAL_SPAWN_POSITION }) => {
        // Establecer la posición inicial del jugador en el punto central del mapa
        const { setPlayerPosition } = usePlayerStore.getState();
        setPlayerPosition(CENTRAL_SPAWN_POSITION);
        console.log("🎮 Posición inicial del jugador establecida en el punto central:", CENTRAL_SPAWN_POSITION);
      });
      
      setGameState("playing");
      setIsInitialized(true);
    }
    
    // Clean up function
    return () => {
      console.log("Game cleanup");
    };
  }, [setGameState, isInitialized]);

  // Inicialización básica de la cámara - el componente MacTrackpadCamera 
  // se encargará del resto de la configuración y seguimiento del jugador
  useEffect(() => {
    if (!isInitialized && camera && playerPosition) {
      // Posición inicial de la cámara detrás del jugador
      camera.position.set(
        playerPosition.x, 
        playerPosition.y + 5, 
        playerPosition.z + 10
      );
      camera.lookAt(playerPosition.x, playerPosition.y, playerPosition.z);
    }
  }, [isInitialized, camera, playerPosition]);

  return (
    <>
      {/* Controles optimizados para ratón Mac */}
      {gameState === "playing" && (
        <>
          <MacMouseControls />
          <MouseInteraction />
        </>
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
      
      {/* El Huerto ya se muestra a través de GameUI para evitar duplicación */}
      
      {/* GameUI removed from 3D context - it's rendered through a portal */}
    </>
  );
};

export default Game;
