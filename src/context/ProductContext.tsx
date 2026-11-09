/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { Product, NewProductInput } from '../types/product';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    slug: 'royal-velvet-embroidered-mojari',
    name: 'Royal Velvet Embroidered Mojari',
    category: 'Festive & Ethnic',
    tag: 'Festive Edit',
    price: 3495,
    originalPrice: 5495,
    rating: 4.9,
    reviewsCount: 348,
    img: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop',
    ],
    description:
      'A masterpiece of traditional craftsmanship paired with modern foot mechanics. Designed to prevent the traditional heel-bite common in ethnic footwear, our Mojari features a softened inner lining, curved back collar, and high-density memory foam footbed.',
    story:
      'Handcrafted by generational mojari artisans in Jaipur using rich royal velvet and intricate gold Zari threadwork. Engineered specifically for Indian weddings and traditional celebrations with double-padded orthopedic cushioning.',
    upperMaterial: 'Pure Royal Velvet with Hand-Embroidered Gold Zari',
    soleMaterial: 'Buff-Tanned Leather Sole with Anti-Skid Rubber Heel Grip',
    insoleType: 'Ortho-Cushion Double Memory Foam (6mm Arch Support)',
    idealFor: 'Weddings, Sangeet Nights, Diwali, Festive Gatherings & Kurtas',
    artisanRegion: 'Jaipur, Rajasthan',
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    variants: [
      { size: 'UK 6', stock: 12 },
      { size: 'UK 7', stock: 18 },
      { size: 'UK 8', stock: 25 },
      { size: 'UK 9', stock: 22 },
      { size: 'UK 10', stock: 14 },
      { size: 'UK 11', stock: 8 },
    ],
    isActive: true,
    totalSold: 1420,
    createdAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'prod-2',
    slug: 'cloudknit-daily-slip-on-loafer',
    name: 'CloudKnit Daily Slip-On Loafer',
    category: 'Daily Comfort',
    tag: 'Daily Comfort',
    price: 2295,
    originalPrice: 3495,
    rating: 4.7,
    reviewsCount: 512,
    img: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop',
    ],
    description:
      'Step into cloud-like ease with our lightweight slip-on loafer. The elasticated stretch collar hugs your foot without pressure points, while the moisture-wicking bamboo insole keeps feet fresh in Indian tropical weather.',
    story:
      'Engineered for 12+ hour Indian daily commutes, metro walking, and casual office wear. Features our signature 3D air-permeable knit upper and featherlight rebound EVA midsole.',
    upperMaterial: 'Engineered 3D Breathable AirKnit Yarn',
    soleMaterial: 'Ultra-Lightweight Molded EVA with Hexa-Flex Grooves',
    insoleType: 'Ergonomic Removable Memory Foam with Micro-Perforations',
    idealFor: 'Daily Office, College, Walking, Weekend Errands & Travel',
    artisanRegion: 'Bengaluru, Karnataka',
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    variants: [
      { size: 'UK 6', stock: 15 },
      { size: 'UK 7', stock: 30 },
      { size: 'UK 8', stock: 42 },
      { size: 'UK 9', stock: 35 },
      { size: 'UK 10', stock: 20 },
      { size: 'UK 11', stock: 10 },
    ],
    isActive: true,
    totalSold: 2180,
    createdAt: '2026-09-05T12:00:00Z',
  },
  {
    id: 'prod-3',
    slug: 'aura-metallic-block-heel-sandal',
    name: 'Aura Metallic Block Heel Sandal',
    category: "Women's Festive",
    tag: "Women's Pick",
    price: 2995,
    originalPrice: 4495,
    rating: 4.8,
    reviewsCount: 289,
    img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?q=80&w=800&auto=format&fit=crop',
    ],
    description:
      'No more carrying backup flats to parties. The Aura Block Heel distributes body weight evenly across the foot with an anatomical gel arch pad, while the metallic strap prevents toe friction and blisters.',
    story:
      'A glamorous 2.5-inch block heel designed for all-night comfort at cocktail parties and wedding receptions. Blends metallic sheen with anatomical foot support.',
    upperMaterial: 'Shimmer Metallic Finish Vegan Leather with Soft Microfiber Lining',
    soleMaterial: 'Non-Slip Textured Resin Outsole',
    insoleType: 'Dual-Layer CloudGel Forefoot & Heel Cushioning',
    idealFor: 'Cocktails, Receptions, Evening Wear, Sarees & Lehengas',
    artisanRegion: 'Mumbai, Maharashtra',
    sizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9'],
    variants: [
      { size: 'UK 4', stock: 8 },
      { size: 'UK 5', stock: 16 },
      { size: 'UK 6', stock: 24 },
      { size: 'UK 7', stock: 20 },
      { size: 'UK 8', stock: 14 },
      { size: 'UK 9', stock: 6 },
    ],
    isActive: true,
    totalSold: 970,
    createdAt: '2026-09-10T09:30:00Z',
  },
  {
    id: 'prod-4',
    slug: 'vortex-flex-gym-pro-runner',
    name: 'Vortex Flex Gym & Pro Runner',
    category: 'Gym & Sports',
    tag: 'Gym & Sports',
    price: 3995,
    originalPrice: 5995,
    rating: 4.8,
    reviewsCount: 421,
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=800&auto=format&fit=crop',
    ],
    description:
      'The Vortex Flex is precision-tuned for athletic movement. Reinforced heel TPU stability counter prevents ankle roll, while high-abrasion carbon rubber tread pods ensure maximum traction on wet pavements and gym rubber floors.',
    story:
      'Built for maximum propulsion, gym conditioning, and road running. Features a dual-density midsole that absorbs 70% of ground impact shock on hard concrete.',
    upperMaterial: 'Seamless Multi-Zone Engineered Performance Mesh',
    soleMaterial: 'High-Abrasion Carbon Rubber with Forefoot Propulsion Plate',
    insoleType: 'Ortholite High-Rebound Shock Absorption Insole',
    idealFor: 'Running, Gym Training, HIIT, Cardio & Active Workouts',
    artisanRegion: 'Jalandhar, Punjab',
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    variants: [
      { size: 'UK 6', stock: 10 },
      { size: 'UK 7', stock: 15 },
      { size: 'UK 8', stock: 28 },
      { size: 'UK 9', stock: 26 },
      { size: 'UK 10', stock: 18 },
      { size: 'UK 11', stock: 9 },
    ],
    isActive: true,
    totalSold: 1650,
    createdAt: '2026-09-12T14:15:00Z',
  },
  {
    id: 'prod-5',
    slug: 'handcrafted-heritage-penny-loafer',
    name: 'Handcrafted Heritage Penny Loafer',
    category: 'Work & Formal',
    tag: 'Formal Leather',
    price: 4995,
    originalPrice: 7495,
    rating: 4.9,
    reviewsCount: 195,
    img: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop',
    ],
    description:
      'Elevate your formal suits and smart casual chinos. Each pair undergoes a 72-hour manual tanning and polishing process, creating a rich patina that grows even more beautiful over years of boardroom use.',
    story:
      'Masterfully hand-burnished crust leather crafted in Agra, India’s footwear capital. Classic penny strap saddle silhouette with a modern lightweight dress sole.',
    upperMaterial: '100% Genuine Full-Grain Burnished Leather',
    soleMaterial: 'Durable Hand-Stitched Leather Welt with Rubber Grip Inset',
    insoleType: 'Breathable Leather Sockliner with High-Density Heel Cushion',
    idealFor: 'Boardrooms, Formal Meetings, Suits, Blazers & Semi-Formals',
    artisanRegion: 'Agra, Uttar Pradesh',
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    variants: [
      { size: 'UK 6', stock: 7 },
      { size: 'UK 7', stock: 12 },
      { size: 'UK 8', stock: 19 },
      { size: 'UK 9', stock: 16 },
      { size: 'UK 10', stock: 10 },
      { size: 'UK 11', stock: 4 },
    ],
    isActive: true,
    totalSold: 740,
    createdAt: '2026-09-15T11:00:00Z',
  },
  {
    id: 'prod-6',
    slug: 'airslide-ortho-comfort-chappal',
    name: 'AirSlide Ortho Comfort Chappal',
    category: 'Daily Comfort',
    tag: 'Everyday Ease',
    price: 1495,
    originalPrice: 2295,
    rating: 4.6,
    reviewsCount: 680,
    img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800&auto=format&fit=crop',
    ],
    description:
      'Lightweight slip-on chappal with contoured arch groove and acupressure textured footbed. Made for indoor lounging and doorstep errands.',
    story:
      'Crafted with medical-grade EVA foam engineered to alleviate plantar fasciitis and lower-back fatigue common after long standing hours.',
    upperMaterial: 'Soft Quick-Dry Hydrophobic Synthetic Strap',
    soleMaterial: 'High-Density Non-Marking EVA Sole',
    insoleType: 'Contoured Orthopedic Arch-Support Footbed',
    idealFor: 'Indoor Lounging, Post-Workout Recovery, Casual Errands & Verandahs',
    artisanRegion: 'Kanpur, Uttar Pradesh',
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    variants: [
      { size: 'UK 6', stock: 20 },
      { size: 'UK 7', stock: 35 },
      { size: 'UK 8', stock: 40 },
      { size: 'UK 9', stock: 38 },
      { size: 'UK 10', stock: 25 },
      { size: 'UK 11', stock: 15 },
    ],
    isActive: true,
    totalSold: 3120,
    createdAt: '2026-09-18T16:20:00Z',
  },
];

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
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const STORAGE_KEY = 'desikicks_products_catalog';

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
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
    setProducts(INITIAL_PRODUCTS);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

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

