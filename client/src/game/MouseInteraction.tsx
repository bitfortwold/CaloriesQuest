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
      
      // Inicializar el raycaster con la posición actual del mouse
      raycaster.setFromCamera(mouse, camera);
      
      // Buscamos todas las intersecciones
      const intersects = raycaster.intersectObjects(scene.children, true);
      
      // Filtrar para encontrar puertas clicables
      const doorObjects = intersects.filter(obj => {
        const name = obj.object.name || '';
        return name.includes("_doors_clickable");
      });
      
      // Verificar si se hizo clic en una puerta
      const hasDoorBeenClicked = doorObjects.length > 0;
      
      if (hasDoorBeenClicked) {
        // Si se hizo clic en una puerta, darle prioridad absoluta
        const doorObject = doorObjects[0].object;
        const doorName = doorObject.name || 'unnamed';
        console.log('🚪 Puerta clicada:', doorName);
        
        // Determinar a qué edificio corresponde la puerta
        if (doorName.includes("market_doors_clickable")) {
          console.log('🚪 Puerta del Mercado clicada');
          const marketPos = { x: -8, y: 0, z: 0 };
          const targetPos = new THREE.Vector3(marketPos.x, 0, marketPos.z + 2.5);
          setTargetPosition(targetPos);
          setIsMovingToTarget(true);
          setDestinationBuilding('market');
        } 
        else if (doorName.includes("kitchen_doors_clickable")) {
          console.log('🚪 Puerta de la Cocina clicada');
          const kitchenPos = { x: 8, y: 0, z: 0 };
          const targetPos = new THREE.Vector3(kitchenPos.x, 0, kitchenPos.z + 2.5);
          setTargetPosition(targetPos);
          setIsMovingToTarget(true);
          setDestinationBuilding('kitchen');
        } 
        else if (doorName.includes("garden_doors_clickable")) {
          console.log('🚪 Puerta del Huerto clicada');
          const gardenPos = { x: 0, y: 0, z: -15 };
          const targetPos = new THREE.Vector3(gardenPos.x, 0, gardenPos.z + 2.5);
          setTargetPosition(targetPos);
          setIsMovingToTarget(true);
          setDestinationBuilding('garden');
        }
      } 
      else if (intersects.length > 0) {
        // Si no hay puertas pero hay intersecciones con otros objetos
        const clickPoint = intersects[0].point.clone();
        console.log(`🎯 Punto de clic en el mundo: ${JSON.stringify(clickPoint)}`);
        
        // Mover directamente al punto sin intentar cálculos complicados de rutas
        setTargetPosition(clickPoint);
        setIsMovingToTarget(true);
        // Importante: no establecer destino de edificio para clics normales
        setDestinationBuilding(null);
      } 
      else {
        // Si no hay intersección con objetos, intentar con el plano del suelo
        if (raycaster.ray.intersectPlane(groundPlane, intersectionPoint)) {
          console.log(`🚶 Moviendo a punto en el suelo: ${JSON.stringify(intersectionPoint)}`);
          const targetPos = new THREE.Vector3().copy(intersectionPoint);
          setTargetPosition(targetPos);
          setIsMovingToTarget(true);
          // Importante: no establecer destino de edificio para clics en el suelo
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