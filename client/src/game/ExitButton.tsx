import { useGameStateStore } from "../stores/useGameStateStore";

interface ExitButtonProps {
  text?: string;
  onClickBefore?: () => void;
}

export const ExitButton = ({ text = "Salir", onClickBefore }: ExitButtonProps) => {
  // Obtenemos directamente la función de salir
  const exitBuilding = useGameStateStore(state => state.exitBuilding);
  
  const handleExit = () => {
    console.log("*** BOTÓN SALIR DEFINITIVO PULSADO ***");
    
    // Si hay una función que ejecutar antes, lo hacemos
    if (onClickBefore) {
      onClickBefore();
    }
    
    // Y siempre salimos del edificio actual
    exitBuilding();
  };
  
  return (
    <button
      onClick={handleExit}
      className="bg-gradient-to-r from-[#E74C3C] to-[#C0392B] text-white px-6 py-2 rounded-lg font-bold shadow-md border-2 border-[#A93226] hover:from-[#C0392B] hover:to-[#E74C3C] transition duration-300"
    >
      {text}
    </button>
  );
};