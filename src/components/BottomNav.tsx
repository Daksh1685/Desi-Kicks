import { useNavigate, useLocation } from 'react-router-dom';
import { Icon } from './ui/Icon';
import type { IconName } from './ui/Icon';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface BottomNavProps {
  onNavigate?: (page: 'landing' | 'profile' | 'cart') => void;
  currentPage?: 'landing' | 'profile' | 'cart';
}

export function BottomNav({ onNavigate }: BottomNavProps = {}) {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const { totalItemsCount } = useCart();
  const { wishlistCount } = useWishlist();

  const handleNav = (target: string, fallbackPage: 'landing' | 'profile' | 'cart') => {
    if (onNavigate) {
      onNavigate(fallbackPage);
    } else {
      navigate(target);
    }
  };

  const isWishlistActive = pathname === '/profile' && search.includes('tab=wishlist');
  const isProfileActive = pathname === '/profile' && !search.includes('tab=wishlist');

  const navItems = [
    {
      icon: 'home' as IconName,
      label: 'Home',
      action: () => {
        handleNav('/', 'landing');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      active: pathname === '/',
    },
    {
      icon: 'category' as IconName,
      label: 'Occasions',
      action: () => {
        if (pathname !== '/') {
          handleNav('/', 'landing');
        }
        setTimeout(() => {
          document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      },
      active: false,
    },
    {
      icon: 'shopping_bag' as IconName,
      label: 'Bag',
      badge: totalItemsCount,
      action: () => handleNav('/cart', 'cart'),
      active: pathname === '/cart',
    },
    {
      icon: 'favorite' as IconName,
      label: 'Wishlist',
      badge: wishlistCount,
      action: () => navigate('/profile?tab=wishlist'),
      active: isWishlistActive,
    },
    {
      icon: 'person' as IconName,
      label: 'Profile',
      action: () => navigate('/profile'),
      active: isProfileActive,
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100 md:hidden pb-safe shadow-lg">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            className={`flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer relative ${
              item.active ? 'text-primary font-semibold' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <div className="relative">
              <Icon name={item.icon} filled={item.active} className="w-5 h-5" />
              {Boolean(item.badge && item.badge > 0) && (
                <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px]">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

