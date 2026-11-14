/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export interface ProductDetails {
  id?: string;
  slug?: string;
  name: string;
  category: string;
  tag?: string;
  price: string | number;
  originalPrice?: string | number;
  rating?: number;
  reviewsCount?: number;
  img: string;
  additionalImages?: string[];
  description?: string;
  story?: string;
  upperMaterial?: string;
  soleMaterial?: string;
  insoleType?: string;
  idealFor?: string;
  sizes?: string[];
}

interface ProductModalContextType {
  selectedProduct: ProductDetails | null;
  isOpen: boolean;
  openProductModal: (product: ProductDetails) => void;
  closeProductModal: () => void;
}

const ProductModalContext = createContext<ProductModalContextType | undefined>(undefined);

export function ProductModalProvider({ children }: { children: React.ReactNode }) {
  const [selectedProduct, setSelectedProduct] = useState<ProductDetails | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openProductModal = useCallback((product: ProductDetails) => {
    setSelectedProduct(product);
    setIsOpen(true);
    // Prevent background scrolling while modal is open
    document.body.style.overflow = 'hidden';
  }, []);

  const closeProductModal = useCallback(() => {
    setIsOpen(false);
    setSelectedProduct(null);
    document.body.style.overflow = 'unset';
  }, []);

  const value = useMemo(
    () => ({
      selectedProduct,
      isOpen,
      openProductModal,
      closeProductModal,
    }),
    [selectedProduct, isOpen, openProductModal, closeProductModal]
  );

  return (
    <ProductModalContext.Provider value={value}>
      {children}
    </ProductModalContext.Provider>
  );
}

export function useProductModal() {
  const context = useContext(ProductModalContext);
  if (!context) {
    throw new Error('useProductModal must be used within a ProductModalProvider');
  }
  return context;
}
