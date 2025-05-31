import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGameStateStore } from "../stores/useGameStateStore";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useLanguage } from "../i18n/LanguageContext";
import { Language } from "../i18n/translations";
import { generateRandomChallenges } from "../data/dailyChallenges";
import { createNewGarden } from "../data/gardenItems";

// Claves para almacenar datos de usuario en localStorage
const USER_DATA_KEY = "caloric_consumption_user_data"; // Usuario actual/último
const ALL_USERS_KEY = "caloric_consumption_all_users"; // Todos los usuarios registrados

const SimpleLoginForm = () => {
  const { setIsRegistered } = useGameStateStore();
  const { setPlayerData, calculateDailyCalories } = usePlayerStore();
  const { language, changeLanguage } = useLanguage(); // Obtener funciones de idioma
  
  // Estado para el nombre de usuario
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [savedUsers, setSavedUsers] = useState<string[]>([]);
  
  // Cargar usuarios guardados
  useEffect(() => {
    try {
      // Intentar cargar el último usuario que cerró sesión (para sugerencia)
      const lastUserData = localStorage.getItem(USER_DATA_KEY);
      if (lastUserData) {
        const userData = JSON.parse(lastUserData);
        if (userData.name) {
          setSavedUsers([userData.name]);
        }
      }
      
      // En una implementación real, aquí podrías cargar todos los usuarios
      // guardados a través de una API o servicio de backend
      // Por ahora solo mostramos el último usuario para mantener consistencia
    } catch (error) {
      console.error("Error loading saved user data:", error);
    }
  }, []);
  
  // Función para iniciar sesión con un nombre de usuario
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que se ha introducido un nombre
    if (!username.trim()) {
      setError(language === 'es' ? "Por favor, introduce tu nombre" : 
             language === 'ca' ? "Si us plau, introdueix el teu nom" : 
             "Please enter your name");
      return;
    }
    
    // Usuarios predefinidos para garantizar que funcione
    const allowedUsers = ["ana", "pablo", "santi", "juan", "maria"];
    const inputUsername = username.toLowerCase().trim();
    
    // Comprobar si es uno de los usuarios permitidos (ignorando mayúsculas/minúsculas)
    if (allowedUsers.includes(inputUsername)) {
      console.log("Usuario encontrado:", username);
      
      // Crear datos de usuario estándar
      const userData = {
        name: username,
        age: 30,
        gender: "female",
        height: 170,
        weight: 65,
        activityLevel: "moderate"
      };
      
      // Para nombres específicos, personalizar algunos datos
      if (inputUsername === "pablo") {
        userData.gender = "male";
        userData.age = 35;
        userData.weight = 75;
      } else if (inputUsername === "santi") {
        userData.gender = "male";
        userData.age = 28;
        userData.weight = 70;
      }
      
      // Guardar como usuario actual
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
      
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
        name: username,
        age: Number(userData.age),
        gender: userData.gender,
        height: Number(userData.height),
        weight: Number(userData.weight),
        activityLevel: userData.activityLevel,
        // Sistema Económico Virtual: 1 Kcal = 1 IHC
        // Asignar monedas equivalentes a las calorías diarias recomendadas
        coins: dailyCalories,
        caloriesConsumed: 0,
        caloriesBurned: 0,
        dailyCalories,
        estimatedLifespan: 80,
        inventory: [],
        // Inicializar nuevas funcionalidades
        dailyChallenges: generateRandomChallenges(),
        lastChallengeReset: Date.now(),
        achievements: [],
        // Inicializar huerto virtual
        garden: createNewGarden(9),
        seeds: []
      };
      
      // Actualizar estado global
      // Importar la posición central definida en el mapa
      import("./Buildings").then(({ CENTRAL_SPAWN_POSITION }) => {
        // Establecer la posición inicial del jugador en el punto central del mapa
        const { setPlayerPosition } = usePlayerStore.getState();
        setPlayerPosition(CENTRAL_SPAWN_POSITION);
        console.log("🎮 Posición inicial del jugador establecida en el punto central (login):", CENTRAL_SPAWN_POSITION);
      });
      
      setPlayerData(playerData);
      setIsRegistered(true);
      setError("");
      return;
    }
    
    // Intentar buscar el usuario en localStorage solo si no es uno de los predefinidos
    try {
      const savedData = localStorage.getItem(USER_DATA_KEY);
      if (savedData) {
        const userData = JSON.parse(savedData);
        
        // Si el nombre coincide (ignorando mayúsculas/minúsculas), cargar los datos guardados
        if (userData.name && userData.name.toLowerCase() === inputUsername) {
          console.log("Usuario encontrado en localStorage:", userData.name);
          
          // Calcular calorías diarias
          const dailyCalories = calculateDailyCalories(
            userData.gender,
            Number(userData.age),
            Number(userData.weight),
            Number(userData.height),
            userData.activityLevel
          );
          
          // Crear datos del jugador con valores iniciales
          // Crear huerto inicial con 9 parcelas vacías
          const initialGarden = createNewGarden(9);
          
          const playerData = {
            name: userData.name,
            age: Number(userData.age),
            gender: userData.gender,
            height: Number(userData.height),
            weight: Number(userData.weight),
            activityLevel: userData.activityLevel,
            coins: dailyCalories, // 1 Kcal = 1 IHC
            caloriesConsumed: 0,
            caloriesBurned: 0,
            dailyCalories,
            estimatedLifespan: 80,
            inventory: [],
            // Inicializar nuevas funcionalidades
            dailyChallenges: generateRandomChallenges(),
            lastChallengeReset: Date.now(),
            achievements: [],
            // Inicializar huerto virtual
            garden: initialGarden,
            seeds: []
          };
          
          // Actualizar estado global
          setPlayerData(playerData);
          setIsRegistered(true);
          setError("");
          return;
        }
      }
      
      // Si no se encuentra el usuario, mostrar error
      setError(language === 'es' 
        ? "No encontramos un perfil con ese nombre. Por favor, regístrate." 
        : language === 'ca'
        ? "No hem trobat un perfil amb aquest nom. Si us plau, registra't."
        : "We couldn't find a profile with that name. Please register.");
      
    } catch (error) {
      console.error("Error during login:", error);
      setError(language === 'es'
        ? "Ha ocurrido un error. Inténtalo de nuevo."
        : language === 'ca'
        ? "S'ha produït un error. Torna-ho a provar."
        : "An error occurred. Please try again.");
    }
  };
  
  // Ir al formulario de registro completo
  const handleGoToRegistration = () => {
    // Eliminamos cualquier dato guardado para forzar el formulario de registro
    try {
      localStorage.removeItem(USER_DATA_KEY);
    } catch (error) {
      console.error("Error removing user data:", error);
    }
    
    // Esto reiniciará la aplicación y mostrará el formulario de registro completo
    setIsRegistered(false);
    
    // Refrescamos la página para asegurar que se cargue el formulario de registro
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-blue-400 to-green-400 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="text-2xl">
              {language === 'es' ? 'Bienvenido a Consumo Calórico' : 
               language === 'ca' ? 'Benvingut a Consum Calòric' : 
               'Welcome to Caloric Intake'}
            </CardTitle>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value as Language)}
                className="bg-blue-500 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="ca">Català</option>
              </select>
            </div>
          </div>
          <CardDescription>
            {language === 'es' 
              ? 'Ingresa tu nombre para continuar con tu aventura nutricional' 
              : language === 'ca'
              ? 'Introdueix el teu nom per continuar amb la teva aventura nutricional'
              : 'Enter your name to continue your nutritional adventure'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {language === 'es' ? 'Nombre' : language === 'ca' ? 'Nom' : 'Name'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => {
                    // Mostrar visualmente que hay una sugerencia si hay un usuario guardado
                    if (savedUsers.length > 0 && !username) {
                      // Dejamos que se muestre la clase de estilo enfocado
                    }
                  }}
                  className={`w-full p-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder={savedUsers.length > 0 
                    ? (language === 'es' ? `Sugerencia: ${savedUsers[0]}` : 
                       language === 'ca' ? `Suggeriment: ${savedUsers[0]}` : 
                       `Suggestion: ${savedUsers[0]}`) 
                    : (language === 'es' ? "Introduce tu nombre" : 
                       language === 'ca' ? "Introdueix el teu nom" : 
                       "Enter your name")}
                />
                
                {savedUsers.length > 0 && !username && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10">
                    <button
                      type="button"
                      onClick={() => setUsername(savedUsers[0])}
                      className="text-blue-600 text-sm font-medium hover:text-blue-800 hover:underline"
                    >
                      {language === 'es' ? 'Usar' : language === 'ca' ? 'Usar' : 'Use'}
                    </button>
                  </div>
                )}
              </div>
              {error && <p className="text-red-500 text-xs mt-1">
                {error === "Por favor, introduce tu nombre" 
                  ? (language === 'es' ? "Por favor, introduce tu nombre" : "Please enter your name")
                  : error === "No encontramos un perfil con ese nombre. Por favor, regístrate." 
                  ? (language === 'es' ? "No encontramos un perfil con ese nombre. Por favor, regístrate." : "We couldn't find a profile with that name. Please register.")
                  : error === "Ha ocurrido un error. Inténtalo de nuevo."
                  ? (language === 'es' ? "Ha ocurrido un error. Inténtalo de nuevo." : "An error occurred. Please try again.")
                  : error}
              </p>}
            </div>
            
            <div className="pt-2">
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                {language === 'es' ? 'Entrar' : language === 'ca' ? 'Entrar' : 'Enter'}
              </Button>
            </div>
            
            <div className="pt-2">
              <Button type="button" onClick={handleGoToRegistration} variant="outline" className="w-full">
                {language === 'es' ? 'Registrarse como nuevo usuario' : 
                 language === 'ca' ? 'Registrar-se com a nou usuari' : 
                 'Register as a new user'}
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleLoginForm;