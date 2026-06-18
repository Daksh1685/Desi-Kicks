import { Icon } from './ui/Icon';
import type { IconName } from './ui/Icon';

const CATEGORIES: { name: string; icon: IconName }[] = [
  { name: 'Running', icon: 'running' as const },
  { name: 'Lifestyle', icon: 'lifestyle' as const },
  { name: 'Training', icon: 'training' as const },
  { name: 'Basketball', icon: 'basketball' as const }
];

export function Categories() {
  return (
    <section className="bg-white py-8 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Shop by Category</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <div key={cat.name} className="bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-2xl flex flex-col items-center justify-center p-6 aspect-[4/3] sm:aspect-square group cursor-pointer shadow-sm transition-colors">
              <Icon name={cat.icon} className="w-10 h-10 md:w-12 md:h-12 text-primary group-hover:scale-110 transition-transform mb-4" />
              <span className="font-bold text-gray-900 text-lg md:text-xl tracking-tight">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
