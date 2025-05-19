import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePlayerStore } from '../stores/usePlayerStore';

/**
 * SmartNavigation - Componente simplificado para movimiento inteligente
 * Permite al jugador rodear edificios y obstáculos
 */
const SmartNavigation = () => {
  // Definición de edificios para detección de colisiones
  const buildings = [
    { 
      name: "market", 
      position: new THREE.Vector3(-8, 0, 0), 
      radius: 3.5  // Radio de colisión aproximado
    },
    { 
      name: "kitchen", 
      position: new THREE.Vector3(8, 0, 0), 
      radius: 4
    },
    { 
      name: "garden", 
      position: new THREE.Vector3(0, 0, -15), 
      radius: 5
    }
  ];
  
  // Guardar la ruta: [punto actual, punto destino]
  const pathRef = useRef<THREE.Vector3[]>([]);
  
  // Hook principal de animación
  useFrame(() => {
    // Obtener el estado actual del jugador
    const {
      playerPosition,
      targetPosition,
      isMovingToTarget
    } = usePlayerStore.getState();
    
    // Si no estamos en movimiento o no hay objetivo, salir
    if (!isMovingToTarget || !targetPosition) return;
    
    // Convertir posiciones a Vector3 para facilitar cálculos
    const currPos = new THREE.Vector3(playerPosition.x, playerPosition.y, playerPosition.z);
    const targPos = new THREE.Vector3(targetPosition.x, targetPosition.y, targetPosition.z);
    
    // Vector dirección y distancia al objetivo
    const dirToTarget = new THREE.Vector3().subVectors(targPos, currPos).normalize();
    const distToTarget = currPos.distanceTo(targPos);
    
    // Si llegamos al destino, detener movimiento
    if (distToTarget < 0.2) {
      console.log("🏁 Destino alcanzado");
      usePlayerStore.getState().setIsMovingToTarget(false);
      return;
    }
    
    // Verificar colisiones con edificios
    let obstacle = false;
    let steeringForce = new THREE.Vector3();
    
    for (const building of buildings) {
      // Distancia del jugador al edificio
      const buildingDist = currPos.distanceTo(building.position);
      
      // Si estamos cerca del edificio, aplicar fuerza para alejarnos
      if (buildingDist < building.radius + 1.5) {
        const pushDir = new THREE.Vector3()
          .subVectors(currPos, building.position)
          .normalize();
        
        // Fuerza inversamente proporcional a la distancia
        const force = 1 - (buildingDist / (building.radius + 1.5));
        steeringForce.add(pushDir.multiplyScalar(force * 2));
        obstacle = true;
        
        console.log(`🧭 Esquivando ${building.name}`);
      }
    }
    
    // Calcular dirección final combinando objetivo + esquiva
    let moveDirection;
    if (obstacle) {
      // Normalizar la fuerza de esquiva
      steeringForce.normalize();
      
      // Combinar ambas direcciones (70% esquiva, 30% objetivo)
      moveDirection = new THREE.Vector3()
        .addVectors(
          steeringForce.multiplyScalar(0.7),
          dirToTarget.multiplyScalar(0.3)
        )
        .normalize();
    } else {
      // Sin obstáculos, ir directo al objetivo
      moveDirection = dirToTarget;
    }
    
    // Velocidad constante
    const PLAYER_SPEED = 0.1;
    
    // Calcular nueva posición
    const newPos = {
      x: currPos.x + moveDirection.x * PLAYER_SPEED,
      y: currPos.y,
      z: currPos.z + moveDirection.z * PLAYER_SPEED
    };
    
    // Actualizar solo la posición del jugador
    // La rotación se maneja en el componente Player.tsx automáticamente
    usePlayerStore.getState().setPlayerPosition(newPos);
    
    // No intentamos actualizar la rotación aquí, se calcula en Player.tsx
    // basado en el movimiento entre frames
  });
  
  // Este componente no renderiza nada visible
  return null;
};

export default SmartNavigation;