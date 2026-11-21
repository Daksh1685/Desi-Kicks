import { Link } from 'react-router-dom';
import { IMG } from '../constants/images';

const MARQUEE_TEXT = 'HANDCRAFTED • PAN-INDIA DELIVERY • 36-HR EXCHANGE ONLY • ARTISAN MADE • FREE SHIPPING • COD AVAILABLE • ';

export function PromoBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="rounded-xl overflow-hidden relative aspect-[16/7] md:aspect-[21/6]">
        <img className="w-full h-full object-cover" src={IMG.banner} alt="Step into the future" />
        <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center text-center px-4">
          <span className="animate-pulse text-primary bg-white/95 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-3 shadow-md">
            ✦ Every Step • Every Occasion ✦
          </span>
          <h3 className="font-anton text-2xl sm:text-3xl md:text-5xl text-white mb-2 md:mb-3 tracking-wide uppercase drop-shadow-lg">
            FOOTWEAR FOR EVERY WALK OF LIFE
          </h3>
          <p className="text-white/90 text-xs sm:text-sm md:text-base max-w-xl mb-5 md:mb-7 leading-relaxed">
            From grand Indian celebrations and everyday work commutes to gym workouts and relaxed weekends — handcrafted comfort tailored for Indian feet.
          </p>
          <Link
            to="/collections"
            className="bg-primary hover:bg-[#8A2600] text-white px-8 py-3 md:px-10 md:py-3.5 rounded-full font-bold transition-all uppercase tracking-widest text-xs md:text-sm shadow-xl ring-2 ring-white/20 hover:ring-white/40 cursor-pointer"
          >
            Explore All Collections →
          </Link>
        </div>
      </div>

      {/* Marquee ticker */}
      <div className="mt-4 bg-gray-900 rounded-xl overflow-hidden py-3 select-none">
        <div
          className="flex whitespace-nowrap text-white/70 text-xs font-bold uppercase tracking-widest"
          style={{ animation: 'marquee 25s linear infinite' }}
        >
          <span className="px-4">{MARQUEE_TEXT}</span>
          <span className="px-4">{MARQUEE_TEXT}</span>
        </div>
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </section>
  );
}
