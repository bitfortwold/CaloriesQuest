import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define los tipos para los elementos del carrito
export type CartItemType = "food" | "seed";
export interface CartItem {
  item: any;
  quantity: number;
  type: CartItemType;
}

// Define la interfaz para el estado del carrito
interface CartState {
  items: CartItem[];
  showCart: boolean;
  
  // Acciones
  addItem: (item: any, type: CartItemType) => void;
  removeItem: (itemId: string, type: CartItemType) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  toggleCartVisibility: () => void;
  setCartVisibility: (visible: boolean) => void;
}

// Crear el store con persistencia
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      items: [],
      showCart: false,
      
      // Acciones
      addItem: (item, type) => {
        const { items } = get();
        const existingItemIndex = items.findIndex(
          cartItem => cartItem.item.id === item.id && cartItem.type === type
        );
        
        if (existingItemIndex >= 0) {
          // Si el ítem ya existe, actualiza su cantidad
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += 1;
          set({ items: updatedItems });
        } else {
          // Si es un nuevo ítem, agrégalo al carrito
          set({ items: [...items, { item, quantity: 1, type }] });
        }
      },
      
      removeItem: (itemId, type) => {
        const { items } = get();
        set({
          items: items.filter(item => !(item.item.id === itemId && item.type === type))
        });
      },
      
      updateQuantity: (index, quantity) => {
        const { items } = get();
        if (quantity <= 0) {
          // Si la cantidad es 0 o menor, elimina el ítem
          const updatedItems = [...items];
          updatedItems.splice(index, 1);
          set({ items: updatedItems });
        } else {
          // Actualiza la cantidad
          const updatedItems = [...items];
          updatedItems[index].quantity = quantity;
          set({ items: updatedItems });
        }
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      toggleCartVisibility: () => {
        const { showCart } = get();
        set({ showCart: !showCart });
      },
      
      setCartVisibility: (visible) => {
        set({ showCart: visible });
      }
    }),
    {
      name: "cart-storage", // nombre único para el almacenamiento persistente
    }
  )
);