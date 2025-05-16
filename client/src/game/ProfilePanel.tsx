import { usePlayerStore } from "../stores/usePlayerStore";
import { Card, CardContent } from "@/components/ui/card";

const ProfilePanel = () => {
  const { playerData } = usePlayerStore();
  
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
    
    if (calorieRatio < 0.5) return "Undernourished";
    if (calorieRatio > 1.5) return "Overeating";
    return "Balanced";
  };
  
  const healthStatus = calculateHealthStatus();
  
  return (
    <div className="p-4 max-w-sm max-h-[500px] overflow-y-auto">
      <h2 className="text-lg font-bold mb-3">Health Profile</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-600">Calorie Certificate (CCC)</h3>
          <div className="mt-1 p-3 bg-white rounded-md shadow-sm border border-gray-200">
            <div className="font-medium">Daily Requirement: {playerData.dailyCalories.toFixed(0)} kcal</div>
            <div className="text-sm mt-1">Based on your age, gender, height, weight, and activity level</div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-600">Today's Consumption</h3>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <Card>
              <CardContent className="p-3">
                <div className="text-xl font-bold">{playerData.caloriesConsumed.toFixed(0)}</div>
                <div className="text-xs">Calories Consumed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xl font-bold">{playerData.caloriesBurned.toFixed(0)}</div>
                <div className="text-xs">Calories Burned</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-2">
            <div className="flex justify-between text-sm">
              <span>Remaining:</span>
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
          <h3 className="text-sm font-medium text-gray-600">Health Indicators</h3>
          <div className="mt-1 p-3 bg-white rounded-md shadow-sm border border-gray-200">
            <div className="flex justify-between mb-2">
              <span>Nutritional Status:</span>
              <span className={`font-medium ${
                healthStatus === "Balanced" 
                  ? "text-green-600" 
                  : "text-red-600"
              }`}>
                {healthStatus}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>Estimated Lifespan:</span>
              <span className="font-medium">{playerData.estimatedLifespan.toFixed(0)} years</span>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-md text-sm">
          <h3 className="font-medium text-blue-700">Health Tips</h3>
          <ul className="mt-1 space-y-1 list-disc list-inside text-blue-600">
            <li>Balance your calorie intake with your daily needs</li>
            <li>Engage in regular physical activities to burn calories</li>
            <li>Choose sustainable food options for better environmental impact</li>
            <li>Maintain a diverse diet with all essential nutrients</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;
