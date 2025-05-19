import React, { useState, useEffect } from 'react';
import { usePlayerStore } from '../stores/usePlayerStore';
import { useFoodStore } from '../stores/useFoodStore';

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  price: number; // en iHumanCoins
  image?: string;
  category: string;
  description: string;
  nutritionalValue: {
    protein: number;
    carbs: number;
    fat: number;
    vitamins: number;
    minerals: number;
  };
  sustainabilityScore: number; // 1-10
}

interface MarketShopProps {
  onClose: () => void;
  onPurchase?: (item: FoodItem) => void;
}

const MarketShop: React.FC<MarketShopProps> = ({ onClose, onPurchase }) => {
  const { playerData, updatePlayer } = usePlayerStore();
  const { addFoodItem } = useFoodStore();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [cart, setCart] = useState<{item: FoodItem, quantity: number}[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Lista de categorías de alimentos
  const foodCategories = [
    { id: 'all', name: 'Todos' },
    { id: 'fruits', name: 'Frutas' },
    { id: 'vegetables', name: 'Verduras' },
    { id: 'grains', name: 'Cereales' },
    { id: 'protein', name: 'Proteínas' },
    { id: 'dairy', name: 'Lácteos' },
    { id: 'snacks', name: 'Snacks' }
  ];

  // Catálogo de alimentos disponibles en el mercado
  const foodCatalog: FoodItem[] = [
    {
      id: 'apple',
      name: 'Manzana',
      calories: 52,
      price: 5,
      category: 'fruits',
      description: 'Fruta fresca y crujiente rica en fibra y vitamina C.',
      nutritionalValue: {
        protein: 0.3,
        carbs: 14,
        fat: 0.2,
        vitamins: 8,
        minerals: 5
      },
      sustainabilityScore: 8
    },
    {
      id: 'banana',
      name: 'Plátano',
      calories: 89,
      price: 6,
      category: 'fruits',
      description: 'Fruta energética rica en potasio y vitamina B6.',
      nutritionalValue: {
        protein: 1.1,
        carbs: 23,
        fat: 0.3,
        vitamins: 7,
        minerals: 8
      },
      sustainabilityScore: 7
    },
    {
      id: 'carrot',
      name: 'Zanahoria',
      calories: 41,
      price: 4,
      category: 'vegetables',
      description: 'Vegetal naranja crujiente rico en beta-caroteno.',
      nutritionalValue: {
        protein: 0.9,
        carbs: 10,
        fat: 0.2,
        vitamins: 9,
        minerals: 6
      },
      sustainabilityScore: 9
    },
    {
      id: 'rice',
      name: 'Arroz',
      calories: 130,
      price: 8,
      category: 'grains',
      description: 'Cereal básico en la dieta mundial.',
      nutritionalValue: {
        protein: 2.7,
        carbs: 28,
        fat: 0.3,
        vitamins: 3,
        minerals: 4
      },
      sustainabilityScore: 6
    },
    {
      id: 'chicken',
      name: 'Pollo',
      calories: 165,
      price: 15,
      category: 'protein',
      description: 'Carne blanca rica en proteínas.',
      nutritionalValue: {
        protein: 31,
        carbs: 0,
        fat: 3.6,
        vitamins: 5,
        minerals: 7
      },
      sustainabilityScore: 5
    },
    {
      id: 'milk',
      name: 'Leche',
      calories: 42,
      price: 7,
      category: 'dairy',
      description: 'Lácteo rico en calcio y vitamina D.',
      nutritionalValue: {
        protein: 3.4,
        carbs: 5,
        fat: 1,
        vitamins: 6,
        minerals: 8
      },
      sustainabilityScore: 6
    },
    {
      id: 'chocolate',
      name: 'Chocolate',
      calories: 546,
      price: 12,
      category: 'snacks',
      description: 'Dulce hecho a base de cacao.',
      nutritionalValue: {
        protein: 4.9,
        carbs: 61,
        fat: 31,
        vitamins: 2,
        minerals: 4
      },
      sustainabilityScore: 4
    },
    {
      id: 'potato',
      name: 'Patata',
      calories: 77,
      price: 5,
      category: 'vegetables',
      description: 'Vegetal de raíz rico en carbohidratos.',
      nutritionalValue: {
        protein: 2,
        carbs: 17,
        fat: 0.1,
        vitamins: 5,
        minerals: 6
      },
      sustainabilityScore: 8
    },
    {
      id: 'bread',
      name: 'Pan',
      calories: 265,
      price: 6,
      category: 'grains',
      description: 'Alimento básico hecho de harina.',
      nutritionalValue: {
        protein: 9,
        carbs: 49,
        fat: 3.2,
        vitamins: 4,
        minerals: 5
      },
      sustainabilityScore: 6
    },
    {
      id: 'eggs',
      name: 'Huevos',
      calories: 155,
      price: 10,
      category: 'protein',
      description: 'Alimento rico en proteínas de alta calidad.',
      nutritionalValue: {
        protein: 13,
        carbs: 1.1,
        fat: 11,
        vitamins: 8,
        minerals: 7
      },
      sustainabilityScore: 7
    }
  ];

  // Filtrar alimentos según categoría y término de búsqueda
  const filteredFoods = foodCatalog.filter(food => {
    const matchesCategory = selectedCategory === 'all' || food.category === selectedCategory;
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Añadir al carrito
  const addToCart = (food: FoodItem) => {
    const existingItemIndex = cart.findIndex(item => item.item.id === food.id);
    
    if (existingItemIndex >= 0) {
      // Si ya está en el carrito, aumentar cantidad
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      // Si no está en el carrito, añadirlo
      setCart([...cart, { item: food, quantity: 1 }]);
    }

    // Mostrar mensaje de éxito
    setSuccessMessage(`${food.name} añadido al carrito`);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 2000);
  };

  // Eliminar del carrito
  const removeFromCart = (foodId: string) => {
    setCart(cart.filter(item => item.item.id !== foodId));
  };

  // Cambiar cantidad en el carrito
  const updateQuantity = (foodId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(foodId);
      return;
    }

    const updatedCart = cart.map(item => {
      if (item.item.id === foodId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    setCart(updatedCart);
  };

  // Calcular total del carrito
  const cartTotal = cart.reduce((total, item) => total + (item.item.price * item.quantity), 0);

  // Realizar compra
  const completePurchase = () => {
    if (!playerData) return;
    
    const currentCoins = playerData.ih_coins || 0;
    
    // Verificar si tiene suficientes monedas
    if (currentCoins < cartTotal) {
      alert("No tienes suficientes iHumanCoins para completar esta compra.");
      return;
    }

    // Actualizar monedas del jugador
    updatePlayer({
      ...playerData,
      ih_coins: currentCoins - cartTotal
    });

    // Añadir alimentos al inventario
    cart.forEach(item => {
      // Añadir cada item según su cantidad
      for (let i = 0; i < item.quantity; i++) {
        addFoodItem({
          ...item.item,
          purchased: new Date().toISOString()
        });
        
        // Notificar al sistema de tutorial (si existe)
        if (onPurchase) {
          onPurchase(item.item);
        }
      }
    });

    // Mostrar mensaje de éxito
    setSuccessMessage("¡Compra realizada con éxito!");
    setShowSuccessMessage(true);
    
    // Limpiar carrito después de comprar
    setCart([]);
    
    // Cerrar mensaje después de un tiempo
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 text-white rounded-lg w-full max-w-6xl h-5/6 flex flex-col">
        {/* Encabezado */}
        <div className="p-4 border-b border-amber-600 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-amber-400">Mercado</h2>
          <div className="flex items-center space-x-4">
            <div className="text-lg">
              <span className="text-amber-300">
                {playerData?.ih_coins || 0} IHC
              </span>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Cuerpo principal */}
        <div className="flex flex-1 overflow-hidden">
          {/* Panel izquierdo: Categorías y filtros */}
          <div className="w-1/4 border-r border-gray-700 p-4 overflow-auto">
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2 text-amber-300">Categorías</h3>
              <ul className="space-y-1">
                {foodCategories.map(category => (
                  <li key={category.id}>
                    <button
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        selectedCategory === category.id 
                          ? 'bg-amber-600 text-white' 
                          : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2 text-amber-300">Buscar</h3>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar alimentos..."
                className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Panel central: Catálogo de productos */}
          <div className="w-2/4 p-4 overflow-auto">
            <h3 className="text-lg font-medium mb-4 text-amber-300">
              Alimentos disponibles
            </h3>
            
            {filteredFoods.length === 0 ? (
              <div className="text-center text-gray-400 py-10">
                No se encontraron alimentos con esos criterios.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {filteredFoods.map(food => (
                  <div 
                    key={food.id} 
                    className="bg-gray-700 rounded-lg p-4 flex flex-col hover:shadow-md hover:shadow-amber-900/30 transition-shadow"
                  >
                    <div className="mb-2">
                      <h4 className="text-lg font-semibold">{food.name}</h4>
                      <p className="text-sm text-gray-400">{food.description}</p>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-300 mb-2">
                      <span>{food.calories} kcal</span>
                      <span className="text-amber-300">{food.price} IHC</span>
                    </div>
                    
                    <div className="text-xs grid grid-cols-2 gap-1 mb-3">
                      <div className="text-green-400">
                        Proteínas: {food.nutritionalValue.protein}g
                      </div>
                      <div className="text-blue-400">
                        Carbohidratos: {food.nutritionalValue.carbs}g
                      </div>
                      <div className="text-yellow-400">
                        Grasas: {food.nutritionalValue.fat}g
                      </div>
                      <div className="text-purple-400">
                        Sostenibilidad: {food.sustainabilityScore}/10
                      </div>
                    </div>
                    
                    <button
                      onClick={() => addToCart(food)}
                      className="mt-auto bg-amber-600 text-white rounded-md py-1 hover:bg-amber-700 transition-colors"
                    >
                      Añadir al carrito
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Panel derecho: Carrito de compra */}
          <div className="w-1/4 border-l border-gray-700 p-4 overflow-auto flex flex-col">
            <h3 className="text-lg font-medium mb-4 text-amber-300">Tu carrito</h3>
            
            {cart.length === 0 ? (
              <div className="text-center text-gray-400 flex-grow flex items-center justify-center">
                Tu carrito está vacío
              </div>
            ) : (
              <div className="flex-grow">
                <ul className="space-y-3">
                  {cart.map(item => (
                    <li key={item.item.id} className="border-b border-gray-700 pb-2">
                      <div className="flex justify-between">
                        <span>{item.item.name}</span>
                        <span>{item.item.price} IHC</span>
                      </div>
                      
                      <div className="flex items-center mt-1 justify-between">
                        <div className="flex items-center">
                          <button 
                            onClick={() => updateQuantity(item.item.id, item.quantity - 1)}
                            className="bg-gray-700 w-6 h-6 rounded-l-md flex items-center justify-center hover:bg-gray-600"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.item.id, item.quantity + 1)}
                            className="bg-gray-700 w-6 h-6 rounded-r-md flex items-center justify-center hover:bg-gray-600"
                          >
                            +
                          </button>
                        </div>
                        
                        <span className="text-amber-300">
                          {item.item.price * item.quantity} IHC
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex justify-between text-lg mb-4">
                <span>Total:</span>
                <span className="text-amber-300">{cartTotal} IHC</span>
              </div>
              
              <button
                onClick={completePurchase}
                disabled={cart.length === 0}
                className={`w-full py-2 rounded-md ${
                  cart.length === 0 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'bg-amber-600 text-white hover:bg-amber-700'
                } transition-colors`}
              >
                Completar compra
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mensaje de éxito */}
      {showSuccessMessage && (
        <div className="fixed bottom-8 right-8 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg animate-fade-in-out">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default MarketShop;