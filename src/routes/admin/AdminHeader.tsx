import { Icon } from '../../components/ui/Icon';
import type { AdminSection } from './adminTypes';

interface AdminHeaderProps {
  activeSection: AdminSection;
  productsCount: number;
  ordersCount: number;
  heroSlidesCount: number;
  activeHeroSlidesCount: number;
  totalRevenue: number;
  onNavigateHome: () => void;
}

export function AdminHeader({
  activeSection,
  productsCount,
  ordersCount,
  heroSlidesCount,
  activeHeroSlidesCount,
  totalRevenue,
  onNavigateHome,
}: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h1 className="text-base font-bold text-gray-900 capitalize">
          {activeSection === 'dashboard'
            ? 'Dashboard'
            : activeSection === 'catalog'
              ? 'Product Catalog'
              : activeSection === 'orders'
                ? 'Orders & Shipping'
                : 'Hero Banners & Carousel'}
        </h1>
        <p className="text-xs text-gray-400">
          {activeSection === 'dashboard' && 'Sales overview and key metrics'}
          {activeSection === 'catalog' && `${productsCount} products · manage your storefront`}
          {activeSection === 'orders' && `${ordersCount} orders total`}
          {activeSection === 'banners' && `${heroSlidesCount} banners (${activeHeroSlidesCount} live on homepage)`}
        </p>
      </div>

      {/* Quick stats */}
      <div className="flex items-center gap-4 text-xs">
        <div className="hidden md:flex items-center gap-1.5 text-gray-500">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium">Live</span>
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-[11px] text-gray-400">Gross Revenue</p>
          <p className="font-extrabold text-gray-900 text-sm">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </p>
        </div>
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-medium transition cursor-pointer"
        >
          <Icon name="arrow_left" className="w-3.5 h-3.5" />
          Storefront
        </button>
      </div>
    </header>
  );
}
