import { useRef } from 'react';
import { ProductCard } from './ProductCard';
import { Icon } from './ui/Icon';

const RECS = [
  {
    name: 'Royal Velvet Embroidered Mojari',
    rating: 4.9,
    price: '₹3,495',
    originalPrice: '₹5,495',
    tag: 'Festive Edit',
    img: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'CloudKnit Daily Slip-On Loafer',
    rating: 4.7,
    price: '₹2,295',
    originalPrice: '₹3,495',
    tag: 'Daily Comfort',
    img: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Aura Metallic Block Heel Sandal',
    rating: 4.8,
    price: '₹2,995',
    originalPrice: '₹4,495',
    tag: "Women's Pick",
    img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Vortex Flex Gym & Pro Runner',
    rating: 4.8,
    price: '₹3,995',
    originalPrice: '₹5,995',
    tag: 'Gym & Sports',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Handcrafted Heritage Penny Loafer',
    rating: 4.9,
    price: '₹4,995',
    originalPrice: '₹7,495',
    tag: 'Formal Leather',
    img: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'AirSlide Ortho Comfort Chappal',
    rating: 4.6,
    price: '₹1,495',
    originalPrice: '₹2,295',
    tag: 'Everyday Ease',
    img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=600&auto=format&fit=crop',
  },
];

export function Recommendations() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
            <span className="text-primary text-xs md:text-sm font-bold cursor-pointer hover:underline tracking-wider uppercase">
              SEE ALL
            </span>
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
          {RECS.map((r) => (
            <ProductCard
              key={r.name}
              name={r.name}
              rating={r.rating}
              price={r.price}
              originalPrice={r.originalPrice}
              tag={r.tag}
              img={r.img}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
