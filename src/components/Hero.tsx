import { Icon } from './ui/Icon';
import { IMG } from '../constants/images';

export function Hero() {
  return (
    <section className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[25/8] overflow-hidden bg-gray-100 group">
      <div className="absolute inset-0 flex">
        <div className="min-w-full h-full relative">
          <img className="w-full h-full object-cover object-[80%_center] md:object-center" src={IMG.hero} alt="Velocity X-1 Red Edition" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex flex-col justify-center px-5 md:px-12 lg:px-24 text-white">
            <span className="absolute top-4 md:top-8 bg-primary px-1.5 py-0.5 md:px-2 md:py-1 text-[8px] md:text-[10px] font-bold w-fit uppercase tracking-wider">Big Billion Drops</span>
            <h2 className="font-anton text-3xl sm:text-4xl md:text-[64px] leading-[1.1] md:leading-[1] mb-2 md:mb-3 tracking-wide mt-2 md:mt-0">
              VELOCITY X-1<br />RED EDITION
            </h2>
            <p className="text-sm md:text-xl max-w-[250px] md:max-w-md mb-4 md:mb-6 text-white/90">Engineered for the relentless. Now live with introductory pricing.</p>
            <button className="bg-primary hover:bg-[#8A2600] text-white px-5 py-2 md:px-8 md:py-3 rounded-full font-bold transition-all w-fit uppercase tracking-wider text-xs md:text-base">
              Shop Now
            </button>
          </div>
        </div>
      </div>
      <button className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 text-gray-900 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white cursor-pointer">
        <Icon name="chevron_left" />
      </button>
      <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 text-gray-900 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white cursor-pointer">
        <Icon name="chevron_right" />
      </button>
    </section>
  );
}
