import { Link } from 'react-router-dom';
import { IMG } from '../constants/images';

export function PromoBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="rounded-xl overflow-hidden relative aspect-[16/7] md:aspect-[21/6]">
        <img className="w-full h-full object-cover" src={IMG.banner} alt="Step into the future" />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4">
          <span className="text-primary bg-white/95 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-3">
            Every Step • Every Occasion
          </span>
          <h3 className="font-anton text-2xl sm:text-3xl md:text-5xl text-white mb-2 md:mb-3 tracking-wide uppercase">
            FOOTWEAR FOR EVERY WALK OF LIFE
          </h3>
          <p className="text-white/90 text-xs sm:text-sm md:text-base max-w-xl mb-4 md:mb-6 leading-relaxed">
            From grand Indian celebrations and everyday work commutes to gym workouts and relaxed weekends — handcrafted comfort tailored for Indian feet.
          </p>
          <Link
            to="/collections"
            className="bg-primary hover:bg-[#8A2600] text-white px-6 py-2.5 md:px-8 md:py-3 rounded-full font-bold transition-all uppercase tracking-widest text-xs md:text-sm shadow-lg cursor-pointer"
          >
            Explore All Collections
          </Link>
        </div>
      </div>
    </section>
  );
}
