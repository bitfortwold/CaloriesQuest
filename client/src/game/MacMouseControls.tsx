import * as THREE from "three";
import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { usePlayerStore } from "../stores/usePlayerStore";

// Componente de controles optimizados con seguimiento de jugador
const MacMouseControls = () => {
  const { camera } = useThree();
  const orbitControlsRef = useRef<any>(null);
  const { playerPosition } = usePlayerStore();
  const cameraTarget = useRef(new THREE.Vector3());
  const previousPlayerPos = useRef(new THREE.Vector3());
  const cameraOffset = useRef(new THREE.Vector3(0, 5, 10));

  // Inicializar cámara y target
  useEffect(() => {
    if (camera && playerPosition && orbitControlsRef.current) {
      // Guardar posición inicial para referencia
      previousPlayerPos.current.set(
        playerPosition.x,
        playerPosition.y,
        playerPosition.z
      );
      
      // Configurar el objetivo inicial (target) del control orbital
      cameraTarget.current.set(
        playerPosition.x,
        playerPosition.y + 1, // Altura de la cabeza
        playerPosition.z
      );
      
      // Posicionar la cámara inicialmente detrás del jugador
      camera.position.set(
        playerPosition.x, 
        playerPosition.y + 5, // Altura sobre el jugador
        playerPosition.z + 10 // Detrás del jugador
      );
      
      // Aplicar el target a los controles de órbita
      if (orbitControlsRef.current) {
        orbitControlsRef.current.target.copy(cameraTarget.current);
        orbitControlsRef.current.update();
      }
      
      console.log("🎥 Cámara inicializada para seguimiento de jugador");
    }
  }, [camera, playerPosition]);

  // Sistema avanzado de seguimiento de cámara
  useFrame(() => {
    if (orbitControlsRef.current && playerPosition && camera) {
      // Actualizar el objetivo para que siga al jugador
      cameraTarget.current.set(
        playerPosition.x,
        playerPosition.y + 1, // Altura de la cabeza
        playerPosition.z
      );
      
      // Calcular el movimiento del jugador desde el último frame
      const playerMovement = new THREE.Vector3(
        playerPosition.x - previousPlayerPos.current.x,
        0, // Ignoramos movimiento vertical
        playerPosition.z - previousPlayerPos.current.z
      );
      
      // Verificar si el jugador se está moviendo
      const isPlayerMoving = playerMovement.length() > 0.01;
      
      if (isPlayerMoving) {
        // Calcular nueva posición de cámara manteniendo una distancia fija detrás del jugador
        const idealCameraPos = new THREE.Vector3(
          playerPosition.x,
          playerPosition.y + cameraOffset.current.y, // Mantener altura fija
          playerPosition.z + cameraOffset.current.z  // Mantener distancia fija detrás
        );
        
        // Mover la cámara suavemente hacia la posición ideal
        camera.position.lerp(idealCameraPos, 0.05);
        
        // Actualizar posición previa para el siguiente frame
        previousPlayerPos.current.set(
          playerPosition.x,
          playerPosition.y,
          playerPosition.z
        );
      }
      
      // Aplicar directamente la posición del jugador como target
      orbitControlsRef.current.target.copy(cameraTarget.current);
      
      // Forzar actualización de los controles
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