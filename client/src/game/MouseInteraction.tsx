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
            if (buildingType === 'market') buildingPos = { x: -8, y: 0, z: 0 };
            else if (buildingType === 'kitchen') buildingPos = { x: 8, y: 0, z: 0 };
            else if (buildingType === 'garden') buildingPos = { x: 0, y: 0, z: -15 };
            
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
            // Punto normal en un objeto no-edificio
            console.log(`🚶 Moviendo a punto en el mundo: ${JSON.stringify(clickPoint)}`);
            setTargetPosition(clickPoint);
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