import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { usePlayerStore } from '../stores/usePlayerStore';

function MouseInteraction() {
  const { camera, scene } = useThree();
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const { setTargetPosition, setIsMovingToTarget, setDestinationBuilding } = usePlayerStore.getState();
  
  // Plano horizontal para detección de clics en el suelo
  const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const intersectionPoint = new THREE.Vector3();
  
  useEffect(() => {
    function onMouseMove(event: MouseEvent) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    function onMouseClick(event: MouseEvent) {
      // No procesar clics si el clic fue en un botón o elemento de UI
      if ((event.target as HTMLElement).closest('button') || (event.target as HTMLElement).closest('.modal')) {
        console.log('🖱️ Clic en UI, ignorando para movimiento del jugador');
        return;
      }
      
      // Obtener la posición actual del jugador para el análisis
      const playerPosition = usePlayerStore.getState().playerPosition;
      
      // Obtener información de todos los edificios para análisis de colisiones
      const buildingPositions = [
        { name: "market", pos: { x: -8, y: 0, z: 0 }, width: 5, depth: 4 },
        { name: "kitchen", pos: { x: 8, y: 0, z: 0 }, width: 6, depth: 5 },
        { name: "garden", pos: { x: 0, y: 0, z: -15 }, width: 8, depth: 6 }
      ];
      
      raycaster.setFromCamera(mouse, camera);
      // Aumentamos la precisión del raycaster
      raycaster.params.Line.threshold = 0.1;
      raycaster.params.Points.threshold = 0.1;
      
      // Buscamos todas las intersecciones, no solo la primera
      const intersects = raycaster.intersectObjects(scene.children, true);
      
      // Depuración avanzada
      console.log('🔎 Detectando objetos...');
      console.log(`📏 Encontrados ${intersects.length} objetos en el rayo`);
      
      // Filtrar para priorizar las puertas clicables
      const doorObjects = intersects.filter(obj => {
        const name = obj.object.name || '';
        return name.includes("_doors_clickable");
      });
      
      // Si hay puertas en el rayo, dar prioridad absoluta a las puertas sobre otros objetos
      const hasDoors = doorObjects.length > 0;
      
      if (intersects.length > 0) {
        // Mostrar los primeros 3 objetos para depuración
        for (let i = 0; i < Math.min(3, intersects.length); i++) {
          const obj = intersects[i].object;
          console.log(`🟢 Objeto #${i+1}: ${obj.name || 'sin nombre'} (distancia: ${intersects[i].distance.toFixed(2)})`);
        }
        
        // Obtener el punto de intersección donde se hizo clic
        const clickPoint = intersects[0].point.clone();
        
        // Calcular si hay un edificio bloqueando la línea recta entre el jugador y el punto de clic
        // Esto es crucial para decidir si necesitamos una ruta alternativa
        let blockingBuilding = null;
        
        for (const building of buildingPositions) {
          // Vector desde el jugador al punto de clic
          const directionToClick = new THREE.Vector3(
            clickPoint.x - playerPosition.x,
            0,
            clickPoint.z - playerPosition.z
          ).normalize();
          
          // Distancia del jugador al punto de clic
          const distanceToClick = new THREE.Vector3(
            clickPoint.x - playerPosition.x, 
            0, 
            clickPoint.z - playerPosition.z
          ).length();
          
          // Punto del edificio más cercano a la línea jugador-clic
          // Simplificación: comprobamos si la línea pasa cerca del centro del edificio
          
          // Vector desde el jugador al centro del edificio
          const toBuilding = new THREE.Vector3(
            building.pos.x - playerPosition.x,
            0,
            building.pos.z - playerPosition.z
          );
          
          // Proyectar este vector sobre la dirección de clic
          const projection = toBuilding.dot(directionToClick);
          
          // Si la proyección es negativa o mayor que la distancia al clic,
          // el edificio está detrás del jugador o más allá del punto de clic
          if (projection <= 0 || projection >= distanceToClick) {
            continue;
          }
          
          // Punto en la línea jugador-clic más cercano al centro del edificio
          const closest = new THREE.Vector3(
            playerPosition.x + directionToClick.x * projection,
            0,
            playerPosition.z + directionToClick.z * projection
          );
          
          // Distancia de este punto al centro del edificio
          const distToBuildingCenter = new THREE.Vector3(
            closest.x - building.pos.x,
            0,
            closest.z - building.pos.z
          ).length();
          
          // Si esta distancia es menor que la mitad del ancho o largo del edificio
          // (añadiendo un pequeño margen), hay colisión
          const buildingRadius = Math.max(building.width, building.depth) / 2 + 1;
          
          if (distToBuildingCenter < buildingRadius) {
            blockingBuilding = building;
            break;
          }
        }
        
        // Si hay puertas, usamos la primera puerta (prioridad máxima)
        let intersectedObject;
        
        if (hasDoors) {
          intersectedObject = doorObjects[0].object;
          console.log('🚪 Encontrada puerta clicable, dando prioridad máxima');
        } else {
          intersectedObject = intersects[0].object;
        }
        
        const objectName = intersectedObject.name || 'unnamed';
        
        console.log('Objeto clicado:', objectName);
        
        // Verificar si es una puerta válida o un edificio
        if (objectName.includes("market_doors_clickable")) {
          console.log('🚪 Puerta del Mercado clicada');
          // Usar las posiciones correctas desde Buildings.tsx
          const marketPos = { x: -8, y: 0, z: 0 }; // Posición del mercado
          const targetPos = new THREE.Vector3(marketPos.x, 0, marketPos.z + 2.5);
          console.log(`🎯 Configurando destino: Mercado en ${JSON.stringify(targetPos)}`);
          setTargetPosition(targetPos);
          setIsMovingToTarget(true);
          setDestinationBuilding('market');
        } else if (objectName.includes("kitchen_doors_clickable")) {
          console.log('🚪 Puerta de la Cocina clicada');
          // Usar las posiciones correctas desde Buildings.tsx
          const kitchenPos = { x: 8, y: 0, z: 0 }; // Posición de la cocina
          const targetPos = new THREE.Vector3(kitchenPos.x, 0, kitchenPos.z + 2.5);
          console.log(`🎯 Configurando destino: Cocina en ${JSON.stringify(targetPos)}`);
          setTargetPosition(targetPos);
          setIsMovingToTarget(true);
          setDestinationBuilding('kitchen');
        } else if (objectName.includes("garden_doors_clickable")) {
          console.log('🚪 Puerta del Huerto clicada');
          // Usar las posiciones correctas desde Buildings.tsx
          const gardenPos = { x: 0, y: 0, z: -15 }; // Posición del huerto
          const targetPos = new THREE.Vector3(gardenPos.x, 0, gardenPos.z + 2.5);
          console.log(`🎯 Configurando destino: Huerto en ${JSON.stringify(targetPos)}`);
          setTargetPosition(targetPos);
          setIsMovingToTarget(true);
          setDestinationBuilding('garden');
        } else {
          // Si no es una puerta pero es un objeto, intentar moverse a ese punto
          
          // Punto de clic en el mundo
          const clickPoint = intersects[0].point.clone();
          console.log(`🎯 Punto de clic: ${JSON.stringify(clickPoint)}`);
          
          // Si hay un edificio bloqueando la ruta directa, calcular una ruta alternativa
          if (blockingBuilding) {
            console.log(`🚧 Edificio ${blockingBuilding.name} bloquea la ruta directa - calculando desvío`);
            
            // Calcular el vector perpendicular al vector jugador-edificio para rodear el edificio
            const buildingCenter = new THREE.Vector3(blockingBuilding.pos.x, 0, blockingBuilding.pos.z);
            const playerPos = new THREE.Vector3(playerPosition.x, 0, playerPosition.z);
            
            // Vector desde el jugador al edificio
            const toBuilding = new THREE.Vector3().subVectors(buildingCenter, playerPos).normalize();
            
            // Vector desde el edificio al punto destino
            const toBuildingTarget = new THREE.Vector3().subVectors(clickPoint, buildingCenter).normalize();
            
            // Vector directo desde el jugador al destino
            const directToTarget = new THREE.Vector3().subVectors(clickPoint, playerPos).normalize();
            
            // Crear un vector perpendicular para rodear el edificio
            const perpendicular = new THREE.Vector3(toBuilding.z, 0, -toBuilding.x);
            
            // Tomar el vector perpendicular que está más en dirección del objetivo
            const dotProduct = perpendicular.dot(toBuildingTarget);
            const finalPerpendicular = dotProduct >= 0 ? perpendicular : perpendicular.clone().negate();
            
            // Calcular el radio de seguridad alrededor del edificio - aumentar margen para evitar colisiones
            const SAFETY_MARGIN = 4; // Aumentado para dar más espacio
            const buildingRadius = Math.max(blockingBuilding.width, blockingBuilding.depth) / 2 + SAFETY_MARGIN;
            
            // Crear una mezcla del vector perpendicular (para rodear el edificio) y el vector hacia el destino (para mantener el rumbo)
            // Esto ayuda a crear una curva más natural alrededor del edificio en dirección del objetivo final
            const blendedVector = new THREE.Vector3()
              .addVectors(
                finalPerpendicular.clone().multiplyScalar(0.8), // Vector de desvío (mayor peso)
                directToTarget.clone().multiplyScalar(0.2)      // Vector hacia el destino (menor peso)
              )
              .normalize();
            
            // Calcular el punto de offset usando este vector mezclado
            const pathOffset = blendedVector.clone().multiplyScalar(buildingRadius);
            
            // Añadir el offset al centro del edificio para obtener el punto intermedio
            const waypoint = new THREE.Vector3().addVectors(buildingCenter, pathOffset);
            
            console.log(`🧭 Punto intermedio calculado: ${JSON.stringify(waypoint)}`);
            
            // Establecer el waypoint como posición objetivo inicial
            setTargetPosition(waypoint);
            
            // Almacenar el punto de destino final en localStorage para recogerlo después
            localStorage.setItem('finalDestination', JSON.stringify({
              x: clickPoint.x,
              y: clickPoint.y,
              z: clickPoint.z
            }));
            
            // Aquí deberíamos tener algún sistema para manejar cuando el jugador
            // llega al punto intermedio y debería continuar hacia el destino final
          } else {
            // No hay obstáculos, mover directamente al punto de clic
            console.log(`🚶 Ruta directa disponible - moviéndose al punto: ${JSON.stringify(clickPoint)}`);
            setTargetPosition(clickPoint);
            localStorage.removeItem('finalDestination');
          }
          
          setIsMovingToTarget(true);
        }
      } else {
        // Si no hay intersección con objetos, intentar con el plano del suelo
        raycaster.setFromCamera(mouse, camera);
        if (raycaster.ray.intersectPlane(groundPlane, intersectionPoint)) {
          console.log(`🚶 Moviendo a punto en el suelo: ${JSON.stringify(intersectionPoint)}`);
          const targetPos = new THREE.Vector3().copy(intersectionPoint);
          setTargetPosition(targetPos);
          setIsMovingToTarget(true);
          // Importante: no setear destino de edificio para clics en el suelo
          setDestinationBuilding(null);
        } else {
          console.log('❌ No se detectó ningún punto de destino válido.');
        }
      }
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onMouseClick);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onMouseClick);
    };
  }, [camera, scene]);

  return null;
}

export default MouseInteraction;