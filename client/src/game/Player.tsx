import * as THREE from "three";
import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useGameStateStore } from "../stores/useGameStateStore";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useFoodStore } from "../stores/useFoodStore";
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
  const marketPos = getMarketPosition();
  const kitchenPos = getKitchenPosition();
  const gardenPos = getGardenPosition();
  
  // Controles de teclado y movimiento
  const [, getKeys] = useKeyboardControls();
  const [moveDir] = useState(new THREE.Vector3());
  const [rotationY, setRotationY] = useState(0);
  
  // Get Three.js camera and scene
  const { camera } = useThree();
  
  // Escuchar eventos emitidos por el store
  useEffect(() => {
    const handleSetTargetPosition = (event: any) => {
      if (event.detail) {
        setTargetPosition(new THREE.Vector3(
          event.detail.x,
          event.detail.y,
          event.detail.z
        ));
      } else {
        setTargetPosition(null);
      }
    };
    
    const handleSetIsMovingToTarget = (event: any) => {
      setIsMovingToTarget(event.detail);
    };
    
    // Agregar listeners
    window.addEventListener('setTargetPosition', handleSetTargetPosition);
    window.addEventListener('setIsMovingToTarget', handleSetIsMovingToTarget);
    
    // Eliminar listeners al desmontar
    return () => {
      window.removeEventListener('setTargetPosition', handleSetTargetPosition);
      window.removeEventListener('setIsMovingToTarget', handleSetIsMovingToTarget);
    };
  }, []);
  
  // Get Three.js scene and camera
  const { camera, gl, scene } = useThree();

  // Función para comprobar si el jugador está cerca de alguna puerta
  const checkBuildingProximity = () => {
    if (gameState !== "playing" || !playerRef.current) return;
    
    const marketPos = getMarketPosition();
    const kitchenPos = getKitchenPosition();
    const gardenPos = getGardenPosition();
    
    // Obtener posición actual del jugador
    const playerPos = new THREE.Vector3(playerPosition.x, playerPosition.y, playerPosition.z);
    
    // Definir posiciones de las puertas
    const marketDoorPosition = new THREE.Vector3(marketPos.x, playerPosition.y, marketPos.z + 2);
    const kitchenDoorPosition = new THREE.Vector3(kitchenPos.x, playerPosition.y, kitchenPos.z + 2);
    const gardenDoorPosition = new THREE.Vector3(gardenPos.x, playerPosition.y, gardenPos.z + 2);
    
    // Distancia de detección para entrar por puerta (más pequeña para precisión)
    const DOOR_INTERACTION_DISTANCE = 1.5;
    
    // Calcular distancias
    const distToMarketDoor = playerPos.distanceTo(marketDoorPosition);
    const distToKitchenDoor = playerPos.distanceTo(kitchenDoorPosition);
    const distToGardenDoor = playerPos.distanceTo(gardenDoorPosition);
    
    // Verificar si estamos cerca de alguna puerta
    if (distToMarketDoor < DOOR_INTERACTION_DISTANCE) {
      console.log("Llegando al mercado por las puertas...");
      enterBuilding("market");
      return true;
    }
    
    if (distToKitchenDoor < DOOR_INTERACTION_DISTANCE) {
      console.log("Llegando a la cocina por las puertas...");
      enterBuilding("kitchen");
      return true;
    }
    
    if (distToGardenDoor < DOOR_INTERACTION_DISTANCE) {
      console.log("Llegando al huerto por las puertas...");
      enterBuilding("garden");
      return true;
    }
    
    return false;
  };
  
  // Ya no usamos eventos de clic para movimiento - Solo verificamos proximidad a puertas
  useEffect(() => {
    // Ningún evento de clic para movimiento - Usando solo teclado y arrastre
    console.log("Nuevo sistema de movimiento: solo teclado y arrastre de ratón");
    
    return () => {
      // Nada que limpiar
    };
  }, [gameState, gl.domElement]);
  
  // Variable para rastrear si acabamos de salir de cualquier edificio
  const [justExitedBuilding, setJustExitedBuilding] = useState(false);
  
  // Referencia para almacenar el último estado conocido
  const lastGameStateRef = useRef<string | null>(null);
  
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
      
      // 5. Cancelar cualquier movimiento automático
      const playerStore = usePlayerStore.getState();
      playerStore.setIsMovingToTarget(false);
      
      // 6. Actualizar estado del jugador con una propiedad común
      if (playerData) {
        updatePlayer({
          ...playerData,
          lastGardenAction: undefined // Limpiar estado anterior
        });
      }
      
      // 7. Permitir nuevas interacciones después de un tiempo seguro
      setTimeout(() => {
        setJustExitedBuilding(false);
      }, 500);
    }
    
    // Guardar estado actual para comparar en la próxima actualización
    lastGameStateRef.current = gameState;
  }, [gameState, camera, setPlayerPosition, setRotationY, updatePlayer]);

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
            setDestinationBuilding(null); // Limpiar el destino
          }, 200);
        }
      } else {
        // Actualizar la rotación para mirar hacia el objetivo
        // Calculamos el ángulo en el plano X-Z (horizontal)
        const targetRotation = Math.atan2(direction.x, direction.z);
        setRotationY(targetRotation);
        
        // Normalize and scale by speed
        direction.normalize().multiplyScalar(MOUSE_SPEED);
        
        // Update position
        const newPosition = {
          x: playerPosition.x + direction.x,
          y: playerPosition.y,
          z: playerPosition.z + direction.z
        };
        
        // Apply the new position
        setPlayerPosition(newPosition);
        
        // Burn a small amount of calories when moving
        increaseCaloriesBurned(0.01);
      }
    }
    
    // Handle interaction
    if (interact) {
      handleInteraction();
    }
  });
  
  // Handle interactions with buildings when pressing E key
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
    
    // Calculate distance to garden
    const distToGarden = new THREE.Vector3(
      playerPosition.x - gardenPosition.x,
      0,
      playerPosition.z - gardenPosition.z
    ).length();
    
    // Enter market if close enough
    if (distToMarket < INTERACTION_DISTANCE) {
      console.log("Entering market via E key");
      enterBuilding("market");
      return;
    }
    
    // Enter kitchen if close enough
    if (distToKitchen < INTERACTION_DISTANCE) {
      console.log("Entering kitchen via E key");
      enterBuilding("kitchen");
      return;
    }
    
    // Enter garden if close enough
    if (distToGarden < INTERACTION_DISTANCE) {
      console.log("Entering garden via E key");
      enterBuilding("garden");
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