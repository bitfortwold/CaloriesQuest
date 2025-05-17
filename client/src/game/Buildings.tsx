import * as THREE from "three";
import { useEffect, useState } from "react";
import { Text } from "@react-three/drei"; 
import { useFoodStore } from "../stores/useFoodStore";
import { useGameStateStore } from "../stores/useGameStateStore";

// Creamos una interfaz para la posición del huerto
interface GardenPosition {
  x: number;
  y: number;
  z: number;
}

// Función global para acceder a la posición del huerto desde otros componentes
let gardenPosition: GardenPosition = { x: 0, y: 0, z: -8 };
export const getGardenPosition = () => gardenPosition;

const Buildings = () => {
  const { setMarketPosition, setKitchenPosition } = useFoodStore();
  // Usar colores en lugar de texturas para simplificar
  const woodColor = "#8B4513";  // Marrón para madera
  const groundColor = "#654321"; // Marrón para tierra
  
  // Set predefined positions for buildings
  const marketPos = new THREE.Vector3(-8, 0, 0);
  const kitchenPos = new THREE.Vector3(8, 0, 0);
  const gardenPos = new THREE.Vector3(0, 0, -8); // Posición del huerto detrás del punto de inicio
  
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
      
      {/* Garden Building - Version Mejorada */}
      <group position={gardenPos}>
        {/* Suelo/Base del Huerto - Aumentado el tamaño */}
        <mesh receiveShadow position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[8, 8]} />
          <meshStandardMaterial color="#7D5A38" />
        </mesh>
        
        {/* Suelo Cultivable Interior - Color diferente */}
        <mesh receiveShadow position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[7, 7]} />
          <meshStandardMaterial color="#553311" />
        </mesh>
        
        {/* Estructura de valla del Huerto - Aumentada */}
        <mesh castShadow receiveShadow position={[0, 0.6, -4]}>
          <boxGeometry args={[8, 1.2, 0.3]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        
        <mesh castShadow receiveShadow position={[0, 0.6, 4]}>
          <boxGeometry args={[8, 1.2, 0.3]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        
        <mesh castShadow receiveShadow position={[-4, 0.6, 0]}>
          <boxGeometry args={[0.3, 1.2, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        
        <mesh castShadow receiveShadow position={[4, 0.6, 0]}>
          <boxGeometry args={[0.3, 1.2, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        
        {/* Punto de entrada visible (círculo brillante) - Completamente separado de la puerta */}
        <mesh 
          receiveShadow 
          position={[0, 0.07, 6.5]} 
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <circleGeometry args={[1.5, 32]} />
          <meshStandardMaterial color="#FFDD55" emissive="#FFDD55" emissiveIntensity={0.6} />
        </mesh>
        
        {/* Texto en el punto de entrada */}
        <Text
          position={[0, 0.3, 6.5]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.5}
          color="#8B4513"
          anchorX="center"
          anchorY="middle"
        >
          ENTRAR
        </Text>
        
        {/* Garden Door - Increased size */}
        <group position={[0, 0.6, 4]} rotation={[0, Math.PI / 8, 0]}>
          {/* Door Frame */}
          <mesh 
            castShadow 
            receiveShadow 
            position={[0, 0, 0]}
          >
            <boxGeometry args={[2, 1.2, 0.15]} />
            <meshStandardMaterial color="#A52A2A" />
          </mesh>
          
          {/* Door Handle */}
          <mesh 
            castShadow 
            receiveShadow 
            position={[0.6, 0, 0.08]}
          >
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
          </mesh>
          
          {/* Door Exit Sign - Bigger and more visible */}
          <Text
            position={[0, 0.3, 0.08]}
            rotation={[0, 0, 0]}
            fontSize={0.3}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
          >
            SALIR
          </Text>
        </group>
        
        {/* Garden Sign - Mejorado */}
        <mesh castShadow position={[0, 2, -4.2]}>
          <boxGeometry args={[3, 1.2, 0.2]} />
          <meshStandardMaterial color="#A0522D" />
        </mesh>
        
        <Text
          position={[0, 2, -4.3]}
          rotation={[0, 0, 0]}
          fontSize={0.7}
          color="#F5DEB3"
          anchorX="center"
          anchorY="middle"
        >
          HUERTO
        </Text>
        
        {/* Plantas decorativas más grandes y variadas */}
        {/* Planta 1 */}
        <group position={[-2.5, 0, -2.5]}>
          <mesh castShadow position={[0, 0.3, 0]}>
            <boxGeometry args={[0.8, 0.6, 0.8]} />
            <meshStandardMaterial color="#5D4037" />
          </mesh>
          <mesh castShadow position={[0, 0.8, 0]}>
            <sphereGeometry args={[0.6, 8, 8]} />
            <meshStandardMaterial color="#2E7D32" />
          </mesh>
        </group>
        
        {/* Planta 2 */}
        <group position={[2, 0, 2]}>
          <mesh castShadow position={[0, 0.3, 0]}>
            <boxGeometry args={[0.8, 0.6, 0.8]} />
            <meshStandardMaterial color="#5D4037" />
          </mesh>
          <mesh castShadow position={[0, 0.9, 0]}>
            <coneGeometry args={[0.5, 1, 4]} />
            <meshStandardMaterial color="#33691E" />
          </mesh>
        </group>
        
        {/* Planta 3 */}
        <group position={[-1.5, 0, 1.5]}>
          <mesh castShadow position={[0, 0.2, 0]}>
            <boxGeometry args={[0.7, 0.4, 0.7]} />
            <meshStandardMaterial color="#5D4037" />
          </mesh>
          <mesh castShadow position={[0, 0.7, 0]}>
            <sphereGeometry args={[0.4, 8, 8]} />
            <meshStandardMaterial color="#689F38" />
          </mesh>
        </group>
        
        {/* Planta 4 - Nueva */}
        <group position={[1.8, 0, -2.2]}>
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
