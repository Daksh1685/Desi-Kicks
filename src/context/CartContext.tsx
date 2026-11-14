/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface CartItem {
  id: string;
  productId?: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  size: string;
  color?: string;
  img: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  updateQuantity: (id: string, delta: number) => void;
  updateSize: (id: string, newSize: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalItemsCount: number;
  subtotal: number;
  totalMrp: number;
  totalSavings: number;
}

const INITIAL_CART: CartItem[] = [];

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('craftyoursole_cart') || localStorage.getItem('desikicks_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_CART;
  });

  useEffect(() => {
    try {
      localStorage.setItem('craftyoursole_cart', JSON.stringify(cartItems));
    } catch {
      // Ignore
    }
  }, [cartItems]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems((prev) => {
      const canonicalId =
        item.id ||
        (item.productId ? `${item.productId}-${item.size}` : `${item.name}-${item.size}`);

      const existingIndex = prev.findIndex(
        (i) =>
          i.id === canonicalId ||
          (item.productId && i.productId && i.productId === item.productId && i.size === item.size) ||
          (i.name.trim().toLowerCase() === item.name.trim().toLowerCase() && i.size === item.size)
      );

      if (existingIndex > -1) {
        return prev.map((i, idx) =>
          idx === existingIndex ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, id: canonicalId, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const updateSize = (id: string, newSize: string) => {
    setCartItems((prev) => {
      const itemToUpdate = prev.find((item) => item.id === id);
      if (!itemToUpdate || itemToUpdate.size === newSize) return prev;

      const baseProductId =
        itemToUpdate.productId ||
        itemToUpdate.id.replace(/-UK\s*\d+/i, '').replace(/-\d+$/, '');
      const newId = `${baseProductId}-${newSize}`;

      // Check if target size already exists in another row for this product
      const existingTarget = prev.find(
        (item) =>
          item.id !== id &&
          (item.id === newId ||
            (item.name.trim().toLowerCase() === itemToUpdate.name.trim().toLowerCase() &&
              item.size === newSize))
      );

      if (existingTarget) {
        // Merge into existing target and remove current row
        return prev
          .filter((item) => item.id !== id)
          .map((item) =>
            item.id === existingTarget.id
              ? { ...item, quantity: item.quantity + itemToUpdate.quantity }
              : item
          );
      }

      // No duplicate: just update size and id
      return prev.map((item) =>
        item.id === id ? { ...item, size: newSize, id: newId } : item
      );
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalMrp = cartItems.reduce((acc, item) => acc + item.originalPrice * item.quantity, 0);
  const totalSavings = totalMrp - subtotal;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        updateSize,
        removeFromCart,
        clearCart,
        totalItemsCount,
        subtotal,
        totalMrp,
        totalSavings,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
