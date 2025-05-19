import * as THREE from "three";
import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { usePlayerStore } from "../stores/usePlayerStore";

// Componente de controles optimizados para ratón Mac
const MacMouseControls = () => {
  const { camera } = useThree();
  const orbitControlsRef = useRef<any>(null);
  const { playerPosition } = usePlayerStore();
  const cameraTarget = useRef(new THREE.Vector3());

  // Inicializar cámara y target
  useEffect(() => {
    if (camera && playerPosition && orbitControlsRef.current) {
      // Configurar el objetivo inicial (target) del control orbital
      cameraTarget.current.set(
        playerPosition.x,
        playerPosition.y + 1, // Altura de la cabeza
        playerPosition.z
      );
      
      // Aplicar el target a los controles de órbita
      if (orbitControlsRef.current) {
        orbitControlsRef.current.target.copy(cameraTarget.current);
      }
    }
  }, [camera, playerPosition]);

  // Usar useFrame para actualizar la cámara en cada frame de renderizado
  useFrame(() => {
    if (orbitControlsRef.current && playerPosition) {
      // Actualizar el objetivo para que siga al jugador
      cameraTarget.current.set(
        playerPosition.x,
        playerPosition.y + 1, // Altura de la cabeza
        playerPosition.z
      );
      
      // Aplicar directamente la posición del jugador como target de la cámara
      // para un seguimiento inmediato y preciso
      orbitControlsRef.current.target.copy(cameraTarget.current);
      
      // Forzar actualización de los controles en cada frame
      orbitControlsRef.current.update();
    }
  });

  // Detección de gestos específicos de Mac
  useEffect(() => {
    const detectMacGesture = (e: WheelEvent) => {
      // Características típicas de gestos de trackpad Mac:
      // - deltaMode = 0 (píxeles en lugar de líneas)
      // - Valores fraccionarios pequeños
      const isMacGesture = e.deltaMode === 0 && 
                          Math.abs(e.deltaX) < 10 && 
                          Math.abs(e.deltaY) < 10 && 
                          !Number.isInteger(e.deltaY);
      
      // Si detectamos un gesto de Mac, podemos ajustar la sensibilidad del control
      if (isMacGesture && orbitControlsRef.current) {
        // Ajustar la sensibilidad para trackpad
        orbitControlsRef.current.rotateSpeed = 0.6;
        orbitControlsRef.current.zoomSpeed = 0.8;
      }
    };

    // Agregar detector de gestos
    window.addEventListener('wheel', detectMacGesture, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', detectMacGesture);
    };
  }, []);

  return (
    <OrbitControls 
      ref={orbitControlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={3}
      maxDistance={30}
      minPolarAngle={Math.PI / 8} // Ángulo mínimo respecto al eje Y (desde arriba hacia abajo)
      maxPolarAngle={Math.PI / 2.5} // Ángulo máximo para no estar demasiado horizontal
      zoomSpeed={0.8}
      rotateSpeed={0.4}
      panSpeed={0.4}
      enableDamping={true}
      dampingFactor={0.1}
      screenSpacePanning={true}
      keyPanSpeed={20}
      mouseButtons={{
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
      }}
      touches={{
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN
      }}
      enabled={true}
      makeDefault={true}
    />
  );
};

export default MacMouseControls;