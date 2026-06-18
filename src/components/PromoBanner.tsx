import { IMG } from '../constants/images';

export function PromoBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="rounded-xl overflow-hidden relative aspect-[16/7] md:aspect-[21/6]">
        <img className="w-full h-full object-cover" src={IMG.banner} alt="Step into the future" />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
          <h3 className="font-anton text-3xl md:text-5xl text-white mb-2 md:mb-4 tracking-wide uppercase">STEP INTO THE FUTURE</h3>
          <p className="text-white text-sm md:text-lg max-w-lg mb-4 md:mb-6">
            Experience the revolution of comfort with our new Nitrogen-infused cushioning technology.
          </p>
          <button className="bg-white text-gray-900 px-6 py-2 md:px-8 md:py-3 rounded font-bold hover:bg-primary hover:text-white transition-all uppercase tracking-widest text-xs md:text-sm">
            Explore Collection
          </button>
        </div>
      </div>
    </section>
  );
}
