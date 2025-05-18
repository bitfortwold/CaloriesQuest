import * as THREE from "three";
import { useRef } from "react";
import { useGameStateStore } from "../stores/useGameStateStore";

// Componente para hacer un edificio clickeable
export const ClickableBuilding: React.FC<{
  position: [number, number, number];
  children: React.ReactNode;
  buildingType: 'market' | 'kitchen' | 'garden';
  size?: [number, number, number]; 
}> = ({ position, children, buildingType, size = [6, 6, 5] }) => {
  const clickableRef = useRef<THREE.Mesh>(null);
  const { enterBuilding } = useGameStateStore();
  
  // Función para manejar el clic en el edificio
  const handleClick = (e: any) => {
    if (e.stopPropagation) {
      e.stopPropagation(); // Evitar que el clic llegue al suelo
    }
    console.log(`🏢 Edificio ${buildingType} clickeado: entrando directamente`);
    enterBuilding(buildingType);
  };
  
  return (
    <group position={position}>
      {/* Área clickeable invisible */}
      <mesh 
        ref={clickableRef}
        onClick={handleClick}
        visible={false} // Invisible pero clickeable
      >
        <boxGeometry args={size} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
      {children}
    </group>
  );
};