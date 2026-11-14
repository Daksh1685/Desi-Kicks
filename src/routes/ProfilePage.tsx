import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import type { IconName } from '../components/ui/Icon';
import { SeoHead } from '../components/SeoHead';
import { SUPPORT_EMAIL } from '../constants/site';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist, type WishlistItem } from '../context/WishlistContext';

interface ProfilePageProps {
  onBackToHome?: () => void;
  onNavigateToCart?: () => void;
}

type TabType = 'orders' | 'wishlist' | 'addresses' | 'sizes' | 'wallet' | 'settings';

interface SavedAddress {
  fullName: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

interface FitProfile {
  size: string;
  footWidth: string;
  footLengthCm: string;
}

const SAVED_ADDRESS_KEY = 'craftyoursole_saved_address';
const SAVED_SIZES_KEY = 'craftyoursole_user_sizes';
const AVAILABLE_SIZES = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'];
const WIDTH_OPTIONS = ['Standard Indian Wide', 'Slim Fit', 'Extra Broad / High Arch'];

export function ProfilePage({ onBackToHome, onNavigateToCart }: ProfilePageProps = {}) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const handleHome = onBackToHome || (() => navigate('/'));
  const handleCart = onNavigateToCart || (() => navigate('/cart'));

  const activeTab: TabType = useMemo(() => {
    const tab = searchParams.get('tab') as TabType;
    if (['orders', 'wishlist', 'addresses', 'sizes', 'wallet', 'settings'].includes(tab)) {
      return tab;
    }
    return 'orders';
  }, [searchParams]);

  const setActiveTab = (tab: TabType) => {
    setSearchParams({ tab });
  };

  const [copiedReferral, setCopiedReferral] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [bagFeedback, setBagFeedback] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { orders } = useOrders();
  const { currentUser, signInWithGoogle, logOut } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Address state
  const [savedAddress, setSavedAddress] = useState<SavedAddress | null>(() => {
    try {
      const stored = localStorage.getItem(SAVED_ADDRESS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return null;
  });

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState<SavedAddress>(() => ({
    fullName: currentUser?.displayName || '',
    phone: '',
    email: currentUser?.email || '',
    street: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '',
  }));

  // Fit Profile state
  const [fitProfile, setFitProfile] = useState<FitProfile>(() => {
    try {
      const stored = localStorage.getItem(SAVED_SIZES_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return {
      size: 'UK 8',
      footWidth: 'Standard Indian Wide',
      footLengthCm: '26.5',
    };
  });
  const [fitSavedToast, setFitSavedToast] = useState(false);

  const [notificationSettings, setNotificationSettings] = useState({
    whatsapp: true,
    sms: true,
    email: false,
    dropAlerts: true,
  });

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({
    fullName: currentUser?.displayName || savedAddress?.fullName || '',
    phone: savedAddress?.phone || '',
    email: currentUser?.email || savedAddress?.email || '',
  });

  const referralCode = currentUser?.displayName
    ? `CYS-${currentUser.displayName.split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5)}300`
    : 'CYS-SOLE300';

  const handleCopyReferral = () => {
    navigator.clipboard?.writeText(referralCode);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
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

  const handleMoveToBag = (item: WishlistItem) => {
    const cleanPrice = typeof item.price === 'number'
      ? item.price
      : parseInt(String(item.price).replace(/[^0-9]/g, ''), 10) || 2995;
    const cleanOriginalPrice = item.originalPrice
      ? (typeof item.originalPrice === 'number'
          ? item.originalPrice
          : parseInt(String(item.originalPrice).replace(/[^0-9]/g, ''), 10))
      : cleanPrice + 1000;
    const itemSize = item.size || fitProfile.size || 'UK 8';
    const productId = String(item.id);

    addToCart({
      id: `${productId}-${itemSize}`,
      productId,
      name: item.name,
      category: item.category,
      price: cleanPrice,
      originalPrice: cleanOriginalPrice,
      size: itemSize,
      img: item.img,
    });

    removeFromWishlist(item.id);
    setBagFeedback(`✓ ${item.name} moved to your Shopping Bag!`);
    setTimeout(() => setBagFeedback(null), 3000);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.fullName || !addressForm.phone || !addressForm.street || !addressForm.pincode) {
      return;
    }
    setSavedAddress(addressForm);
    localStorage.setItem(SAVED_ADDRESS_KEY, JSON.stringify(addressForm));
    setIsAddingAddress(false);
  };

  const handleDeleteAddress = () => {
    setSavedAddress(null);
    localStorage.removeItem(SAVED_ADDRESS_KEY);
  };

  const handleUpdateFitProfile = (updates: Partial<FitProfile>) => {
    setFitProfile((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem(SAVED_SIZES_KEY, JSON.stringify(next));
      return next;
    });
    setFitSavedToast(true);
    setTimeout(() => setFitSavedToast(false), 2000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  const tabs: { id: TabType; label: string; icon: IconName; count?: number }[] = [
    { id: 'orders', label: 'My Orders', icon: 'package', count: orders.length },
    { id: 'wishlist', label: 'Wishlist', icon: 'favorite', count: wishlist.length },
    { id: 'addresses', label: 'Saved Addresses', icon: 'map_pin', count: savedAddress ? 1 : 0 },
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
                      : 'CYS'}
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
                        CraftYourSole Member
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
                <span className="font-anton text-xl md:text-2xl text-gray-900">{orders.length}</span>
              </div>
              <div className="text-center sm:text-left">
                <span className="text-[11px] text-gray-500 block uppercase font-medium">Wallet</span>
                <span className="font-anton text-xl md:text-2xl text-primary">₹0</span>
              </div>
              <div className="text-center sm:text-left">
                <span className="text-[11px] text-gray-500 block uppercase font-medium">Size</span>
                <span className="font-anton text-xl md:text-2xl text-gray-900">{fitProfile.size}</span>
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

                {orders.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                    <Icon name="package" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="font-bold text-gray-900 text-base">No Orders Placed Yet</h3>
                    <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                      Explore our handcrafted festive juttis, leather loafers, and daily comfort footwear to place your first order.
                    </p>
                    <button
                      onClick={handleHome}
                      className="mt-4 bg-primary text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-[#8A2600] transition-colors cursor-pointer"
                    >
                      Explore Footwear
                    </button>
                  </div>
                ) : (
                  orders.map((ord) => (
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
                      </div>
                    </div>
                  ))
                )}
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
                      {wishlist.length} footwear pair{wishlist.length === 1 ? '' : 's'} saved for later
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

                {wishlist.length === 0 ? (
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
                    {wishlist.map((item) => (
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
                            {item.size && (
                              <span className="text-xs text-gray-500">Saved Size: {item.size}</span>
                            )}
                            <div className="flex items-baseline gap-2 mt-1">
                              <span className="font-bold text-gray-900 text-sm">
                                {typeof item.price === 'number' ? `₹${item.price.toLocaleString('en-IN')}` : item.price}
                              </span>
                              {item.originalPrice && (
                                <span className="text-xs text-gray-400 line-through">
                                  {typeof item.originalPrice === 'number' ? `₹${item.originalPrice.toLocaleString('en-IN')}` : item.originalPrice}
                                </span>
                              )}
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
                              onClick={() => removeFromWishlist(item.id)}
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
                  {!isAddingAddress && (
                    <button
                      onClick={() => setIsAddingAddress(true)}
                      className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#8A2600] transition-colors cursor-pointer"
                    >
                      + Add New Address
                    </button>
                  )}
                </div>

                {/* Add / Edit Address Form */}
                {isAddingAddress && (
                  <form onSubmit={handleSaveAddress} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs mb-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <h4 className="font-bold text-gray-900 text-sm">Add New Delivery Address</h4>
                      <button
                        type="button"
                        onClick={() => setIsAddingAddress(false)}
                        className="text-xs text-gray-400 hover:text-gray-600 font-bold"
                      >
                        ✕ Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={addressForm.fullName}
                          onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full h-10 px-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">Phone Number (10 digits)</label>
                        <input
                          type="tel"
                          required
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          placeholder="e.g. 9876543210"
                          className="w-full h-10 px-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Street Address / House / Flat No.</label>
                      <input
                        type="text"
                        required
                        value={addressForm.street}
                        onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                        placeholder="e.g. Flat 301, Sunshine Heights, 5th Cross"
                        className="w-full h-10 px-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">City</label>
                        <input
                          type="text"
                          required
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          placeholder="e.g. Bengaluru"
                          className="w-full h-10 px-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">State</label>
                        <input
                          type="text"
                          required
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                          placeholder="e.g. Karnataka"
                          className="w-full h-10 px-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">PIN Code (6 digits)</label>
                        <input
                          type="text"
                          required
                          value={addressForm.pincode}
                          onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                          placeholder="e.g. 560038"
                          className="w-full h-10 px-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingAddress(false)}
                        className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 text-xs font-bold text-white bg-primary hover:bg-[#8A2600] rounded-xl shadow-xs"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                )}

                {savedAddress ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl border-2 border-primary/40 p-5 shadow-xs relative">
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                          Default Delivery Address
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setAddressForm(savedAddress);
                              setIsAddingAddress(true);
                            }}
                            className="text-xs text-gray-500 hover:text-primary font-semibold cursor-pointer"
                          >
                            Edit
                          </button>
                          <span className="text-gray-300">•</span>
                          <button
                            onClick={handleDeleteAddress}
                            className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm">{savedAddress.fullName}</h4>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        {savedAddress.street}
                      </p>
                      <p className="text-xs text-gray-600 font-medium mt-0.5">
                        {savedAddress.city}, {savedAddress.state} - {savedAddress.pincode}
                      </p>
                      <p className="text-xs text-gray-500 mt-2 font-medium">
                        Phone: +91 {savedAddress.phone}
                      </p>
                    </div>
                  </div>
                ) : (
                  !isAddingAddress && (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                      <Icon name="map_pin" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="font-bold text-gray-900 text-base">No Saved Addresses Yet</h3>
                      <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                        Save your home or work delivery address for faster 1-click checkout.
                      </p>
                      <button
                        onClick={() => setIsAddingAddress(true)}
                        className="mt-4 bg-primary text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-[#8A2600] transition-colors cursor-pointer"
                      >
                        + Add Delivery Address
                      </button>
                    </div>
                  )
                )}
              </div>
            )}

            {/* TAB 4: SIZES & FIT */}
            {activeTab === 'sizes' && (
              <div>
                <div className="mb-4">
                  <h2 className="font-anton text-xl md:text-2xl text-gray-900 uppercase tracking-wide">
                    My Footwear Size & Fit Profile
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Save your personal size preferences to get instant fit recommendations across our collections.
                  </p>
                </div>

                {fitSavedToast && (
                  <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
                    <Icon name="check" className="w-4 h-4 text-green-600" />
                    <span>Fit profile saved successfully!</span>
                  </div>
                )}

                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs mb-6 space-y-6">
                  {/* Preferred Size */}
                  <div>
                    <label className="text-xs font-bold text-gray-900 block mb-2 uppercase tracking-wider">
                      Preferred Footwear Size (Indian / UK Standard)
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {AVAILABLE_SIZES.map((size) => (
                        <button
                          key={size}
                          onClick={() => handleUpdateFitProfile({ size })}
                          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                            fitProfile.size === size
                              ? 'bg-primary text-white shadow-sm ring-2 ring-primary/30'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Foot Width */}
                  <div>
                    <label className="text-xs font-bold text-gray-900 block mb-2 uppercase tracking-wider">
                      Foot Width & Arch Profile
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {WIDTH_OPTIONS.map((w) => (
                        <button
                          key={w}
                          onClick={() => handleUpdateFitProfile({ footWidth: w })}
                          className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                            fitProfile.footWidth === w
                              ? 'border-primary bg-primary/5 text-primary font-bold'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-bold">{w}</div>
                          <span className="text-[10px] text-gray-500 block mt-0.5">
                            {w === 'Standard Indian Wide'
                              ? 'Widened forefoot for typical Indian foot anatomy'
                              : w === 'Slim Fit'
                              ? 'Narrow toe box & tighter arch grip'
                              : 'Accommodates broader feet & high insteps'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Approximate Foot Length */}
                  <div>
                    <label className="text-xs font-bold text-gray-900 block mb-2 uppercase tracking-wider">
                      Approximate Foot Length (cm)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={fitProfile.footLengthCm}
                        onChange={(e) => handleUpdateFitProfile({ footLengthCm: e.target.value })}
                        placeholder="e.g. 26.5"
                        className="w-32 h-10 px-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <span className="text-xs text-gray-500">Measure heel to longest toe in centimeters</span>
                    </div>
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
                      <div className="font-anton text-4xl text-white mt-1">₹0.00</div>
                      <p className="text-xs text-white/80 mt-2">
                        Equivalent to 0 SoleCoins. Auto-applied at checkout.
                      </p>
                      <button
                        onClick={handleHome}
                        className="mt-4 bg-white text-gray-900 text-xs font-bold px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        Shop Footwear to Earn
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
                        Share your unique referral code. When your friend orders their first pair of footwear, you both get ₹300 in SoleCoins.
                      </p>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-xl px-3 py-2 text-center font-mono font-bold text-gray-900 text-sm tracking-wider">
                        {referralCode}
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
                <div className="bg-white rounded-2xl border border-gray-200/80 p-8 text-center shadow-xs">
                  <Icon name="card" className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <h4 className="font-bold text-gray-900 text-sm">No Reward Transactions Yet</h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto leading-relaxed">
                    You will earn SoleCoins on every footwear purchase, verified product review, and friend referral.
                  </p>
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
                        value={settingsForm.fullName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, fullName: e.target.value })}
                        placeholder="Your full name"
                        className="w-full h-11 px-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={settingsForm.phone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                        placeholder="+91 Mobile number"
                        className="w-full h-11 px-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={settingsForm.email}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      placeholder="you@domain.com"
                      className="w-full h-11 px-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
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
