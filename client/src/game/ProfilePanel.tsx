import { usePlayerStore } from "../stores/usePlayerStore";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "../i18n/LanguageContext";

const ProfilePanel = () => {
  const { playerData } = usePlayerStore();
  const { t } = useLanguage(); // Hook para acceder a las traducciones
  
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
  
  return (
    <div className="p-4 max-w-sm max-h-[500px] overflow-y-auto">
      <h2 className="text-lg font-bold mb-3">Perfil de Salud</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-600">Certificado de Calorías (CCC)</h3>
          <div className="mt-1 p-3 bg-white rounded-md shadow-sm border border-gray-200">
            <div className="font-medium">{t.dailyRequirement}: {playerData.dailyCalories.toFixed(0)} kcal</div>
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
          <h3 className="text-sm font-medium text-gray-600">{t.healthStatus}</h3>
          <div className="mt-1 p-3 bg-white rounded-md shadow-sm border border-gray-200">
            <div className="flex justify-between mb-2">
              <span>Estado Nutricional:</span>
              <span className={`font-medium ${
                healthStatus === "Balanced" 
                  ? "text-green-600" 
                  : "text-red-600"
              }`}>
                {healthStatus}
              </span>
            </div>
            
            <div className="flex justify-between">
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
    </div>
  );
};

export default ProfilePanel;
