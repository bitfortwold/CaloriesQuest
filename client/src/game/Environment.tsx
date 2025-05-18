import { useEffect } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

const Environment = () => {
  // Load terrain textures
  const grassTexture = useTexture("/textures/grass.png");
  
  useEffect(() => {
    // Make the textures repeat
    grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set(20, 20);
  }, [grassTexture]);
  
  return (
    <group>
      {/* Ground */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]} 
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          map={grassTexture} 
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      
      {/* Decorative trees */}
      <group>
        {/* Pre-calculated tree positions */}
        {[
          [-20, 0, -20],
          [20, 0, -20],
          [-15, 0, 15],
          [25, 0, 15],
          [-25, 0, 5],
          [30, 0, -10],
        ].map((position, index) => (
          <group key={index} position={[position[0], position[1], position[2]]}>
            {/* Tree trunk */}
            <mesh position={[0, 2, 0]} castShadow>
              <cylinderGeometry args={[0.5, 0.8, 4, 8]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
            
            {/* Tree foliage */}
            <mesh position={[0, 5, 0]} castShadow>
              <coneGeometry args={[3, 5, 8]} />
              <meshStandardMaterial color="#228B22" />
            </mesh>
          </group>
        ))}
      </group>
      
      {/* CAMBIO TOTAL DE CAMINO - SEPARADO EN DOS TRAMOS AISLADOS */}
      {/* Tramo sur - Bien alejado del huerto */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0.01, 5]} 
        receiveShadow
      >
        <planeGeometry args={[5, 6]} />
        <meshStandardMaterial color="#D2B48C" roughness={1} />
      </mesh>
      
      {/* BARRERA VISUAL DE SEGURIDAD - Césped entre camino y huerto */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0.015, -5]} 
        receiveShadow
      >
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#228B22" roughness={0.8} />
      </mesh>
    </group>
  );
};

export default Environment;
