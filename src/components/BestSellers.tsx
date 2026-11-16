import { useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import { Icon } from './ui/Icon';
import { useProductCatalog } from '../context/ProductContext';
import { getBestSellerProducts } from '../lib/bestSellerAlgorithm';

export function BestSellers() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { activeProducts } = useProductCatalog();

  // Rank products using the Best Seller scoring algorithm
  const bestSellers = useMemo(() => {
    return getBestSellerProducts(activeProducts, 10);
  }, [activeProducts]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="best-sellers"
      className="w-full max-w-[1600px] mx-auto px-2 sm:px-4 md:px-6 py-6 md:py-8"
      aria-label="Best Sellers"
    >
      {/* Header with Title and Scroll Controls */}
      <div className="flex justify-between items-end mb-5 md:mb-6">
        <div>
          <span className="text-primary text-xs font-bold uppercase tracking-wider">
            Customer Favorites • High Demand
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mt-0.5">
            Best Sellers
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <Link
            to="/collections"
            className="text-primary text-xs md:text-sm font-bold cursor-pointer hover:underline tracking-wider uppercase"
          >
            SEE ALL
          </Link>
          <div className="hidden sm:flex items-center gap-1.5 ml-2">
            <button
              onClick={() => scroll('left')}
              aria-label="Previous Best Sellers"
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-100 hover:text-primary hover:border-gray-300 transition-all duration-200 cursor-pointer active:scale-95"
            >
              <Icon name="chevron_left" className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Next Best Sellers"
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-100 hover:text-primary hover:border-gray-300 transition-all duration-200 cursor-pointer active:scale-95"
            >
              <Icon name="chevron_right" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 md:gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {bestSellers.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            slug={product.slug}
            name={product.name}
            rating={product.rating}
            price={`₹${product.price.toLocaleString('en-IN')}`}
            originalPrice={`₹${product.originalPrice.toLocaleString('en-IN')}`}
            tag={product.tag || 'Best Seller'}
            img={product.img}
            stock={product.variants?.reduce((sum, v) => sum + v.stock, 0)}
          />
        ))}
      </div>
    </section>
  );
}
