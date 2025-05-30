// Sistema de traducción para el juego
// Contiene traducciones para todos los textos del juego

export type Language = 'es' | 'en' | 'ca';

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
  
  // Cocina
  guidedRecipes: string;
  freeCooking: string;
  cookMeal: string;
  refrigerator: string;
  pantry: string;
  refrigeratedItems: string;
  pantryItems: string;
  
  // Actividades
  activities: string;
  performActivities: string;
  burns: string;
  earns: string;
  doIt: string;
  
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
  catalan: string;
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
  
  // Cocina
  guidedRecipes: "Recetas Guiadas",
  freeCooking: "Cocina Libre",
  cookMeal: "Cocinar Comida",
  refrigerator: "Refrigerador",
  pantry: "Despensa",
  refrigeratedItems: "Alimentos Refrigerados",
  pantryItems: "Alimentos de Despensa",
  
  // Actividades
  activities: "Actividades",
  performActivities: "Realiza actividades para quemar calorías y ganar iHumanCoins. ¡Mantente activo para mejor salud!",
  burns: "Quema",
  earns: "Gana",
  doIt: "Hazlo",
  
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
  catalan: "Catalán",
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
  
  // Cocina
  guidedRecipes: "Guided Recipes",
  freeCooking: "Free Cooking",
  cookMeal: "Cook Meal",
  refrigerator: "Refrigerator",
  pantry: "Pantry",
  refrigeratedItems: "Refrigerated Items",
  pantryItems: "Pantry Items",
  
  // Actividades
  activities: "Activities",
  performActivities: "Perform activities to burn calories and earn iHumancoins. Stay active for better health!",
  burns: "Burns",
  earns: "Earns",
  doIt: "Do it",
  
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
  catalan: "Catalan",
  changeLanguage: "Change language"
};

// Traducciones en catalán
export const ca: Translation = {
  // Interfaz general
  playerStats: "ESTADÍSTIQUES DEL JUGADOR",
  health: "Salut",
  calories: "Calories",
  coins: "iHumanCoins",
  inventory: "Inventari",
  items: "ítems",
  
  // Navegación
  profile: "Perfil",
  help: "Ajuda",
  exit: "Sortir",
  
  // Edificios
  market: "Mercat",
  kitchen: "Cuina",
  
  // Cocina
  guidedRecipes: "Receptes Guiades",
  freeCooking: "Cuina Lliure",
  cookMeal: "Cuinar Àpat",
  refrigerator: "Nevera",
  pantry: "Rebost",
  refrigeratedItems: "Aliments Refrigerats",
  pantryItems: "Aliments del Rebost",
  
  // Actividades
  activities: "Activitats",
  performActivities: "Realitza activitats per cremar calories i guanyar iHumanCoins. Mantén-te actiu per a una millor salut!",
  burns: "Crema",
  earns: "Guanya",
  doIt: "Fer-ho",
  
  // Controles
  controls: "CONTROLS DEL JOC",
  moveKeys: "• WASD o Fletxes: Moure's",
  clickToMove: "• Clic: Moure's/interactuar",
  interactKey: "• E/Espai: Interactuar",
  rotateCamera: "• Botó esquerre + arrossegar: Rotar",
  zoomCamera: "• Roda: Apropar/allunyar",
  
  // Perfil del jugador
  dailyRequirement: "Requeriment Diari",
  basedOn: "Basat en la teva edat, gènere, alçada, pes i nivell d'activitat",
  caloriesConsumed: "Calories Consumides",
  caloriesBurned: "Calories Cremades",
  remaining: "Restant",
  healthStatus: "Estat Nutricional",
  estimatedLifespan: "Esperança de Vida Estimada",
  years: "anys",
  
  // Estados de salud
  balanced: "Equilibrat",
  undernourished: "Desnodriment",
  overeating: "Sobrealimentació",
  
  // Consejos de salud
  healthTips: "Consells de Salut",
  tipBalance: "Equilibra el consum de calories amb les teves necessitats diàries",
  tipActivity: "Realitza activitats físiques regularment per cremar calories",
  tipSustainable: "Tria opcions d'aliments sostenibles per a un millor impacte ambiental",
  tipDiet: "Mantén una dieta diversa amb tots els nutrients essencials",
  
  // Carrito y compras
  cart: "CISTELL",
  buy: "Comprar",
  add: "Afegir",
  remove: "Treure",
  
  // Audio
  backgroundMusic: "Música de fons",
  voiceStayActive: "Els sons de veu romandran actius",
  increaseVolume: "Augmentar volum de música",
  decreaseVolume: "Disminuir volum de música",
  
  // Mensajes de sistema
  loading: "Carregant...",
  welcome: "Benvingut",
  error: "Error",
  
  // Idiomas
  language: "Idioma",
  spanish: "Espanyol",
  english: "Anglès",
  catalan: "Català",
  changeLanguage: "Canviar idioma"
};