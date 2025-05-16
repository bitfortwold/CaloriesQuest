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
  const orbitControlsRef = useRef<any>(null);
  
  // Camera offset for orbit controls
  const cameraTarget = useRef(new THREE.Vector3());
  
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

  // Update camera target to follow player
  useEffect(() => {
    if (gameState === "playing" && orbitControlsRef.current) {
      // Actualizar el objetivo de la cámara para que siga al jugador
      cameraTarget.current.set(
        playerPosition.x,
        playerPosition.y,
        playerPosition.z
      );
      
      // Aplicar el target a los controles de órbita
      orbitControlsRef.current.target.copy(cameraTarget.current);
    }
  }, [gameState, playerPosition]);

  // Initial camera position
  useEffect(() => {
    if (camera && playerPosition) {
      // Posición inicial de la cámara detrás del jugador
      camera.position.set(
        playerPosition.x, 
        playerPosition.y + 5, 
        playerPosition.z + 10
      );
      camera.lookAt(playerPosition.x, playerPosition.y, playerPosition.z);
    }
  }, [camera, playerPosition]);

  return (
    <>
      {/* Controles de órbita siempre activos en modo de juego */}
      {gameState === "playing" && (
        <OrbitControls 
          ref={orbitControlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={30}
          minPolarAngle={Math.PI / 8} // Limitar rotación hacia abajo (no mucho)
          maxPolarAngle={Math.PI / 2} // Limitar rotación hacia arriba (hasta horizontal)
          zoomSpeed={0.5} // Velocidad de zoom más suave
          rotateSpeed={0.5} // Velocidad de rotación más suave
          panSpeed={0.5} // Velocidad de paneo más suave
          enableDamping={true} // Añadir inercia
          dampingFactor={0.1} // Factor de inercia
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN
          }}
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
      
      {/* GameUI removed from 3D context - it's rendered through a portal */}
    </>
  );
};

export default Game;
