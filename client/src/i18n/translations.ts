// Sistema de traducción para el juego
// Contiene traducciones para todos los textos del juego

export type Language = 'es' | 'en';

export interface Translation {
  // Interfaz general
  playerStats: string;
  health: string;
  calories: string;
  coins: string;
  inventory: string;
  items: string;
  
  // Navegación
  profile: string;
  help: string;
  exit: string;
  
  // Edificios
  market: string;
  kitchen: string;
  
  // Controles
  controls: string;
  moveKeys: string;
  clickToMove: string;
  interactKey: string;
  rotateCamera: string;
  zoomCamera: string;
  
  // Perfil del jugador
  dailyRequirement: string;
  basedOn: string;
  caloriesConsumed: string;
  caloriesBurned: string;
  remaining: string;
  healthStatus: string;
  estimatedLifespan: string;
  years: string;
  
  // Estados de salud
  balanced: string;
  undernourished: string;
  overeating: string;
  
  // Consejos de salud
  healthTips: string;
  tipBalance: string;
  tipActivity: string;
  tipSustainable: string;
  tipDiet: string;
  
  // Carrito y compras
  cart: string;
  buy: string;
  add: string;
  remove: string;
  
  // Audio
  backgroundMusic: string;
  voiceStayActive: string;
  increaseVolume: string;
  decreaseVolume: string;
  
  // Mensajes de sistema
  loading: string;
  welcome: string;
  error: string;
  
  // Idiomas
  language: string;
  spanish: string;
  english: string;
  changeLanguage: string;
}

// Traducciones en español
export const es: Translation = {
  // Interfaz general
  playerStats: "ESTADÍSTICAS DEL JUGADOR",
  health: "Salud",
  calories: "Calorías",
  coins: "iHumanCoins",
  inventory: "Inventario",
  items: "elementos",
  
  // Navegación
  profile: "Perfil",
  help: "Ayuda",
  exit: "Salir",
  
  // Edificios
  market: "Mercado",
  kitchen: "Cocina",
  
  // Controles
  controls: "CONTROLES DEL JUEGO",
  moveKeys: "• WASD o Flechas: Moverse",
  clickToMove: "• Click: Moverse/interactuar",
  interactKey: "• E/Espacio: Interactuar",
  rotateCamera: "• Botón izq. + arrastrar: Rotar",
  zoomCamera: "• Rueda: Acercar/alejar",
  
  // Perfil del jugador
  dailyRequirement: "Requerimiento Diario",
  basedOn: "Basado en tu edad, género, altura, peso y nivel de actividad",
  caloriesConsumed: "Calorías Consumidas",
  caloriesBurned: "Calorías Quemadas",
  remaining: "Restante",
  healthStatus: "Estado Nutricional",
  estimatedLifespan: "Esperanza de Vida Estimada",
  years: "años",
  
  // Estados de salud
  balanced: "Equilibrado",
  undernourished: "Desnutrido",
  overeating: "Sobrealimentado",
  
  // Consejos de salud
  healthTips: "Consejos de Salud",
  tipBalance: "Equilibra tu consumo de calorías con tus necesidades diarias",
  tipActivity: "Realiza actividades físicas regularmente para quemar calorías",
  tipSustainable: "Elige opciones de alimentos sostenibles para mejor impacto ambiental",
  tipDiet: "Mantén una dieta diversa con todos los nutrientes esenciales",
  
  // Carrito y compras
  cart: "CARRITO",
  buy: "Comprar",
  add: "Añadir",
  remove: "Quitar",
  
  // Audio
  backgroundMusic: "Música de fondo",
  voiceStayActive: "Las voces permanecerán activas",
  increaseVolume: "Subir volumen de música",
  decreaseVolume: "Bajar volumen de música",
  
  // Mensajes de sistema
  loading: "Cargando...",
  welcome: "Bienvenido",
  error: "Error",
  
  // Idiomas
  language: "Idioma",
  spanish: "Español",
  english: "Inglés",
  changeLanguage: "Cambiar idioma"
};

// Traducciones en inglés
export const en: Translation = {
  // Interfaz general
  playerStats: "PLAYER STATS",
  health: "Health",
  calories: "Calories",
  coins: "iHumanCoins",
  inventory: "Inventory",
  items: "items",
  
  // Navegación
  profile: "Profile",
  help: "Help",
  exit: "Exit",
  
  // Edificios
  market: "Market",
  kitchen: "Kitchen",
  
  // Controles
  controls: "GAME CONTROLS",
  moveKeys: "• WASD or Arrows: Move",
  clickToMove: "• Click: Move/interact",
  interactKey: "• E/Space: Interact",
  rotateCamera: "• Left button + drag: Rotate",
  zoomCamera: "• Scroll wheel: Zoom",
  
  // Perfil del jugador
  dailyRequirement: "Daily Requirement",
  basedOn: "Based on your age, gender, height, weight, and activity level",
  caloriesConsumed: "Calories Consumed",
  caloriesBurned: "Calories Burned",
  remaining: "Remaining",
  healthStatus: "Nutritional Status",
  estimatedLifespan: "Estimated Lifespan",
  years: "years",
  
  // Estados de salud
  balanced: "Balanced",
  undernourished: "Undernourished",
  overeating: "Overeating",
  
  // Consejos de salud
  healthTips: "Health Tips",
  tipBalance: "Balance your calorie intake with your daily needs",
  tipActivity: "Engage in regular physical activities to burn calories",
  tipSustainable: "Choose sustainable food options for better environmental impact",
  tipDiet: "Maintain a diverse diet with all essential nutrients",
  
  // Carrito y compras
  cart: "CART",
  buy: "Buy",
  add: "Add",
  remove: "Remove",
  
  // Audio
  backgroundMusic: "Background music",
  voiceStayActive: "Voice sounds will remain active",
  increaseVolume: "Increase music volume",
  decreaseVolume: "Decrease music volume",
  
  // Mensajes de sistema
  loading: "Loading...",
  welcome: "Welcome",
  error: "Error",
  
  // Idiomas
  language: "Language",
  spanish: "Spanish",
  english: "English",
  changeLanguage: "Change language"
};