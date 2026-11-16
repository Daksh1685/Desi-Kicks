import type { Product } from '../types/product';

/**
 * Best Seller Algorithm Weight Configuration
 * Allows fine-tuning the balance between raw sales, customer reviews,
 * stock health, and merchandising promotions.
 */
export interface BestSellerWeights {
  /** Weight given to total verified units sold (0.0 to 1.0) */
  salesVolume: number;
  /** Weight given to customer rating & review volume (0.0 to 1.0) */
  ratingScore: number;
  /** Weight given to stock availability (avoids promoting sold-out items) */
  stockHealth: number;
  /** Bonus weight for curated merchant tags like "Best Seller" or "Trending" */
  merchantBoost: number;
}

export const DEFAULT_BEST_SELLER_WEIGHTS: BestSellerWeights = {
  salesVolume: 0.45,
  ratingScore: 0.25,
  stockHealth: 0.15,
  merchantBoost: 0.15,
};

/**
 * Computes an objective Best Seller score for a product.
 * Returns a score from 0.0 to 100.0 (higher = better rank).
 *
 * Mathematical Formula:
 * Score = (W_sales * S_sales) + (W_rating * S_rating) + (W_stock * S_stock) + (W_boost * S_boost)
 *
 * 1. S_sales (Sales Volume Normalized):
 *    (totalSold / maxSalesInCatalog) * 100
 *
 * 2. S_rating (Bayesian Confidence Score):
 *    Normalizes star rating (0-5) scaled logarithmically by review count,
 *    preventing a product with 1 single 5-star review from beating a 4.8-star
 *    product with 500+ verified customer reviews.
 *
 * 3. S_stock (Inventory Availability):
 *    100 if stock > 5, 50 if low stock (1-5), 0 if completely sold out.
 *
 * 4. S_boost (Merchant Prioritization):
 *    100 if tagged "Best Seller", "Trending", or "Signature".
 */
export function calculateBestSellerScore(
  product: Product,
  maxSales: number = 100,
  weights: BestSellerWeights = DEFAULT_BEST_SELLER_WEIGHTS
): number {
  // 1. Sales Volume Score (0 - 100)
  const safeMaxSales = Math.max(maxSales, 1);
  const salesScore = Math.min((product.totalSold / safeMaxSales) * 100, 100);

  // 2. Rating & Review Confidence Score (0 - 100)
  // Rating contribution (0-60 points) + logarithmic review volume contribution (0-40 points)
  const baseRating = (product.rating / 5) * 60;
  const reviewCountBonus = Math.min(Math.log10((product.reviewsCount || 0) + 1) / 3, 1) * 40;
  const ratingScore = Math.min(baseRating + reviewCountBonus, 100);

  // 3. Stock Health Score (0 - 100)
  const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0);
  let stockScore = 100;
  if (totalStock !== undefined) {
    if (totalStock <= 0) {
      stockScore = 0; // Penalize sold out items so customers aren't recommended dead ends
    } else if (totalStock <= 5) {
      stockScore = 60; // Slightly penalize near-stockout items
    }
  }

  // 4. Merchant Tag Boost (0 - 100)
  const tagLower = (product.tag || '').toLowerCase();
  const nameLower = (product.name || '').toLowerCase();
  const isTaggedBestSeller =
    tagLower.includes('best seller') ||
    tagLower.includes('bestseller') ||
    tagLower.includes('trending') ||
    tagLower.includes('signature') ||
    nameLower.includes('timeless') ||
    nameLower.includes('classic');
  const merchantBoostScore = isTaggedBestSeller ? 100 : 0;

  // Composite Weighted Sum
  const totalWeight =
    weights.salesVolume + weights.ratingScore + weights.stockHealth + weights.merchantBoost;

  const compositeScore =
    (salesScore * weights.salesVolume +
      ratingScore * weights.ratingScore +
      stockScore * weights.stockHealth +
      merchantBoostScore * weights.merchantBoost) /
    totalWeight;

  return Math.round(compositeScore * 10) / 10;
}

/**
 * Curated Fallback Best Sellers
 * Used when the store is launching or catalog has no orders yet,
 * ensuring the storefront looks vibrant, realistic, and complete.
 */
export const FALLBACK_BEST_SELLERS: Product[] = [
  {
    id: 'bs-1',
    slug: 'retro-timeless-street-sneaker',
    name: 'Retro Timeless Casual Sneaker',
    category: 'Men',
    subcategory: 'Casual Sneakers',
    gender: 'Men',
    tag: 'Best Seller',
    price: 2499,
    originalPrice: 3999,
    rating: 4.9,
    reviewsCount: 428,
    img: '/hero/category-men.jpg',
    description: 'Iconic low-top retro sneaker with dual-density cushioned sole and suede accents.',
    story: 'Designed for effortless everyday character and all-day street comfort.',
    upperMaterial: 'Full-Grain Vegan Suede & Breathable Canvas',
    soleMaterial: 'Vulcanized Anti-Skid Gum Rubber',
    insoleType: 'Dual-Layer Memory Foam Cushion',
    idealFor: 'Daily Casuals, College, Street Style & Weekend Outings',
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    variants: [
      { size: 'UK 7', stock: 15 },
      { size: 'UK 8', stock: 24 },
      { size: 'UK 9', stock: 32 },
      { size: 'UK 10', stock: 18 },
      { size: 'UK 11', stock: 9 },
    ],
    isActive: true,
    totalSold: 642,
    createdAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'bs-2',
    slug: 'womens-dusty-rose-bloom-sneaker',
    name: "Women's In Bloom Pastel Sneaker",
    category: 'Women',
    subcategory: 'Casual Sneakers',
    gender: 'Women',
    tag: 'Trending Pick',
    price: 2299,
    originalPrice: 3499,
    rating: 4.8,
    reviewsCount: 315,
    img: '/hero/category-women.jpg',
    description: 'Soft dusty rose casual trainer with plush ankle collar and ultra-lightweight sole.',
    story: 'Blends playful floral undertones with cloud-like walking comfort.',
    upperMaterial: 'Pastel Microfiber & Breathable Knit',
    soleMaterial: 'Featherlight Cushion Rebound EVA',
    insoleType: 'Ortho-Soft Anatomical Foam',
    idealFor: 'Brunch, Travel, Daily Walks & Casual Styling',
    sizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'],
    variants: [
      { size: 'UK 4', stock: 12 },
      { size: 'UK 5', stock: 20 },
      { size: 'UK 6', stock: 28 },
      { size: 'UK 7', stock: 16 },
      { size: 'UK 8', stock: 8 },
    ],
    isActive: true,
    totalSold: 518,
    createdAt: '2026-02-01T00:00:00.000Z',
  },
  {
    id: 'bs-3',
    slug: 'playful-kids-active-sneaker',
    name: "Playful Kids' Easy-Strap Sneaker",
    category: 'Kids',
    subcategory: 'Casual Sneakers',
    gender: 'Unisex',
    tag: 'Best Seller',
    price: 1699,
    originalPrice: 2499,
    rating: 4.9,
    reviewsCount: 260,
    img: '/hero/category-kids.jpg',
    description: 'Durable playground runner with easy hook-and-loop strap and cute heart detail.',
    story: 'Engineered for non-stop play with reinforced toe guards and flexible sole.',
    upperMaterial: 'Durable Anti-Scuff Synthetic Leather',
    soleMaterial: 'Flexible Non-Marking Rubber Outsole',
    insoleType: 'Cushioned Shock-Absorbing Insole',
    idealFor: 'School, Playgrounds, Sports & Daily Adventures',
    sizes: ['UK 1', 'UK 2', 'UK 3', 'UK 4', 'UK 5'],
    variants: [
      { size: 'UK 1', stock: 14 },
      { size: 'UK 2', stock: 19 },
      { size: 'UK 3', stock: 22 },
      { size: 'UK 4', stock: 15 },
      { size: 'UK 5', stock: 10 },
    ],
    isActive: true,
    totalSold: 489,
    createdAt: '2026-02-10T00:00:00.000Z',
  },
  {
    id: 'bs-4',
    slug: 'royal-velvet-embroidered-mojari',
    name: 'Royal Velvet Embroidered Mojari',
    category: 'Festive & Ethnic',
    subcategory: 'Juttis & Mojaris',
    gender: 'Unisex',
    tag: 'Festive Signature',
    price: 2799,
    originalPrice: 4299,
    rating: 4.9,
    reviewsCount: 348,
    img: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop',
    description: 'Handcrafted royal velvet mojari with intricate gold Zari threadwork and zero heel-bite.',
    story: 'Handcrafted by generational artisans in Jaipur with double-padded arch cushion.',
    upperMaterial: 'Pure Royal Velvet with Hand-Embroidered Zari',
    soleMaterial: 'Buff-Tanned Leather Sole with Anti-Skid Rubber Grip',
    insoleType: 'Ortho-Cushion Double Memory Foam (6mm Arch Support)',
    idealFor: 'Weddings, Sangeet, Festive Celebrations & Kurtas',
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    variants: [
      { size: 'UK 7', stock: 18 },
      { size: 'UK 8', stock: 25 },
      { size: 'UK 9', stock: 30 },
      { size: 'UK 10', stock: 15 },
    ],
    isActive: true,
    totalSold: 580,
    createdAt: '2026-01-05T00:00:00.000Z',
  },
  {
    id: 'bs-5',
    slug: 'cloudknit-daily-slip-on-loafer',
    name: 'CloudKnit Daily Slip-On Loafer',
    category: 'Daily Comfort',
    subcategory: 'AirKnit Slip-Ons',
    gender: 'Men',
    tag: 'Top Rated',
    price: 1899,
    originalPrice: 2999,
    rating: 4.8,
    reviewsCount: 512,
    img: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop',
    description: 'Ultra-lightweight slip-on with 3D breathable knit upper and rebound EVA midsole.',
    story: 'Engineered for 12+ hour daily commutes, office wear, and relaxed weekend walking.',
    upperMaterial: 'Engineered 3D Breathable AirKnit Yarn',
    soleMaterial: 'Ultra-Lightweight Molded EVA with Hexa-Flex Grooves',
    insoleType: 'Ergonomic Removable Memory Foam with Micro-Perforations',
    idealFor: 'Daily Commutes, Walking, Office & Travel',
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    variants: [
      { size: 'UK 7', stock: 22 },
      { size: 'UK 8', stock: 35 },
      { size: 'UK 9', stock: 40 },
      { size: 'UK 10', stock: 20 },
    ],
    isActive: true,
    totalSold: 720,
    createdAt: '2026-01-20T00:00:00.000Z',
  },
  {
    id: 'bs-6',
    slug: 'vortex-flex-gym-runner',
    name: 'Vortex Flex Gym & Road Runner',
    category: 'Gym & Sports',
    subcategory: 'Training & Gym Sneakers',
    gender: 'Unisex',
    tag: 'Athletic Choice',
    price: 2599,
    originalPrice: 3899,
    rating: 4.8,
    reviewsCount: 421,
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
    description: 'High-rebound road runner with shock-absorbing midsole and carbon traction pods.',
    story: 'Precision-tuned for cardio, morning runs, and intense gym workouts.',
    upperMaterial: 'Multi-Zone Performance Mesh',
    soleMaterial: 'High-Abrasion Carbon Rubber with Propulsion Plate',
    insoleType: 'Ortholite High-Rebound Shock Absorption Insole',
    idealFor: 'Running, Gym Training, HIIT & Active Workouts',
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    variants: [
      { size: 'UK 7', stock: 14 },
      { size: 'UK 8', stock: 22 },
      { size: 'UK 9', stock: 26 },
      { size: 'UK 10', stock: 12 },
    ],
    isActive: true,
    totalSold: 495,
    createdAt: '2026-02-05T00:00:00.000Z',
  },
];

/**
 * Returns products ranked by the Best Seller Algorithm.
 * If active products in database/catalog are fewer than limit,
 * supplements with fallback best sellers so the UI is always full.
 */
export function getBestSellerProducts(
  catalogProducts: Product[],
  limit: number = 8,
  weights: BestSellerWeights = DEFAULT_BEST_SELLER_WEIGHTS
): (Product & { bestSellerScore: number })[] {
  // If catalog has products, score and rank them
  const activeCatalog = catalogProducts.filter((p) => p.isActive);

  // Compute max sales in catalog for normalization
  const maxSales = Math.max(
    ...activeCatalog.map((p) => p.totalSold || 0),
    ...FALLBACK_BEST_SELLERS.map((p) => p.totalSold || 0),
    1
  );

  // Score catalog products
  const scoredCatalog = activeCatalog.map((product) => ({
    ...product,
    bestSellerScore: calculateBestSellerScore(product, maxSales, weights),
  }));

  // Sort descending by score
  scoredCatalog.sort((a, b) => b.bestSellerScore - a.bestSellerScore);

  // If catalog has enough products, return top N
  if (scoredCatalog.length >= limit) {
    return scoredCatalog.slice(0, limit);
  }

  // Otherwise, merge with scored fallback items (avoiding duplicates by id or slug)
  const existingIds = new Set(scoredCatalog.map((p) => p.id));
  const existingSlugs = new Set(scoredCatalog.map((p) => p.slug));

  const scoredFallbacks = FALLBACK_BEST_SELLERS.filter(
    (p) => !existingIds.has(p.id) && !existingSlugs.has(p.slug)
  ).map((product) => ({
    ...product,
    bestSellerScore: calculateBestSellerScore(product, maxSales, weights),
  }));

  const combined = [...scoredCatalog, ...scoredFallbacks];
  combined.sort((a, b) => b.bestSellerScore - a.bestSellerScore);

  return combined.slice(0, limit);
}
