import { ProductCard } from './ProductCard';

const RECS = [
  {
    name: 'Vortex Run Pro',
    rating: 4.8,
    price: '₹9,995',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2370&auto=format&fit=crop'
  },
  {
    name: 'Urban Drift Grey',
    rating: 4.5,
    price: '₹7,495',
    img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=2274&auto=format&fit=crop'
  },
  {
    name: 'Aero Boost 360',
    rating: 4.9,
    price: '₹12,495',
    img: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=2312&auto=format&fit=crop'
  },
  {
    name: 'Street Walker X',
    rating: 4.3,
    price: '₹5,995',
    img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=2400&auto=format&fit=crop'
  }
];

export function Recommendations() {
  return (
    <section className="bg-white py-8 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-l font-medium text-gray-700 uppercase tracking-tight">Best for You</h3>
          <span className="text-primary text-sm font-bold cursor-pointer hover:underline">SEE ALL</span>
        </div>

        {/* Hide scrollbar for cleaner look, allow overflow-x for swiping */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {RECS.map((r) => (
            <ProductCard
              key={r.name}
              name={r.name}
              rating={r.rating}
              price={r.price}
              img={r.img}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
