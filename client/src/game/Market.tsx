import { useState } from "react";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { foodItems } from "../data/foodItems";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useFoodStore } from "../stores/useFoodStore";
import { useGameStateStore } from "../stores/useGameStateStore";
import { toast } from "sonner";

interface MarketProps {
  onExit: () => void;
}

const Market = ({ onExit }: MarketProps) => {
  const { playerData, addFood, updateCoins } = usePlayerStore();
  const { purchasedFood, addPurchasedFood, transferToKitchen } = useFoodStore();
  const { exitBuilding, setGameState } = useGameStateStore();
  
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [cart, setCart] = useState<{item: typeof foodItems[0], quantity: number}[]>([]);
  const [showCart, setShowCart] = useState(false);
  
  // Log state for debugging purposes
  console.log("Market component rendering, showCart =", showCart);
  
  // Filter food items by category
  const filteredFoodItems = selectedCategory === "all" 
    ? foodItems 
    : foodItems.filter(item => item.category === selectedCategory);
  
  // Get all categories
  const categories = ["all", ...Array.from(new Set(foodItems.map(item => item.category)))];
  
  // Add item to cart
  const addToCart = (foodItem: typeof foodItems[0]) => {
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.item.id === foodItem.id);
    
    if (existingItem) {
      // Update quantity if it exists
      setCart(prevCart => prevCart.map(item => 
        item.item.id === foodItem.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      // Add new item to cart
      setCart(prevCart => [...prevCart, { item: foodItem, quantity: 1 }]);
    }
    
    // Ya no mostramos automáticamente el panel, solo actualizamos el contador
    
    // Show notification
    toast.success(`${foodItem.name} added to cart`);
    
    // Log para depuración
    console.log("Item added to cart:", foodItem.name, "- Cart now has", cart.length + (existingItem ? 0 : 1), "different items");
    
    // Actualizar el contador del carrito
    const updatedCart = existingItem 
      ? [...cart.filter(item => item.item.id !== foodItem.id), { ...existingItem, quantity: existingItem.quantity + 1 }]
      : [...cart, { item: foodItem, quantity: 1 }];
      
    const totalItems = updatedCart.reduce((total, item) => total + item.quantity, 0);
    const cartCounter = document.getElementById('cart-counter');
    if (cartCounter) {
      cartCounter.textContent = totalItems.toString();
      
      // Efecto visual de "bounce" para el contador
      cartCounter.classList.add('scale-125');
      setTimeout(() => cartCounter.classList.remove('scale-125'), 300);
    }
  };
  
  // Remove item from cart
  const removeFromCart = (foodId: string) => {
    setCart(prevCart => prevCart.filter(item => item.item.id !== foodId));
  };
  
  // Get total price of all items in cart
  const getTotalCartPrice = () => {
    return cart.reduce((total, item) => total + (item.item.price * item.quantity), 0);
  };
  
  // Handle checkout (purchase all items in cart)
  const handleCheckout = () => {
    const totalPrice = getTotalCartPrice();
    
    // Check if player has enough coins
    if ((playerData?.coins || 0) < totalPrice) {
      toast.error("Not enough iHumancoins for checkout!");
      return;
    }
    
    // Array para guardar los IDs de los alimentos que se transferirán a la cocina
    const foodIdsToTransfer: string[] = [];
    
    // Purchase all items
    cart.forEach(cartItem => {
      // Repetir según la cantidad
      for (let i = 0; i < cartItem.quantity; i++) {
        // Crear un ID único para cada elemento (incluso si son del mismo tipo)
        const uniqueId = `${cartItem.item.id}-${Date.now()}-${i}`;
        const itemWithUniqueId = {
          ...cartItem.item,
          id: uniqueId
        };
        
        // Añadir a la compra y al inventario del jugador
        addPurchasedFood(itemWithUniqueId);
        addFood(itemWithUniqueId);
        
        // Añadir a la lista para transferir a la cocina
        foodIdsToTransfer.push(uniqueId);
      }
    });
    
    // Transferir alimentos a la cocina (refrigerador o despensa)
    transferToKitchen(foodIdsToTransfer);
    
    // Update player coins
    updateCoins(-totalPrice);
    
    // Clear cart
    setCart([]);
    
    // Show success message
    toast.success(`Purchase completed successfully! Your items have been delivered to your kitchen.`);
    
    // Ocultar el panel del carrito
    const cartPanel = document.getElementById('cart-panel');
    if (cartPanel) {
      cartPanel.style.display = 'none';
    }
    
    // Reset el contador del carrito
    const cartCounter = document.getElementById('cart-counter');
    if (cartCounter) {
      cartCounter.textContent = "0";
    }
  };
  
  // Handle direct purchase (old method, kept for compatibility)
  const handlePurchase = (foodItem: typeof foodItems[0]) => {
    // Check if player has enough coins
    if ((playerData?.coins || 0) < foodItem.price) {
      toast.error("Not enough iHumancoins!");
      return;
    }
    
    // Update player coins
    updateCoins(-(foodItem.price));
    
    // Add food to inventory
    addPurchasedFood(foodItem);
    addFood(foodItem);
    
    // Show success message
    toast.success(`Purchased ${foodItem.name}`);
  };
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="w-full max-w-5xl max-h-[90vh] overflow-auto bg-gradient-to-b from-amber-50 to-amber-100 rounded-lg shadow-xl border-4 border-amber-800">
        {/* Header con estilo de madera */}
        <div className="bg-amber-800 text-amber-50 p-3 rounded-t-lg relative overflow-hidden">
          <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCI+CjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgZmlsbD0iI2ZmZiI+PC9yZWN0Pgo8cmVjdCB4PSIxNSIgeT0iMCIgd2lkdGg9IjE1IiBoZWlnaHQ9IjE1IiBmaWxsPSIjZjNmNGY2Ij48L3JlY3Q+CjxyZWN0IHg9IjAiIHk9IjE1IiB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIGZpbGw9IiNmM2Y0ZjYiPjwvcmVjdD4KPC9zdmc+')]"></div>
          <div className="mb-2">
            <h1 className="text-4xl font-bold text-amber-50 drop-shadow-md tracking-wide text-center">MARKET</h1>
          </div>
          
          <div className="flex justify-center items-center">
            <div className="bg-amber-700 px-4 py-2 rounded-lg text-amber-50 border-2 border-amber-600 shadow-inner">
              <span className="font-semibold">iHumancoins: </span>
              <span className="text-yellow-300 font-bold text-xl ml-1">{playerData?.coins?.toFixed(0) || 0}</span>
            </div>
          </div>
        </div>
        
        {/* Tabs de categoría con estilo de pestañas */}
        <div className="bg-amber-200 px-2 pt-2 flex space-x-1 overflow-x-auto border-b-2 border-amber-700">
          {categories.map(category => (
            <button 
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`capitalize font-bold py-2 px-4 rounded-t-lg transition-all hover:brightness-110 ${
                selectedCategory === category 
                  ? 'bg-amber-50 text-amber-900 border-2 border-b-0 border-amber-700 shadow-inner-top' 
                  : 'bg-amber-300 text-amber-700 border border-amber-400 opacity-80 hover:opacity-100'
              }`}
            >
              {category === 'all' ? 'All' : category}
            </button>
          ))}
        </div>
        
        <div className="p-4">
          {/* Cuadrícula de comida con estilo de tarjetas de juego */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredFoodItems.map((food) => (
              <div 
                key={food.id} 
                className="bg-amber-50 rounded-lg shadow-md border-2 border-amber-300 overflow-hidden hover:border-amber-500 transition-all hover:shadow-lg"
              >
                {/* Cabecera del item */}
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-3 flex justify-between items-center border-b-2 border-amber-400">
                  <h3 className="text-lg font-bold text-white truncate">{food.name}</h3>
                  <span className="font-bold text-yellow-100 bg-amber-700 px-2 py-1 rounded-full text-sm border border-amber-800">
                    {food.price} IHC
                  </span>
                </div>
                
                <div className="p-3">
                  {/* Contenido visual, simulando imagen */}
                  <div className="flex gap-6 mb-3">
                    {/* Columna izquierda */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center">
                        <span className="w-24 text-xs text-amber-800">Calories:</span>
                        <span className="font-bold text-amber-900">{food.calories} kcal</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-24 text-xs text-amber-800">Carbs:</span>
                        <span className="font-bold text-amber-900">{food.nutritionalValue.carbs}g</span>
                      </div>
                    </div>
                    
                    {/* Columna derecha */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center">
                        <span className="w-24 text-xs text-amber-800">Protein:</span>
                        <span className="font-bold text-amber-900">{food.nutritionalValue.protein}g</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-24 text-xs text-amber-800">Fat:</span>
                        <span className="font-bold text-amber-900">{food.nutritionalValue.fat}g</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Barra de sostenibilidad */}
                  <div className="mb-3">
                    <div className="text-xs text-amber-800 mb-1">Sustainability:</div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 flex-1 bg-amber-200 rounded-full border border-amber-300 overflow-hidden">
                        <div 
                          className={`h-full ${
                            food.sustainabilityScore > 7 
                              ? 'bg-gradient-to-r from-green-400 to-green-600' 
                              : food.sustainabilityScore > 4 
                              ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' 
                              : 'bg-gradient-to-r from-red-400 to-red-600'
                          }`}
                          style={{ width: `${food.sustainabilityScore * 10}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold">{food.sustainabilityScore}/10</span>
                    </div>
                  </div>
                  
                  {/* Descripción */}
                  <p className="text-xs text-amber-700 mb-3 h-12 overflow-hidden">{food.description}</p>
                  
                  {/* Botones de compra y añadir al carrito */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handlePurchase(food)}
                      disabled={(playerData?.coins || 0) < food.price}
                      className={`w-full py-2 rounded-lg font-bold text-center transition-all ${
                        (playerData?.coins || 0) >= food.price
                          ? 'bg-gradient-to-b from-amber-500 to-amber-600 text-white border-2 border-amber-400 hover:from-amber-600 hover:to-amber-700 hover:scale-105'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed border-2 border-gray-400'
                      }`}
                    >
                      Buy
                    </button>
                    
                    <button 
                      onClick={() => addToCart(food)}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-lg border-2 border-green-500 transition-all hover:scale-105 flex-shrink-0"
                      title="Add to cart"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel del carrito de compra - con ID para controlar desde el botón externo */}
        <div 
          id="cart-panel" 
          className="fixed top-0 right-0 w-1/3 h-full bg-amber-800/95 text-white p-4 shadow-xl border-l-4 border-amber-900 overflow-auto z-[2000]"
          style={{ display: showCart ? 'block' : 'none' }}
        >
          <div className="flex justify-between items-center mb-4 border-b border-amber-700 pb-2">
            <h2 className="text-2xl font-bold">Shopping Cart</h2>
            <button 
              onClick={() => setShowCart(false)}
              className="text-amber-300 hover:text-amber-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {cart.length === 0 ? (
            <div className="text-center py-8 text-amber-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p>Your cart is empty</p>
              <p className="text-sm text-amber-400 mt-2">Add items by clicking the + button</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 max-h-[60vh] overflow-auto">
                {cart.map(cartItem => (
                  <div key={cartItem.item.id} className="flex justify-between items-center bg-amber-700/50 p-2 rounded-lg">
                    <div className="flex items-center">
                      <div className="mr-2 bg-amber-600 text-white w-6 h-6 flex items-center justify-center rounded-full">
                        {cartItem.quantity}
                      </div>
                      <div>
                        <p className="font-medium">{cartItem.item.name}</p>
                        <p className="text-xs text-amber-300">{cartItem.item.price} IHC × {cartItem.quantity}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-amber-300">
                        {(cartItem.item.price * cartItem.quantity)} IHC
                      </span>
                      <button 
                        onClick={() => removeFromCart(cartItem.item.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-amber-700 mt-4 pt-4">
                <div className="flex justify-between text-xl font-bold mb-4">
                  <span>Total:</span>
                  <span className="text-amber-300">{getTotalCartPrice()} IHC</span>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  disabled={(playerData?.coins || 0) < getTotalCartPrice()}
                  className={`w-full py-3 rounded-lg font-bold text-center text-lg transition-all ${
                    (playerData?.coins || 0) >= getTotalCartPrice()
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Market;