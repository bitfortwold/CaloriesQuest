import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCameraStore } from '../lib/stores/useCameraStore';
import { useMacMouseControls } from '../hooks/useMacMouseControls';
import { usePlayerStore } from '../stores/usePlayerStore';

// Componente de cámara optimizado para gestos de trackpad de Mac
const MacTrackpadCamera = () => {
  // Referencias
  const { camera } = useThree();
  const cameraTargetRef = useRef(new THREE.Vector3());
  
  // Obtener estados de los stores
  const { 
    cameraRotation, 
    cameraDistance, 
    cameraTarget,
    resetPending,
    clearReset
  } = useCameraStore();
  
  const { playerPosition } = usePlayerStore();
  
  // Inicializar controles de ratón Mac
  useMacMouseControls();

  // Actualizar la posición de la cámara en cada frame
  useFrame(() => {
    if (!camera) return;
    
    // Si hay un reseteo pendiente, limpiarlo
    if (resetPending) {
      clearReset();
    }
    
    // Obtener el punto objetivo (jugador o punto específico)
    const targetPoint = cameraTarget.x !== 0 || cameraTarget.y !== 0 || cameraTarget.z !== 0
      ? cameraTarget
      : new THREE.Vector3(playerPosition.x, playerPosition.y + 1, playerPosition.z);
    
    // Interpolar suavemente hacia el objetivo
    cameraTargetRef.current.lerp(targetPoint, 0.1);
    
    // Calcular posición orbital basada en rotación y distancia
    const spherical = new THREE.Spherical(
      cameraDistance,
      cameraRotation.y,
      cameraRotation.x
    );
    
    // Convertir coordenadas esféricas a cartesianas
    const offset = new THREE.Vector3();
    offset.setFromSpherical(spherical);
    
    // Posicionar la cámara
    camera.position.copy(cameraTargetRef.current).add(offset);
    
    // Hacer que la cámara mire al objetivo
    camera.lookAt(cameraTargetRef.current);
    
    // Asegurar que la rotación sea en el orden correcto
    camera.rotation.order = 'YXZ';
  });
  
  // Inicializar la cámara al montar el componente
  useEffect(() => {
    if (camera) {
      // Posición inicial de la cámara
      const initialOffset = new THREE.Vector3(0, 8, 8); // Detrás y arriba del jugador
      camera.position.set(
        playerPosition.x + initialOffset.x,
        playerPosition.y + initialOffset.y,
        playerPosition.z + initialOffset.z
      );
      
      // Orientar hacia el jugador
      camera.lookAt(
        playerPosition.x,
        playerPosition.y + 1, // Apuntar a la altura de la cabeza
        playerPosition.z
      );
      
      // Guardar posición inicial en el objetivo
      cameraTargetRef.current.set(
        playerPosition.x,
        playerPosition.y + 1,
        playerPosition.z
      );
    }
  }, []);
  
  return null; // Este componente no renderiza nada visible
};

export default MacTrackpadCamera;