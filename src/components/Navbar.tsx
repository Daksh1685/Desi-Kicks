import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Icon } from './ui/Icon';
import { useTypingEffect } from '../hooks/useTypingEffect';
import { SEARCH_KEYWORDS } from '../constants/search';
import { useCart } from '../context/CartContext';

export function Navbar() {
  const typedText = useTypingEffect(SEARCH_KEYWORDS);
  const { totalItemsCount } = useCart();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="font-anton text-3xl tracking-wide text-primary cursor-pointer hover:opacity-90 transition-opacity"
        >
          DESIKICKS.
        </Link>
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-medium text-gray-700 text-sm">
          <Link className="hover:text-primary transition-colors" to="/#men">Men</Link>
          <Link className="hover:text-primary transition-colors" to="/#women">Women</Link>
          <Link className="hover:text-primary transition-colors font-semibold text-primary" to="/#festive">Festive & Ethnic</Link>
          <Link className="hover:text-primary transition-colors" to="/#daily">Daily Comfort</Link>
          <Link className="hover:text-primary transition-colors" to="/#gym">Gym & Sports</Link>
          <Link className="hover:text-primary text-red-600 font-bold transition-colors" to="/#sale">Sale</Link>
        </nav>
        <div className="hidden md:flex relative flex-1 max-w-md">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={`Search for ${typedText}|`}
            className="w-full h-10 pl-10 pr-10 rounded-full bg-gray-100 border-none text-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 transition-all placeholder:transition-all"
          />
          <Icon name="photo_camera" className="absolute right-3 top-1/2 -translate-y-1/2 text-primary cursor-pointer w-5 h-5 hover:scale-110 transition-transform" />
        </div>
        <div className="flex items-center gap-1 md:gap-3 text-gray-700">
          <button
            onClick={() => navigate('/profile')}
            title="Wishlist"
            className="p-2 hover:text-primary transition-colors cursor-pointer"
          >
            <Icon name="favorite" className="w-6 h-6" />
          </button>
          <button
            onClick={() => navigate('/cart')}
            className={`p-2 transition-colors relative cursor-pointer rounded-full ${
              pathname === '/cart'
                ? 'text-primary bg-primary/10'
                : 'hover:text-primary hover:bg-gray-100'
            }`}
            title="Shopping Bag"
          >
            <Icon name="shopping_bag" className="w-6 h-6" filled={pathname === '/cart'} />
            {totalItemsCount > 0 && (
              <span className="absolute top-1 right-1 bg-primary text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {totalItemsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => navigate('/profile')}
            title="My Account"
            className={`p-2 transition-colors cursor-pointer rounded-full ${
              pathname === '/profile'
                ? 'text-primary bg-primary/10'
                : 'hover:text-primary hover:bg-gray-100'
            }`}
          >
            <Icon name="person" className="w-6 h-6" filled={pathname === '/profile'} />
          </button>
        </div>
      </div>
    </header>
  );
}
