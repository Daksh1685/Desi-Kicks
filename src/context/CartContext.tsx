/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface CartItem {
  id: string;
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

const INITIAL_CART: CartItem[] = [
  {
    id: 'c1',
    name: 'Royal Velvet Embroidered Mojari',
    category: 'Festive & Wedding',
    price: 3495,
    originalPrice: 5495,
    size: 'UK 9',
    color: 'Royal Maroon',
    img: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=600&auto=format&fit=crop',
    quantity: 1,
  },
  {
    id: 'c2',
    name: 'BreezeStep Knit Slip-On Loafer',
    category: 'Daily Comfort',
    price: 2295,
    originalPrice: 3495,
    size: 'UK 9',
    color: 'Navy Blue',
    img: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=600&auto=format&fit=crop',
    quantity: 1,
  },
  {
    id: 'c3',
    name: 'Aura Metallic Block Heel Sandal',
    category: "Women's Festive",
    price: 2995,
    originalPrice: 4495,
    size: 'UK 5',
    color: 'Champagne Gold',
    img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop',
    quantity: 1,
  },
];

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('desikicks_cart');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_CART;
  });

  useEffect(() => {
    try {
      localStorage.setItem('desikicks_cart', JSON.stringify(cartItems));
    } catch {
      // Ignore
    }
  }, [cartItems]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.name === item.name && i.size === item.size);
      if (existing) {
        return prev.map((i) =>
          i.name === item.name && i.size === item.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
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
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, size: newSize } : item))
    );
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
