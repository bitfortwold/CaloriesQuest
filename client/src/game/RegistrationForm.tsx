import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGameStateStore } from "../stores/useGameStateStore";
import { usePlayerStore } from "../stores/usePlayerStore";

const RegistrationForm = () => {
  const { setIsRegistered } = useGameStateStore();
  const { setPlayerData, calculateDailyCalories } = usePlayerStore();
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    activityLevel: ""
  });
  
  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  
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
      
      // Register the player
      setIsRegistered(true);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-blue-400 to-green-400 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to Caloric Consumption</CardTitle>
          <CardDescription>
            Register your profile to start your nutritional adventure! The game will calculate your daily calorie needs.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.age ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.height ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.height && <p className="text-red-500 text-xs mt-1">{errors.height}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.weight ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Activity Level</label>
                <select
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.activityLevel ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Activity Level</option>
                  <option value="sedentary">Sedentary (little or no exercise)</option>
                  <option value="light">Light (light exercise/sports 1-3 days/week)</option>
                  <option value="moderate">Moderate (moderate exercise/sports 3-5 days/week)</option>
                  <option value="active">Active (hard exercise/sports 6-7 days a week)</option>
                  <option value="veryActive">Very Active (very hard exercise & physical job)</option>
                </select>
                {errors.activityLevel && <p className="text-red-500 text-xs mt-1">{errors.activityLevel}</p>}
              </div>
              
              <div className="pt-2">
                <Button type="submit" className="w-full">
                  Start Game
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationForm;
