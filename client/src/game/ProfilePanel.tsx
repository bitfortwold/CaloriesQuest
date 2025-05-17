import { useState } from "react";
import { usePlayerStore } from "../stores/usePlayerStore";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "../i18n/LanguageContext";
import { Button } from "@/components/ui/button";

// Constante para guardar datos en localStorage
const USER_DATA_KEY = "caloric_consumption_user_data";

const ProfilePanel = () => {
  const { playerData, setPlayerData, calculateDailyCalories } = usePlayerStore();
  const { t, language } = useLanguage(); // Hook para acceder a las traducciones
  
  // Estado para la edición del perfil
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    activityLevel: ""
  });
  
  // Inicializar el formulario con los datos del jugador cuando se activa el modo edición
  const handleEditClick = () => {
    if (playerData) {
      setEditFormData({
        name: playerData.name,
        age: playerData.age.toString(),
        gender: playerData.gender,
        height: playerData.height.toString(),
        weight: playerData.weight.toString(),
        activityLevel: playerData.activityLevel
      });
      setIsEditing(true);
    }
  };
  
  // Actualizar el estado del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };
  
  // Guardar los cambios en el perfil
  const handleSaveProfile = () => {
    if (playerData) {
      // Calcular nuevas calorías diarias basadas en los datos actualizados
      const dailyCalories = calculateDailyCalories(
        editFormData.gender,
        Number(editFormData.age),
        Number(editFormData.weight),
        Number(editFormData.height),
        editFormData.activityLevel
      );
      
      // Actualizar los datos del jugador
      const updatedPlayerData = {
        ...playerData,
        name: editFormData.name,
        age: Number(editFormData.age),
        gender: editFormData.gender,
        height: Number(editFormData.height),
        weight: Number(editFormData.weight),
        activityLevel: editFormData.activityLevel,
        dailyCalories: dailyCalories,
        // Igualamos las monedas a las calorías diarias (1 Kcal = 1 IHC)
        coins: dailyCalories
      };
      
      // Actualizar estado global
      setPlayerData(updatedPlayerData);
      
      // Guardar cambios en localStorage
      try {
        // Datos del usuario para guardar
        const userData = {
          name: editFormData.name,
          age: editFormData.age,
          gender: editFormData.gender,
          height: editFormData.height,
          weight: editFormData.weight,
          activityLevel: editFormData.activityLevel
        };
        
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
      } catch (error) {
        console.error("Error saving profile data:", error);
      }
      
      // Salir del modo edición
      setIsEditing(false);
    }
  };
  
  // Cancelar la edición
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  
  if (!playerData) {
    return <div className="p-4">Player data not available</div>;
  }
  
  // Calculate remaining calories for the day
  const remainingCalories = Math.max(0, 
    (playerData.dailyCalories || 0) - (playerData.caloriesConsumed || 0)
  );
  
  // Calculate health indicators
  const calculateHealthStatus = () => {
    const calorieRatio = playerData.caloriesConsumed / playerData.dailyCalories;
    
    if (calorieRatio < 0.5) return t.undernourished;
    if (calorieRatio > 1.5) return t.overeating;
    return t.balanced;
  };
  
  const healthStatus = calculateHealthStatus();
  
  // Estado de la barra de salud (0-100%)
  const healthPercentage = Math.min(100, Math.max(0, 100 - 
    Math.abs((playerData.caloriesConsumed / playerData.dailyCalories - 1) * 100)));
  
  // Calcular qué porcentaje de monedas queda
  const coinsPercentage = Math.min(100, Math.max(0, 
    (playerData.coins / playerData.dailyCalories) * 100));
  
  return (
    <div className="p-4 max-w-sm max-h-[500px] overflow-y-auto">
      {isEditing ? (
        // Formulario de edición de perfil
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h2 className="text-lg font-bold mb-3">{t.profile}</h2>
          
          <form className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                {language === 'es' ? 'Nombre' : language === 'ca' ? 'Nom' : 'Name'}
              </label>
              <input
                type="text"
                name="name"
                value={editFormData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                {language === 'es' ? 'Edad' : language === 'ca' ? 'Edat' : 'Age'}
              </label>
              <input
                type="number"
                name="age"
                value={editFormData.age}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                {language === 'es' ? 'Género' : language === 'ca' ? 'Gènere' : 'Gender'}
              </label>
              <select
                name="gender"
                value={editFormData.gender}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="">
                  {language === 'es' ? 'Selecciona género' : 
                   language === 'ca' ? 'Selecciona gènere' : 
                   'Select gender'}
                </option>
                <option value="male">
                  {language === 'es' ? 'Masculino' : 
                   language === 'ca' ? 'Masculí' : 
                   'Male'}
                </option>
                <option value="female">
                  {language === 'es' ? 'Femenino' : 
                   language === 'ca' ? 'Femení' : 
                   'Female'}
                </option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                {language === 'es' ? 'Altura (cm)' : 
                 language === 'ca' ? 'Alçada (cm)' : 
                 'Height (cm)'}
              </label>
              <input
                type="number"
                name="height"
                value={editFormData.height}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                {language === 'es' ? 'Peso (kg)' : 
                 language === 'ca' ? 'Pes (kg)' : 
                 'Weight (kg)'}
              </label>
              <input
                type="number"
                name="weight"
                value={editFormData.weight}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                {language === 'es' ? 'Nivel de actividad' : 
                 language === 'ca' ? 'Nivell d\'activitat' : 
                 'Activity level'}
              </label>
              <select
                name="activityLevel"
                value={editFormData.activityLevel}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="">
                  {language === 'es' ? 'Selecciona nivel' : 
                   language === 'ca' ? 'Selecciona nivell' : 
                   'Select level'}
                </option>
                <option value="sedentary">
                  {language === 'es' ? 'Sedentario' : 
                   language === 'ca' ? 'Sedentari' : 
                   'Sedentary'}
                </option>
                <option value="light">
                  {language === 'es' ? 'Ligero' : 
                   language === 'ca' ? 'Lleuger' : 
                   'Light'}
                </option>
                <option value="moderate">
                  {language === 'es' ? 'Moderado' : 
                   language === 'ca' ? 'Moderat' : 
                   'Moderate'}
                </option>
                <option value="active">
                  {language === 'es' ? 'Activo' : 
                   language === 'ca' ? 'Actiu' : 
                   'Active'}
                </option>
                <option value="veryActive">
                  {language === 'es' ? 'Muy activo' : 
                   language === 'ca' ? 'Molt actiu' : 
                   'Very active'}
                </option>
              </select>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button type="button" onClick={handleSaveProfile} className="flex-1 bg-green-600 hover:bg-green-700">
                {language === 'es' ? 'Guardar' : 
                 language === 'ca' ? 'Desar' : 
                 'Save'}
              </Button>
              <Button type="button" onClick={handleCancelEdit} variant="outline" className="flex-1">
                {language === 'es' ? 'Cancelar' : 
                 language === 'ca' ? 'Cancel·lar' : 
                 'Cancel'}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        // Vista normal del perfil
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Perfil de Salud</h2>
            <Button 
              onClick={handleEditClick} 
              size="sm" 
              variant="outline"
              className="text-xs px-2 py-1 h-auto"
            >
              {language === 'es' ? 'Editar perfil' : 
               language === 'ca' ? 'Editar perfil' : 
               'Edit profile'}
            </Button>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-600">Sistema Económico Virtual</h3>
            <div className="mt-1 p-3 bg-white rounded-md shadow-sm border border-gray-200">
              <div className="font-medium">{t.dailyRequirement}: {playerData.dailyCalories.toFixed(0)} kcal</div>
              <div className="font-medium">iHumanCoins Diarios: {playerData.dailyCalories.toFixed(0)} IHC</div>
              <div className="text-sm mt-1 text-gray-500">1 Kcal = 1 IHC</div>
              <div className="text-sm mt-1">{t.basedOn}</div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-600">Consumo de Hoy</h3>
            <div className="mt-1 grid grid-cols-2 gap-2">
              <Card>
                <CardContent className="p-3">
                  <div className="text-xl font-bold">{playerData.caloriesConsumed.toFixed(0)}</div>
                  <div className="text-xs">{t.caloriesConsumed}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="text-xl font-bold">{playerData.caloriesBurned.toFixed(0)}</div>
                  <div className="text-xs">{t.caloriesBurned}</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-2">
              <div className="flex justify-between text-sm">
                <span>{t.remaining}:</span>
                <span className="font-medium">{remainingCalories.toFixed(0)} kcal</span>
              </div>
              <div className="mt-1 h-2 bg-gray-200 rounded-full">
                <div 
                  className={`h-2 rounded-full ${
                    playerData.caloriesConsumed > playerData.dailyCalories
                      ? 'bg-red-500'
                      : playerData.caloriesConsumed > playerData.dailyCalories * 0.8
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{ 
                    width: `${Math.min((playerData.caloriesConsumed / playerData.dailyCalories) * 100, 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-600">Estado Financiero - iHumanCoins (IHC)</h3>
            <div className="mt-2">
              <div className="flex justify-between text-sm">
                <span>Monedas disponibles:</span>
                <span className="font-medium">{playerData.coins.toFixed(0)} IHC</span>
              </div>
              <div className="mt-1 h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 rounded-full bg-amber-500"
                  style={{ 
                    width: `${coinsPercentage}%` 
                  }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Equivalente a {((playerData.coins / playerData.dailyCalories) * 100).toFixed(0)}% de tu asignación diaria
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-600">{t.healthStatus}</h3>
            <div className="mt-1 p-3 bg-white rounded-md shadow-sm border border-gray-200">
              <div className="flex justify-between mb-2">
                <span>Estado Nutricional:</span>
                <span className={`font-medium ${
                  healthStatus === t.balanced 
                    ? "text-green-600" 
                    : "text-red-600"
                }`}>
                  {healthStatus}
                </span>
              </div>
              
              <div className="mt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Estado de Salud:</span>
                  <span className="font-medium">{healthPercentage.toFixed(0)}%</span>
                </div>
                <div className="mt-1 h-2 bg-gray-200 rounded-full">
                  <div 
                    className={`h-2 rounded-full ${
                      healthPercentage > 80
                        ? 'bg-green-500'
                        : healthPercentage > 50
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ 
                      width: `${healthPercentage}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="flex justify-between mt-3">
                <span>{t.estimatedLifespan}:</span>
                <span className="font-medium">{playerData.estimatedLifespan.toFixed(0)} {t.years}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-md text-sm">
            <h3 className="font-medium text-blue-700">{t.healthTips}</h3>
            <ul className="mt-1 space-y-1 list-disc list-inside text-blue-600">
              <li>{t.tipBalance}</li>
              <li>{t.tipActivity}</li>
              <li>{t.tipSustainable}</li>
              <li>{t.tipDiet}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePanel;
