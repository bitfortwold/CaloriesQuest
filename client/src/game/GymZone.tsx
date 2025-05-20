import { useState, useEffect } from "react";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useGameStateStore } from "../stores/useGameStateStore";
import { toast } from "sonner";
import { 
  PhysicalActivity, 
  ActivityCategory, 
  PHYSICAL_ACTIVITIES, 
  getAllActivities, 
  calculateCaloriesBurned 
} from "../data/activities";
// Importar iconos individuales
import { 
  Activity, 
  Dumbbell, 
  Heart, 
  Music, 
  ArrowDown, 
  ArrowDownAZ,
  Waves,
  Bike,
  Zap,
  Grid,
  CircleDot,
  Mountain
} from "lucide-react";

interface GymZoneProps {
  onExit: () => void;
}

const GymZone = ({ onExit }: GymZoneProps) => {
  const [activeCategory, setActiveCategory] = useState<ActivityCategory>("cardio");
  const [selectedActivity, setSelectedActivity] = useState<PhysicalActivity | null>(null);
  const [customDuration, setCustomDuration] = useState<number>(0);
  const [isExercising, setIsExercising] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const { playerData, increaseCaloriesBurned } = usePlayerStore();
  const { exitBuilding } = useGameStateStore();

  // Manejar la tecla Escape para salir
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleExit();
      }
    };
    
    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, []);

  // Función para salir
  const handleExit = () => {
    // No permitir salir si está ejercitando
    if (isExercising) {
      toast.error("¡Termina tu actividad antes de salir!");
      return;
    }
    
    // Primero llamamos a onExit para cerrar la interfaz
    onExit();
    
    // Luego usamos setTimeout para dar tiempo a que se cierre la interfaz
    setTimeout(() => {
      exitBuilding();
      console.log("Saliendo del gimnasio exitosamente");
    }, 100);
  };

  // Obtener el icono correspondiente a una actividad
  const getActivityIcon = (iconName: string) => {
    switch (iconName) {
      case "Running": return <Activity size={24} />;
      case "Dumbbell": return <Dumbbell size={24} />;
      case "Yoga": return <Heart size={24} />;
      case "Music": return <Music size={24} />;
      case "ArrowDown": return <ArrowDown size={24} />;
      case "ArrowDownWideNarrow": return <ArrowDownAZ size={24} />;
      case "Waves": return <Waves size={24} />;
      case "Bike": return <Bike size={24} />;
      case "Slack": return <Zap size={24} />;
      case "Grid": return <Grid size={24} />;
      case "Circle": return <CircleDot size={24} />;
      case "Mountain": return <Mountain size={24} />;
      default: return <Dumbbell size={24} />;
    }
  };

  // Iniciar una actividad física
  const startActivity = () => {
    if (!selectedActivity || customDuration <= 0) {
      toast.error("Selecciona una actividad y establece una duración válida");
      return;
    }

    setIsExercising(true);
    setProgress(0);
    
    // Simulamos el progreso de la actividad
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1;
        if (newProgress >= 100) {
          clearInterval(interval);
          completeActivity();
          return 100;
        }
        return newProgress;
      });
    }, (customDuration * 600) / 100); // Duración en ms dividida en 100 pasos
  };

  // Completar una actividad física
  const completeActivity = () => {
    if (!selectedActivity || !playerData) return;
    
    // Calculamos las calorías quemadas
    const caloriesBurned = calculateCaloriesBurned(
      selectedActivity,
      customDuration,
      playerData.weight
    );
    
    // Actualizamos las calorías quemadas
    increaseCaloriesBurned(caloriesBurned);
    
    // Notificamos al usuario
    toast.success(`¡Actividad completada! Has quemado ${caloriesBurned} calorías.`);
    
    // Reseteamos el estado
    setIsExercising(false);
    setProgress(0);
    setSelectedActivity(null);
    setCustomDuration(0);
  };

  // Cancelar una actividad en curso
  const cancelActivity = () => {
    if (isExercising) {
      toast.info("Actividad cancelada");
      setIsExercising(false);
      setProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-11/12 max-w-4xl bg-blue-200 rounded-xl overflow-hidden shadow-xl">
        {/* Cabecera */}
        <div className="bg-blue-700 p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Zona de Actividades Físicas</h1>
          <button 
            onClick={handleExit}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            disabled={isExercising}
          >
            Salir
          </button>
        </div>
        
        {/* Barra de calorías */}
        <div className="bg-blue-100 p-3 text-center border-b border-blue-300">
          <p className="font-medium">
            Calorías quemadas hoy: {playerData?.caloriesBurned || 0} kcal
          </p>
        </div>
        
        {/* Contenido principal */}
        <div className="p-6 bg-blue-50 max-h-[70vh] overflow-y-auto">
          {isExercising ? (
            /* Modo ejercicio */
            <div className="text-center py-8">
              <h2 className="text-xl font-bold mb-6">{selectedActivity?.name}</h2>
              <p className="mb-4">¡Sigue así! Estás realizando tu actividad...</p>
              
              {/* Barra de progreso */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-6 max-w-md mx-auto">
                <div 
                  className="bg-green-600 h-4 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <div className="mb-6">
                <p className="text-lg font-semibold">Progreso: {progress}%</p>
                <p>Duración: {customDuration} minutos</p>
                <p>Calorías estimadas: 
                  {playerData ? 
                    calculateCaloriesBurned(selectedActivity!, customDuration, playerData.weight) :
                    selectedActivity?.caloriesBurned
                  } kcal
                </p>
              </div>
              
              <button 
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
                onClick={cancelActivity}
              >
                Cancelar Actividad
              </button>
            </div>
          ) : (
            /* Modo selección */
            <div>
              {/* Categorías de actividades */}
              <div className="flex border-b border-blue-300 mb-6">
                <button 
                  className={`flex-1 py-3 px-4 font-medium ${activeCategory === 'cardio' ? 'bg-blue-600 text-white' : 'bg-blue-100'}`}
                  onClick={() => setActiveCategory('cardio')}
                >
                  Cardio
                </button>
                <button 
                  className={`flex-1 py-3 px-4 font-medium ${activeCategory === 'strength' ? 'bg-blue-600 text-white' : 'bg-blue-100'}`}
                  onClick={() => setActiveCategory('strength')}
                >
                  Fuerza
                </button>
                <button 
                  className={`flex-1 py-3 px-4 font-medium ${activeCategory === 'flexibility' ? 'bg-blue-600 text-white' : 'bg-blue-100'}`}
                  onClick={() => setActiveCategory('flexibility')}
                >
                  Flexibilidad
                </button>
                <button 
                  className={`flex-1 py-3 px-4 font-medium ${activeCategory === 'recreational' ? 'bg-blue-600 text-white' : 'bg-blue-100'}`}
                  onClick={() => setActiveCategory('recreational')}
                >
                  Recreativas
                </button>
              </div>
              
              {/* Lista de actividades */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {PHYSICAL_ACTIVITIES[activeCategory].map((activity) => (
                  <div 
                    key={activity.id}
                    className={`p-4 rounded-lg transition-all cursor-pointer
                      ${selectedActivity?.id === activity.id 
                        ? 'bg-blue-600 text-white border-2 border-blue-800 shadow-lg' 
                        : 'bg-white border border-blue-200 hover:border-blue-500'
                      }`}
                    onClick={() => setSelectedActivity(activity)}
                  >
                    <div className="flex items-center mb-2">
                      <div className="mr-2">
                        {getActivityIcon(activity.icon)}
                      </div>
                      <h3 className="text-lg font-bold">{activity.name}</h3>
                    </div>
                    <p className="text-sm mb-2">{activity.description}</p>
                    <div className="flex justify-between text-sm">
                      <span>Duración: {activity.duration} min</span>
                      <span>Calorías: ~{activity.caloriesBurned} kcal</span>
                    </div>
                    <div className="mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        activity.intensity === 'low' ? 'bg-green-100 text-green-800' :
                        activity.intensity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        Intensidad: {
                          activity.intensity === 'low' ? 'Baja' :
                          activity.intensity === 'medium' ? 'Media' : 'Alta'
                        }
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs font-medium mb-1">Beneficios:</p>
                      <ul className="text-xs list-disc pl-4 space-y-1">
                        {activity.benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Configuración de la actividad */}
              {selectedActivity && (
                <div className="bg-white p-5 rounded-lg border border-blue-300 mb-6">
                  <h3 className="text-lg font-bold mb-4">Configurar {selectedActivity.name}</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Duración personalizada (minutos):
                    </label>
                    <input 
                      type="number" 
                      className="w-full p-2 border border-blue-300 rounded"
                      value={customDuration || ''}
                      onChange={(e) => setCustomDuration(Math.max(1, parseInt(e.target.value) || 0))}
                      min="1"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm">
                      Calorías estimadas: 
                      <span className="font-bold ml-1">
                        {playerData 
                          ? calculateCaloriesBurned(selectedActivity, customDuration || selectedActivity.duration, playerData.weight)
                          : selectedActivity.caloriesBurned
                        } kcal
                      </span>
                    </p>
                  </div>
                  
                  <button 
                    className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
                    onClick={startActivity}
                    disabled={!customDuration}
                  >
                    Comenzar Actividad
                  </button>
                </div>
              )}
              
              {/* Información nutricional */}
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <h3 className="font-bold text-lg mb-2">Beneficios del Ejercicio</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>El ejercicio regular ayuda a mantener un peso saludable</li>
                  <li>Mejora la salud cardiovascular y reduce el riesgo de enfermedades</li>
                  <li>Fortalece los músculos y huesos</li>
                  <li>Reduce el estrés y mejora el estado de ánimo</li>
                  <li>Aumenta la energía y mejora la calidad del sueño</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GymZone;