import React, { useEffect, useState } from 'react';
import { usePlayerStore } from '../stores/usePlayerStore';
import { PhysicalActivity, ActivityCategory, PHYSICAL_ACTIVITIES } from '../data/activities';
import { Dumbbell, Activity, Heart } from 'lucide-react';

interface ActivitiesProps {
  onActivityComplete: (calories: number) => void;
}

const Activities: React.FC<ActivitiesProps> = ({ onActivityComplete }) => {
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory>('cardio');
  const { playerData } = usePlayerStore();
  
  const categories: {id: ActivityCategory, name: string, icon: JSX.Element}[] = [
    { id: 'cardio', name: 'Cardio', icon: <Activity size={18} /> },
    { id: 'strength', name: 'Fuerza', icon: <Dumbbell size={18} /> },
    { id: 'flexibility', name: 'Flexibilidad', icon: <Heart size={18} /> },
    { id: 'recreational', name: 'Recreativas', icon: <Activity size={18} /> }
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Actividades Físicas</h2>
      
      {/* Selector de categorías */}
      <div className="flex space-x-2 mb-6">
        {categories.map(category => (
          <button
            key={category.id}
            className={`flex items-center px-3 py-2 rounded-lg ${
              selectedCategory === category.id 
                ? 'bg-blue-600 text-white' 
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>
      
      {/* Lista de actividades */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PHYSICAL_ACTIVITIES[selectedCategory].map(activity => (
          <ActivityCard 
            key={activity.id} 
            activity={activity} 
            onComplete={onActivityComplete}
          />
        ))}
      </div>
    </div>
  );
};

interface ActivityCardProps {
  activity: PhysicalActivity;
  onComplete: (calories: number) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(activity.duration * 60); // en segundos
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isActive && progress < 100) {
      timer = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (activity.duration * 60));
          if (newProgress >= 100) {
            setIsActive(false);
            onComplete(activity.caloriesBurned);
            return 100;
          }
          return newProgress;
        });
        
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          return Math.max(0, newTime);
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, activity.duration, activity.caloriesBurned, onComplete]);
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-700 text-white p-3">
        <h3 className="font-bold">{activity.name}</h3>
      </div>
      
      <div className="p-4">
        <p className="text-sm mb-2">{activity.description}</p>
        
        <div className="flex justify-between text-sm mb-2">
          <span>Duración: {activity.duration} min</span>
          <span>Calorías: ~{activity.caloriesBurned}</span>
        </div>
        
        {isActive && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-center">{formatTime(timeRemaining)}</p>
          </div>
        )}
        
        <button
          onClick={() => setIsActive(!isActive)}
          className={`w-full mt-3 py-2 rounded-md font-medium ${
            isActive 
              ? 'bg-red-600 text-white hover:bg-red-700' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isActive ? 'Detener' : 'Comenzar'}
        </button>
      </div>
    </div>
  );
};

export default Activities;