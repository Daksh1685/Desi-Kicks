import { Icon } from '../../components/ui/Icon';
import type { AdminSection } from './adminTypes';

interface AdminHeaderProps {
  activeSection: AdminSection;
  productsCount: number;
  ordersCount: number;
  heroSlidesCount: number;
  activeHeroSlidesCount: number;
  totalRevenue: number;
  maintenanceMode?: boolean;
  onToggleMaintenanceMode?: () => void;
  onNavigateHome: () => void;
}

export function AdminHeader({
  activeSection,
  productsCount,
  ordersCount,
  heroSlidesCount,
  activeHeroSlidesCount,
  totalRevenue,
  maintenanceMode = false,
  onToggleMaintenanceMode,
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
                : activeSection === 'returns'
                  ? 'Size Exchanges (36h Window)'
                  : activeSection === 'coupons'
                    ? 'Coupons & Promotions'
                    : activeSection === 'footer'
                      ? 'Footer & Navigation CMS'
                      : 'Hero Banners & Carousel'}
        </h1>
        <p className="text-xs text-gray-400">
          {activeSection === 'dashboard' && 'Sales overview and key metrics'}
          {activeSection === 'catalog' && `${productsCount} products · manage your storefront`}
          {activeSection === 'orders' && `${ordersCount} orders total`}
          {activeSection === 'returns' && 'Customer 36-hour size exchange requests (Exchange-only policy)'}
          {activeSection === 'coupons' && 'Manage promotional discount codes & minimum order rules'}
          {activeSection === 'banners' && `${heroSlidesCount} banners (${activeHeroSlidesCount} live on homepage)`}
          {activeSection === 'footer' && 'Live edit footer navigation, links, social profiles, and legal disclaimers'}
        </p>
      </div>

      {/* Quick stats & Maintenance Mode */}
      <div className="flex items-center gap-4 text-xs">
        {onToggleMaintenanceMode && (
          <button
            onClick={onToggleMaintenanceMode}
            title={maintenanceMode ? 'Storefront is currently locked in Maintenance Mode' : 'Storefront is Live'}
            className={`hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-bold transition cursor-pointer ${
              maintenanceMode
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                maintenanceMode ? 'bg-amber-500 animate-bounce' : 'bg-emerald-500 animate-pulse'
              }`}
            />
            <span>{maintenanceMode ? 'Maintenance Mode ON' : 'Storefront Live'}</span>
          </button>
        )}

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
