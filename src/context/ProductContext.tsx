/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { Product, NewProductInput } from '../types/product';

const INITIAL_PRODUCTS: Product[] = [];
const MOCK_IDS = new Set(['prod-1', 'prod-2', 'prod-3', 'prod-4', 'prod-5', 'prod-6']);

interface ProductContextType {
  products: Product[];
  activeProducts: Product[];
  addProduct: (input: NewProductInput) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductStatus: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  getProductBySlug: (slug: string) => Product | undefined;
  resetToDefaultCatalog: () => void;
  deductVariantStock: (items: { productId: string; size: string; quantity: number }[]) => boolean;
  checkStockAvailability: (items: { productId: string; size: string; quantity: number }[]) => {
    available: boolean;
    errorItem?: string;
  };
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const STORAGE_KEY = 'craftyoursole_products_catalog';
const LEGACY_STORAGE_KEY = 'desikicks_products_catalog';

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter((p: Product) => !MOCK_IDS.has(p.id));
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_PRODUCTS;
  });

  // Persist catalog updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.warn('Failed to save products to localStorage', e);
    }
  }, [products]);

  const activeProducts = useMemo(() => products.filter((p) => p.isActive), [products]);

  const addProduct = useCallback((input: NewProductInput): Product => {
    const slug = input.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const newProduct: Product = {
      ...input,
      id: `prod-${Date.now()}`,
      slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
      rating: 5.0,
      reviewsCount: 0,
      totalSold: 0,
      createdAt: new Date().toISOString(),
      variants: input.variants || input.sizes.map((s) => ({ size: s, stock: 20 })),
    };

    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toggleProductStatus = useCallback((id: string) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    );
  }, []);

  const getProductById = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products]
  );

  const getProductBySlug = useCallback(
    (slug: string) => products.find((p) => p.slug === slug),
    [products]
  );

  const resetToDefaultCatalog = useCallback(() => {
    setProducts([]);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  }, []);

  const checkStockAvailability = useCallback(
    (items: { productId: string; size: string; quantity: number }[]) => {
      for (const item of items) {
        const cleanId = item.productId.split('-')[0];
        const product = products.find(
          (p) =>
            p.id === item.productId ||
            p.id === cleanId ||
            p.slug === item.productId ||
            p.name === item.productId
        );
        if (!product) continue;
        const variant = product.variants?.find((v) => v.size === item.size);
        const availableStock = variant ? variant.stock : 0;
        if (availableStock < item.quantity) {
          return {
            available: false,
            errorItem: `"${product.name}" (${item.size}) has only ${availableStock} pair(s) in stock (requested ${item.quantity}).`,
          };
        }
      }
      return { available: true };
    },
    [products]
  );

  const deductVariantStock = useCallback(
    (items: { productId: string; size: string; quantity: number }[]) => {
      setProducts((prev) =>
        prev.map((prod) => {
          const matchingItems = items.filter((item) => {
            const cleanId = item.productId.split('-')[0];
            return (
              prod.id === item.productId ||
              prod.id === cleanId ||
              prod.slug === item.productId ||
              prod.name === item.productId
            );
          });

          if (matchingItems.length === 0) return prod;

          const newVariants = (prod.variants || []).map((v) => {
            const deduction = matchingItems
              .filter((item) => item.size === v.size)
              .reduce((sum, item) => sum + item.quantity, 0);
            return {
              ...v,
              stock: Math.max(0, v.stock - deduction),
            };
          });

          const totalDeducted = matchingItems.reduce((sum, item) => sum + item.quantity, 0);

          return {
            ...prod,
            variants: newVariants,
            totalSold: (prod.totalSold || 0) + totalDeducted,
          };
        })
      );
      return true;
    },
    []
  );

  const value = useMemo(
    () => ({
      products,
      activeProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      toggleProductStatus,
      getProductById,
      getProductBySlug,
      resetToDefaultCatalog,
      deductVariantStock,
      checkStockAvailability,
    }),
    [
      products,
      activeProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      toggleProductStatus,
      getProductById,
      getProductBySlug,
      resetToDefaultCatalog,
      deductVariantStock,
      checkStockAvailability,
    ]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProductCatalog() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductCatalog must be used within a ProductProvider');
  }
  return context;
}

