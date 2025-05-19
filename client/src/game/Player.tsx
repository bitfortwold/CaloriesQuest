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
    
    // Obtener posiciones de los edificios
    const marketPos = getMarketPosition();
    const kitchenPos = getKitchenPosition();
    const gardenPos = getGardenPosition();
    
    // Crear posiciones de las puertas (justo frente a los edificios)
    const marketDoorPos = new THREE.Vector3(marketPos.x, playerPosition.y, marketPos.z + 2.5);
    const kitchenDoorPos = new THREE.Vector3(kitchenPos.x, playerPosition.y, kitchenPos.z + 2.5);
    const gardenDoorPos = new THREE.Vector3(gardenPos.x, playerPosition.y, gardenPos.z + 2.5);
    
    // Calcular distancias a las puertas
    const distToMarketDoor = playerPos.distanceTo(marketDoorPos);
    const distToKitchenDoor = playerPos.distanceTo(kitchenDoorPos);
    const distToGardenDoor = playerPos.distanceTo(gardenDoorPos);
    
    // Depuración de distancias 
    console.log(`📏 Distancia puerta Mercado: ${distToMarketDoor.toFixed(2)}`);
    console.log(`📏 Distancia puerta Cocina: ${distToKitchenDoor.toFixed(2)}`);
    console.log(`📏 Distancia puerta Huerto: ${distToGardenDoor.toFixed(2)}`);
    
    // Verificar también el edificio de destino
    const currentDestination = usePlayerStore.getState().destinationBuilding;
    console.log(`🏢 Edificio de destino actual: ${currentDestination || "ninguno"}`);
    
    // Hacer más generoso el umbral para facilitar la entrada
    const AUTO_ENTER_THRESHOLD = 2.5;
    
    // Verificar si estamos cerca de alguna puerta Y es nuestro destino actual
    if (distToMarketDoor < AUTO_ENTER_THRESHOLD && 
       (currentDestination === "market" || !currentDestination)) {
      console.log("🚪 Llegando al mercado por las puertas...");
      // Hacer que el jugador esté exactamente en la posición correcta
      setPlayerPosition({
        x: marketDoorPos.x,
        y: playerPosition.y,
        z: marketDoorPos.z
      });
      // Entrar al edificio
      enterBuilding("market");
      return true;
    }
    
    if (distToKitchenDoor < AUTO_ENTER_THRESHOLD && 
       (currentDestination === "kitchen" || !currentDestination)) {
      console.log("🚪 Llegando a la cocina por las puertas...");
      // Hacer que el jugador esté exactamente en la posición correcta
      setPlayerPosition({
        x: kitchenDoorPos.x,
        y: playerPosition.y,
        z: kitchenDoorPos.z
      });
      // Entrar al edificio
      enterBuilding("kitchen");
      return true;
    }
    
    if (distToGardenDoor < AUTO_ENTER_THRESHOLD &&
       (currentDestination === "garden" || !currentDestination)) {
      console.log("🚪 Llegando al huerto por las puertas...");
      // Hacer que el jugador esté exactamente en la posición correcta
      setPlayerPosition({
        x: gardenDoorPos.x,
        y: playerPosition.y,
        z: gardenDoorPos.z
      });
      // Entrar al edificio
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
  const checkBuildingCollisions = (newPos: { x: number, y: number, z: number }, returnBuildingInfo = false): boolean | {hasCollision: boolean, buildingInfo?: any} => {
    // Dimensiones del Mercado (ajustar según el tamaño real en Buildings.tsx)
    const marketWidth = 5; // Ancho del edificio
    const marketDepth = 4; // Profundidad del edificio
    const marketPos = getMarketPosition();
    
    // Dimensiones de la Cocina (ajustar según el tamaño real en Buildings.tsx)
    const kitchenWidth = 6; // Ancho del edificio
    const kitchenDepth = 5; // Profundidad del edificio
    const kitchenPos = getKitchenPosition();
    
    // Dimensiones del Huerto (ajustar según el tamaño real en Buildings.tsx)
    const gardenWidth = 8; // Ancho del edificio
    const gardenDepth = 6; // Profundidad del edificio
    const gardenPos = getGardenPosition();
    
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
      if (returnBuildingInfo) {
        return {
          hasCollision: true,
          buildingInfo: {
            name: "market",
            position: marketPos,
            width: marketWidth,
            depth: marketDepth
          }
        };
      }
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
      if (returnBuildingInfo) {
        return {
          hasCollision: true,
          buildingInfo: {
            name: "kitchen",
            position: kitchenPos,
            width: kitchenWidth,
            depth: kitchenDepth
          }
        };
      }
      return true; // Hay colisión
    }
    
    // Comprobar colisión con el Huerto (colisión rectangular)
    if (
      newPos.x > gardenPos.x - gardenWidth/2 - playerRadius && 
      newPos.x < gardenPos.x + gardenWidth/2 + playerRadius &&
      newPos.z > gardenPos.z - gardenDepth/2 - playerRadius && 
      newPos.z < gardenPos.z + gardenDepth/2 + playerRadius
    ) {
      console.log("Colisión con el huerto");
      if (returnBuildingInfo) {
        return {
          hasCollision: true,
          buildingInfo: {
            name: "garden",
            position: gardenPos,
            width: gardenWidth,
            depth: gardenDepth
          }
        };
      }
      return true; // Hay colisión
    }
    
    // No hay colisión
    if (returnBuildingInfo) {
      return { hasCollision: false };
    }
    return false;
  };

  // Handle movement and interactions in each frame
  useFrame(() => {
    if (gameState !== "playing" || !playerRef.current) return;
    
    // Comprobar primero si estamos cerca de alguna puerta
    const enteringBuilding = checkBuildingProximity();
    if (enteringBuilding) return; // Si estamos entrando a un edificio, no procesar más movimiento
    
    // Obtener estados para el movimiento por clic
    const { targetPosition, isMovingToTarget } = usePlayerStore.getState();
    
    // Determinar si nos movemos con teclado o hacia un punto objetivo
    let newPosition;
    let moveDistance = 0;
    
    // MOVIMIENTO HACIA OBJETIVO (clic)
    if (isMovingToTarget && targetPosition) {
      // Vector desde la posición actual a la posición objetivo
      const targetVector = new THREE.Vector3(
        targetPosition.x - playerPosition.x,
        0,
        targetPosition.z - playerPosition.z
      );
      
      // Distancia al objetivo
      const distanceToTarget = targetVector.length();
      
      // Si estamos muy cerca del objetivo, detenemos el movimiento
      if (distanceToTarget < 0.2) {
        // Llegamos al objetivo
        console.log("🏁 Llegado al punto de destino");
        usePlayerStore.getState().setIsMovingToTarget(false);
        return;
      }
      
      // Sistema de navegación inteligente para rodear obstáculos
      
      // Normalizar el vector para obtener la dirección base
      targetVector.normalize();
      
      // Calcular posición tentativa siguiente basada en movimiento directo
      const directNextPosition = {
        x: playerPosition.x + targetVector.x * PLAYER_SPEED,
        y: playerPosition.y,
        z: playerPosition.z + targetVector.z * PLAYER_SPEED
      };
      
      // Verificar si hay colisión con algún edificio
      const collisionResult = checkBuildingCollisions(directNextPosition, true) as {hasCollision: boolean, buildingInfo?: any};
      
      // Si hay colisión, calcular ruta alternativa para rodear el edificio
      if (collisionResult.hasCollision && collisionResult.buildingInfo) {
        console.log(`🧭 Navegación: Rodeando ${collisionResult.buildingInfo.name} inteligentemente`);
        
        const building = collisionResult.buildingInfo;
        const buildingPos = building.position;
        
        // Determinar posición relativa al edificio para saber cómo rodearlo
        const isPlayerLeftOfBuilding = playerPosition.x < buildingPos.x - (building.width/2);
        const isPlayerRightOfBuilding = playerPosition.x > buildingPos.x + (building.width/2);
        const isPlayerInFrontOfBuilding = playerPosition.z < buildingPos.z - (building.depth/2);
        const isPlayerBehindBuilding = playerPosition.z > buildingPos.z + (building.depth/2);
        
        // Vector desde el edificio al destino final
        const buildingToTarget = new THREE.Vector3(
          targetPosition.x - buildingPos.x,
          0,
          targetPosition.z - buildingPos.z
        ).normalize();
        
        // Sistema mejorado de navegación para evitar vibraciones y atascos en esquinas
        
        // 1. Crear un vector de dirección para el desvío
        let alternativeDir = new THREE.Vector3();
        
        // 2. Determinar la dirección más segura para rodear el edificio
        const distToTarget = new THREE.Vector3(
          targetPosition.x - playerPosition.x,
          0,
          targetPosition.z - playerPosition.z
        ).length();
        
        // 3. Determinar la mejor dirección de desvío basada en la posición relativa
        if (isPlayerLeftOfBuilding) {
          // Jugador a la izquierda del edificio
          // Moverse más a la izquierda y ligeramente en dirección Z hacia el objetivo
          const zDir = targetPosition.z > playerPosition.z ? 0.7 : -0.7;
          alternativeDir.set(-1.5, 0, zDir);
        } 
        else if (isPlayerRightOfBuilding) {
          // Jugador a la derecha del edificio
          // Moverse más a la derecha y ligeramente en dirección Z hacia el objetivo
          const zDir = targetPosition.z > playerPosition.z ? 0.7 : -0.7;
          alternativeDir.set(1.5, 0, zDir);
        } 
        else if (isPlayerInFrontOfBuilding) {
          // Jugador delante del edificio
          // Determinar el lado más eficiente para rodear el edificio
          const xOffset = playerPosition.x - buildingPos.x;
          // Si estamos más cerca del lado izquierdo, rodear por la izquierda
          if (xOffset < 0) {
            alternativeDir.set(-1.5, 0, -0.7);
          } else {
            // Si no, rodear por la derecha
            alternativeDir.set(1.5, 0, -0.7);
          }
        } 
        else if (isPlayerBehindBuilding) {
          // Jugador detrás del edificio
          // Determinar el lado más eficiente para rodear el edificio
          const xOffset = playerPosition.x - buildingPos.x;
          // Si estamos más cerca del lado izquierdo, rodear por la izquierda
          if (xOffset < 0) {
            alternativeDir.set(-1.5, 0, 0.7);
          } else {
            // Si no, rodear por la derecha
            alternativeDir.set(1.5, 0, 0.7);
          }
        } 
        else {
          // Estamos dentro o muy cerca del edificio
          // Movernos directamente lejos del centro del edificio
          const fromBuildingCenter = new THREE.Vector3(
            playerPosition.x - buildingPos.x,
            0,
            playerPosition.z - buildingPos.z
          );
          
          if (fromBuildingCenter.length() < 0.1) {
            // Si estamos muy cerca del centro, movernos en una dirección aleatoria pero constante
            fromBuildingCenter.set(1, 0, 1);
          }
          
          fromBuildingCenter.normalize();
          // Multiplicamos por 2 para asegurar un movimiento significativo lejos del edificio
          fromBuildingCenter.multiplyScalar(2);
          alternativeDir.copy(fromBuildingCenter);
        }
        
        // 4. Verificar si esta posición alternativa también causa colisión
        const tentativeAlternativePosition = {
          x: playerPosition.x + alternativeDir.x * PLAYER_SPEED,
          y: playerPosition.y,
          z: playerPosition.z + alternativeDir.z * PLAYER_SPEED
        };
        
        const secondCollision = checkBuildingCollisions(tentativeAlternativePosition);
        
        // 5. Si la dirección alternativa también colisiona, intentar una dirección más radical
        if (secondCollision) {
          console.log("⚠️ Navegación: Ruta alternativa también tiene colisión, buscando mejor camino");
          
          // Intentar en 45°, 90°, 135°, 180° desde la dirección original
          const angles = [Math.PI/4, Math.PI/2, 3*Math.PI/4, Math.PI];
          let validDirection = false;
          
          for (const angle of angles) {
            // Rotar el vector dirección en el ángulo especificado
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const rotatedX = targetVector.x * cos - targetVector.z * sin;
            const rotatedZ = targetVector.x * sin + targetVector.z * cos;
            
            const testPos = {
              x: playerPosition.x + rotatedX * PLAYER_SPEED * 1.5,
              y: playerPosition.y,
              z: playerPosition.z + rotatedZ * PLAYER_SPEED * 1.5
            };
            
            if (!checkBuildingCollisions(testPos)) {
              console.log(`🔄 Navegación: Encontrada dirección segura en rotación ${(angle * 180/Math.PI).toFixed(0)}°`);
              alternativeDir.set(rotatedX, 0, rotatedZ);
              validDirection = true;
              break;
            }
          }
          
          // Si ninguna dirección funciona, moverse temporalmente en dirección opuesta
          if (!validDirection) {
            console.log("🔄 Navegación: Moviéndose en dirección opuesta al objetivo para desatascar");
            alternativeDir.set(-targetVector.x * 2, 0, -targetVector.z * 2);
          }
        }
        
        // Normalizar la dirección alternativa
        alternativeDir.normalize();
        
        // Calcular nueva posición basada en la ruta alternativa
        newPosition = {
          x: playerPosition.x + alternativeDir.x * PLAYER_SPEED,
          y: playerPosition.y,
          z: playerPosition.z + alternativeDir.z * PLAYER_SPEED
        };
        
        // Actualizar rotación para mirar hacia la dirección alternativa
        setRotationY(Math.atan2(alternativeDir.x, alternativeDir.z));
      } else {
        // Sin obstáculos, usar movimiento directo normal
        newPosition = directNextPosition;
        
        // Actualizar rotación para mirar hacia el objetivo
        setRotationY(Math.atan2(targetVector.x, targetVector.z));
      }
      
      moveDistance = PLAYER_SPEED;
    } 
    // MOVIMIENTO POR TECLADO
    else {
      // Movimiento por teclado (WASD/Flechas)
      const { forward, backward, leftward, rightward } = getKeys();
      
      // Calculate keyboard movement direction
      moveDir.set(0, 0, 0);
      if (forward) moveDir.z -= 1;
      if (backward) moveDir.z += 1;
      if (leftward) moveDir.x -= 1;
      if (rightward) moveDir.x += 1;
      
      // Solo si hay movimiento por teclado
      if (moveDir.length() > 0) {
        moveDir.normalize();
        
        // Update rotation based on movement direction
        const targetRotation = Math.atan2(moveDir.x, moveDir.z);
        setRotationY(targetRotation);
        
        // Calcular nueva posición
        newPosition = {
          x: playerPosition.x + moveDir.x * PLAYER_SPEED,
          y: playerPosition.y,
          z: playerPosition.z + moveDir.z * PLAYER_SPEED
        };
        
        moveDistance = PLAYER_SPEED;
      }
    }
    
    // Aplicar movimiento (tanto para teclado como para clic)
    if (newPosition) {
      // Verificar colisiones antes de aplicar la nueva posición
      const hasCollision = checkBuildingCollisions(newPosition);
      
      // Solo aplicar la nueva posición si no hay colisión
      if (!hasCollision) {
        // Apply the new position
        setPlayerPosition(newPosition);
        
        // Burn a small amount of calories when moving (proporcional a la distancia)
        increaseCaloriesBurned(0.01 * (moveDistance / PLAYER_SPEED));
      } else if (isMovingToTarget) {
        // Si hay colisión en movimiento por clic, detener el movimiento
        console.log("🛑 Colisión detectada, deteniendo movimiento por clic");
        usePlayerStore.getState().setIsMovingToTarget(false);
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