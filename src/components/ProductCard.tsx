import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from './ui/Icon';
import { useCart } from '../context/CartContext';
import { useProductModal } from '../context/ProductModalContext';

export interface ProductCardProps {
  id?: string;
  name: string;
  rating: number;
  price: string;
  originalPrice?: string;
  tag?: string;
  img: string;
  slug?: string;
  stock?: number;
}

export function ProductCard({
  id,
  name,
  rating,
  price,
  originalPrice,
  tag,
  img,
  slug,
  stock,
}: ProductCardProps) {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();
  const { openProductModal } = useProductModal();

  const computedSlug =
    slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleCardClick = () => {
    navigate(`/products/${computedSlug}`);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    openProductModal({
      id: id || computedSlug,
      name,
      rating,
      price,
      originalPrice,
      tag,
      img,
      category: tag || 'Footwear',
      slug: computedSlug,
    });
  };

  const isOutOfStock = stock !== undefined && stock <= 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    const cleanPrice = parseInt(price.replace(/[^0-9]/g, ''), 10) || 2995;
    const cleanOriginalPrice = originalPrice
      ? parseInt(originalPrice.replace(/[^0-9]/g, ''), 10)
      : cleanPrice + 1500;
    const productId = id || computedSlug || name;

    addToCart({
      id: `${productId}-UK 9`,
      productId,
      name,
      category: tag || 'Footwear',
      price: cleanPrice,
      originalPrice: cleanOriginalPrice,
      size: 'UK 9',
      img,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group min-w-[220px] md:min-w-[245px] bg-white p-3.5 rounded-2xl border border-gray-200 flex flex-col snap-start shadow-sm hover:shadow-lg transition-all duration-300 relative cursor-pointer"
    >
      {/* Top badges & Wishlist */}
      <div className="relative aspect-[4/3] bg-gray-50 rounded-xl mb-3 overflow-hidden flex items-center justify-center p-2">
        {tag && (
          <span className="absolute top-2.5 left-2.5 z-10 bg-black/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
            {tag}
          </span>
        )}

        <button
          onClick={handleWishlistToggle}
          aria-label="Add to Wishlist"
          className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-sm transition-all hover:scale-110 active:scale-90"
        >
          <Icon
            name="favorite"
            filled={isWishlisted}
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'text-primary fill-primary' : 'text-gray-600'
            }`}
          />
        </button>

        <img
          className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
          src={img}
          alt={name}
          loading="lazy"
        />

        {/* Hover Action Buttons Overlay */}
        <div className="absolute bottom-2 inset-x-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <button
            onClick={handleQuickView}
            title="Quick View Modal"
            className="flex-1 py-1.5 px-2 bg-white/95 hover:bg-gray-900 hover:text-white text-gray-900 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-md transition-colors cursor-pointer"
          >
            Quick View
          </button>
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            title={isOutOfStock ? 'Sold Out' : 'Add to Cart'}
            className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer ${
              isOutOfStock
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-primary hover:bg-primary/90 text-white'
            }`}
          >
            {isOutOfStock ? 'Sold Out' : isAdded ? '✓ Added' : '+ Add'}
          </button>
        </div>
      </div>

      <h4 className="text-base font-semibold text-gray-900 truncate mb-1" title={name}>
        {name}
      </h4>

      <div className="flex items-center gap-1.5 mb-2">
        <Icon name="star" className="w-3.5 h-3.5 text-primary fill-primary" filled />
        <span className="text-xs font-bold text-gray-900">{rating}</span>
        {stock !== undefined ? (
          stock <= 0 ? (
            <span className="text-[11px] text-red-500 font-semibold">| Sold Out</span>
          ) : stock <= 5 ? (
            <span className="text-[11px] text-amber-600 font-semibold">| Only {stock} left</span>
          ) : (
            <span className="text-[11px] text-emerald-600 font-semibold">| In Stock</span>
          )
        ) : (
          <span className="text-[11px] text-gray-400">| In Stock</span>
        )}
      </div>

      <div className="mt-auto flex items-baseline gap-2">
        <span className="text-base md:text-lg font-bold text-gray-900">{price}</span>
        {originalPrice && (
          <span className="text-xs text-gray-400 line-through">{originalPrice}</span>
        )}
      </div>
    </div>
  );
}
