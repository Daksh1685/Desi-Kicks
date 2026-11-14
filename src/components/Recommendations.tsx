import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import { Icon } from './ui/Icon';
import { useProductCatalog } from '../context/ProductContext';
import { IMG } from '../constants/images';

export function Recommendations() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { activeProducts } = useProductCatalog();

  if (activeProducts.length === 0) {
    return (
      <section className="bg-gradient-to-br from-orange-50 to-amber-50 py-16 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Central content */}
          <div className="text-center mb-12">
            <div className="text-7xl mb-6 inline-block animate-bounce">👟</div>
            <h2 className="font-anton text-3xl sm:text-4xl md:text-5xl text-gray-900 uppercase tracking-wide mb-4">
              Something Special Is Being Crafted
            </h2>
            <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed mb-8">
              Our artisans are handcrafting your next favourite pair. New arrivals dropping very soon.
            </p>
            <Link
              to="/profile"
              className="inline-block bg-primary text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm shadow-lg hover:opacity-90 transition-opacity"
            >
              Get Notified
            </Link>
          </div>

          {/* Teaser / preview cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {[IMG.rec1, IMG.rec2, IMG.rec3].map((src, i) => (
              <div key={i} className="relative rounded-2xl overflow-hidden aspect-[3/4] shadow-md">
                <img
                  src={src}
                  alt="Coming soon"
                  className="w-full h-full object-cover grayscale opacity-60 blur-[2px] scale-105"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                  <span className="bg-white/90 text-gray-900 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow mb-2">
                    Coming Soon
                  </span>
                  <svg className="w-7 h-7 text-white/70 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-9a3 3 0 100-6 3 3 0 000 6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

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
              id={p.id}
              slug={p.slug}
              name={p.name}
              rating={p.rating}
              price={`₹${p.price.toLocaleString('en-IN')}`}
              originalPrice={`₹${p.originalPrice.toLocaleString('en-IN')}`}
              tag={p.tag || p.category}
              img={p.img}
              stock={p.variants?.reduce((sum, v) => sum + v.stock, 0)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
