import { useState, useEffect } from "react";
import { useFoodStore } from "../stores/useFoodStore";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useGameStateStore } from "../stores/useGameStateStore";
import { useLanguage } from "../i18n/LanguageContext";
import { toast } from "sonner";

// Estilos inline para garantizar que todo funcione correctamente
const styles = {
  container: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    pointerEvents: "auto"
  },
  kitchenCard: {
    width: "90%",
    maxWidth: "950px",
    maxHeight: "90vh",
    backgroundColor: "#C8964E",
    borderRadius: "12px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column" as const
  },
  kitchenHeader: {
    padding: "15px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #b5823e"
  },
  kitchenTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "white",
    margin: 0
  },
  exitButton: {
    padding: "8px 20px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  caloriesBar: {
    padding: "15px 20px",
    backgroundColor: "#FFF5E6",
    borderBottom: "1px solid #b5823e"
  },
  caloriesText: {
    fontSize: "18px",
    fontWeight: "bold",
    textAlign: "center" as const,
    margin: 0
  },
  tabsContainer: {
    display: "flex",
    backgroundColor: "#FFE4B5",
    borderBottom: "1px solid #b5823e"
  },
  tab: {
    flex: 1,
    padding: "15px",
    textAlign: "center" as const,
    backgroundColor: "#FFE4B5",
    cursor: "pointer",
    borderRight: "1px solid #b5823e",
    fontSize: "16px",
    fontWeight: 500
  },
  tabActive: {
    backgroundColor: "#4CAF50",
    color: "white",
    fontWeight: "bold"
  },
  contentArea: {
    flex: 1,
    overflow: "auto",
    padding: "20px",
    backgroundColor: "#FFF9EE"
  },
  // Estilos para recetas
  recipeContainer: {
    marginBottom: "30px"
  },
  recipeTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#92400e",
    textAlign: "center" as const,
    marginBottom: "20px"
  },
  recipeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    marginBottom: "30px"
  },
  recipeBreakfast: {
    padding: "20px",
    backgroundColor: "#FEF3C7",
    borderRadius: "10px",
    border: "1px solid #F59E0B"
  },
  recipeLunch: {
    padding: "20px",
    backgroundColor: "#DCFCE7",
    borderRadius: "10px",
    border: "1px solid #22C55E"
  },
  recipeDinner: {
    padding: "20px",
    backgroundColor: "#DBEAFE",
    borderRadius: "10px",
    border: "1px solid #3B82F6"
  },
  recipeCardTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "15px"
  },
  titleBreakfast: {
    color: "#92400E"
  },
  titleLunch: {
    color: "#166534"
  },
  titleDinner: {
    color: "#1E40AF"
  },
  recipeDescription: {
    marginBottom: "15px"
  },
  recipeInfo: {
    marginBottom: "10px"
  },
  recipeButtonBreakfast: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#F59E0B",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "15px"
  },
  recipeButtonLunch: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#22C55E",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "15px"
  },
  recipeButtonDinner: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#3B82F6",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "15px"
  },
  instructionsBox: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    marginBottom: "20px",
    border: "1px solid #E5E7EB"
  },
  instructionsTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "15px"
  },
  instructionsList: {
    paddingLeft: "25px"
  },
  instructionItem: {
    margin: "10px 0"
  },
  guideButton: {
    display: "block",
    margin: "0 auto",
    padding: "12px 25px",
    backgroundColor: "#D97706",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  // Estilos para el inventario
  inventoryTitle: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "15px"
  },
  foodGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "15px"
  },
  foodItem: {
    padding: "15px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    textAlign: "center" as const
  },
  foodName: {
    fontWeight: "bold",
    marginBottom: "5px"
  },
  foodCalories: {
    color: "#4b5563"
  },
  noFoodMessage: {
    textAlign: "center" as const,
    padding: "30px",
    color: "#6b7280",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  }
};

interface KitchenProps {
  onExit: () => void;
}

export default function KitchenNew({ onExit }: KitchenProps) {
  const [activeTab, setActiveTab] = useState("guided-recipes");
  const { playerData, consumeFood } = usePlayerStore();
  const { foods } = useFoodStore();
  const { exitBuilding } = useGameStateStore();
  const { t } = useLanguage();

  // Detectar la tecla Escape para salir
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleExit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Función para salir de la cocina
  const handleExit = () => {
    exitBuilding();
    onExit();
  };

  // Funciones para cocinar recetas
  const cookBreakfast = () => {
    // Verifica si tienes los ingredientes necesarios
    const hasEggs = playerData?.inventory.some((item) => item.name.toLowerCase().includes("huevo"));
    const hasBread = playerData?.inventory.some((item) => item.name.toLowerCase().includes("pan"));
    const hasApple = playerData?.inventory.some((item) => item.name.toLowerCase().includes("manzana"));

    if (hasEggs && hasBread && hasApple) {
      consumeFood(350);
      toast.success("¡Has preparado un desayuno equilibrado! (+350 calorías)");
    } else {
      toast.error("No tienes todos los ingredientes necesarios para esta receta");
    }
  };

  const cookLunch = () => {
    // Verifica si tienes los ingredientes necesarios
    const hasBeans = playerData?.inventory.some((item) => item.name.toLowerCase().includes("frijol"));
    const hasRice = playerData?.inventory.some((item) => item.name.toLowerCase().includes("arroz"));
    const hasBroccoli = playerData?.inventory.some((item) => item.name.toLowerCase().includes("brócoli"));

    if (hasBeans && hasRice && hasBroccoli) {
      consumeFood(420);
      toast.success("¡Has preparado un almuerzo vegetariano! (+420 calorías)");
    } else {
      toast.error("No tienes todos los ingredientes necesarios para esta receta");
    }
  };

  const cookDinner = () => {
    // Verifica si tienes los ingredientes necesarios
    const hasChicken = playerData?.inventory.some((item) => item.name.toLowerCase().includes("pollo"));
    const hasPotato = playerData?.inventory.some((item) => item.name.toLowerCase().includes("patata"));
    const hasSpinach = playerData?.inventory.some((item) => item.name.toLowerCase().includes("espinaca"));

    if (hasChicken && hasPotato && hasSpinach) {
      consumeFood(480);
      toast.success("¡Has preparado una cena proteica! (+480 calorías)");
    } else {
      toast.error("No tienes todos los ingredientes necesarios para esta receta");
    }
  };

  // Renderizado de recetas guiadas
  const renderGuidedRecipes = () => {
    return (
      <div style={styles.recipeContainer}>
        <h2 style={styles.recipeTitle}>Las Tres Recetas Básicas</h2>
        
        <div style={styles.recipeGrid}>
          {/* Desayuno Equilibrado */}
          <div style={styles.recipeBreakfast}>
            <h3 style={{...styles.recipeCardTitle, ...styles.titleBreakfast}}>Desayuno Equilibrado</h3>
            <p style={styles.recipeDescription}>Un desayuno nutritivo con huevos, pan y fruta fresca</p>
            <p style={styles.recipeInfo}><strong>Ingredientes:</strong> Huevos, Pan, Manzana</p>
            <p style={styles.recipeInfo}><strong>Calorías:</strong> 350 kcal</p>
            <button 
              style={styles.recipeButtonBreakfast}
              onClick={cookBreakfast}
            >
              Preparar Receta
            </button>
          </div>
          
          {/* Almuerzo Vegetariano */}
          <div style={styles.recipeLunch}>
            <h3 style={{...styles.recipeCardTitle, ...styles.titleLunch}}>Almuerzo Vegetariano</h3>
            <p style={styles.recipeDescription}>Un almuerzo a base de plantas con frijoles, arroz y verduras</p>
            <p style={styles.recipeInfo}><strong>Ingredientes:</strong> Frijoles, Arroz, Brócoli</p>
            <p style={styles.recipeInfo}><strong>Calorías:</strong> 420 kcal</p>
            <button 
              style={styles.recipeButtonLunch}
              onClick={cookLunch}
            >
              Preparar Receta
            </button>
          </div>
          
          {/* Cena Proteica */}
          <div style={styles.recipeDinner}>
            <h3 style={{...styles.recipeCardTitle, ...styles.titleDinner}}>Cena Proteica</h3>
            <p style={styles.recipeDescription}>Una cena rica en proteínas con pollo, patatas y verduras</p>
            <p style={styles.recipeInfo}><strong>Ingredientes:</strong> Pollo, Patata, Espinaca</p>
            <p style={styles.recipeInfo}><strong>Calorías:</strong> 480 kcal</p>
            <button 
              style={styles.recipeButtonDinner}
              onClick={cookDinner}
            >
              Preparar Receta
            </button>
          </div>
        </div>
        
        <div style={styles.instructionsBox}>
          <h3 style={styles.instructionsTitle}>Instrucciones Generales:</h3>
          <ol style={styles.instructionsList}>
            <li style={styles.instructionItem}>Selecciona una receta según tus necesidades nutricionales</li>
            <li style={styles.instructionItem}>Asegúrate de tener todos los ingredientes en tu inventario</li>
            <li style={styles.instructionItem}>Sigue cada paso para preparar una comida nutritiva</li>
            <li style={styles.instructionItem}>¡Disfruta de tu comida y aprende sobre nutrición!</li>
          </ol>
        </div>
        
        <button style={styles.guideButton}>
          Guía Nutricional Completa
        </button>
      </div>
    );
  };

  // Renderizado del inventario de comida
  const renderInventory = () => {
    return (
      <div>
        <h2 style={styles.inventoryTitle}>Tus Ingredientes Disponibles</h2>
        
        {playerData?.inventory && playerData.inventory.length > 0 ? (
          <div style={styles.foodGrid}>
            {playerData.inventory.map((food, index) => (
              <div key={index} style={styles.foodItem}>
                <div style={styles.foodName}>{food.name}</div>
                <div style={styles.foodCalories}>{food.calories} kcal</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.noFoodMessage}>
            <p>No tienes ingredientes en tu inventario.</p>
            <p>Visita el Mercado para comprar algunos.</p>
          </div>
        )}
      </div>
    );
  };

  // Renderizado del comedor (simplificado)
  const renderDiningArea = () => {
    return (
      <div>
        <h2 style={styles.inventoryTitle}>Área del Comedor</h2>
        <p style={{textAlign: "center", padding: "20px"}}>
          Este es un espacio para disfrutar de tus comidas preparadas.
          Puedes sentarte y comer aquí para obtener los beneficios nutricionales.
        </p>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.kitchenCard}>
        <div style={styles.kitchenHeader}>
          <h1 style={styles.kitchenTitle}>Cocina</h1>
          <button style={styles.exitButton} onClick={handleExit}>
            Salir
          </button>
        </div>
        
        <div style={styles.caloriesBar}>
          <p style={styles.caloriesText}>
            Calorías: {playerData?.caloriesConsumed || 0} / {playerData?.dailyCalories || 2620}
          </p>
        </div>
        
        <div style={styles.tabsContainer}>
          <div 
            style={{
              ...styles.tab, 
              ...(activeTab === "guided-recipes" ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab("guided-recipes")}
          >
            🍳 Recetas Guiadas
          </div>
          <div 
            style={{
              ...styles.tab, 
              ...(activeTab === "inventory" ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab("inventory")}
          >
            🍎 Cocina Libre
          </div>
          <div 
            style={{
              ...styles.tab, 
              ...(activeTab === "dining" ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab("dining")}
          >
            🍽️ Comedor
          </div>
        </div>
        
        <div style={styles.contentArea}>
          {activeTab === "guided-recipes" && renderGuidedRecipes()}
          {activeTab === "inventory" && renderInventory()}
          {activeTab === "dining" && renderDiningArea()}
        </div>
      </div>
    </div>
  );
}