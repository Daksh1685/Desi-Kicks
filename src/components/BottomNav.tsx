import { Icon } from './ui/Icon';
import type { IconName } from './ui/Icon';

export function BottomNav() {
  const navItems: { icon: IconName; label: string; active?: boolean }[] = [
    { icon: 'home', label: 'Home', active: true },
    { icon: 'category', label: 'Categories' },
    { icon: 'search', label: 'Search' },
    { icon: 'favorite', label: 'Wishlist' },
    { icon: 'person', label: 'Account' },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-100 md:hidden pb-safe">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => (
          <button key={item.label} className={`flex flex-col items-center justify-center gap-1 transition-colors ${item.active ? "text-primary" : "text-gray-500 hover:text-gray-900"}`}>
            <Icon name={item.icon} filled={item.active} className="w-6 h-6" />
            <span className="text-[10px] font-semibold">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
