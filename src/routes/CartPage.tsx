import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { Icon } from '../components/ui/Icon';
import { SeoHead } from '../components/SeoHead';

interface CartPageProps {
  onContinueShopping?: () => void;
  onViewOrders?: () => void;
}

export function CartPage({ onContinueShopping, onViewOrders }: CartPageProps = {}) {
  const navigate = useNavigate();
  const handleContinueShopping = onContinueShopping || (() => navigate('/'));
  const handleViewOrders = onViewOrders || (() => navigate('/profile'));
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
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>({
    code: 'FESTIVE500',
    discount: 500,
  });
  const [couponError, setCouponError] = useState('');
  const [useWalletCoins, setUseWalletCoins] = useState(false);
  const [addCareKit, setAddCareKit] = useState(false);

  // Checkout modal states
  const { createOrder } = useOrders();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<'home' | 'work'>('home');
  const [selectedPayment, setSelectedPayment] = useState<'upi' | 'cod' | 'card'>('upi');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState<string>('DK-2026-9852');

  const availableCoupons = [
    { code: 'FESTIVE500', label: '₹500 OFF on Festive Footwear', discount: 500 },
    { code: 'SOLEFIRST', label: '10% OFF on First Footwear Order', discount: Math.round(subtotal * 0.1) },
  ];

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    if (!code) return;

    if (code === 'FESTIVE500') {
      setAppliedCoupon({ code: 'FESTIVE500', discount: 500 });
      setCouponError('');
      setCouponCode('');
    } else if (code === 'SOLEFIRST' || code === 'DESIFIRST') {
      setAppliedCoupon({ code, discount: Math.round(subtotal * 0.1) });
      setCouponError('');
      setCouponCode('');
    } else {
      setCouponError('Invalid coupon code. Try FESTIVE500 or SOLEFIRST.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  const careKitPrice = addCareKit ? 299 : 0;
  const walletCoinsDiscount = useWalletCoins ? 250 : 0;
  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalTotal = Math.max(0, subtotal + careKitPrice - couponDiscount - walletCoinsDiscount);
  const totalSavedWithCoupons = totalSavings + couponDiscount + walletCoinsDiscount + (addCareKit ? 200 : 0);

  const handlePlaceOrder = () => {
    const methodMap = {
      upi: 'UPI' as const,
      cod: 'COD' as const,
      card: 'Card' as const,
    };
    const paymentMethod = methodMap[selectedPayment] || 'UPI';

    const orderItems = cartItems.map((item) => ({
      id: item.id,
      productId: item.id,
      productName: item.name,
      size: item.size,
      price: item.price,
      quantity: item.quantity,
      img: item.img,
    }));

    const address =
      selectedAddress === 'home'
        ? {
            street: 'Flat 402, Shanti Vihar, HAL 2nd Stage',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560038',
          }
        : {
            street: '4th Floor, Tech Hub Tower B, Outer Ring Road',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560103',
          };

    const newOrder = createOrder({
      customerName: 'Arjun Sharma',
      customerEmail: 'arjun.sharma@gmail.com',
      customerPhone: '+91 98765 43210',
      shippingAddress: address,
      items: orderItems,
      subtotal,
      discount: couponDiscount + walletCoinsDiscount,
      shippingFee: 0,
      totalAmount: finalTotal,
      paymentMethod,
    });

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
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
            <Icon name="check" className="w-10 h-10 stroke-[3]" />
          </div>

          <span className="text-primary font-bold text-xs uppercase tracking-widest">
            Pre-Launch Order Preview
          </span>
          <h2 className="font-anton text-2xl md:text-3xl text-gray-900 mt-1 uppercase">
            Preview Recorded
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
            Simulated order <span className="font-bold text-gray-900">#{placedOrderNumber}</span> has been saved to your local preview session. Live payment processing and courier dispatch are under final development and will open at public launch.
          </p>

          <div className="bg-orange-50/80 border border-orange-200/80 rounded-2xl p-4 my-6 text-left text-xs">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-gray-500 font-medium">Estimated Delivery:</span>
              <span className="font-bold text-gray-900">Thursday, Oct 2 (2 Days)</span>
            </div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-gray-500 font-medium">Delivery Address:</span>
              <span className="font-bold text-gray-900">Indiranagar, Bengaluru</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Payment Mode:</span>
              <span className="font-bold text-green-700 uppercase">
                {selectedPayment === 'upi' ? 'UPI (Google Pay/PhonePe)' : selectedPayment === 'cod' ? 'Cash on Delivery' : 'Credit Card'}
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
                  Delivered straight to your doorstep with 100% free doorstep size exchange.
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
                      <span className="text-[11px] text-gray-400">7-Day Free Exchange</span>
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
                      className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-4 rounded-xl transition-colors cursor-pointer"
                    >
                      Apply
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
                <span className="flex items-center gap-1">🔄 7-Day Exchange</span>
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
          <div className="max-w-lg w-full bg-white rounded-3xl p-6 md:p-8 shadow-2xl relative my-8 animate-fade-in">
            <button
              onClick={() => setIsCheckingOut(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-900 p-1 text-sm font-bold cursor-pointer"
            >
              ✕
            </button>

            <span className="text-primary font-bold text-xs uppercase tracking-wider">
              Pre-Launch Preview • Simulated Checkout
            </span>
            <h2 className="font-anton text-2xl text-gray-900 mt-1 uppercase">
              Confirm Delivery &amp; Payment
            </h2>
            <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mt-2">
              Demo addresses &amp; payment options for pre-launch verification — no real charge or shipment is triggered.
            </p>

            {/* Delivery Address Choice */}
            <div className="mt-5">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                1. Select Delivery Address
              </h4>
              <div className="space-y-2">
                <label
                  onClick={() => setSelectedAddress('home')}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedAddress === 'home'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddress === 'home'}
                    onChange={() => setSelectedAddress('home')}
                    className="mt-1 text-primary accent-primary"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-gray-900 block">Home (Indiranagar)</span>
                    <span className="text-gray-600 block">
                      Flat 402, Shanti Vihar, HAL 2nd Stage, Bengaluru - 560038
                    </span>
                    <span className="text-gray-400 text-[11px]">Phone: +91 98765 43210</span>
                  </div>
                </label>

                <label
                  onClick={() => setSelectedAddress('work')}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedAddress === 'work'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddress === 'work'}
                    onChange={() => setSelectedAddress('work')}
                    className="mt-1 text-primary accent-primary"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-gray-900 block">Office (Bellandur)</span>
                    <span className="text-gray-600 block">
                      4th Floor, Tech Hub Tower B, Outer Ring Road, Bengaluru - 560103
                    </span>
                  </div>
                </label>
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
