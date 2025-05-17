import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGameStateStore } from "../stores/useGameStateStore";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useLanguage } from "../i18n/LanguageContext";
import { Language } from "../i18n/translations";

// Clave para almacenar datos de usuario en localStorage
const USER_DATA_KEY = "caloric_consumption_user_data";

const RegistrationForm = () => {
  const { setIsRegistered } = useGameStateStore();
  const { setPlayerData, calculateDailyCalories } = usePlayerStore();
  const { language, changeLanguage, t } = useLanguage(); // Obtener funciones de idioma
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    activityLevel: ""
  });
  
  // Estado para mostrar formulario rápido
  const [showQuickLogin, setShowQuickLogin] = useState(false);
  const [savedUsername, setSavedUsername] = useState("");
  
  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Comprueba si hay datos guardados al cargar
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(USER_DATA_KEY);
      if (savedData) {
        const userData = JSON.parse(savedData);
        if (userData.name) {
          setSavedUsername(userData.name);
          setShowQuickLogin(true);
        } else {
          setShowQuickLogin(false);
        }
      }
    } catch (error) {
      console.error("Error loading saved user data:", error);
      setShowQuickLogin(false);
    }
  }, []);
  
  // Función para iniciar sesión rápida con datos guardados
  const handleQuickLogin = () => {
    try {
      const savedData = localStorage.getItem(USER_DATA_KEY);
      if (savedData) {
        const userData = JSON.parse(savedData);
        
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
      }
    } catch (error) {
      console.error("Error during quick login:", error);
      // Si hay un error, mostrar el formulario completo
      setShowQuickLogin(false);
    }
  };
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear the error for this field when user changes it
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };
  
  // Validate form data
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    
    if (!formData.age || isNaN(Number(formData.age))) {
      newErrors.age = "Valid age is required";
    } else if (Number(formData.age) < 7 || Number(formData.age) > 120) {
      newErrors.age = "Age must be between 7 and 120";
    }
    
    if (!formData.gender) newErrors.gender = "Gender is required";
    
    if (!formData.height || isNaN(Number(formData.height))) {
      newErrors.height = "Valid height is required";
    } else if (Number(formData.height) < 50 || Number(formData.height) > 250) {
      newErrors.height = "Height must be between 50 and 250 cm";
    }
    
    if (!formData.weight || isNaN(Number(formData.weight))) {
      newErrors.weight = "Valid weight is required";
    } else if (Number(formData.weight) < 15 || Number(formData.weight) > 300) {
      newErrors.weight = "Weight must be between 15 and 300 kg";
    }
    
    if (!formData.activityLevel) newErrors.activityLevel = "Activity level is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Convert string values to appropriate types
      const playerData = {
        name: formData.name,
        age: Number(formData.age),
        gender: formData.gender,
        height: Number(formData.height),
        weight: Number(formData.weight),
        activityLevel: formData.activityLevel,
        
        // Initialize player stats
        coins: 500, // Starting coins
        caloriesConsumed: 0,
        caloriesBurned: 0,
        dailyCalories: 0, // Will be calculated next
        estimatedLifespan: 75, // Default value
        inventory: []
      };
      
      // Calculate daily calorie needs based on profile
      const dailyCalories = calculateDailyCalories(
        playerData.gender,
        playerData.age,
        playerData.weight,
        playerData.height,
        playerData.activityLevel
      );
      
      // Update player data with calculated calories
      setPlayerData({
        ...playerData,
        dailyCalories
      });
      
      // Guardar datos en localStorage para futuras sesiones
      try {
        localStorage.setItem(USER_DATA_KEY, JSON.stringify({
          name: formData.name,
          age: formData.age,
          gender: formData.gender,
          height: formData.height,
          weight: formData.weight,
          activityLevel: formData.activityLevel
        }));
      } catch (error) {
        console.error("Error saving user data to localStorage:", error);
      }
      
      // Register the player
      setIsRegistered(true);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-blue-400 to-green-400 flex items-center justify-center z-50 p-4">
      {/* Botón de instrucciones para la pantalla de registro */}
      <div className="fixed top-4 right-4 z-[1000]">
        <button 
          className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-all"
          onClick={() => {
            // Mostrar/ocultar panel de instrucciones
            const registrationInstructions = document.getElementById('registration-instructions');
            if (registrationInstructions) {
              const isVisible = registrationInstructions.style.display !== 'none';
              registrationInstructions.style.display = isVisible ? 'none' : 'block';
            }
          }}
          title="Ver instrucciones"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        
        {/* Panel de instrucciones oculto por defecto */}
        <div 
          id="registration-instructions" 
          className="absolute top-14 right-0 bg-black/90 text-white p-3 rounded-lg shadow-lg w-64"
          style={{ display: 'none' }}
        >
          <h3 className="text-center font-bold mb-2 text-blue-300">INSTRUCCIONES DEL JUEGO</h3>
          <div className="space-y-1 text-sm">
            <p>• WASD o Flechas: Moverse</p>
            <p>• Click del ratón: Moverse o interactuar</p>
            <p>• E o Espacio: Interactuar</p>
            <p>• Botón izquierdo + arrastrar: Rotar cámara</p>
            <p>• Rueda del ratón: Acercar/alejar</p>
          </div>
        </div>
      </div>

      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="text-2xl">Bienvenido a Consumo Calórico</CardTitle>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value as Language)}
                className="bg-blue-500 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
          <CardDescription>
            {showQuickLogin 
              ? (language === 'es' ? '¡Bienvenido de nuevo! Puedes continuar con tu perfil guardado o crear uno nuevo.' 
                                   : 'Welcome back! You can continue with your saved profile or create a new one.')
              : (language === 'es' ? '¡Registra tu perfil para comenzar tu aventura nutricional! El juego calculará tus necesidades calóricas diarias.'
                                   : 'Register your profile to start your nutritional adventure! The game will calculate your daily caloric needs.')
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {showQuickLogin ? (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="font-medium text-lg text-blue-700 mb-2">
                  {language === 'es' ? 'Perfil guardado' : 'Saved Profile'}
                </h3>
                <p className="mb-4">
                  {language === 'es' 
                    ? <>Hemos encontrado un perfil guardado para <span className="font-bold">{savedUsername}</span>.</>
                    : <>We found a saved profile for <span className="font-bold">{savedUsername}</span>.</>
                  }
                </p>
                
                <div className="flex flex-col space-y-2">
                  <Button 
                    onClick={handleQuickLogin}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {language === 'es' ? `Continuar como ${savedUsername}` : `Continue as ${savedUsername}`}
                  </Button>
                  
                  <Button 
                    onClick={() => setShowQuickLogin(false)}
                    variant="outline"
                    className="w-full"
                  >
                    {language === 'es' ? 'Crear un nuevo perfil' : 'Create a new profile'}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {language === 'es' ? 'Nombre' : 'Name'}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">
                    {errors.name === "Name is required" 
                      ? (language === 'es' ? "El nombre es obligatorio" : "Name is required") 
                      : errors.name}
                  </p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {language === 'es' ? 'Edad' : 'Age'}
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${errors.age ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.age && <p className="text-red-500 text-xs mt-1">
                    {errors.age === "Valid age is required" 
                      ? (language === 'es' ? "La edad es obligatoria" : "Valid age is required") 
                      : errors.age === "Age must be between 7 and 120" 
                      ? (language === 'es' ? "La edad debe estar entre 7 y 120 años" : "Age must be between 7 and 120") 
                      : errors.age}
                  </p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {language === 'es' ? 'Género' : 'Gender'}
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">
                      {language === 'es' ? 'Selecciona género' : 'Select gender'}
                    </option>
                    <option value="male">
                      {language === 'es' ? 'Masculino' : 'Male'}
                    </option>
                    <option value="female">
                      {language === 'es' ? 'Femenino' : 'Female'}
                    </option>
                    <option value="other">
                      {language === 'es' ? 'Otro' : 'Other'}
                    </option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-xs mt-1">
                    {errors.gender === "Gender is required" 
                      ? (language === 'es' ? "El género es obligatorio" : "Gender is required") 
                      : errors.gender}
                  </p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Altura (cm)</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${errors.height ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.height && <p className="text-red-500 text-xs mt-1">
                    {errors.height === "Valid height is required" ? "La altura es obligatoria" : 
                     errors.height === "Height must be between 50 and 250 cm" ? "La altura debe estar entre 50 y 250 cm" : 
                     errors.height}
                  </p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Peso (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${errors.weight ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.weight && <p className="text-red-500 text-xs mt-1">
                    {errors.weight === "Valid weight is required" ? "El peso es obligatorio" : 
                     errors.weight === "Weight must be between 15 and 300 kg" ? "El peso debe estar entre 15 y 300 kg" : 
                     errors.weight}
                  </p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Nivel de actividad</label>
                  <select
                    name="activityLevel"
                    value={formData.activityLevel}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${errors.activityLevel ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Selecciona nivel de actividad</option>
                    <option value="sedentary">Sedentario (poco o nada de ejercicio)</option>
                    <option value="light">Ligero (ejercicio ligero 1-3 días/semana)</option>
                    <option value="moderate">Moderado (ejercicio moderado 3-5 días/semana)</option>
                    <option value="active">Activo (ejercicio intenso 6-7 días/semana)</option>
                    <option value="veryActive">Muy activo (ejercicio muy intenso y trabajo físico)</option>
                  </select>
                  {errors.activityLevel && <p className="text-red-500 text-xs mt-1">
                    {errors.activityLevel === "Activity level is required" ? "El nivel de actividad es obligatorio" : errors.activityLevel}
                  </p>}
                </div>
                
                <div className="pt-2">
                  <Button type="submit" className="w-full">
                    Comenzar Juego
                  </Button>
                </div>

                {showQuickLogin === false && savedUsername && (
                  <div className="pt-2 text-center">
                    <button 
                      type="button"
                      onClick={() => setShowQuickLogin(true)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      ¿Ya tienes un perfil? Volver a la pantalla anterior
                    </button>
                  </div>
                )}
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationForm;
