import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import type { IconName } from '../components/ui/Icon';
import { SeoHead } from '../components/SeoHead';
import { SUPPORT_EMAIL } from '../constants/site';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';

interface ProfilePageProps {
  onBackToHome?: () => void;
  onNavigateToCart?: () => void;
}

type TabType = 'orders' | 'wishlist' | 'addresses' | 'sizes' | 'wallet' | 'settings';

export function ProfilePage({ onBackToHome, onNavigateToCart }: ProfilePageProps = {}) {
  const navigate = useNavigate();
  const handleHome = onBackToHome || (() => navigate('/'));
  const handleCart = onNavigateToCart || (() => navigate('/cart'));

  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [bagFeedback, setBagFeedback] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { currentUser, signInWithGoogle, logOut } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: 'Aura Metallic Block Heel Sandal',
      price: '₹2,995',
      originalPrice: '₹4,495',
      category: "Women's Festive",
      size: 'UK 5',
      img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 2,
      name: 'Handcrafted Heritage Penny Loafer',
      price: '₹4,995',
      originalPrice: '₹7,495',
      category: "Men's Formal",
      size: 'UK 9',
      img: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 3,
      name: 'Stella Shimmer Block Heel',
      price: '₹3,295',
      originalPrice: '₹4,995',
      category: "Women's Evening",
      size: 'UK 6',
      img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 4,
      name: 'AirSlide Ortho Comfort Chappal',
      price: '₹1,495',
      originalPrice: '₹2,295',
      category: 'Daily Comfort',
      size: 'UK 9',
      img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=600&auto=format&fit=crop',
    },
  ]);

  const [notificationSettings, setNotificationSettings] = useState({
    whatsapp: true,
    sms: true,
    email: false,
    dropAlerts: true,
  });

  const handleCopyReferral = () => {
    navigator.clipboard?.writeText('SOLEARJUN');
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  const handleRemoveWishlist = (id: number) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      setAuthError(null);
      await signInWithGoogle();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Sign-in failed. Please try again.';
      setAuthError(errorMsg);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleMoveToBag = (item: typeof wishlistItems[0]) => {
    const cleanPrice = parseInt(item.price.replace(/[^0-9]/g, ''), 10) || 2995;
    const cleanOriginalPrice = parseInt(item.originalPrice.replace(/[^0-9]/g, ''), 10) || cleanPrice + 1500;

    addToCart({
      id: `wishlist-${item.id}-${item.name}`,
      name: item.name,
      category: item.category,
      price: cleanPrice,
      originalPrice: cleanOriginalPrice,
      size: item.size,
      img: item.img,
    });

    handleRemoveWishlist(item.id);
    setBagFeedback(`✓ ${item.name} moved to your Shopping Bag!`);
    setTimeout(() => setBagFeedback(null), 3000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  const { orders } = useOrders();

  const tabs: { id: TabType; label: string; icon: IconName; count?: number }[] = [
    { id: 'orders', label: 'My Orders', icon: 'package', count: orders.length },
    { id: 'wishlist', label: 'Wishlist', icon: 'favorite', count: wishlistItems.length },
    { id: 'addresses', label: 'Saved Addresses', icon: 'map_pin', count: 2 },
    { id: 'sizes', label: 'My Shoe Sizes', icon: 'category' },
    { id: 'wallet', label: 'Wallet & Rewards', icon: 'card' },
    { id: 'settings', label: 'Account Settings', icon: 'person' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-12">
      <SeoHead
        title="My Account & Orders | CraftYourSole"
        description="Manage your CraftYourSole orders, wishlist, saved footwear sizes, and delivery addresses."
        canonicalPath="/profile"
        noindex
      />
      {/* Top Banner Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <button
            onClick={handleHome}
            className="flex items-center gap-2 text-xs md:text-sm font-semibold text-gray-700 hover:text-primary transition-colors cursor-pointer"
          >
            <Icon name="arrow_left" className="w-4 h-4" />
            <span>Back to Store</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Home</span>
            <span>/</span>
            <span className="text-gray-900 font-semibold">My Account</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* User Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200/80 shadow-xs mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4 md:gap-5">
              {currentUser ? (
                currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User Avatar'}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover shadow-md shrink-0 border-2 border-primary"
                  />
                ) : (
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-tr from-primary to-orange-500 text-white font-anton text-2xl md:text-3xl flex items-center justify-center shadow-md shrink-0">
                    {currentUser.displayName
                      ? currentUser.displayName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()
                      : 'DK'}
                  </div>
                )
              ) : (
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center shrink-0 border border-gray-200">
                  <Icon name="person" className="w-8 h-8" />
                </div>
              )}

              <div>
                {currentUser ? (
                  <>
                    <div className="flex items-center gap-2.5">
                      <h1 className="font-anton text-2xl md:text-3xl text-gray-900 tracking-wide">
                        {currentUser.displayName || 'Footwear Connoisseur'}
                      </h1>
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-900 text-[10px] md:text-xs font-bold px-2.5 py-0.5 rounded-full border border-green-300">
                        <Icon name="check" className="w-3.5 h-3.5 text-green-700" />
                        Google Verified
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">
                      {currentUser.email || 'Authenticated via Google Cloud'}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[11px] text-gray-400">
                        GCP: <span className="font-mono text-gray-600">lohithkumarshoemart</span>
                      </span>
                      <button
                        onClick={() => logOut()}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700 underline cursor-pointer"
                      >
                        <Icon name="log_out" className="w-3 h-3" />
                        Sign Out
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2.5">
                      <h1 className="font-anton text-2xl md:text-3xl text-gray-900 tracking-wide">
                        Guest Shopper
                      </h1>
                      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-[10px] md:text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
                        <Icon name="loyalty" className="w-3.5 h-3.5 text-amber-700" />
                        Preview Mode
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">
                      Sign in with your Google account to sync your orders, addresses, and wishlist.
                    </p>
                    <div className="mt-3">
                      <button
                        onClick={handleGoogleSignIn}
                        disabled={isSigningIn}
                        className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold text-gray-800 bg-white hover:bg-gray-50 border border-gray-300 shadow-xs transition-all cursor-pointer hover:border-gray-400 active:scale-95 disabled:opacity-60"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                        {isSigningIn ? 'Connecting to Google Cloud...' : 'Sign in with Google'}
                      </button>
                      {authError && (
                        <p className="text-xs text-red-600 mt-1.5 font-medium">{authError}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Quick Stat Tiles */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-6">
              <div className="text-center sm:text-left">
                <span className="text-[11px] text-gray-500 block uppercase font-medium">Orders</span>
                <span className="font-anton text-xl md:text-2xl text-gray-900">3</span>
              </div>
              <div className="text-center sm:text-left">
                <span className="text-[11px] text-gray-500 block uppercase font-medium">Wallet</span>
                <span className="font-anton text-xl md:text-2xl text-primary">₹1,250</span>
              </div>
              <div className="text-center sm:text-left">
                <span className="text-[11px] text-gray-500 block uppercase font-medium">Size</span>
                <span className="font-anton text-xl md:text-2xl text-gray-900">UK 9</span>
              </div>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar Tabs + Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tabs Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200/80 p-2 shadow-xs flex lg:flex-col overflow-x-auto gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-xs md:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer text-left ${
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon name={tab.icon} className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        activeTab === tab.id
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Help & Support Card */}
            <div className="mt-4 bg-orange-50 border border-orange-200/80 rounded-2xl p-4 text-xs">
              <h5 className="font-bold text-gray-900 mb-1">Need Footwear Help?</h5>
              <p className="text-gray-600 mb-3 leading-relaxed">
                Have questions regarding size exchanges or festive deliveries?
              </p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-primary font-bold hover:underline inline-flex items-center gap-1"
              >
                Contact Footwear Support →
              </a>
            </div>
          </div>

          {/* Tab Content Display Area */}
          <div className="lg:col-span-3">
            {/* TAB 1: ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-anton text-xl md:text-2xl text-gray-900 uppercase tracking-wide">
                    Recent Footwear Orders
                  </h2>
                  <span className="text-xs text-gray-500">Showing {orders.length} orders</span>
                </div>

                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-2xl border border-gray-200/80 p-5 md:p-6 shadow-xs hover:border-primary/40 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 text-sm">Order #{ord.orderNumber}</span>
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              ord.orderStatus === 'DELIVERED'
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : ord.orderStatus === 'SHIPPED'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {ord.orderStatus === 'SHIPPED' && (
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                            )}
                            {ord.orderStatus === 'DELIVERED' && (
                              <Icon name="check" className="w-3 h-3 text-green-600" />
                            )}
                            {ord.orderStatus}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 mt-0.5 block">
                          Payment: {ord.paymentMethod} • {ord.paymentStatus} (₹{ord.totalAmount.toLocaleString('en-IN')})
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-gray-700">
                        {ord.estimatedDelivery ? `Est. Delivery: ${ord.estimatedDelivery}` : 'Standard Delivery'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-center">
                          <img
                            src={item.img}
                            alt={item.productName}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-gray-100 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 text-sm md:text-base truncate">
                              {item.productName}
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Size: {item.size} • Qty: {item.quantity}
                            </p>
                            <span className="font-bold text-gray-900 text-sm mt-1 block">
                              ₹{item.price.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2.5 mt-5 pt-4 border-t border-gray-100">
                      <button className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#8A2600] transition-colors cursor-pointer">
                        Track Live Delivery
                      </button>
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer">
                        Size Exchange or Return
                      </button>
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer">
                        Download Invoice
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: WISHLIST */}
            {activeTab === 'wishlist' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-anton text-xl md:text-2xl text-gray-900 uppercase tracking-wide">
                      My Wishlist
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {wishlistItems.length} footwear pairs saved for later
                    </p>
                  </div>
                  <button
                    onClick={handleCart}
                    className="text-xs font-bold text-primary hover:underline cursor-pointer"
                  >
                    View Shopping Bag →
                  </button>
                </div>

                {bagFeedback && (
                  <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-bold flex items-center justify-between animate-fade-in">
                    <span>{bagFeedback}</span>
                    <button
                      onClick={handleCart}
                      className="bg-green-700 text-white text-[11px] px-2.5 py-1 rounded-lg hover:bg-green-800 cursor-pointer"
                    >
                      Go to Cart
                    </button>
                  </div>
                )}

                {wishlistItems.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                    <Icon name="favorite" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="font-bold text-gray-900 text-base">Your Wishlist is Empty</h3>
                    <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                      Explore festive, daily, and gym footwear to add your favorite silhouettes here.
                    </p>
                    <button
                      onClick={handleHome}
                      className="mt-4 bg-primary text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-[#8A2600] transition-colors cursor-pointer"
                    >
                      Browse Footwear
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlistItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl border border-gray-200/80 p-4 flex gap-4 shadow-xs hover:shadow-md transition-shadow relative"
                      >
                        <img
                          src={item.img}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-xl border border-gray-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-primary uppercase">
                              {item.category}
                            </span>
                            <h4 className="font-bold text-gray-900 text-sm truncate mt-0.5">
                              {item.name}
                            </h4>
                            <span className="text-xs text-gray-500">Saved Size: {item.size}</span>
                            <div className="flex items-baseline gap-2 mt-1">
                              <span className="font-bold text-gray-900 text-sm">{item.price}</span>
                              <span className="text-xs text-gray-400 line-through">
                                {item.originalPrice}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mt-3">
                            <button
                              onClick={() => handleMoveToBag(item)}
                              className="flex-1 bg-primary hover:bg-[#8A2600] text-white text-xs font-bold py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
                            >
                              Move to Bag
                            </button>
                            <button
                              onClick={() => handleRemoveWishlist(item.id)}
                              className="text-gray-400 hover:text-red-500 p-1.5 transition-colors text-xs font-semibold cursor-pointer"
                              title="Remove"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: ADDRESSES */}
            {activeTab === 'addresses' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-anton text-xl md:text-2xl text-gray-900 uppercase tracking-wide">
                      Saved Delivery Addresses
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Fast 1-click checkout for your home and office
                    </p>
                  </div>
                  <button className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#8A2600] transition-colors">
                    + Add New Address
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Address 1: Home (Default) */}
                  <div className="bg-white rounded-2xl border-2 border-primary/40 p-5 shadow-xs relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                        Default Home
                      </span>
                      <button className="text-xs text-gray-500 hover:text-primary font-semibold">
                        Edit
                      </button>
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm">Arjun Sharma</h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      Flat 402, Shanti Vihar Apartments, 12th Main Road, HAL 2nd Stage, Indiranagar
                    </p>
                    <p className="text-xs text-gray-600 font-medium mt-0.5">
                      Bengaluru, Karnataka - 560038
                    </p>
                    <p className="text-xs text-gray-500 mt-2 font-medium">
                      Phone: +91 98765 43210
                    </p>
                  </div>

                  {/* Address 2: Work */}
                  <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                        Office / Work
                      </span>
                      <button className="text-xs text-gray-500 hover:text-primary font-semibold">
                        Edit
                      </button>
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm">Arjun Sharma (Tech Hub)</h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      4th Floor, Tower B, Helios Business Park, Outer Ring Road, Kadubeesanahalli
                    </p>
                    <p className="text-xs text-gray-600 font-medium mt-0.5">
                      Bengaluru, Karnataka - 560103
                    </p>
                    <p className="text-xs text-gray-500 mt-2 font-medium">
                      Phone: +91 98765 43210
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: SIZES & FIT */}
            {activeTab === 'sizes' && (
              <div>
                <div className="mb-4">
                  <h2 className="font-anton text-xl md:text-2xl text-gray-900 uppercase tracking-wide">
                    My Family Shoe Sizes & Fit Profile
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Save sizing preferences across Indian, UK, and US standards for accurate fit.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white rounded-2xl border-2 border-primary/30 p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-900">Arjun (Self)</span>
                      <span className="text-[10px] bg-primary text-white font-bold px-2 py-0.5 rounded">
                        Primary
                      </span>
                    </div>
                    <div className="text-2xl font-anton text-primary">UK 9 / EU 43</div>
                    <p className="text-xs text-gray-500 mt-1">Foot length: 27.5 cm</p>
                    <p className="text-xs text-gray-600 font-medium mt-0.5">
                      Fit: Standard Indian Wide
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-900">Priya (Spouse)</span>
                      <span className="text-[10px] bg-gray-100 text-gray-700 font-bold px-2 py-0.5 rounded">
                        Women
                      </span>
                    </div>
                    <div className="text-2xl font-anton text-gray-800">UK 5 / EU 38</div>
                    <p className="text-xs text-gray-500 mt-1">Foot length: 24.0 cm</p>
                    <p className="text-xs text-gray-600 font-medium mt-0.5">
                      Fit: Standard Heels & Flats
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-900">Aarav (Son)</span>
                      <span className="text-[10px] bg-gray-100 text-gray-700 font-bold px-2 py-0.5 rounded">
                        Kids
                      </span>
                    </div>
                    <div className="text-2xl font-anton text-gray-800">UK 3 / EU 35</div>
                    <p className="text-xs text-gray-500 mt-1">Foot length: 22.0 cm</p>
                    <p className="text-xs text-gray-600 font-medium mt-0.5">
                      Fit: Comfort School / Sports
                    </p>
                  </div>
                </div>

                <div className="bg-orange-50/80 border border-orange-200 rounded-2xl p-5">
                  <h4 className="font-bold text-gray-900 text-sm mb-1">
                    🛡️ CraftYourSole 100% Fit Guarantee
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Worried about ethnic Jutti or formal sizing? If your pair doesn't fit like a glove, our delivery executive will bring you the adjacent size right to your doorstep for free within 7 days.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 5: WALLET */}
            {activeTab === 'wallet' && (
              <div>
                <div className="mb-4">
                  <h2 className="font-anton text-xl md:text-2xl text-gray-900 uppercase tracking-wide">
                    CraftYourSole Club Wallet &amp; Referral
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Earn coins on every festive, daily, and sports purchase.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Balance Card */}
                  <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-primary text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
                    <div className="relative z-10">
                      <span className="text-xs text-white/70 uppercase tracking-wider font-semibold">
                        Available Store Credits
                      </span>
                      <div className="font-anton text-4xl text-white mt-1">₹1,250.00</div>
                      <p className="text-xs text-white/80 mt-2">
                        Equivalent to 1,250 SoleCoins. Auto-applied at checkout.
                      </p>
                      <button className="mt-4 bg-white text-gray-900 text-xs font-bold px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors">
                        Use Coins On Next Order
                      </button>
                    </div>
                  </div>

                  {/* Referral Card */}
                  <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">
                        Give ₹300, Get ₹300
                      </span>
                      <h4 className="font-anton text-xl text-gray-900 mt-0.5">
                        Refer Friends & Family
                      </h4>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        Share your unique code. When your friend orders their first pair of footwear, you both get ₹300 credited.
                      </p>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-xl px-3 py-2 text-center font-mono font-bold text-gray-900 text-sm tracking-wider">
                        SOLEARJUN
                      </div>
                      <button
                        onClick={handleCopyReferral}
                        className="bg-primary hover:bg-[#8A2600] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shrink-0 cursor-pointer"
                      >
                        {copiedReferral ? 'Copied!' : 'Copy Code'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Coin History */}
                <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
                  <h4 className="font-bold text-gray-900 text-sm mb-3">Rewards Transaction History</h4>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div>
                        <span className="font-bold text-gray-900 block">Festive Drop Bonus</span>
                        <span className="text-gray-400">Order #DK-82741 (Royal Mojari)</span>
                      </div>
                      <span className="text-green-600 font-bold text-sm">+500 Coins</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div>
                        <span className="font-bold text-gray-900 block">Verified Review Reward</span>
                        <span className="text-gray-400">Review for Aero Stride Runner</span>
                      </div>
                      <span className="text-green-600 font-bold text-sm">+250 Coins</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <div>
                        <span className="font-bold text-gray-900 block">CraftYourSole Club Gold Welcome</span>
                        <span className="text-gray-400">Unlocked Gold tier status</span>
                      </div>
                      <span className="text-green-600 font-bold text-sm">+500 Coins</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: SETTINGS */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
                <h2 className="font-anton text-xl md:text-2xl text-gray-900 uppercase tracking-wide mb-1">
                  Account Details & Communication
                </h2>
                <p className="text-xs text-gray-500 mb-6">
                  Manage personal information and order tracking channels.
                </p>

                <form onSubmit={handleSaveSettings} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Arjun Sharma"
                        className="w-full h-11 px-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        defaultValue="+91 98765 43210"
                        className="w-full h-11 px-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue="arjun.sharma@gmail.com"
                      className="w-full h-11 px-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                      required
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="font-bold text-gray-900 text-sm mb-3">
                      Order Notification Preferences
                    </h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.whatsapp}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              whatsapp: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-primary rounded accent-primary"
                        />
                        <span className="text-xs text-gray-700 font-medium">
                          Receive live tracking updates & delivery OTPs via WhatsApp
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.sms}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              sms: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-primary rounded accent-primary"
                        />
                        <span className="text-xs text-gray-700 font-medium">
                          Send SMS delivery status updates
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.dropAlerts}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              dropAlerts: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-primary rounded accent-primary"
                        />
                        <span className="text-xs text-gray-700 font-medium">
                          Notify me about exclusive Festive and New Season drops
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center gap-4">
                    <button
                      type="submit"
                      className="bg-primary hover:bg-[#8A2600] text-white text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-md cursor-pointer"
                    >
                      Save Profile Changes
                    </button>
                    {savedFeedback && (
                      <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                        ✓ Profile updated successfully!
                      </span>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
