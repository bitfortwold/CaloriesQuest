import * as THREE from "three";
import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useGameStateStore } from "../stores/useGameStateStore";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useCameraStore } from "../lib/stores/useCameraStore";
import { 
  getGardenPosition, 
  getGardenExitPosition,
  getMarketExitPosition,
  getKitchenExitPosition,
  getMarketPosition,
  getKitchenPosition
} from "./Buildings";

// Constantes
const PLAYER_SPEED = 0.1;
const DOOR_DETECTION_DISTANCE = 1.5; // Distancia para detectar puertas
const AUTO_ENTER_DISTANCE = 1.5; // Distancia para entrada automática

const Player = () => {
  // Referencias y estados
  const playerRef = useRef<THREE.Group>(null);
  const { gameState, enterBuilding } = useGameStateStore();
  const { 
    playerPosition, 
    setPlayerPosition, 
    playerData,
    increaseCaloriesBurned,
    updatePlayer
  } = usePlayerStore();
  
  // Posiciones de edificios
  const marketPosition = getMarketPosition();
  const kitchenPosition = getKitchenPosition();
  const gardenPosition = getGardenPosition();
  
  // Controles de teclado y movimiento
  const [, getKeys] = useKeyboardControls();
  const [moveDir] = useState(new THREE.Vector3());
  const [rotationY, setRotationY] = useState(0);
  
  // Get Three.js camera 
  const { camera } = useThree();
  
  // Variable para rastrear si acabamos de salir de cualquier edificio
  const [justExitedBuilding, setJustExitedBuilding] = useState(false);
  
  // Referencia para almacenar el último estado conocido
  const lastGameStateRef = useRef<string | null>(null);
  
  // Función para comprobar si el jugador está cerca de alguna puerta
  const checkBuildingProximity = () => {
    if (gameState !== "playing" || !playerRef.current) return false;
    
    // Obtener posición actual del jugador
    const playerPos = new THREE.Vector3(playerPosition.x, playerPosition.y, playerPosition.z);
    
    // Obtener posiciones de salida/entrada de edificios (son las posiciones exactas donde el jugador se dirige)
    const marketExitPos = getMarketExitPosition();
    const kitchenExitPos = getKitchenExitPosition();
    const gardenExitPos = getGardenExitPosition();
    
    // Definir posiciones de destino (usar las mismas que en MouseInteraction)
    const marketDestination = new THREE.Vector3(marketExitPos.x, playerPosition.y, marketExitPos.z);
    const kitchenDestination = new THREE.Vector3(kitchenExitPos.x, playerPosition.y, kitchenExitPos.z);
    const gardenDestination = new THREE.Vector3(gardenExitPos.x, playerPosition.y, gardenExitPos.z);
    
    // Calcular distancias a los puntos de destino
    const distToMarketDest = playerPos.distanceTo(marketDestination);
    const distToKitchenDest = playerPos.distanceTo(kitchenDestination);
    const distToGardenDest = playerPos.distanceTo(gardenDestination);
    
    // Depuración de distancias
    console.log(`📏 Distancia al mercado: ${distToMarketDest.toFixed(2)}`);
    console.log(`📏 Distancia a la cocina: ${distToKitchenDest.toFixed(2)}`);
    console.log(`📏 Distancia al huerto: ${distToGardenDest.toFixed(2)}`);
    
    // Aumentar la distancia de detección para facilitar la entrada
    const AUTO_ENTER_THRESHOLD = 3.0; // Más generoso que antes
    
    // Verificar si estamos cerca de alguna puerta
    if (distToMarketDest < AUTO_ENTER_THRESHOLD) {
      console.log("🚪 Llegando al mercado por las puertas...");
      enterBuilding("market");
      return true;
    }
    
    if (distToKitchenDest < AUTO_ENTER_THRESHOLD) {
      console.log("🚪 Llegando a la cocina por las puertas...");
      enterBuilding("kitchen");
      return true;
    }
    
    if (distToGardenDest < AUTO_ENTER_THRESHOLD) {
      console.log("🚪 Llegando al huerto por las puertas...");
      enterBuilding("garden");
      return true;
    }
    
    return false;
  };
  
  // Sistema unificado para detectar salida de cualquier edificio
  useEffect(() => {
    const buildingStates = ["garden", "market", "kitchen"];
    
    // Verificar si acabamos de salir de un edificio
    const wasInBuilding = buildingStates.includes(lastGameStateRef.current || "");
    const isNowPlaying = gameState === "playing";
    
    if (wasInBuilding && isNowPlaying) {
      const exitedBuilding = lastGameStateRef.current || "";
      console.log(`Saliendo de ${exitedBuilding} con sistema unificado`);
      
      // Marcar que acabamos de salir para evitar interacciones inmediatas
      setJustExitedBuilding(true);
      
      // 1. Obtener posición de salida apropiada según el edificio
      let targetRotation = 0;
      let exitPosition = { x: 0, y: 0, z: 0 };
      
      if (exitedBuilding === "garden") {
        exitPosition = getGardenExitPosition();
        targetRotation = Math.PI; // Mirando hacia el norte (huerto)
      } 
      else if (exitedBuilding === "market") {
        exitPosition = getMarketExitPosition();
        targetRotation = Math.PI / 2; // Mirando hacia el este
      }
      else if (exitedBuilding === "kitchen") {
        exitPosition = getKitchenExitPosition();
        targetRotation = -Math.PI / 2; // Mirando hacia el oeste
      }
      
      // 2. Aplicar posición y rotación básica
      if (exitPosition) {
        setPlayerPosition(exitPosition);
        setRotationY(targetRotation);
      }
      
      // 3. Resetear cámara para evitar problemas acumulativos
      const { requestReset } = useCameraStore.getState();
      requestReset();
      
      // 4. Configuración unificada de cámara para los tres edificios
      if (camera) {
        const cameraHeight = 8;
        const cameraDistance = 5;
        
        const gardenPos = getGardenPosition();
        const marketPos = getMarketPosition();
        const kitchenPos = getKitchenPosition();
        
        if (exitedBuilding === "garden") {
          // Cámara mirando al norte (huerto)
          camera.position.set(0, cameraHeight, exitPosition.z + cameraDistance);
          camera.lookAt(gardenPos.x, 0, gardenPos.z);
        }
        else if (exitedBuilding === "market") {
          // Cámara mirando al este (mercado)
          camera.position.set(exitPosition.x - cameraDistance, cameraHeight, exitPosition.z);
          camera.lookAt(marketPos.x, 0, marketPos.z);
        }
        else if (exitedBuilding === "kitchen") {
          // Cámara mirando al oeste (cocina)
          camera.position.set(exitPosition.x + cameraDistance, cameraHeight, exitPosition.z);
          camera.lookAt(kitchenPos.x, 0, kitchenPos.z);
        }
        
        // Configurar parámetros comunes
        camera.rotation.order = 'YXZ';
        camera.updateProjectionMatrix();
      }
      
      // 5. Actualizar estado del jugador con una propiedad común
      if (playerData) {
        updatePlayer({
          ...playerData,
          lastGardenAction: undefined // Limpiar estado anterior
        });
      }
      
      // 6. Permitir nuevas interacciones después de un tiempo seguro
      setTimeout(() => {
        setJustExitedBuilding(false);
      }, 500);
    }
    
    // Guardar estado actual para comparar en la próxima actualización
    lastGameStateRef.current = gameState;
  }, [gameState, camera, setPlayerPosition, setRotationY, updatePlayer, playerData]);

  // Función para detectar colisiones con edificios
  const checkBuildingCollisions = (newPos: { x: number, y: number, z: number }): boolean => {
    // Dimensiones del Mercado (ajustar según el tamaño real en Buildings.tsx)
    const marketWidth = 5; // Ancho del edificio
    const marketDepth = 4; // Profundidad del edificio
    const marketPos = getMarketPosition();
    
    // Dimensiones de la Cocina (ajustar según el tamaño real en Buildings.tsx)
    const kitchenWidth = 6; // Ancho del edificio
    const kitchenDepth = 5; // Profundidad del edificio
    const kitchenPos = getKitchenPosition();
    
    // Radio del jugador (para colisión)
    const playerRadius = 0.7;
    
    // Comprobar colisión con el Mercado (colisión rectangular)
    if (
      newPos.x > marketPos.x - marketWidth/2 - playerRadius && 
      newPos.x < marketPos.x + marketWidth/2 + playerRadius &&
      newPos.z > marketPos.z - marketDepth/2 - playerRadius && 
      newPos.z < marketPos.z + marketDepth/2 + playerRadius
    ) {
      console.log("Colisión con el mercado");
      return true; // Hay colisión
    }
    
    // Comprobar colisión con la Cocina (colisión rectangular)
    if (
      newPos.x > kitchenPos.x - kitchenWidth/2 - playerRadius && 
      newPos.x < kitchenPos.x + kitchenWidth/2 + playerRadius &&
      newPos.z > kitchenPos.z - kitchenDepth/2 - playerRadius && 
      newPos.z < kitchenPos.z + kitchenDepth/2 + playerRadius
    ) {
      console.log("Colisión con la cocina");
      return true; // Hay colisión
    }
    
    // No hay colisión
    return false;
  };

  // Handle movement and interactions in each frame
  useFrame(() => {
    if (gameState !== "playing" || !playerRef.current) return;
    
    // Comprobar primero si estamos cerca de alguna puerta
    const enteringBuilding = checkBuildingProximity();
    if (enteringBuilding) return; // Si estamos entrando a un edificio, no procesar más movimiento
    
    // Solo movimiento por teclado (sin clic ni target)
    const { forward, backward, leftward, rightward } = getKeys();
    
    // Calculate keyboard movement direction
    moveDir.set(0, 0, 0);
    if (forward) moveDir.z -= 1;
    if (backward) moveDir.z += 1;
    if (leftward) moveDir.x -= 1;
    if (rightward) moveDir.x += 1;
    
    // Move with keyboard if direction exists
    if (moveDir.length() > 0) {
      moveDir.normalize();
      
      // Update rotation based on movement direction
      const targetRotation = Math.atan2(moveDir.x, moveDir.z);
      setRotationY(targetRotation);
      
      // Calcular nueva posición
      const newPosition = {
        x: playerPosition.x + moveDir.x * PLAYER_SPEED,
        y: playerPosition.y,
        z: playerPosition.z + moveDir.z * PLAYER_SPEED
      };
      
      // Verificar colisiones antes de aplicar la nueva posición
      const hasCollision = checkBuildingCollisions(newPosition);
      
      // Solo aplicar la nueva posición si no hay colisión
      if (!hasCollision) {
        // Apply the new position
        setPlayerPosition(newPosition);
        
        // Burn a small amount of calories when moving
        increaseCaloriesBurned(0.01);
      }
    }
  });
  
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
      {/* Personaje ajustado a la altura del camino rectangular */}
      <group position={[0, 0.6, 0]}>
        {/* Torso central simple */}
        <mesh castShadow position={[0, 1, 0]}>
          <capsuleGeometry args={[0.5, 1, 4, 8]} />
          <meshStandardMaterial color={playerData?.gender === 'female' ? '#E38AAE' : '#6495ED'} />
        </mesh>
        
        {/* Cabeza simple */}
        <mesh castShadow position={[0, 2.1, 0]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="#F5DEB3" />
        </mesh>
        
        {/* Ojos */}
        <mesh position={[0.15, 2.2, 0.3]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="black" />
        </mesh>
        
        <mesh position={[-0.15, 2.2, 0.3]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="black" />
        </mesh>
        
        {/* Brazos simples */}
        <mesh castShadow position={[0.6, 1, 0]}>
          <capsuleGeometry args={[0.2, 1, 4, 8]} />
          <meshStandardMaterial color={playerData?.gender === 'female' ? '#E38AAE' : '#6495ED'} />
        </mesh>
        
        <mesh castShadow position={[-0.6, 1, 0]}>
          <capsuleGeometry args={[0.2, 1, 4, 8]} />
          <meshStandardMaterial color={playerData?.gender === 'female' ? '#E38AAE' : '#6495ED'} />
        </mesh>
        
        {/* Piernas simples */}
        <mesh castShadow position={[0.3, 0, 0]}>
          <capsuleGeometry args={[0.25, 0.8, 4, 8]} />
          <meshStandardMaterial color="#4169E1" />
        </mesh>
        
        <mesh castShadow position={[-0.3, 0, 0]}>
          <capsuleGeometry args={[0.25, 0.8, 4, 8]} />
          <meshStandardMaterial color="#4169E1" />
        </mesh>
      </group>
    </group>
  );
};

export default Player;