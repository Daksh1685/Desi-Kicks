import { Link } from 'react-router-dom';
import { Icon } from './ui/Icon';
import type { IconName } from './ui/Icon';

interface CategoryItem {
  name: string;
  slug: string;
  count: string;
  icon: IconName;
  img: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    name: 'Men',
    slug: 'men',
    count: '210+ Styles',
    icon: 'person',
    img: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Women',
    slug: 'women',
    count: '185+ Styles',
    icon: 'lifestyle',
    img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Festive & Ethnic',
    slug: 'festive-ethnic',
    count: '120+ Styles',
    icon: 'loyalty',
    img: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Daily Comfort',
    slug: 'daily-comfort',
    count: '95+ Styles',
    icon: 'home',
    img: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Gym & Sports',
    slug: 'gym-sports',
    count: '80+ Styles',
    icon: 'running',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Work & Formal',
    slug: 'work-formal',
    count: '70+ Styles',
    icon: 'briefcase',
    img: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=600&auto=format&fit=crop',
  },
];

export function Categories() {
  return (
    <section id="categories" className="bg-white py-8 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-5">
          <div>
            <span className="text-primary text-xs font-bold uppercase tracking-wider">Footwear For Every Walk</span>
            <h3 className="font-anton text-2xl md:text-3xl text-gray-900 uppercase tracking-wide mt-0.5">
              SHOP BY OCCASION & STYLE
            </h3>
          </div>
          <span className="text-xs text-gray-500 font-medium hidden sm:inline">
            750+ all-occasion footwear styles
          </span>
        </div>

        {/* Compact, 6-Segment Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={`/collections/${cat.slug}`}
              className="group relative block h-36 sm:h-40 md:h-44 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {/* Background Image with Hover Zoom */}
              <img
                src={cat.img}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Gradient Scrim for Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10 group-hover:from-black/95 transition-colors" />

              {/* Top Glass Badge */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md border border-white/25 text-white shadow-xs">
                <Icon name={cat.icon} className="w-3 h-3" />
                <span className="text-[10px] font-semibold tracking-wide text-white/95">
                  {cat.count}
                </span>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-2.5 inset-x-2.5 flex items-end justify-between">
                <div>
                  <h4 className="font-anton text-base sm:text-lg text-white uppercase tracking-wide group-hover:text-primary transition-colors leading-tight">
                    {cat.name}
                  </h4>
                  <span className="text-[10px] text-white/80 group-hover:text-white flex items-center gap-0.5 font-medium transition-colors mt-0.5">
                    Explore
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
