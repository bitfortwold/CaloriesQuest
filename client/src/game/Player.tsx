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
    
    // Verificar si estamos cerca de alguna puerta Y es ESPECÍFICAMENTE nuestro destino actual
    // IMPORTANTE: Solo permitir entrar si el jugador explícitamente seleccionó este edificio
    if (distToMarketDoor < AUTO_ENTER_THRESHOLD && currentDestination === "market") {
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
    
    if (distToKitchenDoor < AUTO_ENTER_THRESHOLD && currentDestination === "kitchen") {
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
    
    if (distToGardenDoor < AUTO_ENTER_THRESHOLD && currentDestination === "garden") {
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
  const checkBuildingCollisions = (newPos: { x: number, y: number, z: number }) => {
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
    
    // Margen de seguridad para mantener distancia con los edificios
    const SAFETY_MARGIN = 1.0;
    
    // Comprobar colisión con el Mercado (colisión rectangular)
    const marketCollision = 
      newPos.x > marketPos.x - marketWidth/2 - playerRadius - SAFETY_MARGIN && 
      newPos.x < marketPos.x + marketWidth/2 + playerRadius + SAFETY_MARGIN &&
      newPos.z > marketPos.z - marketDepth/2 - playerRadius - SAFETY_MARGIN && 
      newPos.z < marketPos.z + marketDepth/2 + playerRadius + SAFETY_MARGIN;
    
    // Comprobar colisión con la Cocina (colisión rectangular)
    const kitchenCollision = 
      newPos.x > kitchenPos.x - kitchenWidth/2 - playerRadius - SAFETY_MARGIN && 
      newPos.x < kitchenPos.x + kitchenWidth/2 + playerRadius + SAFETY_MARGIN &&
      newPos.z > kitchenPos.z - kitchenDepth/2 - playerRadius - SAFETY_MARGIN && 
      newPos.z < kitchenPos.z + kitchenDepth/2 + playerRadius + SAFETY_MARGIN;
    
    // Comprobar colisión con el Huerto (colisión rectangular)
    const gardenCollision = 
      newPos.x > gardenPos.x - gardenWidth/2 - playerRadius - SAFETY_MARGIN && 
      newPos.x < gardenPos.x + gardenWidth/2 + playerRadius + SAFETY_MARGIN &&
      newPos.z > gardenPos.z - gardenDepth/2 - playerRadius - SAFETY_MARGIN && 
      newPos.z < gardenPos.z + gardenDepth/2 + playerRadius + SAFETY_MARGIN;
    
    // Devolver información sobre la colisión
    if (marketCollision) {
      console.log("Colisión con el mercado");
      return {
        collided: true,
        building: {
          name: "market",
          pos: marketPos,
          width: marketWidth,
          depth: marketDepth
        }
      };
    } else if (kitchenCollision) {
      console.log("Colisión con la cocina");
      return {
        collided: true,
        building: {
          name: "kitchen",
          pos: kitchenPos,
          width: kitchenWidth,
          depth: kitchenDepth
        }
      };
    } else if (gardenCollision) {
      console.log("Colisión con el huerto");
      return {
        collided: true,
        building: {
          name: "garden",
          pos: gardenPos,
          width: gardenWidth,
          depth: gardenDepth
        }
      };
    }
    
    // No hay colisión
    return { collided: false };
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
        
        // Comprobar si tenemos un destino final almacenado (estábamos en un waypoint)
        const finalDestinationStr = localStorage.getItem('finalDestination');
        if (finalDestinationStr) {
          try {
            const finalDestination = JSON.parse(finalDestinationStr);
            console.log("🧭 Destino final encontrado, continuando hacia:", finalDestination);
            
            // Establecer el destino final como nuevo objetivo
            usePlayerStore.getState().setTargetPosition(new THREE.Vector3(
              finalDestination.x,
              finalDestination.y,
              finalDestination.z
            ));
            
            // Limpiar el almacenamiento
            localStorage.removeItem('finalDestination');
            
            // No detener el movimiento, continuar hacia el destino final
            return;
          } catch (error) {
            console.error("Error al procesar el destino final:", error);
            // Si hay error, eliminar el dato corrupto y detener
            localStorage.removeItem('finalDestination');
          }
        }
        
        // Si no hay destino final o hubo error, simplemente detener
        usePlayerStore.getState().setIsMovingToTarget(false);
        return;
      }
      
      // ENFOQUE SIMPLE: Normalizar vector y moverse directamente hacia el objetivo si no hay colisión
      
      // Normalizar el vector para obtener la dirección de movimiento
      targetVector.normalize();
      
      // Calcular nueva posición con la velocidad apropiada
      const tentativePosition = {
        x: playerPosition.x + targetVector.x * PLAYER_SPEED,
        y: playerPosition.y,
        z: playerPosition.z + targetVector.z * PLAYER_SPEED
      };
      
      // Verificar colisión con la nueva función
      const collisionResult = checkBuildingCollisions(tentativePosition);
      
      if (collisionResult.collided) {
        // Si hay colisión, calculamos una ruta inteligente para rodear el edificio
        console.log("🚫 Colisión detectada - Calculando ruta inteligente para rodear");
        
        // Obtener información sobre el edificio con el que colisionamos
        const building = collisionResult.building;
        
        if (building) {
          console.log(`🏢 Colisión con ${building.name} - Calculando ruta de desvío`);
          
          // Vector desde el centro del edificio al jugador
          const buildingToPlayer = new THREE.Vector3(
            playerPosition.x - building.pos.x,
            0,
            playerPosition.z - building.pos.z
          );
          
          // Vector desde el centro del edificio al punto de destino
          const buildingToTarget = new THREE.Vector3(
            targetPosition.x - building.pos.x,
            0,
            targetPosition.z - building.pos.z
          );
          
          // Normalizar los vectores para tener solo dirección
          buildingToPlayer.normalize();
          buildingToTarget.normalize();
          
          // Calcular un vector perpendicular al vector edificio-jugador
          // Este vector nos dará una dirección para rodear el edificio
          const perpendicular = new THREE.Vector3(
            buildingToPlayer.z,
            0,
            -buildingToPlayer.x
          );
          
          // Determinar si rodear por la izquierda o derecha según el camino más corto hacia el destino
          // Producto punto entre el vector perpendicular y el vector hacia el destino
          // Si es positivo, rodear por la dirección del vector perpendicular
          // Si es negativo, rodear por la dirección opuesta
          const dotProduct = perpendicular.dot(buildingToTarget);
          
          // Vector final de desvío
          const deviationVector = new THREE.Vector3();
          
          if (dotProduct >= 0) {
            // Rodear por la dirección del vector perpendicular
            deviationVector.copy(perpendicular);
          } else {
            // Rodear por la dirección opuesta
            deviationVector.copy(perpendicular).negate();
          }
          
          // Añadir un poco de la dirección original para mantener la tendencia hacia el destino
          deviationVector.add(buildingToTarget.multiplyScalar(0.2));
          deviationVector.normalize();
          
          // Calcular la nueva posición con un margen de seguridad amplio
          const SAFETY_MARGIN = 0.5; // Margin adicional para evitar oscilaciones
          newPosition = {
            x: playerPosition.x + deviationVector.x * PLAYER_SPEED * (1 + SAFETY_MARGIN),
            y: playerPosition.y,
            z: playerPosition.z + deviationVector.z * PLAYER_SPEED * (1 + SAFETY_MARGIN)
          };
          
          // Verificar que esta nueva posición no choque con otro edificio
          const secondaryCheck = checkBuildingCollisions(newPosition);
          
          if (secondaryCheck.collided) {
            console.log("🚫 Ruta de desvío también tiene colisión - Buscando alternativa");
            
            // Si también colisiona, probar con el vector opuesto
            deviationVector.negate();
            
            newPosition = {
              x: playerPosition.x + deviationVector.x * PLAYER_SPEED * (1 + SAFETY_MARGIN),
              y: playerPosition.y,
              z: playerPosition.z + deviationVector.z * PLAYER_SPEED * (1 + SAFETY_MARGIN)
            };
            
            // Verificar esta tercera posición
            const tertiaryCheck = checkBuildingCollisions(newPosition);
            
            if (tertiaryCheck.collided) {
              // Si todavía hay colisión, intentar moverse directamente lejos del edificio
              console.log("🚫 Todas las rutas de desvío tienen colisión - Alejándose del edificio");
              
              newPosition = {
                x: playerPosition.x + buildingToPlayer.x * PLAYER_SPEED * 2,
                y: playerPosition.y,
                z: playerPosition.z + buildingToPlayer.z * PLAYER_SPEED * 2
              };
            }
          }
          
          // Actualizar rotación para mirar hacia la dirección del movimiento de desvío
          setRotationY(Math.atan2(deviationVector.x, deviationVector.z));
          
          console.log(`🧭 Rodeando ${building.name} con vector de desvío: (${deviationVector.x.toFixed(2)}, ${deviationVector.z.toFixed(2)})`);
          return; // Continuar con el movimiento usando la nueva posición calculada
        }
        
        // Si no pudimos identificar el edificio, usar el enfoque anterior
        const distanceToTarget = Math.sqrt(
          Math.pow(targetPosition.x - playerPosition.x, 2) + 
          Math.pow(targetPosition.z - playerPosition.z, 2)
        );
        
        if (distanceToTarget < 5) {
          console.log("🧙 Ayudando al jugador a llegar al destino");
          
          // Ordenamos los edificios por distancia
          const buildings = [
            { name: "market", pos: getMarketPosition(), width: 5, depth: 4 },
            { name: "kitchen", pos: getKitchenPosition(), width: 6, depth: 5 },
            { name: "garden", pos: getGardenPosition(), width: 8, depth: 6 }
          ];
          
          // Encontrar el edificio más cercano
          let closestBuilding = buildings[0];
          let minDistance = Number.MAX_VALUE;
          
          for (const building of buildings) {
            const dist = Math.sqrt(
              Math.pow(building.pos.x - playerPosition.x, 2) + 
              Math.pow(building.pos.z - playerPosition.z, 2)
            );
            
            if (dist < minDistance) {
              minDistance = dist;
              closestBuilding = building;
            }
          }
          
          // Determinar la mejor posición alrededor del edificio
          const buildingPos = closestBuilding.pos;
          
          // Calcular el lado más cercano al destino con un margen de seguridad amplio
          const SAFE_MARGIN = 3; // Mayor margen de seguridad para evitar colisiones
          const sides = [
            { x: buildingPos.x - closestBuilding.width/2 - SAFE_MARGIN, z: buildingPos.z, name: "izquierda" }, // izquierda
            { x: buildingPos.x + closestBuilding.width/2 + SAFE_MARGIN, z: buildingPos.z, name: "derecha" },  // derecha
            { x: buildingPos.x, z: buildingPos.z - closestBuilding.depth/2 - SAFE_MARGIN, name: "frente" },   // frente
            { x: buildingPos.x, z: buildingPos.z + closestBuilding.depth/2 + SAFE_MARGIN, name: "atrás" }      // atrás
          ];
          
          // Encontrar el lado más cercano al destino final y verificar que no tenga colisión
          let bestSide = sides[0];
          let bestDistance = Number.MAX_VALUE;
          
          for (const side of sides) {
            // Verificar que este punto no cause colisión
            const testPos = {
              x: side.x,
              y: playerPosition.y,
              z: side.z
            };
            
            // Solo considerar este lado si no hay colisión
            if (!checkBuildingCollisions(testPos)) {
              const dist = Math.sqrt(
                Math.pow(targetPosition.x - side.x, 2) + 
                Math.pow(targetPosition.z - side.z, 2)
              );
              
              if (dist < bestDistance) {
                bestDistance = dist;
                bestSide = side;
              }
            } else {
              console.log(`🚫 Punto ${side.name} también tiene colisión, ignorando`);
            }
          }
          
          console.log(`🧩 Moviendo al jugador al lado ${bestSide.name} del ${closestBuilding.name}`);
          
          // Actualizar posición del jugador directamente
          newPosition = {
            x: bestSide.x,
            y: playerPosition.y,
            z: bestSide.z
          };
          
          // Actualizar rotación para mirar hacia el objetivo final
          setRotationY(Math.atan2(targetPosition.x - bestSide.x, targetPosition.z - bestSide.z));
        }
      } else {
        // Sin colisión, movimiento normal
        newPosition = tentativePosition;
        
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
      console.log("🏃‍♂️ Moviendo jugador a:", newPosition);
      
      // Verificar colisiones con nuestra nueva función mejorada
      const collisionResult = checkBuildingCollisions(newPosition);
      
      // Solo aplicar la nueva posición si no hay colisión
      if (!collisionResult.collided) {
        // Apply the new position
        console.log("✅ Posición válida, aplicando movimiento");
        setPlayerPosition(newPosition);
        
        // Burn a small amount of calories when moving (proporcional a la distancia)
        increaseCaloriesBurned(0.01 * (moveDistance / PLAYER_SPEED));
      } else if (isMovingToTarget) {
        // Si hay colisión en movimiento por clic, intentamos ir hacia la puerta del edificio
        console.log("🚪 Colisión detectada con edificio, intentando redirigir a la puerta");
        
        const building = collisionResult.building;
        if (building) {
          // Establecer el edificio como destino
          console.log(`🏢 Redirigiendo hacia ${building.name}`);
          usePlayerStore.getState().setDestinationBuilding(building.name);
          
          // Calcular posición de la puerta
          let doorPosition;
          
          if (building.name === "market") {
            doorPosition = { x: building.pos.x, y: 0, z: building.pos.z + 2.5 };
          } else if (building.name === "kitchen") {
            doorPosition = { x: building.pos.x, y: 0, z: building.pos.z + 2.5 };
          } else if (building.name === "garden") {
            doorPosition = { x: building.pos.x, y: 0, z: building.pos.z + 2.5 };
          }
          
          if (doorPosition) {
            console.log(`🚪 Redirigiendo a la puerta en ${JSON.stringify(doorPosition)}`);
            // Actualizar posición objetivo para ir a la puerta
            usePlayerStore.getState().setTargetPosition(doorPosition);
          }
        } else {
          // Si no pudimos identificar el edificio, detener el movimiento
          console.log("🛑 Colisión detectada, deteniendo movimiento");
          usePlayerStore.getState().setIsMovingToTarget(false);
        }
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