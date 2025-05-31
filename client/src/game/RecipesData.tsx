// Datos de las recetas para el juego
export const getRecipes = (language: string) => {
  return [
    {
      id: "breakfast",
      name: language === 'en' ? "Balanced Breakfast" : 
            language === 'ca' ? "Esmorzar Equilibrat" : 
            "Desayuno Equilibrado",
      description: language === 'en' ? "A nutritious breakfast with eggs, bread and fruit" : 
                   language === 'ca' ? "Un esmorzar nutritiu amb ous, pa i fruita" : 
                   "Un desayuno nutritivo con huevos, pan y fruta",
      ingredients: language === 'en' ? ["Eggs", "Bread", "Apple"] : 
                   language === 'ca' ? ["Ous", "Pa", "Poma"] : 
                   ["Huevos", "Pan", "Manzana"],
      benefits: language === 'en' ? "High in proteins and complex carbohydrates for sustained energy" : 
                language === 'ca' ? "Alt en proteïnes i carbohidrats complexos per a energia sostinguda" : 
                "Alto en proteínas y carbohidratos complejos para energía sostenida",
      nutritionalInfo: {
        calories: 385,
        protein: 15,
        carbs: 56,
        fat: 12,
        sustainabilityScore: 7
      },
      category: "breakfast"
    },
    {
      id: "lunch",
      name: language === 'en' ? "Vegetarian Lunch" : 
            language === 'ca' ? "Dinar Vegetarià" : 
            "Almuerzo Vegetariano",
      description: language === 'en' ? "A plant-based lunch with beans, rice and vegetables" : 
                   language === 'ca' ? "Un dinar a base de plantes amb mongetes, arròs i verdures" : 
                   "Un almuerzo a base de plantas con frijoles, arroz y verduras",
      ingredients: language === 'en' ? ["Beans", "Rice", "Broccoli", "Carrot"] : 
                   language === 'ca' ? ["Mongetes", "Arròs", "Bròquil", "Pastanaga"] : 
                   ["Frijoles", "Arroz", "Brócoli", "Zanahoria"],
      benefits: language === 'en' ? "Rich in fiber and provides essential vitamins and minerals" : 
                language === 'ca' ? "Ric en fibra i proporciona vitamines i minerals essencials" : 
                "Rico en fibra y proporciona vitaminas y minerales esenciales",
      nutritionalInfo: {
        calories: 320,
        protein: 12,
        carbs: 64,
        fat: 3,
        sustainabilityScore: 9
      },
      category: "main"
    },
    {
      id: "dinner",
      name: language === 'en' ? "Balanced Dinner" : 
            language === 'ca' ? "Sopar Equilibrat" : 
            "Cena Equilibrada",
      description: language === 'en' ? "A balanced dinner with fish, vegetables and whole grains" : 
                   language === 'ca' ? "Un sopar equilibrat amb peix, verdures i cereals integrals" : 
                   "Una cena equilibrada con pescado, verduras y cereales integrales",
      ingredients: language === 'en' ? ["Fish", "Quinoa", "Spinach", "Cherry Tomatoes", "Olive Oil"] : 
                   language === 'ca' ? ["Peix", "Quinoa", "Espinacs", "Tomàquets Cherry", "Oli d'Oliva"] : 
                   ["Pescado", "Quinoa", "Espinacas", "Tomates Cherry", "Aceite de Oliva"],
      benefits: language === 'en' ? "Excellent source of omega-3, protein and antioxidants" : 
                language === 'ca' ? "Excel·lent font d'omega-3, proteïnes i antioxidants" : 
                "Excelente fuente de omega-3, proteínas y antioxidantes",
      nutritionalInfo: {
        calories: 450,
        protein: 32,
        carbs: 38,
        fat: 18,
        sustainabilityScore: 8
      },
      category: "main"
    },
    {
      id: "power_salad",
      name: language === 'en' ? "Power Salad" : 
            language === 'ca' ? "Amanida Energètica" : 
            "Ensalada Energética",
      description: language === 'en' ? "A protein-packed salad with chicken, avocado and mixed greens" : 
                   language === 'ca' ? "Una amanida rica en proteïnes amb pollastre, alvocat i verdures variades" : 
                   "Una ensalada rica en proteínas con pollo, aguacate y verduras variadas",
      ingredients: language === 'en' ? ["Chicken Breast", "Avocado", "Lettuce", "Tomato", "Cucumber", "Olive Oil"] : 
                   language === 'ca' ? ["Pit de Pollastre", "Alvocat", "Enciam", "Tomàquet", "Cogombre", "Oli d'Oliva"] : 
                   ["Pechuga de Pollo", "Aguacate", "Lechuga", "Tomate", "Pepino", "Aceite de Oliva"],
      benefits: language === 'en' ? "Balanced combination of protein and healthy fats, rich in vitamins" : 
                language === 'ca' ? "Combinació equilibrada de proteïnes i greixos saludables, rica en vitamines" : 
                "Combinación equilibrada de proteínas y grasas saludables, rica en vitaminas",
      nutritionalInfo: {
        calories: 410,
        protein: 35,
        carbs: 18,
        fat: 23,
        sustainabilityScore: 7
      },
      category: "main"
    },
    {
      id: "mediterranean_bowl",
      name: language === 'en' ? "Mediterranean Bowl" : 
            language === 'ca' ? "Bol Mediterrani" : 
            "Bowl Mediterráneo",
      description: language === 'en' ? "A hearty bowl with chickpeas, vegetables, and whole grains" : 
                   language === 'ca' ? "Un bol abundant amb cigrons, verdures i cereals integrals" : 
                   "Un bowl abundante con garbanzos, verduras y cereales integrales",
      ingredients: language === 'en' ? ["Chickpeas", "Quinoa", "Cucumber", "Red Pepper", "Feta Cheese", "Olives", "Lemon"] : 
                   language === 'ca' ? ["Cigrons", "Quinoa", "Cogombre", "Pebrot Vermell", "Formatge Feta", "Olives", "Llimona"] : 
                   ["Garbanzos", "Quinoa", "Pepino", "Pimiento Rojo", "Queso Feta", "Aceitunas", "Limón"],
      benefits: language === 'en' ? "Heart-healthy fats, plant-based proteins and rich in Mediterranean diet benefits" : 
                language === 'ca' ? "Greixos saludables per al cor, proteïnes vegetals i ric en beneficis de la dieta Mediterrània" : 
                "Grasas saludables para el corazón, proteínas vegetales y rico en beneficios de la dieta Mediterránea",
      nutritionalInfo: {
        calories: 395,
        protein: 15,
        carbs: 48,
        fat: 16,
        sustainabilityScore: 9
      },
      category: "main"
    },
    {
      id: "smoothie_bowl",
      name: language === 'en' ? "Antioxidant Smoothie Bowl" : 
            language === 'ca' ? "Bol de Batut Antioxidant" : 
            "Bowl de Batido Antioxidante",
      description: language === 'en' ? "A refreshing bowl with mixed berries, banana and superfoods" : 
                   language === 'ca' ? "Un bol refrescant amb fruites del bosc, plàtan i superaliments" : 
                   "Un bowl refrescante con bayas mixtas, plátano y superalimentos",
      ingredients: language === 'en' ? ["Mixed Berries", "Banana", "Greek Yogurt", "Honey", "Chia Seeds", "Granola"] : 
                   language === 'ca' ? ["Fruits del Bosc", "Plàtan", "Iogurt Grec", "Mel", "Llavors de Chia", "Granola"] : 
                   ["Bayas Mixtas", "Plátano", "Yogur Griego", "Miel", "Semillas de Chía", "Granola"],
      benefits: language === 'en' ? "Packed with antioxidants, vitamins and probiotics for gut health" : 
                language === 'ca' ? "Ple d'antioxidants, vitamines i probiòtics per a la salut intestinal" : 
                "Lleno de antioxidantes, vitaminas y probióticos para la salud intestinal",
      nutritionalInfo: {
        calories: 340,
        protein: 12,
        carbs: 65,
        fat: 7,
        sustainabilityScore: 8
      },
      category: "special"
    },
    {
      id: "veggie_stir_fry",
      name: language === 'en' ? "Asian Veggie Stir Fry" : 
            language === 'ca' ? "Saltat de Verdures Asiàtic" : 
            "Salteado de Verduras Asiático",
      description: language === 'en' ? "A quick and flavorful vegetable stir fry with ginger and soy sauce" : 
                   language === 'ca' ? "Un saltat de verdures ràpid i saborós amb gingebre i salsa de soja" : 
                   "Un salteado de verduras rápido y sabroso con jengibre y salsa de soja",
      ingredients: language === 'en' ? ["Broccoli", "Carrot", "Bell Pepper", "Onion", "Garlic", "Ginger", "Soy Sauce", "Brown Rice"] : 
                   language === 'ca' ? ["Bròquil", "Pastanaga", "Pebrot", "Ceba", "All", "Gingebre", "Salsa de Soja", "Arròs Integral"] : 
                   ["Brócoli", "Zanahoria", "Pimiento", "Cebolla", "Ajo", "Jengibre", "Salsa de Soja", "Arroz Integral"],
      benefits: language === 'en' ? "High in fiber, antioxidants and essential nutrients, low calorie but filling" : 
                language === 'ca' ? "Alt en fibra, antioxidants i nutrients essencials, baix en calories però satisfactori" : 
                "Alto en fibra, antioxidantes y nutrientes esenciales, bajo en calorías pero satisfactorio",
      nutritionalInfo: {
        calories: 290,
        protein: 8,
        carbs: 55,
        fat: 5,
        sustainabilityScore: 9
      },
      category: "special"
    },
    {
      id: "protein_oatmeal",
      name: language === 'en' ? "Protein Oatmeal" : 
            language === 'ca' ? "Farinetes amb Proteïnes" : 
            "Avena con Proteínas",
      description: language === 'en' ? "A hearty breakfast with oats, protein and nuts for sustained energy" : 
                   language === 'ca' ? "Un esmorzar abundant amb civada, proteïnes i fruits secs per a energia sostinguda" : 
                   "Un desayuno abundante con avena, proteínas y frutos secos para energía sostenida",
      ingredients: language === 'en' ? ["Oats", "Protein Powder", "Banana", "Almond Milk", "Walnuts", "Cinnamon"] : 
                   language === 'ca' ? ["Civada", "Proteïna en Pols", "Plàtan", "Llet d'Ametlla", "Nous", "Canyella"] : 
                   ["Avena", "Proteína en Polvo", "Plátano", "Leche de Almendra", "Nueces", "Canela"],
      benefits: language === 'en' ? "Perfect pre or post-workout meal, high in protein and complex carbs" : 
                language === 'ca' ? "Àpat perfecte abans o després d'entrenar, alt en proteïnes i carbohidrats complexos" : 
                "Comida perfecta antes o después de entrenar, alta en proteínas y carbohidratos complejos",
      nutritionalInfo: {
        calories: 375,
        protein: 25,
        carbs: 45,
        fat: 12,
        sustainabilityScore: 8
      },
      category: "breakfast"
    },
    {
      id: "vegetable_soup",
      name: language === 'en' ? "Hearty Vegetable Soup" : 
            language === 'ca' ? "Sopa Abundant de Verdures" : 
            "Sopa Abundante de Verduras",
      description: language === 'en' ? "A comforting soup loaded with vegetables and beans" : 
                   language === 'ca' ? "Una sopa reconfortant carregada de verdures i llegums" : 
                   "Una sopa reconfortante cargada de verduras y legumbres",
      ingredients: language === 'en' ? ["Tomatoes", "Carrots", "Celery", "Onion", "Beans", "Spinach", "Vegetable Broth", "Herbs"] : 
                   language === 'ca' ? ["Tomàquets", "Pastanagues", "Api", "Ceba", "Mongetes", "Espinacs", "Brou Vegetal", "Herbes"] : 
                   ["Tomates", "Zanahorias", "Apio", "Cebolla", "Frijoles", "Espinacas", "Caldo Vegetal", "Hierbas"],
      benefits: language === 'en' ? "Hydrating, rich in vitamins and minerals, helps with detoxification" : 
                language === 'ca' ? "Hidratant, rica en vitamines i minerals, ajuda amb la desintoxicació" : 
                "Hidratante, rica en vitaminas y minerales, ayuda con la desintoxicación",
      nutritionalInfo: {
        calories: 220,
        protein: 10,
        carbs: 40,
        fat: 3,
        sustainabilityScore: 9
      },
      category: "special"
    },
    {
      id: "stuffed_peppers",
      name: language === 'en' ? "Stuffed Bell Peppers" : 
            language === 'ca' ? "Pebrots Farcits" : 
            "Pimientos Rellenos",
      description: language === 'en' ? "Bell peppers stuffed with quinoa, beans and vegetables" : 
                   language === 'ca' ? "Pebrots farcits amb quinoa, mongetes i verdures" : 
                   "Pimientos rellenos con quinoa, frijoles y verduras",
      ingredients: language === 'en' ? ["Bell Peppers", "Quinoa", "Black Beans", "Corn", "Onion", "Tomato Sauce", "Cheese"] : 
                   language === 'ca' ? ["Pebrots", "Quinoa", "Mongetes Negres", "Blat de Moro", "Ceba", "Salsa de Tomàquet", "Formatge"] : 
                   ["Pimientos", "Quinoa", "Frijoles Negros", "Maíz", "Cebolla", "Salsa de Tomate", "Queso"],
      benefits: language === 'en' ? "Complete protein source, rich in vitamins C and A, great for meal prep" : 
                language === 'ca' ? "Font completa de proteïnes, rica en vitamines C i A, ideal per a la preparació de menjars" : 
                "Fuente completa de proteínas, rica en vitaminas C y A, ideal para la preparación de comidas",
      nutritionalInfo: {
        calories: 310,
        protein: 14,
        carbs: 50,
        fat: 7,
        sustainabilityScore: 8
      },
      category: "special"
    }
  ];
};