import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Icon } from './ui/Icon';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import craftYourSoleLogo from '../assets/craftyoursole_logo.svg';

interface NavLinkItem {
  name: string;
  path: string;
}

const NAV_LINKS: NavLinkItem[] = [
  { name: 'Men', path: '/collections/men' },
  { name: 'Women', path: '/collections/women' },
  { name: 'Kids', path: '/collections/kids' },
  { name: 'Best Sellers', path: '/#best-sellers' },
  { name: 'All Collections', path: '/collections' },
];

export function Navbar() {
  const { totalItemsCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { pathname, search, hash } = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isWishlistActive = pathname === '/profile' && search.includes('tab=wishlist');
  const isProfileActive = (pathname === '/profile' && !search.includes('tab=wishlist')) || pathname === '/login';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-2xs transition-all">
      <div className="w-full px-3 sm:px-6 md:px-8 lg:px-10 xl:px-12 h-18 sm:h-20 flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr] gap-4">
        
        {/* Left End: Brand Logo */}
        <div className="flex items-center justify-start shrink-0">
          <Link
            to="/"
            aria-label="CraftYourSole Home"
            className="flex items-center cursor-pointer hover:opacity-90 transition-opacity"
          >
            <img
              src={craftYourSoleLogo}
              alt="CraftYourSole"
              className="h-8 sm:h-9 w-auto"
            />
          </Link>
        </div>

        {/* Middle: Centered Category Navigation Links */}
        <nav className="hidden md:flex items-center justify-center gap-6 lg:gap-8 xl:gap-10 text-sm font-semibold tracking-wide">
          {NAV_LINKS.map((link) => {
            const isActive = link.path.startsWith('/#')
              ? pathname === '/' && hash === link.path.replace('/', '')
              : pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative py-2 transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? 'text-primary font-bold'
                    : 'text-gray-700 hover:text-primary font-medium'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right End: Desktop Actions (Profile, Cart, Wishlist) & Mobile Hamburger */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-2.5 text-gray-700 shrink-0">
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-1.5 sm:gap-2.5 text-gray-700">
            {/* 1. Profile */}
            <button
              onClick={() => navigate(currentUser ? '/profile' : '/login')}
              title={currentUser?.displayName || 'My Profile / Sign In'}
              aria-label="Account Profile"
              className={`p-2 rounded-full transition-all duration-200 cursor-pointer relative flex items-center justify-center ${
                isProfileActive
                  ? 'text-primary bg-primary/10 ring-1 ring-primary/30'
                  : 'hover:text-primary hover:bg-gray-100'
              }`}
            >
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'Profile'}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-primary/40"
                />
              ) : (
                <Icon
                  name="person"
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  filled={isProfileActive}
                />
              )}
            </button>

            {/* 2. Cart */}
            <button
              onClick={() => navigate('/cart')}
              title="Shopping Bag"
              aria-label={`Shopping Bag (${totalItemsCount} items)`}
              className={`p-2 rounded-full transition-all duration-200 cursor-pointer relative flex items-center justify-center ${
                pathname === '/cart'
                  ? 'text-primary bg-primary/10 ring-1 ring-primary/30'
                  : 'hover:text-primary hover:bg-gray-100'
              }`}
            >
              <Icon
                name="shopping_bag"
                className="w-5 h-5 sm:w-6 sm:h-6"
                filled={pathname === '/cart'}
              />
              {totalItemsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center shadow-xs">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* 3. Like (Wishlist) */}
            <button
              onClick={() => navigate('/profile?tab=wishlist')}
              title="Wishlist"
              aria-label={`Wishlist (${wishlistCount} items)`}
              className={`p-2 rounded-full transition-all duration-200 cursor-pointer relative flex items-center justify-center ${
                isWishlistActive
                  ? 'text-red-500 bg-red-50 ring-1 ring-red-200'
                  : 'hover:text-red-500 hover:bg-gray-100'
              }`}
            >
              <Icon
                name="favorite"
                className="w-5 h-5 sm:w-6 sm:h-6"
                filled={isWishlistActive}
              />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -mr-1 text-gray-700 hover:text-primary hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            <div className="w-6 h-6 relative flex items-center justify-center">
              <span
                className={`absolute h-0.5 w-5 bg-current rounded-full transition-all duration-300 ease-in-out ${
                  mobileMenuOpen
                    ? 'rotate-45 translate-y-0'
                    : '-translate-y-1.5'
                }`}
              />
              <span
                className={`absolute h-0.5 w-5 bg-current rounded-full transition-all duration-300 ease-in-out ${
                  mobileMenuOpen
                    ? 'opacity-0 scale-x-0'
                    : 'opacity-100'
                }`}
              />
              <span
                className={`absolute h-0.5 w-5 bg-current rounded-full transition-all duration-300 ease-in-out ${
                  mobileMenuOpen
                    ? '-rotate-45 translate-y-0'
                    : 'translate-y-1.5'
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Navigation Menu */}
      <div
        className={`md:hidden grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
          mobileMenuOpen
            ? 'grid-rows-[1fr] opacity-100'
            : 'grid-rows-[0fr] opacity-0 pointer-events-none'
        }`}
      >
        <div className="overflow-hidden border-t border-gray-100 bg-white/98 backdrop-blur-md shadow-lg">
          <div className="px-4 py-4 space-y-1">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 pb-1">
              Collections &amp; Categories
            </p>
            {NAV_LINKS.map((link) => {
              const isActive = link.path.startsWith('/#')
                ? pathname === '/' && hash === link.path.replace('/', '')
                : pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                  }`}
                >
                  <span>{link.name}</span>
                  <span className="text-xs text-gray-400">→</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
