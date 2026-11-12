import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import { Icon } from './ui/Icon';
import { useProductCatalog } from '../context/ProductContext';

export function Recommendations() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { activeProducts } = useProductCatalog();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="recommendations" className="bg-white py-10 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-primary text-xs font-bold uppercase tracking-wider">Curated For You</span>
            <h3 className="font-anton text-2xl md:text-3xl text-gray-900 uppercase tracking-wide mt-0.5">
              BEST FOR YOU
            </h3>
          </div>

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
                aria-label="Scroll Left"
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors cursor-pointer"
              >
                <Icon name="chevron_left" className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll('right')}
                aria-label="Scroll Right"
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors cursor-pointer"
              >
                <Icon name="chevron_right" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Container with Smooth Snap */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 md:gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {activeProducts.map((p) => (
            <ProductCard
              key={p.id}
              slug={p.slug}
              name={p.name}
              rating={p.rating}
              price={`₹${p.price.toLocaleString('en-IN')}`}
              originalPrice={`₹${p.originalPrice.toLocaleString('en-IN')}`}
              tag={p.tag || p.category}
              img={p.img}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
