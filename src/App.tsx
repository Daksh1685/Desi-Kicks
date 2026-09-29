import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import { LandingPage } from './routes/LandingPage';
import { ProfilePage } from './routes/ProfilePage';
import { CartPage } from './routes/CartPage';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BottomNav } from './components/BottomNav';
import { CartProvider } from './context/CartContext';
import { ProductModalProvider } from './context/ProductModalContext';
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

function Layout({ children }: { children: React.ReactNode }) {
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
      <CartProvider>
        <ProductModalProvider>
          <ScrollAndHashRedirectHandler />
          <Layout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
          <ProductDetailModal />
        </ProductModalProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;


