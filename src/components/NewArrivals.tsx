import { useNavigate } from 'react-router-dom';
import { Icon } from './ui/Icon';
import { useProductModal } from '../context/ProductModalContext';
import { useProductCatalog } from '../context/ProductContext';

export function NewArrivals() {
  const { openProductModal } = useProductModal();
  const { activeProducts } = useProductCatalog();
  const navigate = useNavigate();

  // Dynamically select products or fallback gracefully
  const featured = activeProducts[0];
  const second = activeProducts[1] || activeProducts[0];
  const third = activeProducts[2] || activeProducts[0];

  if (!featured) return null;

  const calculateDiscount = (price: number, mrp: number) => {
    if (!mrp || mrp <= price) return null;
    return Math.round(((mrp - price) / mrp) * 100);
  };

  return (
    <section className="bg-gray-50 py-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-6 md:mb-8">
          <div>
            <span className="text-primary text-xs font-bold uppercase tracking-wider">Just Arrived</span>
            <h3 className="font-anton text-2xl md:text-3xl text-gray-900 uppercase tracking-wide mt-0.5">
              NEW SEASON DROPS
            </h3>
          </div>
          <span
            onClick={() => navigate('/collections')}
            className="text-primary text-xs md:text-sm font-bold cursor-pointer hover:underline uppercase tracking-wider"
          >
            View All New In
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {/* Main Hero Card */}
          <div
            onClick={() =>
              openProductModal({
                name: featured.name,
                price: `₹${featured.price.toLocaleString('en-IN')}`,
                originalPrice: `₹${featured.originalPrice.toLocaleString('en-IN')}`,
                tag: featured.tag || 'Festive Spotlight',
                category: featured.category,
                img: featured.img,
                description: featured.description,
                story: featured.story,
                upperMaterial: featured.upperMaterial,
                soleMaterial: featured.soleMaterial,
                insoleType: featured.insoleType,
                idealFor: featured.idealFor,
                sizes: featured.sizes,
                additionalImages: featured.additionalImages,
              })
            }
            className="col-span-2 row-span-2 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group cursor-pointer border border-gray-200/70"
          >
            <div className="relative flex-1 overflow-hidden aspect-[4/3] md:aspect-auto min-h-[220px]">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                src={featured.img}
                alt={featured.name}
                loading="lazy"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-primary text-white px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
                  {featured.tag || 'New Drop'}
                </span>
              </div>
            </div>
            <div className="p-5 md:p-6 bg-white">
              <h4 className="font-anton text-xl md:text-2xl text-gray-900 tracking-wide uppercase">
                {featured.name}
              </h4>
              <p className="text-gray-500 mt-1 mb-3 text-xs md:text-sm line-clamp-2">
                {featured.story || featured.description}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-primary text-lg md:text-xl">
                  ₹{featured.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  ₹{featured.originalPrice.toLocaleString('en-IN')}
                </span>
                {calculateDiscount(featured.price, featured.originalPrice) && (
                  <span className="text-xs text-green-600 font-bold">
                    {calculateDiscount(featured.price, featured.originalPrice)}% OFF
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Secondary Card 1 */}
          {second && (
            <div
              onClick={() =>
                openProductModal({
                  name: second.name,
                  price: `₹${second.price.toLocaleString('en-IN')}`,
                  originalPrice: `₹${second.originalPrice.toLocaleString('en-IN')}`,
                  tag: second.tag,
                  category: second.category,
                  img: second.img,
                  description: second.description,
                  story: second.story,
                  upperMaterial: second.upperMaterial,
                  soleMaterial: second.soleMaterial,
                  insoleType: second.insoleType,
                  idealFor: second.idealFor,
                  sizes: second.sizes,
                  additionalImages: second.additionalImages,
                })
              }
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group cursor-pointer border border-gray-200/70"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={second.img}
                  alt={second.name}
                  loading="lazy"
                />
                <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  {second.tag || second.category}
                </span>
              </div>
              <div className="p-3.5">
                <h5 className="font-bold text-gray-900 text-sm truncate">{second.name}</h5>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-primary font-bold text-sm">
                    ₹{second.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    ₹{second.originalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Secondary Card 2 */}
          {third && (
            <div
              onClick={() =>
                openProductModal({
                  name: third.name,
                  price: `₹${third.price.toLocaleString('en-IN')}`,
                  originalPrice: `₹${third.originalPrice.toLocaleString('en-IN')}`,
                  tag: third.tag,
                  category: third.category,
                  img: third.img,
                  description: third.description,
                  story: third.story,
                  upperMaterial: third.upperMaterial,
                  soleMaterial: third.soleMaterial,
                  insoleType: third.insoleType,
                  idealFor: third.idealFor,
                  sizes: third.sizes,
                  additionalImages: third.additionalImages,
                })
              }
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group cursor-pointer border border-gray-200/70"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={third.img}
                  alt={third.name}
                  loading="lazy"
                />
                <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  {third.tag || third.category}
                </span>
              </div>
              <div className="p-3.5">
                <h5 className="font-bold text-gray-900 text-sm truncate">{third.name}</h5>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-primary font-bold text-sm">
                    ₹{third.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    ₹{third.originalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Family Club Card */}
          <div
            onClick={() => navigate('/profile')}
            className="col-span-2 bg-primary/10 border border-primary/20 rounded-2xl p-5 md:p-6 flex items-center justify-between group cursor-pointer overflow-hidden relative"
          >
            <div className="z-10">
              <span className="text-primary font-bold text-xs uppercase tracking-wider">CraftYourSole Club</span>
              <h4 className="font-anton text-xl md:text-2xl text-primary uppercase tracking-wide mt-0.5">
                Join the Footwear Family
              </h4>
              <p className="text-gray-600 max-w-[240px] sm:max-w-xs mt-1.5 text-xs sm:text-sm leading-relaxed">
                Enjoy 10% off your first festive, casual, or active pair plus priority size replacements.
              </p>
              <button className="mt-3.5 bg-primary text-white px-5 py-2 rounded-full font-bold uppercase tracking-wider text-xs group-hover:bg-[#8A2600] transition-colors shadow-sm cursor-pointer">
                Join Club For Free
              </button>
            </div>
            <div className="relative w-28 h-28 rotate-12 -mr-6 shrink-0 flex items-center justify-center opacity-80">
              <Icon name="loyalty" className="w-24 h-24 text-primary/25" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
