import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import { LandingPage } from './routes/LandingPage';
import { ProfilePage } from './routes/ProfilePage';
import { CartPage } from './routes/CartPage';
import { ProductDetailPage } from './routes/ProductDetailPage';
import { AdminPage } from './routes/AdminPage';
import { CollectionsPage } from './routes/CollectionsPage';
import {
  AboutPage,
  AuthenticityPage,
  ContactPage,
  PrivacyPolicyPage,
  ReturnsExchangePage,
  ShippingPolicyPage,
  SizeGuidePage,
  TermsPage,
  TrackOrderPage,
} from './routes/StorefrontInfoPages';
import { NotFoundPage } from './routes/NotFoundPage';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BottomNav } from './components/BottomNav';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { OrderProvider } from './context/OrderContext';
import { ProductModalProvider } from './context/ProductModalContext';
import { AuthProvider } from './context/AuthContext';
import { ProductDetailModal } from './components/ProductDetailModal';

export type PageRoute = 'landing' | 'profile' | 'cart';

function ScrollAndHashRedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Backward compatibility for legacy hash links: /#profile and /#cart
    if (window.location.hash === '#profile') {
      navigate('/profile', { replace: true });
    } else if (window.location.hash === '#cart') {
      navigate('/cart', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    // Scroll to top on route change unless navigating to a specific hash anchor
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return null;
}

function PreLaunchBanner() {
  return (
    <div className="bg-gray-950 text-white text-[11px] sm:text-xs py-2 px-4 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center sm:justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Pre-Launch Preview
          </span>
          <span className="text-white/85">
            CraftYourSole is in final development and opening to public shoppers soon.
          </span>
        </div>
        <Link
          to="/contact"
          className="text-amber-300 hover:text-amber-200 font-bold whitespace-nowrap transition-colors"
        >
          Early Access &amp; Inquiries →
        </Link>
      </div>
    </div>
  );
}

function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <PreLaunchBanner />
      <Navbar />
      <div className="flex-1 pb-16 md:pb-0">
        {children}
      </div>
      <Footer />
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <OrderProvider>
            <CartProvider>
              <ProductModalProvider>
                <ScrollAndHashRedirectHandler />
                <Routes>
                  {/* Admin Operations Portal */}
                  <Route path="/admin" element={<AdminPage />} />

                  {/* Customer Storefront Routes */}
                  <Route
                    path="/*"
                    element={
                      <CustomerLayout>
                        <Routes>
                          <Route path="/" element={<LandingPage />} />
                          <Route path="/collections" element={<CollectionsPage />} />
                          <Route path="/collections/:slug" element={<CollectionsPage />} />
                          <Route path="/products/:slug" element={<ProductDetailPage />} />
                          <Route path="/product/:slug" element={<ProductDetailPage />} />
                          <Route path="/about" element={<AboutPage />} />
                          <Route path="/size-guide" element={<SizeGuidePage />} />
                          <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
                          <Route path="/returns-exchange" element={<ReturnsExchangePage />} />
                          <Route path="/authenticity" element={<AuthenticityPage />} />
                          <Route path="/contact" element={<ContactPage />} />
                          <Route path="/track-order" element={<TrackOrderPage />} />
                          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                          <Route path="/terms" element={<TermsPage />} />
                          <Route path="/profile" element={<ProfilePage />} />
                          <Route path="/cart" element={<CartPage />} />
                          <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                      </CustomerLayout>
                    }
                  />
                </Routes>
                <ProductDetailModal />
              </ProductModalProvider>
            </CartProvider>
          </OrderProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
