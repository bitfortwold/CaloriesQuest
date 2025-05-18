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

// Variables globales para acceso a posiciones
let gardenPosition: Position = { x: 0, y: 0, z: -15 };
export const getGardenPosition = () => gardenPosition;

// POSICIONES FIJAS PARA SALIDA DE EDIFICIOS
// Estas posiciones son absolutas y no cambian bajo ninguna circunstancia
export const getGardenExitPosition = () => ({ x: 0, y: 0, z: -7 }); // Movido hacia el sur para alejarlo del huerto
export const getMarketExitPosition = () => ({ x: 20, y: 0, z: -10 });
export const getKitchenExitPosition = () => ({ x: -20, y: 0, z: -10 });

// Componente principal de edificios
const Buildings = () => {
  const { setMarketPosition, setKitchenPosition } = useFoodStore();
  const { enterBuilding } = useGameStateStore();
  
  // Posiciones predefinidas para edificios
  const marketPos: [number, number, number] = [-8, 0, 0];
  const kitchenPos: [number, number, number] = [8, 0, 0];
  const gardenPos: [number, number, number] = [0, 0, -15];
  
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
    
    // Crear punto de destino frente al huerto
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
  
  // Registrar posiciones en el store
  useEffect(() => {
    setMarketPosition({ x: marketPos[0], y: marketPos[1], z: marketPos[2] });
    setKitchenPosition({ x: kitchenPos[0], y: kitchenPos[1], z: kitchenPos[2] });
    gardenPosition = { x: gardenPos[0], y: gardenPos[1], z: gardenPos[2] };
  }, [setMarketPosition, setKitchenPosition]);
  
  return (
    <group>
      {/* Market Building - Ahora clickeable */}
      <group position={marketPos}>
        {/* Área clickeable invisible */}
        <mesh 
          onClick={handleMarketClick}
          visible={false}
        >
          <boxGeometry args={[6, 6, 5]} />
          <meshStandardMaterial transparent opacity={0} />
        </mesh>
        
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
        
        {/* Market sign */}
        <Text
          position={[0, 4.2, 0]}
          rotation={[0, 0, 0]}
          fontSize={0.8}
          color="#F5DEB3"
          anchorX="center"
          anchorY="middle"
        >
          MARKET
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
      
      {/* Kitchen Building - Ahora clickeable */}
      <group position={kitchenPos}>
        {/* Área clickeable invisible */}
        <mesh 
          onClick={handleKitchenClick}
          visible={false}
        >
          <boxGeometry args={[6, 6, 5]} />
          <meshStandardMaterial transparent opacity={0} />
        </mesh>
        
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
        
        {/* Kitchen sign */}
        <Text
          position={[0, 5.5, 0]}
          rotation={[0, 0, 0]}
          fontSize={0.8}
          color="#F5DEB3"
          anchorX="center"
          anchorY="middle"
        >
          KITCHEN
        </Text>
      </group>
      
      {/* Garden - Ahora clickeable */}
      <group position={gardenPos}>
        {/* Área clickeable invisible */}
        <mesh 
          onClick={handleGardenClick}
          visible={false}
        >
          <boxGeometry args={[12, 4, 12]} />
          <meshStandardMaterial transparent opacity={0} />
        </mesh>
        
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
        
        <Text
          position={[0, 1.5, 0.1]}
          rotation={[0, 0, 0]}
          fontSize={0.8}
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
      
      {/* Interaction hints - Ahora indicamos que también se puede hacer clic */}
      <Text
        position={[-8, 5, 0]}
        rotation={[0, 0, 0]}
        fontSize={0.4}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        Haz clic para entrar
      </Text>
      
      <Text
        position={[8, 6, 0]}
        rotation={[0, 0, 0]}
        fontSize={0.4}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        Haz clic para entrar
      </Text>
      
      <Text
        position={[0, 2, -8]}
        rotation={[0, 0, 0]}
        fontSize={0.4}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        Haz clic para entrar
      </Text>
    </group>
  );
};

export default Buildings;
