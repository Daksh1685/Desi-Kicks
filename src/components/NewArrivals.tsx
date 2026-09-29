import { Icon } from './ui/Icon';

export function NewArrivals() {
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
          <span className="text-primary text-xs md:text-sm font-bold cursor-pointer hover:underline uppercase tracking-wider">
            View All New In
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {/* Main Hero Card: Festive Edit */}
          <div className="col-span-2 row-span-2 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group cursor-pointer border border-gray-200/70">
            <div className="relative flex-1 overflow-hidden aspect-[4/3] md:aspect-auto min-h-[220px]">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                src="https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop"
                alt="Maharaja Handcrafted Velvet Mojari"
                loading="lazy"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-primary text-white px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
                  Festive Spotlight
                </span>
              </div>
            </div>
            <div className="p-5 md:p-6 bg-white">
              <h4 className="font-anton text-xl md:text-2xl text-gray-900 tracking-wide uppercase">
                Maharaja Velvet Zari Mojari
              </h4>
              <p className="text-gray-500 mt-1 mb-3 text-xs md:text-sm">
                Handcrafted pure velvet with double-padded orthopedic cushioning for weddings & festivals.
              </p>
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-primary text-lg md:text-xl">₹3,495</span>
                <span className="text-xs text-gray-400 line-through">₹5,995</span>
                <span className="text-xs text-green-600 font-bold">42% OFF</span>
              </div>
            </div>
          </div>

          {/* Daily Comfort Card */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group cursor-pointer border border-gray-200/70">
            <div className="aspect-[4/3] relative overflow-hidden">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=600&auto=format&fit=crop"
                alt="BreezeStep Slip-On"
                loading="lazy"
              />
              <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                Daily Wear
              </span>
            </div>
            <div className="p-3.5">
              <h5 className="font-bold text-gray-900 text-sm truncate">BreezeStep Knit Slip-On</h5>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-primary font-bold text-sm">₹2,295</span>
                <span className="text-xs text-gray-400 line-through">₹3,495</span>
              </div>
            </div>
          </div>

          {/* Women Evening / Party Card */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group cursor-pointer border border-gray-200/70">
            <div className="aspect-[4/3] relative overflow-hidden">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop"
                alt="Stella Shimmer Block Heel"
                loading="lazy"
              />
              <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                Women
              </span>
            </div>
            <div className="p-3.5">
              <h5 className="font-bold text-gray-900 text-sm truncate">Stella Shimmer Block Heel</h5>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-primary font-bold text-sm">₹2,995</span>
                <span className="text-xs text-gray-400 line-through">₹4,495</span>
              </div>
            </div>
          </div>

          {/* Family Club Card */}
          <div className="col-span-2 bg-primary/10 border border-primary/20 rounded-2xl p-5 md:p-6 flex items-center justify-between group cursor-pointer overflow-hidden relative">
            <div className="z-10">
              <span className="text-primary font-bold text-xs uppercase tracking-wider">DesiKicks Club</span>
              <h4 className="font-anton text-xl md:text-2xl text-primary uppercase tracking-wide mt-0.5">
                Join the Footwear Family
              </h4>
              <p className="text-gray-600 max-w-[240px] sm:max-w-xs mt-1.5 text-xs sm:text-sm leading-relaxed">
                Enjoy 10% off your first festive, casual, or active pair plus priority size replacements.
              </p>
              <button className="mt-3.5 bg-primary text-white px-5 py-2 rounded-full font-bold uppercase tracking-wider text-xs group-hover:bg-[#8A2600] transition-colors shadow-sm">
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
