import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { usePlayerStore } from '../stores/usePlayerStore';
import { getMarketPosition, getKitchenPosition, getGardenPosition } from './Buildings';

// Componente para gestionar interacciones avanzadas con el ratón
function MouseInteraction() {
  const { camera, gl, scene } = useThree();
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // Posiciones de edificios para movimiento
  const marketPosition = getMarketPosition();
  const kitchenPosition = getKitchenPosition();
  const gardenPosition = getGardenPosition();

  useEffect(() => {
    function onMouseMove(event: MouseEvent) {
      // Convertir coordenadas del ratón a espacio normalizado (-1 a 1)
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    function onMouseClick(event: MouseEvent) {
      // Configurar el raycaster con la posición actual del ratón y la cámara
      raycaster.setFromCamera(mouse, camera);
      
      // Obtener objetos que intersectan con el rayo
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        // Obtener el primer objeto intersectado (el más cercano a la cámara)
        const intersectedObject = intersects[0].object;
        const objectName = intersectedObject.name || 'unnamed';
        
        console.log('Objeto clicado:', objectName);

        // Manejar clics en puertas específicas
        handleDoorInteraction(objectName, intersectedObject);
      }
    }

    // Función para manejar interacciones con puertas
    function handleDoorInteraction(objectName: string, object: THREE.Object3D) {
      const { setTargetPosition, setIsMovingToTarget, setDestinationBuilding } = usePlayerStore.getState();
      
      // Detectar puertas por su nombre
      if (objectName.includes('market_doors_clickable')) {
        console.log('🚪 Puerta del Mercado clicada');
        // Crear punto de destino frente al mercado
        const targetPoint = new THREE.Vector3(
          marketPosition.x,
          0,
          marketPosition.z + 3
        );
        
        // Configurar movimiento
        setTargetPosition(targetPoint);
        setIsMovingToTarget(true);
        setDestinationBuilding('market');
      } 
      else if (objectName.includes('kitchen_doors_clickable')) {
        console.log('🚪 Puerta de la Cocina clicada');
        // Crear punto de destino frente a la cocina
        const targetPoint = new THREE.Vector3(
          kitchenPosition.x,
          0,
          kitchenPosition.z + 3
        );
        
        // Configurar movimiento
        setTargetPosition(targetPoint);
        setIsMovingToTarget(true);
        setDestinationBuilding('kitchen');
      }
      else if (objectName.includes('garden_doors_clickable')) {
        console.log('🚪 Puerta del Huerto clicada');
        // Crear punto de destino frente al huerto
        const targetPoint = new THREE.Vector3(
          gardenPosition.x,
          0,
          gardenPosition.z + 3
        );
        
        // Configurar movimiento
        setTargetPosition(targetPoint);
        setIsMovingToTarget(true);
        setDestinationBuilding('garden');
      }
    }

    // Añadir listeners de eventos
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onMouseClick);

    // Limpiar event listeners al desmontar
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onMouseClick);
    };
  }, [camera, scene]);

  // Este componente no renderiza nada visualmente
  return null;
}

export default MouseInteraction;