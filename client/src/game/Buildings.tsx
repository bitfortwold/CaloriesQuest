import * as THREE from "three";
import { useEffect, useRef } from "react";
import { Text } from "@react-three/drei"; 
import { useFoodStore } from "../stores/useFoodStore";
import { useGameStateStore } from "../stores/useGameStateStore";
import { usePlayerStore } from "../stores/usePlayerStore";

// Definición de posiciones
interface Position {
  x: number;
  y: number;
  z: number;
}

// Posición central del mapa - punto de spawn del jugador (punto azul del mapa)
export const CENTRAL_SPAWN_POSITION: Position = { x: 0, y: 0, z: -5 };

// Posiciones de los edificios (fijas e inmutables)
const GARDEN_POSITION: Position = { x: 0, y: 0, z: -15 };
const MARKET_POSITION: Position = { x: -8, y: 0, z: 0 };
const KITCHEN_POSITION: Position = { x: 8, y: 0, z: 0 };

// Posiciones de entrada/salida (fijas e inmutables)
const GARDEN_EXIT_POSITION: Position = { x: 0, y: 0, z: -5 };   // Frente al huerto (CORREGIDO)
const MARKET_EXIT_POSITION: Position = { x: -8, y: 0, z: 3 };   // Frente al mercado
const KITCHEN_EXIT_POSITION: Position = { x: 8, y: 0, z: 3 };   // Frente a la cocina

// Funciones de acceso consistentes para todos los edificios
export const getGardenPosition = () => GARDEN_POSITION;
export const getMarketPosition = () => MARKET_POSITION;
export const getKitchenPosition = () => KITCHEN_POSITION;

// Funciones de acceso para posiciones de salida
export const getGardenExitPosition = () => GARDEN_EXIT_POSITION;
export const getMarketExitPosition = () => MARKET_EXIT_POSITION;
export const getKitchenExitPosition = () => KITCHEN_EXIT_POSITION;

// Componente principal de edificios
const Buildings = () => {
  const { setMarketPosition, setKitchenPosition } = useFoodStore();
  const { enterBuilding } = useGameStateStore();
  
  // Posiciones predefinidas para edificios - Usar constantes globales
  const marketPos: [number, number, number] = [MARKET_POSITION.x, MARKET_POSITION.y, MARKET_POSITION.z];
  const kitchenPos: [number, number, number] = [KITCHEN_POSITION.x, KITCHEN_POSITION.y, KITCHEN_POSITION.z];
  const gardenPos: [number, number, number] = [GARDEN_POSITION.x, GARDEN_POSITION.y, GARDEN_POSITION.z];
  
  // Manejadores de clics para cada edificio
  const handleMarketClick = (e: any) => {
    console.log("🏢 Mercado clickeado: moviéndose hacia él...");
    if (e && e.stopPropagation) e.stopPropagation();
    
    // Crear punto de destino frente al mercado
    const targetPoint = new THREE.Vector3(
      marketPos[0],
      0,
      marketPos[2] + 3 // Posición frente a la entrada
    );
    
    // Obtener referencias al player para mover
    const { setTargetPosition, setIsMovingToTarget, setDestinationBuilding } = usePlayerStore.getState();
    
    // Configurar el movimiento hacia el mercado
    setTargetPosition(targetPoint);
    setIsMovingToTarget(true);
    setDestinationBuilding("market"); // Indica que debe entrar al mercado al llegar
  };
  
  const handleKitchenClick = (e: any) => {
    console.log("🏢 Cocina clickeada: moviéndose hacia ella...");
    if (e && e.stopPropagation) e.stopPropagation();
    
    // Crear punto de destino frente a la cocina
    const targetPoint = new THREE.Vector3(
      kitchenPos[0],
      0,
      kitchenPos[2] + 3 // Posición frente a la entrada
    );
    
    // Obtener referencias al player para mover
    const { setTargetPosition, setIsMovingToTarget, setDestinationBuilding } = usePlayerStore.getState();
    
    // Configurar el movimiento hacia la cocina
    setTargetPosition(targetPoint);
    setIsMovingToTarget(true);
    setDestinationBuilding("kitchen"); // Indica que debe entrar a la cocina al llegar
  };
  
  const handleGardenClick = (e: any) => {
    console.log("🏢 Huerto clickeado: moviéndose hacia él...");
    if (e && e.stopPropagation) e.stopPropagation();
    
    // Crear punto de destino frente al huerto (misma lógica que mercado y cocina)
    const targetPoint = new THREE.Vector3(
      gardenPos[0],
      0,
      gardenPos[2] + 3 // Posición frente a la entrada
    );
    
    // Obtener referencias al player para mover
    const { setTargetPosition, setIsMovingToTarget, setDestinationBuilding } = usePlayerStore.getState();
    
    // Configurar el movimiento hacia el huerto
    setTargetPosition(targetPoint);
    setIsMovingToTarget(true);
    setDestinationBuilding("garden"); // Indica que debe entrar al huerto al llegar
  };
  
  // Gimnasio eliminado
  
  // Registrar posiciones en el store
  useEffect(() => {
    setMarketPosition({ x: marketPos[0], y: marketPos[1], z: marketPos[2] });
    setKitchenPosition({ x: kitchenPos[0], y: kitchenPos[1], z: kitchenPos[2] });
    // Ya no necesitamos actualizar gardenPosition porque ahora es constante
  }, [setMarketPosition, setKitchenPosition]);
  
  return (
    <group>
      
      {/* Market Building */}
      <group position={marketPos}>
        {/* Ya no hay área clickeable para todo el edificio */}
        
        {/* Puertas dobles - mejoradas para ser más interactivas */}
        <group position={[0, 0, 2.5]}>
          {/* Área clickeable más grande para las puertas */}
          <mesh 
            onClick={(e) => {
              e.stopPropagation(); // Evitar propagación
              handleMarketClick(e);
            }}
            onPointerOver={(e) => e.stopPropagation()}
            position={[0, 1.5, 0.5]} // Posición ligeramente adelantada
            name="market_doors_clickable"
          >
            <boxGeometry args={[2.5, 3, 1]} /> {/* Más grande para facilitar interacción */}
            <meshStandardMaterial color="#8B4513" opacity={0.7} transparent={true} />
          </mesh>
          
          {/* Puertas visibles */}
          <mesh position={[-0.6, 1, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.8, 2, 0.1]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          
          <mesh position={[0.6, 1, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.8, 2, 0.1]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          
          {/* Letrero encima de la puerta */}
          <Text
            position={[0, 2.7, 0]}
            rotation={[0, 0, 0]}
            fontSize={0.5}
            color="#FFD700"
            anchorX="center"
            anchorY="middle"
          >
            ENTER
          </Text>
        </group>
        
        {/* Market base/stall */}
        <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
          <boxGeometry args={[5, 3, 4]} />
          <meshStandardMaterial color="#CD853F" />
        </mesh>
        
        {/* Market roof */}
        <mesh castShadow position={[0, 3.5, 0]}>
          <boxGeometry args={[6, 1, 5]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        
        {/* Market sign - Integrado en el edificio */}
        <Text
          position={[0, 4.2, 2.1]} // Posición frontal
          rotation={[0, 0, 0]}
          fontSize={0.8}
          color="#F5DEB3"
          anchorX="center"
          anchorY="middle"
        >
          MERCADO
        </Text>

        {/* Food display area */}
        <mesh position={[0, 1.5, 2.1]} rotation={[0, 0, 0]}>
          <boxGeometry args={[4, 0.2, 0.5]} />
          <meshStandardMaterial color="#A0522D" />
        </mesh>
        
        {/* Stylized food items */}
        <group position={[0, 1.7, 2.1]}>
          {/* Apples */}
          <mesh position={[-1.5, 0, 0]} castShadow>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshStandardMaterial color="red" />
          </mesh>
          
          {/* Bananas */}
          <mesh position={[-1, 0, 0]} castShadow rotation={[0, 0, Math.PI / 4]}>
            <cylinderGeometry args={[0.05, 0.15, 0.6, 8]} />
            <meshStandardMaterial color="yellow" />
          </mesh>
          
          {/* Bread */}
          <mesh position={[0, 0, 0]} castShadow>
            <capsuleGeometry args={[0.15, 0.4, 4, 8]} />
            <meshStandardMaterial color="#D2691E" />
          </mesh>
          
          {/* Carrot */}
          <mesh position={[1, 0, 0]} castShadow rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.1, 0.5, 8]} />
            <meshStandardMaterial color="orange" />
          </mesh>
          
          {/* Broccoli */}
          <mesh position={[1.5, 0, 0]} castShadow>
            <group>
              <mesh position={[0, 0.1, 0]}>
                <cylinderGeometry args={[0.05, 0.1, 0.2, 8]} />
                <meshStandardMaterial color="#8B4513" />
              </mesh>
              <mesh position={[0, 0.3, 0]}>
                <sphereGeometry args={[0.2, 8, 8]} />
                <meshStandardMaterial color="green" />
              </mesh>
            </group>
          </mesh>
        </group>
      </group>
      
      {/* Kitchen Building */}
      <group position={kitchenPos}>
        {/* Ya no hay área clickeable para todo el edificio */}
        
        {/* Puertas dobles - mejoradas para ser más interactivas */}
        <group position={[0, 0, 2.5]}>
          {/* Área clickeable más grande para las puertas */}
          <mesh 
            onClick={(e) => {
              e.stopPropagation(); // Evitar propagación
              handleKitchenClick(e);
            }}
            onPointerOver={(e) => e.stopPropagation()}
            position={[0, 1.5, 0.5]} // Posición ligeramente adelantada
            name="kitchen_doors_clickable"
          >
            <boxGeometry args={[2.5, 3, 1]} /> {/* Más grande para facilitar interacción */}
            <meshStandardMaterial color="#8B4513" opacity={0.7} transparent={true} />
          </mesh>
          
          {/* Puertas visibles */}
          <mesh position={[-0.6, 1, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.8, 2, 0.1]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          
          <mesh position={[0.6, 1, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.8, 2, 0.1]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          
          {/* Letrero encima de la puerta */}
          <Text
            position={[0, 2.7, 0]}
            rotation={[0, 0, 0]}
            fontSize={0.5}
            color="#FFD700"
            anchorX="center"
            anchorY="middle"
          >
            ENTER
          </Text>
        </group>
        
        {/* Kitchen base */}
        <mesh castShadow receiveShadow position={[0, 2, 0]}>
          <boxGeometry args={[6, 4, 5]} />
          <meshStandardMaterial color="#F5F5DC" />
        </mesh>
        
        {/* Kitchen roof */}
        <mesh castShadow position={[0, 4.5, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[4, 2, 4]} />
          <meshStandardMaterial color="#8B0000" />
        </mesh>
        
        {/* Kitchen door */}
        <mesh position={[0, 1.5, 2.51]}>
          <boxGeometry args={[1.5, 3, 0.1]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        
        {/* Kitchen windows */}
        <mesh position={[2, 2.5, 2.51]}>
          <boxGeometry args={[1.2, 1.2, 0.1]} />
          <meshStandardMaterial color="#ADD8E6" opacity={0.7} transparent />
        </mesh>
        
        <mesh position={[-2, 2.5, 2.51]}>
          <boxGeometry args={[1.2, 1.2, 0.1]} />
          <meshStandardMaterial color="#ADD8E6" opacity={0.7} transparent />
        </mesh>
        
        {/* Kitchen sign - Integrado en el edificio */}
        <Text
          position={[0, 5.5, 2.6]} // Posición frontal
          rotation={[0, 0, 0]}
          fontSize={0.8}
          color="#F5DEB3"
          anchorX="center"
          anchorY="middle"
        >
          COCINA
        </Text>
      </group>
      
      {/* Garden - Con puerta clickeable mejorada */}
      <group position={gardenPos}>
        {/* Ya no hay área clickeable invisible para todo el huerto */}
        
        {/* Puertas dobles - mejoradas para ser más interactivas */}
        <group position={[0, 0, 2.5]}>
          {/* Área clickeable más grande para las puertas */}
          <mesh 
            onClick={(e) => {
              e.stopPropagation(); // Evitar propagación
              handleGardenClick(e);
            }}
            onPointerOver={(e) => e.stopPropagation()}
            position={[0, 1.5, 0.5]} // Posición ligeramente adelantada
            name="garden_doors_clickable"
          >
            <boxGeometry args={[2.5, 3, 1]} /> {/* Más grande para facilitar interacción */}
            <meshStandardMaterial color="#8B4513" opacity={0.7} transparent={true} />
          </mesh>
          
          {/* Puertas visibles */}
          <mesh position={[-0.6, 1, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.8, 2, 0.1]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          
          <mesh position={[0.6, 1, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.8, 2, 0.1]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          
          {/* Letrero encima de la puerta */}
          <Text
            position={[0, 2.7, 0]}
            rotation={[0, 0, 0]}
            fontSize={0.5}
            color="#FFD700"
            anchorX="center"
            anchorY="middle"
          >
            ENTER
          </Text>
        </group>
        
        {/* Garden surface */}
        <mesh 
          receiveShadow 
          position={[0, 0.01, 0]} 
          rotation={[-Math.PI / 2, 0, 0]}
          name="gardenSurface"
        >
          <planeGeometry args={[12, 12]} />
          <meshStandardMaterial color="#7D5A38" />
        </mesh>
        
        {/* Cultivable area */}
        <mesh 
          receiveShadow 
          position={[0, 0.02, 0]} 
          rotation={[-Math.PI / 2, 0, 0]}
          name="gardenSurface"
        >
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#553311" />
        </mesh>
        
        {/* Grid */}
        <mesh 
          receiveShadow 
          position={[0, 0.03, 0]} 
          rotation={[-Math.PI / 2, 0, 0]}
          name="gardenSurface"
        >
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#6B4423" wireframe={true} />
        </mesh>
        
        {/* Sign */}
        <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
          <boxGeometry args={[4, 1, 0.15]} />
          <meshStandardMaterial color="#A0522D" />
        </mesh>
        
        {/* Letrero frontal del huerto integrado en la estructura */}
        <Text
          position={[0, 2.5, 2.1]} // Movido al frente y elevado para mayor visibilidad 
          rotation={[0, 0, 0]}
          fontSize={0.9}
          color="#FFDD33"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          HUERTO VIRTUAL
        </Text>
        
        {/* Decorative plants */}
        <group position={[-4, 0, -4]}>
          <mesh castShadow position={[0, 0.3, 0]}>
            <boxGeometry args={[0.8, 0.6, 0.8]} />
            <meshStandardMaterial color="#5D4037" />
          </mesh>
          <mesh castShadow position={[0, 0.8, 0]}>
            <sphereGeometry args={[0.6, 8, 8]} />
            <meshStandardMaterial color="#2E7D32" />
          </mesh>
        </group>
        
        <group position={[4, 0, -4]}>
          <mesh castShadow position={[0, 0.3, 0]}>
            <boxGeometry args={[0.8, 0.6, 0.8]} />
            <meshStandardMaterial color="#5D4037" />
          </mesh>
          <mesh castShadow position={[0, 0.9, 0]}>
            <coneGeometry args={[0.5, 1, 4]} />
            <meshStandardMaterial color="#33691E" />
          </mesh>
        </group>
        
        <group position={[-4, 0, 4]}>
          <mesh castShadow position={[0, 0.2, 0]}>
            <boxGeometry args={[0.7, 0.4, 0.7]} />
            <meshStandardMaterial color="#5D4037" />
          </mesh>
          <mesh castShadow position={[0, 0.7, 0]}>
            <sphereGeometry args={[0.4, 8, 8]} />
            <meshStandardMaterial color="#689F38" />
          </mesh>
        </group>
        
        <group position={[4, 0, 4]}>
          <mesh castShadow position={[0, 0.25, 0]}>
            <boxGeometry args={[0.7, 0.5, 0.7]} />
            <meshStandardMaterial color="#5D4037" />
          </mesh>
          <mesh castShadow position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 1.2, 8]} />
            <meshStandardMaterial color="#795548" />
          </mesh>
          <mesh castShadow position={[0, 1.2, 0]}>
            <sphereGeometry args={[0.5, 8, 8]} />
            <meshStandardMaterial color="#8BC34A" />
          </mesh>
        </group>
      </group>
      
      {/* Instrucciones eliminadas - ahora están en el botón de información */}
      
      {/* Indicadores sobre edificios eliminados - ahora solo se identifican visualmente */}
      
      {/* Etiqueta del huerto también eliminada */}
    </group>
  );
};

export default Buildings;
