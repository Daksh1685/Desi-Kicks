import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useProductCatalog } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { Icon } from '../components/ui/Icon';
import { SeoHead } from '../components/SeoHead';
import {
  validateCouponInSupabase,
  getActiveCouponsFromSupabase,
  isSupabaseConfigured,
} from '../lib/supabase';

interface CartPageProps {
  onContinueShopping?: () => void;
  onViewOrders?: () => void;
}

interface ShippingAddressForm {
  fullName: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

const SAVED_ADDRESS_KEY = 'craftyoursole_saved_address';

export function CartPage({ onContinueShopping, onViewOrders }: CartPageProps = {}) {
  const navigate = useNavigate();
  const handleContinueShopping = onContinueShopping || (() => navigate('/'));
  const handleViewOrders = onViewOrders || (() => navigate('/profile'));
  const { currentUser, signInWithGoogle } = useAuth();
  const [isCheckoutSigningIn, setIsCheckoutSigningIn] = useState(false);
  const [checkoutAuthError, setCheckoutAuthError] = useState<string | null>(null);

  const handleGoogleSignInCheckout = async () => {
    try {
      setIsCheckoutSigningIn(true);
      setCheckoutAuthError(null);
      await signInWithGoogle();
      // Read saved address if exists in storage
      const saved = localStorage.getItem(SAVED_ADDRESS_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setAddressForm((prev) => ({ ...prev, ...parsed }));
        } catch {
          // ignore
        }
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : 'Google sign-in could not be completed.';
      setCheckoutAuthError(errorMsg);
    } finally {
      setIsCheckoutSigningIn(false);
    }
  };
  const { checkStockAvailability, deductVariantStock } = useProductCatalog();
  const {
    cartItems,
    updateQuantity,
    updateSize,
    removeFromCart,
    clearCart,
    totalItemsCount,
    subtotal,
    totalMrp,
    totalSavings,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [useWalletCoins, setUseWalletCoins] = useState(false);
  const [addCareKit, setAddCareKit] = useState(false);

  // Checkout modal states
  const { createOrder } = useOrders();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<'upi' | 'cod' | 'card'>('upi');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState<string>('CYS-2026-9852');
  const [stockError, setStockError] = useState<string>('');
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});

  // Shipping Address Form state pre-filled from storage or auth
  const [addressForm, setAddressForm] = useState<ShippingAddressForm>(() => {
    let savedData: Partial<ShippingAddressForm> = {};
    try {
      const saved = localStorage.getItem(SAVED_ADDRESS_KEY);
      if (saved) {
        savedData = JSON.parse(saved) || {};
      }
    } catch {
      // ignore
    }
    return {
      fullName: savedData.fullName || currentUser?.displayName || '',
      phone: savedData.phone || '',
      email: savedData.email || currentUser?.email || '',
      street: savedData.street || '',
      city: savedData.city || '',
      state: savedData.state || '',
      pincode: savedData.pincode || '',
    };
  });

  const [estimatedDeliveryDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return `${d.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })} (2-3 Days)`;
  });

  const DEFAULT_COUPONS = [
    { code: 'FESTIVE500', label: '₹500 OFF (Min ₹2,500)' },
    { code: 'SOLEFIRST', label: '10% OFF (Min ₹1,500)' },
    { code: 'WELCOME10', label: '10% OFF (Min ₹999)' },
    { code: 'FESTIVE20', label: '20% OFF (Min ₹2,000)' },
  ];

  const [availableCoupons, setAvailableCoupons] = useState(DEFAULT_COUPONS);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (isSupabaseConfigured) {
      getActiveCouponsFromSupabase()
        .then((coupons) => {
          if (mounted && coupons && coupons.length > 0) {
            setAvailableCoupons(coupons);
          }
        })
        .catch(() => {
          // Keep defaults
        });
    }
    return () => {
      mounted = false;
    };
  }, []);

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    if (!code) return;

    setIsValidatingCoupon(true);
    setCouponError('');

    try {
      if (isSupabaseConfigured) {
        const result = await validateCouponInSupabase(code, subtotal);
        if (result.valid) {
          setAppliedCoupon({ code, discount: result.discountAmount });
          setCouponError('');
          setCouponCode('');
          return;
        } else if (result.message && !result.message.includes('not connected')) {
          setCouponError(result.message);
          return;
        }
      }

      // Offline / fallback coupon rules
      if (code === 'FESTIVE500') {
        if (subtotal < 2500) {
          setCouponError('Requires minimum order of ₹2,500');
        } else {
          setAppliedCoupon({ code: 'FESTIVE500', discount: 500 });
          setCouponError('');
          setCouponCode('');
        }
      } else if (code === 'SOLEFIRST' || code === 'DESIFIRST') {
        if (subtotal < 1500) {
          setCouponError('Requires minimum order of ₹1,500');
        } else {
          setAppliedCoupon({ code: 'SOLEFIRST', discount: Math.round(subtotal * 0.1) });
          setCouponError('');
          setCouponCode('');
        }
      } else if (code === 'WELCOME10') {
        if (subtotal < 999) {
          setCouponError('Requires minimum order of ₹999');
        } else {
          setAppliedCoupon({ code: 'WELCOME10', discount: Math.round(subtotal * 0.1) });
          setCouponError('');
          setCouponCode('');
        }
      } else if (code === 'FESTIVE20') {
        if (subtotal < 2000) {
          setCouponError('Requires minimum order of ₹2,000');
        } else {
          setAppliedCoupon({ code: 'FESTIVE20', discount: Math.round(subtotal * 0.2) });
          setCouponError('');
          setCouponCode('');
        }
      } else if (code === 'DIWALI500') {
        if (subtotal < 3000) {
          setCouponError('Requires minimum order of ₹3,000');
        } else {
          setAppliedCoupon({ code: 'DIWALI500', discount: 500 });
          setCouponError('');
          setCouponCode('');
        }
      } else {
        setCouponError(`Invalid coupon code "${code}". Try FESTIVE500, SOLEFIRST or WELCOME10.`);
      }
    } catch {
      setCouponError('Error verifying coupon. Please try again.');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  const careKitPrice = addCareKit ? 299 : 0;
  const walletCoinsDiscount = useWalletCoins ? 250 : 0;
  const couponDiscount = appliedCoupon
    ? appliedCoupon.code === 'SOLEFIRST'
      ? Math.round(subtotal * 0.1)
      : appliedCoupon.discount
    : 0;
  const finalTotal = Math.max(0, subtotal + careKitPrice - couponDiscount - walletCoinsDiscount);
  const totalSavedWithCoupons = totalSavings + couponDiscount + walletCoinsDiscount + (addCareKit ? 200 : 0);

  const handlePlaceOrder = () => {
    setStockError('');
    const errors: Record<string, string> = {};

    if (!addressForm.fullName.trim() || addressForm.fullName.trim().length < 2) {
      errors.fullName = 'Please enter customer full name';
    }

    const cleanPhone = addressForm.phone.replace(/[^0-9]/g, '');
    const phoneValid = cleanPhone.length === 10 && /^[6-9]/.test(cleanPhone);
    if (!phoneValid) {
      errors.phone = 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210)';
    }

    if (!addressForm.email.trim() || !addressForm.email.includes('@')) {
      errors.email = 'Please enter a valid email for order updates';
    }

    if (!addressForm.street.trim() || addressForm.street.trim().length < 5) {
      errors.street = 'Please provide complete flat/house/street address';
    }

    if (!addressForm.city.trim()) {
      errors.city = 'Please enter city name';
    }

    if (!addressForm.state.trim()) {
      errors.state = 'Please enter state';
    }

    const pincodeValid = /^\d{6}$/.test(addressForm.pincode.trim());
    if (!pincodeValid) {
      errors.pincode = 'Please enter a valid 6-digit Indian PIN code';
    }

    if (Object.keys(errors).length > 0) {
      setAddressErrors(errors);
      return;
    }
    setAddressErrors({});

    // Validate inventory stock across items
    const itemsToCheck = cartItems.map((item) => ({
      productId: item.productId || item.id.split('-')[0],
      size: item.size,
      quantity: item.quantity,
    }));

    const stockCheck = checkStockAvailability(itemsToCheck);
    if (!stockCheck.available) {
      setStockError(stockCheck.errorItem || 'One or more items in your cart are currently out of stock.');
      return;
    }

    // Deduct stock from variant inventory
    deductVariantStock(itemsToCheck);

    const methodMap = {
      upi: 'UPI' as const,
      cod: 'COD' as const,
      card: 'Card' as const,
    };
    const paymentMethod = methodMap[selectedPayment] || 'UPI';

    const orderItems = cartItems.map((item) => ({
      id: item.id,
      productId: item.productId || item.id.split('-')[0],
      productName: item.name,
      size: item.size,
      price: item.price,
      quantity: item.quantity,
      img: item.img,
    }));

    const shippingAddress = {
      street: addressForm.street.trim(),
      city: addressForm.city.trim(),
      state: addressForm.state.trim(),
      pincode: addressForm.pincode.trim(),
    };

    const newOrder = createOrder({
      customerName: addressForm.fullName.trim(),
      customerEmail: addressForm.email.trim(),
      customerPhone: cleanPhone.startsWith('+91') ? cleanPhone : `+91 ${cleanPhone}`,
      shippingAddress,
      items: orderItems,
      subtotal,
      discount: couponDiscount + walletCoinsDiscount,
      shippingFee: 0,
      totalAmount: finalTotal,
      paymentMethod,
    });

    // Save address for future orders
    try {
      localStorage.setItem(SAVED_ADDRESS_KEY, JSON.stringify(addressForm));
    } catch {
      // ignore
    }

    setPlacedOrderNumber(newOrder.orderNumber);
    setOrderPlaced(true);
    clearCart();
  };

  const seo = (
    <SeoHead
      title="Shopping Bag | CraftYourSole"
      description="Review your CraftYourSole footwear shopping bag and proceed to checkout."
      canonicalPath="/cart"
      noindex
    />
  );

  if (orderPlaced) {
    return (
      <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-4 py-16">
        {seo}
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-200/80 shadow-lg text-center animate-fade-in">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
            <Icon name="check" className="w-10 h-10 stroke-[3]" />
          </div>

          <span className="text-primary font-bold text-xs uppercase tracking-widest">
            CraftYourSole Official Order
          </span>
          <h2 className="font-anton text-2xl md:text-3xl text-gray-900 mt-1 uppercase">
            Order Confirmed!
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
            Thank you, <strong className="text-gray-900">{addressForm.fullName}</strong>! Order{' '}
            <span className="font-bold text-gray-900">#{placedOrderNumber}</span> is placed and
            assigned to fulfillment.
          </p>

          <div className="bg-orange-50/80 border border-orange-200/80 rounded-2xl p-4 my-6 text-left text-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Estimated Delivery:</span>
              <span className="font-bold text-gray-900">{estimatedDeliveryDate}</span>
            </div>
            <div>
              <span className="text-gray-500 font-medium block">Shipping Destination:</span>
              <span className="font-bold text-gray-900 block mt-0.5 leading-snug">
                {addressForm.street}, {addressForm.city}, {addressForm.state} - {addressForm.pincode}
              </span>
              <span className="text-gray-500 text-[11px] block mt-0.5">
                Contact: {addressForm.phone} • {addressForm.email}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-orange-200/60">
              <span className="text-gray-500 font-medium">Payment Mode:</span>
              <span className="font-bold text-emerald-700 uppercase">
                {selectedPayment === 'upi'
                  ? 'UPI (Google Pay/PhonePe)'
                  : selectedPayment === 'cod'
                  ? 'Cash on Delivery (COD)'
                  : 'Credit / Debit Card'}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleViewOrders}
              className="w-full bg-primary hover:bg-[#8A2600] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer"
            >
              Track Order in Profile →
            </button>
            <button
              onClick={handleContinueShopping}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[65vh] bg-gray-50 flex items-center justify-center px-4 py-16">
        {seo}
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-200 text-center shadow-xs">
          <div className="w-16 h-16 bg-orange-100 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon name="shopping_bag" className="w-8 h-8" />
          </div>
          <h2 className="font-anton text-2xl text-gray-900 uppercase">Your Cart is Empty</h2>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            Looks like you haven't added any pairs yet. Explore festive Juttis, daily comfort loafers, or athletic runners.
          </p>
          <button
            onClick={handleContinueShopping}
            className="mt-6 bg-primary hover:bg-[#8A2600] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
          >
            Explore Footwear Collections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-12">
      {seo}
      {/* Top Breadcrumb Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <button
            onClick={handleContinueShopping}
            className="flex items-center gap-2 text-xs md:text-sm font-semibold text-gray-700 hover:text-primary transition-colors cursor-pointer"
          >
            <Icon name="arrow_left" className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Home</span>
            <span>/</span>
            <span className="text-gray-900 font-semibold">Shopping Cart</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="mb-5 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse mt-1.5 shrink-0" />
          <p className="text-xs text-amber-950 leading-relaxed">
            <strong className="font-bold">Pre-Launch Checkout Preview:</strong> CraftYourSole is
            completing payment gateway and courier integrations ahead of public launch. Bag and
            checkout actions below run in simulated preview mode — no real payment is charged.
          </p>
        </div>

        <div className="flex items-baseline justify-between mb-6">
          <h1 className="font-anton text-2xl md:text-3xl text-gray-900 uppercase tracking-wide">
            Shopping Cart ({totalItemsCount} {totalItemsCount === 1 ? 'Pair' : 'Pairs'})
          </h1>
          <button
            onClick={clearCart}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
          >
            Clear Bag
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: Items List (8 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            {/* Free Delivery Milestone */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <Icon name="truck" className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs md:text-sm font-bold text-emerald-950">
                  🎉 Free Pan-India Express Delivery Unlocked!
                </h4>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Delivered straight to your doorstep with 100% free doorstep size exchange within 36 hours of delivery (Exchange-only policy).
                </p>
              </div>
            </div>

            {/* Cart Items Cards */}
            <div className="space-y-3.5">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row gap-4 relative group"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full sm:w-28 h-36 sm:h-28 object-cover rounded-xl border border-gray-100 shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                            {item.category}
                          </span>
                          <h3 className="font-bold text-gray-900 text-sm md:text-base leading-tight mt-0.5">
                            {item.name}
                          </h3>
                          {item.color && (
                            <span className="text-xs text-gray-500 block mt-0.5">
                              Color: {item.color}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Icon name="trash" className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Size Selector & Quantity Controls */}
                      <div className="flex flex-wrap items-center gap-4 mt-3">
                        {/* Size Picker */}
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-gray-500 font-medium">Size:</span>
                          <select
                            value={item.size}
                            onChange={(e) => updateSize(item.id, e.target.value)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-2 py-1 rounded-lg text-xs border-none focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                          >
                            <option value="UK 5">UK 5</option>
                            <option value="UK 6">UK 6</option>
                            <option value="UK 7">UK 7</option>
                            <option value="UK 8">UK 8</option>
                            <option value="UK 9">UK 9</option>
                            <option value="UK 10">UK 10</option>
                            <option value="UK 11">UK 11</option>
                          </select>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-7 h-7 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
                            title="Decrease Quantity"
                          >
                            <Icon name="minus" className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-7 h-7 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
                            title="Increase Quantity"
                          >
                            <Icon name="plus" className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Price and Savings Callout */}
                    <div className="flex items-baseline justify-between mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-gray-900 text-base md:text-lg">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          ₹{(item.originalPrice * item.quantity).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] text-green-600 font-bold">
                          Save ₹{((item.originalPrice - item.price) * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-400">36-Hr Free Size Exchange</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Optional Upsell: Footwear Stain Guard */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-primary flex items-center justify-center shrink-0">
                  <Icon name="shield" className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs md:text-sm font-bold text-gray-900">
                    CraftYourSole Water &amp; Stain Protect Spray
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    Keeps festive velvet & everyday shoes spotless • ₹299{' '}
                    <span className="line-through text-gray-400">₹499</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAddCareKit(!addCareKit)}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0 ${
                  addCareKit
                    ? 'bg-green-600 text-white shadow-xs'
                    : 'bg-primary/10 text-primary hover:bg-primary hover:text-white border border-primary/20'
                }`}
              >
                {addCareKit ? '✓ Added' : '+ Add ₹299'}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Order Summary & Checkout (4-5 cols) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-4">
            {/* Coupons Card */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="tag" className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">
                  Apply Coupons & Discounts
                </h3>
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-200">
                  <div>
                    <span className="font-mono font-bold text-green-800 text-xs">
                      {appliedCoupon.code}
                    </span>
                    <p className="text-[11px] text-green-700 mt-0.5">
                      ✓ ₹{appliedCoupon.discount} discount applied!
                    </p>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-xs text-red-600 font-bold hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter Coupon (e.g. FESTIVE500)"
                      className="flex-1 min-w-0 h-10 px-3 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                    />
                    <button
                      onClick={() => handleApplyCoupon()}
                      disabled={isValidatingCoupon}
                      className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-4 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isValidatingCoupon ? 'Verifying...' : 'Apply'}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-red-500 text-[11px] mt-1.5">{couponError}</p>
                  )}

                  {/* Quick coupon recommendation pills */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {availableCoupons.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => handleApplyCoupon(c.code)}
                        className="text-[10px] font-bold bg-primary/5 hover:bg-primary/15 text-primary border border-primary/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        {c.code} ({c.label})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* CraftYourSole Club Wallet Checkbox */}
              <div className="mt-4 pt-3.5 border-t border-gray-100">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useWalletCoins}
                    onChange={(e) => setUseWalletCoins(e.target.checked)}
                    className="w-4 h-4 text-primary rounded accent-primary mt-0.5"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-gray-900 block">
                      Redeem 250 SoleCoins (Save ₹250)
                    </span>
                    <span className="text-gray-500 text-[11px]">
                      Available Balance: 1,250 Coins
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Bill Details Summary Card */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 md:p-6 shadow-xs">
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-4">
                Price Breakdown
              </h3>

              <div className="space-y-2.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Total MRP ({totalItemsCount} items)</span>
                  <span className="text-gray-900 font-medium">
                    ₹{totalMrp.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between text-green-600">
                  <span>Product Discount</span>
                  <span>-₹{totalSavings.toLocaleString('en-IN')}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span>-₹{appliedCoupon.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {useWalletCoins && (
                  <div className="flex justify-between text-green-600">
                    <span>SoleCoins Redeemed</span>
                    <span>-₹250</span>
                  </div>
                )}

                {addCareKit && (
                  <div className="flex justify-between text-gray-700">
                    <span>Footwear Protect Spray</span>
                    <span>₹299</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span>Delivery Charges</span>
                  <span className="text-green-600 font-bold uppercase">Free</span>
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline text-sm md:text-base font-bold text-gray-900">
                  <span>Total Amount</span>
                  <span className="text-primary text-xl font-anton">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Total Savings Callout */}
              <div className="mt-4 p-2.5 rounded-xl bg-green-50 border border-green-200 text-center">
                <span className="text-xs font-bold text-green-700">
                  🎉 You are saving ₹{totalSavedWithCoupons.toLocaleString('en-IN')} on this order!
                </span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => setIsCheckingOut(true)}
                className="w-full mt-5 bg-primary hover:bg-[#8A2600] active:scale-98 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md hover:shadow-primary/30 cursor-pointer"
              >
                Proceed to Checkout →
              </button>

              {/* Trust Badges under checkout */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-around text-[10px] text-gray-500 font-medium">
                <span className="flex items-center gap-1">🔒 256-bit Secure</span>
                <span>•</span>
                <span className="flex items-center gap-1">🔄 36-Hr Exchange Only</span>
                <span>•</span>
                <span className="flex items-center gap-1">🇮🇳 COD Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHECKOUT MODAL OVERLAY */}
      {isCheckingOut && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-lg w-full bg-white rounded-3xl p-6 md:p-8 shadow-2xl relative my-8 animate-fade-in max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsCheckingOut(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-900 p-1 text-sm font-bold cursor-pointer"
            >
              ✕
            </button>

            <span className="text-primary font-bold text-xs uppercase tracking-wider">
              CraftYourSole Express Checkout
            </span>
            <h2 className="font-anton text-2xl text-gray-900 mt-1 uppercase">
              Shipping Address &amp; Payment
            </h2>
            <p className="text-[11px] text-gray-500 mt-1">
              Enter your destination details for fast insured delivery across India.
            </p>

            {/* Stock Error Notification */}
            {stockError && (
              <div className="mt-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-center gap-2">
                <span>⚠️</span>
                <span>{stockError}</span>
              </div>
            )}

            {/* Google Sign In Banner for 1-Click Checkout */}
            {!currentUser ? (
              <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-orange-50/80 to-amber-50/80 border border-orange-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div>
                  <h4 className="text-xs font-bold text-gray-900">
                    Fast 1-Click Checkout with Google
                  </h4>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    Sign in to auto-fill your delivery address and sync this order with live tracking.
                  </p>
                  {checkoutAuthError && (
                    <p className="text-[11px] text-red-600 font-medium mt-1">
                      ⚠️ {checkoutAuthError}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleGoogleSignInCheckout}
                  disabled={isCheckoutSigningIn}
                  className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 active:scale-95 text-gray-800 text-xs font-bold px-4 py-2.5 rounded-xl border border-gray-300 shadow-xs transition-all cursor-pointer shrink-0 disabled:opacity-60"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                  <span>{isCheckoutSigningIn ? 'Connecting...' : 'Sign in with Google'}</span>
                </button>
              </div>
            ) : (
              <div className="mt-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Icon name="check" className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-emerald-950">
                    Signed in as <strong>{currentUser.displayName || currentUser.email}</strong>
                  </span>
                </div>
              </div>
            )}

            {/* Delivery Address Form */}
            <div className="mt-5 space-y-3">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                1. Customer &amp; Shipping Details
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arjun Sharma"
                    value={addressForm.fullName}
                    onChange={(e) => {
                      setAddressForm({ ...addressForm, fullName: e.target.value });
                      if (addressErrors.fullName) {
                        setAddressErrors({ ...addressErrors, fullName: '' });
                      }
                    }}
                    className={`w-full bg-gray-50 border rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-primary ${
                      addressErrors.fullName ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                    }`}
                  />
                  {addressErrors.fullName && (
                    <span className="text-[10px] text-red-500 mt-0.5 block font-semibold">
                      {addressErrors.fullName}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="9876543210"
                      value={addressForm.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setAddressForm({ ...addressForm, phone: val });
                        if (addressErrors.phone) {
                          setAddressErrors({ ...addressErrors, phone: '' });
                        }
                      }}
                      className={`w-full bg-gray-50 border rounded-xl pl-11 pr-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-primary ${
                        addressErrors.phone ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {addressErrors.phone && (
                    <span className="text-[10px] text-red-500 mt-0.5 block font-semibold">
                      {addressErrors.phone}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="arjun@example.com"
                    value={addressForm.email}
                    onChange={(e) => {
                      setAddressForm({ ...addressForm, email: e.target.value });
                      if (addressErrors.email) {
                        setAddressErrors({ ...addressErrors, email: '' });
                      }
                    }}
                    className={`w-full bg-gray-50 border rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-primary ${
                      addressErrors.email ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                    }`}
                  />
                  {addressErrors.email && (
                    <span className="text-[10px] text-red-500 mt-0.5 block font-semibold">
                      {addressErrors.email}
                    </span>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Flat / House No., Apartment, Street *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flat 402, Lotus Heights, 100ft Road"
                    value={addressForm.street}
                    onChange={(e) => {
                      setAddressForm({ ...addressForm, street: e.target.value });
                      if (addressErrors.street) {
                        setAddressErrors({ ...addressErrors, street: '' });
                      }
                    }}
                    className={`w-full bg-gray-50 border rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-primary ${
                      addressErrors.street ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                    }`}
                  />
                  {addressErrors.street && (
                    <span className="text-[10px] text-red-500 mt-0.5 block font-semibold">
                      {addressErrors.street}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bengaluru"
                    value={addressForm.city}
                    onChange={(e) => {
                      setAddressForm({ ...addressForm, city: e.target.value });
                      if (addressErrors.city) {
                        setAddressErrors({ ...addressErrors, city: '' });
                      }
                    }}
                    className={`w-full bg-gray-50 border rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-primary ${
                      addressErrors.city ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                    }`}
                  />
                  {addressErrors.city && (
                    <span className="text-[10px] text-red-500 mt-0.5 block font-semibold">
                      {addressErrors.city}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Karnataka"
                    value={addressForm.state}
                    onChange={(e) => {
                      setAddressForm({ ...addressForm, state: e.target.value });
                      if (addressErrors.state) {
                        setAddressErrors({ ...addressErrors, state: '' });
                      }
                    }}
                    className={`w-full bg-gray-50 border rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-primary ${
                      addressErrors.state ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                    }`}
                  />
                  {addressErrors.state && (
                    <span className="text-[10px] text-red-500 mt-0.5 block font-semibold">
                      {addressErrors.state}
                    </span>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    PIN Code (6 Digits) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 560038"
                    value={addressForm.pincode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setAddressForm({ ...addressForm, pincode: val });
                      if (addressErrors.pincode) {
                        setAddressErrors({ ...addressErrors, pincode: '' });
                      }
                    }}
                    className={`w-full bg-gray-50 border rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-primary ${
                      addressErrors.pincode ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                    }`}
                  />
                  {addressErrors.pincode && (
                    <span className="text-[10px] text-red-500 mt-0.5 block font-semibold">
                      {addressErrors.pincode}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method Choice */}
            <div className="mt-5">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                2. Select Payment Method
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPayment('upi')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedPayment === 'upi'
                      ? 'border-primary bg-primary/5 text-primary font-bold shadow-xs'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xs block font-bold">UPI</span>
                  <span className="text-[10px] text-gray-500 block">GPay / PhonePe</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPayment('cod')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedPayment === 'cod'
                      ? 'border-primary bg-primary/5 text-primary font-bold shadow-xs'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xs block font-bold">COD</span>
                  <span className="text-[10px] text-gray-500 block">Cash on Delivery</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPayment('card')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedPayment === 'card'
                      ? 'border-primary bg-primary/5 text-primary font-bold shadow-xs'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xs block font-bold">Card</span>
                  <span className="text-[10px] text-gray-500 block">Debit / Credit</span>
                </button>
              </div>
            </div>

            {/* Final Pay CTA */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-gray-500 block">Amount to Pay</span>
                <span className="font-anton text-2xl text-primary">
                  ₹{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="bg-primary hover:bg-[#8A2600] active:scale-95 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-lg transition-all cursor-pointer"
              >
                Place Footwear Order ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
