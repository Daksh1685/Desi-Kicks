import { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Icon } from './ui/Icon';
import { useTypingEffect } from '../hooks/useTypingEffect';
import { SEARCH_KEYWORDS, ALL_PRODUCTS } from '../constants/search';
import { useCart } from '../context/CartContext';
import { useProductModal } from '../context/ProductModalContext';
import { useAuth } from '../context/AuthContext';
import craftYourSoleLogo from '../assets/craftyoursole_logo.svg';

export function Navbar() {
  const typedText = useTypingEffect(SEARCH_KEYWORDS);
  const { totalItemsCount } = useCart();
  const { openProductModal } = useProductModal();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return ALL_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tag.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link
          to="/"
          aria-label="CraftYourSole Home"
          className="flex items-center shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <img
            src={craftYourSoleLogo}
            alt="CraftYourSole"
            className="h-7 sm:h-8 w-auto"
          />
        </Link>
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-medium text-gray-700 text-sm">
          <Link to="/collections/men" className="hover:text-primary transition-colors">Men</Link>
          <Link to="/collections/women" className="hover:text-primary transition-colors">Women</Link>
          <Link to="/collections/festive-ethnic" className="hover:text-primary transition-colors font-semibold text-primary">Festive &amp; Ethnic</Link>
          <Link to="/collections/daily-comfort" className="hover:text-primary transition-colors">Daily Comfort</Link>
          <Link to="/collections/gym-sports" className="hover:text-primary transition-colors">Gym &amp; Sports</Link>
          <Link to="/collections/sale" className="hover:text-primary text-red-600 font-bold transition-colors">Sale</Link>
        </nav>
        <div ref={searchContainerRef} className="hidden md:flex relative flex-1 max-w-md">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder={`Search for ${typedText}|`}
            className="w-full h-10 pl-10 pr-10 rounded-full bg-gray-100 border-none text-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 transition-all placeholder:transition-all"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
            >
              <Icon name="close" className="w-4 h-4" />
            </button>
          ) : (
            <Icon name="photo_camera" className="absolute right-3 top-1/2 -translate-y-1/2 text-primary cursor-pointer w-5 h-5 hover:scale-110 transition-transform" />
          )}

          {/* Live Search Results Dropdown */}
          {isSearchFocused && (
            <div className="absolute top-12 inset-x-0 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-40 max-h-96 overflow-y-auto animate-fade-in">
              {searchQuery.trim() ? (
                searchResults.length > 0 ? (
                  <div className="p-2 space-y-1">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Footwear Matches ({searchResults.length})
                    </div>
                    {searchResults.map((item) => (
                      <div
                        key={item.name}
                        onClick={() => {
                          openProductModal({
                            name: item.name,
                            category: item.category,
                            price: item.price,
                            originalPrice: item.originalPrice,
                            tag: item.tag,
                            rating: item.rating,
                            img: item.img,
                          });
                          setIsSearchFocused(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <img src={item.img} alt={item.name} className="w-12 h-12 object-cover rounded-lg shrink-0 border border-gray-100" />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-xs text-gray-900 truncate">{item.name}</h5>
                          <span className="text-[10px] text-gray-400 block">{item.category}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-xs text-primary">{item.price}</span>
                          <div className="flex items-center gap-0.5 text-[10px] text-amber-500 font-bold justify-end">
                            <Icon name="star" className="w-3 h-3 fill-amber-500 text-amber-500" filled />
                            <span>{item.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-gray-500">
                    <p>No footwear found matching "{searchQuery}".</p>
                    <p className="text-[11px] text-gray-400 mt-1">Try "mojari", "loafer", "heel", or "sports".</p>
                  </div>
                )
              ) : (
                <div className="p-4">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                    Popular Footwear Searches
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SEARCH_KEYWORDS.slice(0, 6).map((kw) => (
                      <button
                        key={kw}
                        onClick={() => setSearchQuery(kw)}
                        className="bg-gray-100 hover:bg-primary/10 hover:text-primary text-gray-700 text-xs px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                      >
                        {kw}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
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
            title={currentUser ? (currentUser.displayName || 'My Account') : 'My Account'}
            className={`p-1.5 transition-colors cursor-pointer rounded-full ${
              pathname === '/profile'
                ? 'text-primary bg-primary/10'
                : 'hover:text-primary hover:bg-gray-100'
            }`}
          >
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName || 'Profile'}
                className="w-7 h-7 rounded-full object-cover border border-primary/40 shadow-xs"
              />
            ) : (
              <Icon name="person" className="w-6 h-6" filled={pathname === '/profile'} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
