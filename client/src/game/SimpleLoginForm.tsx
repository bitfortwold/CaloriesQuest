import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGameStateStore } from "../stores/useGameStateStore";
import { usePlayerStore } from "../stores/usePlayerStore";

// Clave para almacenar datos de usuario en localStorage
const USER_DATA_KEY = "caloric_consumption_user_data";

const SimpleLoginForm = () => {
  const { setIsRegistered } = useGameStateStore();
  const { setPlayerData, calculateDailyCalories } = usePlayerStore();
  
  // Estado para el nombre de usuario
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [savedUsers, setSavedUsers] = useState<string[]>([]);
  
  // Cargar usuarios guardados
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(USER_DATA_KEY);
      if (savedData) {
        const userData = JSON.parse(savedData);
        if (userData.name) {
          setSavedUsers([userData.name]);
        }
      }
    } catch (error) {
      console.error("Error loading saved user data:", error);
    }
  }, []);
  
  // Función para iniciar sesión con un nombre de usuario
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que se ha introducido un nombre
    if (!username.trim()) {
      setError("Por favor, introduce tu nombre");
      return;
    }
    
    // Comprobar si los datos del usuario están guardados
    try {
      const savedData = localStorage.getItem(USER_DATA_KEY);
      if (savedData) {
        const userData = JSON.parse(savedData);
        
        // Si el nombre coincide, cargar los datos guardados
        if (userData.name === username) {
          // Calcular calorías diarias
          const dailyCalories = calculateDailyCalories(
            userData.gender,
            Number(userData.age),
            Number(userData.weight),
            Number(userData.height),
            userData.activityLevel
          );
          
          // Crear datos del jugador con valores iniciales
          const playerData = {
            name: userData.name,
            age: Number(userData.age),
            gender: userData.gender,
            height: Number(userData.height),
            weight: Number(userData.weight),
            activityLevel: userData.activityLevel,
            coins: 100,
            caloriesConsumed: 0,
            caloriesBurned: 0,
            dailyCalories,
            estimatedLifespan: 80,
            inventory: []
          };
          
          // Actualizar estado global
          setPlayerData(playerData);
          setIsRegistered(true);
          setError("");
          return;
        }
      }
      
      // Si no se encuentra el usuario, mostrar error
      setError("No encontramos un perfil con ese nombre. Por favor, regístrate.");
      
    } catch (error) {
      console.error("Error during login:", error);
      setError("Ha ocurrido un error. Inténtalo de nuevo.");
    }
  };
  
  // Ir al formulario de registro completo
  const handleGoToRegistration = () => {
    setIsRegistered(false); // Esto mostrará el formulario de registro completo
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-blue-400 to-green-400 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Bienvenido a Consumo Calórico</CardTitle>
          <CardDescription>
            Ingresa tu nombre para continuar con tu aventura nutricional
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full p-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Introduce tu nombre"
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
            
            <div className="pt-2">
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                Entrar
              </Button>
            </div>
            
            <div className="pt-2">
              <Button type="button" onClick={handleGoToRegistration} variant="outline" className="w-full">
                Registrarse como nuevo usuario
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleLoginForm;