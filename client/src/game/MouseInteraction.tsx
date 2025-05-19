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
      
      // Obtener el destino actual del edificio
      const currentDestinationBuilding = usePlayerStore.getState().destinationBuilding;
      
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
          
          // Obtener el nombre del objeto para análisis
          const objectName = intersects[0].object.name || '';
          const clickPoint = intersects[0].point.clone();
          const playerPos = usePlayerStore.getState().playerPosition;
          
          // Detectar si el usuario ha hecho clic en un edificio (no en una puerta)
          const isBuilding = 
            objectName.includes('market') || 
            objectName.includes('kitchen') || 
            objectName.includes('garden') ||
            objectName.includes('building');
            
          if (isBuilding && !objectName.includes('_doors_clickable')) {
            console.log(`🏢 Edificio clickeado: ${objectName} - encontrando punto seguro`);
            
            // Calcular qué edificio es basado en su nombre
            let buildingType = '';
            if (objectName.includes('market')) buildingType = 'market';
            else if (objectName.includes('kitchen')) buildingType = 'kitchen';
            else if (objectName.includes('garden')) buildingType = 'garden';
            
            console.log(`🏢 ${buildingType} clickeado: moviéndose hacia ella...`);
            
            // Obtener posición del edificio
            let buildingPos;
            let buildingWidth = 5;
            let buildingDepth = 4;
            
            if (buildingType === 'market') {
              buildingPos = { x: -8, y: 0, z: 0 };
              buildingWidth = 5;
              buildingDepth = 4;
            } 
            else if (buildingType === 'kitchen') {
              buildingPos = { x: 8, y: 0, z: 0 };
              buildingWidth = 6;
              buildingDepth = 5;
            } 
            else if (buildingType === 'garden') {
              buildingPos = { x: 0, y: 0, z: -15 };
              buildingWidth = 8;
              buildingDepth = 6;
            }
            
            // Configurar como destino la puerta, no el edificio donde hizo clic
            if (buildingPos) {
              const targetPos = new THREE.Vector3(buildingPos.x, 0, buildingPos.z + 2.5);
              console.log(`🛡️ Dirigiéndose a la puerta: ${JSON.stringify(targetPos)}`);
              setTargetPosition(targetPos);
              // Importante: establecer el edificio como destino para entrar cuando llegue
              setDestinationBuilding(buildingType);
            } else {
              // Punto normal en caso de no poder identificar el edificio
              console.log(`🚶 Moviendo a punto en el mundo: ${JSON.stringify(clickPoint)}`);
              setTargetPosition(clickPoint);
            }
          } else {
            // Verificar si el clic implica atravesar un edificio, lo que requeriría rodearlo
            const directPath = new THREE.Vector3().subVectors(clickPoint, new THREE.Vector3(playerPos.x, 0, playerPos.z));
            const distance = directPath.length();
            
            // Solo implementamos la navegación inteligente para clics más allá de cierta distancia
            if (distance > 5) {
              // Verificar si hay edificios en el camino
              const buildings = [
                { name: "market", pos: { x: -8, y: 0, z: 0 }, width: 5, depth: 4 },
                { name: "kitchen", pos: { x: 8, y: 0, z: 0 }, width: 6, depth: 5 },
                { name: "garden", pos: { x: 0, y: 0, z: -15 }, width: 8, depth: 6 }
              ];
              
              // Determinar si algún edificio está en la trayectoria directa
              let buildingInPath = false;
              let pathBuilding = null;
              
              for (const building of buildings) {
                // Verificar si la línea recta entre el jugador y el destino 
                // pasa a través del edificio (aproximación simple)
                
                // Calculamos la distancia del edificio a la línea que va del jugador al punto objetivo
                const playerToTarget = new THREE.Vector3(clickPoint.x - playerPos.x, 0, clickPoint.z - playerPos.z);
                const playerToBuilding = new THREE.Vector3(building.pos.x - playerPos.x, 0, building.pos.z - playerPos.z);
                
                // Proyección del vector jugador-edificio sobre el vector jugador-objetivo
                const dotProduct = playerToTarget.dot(playerToBuilding);
                const targetLengthSq = playerToTarget.lengthSq();
                const projection = dotProduct / targetLengthSq;
                
                // Si la proyección está entre 0 y 1, el edificio está entre el jugador y el objetivo
                if (projection > 0 && projection < 1) {
                  // Calcular el punto más cercano en la línea
                  const closestPoint = new THREE.Vector3(
                    playerPos.x + playerToTarget.x * projection,
                    0,
                    playerPos.z + playerToTarget.z * projection
                  );
                  
                  // Distancia del edificio a la línea
                  const distanceToLine = new THREE.Vector3(
                    closestPoint.x - building.pos.x,
                    0,
                    closestPoint.z - building.pos.z
                  ).length();
                  
                  // Si la distancia es menor que el ancho o profundidad del edificio 
                  // (más un pequeño margen), hay colisión
                  const buildingRadius = Math.max(building.width, building.depth) / 2 + 1;
                  
                  if (distanceToLine < buildingRadius) {
                    buildingInPath = true;
                    pathBuilding = building;
                    break;
                  }
                }
              }
              
              if (buildingInPath && pathBuilding) {
                console.log(`🚧 Edificio ${pathBuilding.name} detectado en el camino, calculando ruta alternativa`);
                
                // Calcular puntos de navegación alrededor del edificio
                const SAFETY_MARGIN = 4;
                const buildingWidth = pathBuilding.width;
                const buildingDepth = pathBuilding.depth;
                const buildingPos = pathBuilding.pos;
                
                // Calcular cuatro puntos alrededor del edificio (izquierda, derecha, arriba, abajo)
                const navPoints = [
                  { x: buildingPos.x - buildingWidth/2 - SAFETY_MARGIN, z: buildingPos.z, name: "izquierda" },
                  { x: buildingPos.x + buildingWidth/2 + SAFETY_MARGIN, z: buildingPos.z, name: "derecha" },
                  { x: buildingPos.x, z: buildingPos.z - buildingDepth/2 - SAFETY_MARGIN, name: "frente" },
                  { x: buildingPos.x, z: buildingPos.z + buildingDepth/2 + SAFETY_MARGIN, name: "atrás" }
                ];
                
                // Encontrar el punto de navegación más cercano al destino final
                let bestPoint = navPoints[0];
                let bestDistance = Number.MAX_VALUE;
                
                for (const point of navPoints) {
                  const dist = Math.sqrt(
                    Math.pow(clickPoint.x - point.x, 2) + 
                    Math.pow(clickPoint.z - point.z, 2)
                  );
                  
                  if (dist < bestDistance) {
                    bestDistance = dist;
                    bestPoint = point;
                  }
                }
                
                console.log(`🧭 Rodeando por el lado ${bestPoint.name} para llegar al destino`);
                
                // Usar ese punto como destino intermedio
                // El sistema de navegación debería llevarnos a ese punto y luego al destino final
                setTargetPosition(new THREE.Vector3(bestPoint.x, 0, bestPoint.z));
                
                // Guardar el destino final para usarlo una vez que llegue al punto intermedio
                // (esto debería implementarse en Player.tsx para cambiar al destino final al llegar)
                localStorage.setItem('finalDestination', JSON.stringify({x: clickPoint.x, y: 0, z: clickPoint.z}));
              } else {
                // No hay obstáculos, ir directamente al punto
                console.log(`🚶 Camino libre, moviendo a punto en el mundo: ${JSON.stringify(clickPoint)}`);
                setTargetPosition(clickPoint);
              }
            } else {
              // Para distancias cortas, simplemente ir directo
              console.log(`🚶 Moviendo a punto cercano: ${JSON.stringify(clickPoint)}`);
              setTargetPosition(clickPoint);
            }
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