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
import Garden from "./Garden";

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

  // Sistema de cámara mejorado para permitir zoom durante movimiento
  useEffect(() => {
    if (gameState === "playing" && orbitControlsRef.current) {
      // Actualizar el objetivo de la cámara para que siga al jugador suavemente
      cameraTarget.current.set(
        playerPosition.x,
        playerPosition.y,
        playerPosition.z
      );
      
      // Aplicar el target a los controles de órbita con interpolación suave
      // Esto permite hacer zoom mientras el personaje se mueve, sin perder fluidez
      orbitControlsRef.current.target.lerp(cameraTarget.current, 0.05);
      
      // Importante: asegurar que los controles NO se desactiven durante el movimiento
      orbitControlsRef.current.enabled = true;
    }
  }, [gameState, playerPosition]);
  
  // Implementar un sistema adicional para mantener la cámara funcionando durante movimiento
  useFrame(() => {
    if (gameState === "playing" && orbitControlsRef.current) {
      // Actualizar los controles de órbita en cada frame
      // Esto permite operaciones de zoom durante movimiento
      orbitControlsRef.current.update();
    }
  });

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
      {/* Controles de órbita optimizados para fluidez y no perder posición */}
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
          zoomSpeed={0.8} // Velocidad de zoom más suave para mejor control
          rotateSpeed={0.4} // Velocidad de rotación más suave para movimientos precisos
          panSpeed={0.4} // Velocidad de paneo más suave para movimientos precisos
          enableDamping={true} // Añadir inercia para movimientos fluidos
          dampingFactor={0.07} // Factor de inercia reducido para mayor estabilidad
          screenSpacePanning={true} // Paneo en espacio de pantalla para mantener enfoque
          keyPanSpeed={20} // Velocidad de paneo con teclado
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN
          }}
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
          }}
          // Mantener los controles siempre activos, incluso durante el movimiento
          enabled={true}
          // Hacer que los controles no se desactiven automáticamente
          makeDefault={true}
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
      
      {/* El Huerto ya se muestra a través de GameUI para evitar duplicación */}
      
      {/* GameUI removed from 3D context - it's rendered through a portal */}
    </>
  );
};

export default Game;
