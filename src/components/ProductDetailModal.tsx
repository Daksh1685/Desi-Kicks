import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductModal } from '../context/ProductModalContext';
import type { ProductDetails } from '../context/ProductModalContext';
import { useCart } from '../context/CartContext';
import { Icon } from './ui/Icon';
import { getEnrichedProductDetails } from '../constants/productCatalog';

function ProductDetailModalInner({
  productDetails,
  onClose,
}: {
  productDetails: ProductDetails;
  onClose: () => void;
}) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const product = useMemo(() => getEnrichedProductDetails(productDetails), [productDetails]);
  const productSlug = product.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(
    () => product.sizes?.[2] || product.sizes?.[0] || 'UK 9'
  );
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToast, setAddedToast] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const priceNum = typeof product.price === 'number' ? product.price : 2995;
  const originalPriceNum =
    typeof product.originalPrice === 'number' ? product.originalPrice : Math.round(priceNum * 1.45);
  const discountPercent = Math.round(((originalPriceNum - priceNum) / originalPriceNum) * 100);
  const images = product.additionalImages && product.additionalImages.length > 0
    ? product.additionalImages
    : [product.img];
  const activeImg = images[activeImageIndex] || product.img;

  const handleAddToCart = () => {
    addToCart({
      id: `${product.name}-${selectedSize}`,
      name: product.name,
      category: product.category,
      price: priceNum,
      originalPrice: originalPriceNum,
      size: selectedSize,
      img: product.img,
    });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2200);
  };

  const handleBuyNow = () => {
    addToCart({
      id: `${product.name}-${selectedSize}`,
      name: product.name,
      category: product.category,
      price: priceNum,
      originalPrice: originalPriceNum,
      size: selectedSize,
      img: product.img,
    });
    onClose();
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 my-auto animate-scale-up max-h-[92vh] flex flex-col">
        {/* Sticky Header with Close button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 text-primary text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {product.category}
            </span>
            <span className="text-xs text-gray-400">• In Stock</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                navigate(`/products/${productSlug}`);
              }}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer mr-2"
            >
              <span>Full Page & Reviews ↗</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              aria-label="Close Product View"
            >
              <Icon name="close" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-5 sm:p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
            {/* Left: Product Images Gallery */}
            <div className="space-y-3">
              {/* Main Image View */}
              <div className="relative aspect-[4/3] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 group shadow-xs">
                {product.tag && (
                  <span className="absolute top-3 left-3 z-10 bg-black/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                    {product.tag}
                  </span>
                )}

                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  aria-label="Toggle Wishlist"
                  className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-sm transition-all hover:scale-110 active:scale-90 cursor-pointer"
                >
                  <Icon
                    name="favorite"
                    filled={isWishlisted}
                    className={`w-5 h-5 transition-colors ${
                      isWishlisted ? 'text-primary fill-primary' : 'text-gray-600'
                    }`}
                  />
                </button>

                <img
                  src={activeImg}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Thumbnail Selector */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((imgUrl, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                        activeImageIndex === index
                          ? 'border-primary ring-2 ring-primary/20 scale-102'
                          : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${product.name} angle ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Craftsmanship Stamp */}
              <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-amber-900 text-xs flex items-center gap-2.5">
                <Icon name="loyalty" className="w-5 h-5 text-amber-700 shrink-0" />
                <span>
                  <strong>100% Handcrafted Indian Heritage:</strong> Made by master artisans using premium materials.
                </span>
              </div>
            </div>

            {/* Right: Details & Buying Flow */}
            <div className="flex flex-col">
              {/* Reviews & Title */}
              <div className="flex items-center gap-2 mb-1.5">
                <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-md text-xs font-bold border border-green-200">
                  <Icon name="star" className="w-3.5 h-3.5 fill-green-600 text-green-600" filled />
                  <span>{product.rating}</span>
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  ({product.reviewsCount} verified reviews)
                </span>
              </div>

              <h2 className="font-anton text-2xl sm:text-3xl text-gray-900 uppercase tracking-wide leading-tight">
                {product.name}
              </h2>

              {/* Pricing Block */}
              <div className="mt-3 pb-4 border-b border-gray-100">
                <div className="flex items-baseline gap-3">
                  <span className="font-anton text-3xl text-gray-900">
                    ₹{priceNum.toLocaleString('en-IN')}
                  </span>
                  {originalPriceNum > priceNum && (
                    <>
                      <span className="text-sm text-gray-400 line-through">
                        ₹{originalPriceNum.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                        {discountPercent}% OFF
                      </span>
                    </>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  Inclusive of all taxes • <strong>Free Express Shipping</strong> across India
                </p>
              </div>

              {/* Size Selector */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Select Size (UK / India)
                  </label>
                  <button
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-xs text-primary font-semibold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    Size Guide
                  </button>
                </div>

                {showSizeGuide && (
                  <div className="mb-3 p-3 bg-gray-50 rounded-xl text-xs text-gray-600 border border-gray-200">
                    <p className="font-semibold text-gray-900 mb-1">Indian Footwear Sizing Reference:</p>
                    <div className="grid grid-cols-6 gap-1 text-center font-mono text-[11px] bg-white p-2 rounded-lg border border-gray-200">
                      <div>UK 6<br /><span className="text-gray-400">24.5cm</span></div>
                      <div>UK 7<br /><span className="text-gray-400">25.5cm</span></div>
                      <div>UK 8<br /><span className="text-gray-400">26.5cm</span></div>
                      <div>UK 9<br /><span className="text-gray-400">27.5cm</span></div>
                      <div>UK 10<br /><span className="text-gray-400">28.5cm</span></div>
                      <div>UK 11<br /><span className="text-gray-400">29.5cm</span></div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-6 gap-2">
                  {product.sizes?.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-10 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
                        selectedSize === size
                          ? 'border-primary bg-primary text-white shadow-sm ring-2 ring-primary/20'
                          : 'border-gray-200 bg-white text-gray-800 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-gray-500 mt-1.5 flex items-center gap-1">
                  <Icon name="check" className="w-3.5 h-3.5 text-green-600" />
                  <span>Fits true to size. If between sizes, select the larger size.</span>
                </p>
              </div>

              {/* Feedback toast when added */}
              {addedToast && (
                <div className="mt-3 p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-bold flex items-center justify-between animate-fade-in">
                  <div className="flex items-center gap-2">
                    <Icon name="check" className="w-4 h-4 text-green-700" />
                    <span>Added {product.name} ({selectedSize}) to Bag!</span>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/cart');
                    }}
                    className="bg-green-700 text-white text-[11px] px-2.5 py-1 rounded-lg hover:bg-green-800 cursor-pointer"
                  >
                    View Bag →
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-900 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                >
                  <Icon name="shopping_bag" className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-primary hover:bg-[#8A2600] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-primary/30 cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
                >
                  <span>⚡ Buy Now</span>
                </button>
              </div>

              {/* Trust Features Strip */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100 text-center text-[10px] text-gray-600">
                <div className="p-2 rounded-lg bg-gray-50 flex flex-col items-center gap-1">
                  <Icon name="refresh" className="w-4 h-4 text-primary" />
                  <span className="font-semibold">7-Day Exchange</span>
                </div>
                <div className="p-2 rounded-lg bg-gray-50 flex flex-col items-center gap-1">
                  <Icon name="truck" className="w-4 h-4 text-primary" />
                  <span className="font-semibold">Free Delivery</span>
                </div>
                <div className="p-2 rounded-lg bg-gray-50 flex flex-col items-center gap-1">
                  <Icon name="shield" className="w-4 h-4 text-primary" />
                  <span className="font-semibold">6-Mo Guarantee</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Technical Specifications Accordion/Grid */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-anton text-lg text-gray-900 uppercase tracking-wide mb-2">
              Product Story & Craftsmanship
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4">
              {product.story}
            </p>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-5">
              {product.description}
            </p>

            {/* Specifications Cards */}
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
              Footwear Specifications
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Upper Material
                </span>
                <span className="text-xs font-bold text-gray-900 mt-0.5 block">
                  {product.upperMaterial}
                </span>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Cushioning & Insole
                </span>
                <span className="text-xs font-bold text-gray-900 mt-0.5 block">
                  {product.insoleType}
                </span>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Outsole & Traction
                </span>
                <span className="text-xs font-bold text-gray-900 mt-0.5 block">
                  {product.soleMaterial}
                </span>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Best Suited For
                </span>
                <span className="text-xs font-bold text-gray-900 mt-0.5 block">
                  {product.idealFor}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  onClose();
                  navigate(`/products/${productSlug}`);
                }}
                className="w-full py-3 px-4 rounded-xl border border-gray-200 text-gray-800 hover:text-primary hover:border-primary text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer bg-gray-50 hover:bg-white shadow-xs"
              >
                <span>Open Dedicated Product Page, Size Guide & Reviews</span>
                <Icon name="chevron_right" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductDetailModal() {
  const { selectedProduct, isOpen, closeProductModal } = useProductModal();
  if (!isOpen || !selectedProduct) return null;

  return (
    <ProductDetailModalInner
      key={selectedProduct.name}
      productDetails={selectedProduct}
      onClose={closeProductModal}
    />
  );
}

