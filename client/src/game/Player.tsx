import * as THREE from "three";
import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useGameStateStore } from "../stores/useGameStateStore";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useFoodStore } from "../stores/useFoodStore";
import { 
  getGardenPosition, 
  getGardenExitPosition,
  getMarketExitPosition,
  getKitchenExitPosition
} from "./Buildings";

const PLAYER_SPEED = 0.1;
const INTERACTION_DISTANCE = 3;
const MOUSE_SPEED = 0.05; // Velocidad para movimiento con mouse

const Player = () => {
  const playerRef = useRef<THREE.Group>(null);
  const { gameState, enterBuilding } = useGameStateStore();
  const { 
    playerPosition, 
    setPlayerPosition, 
    playerData,
    increaseCaloriesBurned,
    updatePlayer
  } = usePlayerStore();
  const { marketPosition, kitchenPosition } = useFoodStore();
  // Obtener la posición del huerto
  const gardenPosition = getGardenPosition();
  
  // Subscribe to keyboard controls
  const [, getKeys] = useKeyboardControls();
  
  // Reference direction for smooth movement
  const [moveDir] = useState(new THREE.Vector3());
  
  // Character's facing direction
  const [rotationY, setRotationY] = useState(0);
  
  // Mouse movement variables
  const [targetPosition, setTargetPosition] = useState<THREE.Vector3 | null>(null);
  const [isMovingToTarget, setIsMovingToTarget] = useState(false);
  
  // Get Three.js scene and camera
  const { camera, gl, scene } = useThree();

  // Handle click on ground for movement con cámara fluida
  const handleGroundClick = (event: MouseEvent) => {
    if (gameState !== "playing") return;
    
    // Cancelar si se está usando el botón derecho para mover la cámara
    if (event.button !== 0) return;
    
    // Si acabamos de salir de un edificio, ignorar el primer clic para evitar bucles
    if (justExitedBuilding) {
      console.log("Click ignored - just exited a building");
      return;
    }
    
    // Prevent default behavior
    event.preventDefault();
    
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Create raycaster usando la posición y rotación exactas de la cámara
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    
    // Comprobar si el clic fue directamente sobre algún objeto en la escena
    const intersects = raycaster.intersectObjects(scene.children, true);
    
    // Primero revisar si el clic fue sobre la superficie del huerto
    let clickedOnGarden = false;
    for (let i = 0; i < intersects.length; i++) {
      if (intersects[i].object.name === 'gardenSurface') {
        clickedOnGarden = true;
        console.log("¡Clic detectado sobre la superficie del huerto! Moviendo al personaje hacia allí...");
        
        // Obtener la posición donde se hizo clic
        const clickPosition = intersects[i].point;
        
        // Calcular una posición válida donde mover al jugador (sobre el huerto)
        const gardenPos = getGardenPosition();
        const playerDestination = new THREE.Vector3(
          gardenPos.x, 
          playerPosition.y, 
          gardenPos.z
        );
        
        // Mover al jugador hacia el huerto
        setTargetPosition(playerDestination);
        setIsMovingToTarget(true);
        
        // Calcular dirección para mirar hacia el huerto
        const direction = new THREE.Vector3().subVectors(
          new THREE.Vector3(gardenPos.x, playerPosition.y, gardenPos.z),
          new THREE.Vector3(playerPosition.x, playerPosition.y, playerPosition.z)
        );
        const targetRotation = Math.atan2(direction.x, direction.z);
        setRotationY(targetRotation);
        
        // Entrar al huerto solo cuando el jugador llegue a su destino
        setTimeout(() => {
          console.log("Llegando al huerto, abriendo ventana...");
          enterBuilding("garden");
        }, 1000);
        
        return;
      }
    }
    
    // Si no se hizo clic en el huerto, continuar con la detección normal
    // Find intersections con el suelo desde la perspectiva actual de la cámara
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // Y-up plane at y=0
    const targetPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(groundPlane, targetPoint);
    
    if (targetPoint) {
      // Comprobar si el clic está cerca del mercado o la cocina
      const distToMarket = new THREE.Vector3(
        targetPoint.x - marketPosition.x,
        0,
        targetPoint.z - marketPosition.z
      ).length();
      
      const distToKitchen = new THREE.Vector3(
        targetPoint.x - kitchenPosition.x,
        0, 
        targetPoint.z - kitchenPosition.z
      ).length();
      
      // Si el clic está cerca de un edificio, interactuar con él
      if (distToMarket < INTERACTION_DISTANCE) {
        // Primero mover al jugador cerca del edificio
        targetPoint.copy(new THREE.Vector3(marketPosition.x, playerPosition.y, marketPosition.z));
        targetPoint.addScaledVector(new THREE.Vector3(1, 0, 1).normalize(), 1.5); // Posición ligeramente alejada
        setTargetPosition(targetPoint);
        setIsMovingToTarget(true);
        
        // Calcular dirección para mirar hacia el edificio
        const direction = new THREE.Vector3().subVectors(
          new THREE.Vector3(marketPosition.x, playerPosition.y, marketPosition.z),
          new THREE.Vector3(targetPoint.x, playerPosition.y, targetPoint.z)
        );
        const targetRotation = Math.atan2(direction.x, direction.z);
        setRotationY(targetRotation);
        
        // Entrar al mercado después de un breve retraso
        setTimeout(() => {
          console.log("Entering market");
          enterBuilding("market");
        }, 500);
        
        return;
      }
      
      if (distToKitchen < INTERACTION_DISTANCE) {
        // Primero mover al jugador cerca del edificio
        targetPoint.copy(new THREE.Vector3(kitchenPosition.x, playerPosition.y, kitchenPosition.z));
        targetPoint.addScaledVector(new THREE.Vector3(1, 0, 1).normalize(), 1.5); // Posición ligeramente alejada
        setTargetPosition(targetPoint);
        setIsMovingToTarget(true);
        
        // Calcular dirección para mirar hacia el edificio
        const direction = new THREE.Vector3().subVectors(
          new THREE.Vector3(kitchenPosition.x, playerPosition.y, kitchenPosition.z),
          new THREE.Vector3(targetPoint.x, playerPosition.y, targetPoint.z)
        );
        const targetRotation = Math.atan2(direction.x, direction.z);
        setRotationY(targetRotation);
        
        // Entrar a la cocina después de un breve retraso
        setTimeout(() => {
          console.log("Entering kitchen");
          enterBuilding("kitchen");
        }, 500);
        
        return;
      }
      
      // Comprobar la distancia al huerto en sí (entrada original)
      const gardenPos = getGardenPosition();
      const distToGarden = new THREE.Vector3(
        playerPosition.x - gardenPos.x,
        0,
        playerPosition.z - gardenPos.z
      ).length();
      
      if (distToGarden < INTERACTION_DISTANCE) {
        console.log("Player is near garden entrance");
        
        // Movemos al jugador justo frente a la entrada del huerto
        const entrancePoint = new THREE.Vector3(
          gardenPos.x,
          playerPosition.y,
          gardenPos.z + 4 // Posición frente a la entrada
        );
        
        setTargetPosition(entrancePoint);
        setIsMovingToTarget(true);
        
        // Calculamos la dirección para mirar hacia el huerto
        const direction = new THREE.Vector3().subVectors(
          new THREE.Vector3(gardenPos.x, playerPosition.y, gardenPos.z),
          entrancePoint
        );
        const targetRotation = Math.atan2(direction.x, direction.z);
        setRotationY(targetRotation);
        
        // Entrar después de un breve retraso
        setTimeout(() => {
          console.log("Now entering garden");
          enterBuilding("garden");
        }, 500);
        
        return;
      }
      
      // Si no está cerca de un edificio, simplemente moverse allí
      targetPoint.y = playerPosition.y;
      setTargetPosition(targetPoint);
      setIsMovingToTarget(true);
      
      // Calcular dirección para mirar
      const direction = new THREE.Vector3().subVectors(targetPoint, new THREE.Vector3(playerPosition.x, playerPosition.y, playerPosition.z));
      const targetRotation = Math.atan2(direction.x, direction.z);
      setRotationY(targetRotation);
    }
  };
  
  // Set up mouse click event listener
  useEffect(() => {
    // Obtener el canvas para eventos de clic
    const canvas = gl.domElement;
    
    // Handler para detectar si es un clic puro o parte de una acción de zoom/rotación
    const handleCanvasClick = (event: MouseEvent) => {
      console.log("Canvas click detected, game state:", gameState);
      
      // Solo procesar clics si estamos en estado "playing"
      if (gameState !== "playing") {
        console.log("Click ignored - game not in playing state");
        return;
      }
      
      // Si se está presionando algún botón del teclado o la rueda del ratón, no considerar como clic para movimiento
      if (event.altKey || event.ctrlKey || event.shiftKey || event.metaKey) {
        console.log("Click ignored - modifier key pressed");
        return; // No manejar este clic como orden de movimiento
      }
      
      // Verificar si es un clic rápido y no parte de un arrastre o zoom
      if (event.detail === 1) { // Es un clic simple
        console.log("Processing ground click for movement");
        handleGroundClick(event);
      }
    };
    
    // Añadir y eliminar el listener explícitamente cuando cambia el estado del juego
    if (gameState === "playing") {
      console.log("Adding click event listener to canvas");
      canvas.addEventListener('click', handleCanvasClick);
    }
    
    return () => {
      console.log("Removing click event listener from canvas");
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [gameState, gl.domElement]);
  
  // Variable para rastrear si acabamos de salir de cualquier edificio
  const [justExitedBuilding, setJustExitedBuilding] = useState(false);
  
  // Referencia para almacenar el último estado conocido
  const lastGameStateRef = useRef<string | null>(null);
  
  // Detectar cuando volvemos al estado "playing" desde cualquier edificio
  useEffect(() => {
    const buildingStates = ["garden", "market", "kitchen"];
    
    // Si venimos de cualquier edificio y ahora estamos jugando
    if (buildingStates.includes(lastGameStateRef.current || "") && gameState === "playing") {
      const exitedBuilding = lastGameStateRef.current;
      console.log(`Detectada salida desde ${exitedBuilding}`);
      
      // Marcar que acabamos de salir para evitar interacciones inmediatas
      setJustExitedBuilding(true);
      
      // SOLUCIÓN PARA TODAS LAS SITUACIONES AL SALIR DEL HUERTO
      if (exitedBuilding === "garden") {
        console.log("✓✓✓ Implementando SOLUCIÓN FINAL para la salida del huerto");
        
        // FUERZA la posición exacta independientemente del estado de semillas
        // Usamos una posición FIJA en coordenadas absolutas
        setPlayerPosition({
          x: 0,         // Centro exacto del camino
          y: 0,         // A nivel del suelo
          z: 0          // Centro del mapa (solución radical para resolver el bug)
        });
        
        // Forzar reposicionamiento después de un breve delay
        setTimeout(() => {
          console.log("Ajuste FINAL de posición");
          setPlayerPosition({
            x: 0,
            y: 0,
            z: -6       // Posición exacta en el camino ocre
          });
          
          // Orientar al jugador hacia el huerto (al norte)
          setRotationY(Math.PI);
        }, 100);
        
        // Configurar la cámara detrás del jugador con vista perfecta
        if (camera) {
          camera.position.set(0, 8, 5); // Vista trasera elevada
          camera.lookAt(0, 0, -15); // Mirando directamente hacia el huerto
          console.log("Cámara posicionada para vista perfecta del huerto");
        }
        
        // Limpiar cualquier acción pendiente del huerto
        const { playerData } = usePlayerStore.getState();
        if (playerData) {
          updatePlayer({
            ...playerData,
            lastGardenAction: undefined
          });
        }
      } 
      // Manejar la salida del mercado
      else if (exitedBuilding === "market") {
        console.log("Saliendo del mercado");
        const marketExit = getMarketExitPosition();
        
        // Posicionar al jugador en el camino frente al mercado
        setPlayerPosition({
          x: marketExit.x,
          y: 0,
          z: marketExit.z
        });
        
        // Configurar la cámara con vista perfecta
        if (camera) {
          camera.position.set(marketExit.x, 8, 5);
          camera.lookAt(marketExit.x, 0, -15);
          console.log("Cámara posicionada para vista del mercado");
        }
      } 
      // Manejar la salida de la cocina
      else if (exitedBuilding === "kitchen") {
        console.log("Saliendo de la cocina");
        const kitchenExit = getKitchenExitPosition();
        
        // Posicionar al jugador en el camino frente a la cocina
        setPlayerPosition({
          x: kitchenExit.x,
          y: 0,
          z: kitchenExit.z
        });
        
        // Configurar la cámara con vista perfecta
        if (camera) {
          camera.position.set(kitchenExit.x, 8, 5);
          camera.lookAt(kitchenExit.x, 0, -15);
          console.log("Cámara posicionada para vista de la cocina");
        }
      }
      
      // Restaurar la capacidad de interactuar después de un periodo
      setTimeout(() => {
        console.log("Finalizado el tiempo de espera tras salir del edificio");
        setJustExitedBuilding(false);
      }, 1000);
    }
    
    // Actualizar la referencia del estado anterior
    lastGameStateRef.current = gameState;
  }, [gameState, camera, setPlayerPosition, setRotationY, updatePlayer]);

  // Handle movement and interactions in each frame
  useFrame(() => {
    if (gameState !== "playing" || !playerRef.current) return;
    
    // Keyboard movement
    const { forward, backward, leftward, rightward, interact } = getKeys();
    
    // If any keyboard movement, cancel mouse movement
    if (forward || backward || leftward || rightward) {
      setIsMovingToTarget(false);
    }
    
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
    // Move toward mouse target if active
    else if (isMovingToTarget && targetPosition) {
      // Calculate direction to target
      const currentPos = new THREE.Vector3(playerPosition.x, playerPosition.y, playerPosition.z);
      const targetPos = targetPosition.clone();
      const direction = targetPos.sub(currentPos);
      
      // Check if we're close enough to target
      if (direction.length() < MOUSE_SPEED) {
        setIsMovingToTarget(false);
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