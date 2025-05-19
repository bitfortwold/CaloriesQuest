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
      raycaster.setFromCamera(mouse, camera);
      // Aumentamos la precisión del raycaster
      raycaster.params.Line.threshold = 0.1;
      raycaster.params.Points.threshold = 0.1;
      
      // Buscamos todas las intersecciones, no solo la primera
      const intersects = raycaster.intersectObjects(scene.children, true);
      
      // Depuración avanzada
      console.log('🔎 Detectando objetos...');
      console.log(`📏 Encontrados ${intersects.length} objetos en el rayo`);
      
      if (intersects.length > 0) {
        // Mostrar los primeros 3 objetos para depuración
        for (let i = 0; i < Math.min(3, intersects.length); i++) {
          const obj = intersects[i].object;
          console.log(`🟢 Objeto #${i+1}: ${obj.name || 'sin nombre'} (distancia: ${intersects[i].distance.toFixed(2)})`);
        }
        
        const intersectedObject = intersects[0].object;
        const objectName = intersectedObject.name || 'unnamed';
        
        console.log('Objeto clicado:', objectName);
        
        // Verificar si es una puerta válida con una lógica más robusta
        if (objectName.includes("market_doors_clickable")) {
          console.log('🚪 Puerta del Mercado clicada');
          // Usar las posiciones correctas desde Buildings.tsx
          const targetPos = new THREE.Vector3(-8, 0, 3);
          console.log(`🎯 Configurando destino: Mercado en ${JSON.stringify(targetPos)}`);
          setTargetPosition(targetPos);
          setIsMovingToTarget(true);
          setDestinationBuilding('market');
        } else if (objectName.includes("kitchen_doors_clickable")) {
          console.log('🚪 Puerta de la Cocina clicada');
          // Usar las posiciones correctas desde Buildings.tsx
          const targetPos = new THREE.Vector3(8, 0, 3);
          console.log(`🎯 Configurando destino: Cocina en ${JSON.stringify(targetPos)}`);
          setTargetPosition(targetPos);
          setIsMovingToTarget(true);
          setDestinationBuilding('kitchen');
        } else if (objectName.includes("garden_doors_clickable")) {
          console.log('🚪 Puerta del Huerto clicada');
          // Usar las posiciones correctas desde Buildings.tsx
          const targetPos = new THREE.Vector3(0, 0, -12);
          console.log(`🎯 Configurando destino: Huerto en ${JSON.stringify(targetPos)}`);
          setTargetPosition(targetPos);
          setIsMovingToTarget(true);
          setDestinationBuilding('garden');
        } else {
          // Si no es una puerta pero es un objeto, intentar moverse a ese punto
          // Usar el punto de intersección como destino
          const targetPos = new THREE.Vector3().copy(intersects[0].point);
          console.log(`🚶 Moviendo a punto en el mundo: ${JSON.stringify(targetPos)}`);
          setTargetPosition(targetPos);
          setIsMovingToTarget(true);
          // Importante: no setear destino de edificio para clics en otros objetos
          setDestinationBuilding(null);
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