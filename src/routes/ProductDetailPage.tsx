import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import { SeoHead } from '../components/SeoHead';
import { useProductCatalog } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { SAMPLE_PRODUCT_REVIEWS, SIZING_CHART_DATA } from '../constants/productReviews';
import { SITE_NAME, SITE_URL } from '../constants/site';
import type { Product, ProductReview } from '../types/product';

type TabType = 'story' | 'specs' | 'styling' | 'care';
type FitType = 'Runs Small' | 'True to Size' | 'Runs Large';

const TABS: { id: TabType; label: string }[] = [
  { id: 'story', label: 'Artisan Story & Craft' },
  { id: 'specs', label: 'Materials & Shoe Anatomy' },
  { id: 'styling', label: 'Occasions & Styling' },
  { id: 'care', label: 'Care Instructions' },
];

function ProductDetailContent({ product }: { product: Product }) {
  const navigate = useNavigate();
  const { activeProducts } = useProductCatalog();
  const { addToCart } = useCart();

  // Scroll to top when this product mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Size & Quantity state
  const [selectedSize, setSelectedSize] = useState<string>(
    () => product.sizes?.[2] || product.sizes?.[0] || 'UK 8'
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabType>('story');

  // Pincode checker state
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<null | { valid: boolean; message: string }>(null);

  // Reviews state with localStorage initialization
  const storageKey = `desikicks_reviews_${product.slug}`;
  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return SAMPLE_PRODUCT_REVIEWS[product.slug] || SAMPLE_PRODUCT_REVIEWS['royal-velvet-embroidered-mojari'] || [];
  });

  // Write Review Modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewCity, setNewReviewCity] = useState('');
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewFit, setNewReviewFit] = useState<FitType>('True to Size');
  const [newReviewSize, setNewReviewSize] = useState('UK 9');

  const images = useMemo(() => {
    const list = [product.img, ...(product.additionalImages || [])];
    return list.filter((url, idx, self) => Boolean(url) && self.indexOf(url) === idx);
  }, [product]);

  const activeImg = images[activeImageIndex] || product.img;

  const originalPrice = product.originalPrice || Math.round(product.price * 1.45);
  const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  // Variant stock
  const currentVariant = product.variants?.find((v) => v.size === selectedSize);
  const currentStock = currentVariant ? currentVariant.stock : 12;

  // Handle Add To Cart
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: `${product.name}-${selectedSize}`,
        name: product.name,
        category: product.category,
        price: product.price,
        originalPrice,
        size: selectedSize,
        img: product.img,
      });
    }
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2400);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode.trim())) {
      setPincodeStatus({ valid: false, message: 'Please enter a valid 6-digit Indian PIN code' });
      return;
    }
    const days = 3 + (parseInt(pincode.slice(-1), 10) % 2);
    const date = new Date();
    date.setDate(date.getDate() + days);
    const dateStr = date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
    setPincodeStatus({
      valid: true,
      message: `FREE Delivery by ${dateStr} • Cash on Delivery & Doorstep Exchange Available`,
    });
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      author: newReviewAuthor.trim(),
      city: newReviewCity.trim() || 'India',
      rating: newReviewRating,
      date: 'Just now',
      title: newReviewTitle.trim() || 'Great Footwear!',
      comment: newReviewComment.trim(),
      fitFeedback: newReviewFit,
      verifiedBuyer: true,
      sizePurchased: newReviewSize,
      helpfulCount: 1,
    };

    const updated = [newRev, ...reviews];
    setReviews(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));

    // Reset Form & Close
    setNewReviewAuthor('');
    setNewReviewCity('');
    setNewReviewTitle('');
    setNewReviewComment('');
    setIsReviewModalOpen(false);
  };

  const handleHelpfulVote = (reviewId: string) => {
    const updated = reviews.map((r) =>
      r.id === reviewId ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r
    );
    setReviews(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  // Related products
  const relatedProducts = activeProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const totalStock = (product.variants || []).reduce((sum, v) => sum + v.stock, 0);
  const productUrl = `${SITE_URL}/products/${product.slug}`;
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: product.name,
        image: images,
        description: product.description,
        sku: product.id,
        brand: {
          '@type': 'Brand',
          name: SITE_NAME,
        },
        category: product.category,
        offers: {
          '@type': 'Offer',
          url: productUrl,
          priceCurrency: 'INR',
          price: product.price,
          availability:
            totalStock > 0 || product.isActive
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating || 4.8,
          reviewCount: product.reviewsCount || reviews.length || 1,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Collections', item: `${SITE_URL}/collections` },
          { '@type': 'ListItem', position: 3, name: product.name, item: productUrl },
        ],
      },
    ],
  };

  return (
    <div className="bg-white text-gray-900 pb-20">
      <SeoHead
        title={`${product.name} | ${SITE_NAME}`}
        description={product.story || product.description}
        canonicalPath={`/products/${product.slug}`}
        ogType="product"
        image={product.img}
        jsonLd={productJsonLd}
      />
      {/* Toast Notifications */}
      {shareToast && (
        <div className="fixed top-20 right-4 z-50 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xl flex items-center gap-2 animate-fade-in">
          <Icon name="check" className="w-4 h-4 text-emerald-400" />
          <span>Product link copied to clipboard!</span>
        </div>
      )}

      {addedToast && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl text-xs font-bold shadow-xl flex items-center gap-2.5 animate-fade-in">
          <Icon name="check" className="w-5 h-5 text-white" />
          <div>
            <p className="font-bold">Added {quantity} pair(s) to bag!</p>
            <p className="text-[11px] text-white/80">Size: {selectedSize}</p>
          </div>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-gray-500 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <Icon name="home" className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-600 font-medium">{product.category}</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-bold truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Product Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT: Multi-image Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[580px] pb-2 md:pb-0 scrollbar-none">
                {images.map((imgUrl, idx) => (
                  <button
                    key={imgUrl + idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-primary ring-2 ring-primary/20 shadow-md'
                        : 'border-gray-200 opacity-75 hover:border-gray-300'
                    }`}
                  >
                    <img src={imgUrl} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image */}
            <div className="relative flex-1 bg-gray-50 rounded-3xl border border-gray-100 overflow-hidden group aspect-[4/3] sm:aspect-[1/1] flex items-center justify-center p-4">
              {/* Tag Badge */}
              {product.tag && (
                <div className="absolute top-4 left-4 z-10 bg-gray-900/90 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                  {product.tag}
                </div>
              )}

              {/* Action Buttons Top Right: Share & Wishlist */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <button
                  onClick={handleShare}
                  title="Share Product"
                  className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Icon name="share" className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Icon
                    name="favorite"
                    filled={isWishlisted}
                    className={`w-5 h-5 transition-colors ${
                      isWishlisted ? 'text-primary fill-primary' : 'text-gray-600'
                    }`}
                  />
                </button>
              </div>

              {/* Main Image */}
              <img
                src={activeImg}
                alt={product.name}
                className="w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
              />

              {/* Artisan Region Badge Overlay */}
              {product.artisanRegion && (
                <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-100 text-[11px] font-bold text-gray-800 flex items-center gap-1.5 shadow-sm">
                  <Icon name="map_pin" className="w-3.5 h-3.5 text-primary" />
                  <span>Handcrafted in {product.artisanRegion}</span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Product Buy Box & Specs */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Category & Status */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-primary">
                  {product.category}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  In Stock & Ready to Ship
                </span>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-snug mb-3">
                {product.name}
              </h1>

              {/* Ratings Summary */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                  <Icon name="star" filled className="w-4 h-4 text-amber-500 mr-1" />
                  <span className="text-xs font-black text-amber-900">{product.rating || 4.9}</span>
                </div>
                <a
                  href="#customer-reviews"
                  className="text-xs font-bold text-gray-500 hover:text-primary transition-colors underline decoration-dotted"
                >
                  {reviews.length || product.reviewsCount || 348} Customer Reviews
                </a>
                <span className="text-xs text-gray-300">•</span>
                <span className="text-xs text-gray-500 font-medium">96% Recommend</span>
              </div>

              {/* Price Box */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-gray-900">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {originalPrice > product.price && (
                    <>
                      <span className="text-base font-semibold text-gray-400 line-through">
                        ₹{originalPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        SAVE {discountPercent}%
                      </span>
                    </>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  Inclusive of all taxes • <strong>FREE Express Shipping</strong> on this pair
                </p>
              </div>

              {/* Size Selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-gray-900">
                      Select Indian Size:
                    </span>
                    <span className="text-xs font-bold text-primary">{selectedSize}</span>
                  </div>
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Size Guide (cm/in)</span>
                  </button>
                </div>

                <div className="grid grid-cols-6 gap-2">
                  {(product.sizes || ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11']).map((s) => {
                    const isSelected = selectedSize === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-gray-900 text-white border-gray-900 shadow-md scale-102'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between mt-2.5 text-[11px] text-gray-500">
                  <span>
                    Fit status:{' '}
                    <strong className="text-gray-800">
                      {currentStock <= 5 ? `🔥 Only ${currentStock} pairs left in ${selectedSize}` : 'In Stock'}
                    </strong>
                  </span>
                  <span>Fits true to standard Indian sizing</span>
                </div>
              </div>

              {/* Quantity Selector & CTAs */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 hover:bg-white transition-colors disabled:opacity-40 cursor-pointer"
                    >
                      <Icon name="minus" className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-gray-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(currentStock || 10, quantity + 1))}
                      disabled={quantity >= (currentStock || 10)}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 hover:bg-white transition-colors disabled:opacity-40 cursor-pointer"
                    >
                      <Icon name="plus" className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add to Bag */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3.5 px-6 rounded-xl bg-primary text-white font-black text-sm uppercase tracking-wider hover:bg-primary/95 shadow-lg shadow-primary/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Icon name="shopping_bag" className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </button>
                </div>

                {/* Buy Now Instant */}
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 px-6 rounded-xl bg-gray-900 text-white font-black text-sm uppercase tracking-wider hover:bg-black shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Buy Now • Express Checkout</span>
                </button>
              </div>

              {/* Indian Pincode Delivery Estimator */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="truck" className="w-4 h-4 text-primary" />
                  <span className="text-xs font-black uppercase tracking-wider text-gray-900">
                    Delivery & Serviceability Check
                  </span>
                </div>
                <form onSubmit={handlePincodeCheck} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Enter 6-digit PIN Code (e.g. 110001)"
                    className="flex-1 px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-primary"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-900 hover:bg-primary text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Check
                  </button>
                </form>
                {pincodeStatus && (
                  <p
                    className={`text-xs font-semibold mt-2 ${
                      pincodeStatus.valid ? 'text-emerald-700' : 'text-red-600'
                    }`}
                  >
                    {pincodeStatus.message}
                  </p>
                )}
              </div>

              {/* Trust Badges Bar */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 text-center">
                <div className="p-2">
                  <Icon name="truck" className="w-5 h-5 mx-auto text-primary mb-1" />
                  <p className="text-[11px] font-bold text-gray-900">Free Express</p>
                  <p className="text-[10px] text-gray-500">All India shipping</p>
                </div>
                <div className="p-2">
                  <Icon name="refresh" className="w-5 h-5 mx-auto text-primary mb-1" />
                  <p className="text-[11px] font-bold text-gray-900">7-Day Swap</p>
                  <p className="text-[10px] text-gray-500">Doorstep size exchange</p>
                </div>
                <div className="p-2">
                  <Icon name="shield" className="w-5 h-5 mx-auto text-primary mb-1" />
                  <p className="text-[11px] font-bold text-gray-900">100% Genuine</p>
                  <p className="text-[10px] text-gray-500">Artisan handcrafted</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DETAILED TABS: Artisan Heritage, Materials, Styling, Care */}
        <div className="mt-14 pt-8 border-t border-gray-200">
          <div className="flex border-b border-gray-200 gap-4 sm:gap-8 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-6">
            {activeTab === 'story' && (
              <div className="max-w-4xl space-y-4 text-sm text-gray-600 leading-relaxed animate-fade-in">
                <p className="font-medium text-gray-900 text-base">{product.story}</p>
                <p>{product.description}</p>
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/60 mt-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 mb-1">
                    Heritage Authenticity Guarantee
                  </h4>
                  <p className="text-xs text-amber-800">
                    Every pair of {SITE_NAME} footwear is stitched by skilled generational cobblers and artisans
                    located in traditional leather craft hubs across India. By choosing {SITE_NAME}, you directly
                    support fair artisan wages and preserve India’s timeless shoe-making legacy.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Upper Material
                  </span>
                  <span className="text-xs font-bold text-gray-900">{product.upperMaterial}</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Sole Construction
                  </span>
                  <span className="text-xs font-bold text-gray-900">{product.soleMaterial}</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Insole & Cushioning
                  </span>
                  <span className="text-xs font-bold text-gray-900">{product.insoleType}</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Region of Craft
                  </span>
                  <span className="text-xs font-bold text-gray-900">
                    {product.artisanRegion || 'Jaipur, Rajasthan'}
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'styling' && (
              <div className="max-w-3xl space-y-3 text-sm text-gray-600 animate-fade-in">
                <h4 className="font-bold text-gray-900 text-base">Recommended Pairings:</h4>
                <p>
                  <strong>Best Suited For:</strong> {product.idealFor}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="block text-xs font-bold text-gray-900 mb-1">Traditional Attire</span>
                    <span className="text-xs text-gray-500">Pairs effortlessly with raw silk sherwanis, kurtas, and pathanis.</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="block text-xs font-bold text-gray-900 mb-1">Indo-Western & Chinos</span>
                    <span className="text-xs text-gray-500">Elevates linen trousers, tapered chinos, and nehru jackets.</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="block text-xs font-bold text-gray-900 mb-1">Comfort Wear</span>
                    <span className="text-xs text-gray-500">Equipped with 6mm orthopedic cushioning for standing comfortably during long events.</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'care' && (
              <div className="max-w-3xl space-y-2 text-xs text-gray-600 animate-fade-in">
                <p>• Clean surface dust with a soft, clean horsehair brush or dry microfiber cloth.</p>
                <p>• Avoid submerging in water or washing machine cycles.</p>
                <p>• If wet from rain, allow footwear to air dry naturally away from direct scorching sunlight or heat sources.</p>
                <p>• Store in the provided breathable cotton shoe bag with cedar shoe inserts to retain natural curvature.</p>
              </div>
            )}
          </div>
        </div>

        {/* CUSTOMER REVIEWS & VISUAL UGC SECTION */}
        <section id="customer-reviews" className="mt-14 pt-10 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Verified Feedback</span>
              <h3 className="text-2xl font-black text-gray-900">Customer Ratings & Reviews</h3>
            </div>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-5 py-2.5 bg-gray-900 hover:bg-primary text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Icon name="plus" className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>

          {/* Rating Summary Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-gray-50 p-6 rounded-3xl border border-gray-100 mb-8">
            <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pb-0">
              <span className="text-5xl font-black text-gray-900">{product.rating || 4.9}</span>
              <div className="flex items-center gap-1 text-amber-500 my-2">
                {[1, 2, 3, 4, 5].map((st) => (
                  <Icon key={st} name="star" filled className="w-5 h-5 fill-amber-500" />
                ))}
              </div>
              <span className="text-xs text-gray-500">Based on {reviews.length} customer experiences</span>
            </div>

            {/* Star Distribution Breakdown */}
            <div className="md:col-span-8 flex flex-col justify-center gap-2">
              {[
                { star: 5, pct: 86 },
                { star: 4, pct: 11 },
                { star: 3, pct: 3 },
                { star: 2, pct: 0 },
                { star: 1, pct: 0 },
              ].map((row) => (
                <div key={row.star} className="flex items-center gap-3 text-xs">
                  <span className="w-7 font-bold text-gray-700">{row.star} ★</span>
                  <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${row.pct}%` }} />
                  </div>
                  <span className="w-9 text-right text-gray-500 font-medium">{row.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Review Cards */}
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-5 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 transition-colors shadow-2xs">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900">{rev.author}</span>
                      {rev.verifiedBuyer && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Icon name="check" className="w-3 h-3 text-emerald-600" />
                          Verified Buyer
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-400">{rev.city} • {rev.date}</span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Icon
                        key={i}
                        name="star"
                        filled={i < rev.rating}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-500' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    Size: {rev.sizePurchased}
                  </span>
                  <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    Fit: {rev.fitFeedback}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-gray-900 mb-1">{rev.title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed mb-3">{rev.comment}</p>

                <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-50">
                  <button
                    onClick={() => handleHelpfulVote(rev.id)}
                    className="flex items-center gap-1.5 hover:text-gray-700 transition-colors cursor-pointer"
                  >
                    <Icon name="thumbs_up" className="w-3.5 h-3.5" />
                    <span>Helpful ({rev.helpfulCount || 0})</span>
                  </button>
                  <span className="text-[11px]">Recommended</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RELATED / YOU MAY ALSO LIKE */}
        <section className="mt-16 pt-10 border-t border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Curated Recommendations</span>
              <h3 className="text-2xl font-black text-gray-900">You May Also Like</h3>
            </div>
            <Link to="/" className="text-xs font-bold text-primary hover:underline">
              View All Footwear →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => navigate(`/products/${rel.slug}`)}
                className="group bg-white p-3.5 rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 mb-3 relative">
                    <img
                      src={rel.img}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {rel.tag && (
                      <span className="absolute top-2 left-2 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {rel.tag}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-xs text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                    {rel.name}
                  </h4>
                  <p className="text-[11px] text-gray-500 mb-2">{rel.category}</p>
                </div>
                <div className="flex items-baseline justify-between pt-2 border-t border-gray-100">
                  <span className="font-black text-sm text-gray-900">₹{rel.price.toLocaleString('en-IN')}</span>
                  <span className="text-[11px] font-bold text-amber-600 flex items-center gap-0.5">
                    <Icon name="star" filled className="w-3 h-3 fill-amber-500" />
                    {rel.rating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* SIZE GUIDE MODAL */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowSizeGuide(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
          />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 z-10 shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <h3 className="text-lg font-black text-gray-900">Footwear Size Conversion & Guide</h3>
                <p className="text-xs text-gray-500">Indian standards matched with international shoe metrics</p>
              </div>
              <button
                onClick={() => setShowSizeGuide(false)}
                className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <Icon name="close" className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto mb-6">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-3 rounded-l-lg">India / UK</th>
                    <th className="py-2.5 px-3">US Size</th>
                    <th className="py-2.5 px-3">EU Size</th>
                    <th className="py-2.5 px-3">Foot Length (CM)</th>
                    <th className="py-2.5 px-3 rounded-r-lg">Inches</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {SIZING_CHART_DATA.map((row) => (
                    <tr
                      key={row.uk}
                      className={row.uk === selectedSize ? 'bg-primary/5 font-bold text-primary' : 'text-gray-700'}
                    >
                      <td className="py-2.5 px-3">{row.uk}</td>
                      <td className="py-2.5 px-3">{row.us}</td>
                      <td className="py-2.5 px-3">{row.eu}</td>
                      <td className="py-2.5 px-3">{row.footCm}</td>
                      <td className="py-2.5 px-3">{row.footInches}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs text-gray-600 space-y-2">
              <h4 className="font-black text-gray-900 uppercase tracking-wider text-[11px]">
                How to Measure Your Foot Length
              </h4>
              <p>1. Place a sheet of paper on the floor with one edge against a straight wall.</p>
              <p>2. Stand on the sheet with your heel firmly touching the wall.</p>
              <p>3. Mark the longest point of your toes on the paper with a pencil.</p>
              <p>4. Measure the distance in centimeters from the wall edge to your pencil mark.</p>
              <p className="font-bold text-gray-800 pt-1">
                Tip: Indian feet are naturally broader at the ball. If you fall between sizes or wear thick socks, we recommend choosing 1 size up.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* WRITE A REVIEW MODAL */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsReviewModalOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
          />
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 z-10 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-5">
              <div>
                <h3 className="text-lg font-black text-gray-900">Write a Review</h3>
                <p className="text-xs text-gray-500">Share your fitting and comfort experience</p>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <Icon name="close" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-4">
              {/* Star Rating Picker */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Overall Rating</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setNewReviewRating(st)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Icon
                        name="star"
                        filled={st <= newReviewRating}
                        className={`w-6 h-6 ${st <= newReviewRating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-gray-600 ml-2">{newReviewRating} out of 5 Stars</span>
                </div>
              </div>

              {/* Author & City */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={newReviewCity}
                    onChange={(e) => setNewReviewCity(e.target.value)}
                    placeholder="e.g. Mumbai, MH"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Size Bought & Fit Feedback */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Size Purchased</label>
                  <select
                    value={newReviewSize}
                    onChange={(e) => setNewReviewSize(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-primary"
                  >
                    {['UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'].map((sz) => (
                      <option key={sz} value={sz}>{sz}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Fit Feedback</label>
                  <select
                    value={newReviewFit}
                    onChange={(e) => setNewReviewFit(e.target.value as FitType)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-primary"
                  >
                    <option value="True to Size">True to Size</option>
                    <option value="Runs Small">Runs Small</option>
                    <option value="Runs Large">Runs Large</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Review Headline</label>
                <input
                  type="text"
                  value={newReviewTitle}
                  onChange={(e) => setNewReviewTitle(e.target.value)}
                  placeholder="e.g. Incredibly soft leather and no blisters!"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-primary"
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Your Review *</label>
                <textarea
                  required
                  rows={4}
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="How was the comfort, arch support, and craftsmanship?"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-primary"
                />
              </div>

              {/* Submit */}
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-md shadow-primary/20 hover:bg-primary/95 cursor-pointer"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { products } = useProductCatalog();

  const product = useMemo(() => {
    if (!slug) return undefined;
    const cleanSlug = slug.toLowerCase();
    return products.find(
      (p) =>
        p.slug.toLowerCase() === cleanSlug ||
        p.id.toLowerCase() === cleanSlug ||
        p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cleanSlug
    );
  }, [slug, products]);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <SeoHead
          title={`Product Not Found | ${SITE_NAME}`}
          description="The footwear model you requested is no longer available or has moved."
          canonicalPath={`/products/${slug || 'not-found'}`}
          noindex
        />
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
          <Icon name="search" className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Product Not Found</h1>
        <p className="text-gray-500 max-w-md text-sm mb-6">
          The footwear model you are looking for may have sold out or been updated in our catalog.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer"
        >
          Explore All Footwear
        </button>
      </div>
    );
  }

  return <ProductDetailContent key={product.slug} product={product} />;
}
