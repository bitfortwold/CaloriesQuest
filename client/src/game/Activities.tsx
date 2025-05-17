import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { activities } from "../data/activities";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useLanguage } from "../i18n/LanguageContext";
import { toast } from "sonner";

const Activities = () => {
  const { 
    increaseCaloriesBurned, 
    updateCoins, 
    calculateEstimatedLifespan 
  } = usePlayerStore();
  const { t } = useLanguage(); // Hook para acceder a las traducciones
  
  // Handle activity participation
  const performActivity = (activity: typeof activities[0]) => {
    // Burn calories
    increaseCaloriesBurned(activity.caloriesBurned);
    
    // Earn coins (double the calories as per the spec)
    const coinsEarned = activity.caloriesBurned * 2;
    updateCoins(coinsEarned);
    
    // Update estimated lifespan
    calculateEstimatedLifespan();
    
    // Show success message
    toast.success(`You ${activity.name}! Burned ${activity.caloriesBurned} calories and earned ${coinsEarned} iHumancoins.`);
    
    // Show educational tip if available
    if (activity.educationalTip) {
      setTimeout(() => {
        toast.info(activity.educationalTip, { duration: 6000 });
      }, 1000);
    }
  };
  
  return (
    <div className="p-4 max-h-[500px] overflow-y-auto">
      <h2 className="text-lg font-bold mb-3">{t.activities}</h2>
      <p className="text-sm mb-4">{t.performActivities}</p>
      
      <div className="grid grid-cols-1 gap-3">
        {activities.map((activity) => (
          <Card key={activity.id} className="overflow-hidden">
            <CardContent className="p-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{activity.name}</h3>
                  <div className="text-sm text-gray-600 mt-1">
                    <div>Burns: {activity.caloriesBurned} calories</div>
                    <div>Earns: {activity.caloriesBurned * 2} iHumancoins</div>
                  </div>
                </div>
                <Button 
                  size="sm"
                  onClick={() => performActivity(activity)}
                >
                  Do it
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">{activity.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Activities;
