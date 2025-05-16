import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "sonner";

import Game from "./game/Game";
import GameUI from "./game/GameUI";
import RegistrationForm from "./game/RegistrationForm";
import AudioManager from "./game/AudioManager";
import { useGameStateStore } from "./stores/useGameStateStore";

// Define control keys for the game
const controls = [
  { name: "forward", keys: ["KeyW", "ArrowUp"] },
  { name: "backward", keys: ["KeyS", "ArrowDown"] },
  { name: "leftward", keys: ["KeyA", "ArrowLeft"] },
  { name: "rightward", keys: ["KeyD", "ArrowRight"] },
  { name: "interact", keys: ["KeyE", "Space"] },
];

// Main App component
function App() {
  const { gameState, isRegistered } = useGameStateStore();
  const [showCanvas, setShowCanvas] = useState(false);

  // Show the canvas once everything is loaded
  useEffect(() => {
    setShowCanvas(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
        {showCanvas && (
          <KeyboardControls map={controls}>
            {!isRegistered && <RegistrationForm />}
            
            {isRegistered && (
              <>
                <Canvas
                  shadows
                  camera={{
                    position: [0, 5, 10],
                    fov: 60,
                    near: 0.1,
                    far: 1000
                  }}
                  gl={{
                    antialias: true,
                    powerPreference: "default"
                  }}
                >
                  <color attach="background" args={["#87CEEB"]} />
                  <Suspense fallback={null}>
                    <Game />
                  </Suspense>
                </Canvas>
                <GameUI />
              </>
            )}
            
            <AudioManager />
          </KeyboardControls>
        )}
        <Toaster position="bottom-right" />
      </div>
    </QueryClientProvider>
  );
}

export default App;
