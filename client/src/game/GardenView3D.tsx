import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, Plane } from "@react-three/drei";
import PlantModel from "./PlantModel";
import { GardenPlot } from "../data/gardenItems";

interface GardenView3DProps {
  plot: GardenPlot;
  width?: string;
  height?: string;
}

const GardenView3D = ({ plot, width = "100%", height = "150px" }: GardenView3DProps) => {
  // Solo mostrar el modelo 3D si hay una planta en la parcela
  const showPlant = plot.plant !== null && plot.state !== 'empty';

  return (
    <div style={{ width, height }}>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 2, 4]} />
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1} 
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024}
        />
        
        {/* Suelo del huerto */}
        <Plane 
          args={[3, 3]} 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, -0.5, 0]}
          receiveShadow
        >
          <meshStandardMaterial color="#8B4513" />
        </Plane>
        
        {/* Modelo de la planta */}
        {showPlant && (
          <Suspense fallback={null}>
            <PlantModel 
              position={[0, -0.2, 0]} 
              growthStage={plot.state as 'seedling' | 'growing' | 'mature' | 'harvestable'} 
            />
          </Suspense>
        )}
        
        {/* Controles de cámara */}
        <OrbitControls 
          enableZoom={true}
          minDistance={2}
          maxDistance={6}
          maxPolarAngle={Math.PI / 2 - 0.1}
        />
        
        {/* Entorno para mejorar la iluminación */}
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
};

export default GardenView3D;