import { IMG } from '../constants/images';
import { Icon } from './ui/Icon';

export function NewArrivals() {
  return (
    <section className="bg-gray-50 py-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h3 className="font-anton text-2xl md:text-3xl text-gray-900 mb-6 md:mb-8 uppercase tracking-wide">NEW ARRIVALS</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          
          <div className="col-span-2 row-span-2 bg-white rounded-xl overflow-hidden shadow-sm flex flex-col group cursor-pointer border border-gray-100">
            <div className="relative flex-1 overflow-hidden aspect-square md:aspect-auto">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={IMG.feature} alt="Cloud Walker Platinum" />
              <div className="absolute bottom-4 left-4">
                <span className="bg-primary text-white px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider">Must Have</span>
              </div>
            </div>
            <div className="p-6">
              <h4 className="font-anton text-xl md:text-2xl text-gray-900 tracking-wide uppercase">Cloud Walker Platinum</h4>
              <p className="text-gray-500 mt-1 mb-4 text-sm md:text-base">The lightest cushioning we've ever engineered.</p>
              <span className="font-bold text-primary text-lg md:text-xl">₹22,995</span>
            </div>
          </div>

          <div className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col hover:-translate-y-1 transition-transform cursor-pointer border border-gray-100">
            <div className="aspect-square relative">
              <img className="w-full h-full object-cover" src={IMG.rec2} alt="Urban Drift" />
            </div>
            <div className="p-4">
              <h5 className="font-bold text-gray-900 truncate">Urban Drift</h5>
              <span className="text-primary font-bold text-sm">₹7,995</span>
            </div>
          </div>

          <div className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col hover:-translate-y-1 transition-transform cursor-pointer border border-gray-100">
            <div className="aspect-square relative">
              <img className="w-full h-full object-cover" src={IMG.rec1} alt="Vortex Run" />
            </div>
            <div className="p-4">
              <h5 className="font-bold text-gray-900 truncate">Vortex Run</h5>
              <span className="text-primary font-bold text-sm">₹11,495</span>
            </div>
          </div>

          <div className="col-span-2 bg-primary/10 border border-primary/20 rounded-xl p-6 flex items-center justify-between group cursor-pointer overflow-hidden">
            <div className="z-10">
              <h4 className="font-anton text-xl md:text-2xl text-primary uppercase tracking-wide">Join the Elite Club</h4>
              <p className="text-gray-600 max-w-[220px] mt-2 text-sm">Get exclusive early access to drops and members-only pricing.</p>
              <button className="mt-4 bg-primary text-white px-6 py-2.5 rounded-full font-bold uppercase tracking-wider text-xs md:text-sm group-hover:bg-[#8A2600] transition-colors shadow-sm">
                Join Now
              </button>
            </div>
            <div className="relative w-32 h-32 rotate-12 -mr-8 shrink-0 flex items-center justify-center">
              <Icon name="loyalty" className="w-32 h-32 text-primary/20" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
