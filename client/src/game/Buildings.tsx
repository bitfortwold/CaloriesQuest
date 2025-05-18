import * as THREE from "three";
import { useEffect, useState } from "react";
import { Text } from "@react-three/drei"; 
import { useFoodStore } from "../stores/useFoodStore";
import { useGameStateStore } from "../stores/useGameStateStore";

// Creamos una interfaz para las posiciones
interface Position {
  x: number;
  y: number;
  z: number;
}

// Función global para acceder a la posición del huerto desde otros componentes
// Movemos el huerto más lejos al fondo
let gardenPosition: Position = { x: 0, y: 0, z: -15 };
export const getGardenPosition = () => gardenPosition;

// Posiciones específicas para la salida de cada edificio
let gardenExitPosition: Position = { x: 0, y: 0, z: -7 }; // Posición en el camino ocre frente al huerto
export const getGardenExitPosition = () => gardenExitPosition;

// Posición para la salida del mercado (en el camino ocre frente al mercado)
let marketExitPosition: Position = { x: -8, y: 0, z: 3 }; // Posición en el camino frente al mercado
export const getMarketExitPosition = () => marketExitPosition;

// Posición para la salida de la cocina (en el camino ocre frente a la cocina)
let kitchenExitPosition: Position = { x: 8, y: 0, z: 3 }; // Posición en el camino frente a la cocina
export const getKitchenExitPosition = () => kitchenExitPosition;

// Ya no usamos el círculo amarillo, ya que implementamos detección de proximidad

const Buildings = () => {
  const { setMarketPosition, setKitchenPosition } = useFoodStore();
  // Usar colores en lugar de texturas para simplificar
  const woodColor = "#8B4513";  // Marrón para madera
  const groundColor = "#654321"; // Marrón para tierra
  
  // Set predefined positions for buildings
  const marketPos = new THREE.Vector3(-8, 0, 0);
  const kitchenPos = new THREE.Vector3(8, 0, 0);
  const gardenPos = new THREE.Vector3(0, 0, -15); // Posición del huerto más lejos al fondo
  
  useEffect(() => {
    // Register building positions in the store
    setMarketPosition({ x: marketPos.x, y: marketPos.y, z: marketPos.z });
    setKitchenPosition({ x: kitchenPos.x, y: kitchenPos.y, z: kitchenPos.z });
    gardenPosition = { x: gardenPos.x, y: gardenPos.y, z: gardenPos.z };
  }, [setMarketPosition, setKitchenPosition]);
  
  return (
    <group>
      {/* Market Building */}
      <group position={marketPos}>
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
      
      {/* Kitchen Building */}
      <group position={kitchenPos}>
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
        
        {/* Kitchen window */}
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
      
      {/* Huerto rediseñado - Simple superficie plana */}
      <group position={gardenPos}>
        {/* Superficie plana principal del huerto - Con ID para detectar clics */}
        <mesh 
          receiveShadow 
          position={[0, 0.01, 0]} 
          rotation={[-Math.PI / 2, 0, 0]}
          name="gardenSurface" // ID para detección de clics
        >
          <planeGeometry args={[12, 12]} />
          <meshStandardMaterial color="#7D5A38" />
        </mesh>
        
        {/* Superficie cultivable central - Con ID para detectar clics */}
        <mesh 
          receiveShadow 
          position={[0, 0.02, 0]} 
          rotation={[-Math.PI / 2, 0, 0]}
          name="gardenSurface" // ID para detección de clics 
        >
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#553311" />
        </mesh>
        
        {/* Cuadrícula de plantación visible - Con ID para detectar clics */}
        <mesh 
          receiveShadow 
          position={[0, 0.03, 0]} 
          rotation={[-Math.PI / 2, 0, 0]}
          name="gardenSurface" // ID para detección de clics
        >
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#6B4423" wireframe={true} />
        </mesh>
        
        {/* Letrero flotante más visible */}
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
        
        {/* Algunas plantas decorativas en las esquinas */}
        {/* Planta esquina 1 */}
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
        
        {/* Planta esquina 2 */}
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
        
        {/* Planta esquina 3 */}
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
        
        {/* Planta esquina 4 */}
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
      
      {/* Interaction hints */}
      <Text
        position={[-8, 5, 0]}
        rotation={[0, 0, 0]}
        fontSize={0.4}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        Press E to interact
      </Text>
      
      <Text
        position={[8, 6, 0]}
        rotation={[0, 0, 0]}
        fontSize={0.4}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        Press E to interact
      </Text>
      
      <Text
        position={[0, 2, -8]}
        rotation={[0, 0, 0]}
        fontSize={0.4}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        Press E to interact
      </Text>
    </group>
  );
};

export default Buildings;
