import { useState, useMemo, useRef, useEffect } from 'react';
import { Icon } from './ui/Icon';
import { useTypingEffect } from '../hooks/useTypingEffect';
import { SEARCH_KEYWORDS } from '../constants/search';
import { useProductCatalog } from '../context/ProductContext';
import { useProductModal } from '../context/ProductModalContext';

export function MobileSearch() {
  const typedText = useTypingEffect(SEARCH_KEYWORDS);
  const { activeProducts } = useProductCatalog();
  const { openProductModal } = useProductModal();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

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
    return activeProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.tag && p.tag.toLowerCase().includes(q))
    );
  }, [searchQuery, activeProducts]);

  return (
    <div ref={searchContainerRef} className="px-4 py-3 bg-white md:hidden border-b border-gray-100 relative z-30">
      <div className="relative flex items-center">
        <Icon name="search" className="absolute left-3 text-gray-400 w-5 h-5 z-10" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          className="w-full h-11 pl-10 pr-12 rounded-xl bg-gray-100 border-none focus:outline-none focus:ring-2 focus:ring-primary text-sm shadow-xs text-gray-900 transition-all placeholder:transition-all"
          placeholder={`Search for ${typedText}|`}
          type="text"
        />
        {searchQuery ? (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
          >
            <Icon name="close" className="w-4 h-4" />
          </button>
        ) : (
          <Icon
            name="photo_camera"
            className="absolute right-3 text-primary cursor-pointer w-5 h-5 hover:scale-110 transition-transform"
          />
        )}
      </div>

      {/* Mobile Live Results Dropdown */}
      {isSearchFocused && (
        <div className="absolute top-16 inset-x-4 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-40 max-h-80 overflow-y-auto animate-fade-in">
          {searchQuery.trim() ? (
            searchResults.length > 0 ? (
              <div className="p-2 space-y-1">
                <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Matches ({searchResults.length})
                </div>
                {searchResults.map((item) => (
                  <div
                    key={item.name}
                    onClick={() => {
                      openProductModal({
                        id: item.id,
                        name: item.name,
                        category: item.category,
                        price: `₹${item.price.toLocaleString('en-IN')}`,
                        originalPrice: item.originalPrice ? `₹${item.originalPrice.toLocaleString('en-IN')}` : undefined,
                        tag: item.tag,
                        rating: item.rating,
                        reviewsCount: item.reviewsCount,
                        img: item.img,
                        additionalImages: item.additionalImages,
                        description: item.description,
                        story: item.story,
                        upperMaterial: item.upperMaterial,
                        soleMaterial: item.soleMaterial,
                        insoleType: item.insoleType,
                        idealFor: item.idealFor,
                        sizes: item.sizes,
                        slug: item.slug,
                      });
                      setIsSearchFocused(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-11 h-11 object-cover rounded-lg shrink-0 border border-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-xs text-gray-900 truncate">{item.name}</h5>
                      <span className="text-[10px] text-gray-400 block">{item.category}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-xs text-primary">₹{item.price.toLocaleString('en-IN')}</span>
                      <div className="flex items-center gap-0.5 text-[10px] text-amber-500 font-bold justify-end">
                        <Icon name="star" className="w-3 h-3 fill-amber-500 text-amber-500" filled />
                        <span>{item.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 text-center text-xs text-gray-500">
                <p>No footwear found matching "{searchQuery}".</p>
                <p className="text-[10px] text-gray-400 mt-1">Try "mojari", "loafer", or "heel".</p>
              </div>
            )
          ) : (
            <div className="p-3">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Popular Searches
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SEARCH_KEYWORDS.slice(0, 5).map((kw) => (
                  <button
                    key={kw}
                    onClick={() => setSearchQuery(kw)}
                    className="bg-gray-100 hover:bg-primary/10 hover:text-primary text-gray-700 text-[11px] px-2.5 py-1 rounded-full transition-colors cursor-pointer"
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
  );
}
