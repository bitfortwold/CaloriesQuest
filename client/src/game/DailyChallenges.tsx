import React from "react";
import { usePlayerStore } from "../stores/usePlayerStore";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useLanguage } from "../i18n/LanguageContext";
import { toast } from "sonner";

const DailyChallenges = () => {
  const { playerData, completeChallenge, updateChallenges } = usePlayerStore();
  const { t } = useLanguage();
  
  // Verificar y actualizar desafíos al cargar el componente
  React.useEffect(() => {
    updateChallenges();
  }, [updateChallenges]);
  
  if (!playerData || !playerData.dailyChallenges) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-bold mb-3">Desafíos Diarios</h2>
        <p className="text-sm text-gray-600">Cargando desafíos...</p>
      </div>
    );
  }
  
  // Agrupar los desafíos por tipo
  const challengesByType = {
    nutrition: playerData.dailyChallenges.filter(c => c.type === "nutrition"),
    activity: playerData.dailyChallenges.filter(c => c.type === "activity"),
    sustainability: playerData.dailyChallenges.filter(c => c.type === "sustainability")
  };
  
  // Función para formatear el texto de progreso
  const formatProgress = (challenge: typeof playerData.dailyChallenges[0]) => {
    const { progress, requirement } = challenge;
    const { target } = requirement;
    
    return `${Math.min(progress, target)}/${target}`;
  };
  
  // Función para calcular el porcentaje de progreso
  const calculateProgressPercentage = (challenge: typeof playerData.dailyChallenges[0]) => {
    const { progress, requirement } = challenge;
    const { target } = requirement;
    
    return (Math.min(progress, target) / target) * 100;
  };
  
  return (
    <div className="p-4 max-h-[500px] overflow-y-auto">
      <h2 className="text-lg font-bold mb-3">Desafíos Diarios</h2>
      <p className="text-sm mb-4">Completa desafíos para recibir monedas y beneficios de salud.</p>
      
      {/* Desafíos de Nutrición */}
      <div className="mb-4">
        <h3 className="font-medium text-blue-700 mb-2">Nutrición</h3>
        <div className="space-y-3">
          {challengesByType.nutrition.map(challenge => (
            <Card key={challenge.id} className={`overflow-hidden ${challenge.completed ? 'bg-green-50' : ''}`}>
              <CardContent className="p-3">
                <div className="mb-2">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{challenge.title}</h4>
                    <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      +{challenge.reward.coins} IHC
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{challenge.description}</p>
                </div>
                
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progreso:</span>
                    <span className="font-medium">{formatProgress(challenge)}</span>
                  </div>
                  <Progress value={calculateProgressPercentage(challenge)} className="h-2" />
                </div>
                
                {challenge.completed && (
                  <div className="mt-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded text-center">
                    ¡Completado!
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Desafíos de Actividad Física */}
      <div className="mb-4">
        <h3 className="font-medium text-orange-700 mb-2">Actividad Física</h3>
        <div className="space-y-3">
          {challengesByType.activity.map(challenge => (
            <Card key={challenge.id} className={`overflow-hidden ${challenge.completed ? 'bg-green-50' : ''}`}>
              <CardContent className="p-3">
                <div className="mb-2">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{challenge.title}</h4>
                    <span className="text-xs font-semibold bg-orange-100 text-orange-800 px-2 py-1 rounded">
                      +{challenge.reward.coins} IHC
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{challenge.description}</p>
                </div>
                
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progreso:</span>
                    <span className="font-medium">{formatProgress(challenge)}</span>
                  </div>
                  <Progress value={calculateProgressPercentage(challenge)} className="h-2" />
                </div>
                
                {challenge.completed && (
                  <div className="mt-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded text-center">
                    ¡Completado!
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Desafíos de Sostenibilidad */}
      <div className="mb-4">
        <h3 className="font-medium text-green-700 mb-2">Sostenibilidad</h3>
        <div className="space-y-3">
          {challengesByType.sustainability.map(challenge => (
            <Card key={challenge.id} className={`overflow-hidden ${challenge.completed ? 'bg-green-50' : ''}`}>
              <CardContent className="p-3">
                <div className="mb-2">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{challenge.title}</h4>
                    <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded">
                      +{challenge.reward.coins} IHC
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{challenge.description}</p>
                </div>
                
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progreso:</span>
                    <span className="font-medium">{formatProgress(challenge)}</span>
                  </div>
                  <Progress value={calculateProgressPercentage(challenge)} className="h-2" />
                </div>
                
                {challenge.completed && (
                  <div className="mt-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded text-center">
                    ¡Completado!
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Botón para regenerar desafíos (solo para pruebas) */}
      <div className="mt-4">
        <Button 
          onClick={() => {
            // Solo para desarrollo y pruebas
            updateChallenges();
            toast.info("Verificando desafíos diarios");
          }}
          variant="outline"
          size="sm"
          className="w-full"
        >
          Actualizar Desafíos
        </Button>
      </div>
    </div>
  );
};

export default DailyChallenges;