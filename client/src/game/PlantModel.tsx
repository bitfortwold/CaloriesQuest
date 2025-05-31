import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { GLTF } from "three-stdlib";

// Precargar el modelo para un rendimiento óptimo
useGLTF.preload('/models/plant_seedling.glb');

interface PlantModelProps {
  position: [number, number, number];
  scale?: [number, number, number];
  rotation?: [number, number, number];
  growthStage: 'seedling' | 'growing' | 'mature' | 'harvestable';
}

type GLTFResult = GLTF & {
  nodes: {
    [key: string]: THREE.Mesh;
  };
  materials: {
    [key: string]: THREE.Material;
  };
};

const PlantModel = ({ position, scale = [2.5, 2.5, 2.5], rotation = [0, 0, 0], growthStage }: PlantModelProps) => {
  const ref = useRef<THREE.Group>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  
  // Cargar el modelo 3D
  const { scene } = useGLTF('/models/plant_seedling.glb') as GLTFResult;
  
  // Escalar el modelo según la etapa de crecimiento
  let stageScale: [number, number, number] = [...scale];
  switch (growthStage) {
    case 'seedling':
      stageScale = [scale[0] * 0.5, scale[1] * 0.5, scale[2] * 0.5];
      break;
    case 'growing':
      stageScale = [scale[0] * 0.8, scale[1] * 0.8, scale[2] * 0.8];
      break;
    case 'mature':
      stageScale = [scale[0] * 1.0, scale[1] * 1.0, scale[2] * 1.0];
      break;
    case 'harvestable':
      stageScale = [scale[0] * 1.2, scale[1] * 1.2, scale[2] * 1.2];
      break;
  }
  
  // Animación suave de la planta
  useFrame((state) => {
    if (ref.current) {
      // Pequeño movimiento que simula una planta moviéndose con el viento
      ref.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.05;
      
      if (!modelLoaded) {
        setModelLoaded(true);
      }
    }
  });
  
  return (
    <group ref={ref} position={new THREE.Vector3(...position)} rotation={new THREE.Euler(...rotation)}>
      {scene ? (
        <primitive 
          object={scene.clone()} 
          scale={stageScale} 
          castShadow
          receiveShadow
        />
      ) : (
        // Fallback simple si el modelo no está disponible
        <mesh castShadow>
          <boxGeometry args={[0.5, 1, 0.5]} />
          <meshStandardMaterial color="#4CAF50" />
        </mesh>
      )}
    </group>
  );
};

export default PlantModel;