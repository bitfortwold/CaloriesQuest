import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { usePlayerStore } from '../stores/usePlayerStore';
import { getMarketPosition, getKitchenPosition, getGardenPosition } from './Buildings';

// Configuración de los edificios para navegación
const buildings = [
  { 
    name: "market", 
    position: getMarketPosition(), 
    size: new THREE.Vector3(5, 3, 4) 
  },
  { 
    name: "kitchen", 
    position: getKitchenPosition(), 
    size: new THREE.Vector3(6, 3, 5) 
  },
  { 
    name: "garden", 
    position: getGardenPosition(), 
    size: new THREE.Vector3(8, 3, 6) 
  }
];

/**
 * SmartNavigation - Componente para gestionar el movimiento inteligente del jugador
 */
const SmartNavigation = () => {
  const { camera } = useThree();
  const playerRef = useRef<THREE.Group>(null);
  
  // Obtener estados y funciones del store
  const { 
    playerPosition, 
    setPlayerPosition,
    setRotationY,
    targetPosition,
    isMovingToTarget
  } = usePlayerStore();
  
  useFrame(() => {
    if (!isMovingToTarget || !targetPosition) return;
    
    // Crear posición actual del jugador como Vector3
    const currentPosition = new THREE.Vector3(
      playerPosition.x, 
      playerPosition.y, 
      playerPosition.z
    );
    
    // Vector dirección hacia el objetivo
    const targetPos = new THREE.Vector3(
      targetPosition.x,
      targetPosition.y,
      targetPosition.z
    );
    
    const direction = new THREE.Vector3()
      .subVectors(targetPos, currentPosition)
      .normalize();
    
    // Distancia al objetivo
    const distanceToTarget = currentPosition.distanceTo(targetPos);
    
    // Si llegamos al objetivo, detenemos el movimiento
    if (distanceToTarget < 0.2) {
      console.log("🏁 Destino alcanzado");
      usePlayerStore.getState().setIsMovingToTarget(false);
      return;
    }
    
    // Verificar colisiones con edificios y ajustar la dirección
    let avoidanceDirection = new THREE.Vector3();
    let needsAvoidance = false;
    
    for (const building of buildings) {
      const buildingPosition = new THREE.Vector3(
        building.position.x,
        building.position.y,
        building.position.z
      );
      
      // Distancia entre el jugador y el edificio
      const distanceToBuilding = currentPosition.distanceTo(buildingPosition);
      
      // Radio de colisión (diagonal del edificio / 2 + margen de seguridad)
      const collisionRadius = Math.sqrt(
        building.size.x * building.size.x + 
        building.size.z * building.size.z
      ) / 2 + 1.5; // Margen adicional
      
      // Si estamos cerca del edificio, aplicamos fuerza de repulsión
      if (distanceToBuilding < collisionRadius) {
        // Vector desde el edificio hasta el jugador (dirección de repulsión)
        const repulsionDirection = new THREE.Vector3()
          .subVectors(currentPosition, buildingPosition)
          .normalize();
        
        // Fuerza inversamente proporcional a la distancia
        const repulsionStrength = 1 - (distanceToBuilding / collisionRadius);
        
        // Añadir fuerza de repulsión a la dirección de evasión
        avoidanceDirection.add(
          repulsionDirection.multiplyScalar(repulsionStrength * 2)
        );
        
        needsAvoidance = true;
      }
      
      // Verificar si el edificio está en la trayectoria directa hacia el objetivo
      const playerToTarget = new THREE.Vector3().subVectors(targetPos, currentPosition);
      const playerToBuilding = new THREE.Vector3().subVectors(buildingPosition, currentPosition);
      
      // Proyección del edificio sobre la dirección al objetivo
      const projectionLength = playerToBuilding.dot(direction);
      
      // Si la proyección está dentro del rango de interés y el edificio está cerca de la línea
      if (projectionLength > 0 && projectionLength < distanceToTarget) {
        // Punto más cercano en la línea al edificio
        const projectionPoint = new THREE.Vector3()
          .copy(currentPosition)
          .add(direction.clone().multiplyScalar(projectionLength));
        
        // Distancia del edificio a la línea de trayectoria
        const lateralDistance = new THREE.Vector3()
          .subVectors(buildingPosition, projectionPoint)
          .length();
        
        // Si el edificio está lo suficientemente cerca de la trayectoria
        if (lateralDistance < collisionRadius) {
          // Determinar de qué lado rodear (producto cruz para saber izquierda/derecha)
          const crossProduct = new THREE.Vector3()
            .crossVectors(direction, playerToBuilding)
            .y;
          
          // Vector perpendicular a la dirección para esquivar
          const avoidDir = new THREE.Vector3(-direction.z, 0, direction.x);
          if (crossProduct < 0) {
            avoidDir.multiplyScalar(-1); // Invertir si necesario
          }
          
          // Añadir al vector de evasión
          avoidanceDirection.add(avoidDir);
          needsAvoidance = true;
        }
      }
    }
    
    // Determinar dirección final combinando dirección al objetivo y evasión
    let finalDirection;
    
    if (needsAvoidance) {
      // Normalizar dirección de evasión
      avoidanceDirection.normalize();
      
      // Combinar dirección original y evasión (70% evasión, 30% hacia objetivo)
      finalDirection = new THREE.Vector3()
        .addVectors(
          avoidanceDirection.multiplyScalar(0.7),
          direction.multiplyScalar(0.3)
        )
        .normalize();
        
      console.log("🧭 Rodeando obstáculos", finalDirection);
    } else {
      // Sin obstáculos, usar dirección directa
      finalDirection = direction;
    }
    
    // Velocidad constante
    const PLAYER_SPEED = 0.1;
    
    // Aplicar movimiento
    const newPosition = {
      x: playerPosition.x + finalDirection.x * PLAYER_SPEED,
      y: playerPosition.y,
      z: playerPosition.z + finalDirection.z * PLAYER_SPEED
    };
    
    // Actualizar posición y rotación
    setPlayerPosition(newPosition);
    setRotationY(Math.atan2(finalDirection.x, finalDirection.z));
  });
  
  return null; // Este componente no renderiza nada, solo maneja la lógica
};

export default SmartNavigation;