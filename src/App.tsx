import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import { LandingPage } from './routes/LandingPage';
import { ProfilePage } from './routes/ProfilePage';
import { CartPage } from './routes/CartPage';
import { ProductDetailPage } from './routes/ProductDetailPage';
import { CollectionsPage } from './routes/CollectionsPage';

const AdminPage = lazy(() =>
  import('./routes/AdminPage').then((module) => ({ default: module.AdminPage }))
);
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
import { WishlistProvider } from './context/WishlistContext';
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

function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
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
              <WishlistProvider>
                <ProductModalProvider>
                <ScrollAndHashRedirectHandler />
                <Routes>
                  {/* Admin Operations Portal (Code-Split) */}
                  <Route
                    path="/admin"
                    element={
                      <Suspense
                        fallback={
                          <div className="min-h-screen flex items-center justify-center bg-gray-50">
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Loading Admin Operations...
                              </p>
                            </div>
                          </div>
                        }
                      >
                        <AdminPage />
                      </Suspense>
                    }
                  />

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
            </WishlistProvider>
          </CartProvider>
          </OrderProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
