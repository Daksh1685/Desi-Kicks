import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from './ui/Icon';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useProductModal } from '../context/ProductModalContext';

interface WomenProductPlaceholder {
  id: string;
  slug: string;
  name: string;
  category: string;
  subcategory: string;
  tag?: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  img: string;
  sizes: string[];
}

/**
 * Curated Women's Collection footwear.
 */
const WOMEN_PLACEHOLDER_PRODUCTS: WomenProductPlaceholder[] = [
  {
    id: 'w-1',
    slug: 'flora-botanical-cushion-slide',
    name: 'Flora Botanical Cushion Slide',
    category: 'Women',
    subcategory: 'Floral Slides',
    price: 1899,
    originalPrice: 2999,
    rating: 4.9,
    reviewsCount: 382,
    img: '/products/floral-botanical-slide.jpg',
    sizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'],
  },
  {
    id: 'w-2',
    slug: 'in-bloom-pastel-retro-sneaker',
    name: 'In Bloom Pastel Retro Sneaker',
    category: 'Women',
    subcategory: 'Casual Sneakers',
    price: 2299,
    originalPrice: 3499,
    rating: 4.9,
    reviewsCount: 415,
    img: '/products/womens-in-bloom-sneaker.jpg',
    sizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'],
  },
  {
    id: 'w-3',
    slug: 'aura-metallic-rose-gold-block-heel',
    name: 'Aura Rose Gold Block Heel',
    category: 'Women',
    subcategory: 'Block Heels',
    price: 2499,
    originalPrice: 3799,
    rating: 4.8,
    reviewsCount: 289,
    img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
    sizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'],
  },
  {
    id: 'w-4',
    slug: 'zari-embroidered-royal-velvet-flat',
    name: 'Zari Embroidered Velvet Flat',
    category: 'Women',
    subcategory: 'Embroidered Juttis',
    price: 2199,
    originalPrice: 3299,
    rating: 4.9,
    reviewsCount: 340,
    img: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop',
    sizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'],
  },
  {
    id: 'w-5',
    slug: 'cloudwalk-everyday-comfort-mule',
    name: 'CloudWalk Everyday Comfort Mule',
    category: 'Women',
    subcategory: 'Comfort Mules',
    price: 1799,
    originalPrice: 2699,
    rating: 4.8,
    reviewsCount: 275,
    img: '/products/meadow-cork-slide.jpg',
    sizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'],
  },
  {
    id: 'w-6',
    slug: 'riviera-cushioned-low-wedge',
    name: 'Riviera Cushioned Low Wedge',
    category: 'Women',
    subcategory: 'Wedges & Sandals',
    price: 2399,
    originalPrice: 3599,
    rating: 4.8,
    reviewsCount: 210,
    img: 'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?q=80&w=800&auto=format&fit=crop',
    sizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'],
  },
];

/**
 * Soft blush & rose tonal studio placeholder canvas for Women's collection.
 */
function WomenShoePlaceholder({ subcategory }: { subcategory: string }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-[#FDF2F4] via-[#F7E1E7] to-[#EACCD6] text-[#A64B6A] flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Soft atmospheric blur */}
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/40 blur-xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-pink-900/5 blur-lg pointer-events-none" />

      {/* Floating Ground Shadow */}
      <div className="absolute bottom-5 w-36 h-3 bg-pink-900/15 rounded-full blur-xs pointer-events-none" />

      {/* Minimalist Footwear Outline */}
      <svg
        className="w-24 h-24 mb-2 drop-shadow-xs opacity-90 transition-transform duration-700 ease-out group-hover:scale-108 group-hover:-translate-y-1.5"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 68 C 12 68, 16 74, 28 74 L 84 74 C 88 74, 91 70, 91 66 C 91 58, 88 56, 82 54 L 75 52 C 73 50, 71 42, 68 37 C 65 32, 59 28, 52 28 C 47 28, 44 32, 42 36 L 40 43 L 26 48 C 18 52, 13 58, 12 68 Z" />
        <line x1="14" y1="71" x2="89" y2="71" strokeWidth="2.6" />
        <path d="M42 36 C 45 42, 50 48, 56 50" />
        <line x1="43" y1="44" x2="51" y2="43" />
        <line x1="40" y1="49" x2="48" y2="48" />
        <line x1="36" y1="54" x2="44" y2="53" />
        <path d="M26 62 Q 45 56 65 62" strokeWidth="1.8" strokeDasharray="3 2" />
      </svg>

      {/* Placeholder Label */}
      <div className="flex items-center gap-1.5 bg-white/85 backdrop-blur-xs px-3 py-1 rounded-full shadow-2xs border border-white/60">
        <span className="w-1.5 h-1.5 rounded-full bg-[#A64B6A]" />
        <span className="text-[10px] font-bold tracking-wider uppercase opacity-90 text-gray-800">
          {subcategory || 'Women'} • 4:3
        </span>
      </div>
    </div>
  );
}

export function WomensCollection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { openProductModal } = useProductModal();
  const navigate = useNavigate();

  const [addedId, setAddedId] = useState<string | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleQuickAdd = (e: React.MouseEvent, product: WomenProductPlaceholder) => {
    e.stopPropagation();
    const primarySize = product.sizes[0] || 'UK 6';
    addToCart({
      id: `${product.id}-${primarySize}`,
      productId: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice,
      size: primarySize,
      img: product.img || '/hero/women-nature-landscape.webp',
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1600);
  };

  const handleQuickView = (e: React.MouseEvent, product: WomenProductPlaceholder) => {
    e.stopPropagation();
    openProductModal({
      id: product.id,
      name: product.name,
      rating: product.rating,
      price: `₹${product.price.toLocaleString('en-IN')}`,
      originalPrice: `₹${product.originalPrice.toLocaleString('en-IN')}`,
      tag: product.tag || 'Women',
      img: product.img || '/hero/women-nature-landscape.webp',
      category: product.category,
      slug: product.slug,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent, product: WomenProductPlaceholder) => {
    e.stopPropagation();
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      img: product.img || '/hero/women-nature-landscape.webp',
      slug: product.slug,
    });
  };

  return (
    <section className="w-full" aria-label="Women's Feature & Collection">
      {/* 1. Responsive "Nature in Every Step" Promotional Feature Banner */}
      <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-4 md:px-6 pt-4 pb-6 md:pb-8">
        <Link
          to="/collections/women"
          className="block w-full aspect-[3/4] sm:aspect-[3/1] rounded-2xl md:rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 relative group cursor-pointer border border-neutral-100/80"
          aria-label="Nature In Every Step - Explore Women's Collection"
        >
          <picture className="w-full h-full block">
            {/* Mobile 3:4 portrait version */}
            <source
              media="(max-width: 639px)"
              type="image/webp"
              srcSet="/hero/women-nature-portrait.webp"
            />
            <source
              media="(max-width: 639px)"
              srcSet="/hero/women-nature-portrait.jpg"
            />
            {/* Desktop 3:1 panoramic ribbon landscape version */}
            <source
              media="(min-width: 640px)"
              type="image/webp"
              srcSet="/hero/women-nature-landscape.webp"
            />
            <source
              media="(min-width: 640px)"
              srcSet="/hero/women-nature-landscape.jpg"
            />
            <img
              src="/hero/women-nature-landscape.jpg"
              alt="Nature In Every Step - Handcrafted Women's Floral Sandals Collection"
              className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700 ease-out"
              loading="lazy"
            />
          </picture>
        </Link>
      </div>

      {/* 2. Women's Collection Product Shelf */}
      <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-4 md:px-6 pb-8 md:pb-12">
        {/* Header with Title & Scroll Controls */}
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Walk in Bloom
            </h2>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-3">
            <Link
              to="/collections/women"
              className="text-primary text-xs md:text-sm font-bold cursor-pointer hover:underline tracking-wider uppercase mr-1"
            >
              SEE ALL
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                aria-label="Previous Women's Footwear"
                className="w-10 h-10 rounded-full border border-gray-200 text-gray-400 hover:text-gray-800 hover:border-gray-400 flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95"
              >
                <Icon name="chevron_left" className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                aria-label="Next Women's Footwear"
                className="w-10 h-10 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs active:scale-95"
              >
                <Icon name="chevron_right" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Carousel Track with Large Full-Bleed Cards */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-5 pt-1 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {WOMEN_PLACEHOLDER_PRODUCTS.map((product) => {
            const isWishlisted = isInWishlist(product.id || product.slug);
            const isAdded = addedId === product.id;

            return (
              <div
                key={product.id}
                onClick={() => navigate(`/products/${product.slug}`)}
                className="group w-[300px] sm:w-[330px] md:w-[360px] lg:w-[380px] shrink-0 snap-start flex flex-col bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-gray-100/90 hover:border-gray-200 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer relative select-none"
              >
                {/* Full-Bleed Visual Canvas (Zero Inner Padding) */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                  {product.img ? (
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                  ) : (
                    <WomenShoePlaceholder subcategory={product.subcategory} />
                  )}

                  {/* Wishlist Button (Glass Circle on Top-Left) */}
                  <button
                    onClick={(e) => handleWishlistToggle(e, product)}
                    aria-label="Add to Wishlist"
                    className={`absolute top-3.5 left-3.5 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white backdrop-blur-md text-gray-700 flex items-center justify-center shadow-xs transition-all hover:scale-110 active:scale-90 ${
                      isWishlisted ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <Icon
                      name="favorite"
                      filled={isWishlisted}
                      className={`w-4 h-4 transition-colors ${
                        isWishlisted ? 'text-primary fill-primary' : 'text-gray-600'
                      }`}
                    />
                  </button>

                  {/* Subtle Star Rating Pill on Top-Right */}
                  <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-1 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full shadow-xs text-xs font-semibold text-gray-800">
                    <span className="text-amber-500 text-xs">★</span>
                    <span>{product.rating.toFixed(1)}</span>
                  </div>

                  {/* Hover Gradient Scrim & Quick Action Buttons */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div className="absolute bottom-3 inset-x-3 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <button
                      onClick={(e) => handleQuickView(e, product)}
                      title="Quick View"
                      className="flex-1 py-2 px-3 bg-white/95 hover:bg-gray-900 hover:text-white text-gray-900 rounded-xl text-[11px] font-bold uppercase tracking-wider shadow-md transition-colors cursor-pointer"
                    >
                      Quick View
                    </button>
                    <button
                      onClick={(e) => handleQuickAdd(e, product)}
                      title="Add to Bag"
                      className={`flex-1 py-2 px-3 rounded-xl text-[11px] font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-primary hover:bg-[#8A2600] text-white'
                      }`}
                    >
                      {isAdded ? '✓ Added' : '+ Add to Bag'}
                    </button>
                  </div>
                </div>

                {/* Clean Information Bar with Comfortable Padding */}
                <div className="p-4 sm:p-5 flex flex-col flex-1 bg-white">
                  {/* Category Micro Eyebrow */}
                  <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 tracking-[0.18em] uppercase truncate block mb-1">
                    {product.category} • {product.subcategory}
                  </span>

                  {/* Name on Left, Price on Right */}
                  <div className="flex items-baseline justify-between gap-3 mt-auto">
                    <h3
                      className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-primary transition-colors truncate"
                      title={product.name}
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-baseline gap-1.5 shrink-0">
                      <span className="text-sm sm:text-base font-bold text-gray-900">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
